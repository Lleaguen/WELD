/**
 * WELD — Pipeline Orchestrator
 * Runs the 4-layer pipeline sequentially for every request:
 *
 * 1. Deduplication  → reuse in-flight promise if one exists
 * 2. Reactivity     → initialize/update signals
 * 3. Network        → fetch or fallback to offline cache/queue
 * 4. Validation     → safeParse with Zod (optional)
 */

import type { ZodSchema }          from 'zod'
import type { WeldSignalState }    from '../types/response.js'
import type { WeldRequestOptions } from '../types/request.js'

import { buildCacheKey }                       from '../utils/hash.js'
import { withRetry }                           from '../utils/retry.js'
import { getInflight, registerInflight }       from './deduplication.js'
import { setLoading, setSuccess, setError }    from '../signals/state.js'
import { executeFetch, isOnline }              from './network.js'
import { validate }                            from './validation.js'
import { readCache, writeCache }               from '../offline/cache.js'
import { enqueue }                             from '../offline/queue.js'

export interface PipelineInput<T> {
  method:         string
  url:            string
  options:        WeldRequestOptions
  schema?:        ZodSchema<T> | undefined
  state:          WeldSignalState<T>
  abortSignal:    AbortSignal
  defaultHeaders: Record<string, string>
}

/**
 * Executes the full WELD pipeline for a given request.
 * Returns the validated (or raw) response data.
 */
export async function runPipeline<T>(input: PipelineInput<T>): Promise<T> {
  const {
    method, url, options, schema, state, abortSignal, defaultHeaders,
  } = input

  const mergedHeaders = { ...defaultHeaders, ...options.headers }
  const cacheKey      = buildCacheKey({ method, url, query: options.query, body: options.body })
  const isGet         = method === 'GET'
  const deduplicate   = options.deduplicate ?? true

  // ── Layer 1: Deduplication ────────────────────────────────────────────────
  if (isGet && deduplicate) {
    const existing = getInflight<T>(cacheKey)
    if (existing) return existing
  }

  // ── Layer 2: Reactivity ───────────────────────────────────────────────────
  setLoading(state)

  const execute = async (): Promise<T> => {
    // ── Layer 3: Network ───────────────────────────────────────────────────
    if (!isOnline()) {
      if (isGet) {
        // Offline GET → try cache
        const cached = await readCache<T>(cacheKey)
        if (cached !== undefined) {
          const validated = validate(cached, schema)
          setSuccess(state, validated)
          return validated
        }
        throw new Error('[WELD] Offline: no cached data available for this request.')
      } else {
        // Offline mutation → enqueue for later
        await enqueue({
          method:  method as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
          url,
          body:    options.body,
          headers: mergedHeaders,
        })
        throw new Error('[WELD] Offline: mutation queued for sync when network is restored.')
      }
    }

    // Build full URL with query params
    const fullUrl = buildUrl(url, options.query)

    const raw = await withRetry(
      () => executeFetch({
        method,
        url:     fullUrl,
        headers: mergedHeaders,
        body:    options.body,
        timeout: options.timeout,
        signal:  abortSignal,
      }),
      options.retry,
    )

    // ── Layer 4: Validation ────────────────────────────────────────────────
    const data = validate<T>(raw, schema)

    // Cache successful GET responses
    if (isGet) await writeCache(cacheKey, data)

    setSuccess(state, data)
    return data
  }

  // Register promise for deduplication before awaiting
  const promise = execute().catch((err: unknown) => {
    const error = err instanceof Error ? err : new Error(String(err))
    setError(state, error)
    throw error
  })

  if (isGet && deduplicate) {
    registerInflight(cacheKey, promise)
  }

  return promise
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildUrl(
  base:   string,
  query?: Record<string, string | number | boolean>,
): string {
  if (!query || Object.keys(query).length === 0) return base

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    params.set(key, String(value))
  }

  return `${base}?${params.toString()}`
}
