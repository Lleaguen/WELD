/**
 * WELD — Main Client Class
 *
 * Usage:
 *   const api = new Weld<AppRouter>('https://api.example.com')
 *   const { signal, promise } = api.get('v1/products', ProductArraySchema)
 */

import type { ZodSchema }          from 'zod'
import type { AppRouter }          from '../types/router.js'
import type { WeldResponse }       from '../types/response.js'
import type {
  WeldRequestOptions,
  WeldClientConfig,
}                                  from '../types/request.js'

import { createSignalState }       from '../signals/state.js'
import { runPipeline }             from '../pipeline/index.js'
import { registerOnlineSync }      from '../offline/queue.js'

export class Weld<TRouter extends AppRouter = AppRouter> {
  private readonly config: WeldClientConfig

  constructor(baseUrl: string, config?: Omit<WeldClientConfig, 'baseUrl'>) {
    this.config = { baseUrl, offline: true, ...config }

    // Auto-register queue sync on network restore (browser only)
    if (typeof window !== 'undefined') {
      registerOnlineSync()
    }
  }

  // ── GET ────────────────────────────────────────────────────────────────────

  get<
    TPath extends keyof TRouter & string,
    TSchema extends ZodSchema = ZodSchema,
  >(
    path:     TPath,
    schema?:  TSchema,
    options?: WeldRequestOptions,
  ): WeldResponse<TSchema extends ZodSchema<infer T> ? T : unknown> {
    return this.request('GET', path, schema, options)
  }

  // ── POST ───────────────────────────────────────────────────────────────────

  post<
    TPath extends keyof TRouter & string,
    TSchema extends ZodSchema = ZodSchema,
  >(
    path:     TPath,
    schema?:  TSchema,
    options?: WeldRequestOptions,
  ): WeldResponse<TSchema extends ZodSchema<infer T> ? T : unknown> {
    return this.request('POST', path, schema, options)
  }

  // ── PUT ────────────────────────────────────────────────────────────────────

  put<
    TPath extends keyof TRouter & string,
    TSchema extends ZodSchema = ZodSchema,
  >(
    path:     TPath,
    schema?:  TSchema,
    options?: WeldRequestOptions,
  ): WeldResponse<TSchema extends ZodSchema<infer T> ? T : unknown> {
    return this.request('PUT', path, schema, options)
  }

  // ── PATCH ──────────────────────────────────────────────────────────────────

  patch<
    TPath extends keyof TRouter & string,
    TSchema extends ZodSchema = ZodSchema,
  >(
    path:     TPath,
    schema?:  TSchema,
    options?: WeldRequestOptions,
  ): WeldResponse<TSchema extends ZodSchema<infer T> ? T : unknown> {
    return this.request('PATCH', path, schema, options)
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────

  delete<
    TPath extends keyof TRouter & string,
    TSchema extends ZodSchema = ZodSchema,
  >(
    path:     TPath,
    schema?:  TSchema,
    options?: WeldRequestOptions,
  ): WeldResponse<TSchema extends ZodSchema<infer T> ? T : unknown> {
    return this.request('DELETE', path, schema, options)
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  private request<T>(
    method:   string,
    path:     string,
    schema?:  ZodSchema<T>,
    options?: WeldRequestOptions,
  ): WeldResponse<T> {
    const controller = new AbortController()
    const state      = createSignalState<T>()
    const url        = `${this.config.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

    // Build merged options without triggering exactOptionalPropertyTypes errors
    const mergedOptions: WeldRequestOptions = { offlineFallback: this.config.offline ?? true }
    if (this.config.timeout !== undefined) mergedOptions.timeout = this.config.timeout
    if (this.config.retry   !== undefined) mergedOptions.retry   = this.config.retry
    if (options) Object.assign(mergedOptions, options)

    const pipelineInput = {
      method,
      url,
      options:        mergedOptions,
      state,
      abortSignal:    controller.signal,
      defaultHeaders: this.config.headers ?? {},
    }
    if (schema !== undefined) Object.assign(pipelineInput, { schema })

    const promise = runPipeline<T>(pipelineInput)

    return {
      signal:  state,
      promise,
      abort:   () => controller.abort(),
    }
  }
}
