/**
 * @weldjs/react — useWeld() hook
 * Bridges @weldjs/core signals to React's rendering cycle
 * using useSyncExternalStore (React 18+).
 *
 * Strict Mode safe: uses useRef for stable identity across double renders.
 *
 * Usage:
 *   // ✅ Recommended — factory function, deps array like useEffect
 *   const { data, loading, error } = useWeld(() => api.get('v1/products', Schema), [])
 *
 *   // ✅ With changing deps
 *   const { data } = useWeld(() => api.get(`users/${id}`, Schema), [id])
 *
 *   // ✅ Module-level response (also works perfectly)
 *   const productsReq = api.get('v1/products', Schema)
 *   function MyComponent() {
 *     const { data } = useWeld(productsReq)
 *   }
 */

import { useRef, useSyncExternalStore } from 'react'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface UseWeldResult<T> {
  data:    T | null
  status:  WeldStatus
  error:   Error | null
  loading: boolean
}

// Overload 1: pass a stable WeldResponse directly (module-level or useMemo)
export function useWeld<T>(response: WeldResponse<T>): UseWeldResult<T>

// Overload 2: pass a factory + deps — response is created once per dep change
export function useWeld<T>(
  factory: () => WeldResponse<T>,
  deps:    readonly unknown[]
): UseWeldResult<T>

export function useWeld<T>(
  responseOrFactory: WeldResponse<T> | (() => WeldResponse<T>),
  deps?: readonly unknown[],
): UseWeldResult<T> {

  // ── Stable response reference — Strict Mode safe ───────────────────────────
  // useRef survives the double render in React 18 Strict Mode.
  // useMemo does NOT — React may discard and re-run it, causing a second fetch.
  //
  // We store { response, deps } in the ref.
  // When deps change (shallow comparison), we create a new response.

  const ref = useRef<{ response: WeldResponse<T>; deps: readonly unknown[] | undefined } | null>(null)

  // Determine if we need to (re)create the response
  const needsUpdate =
    ref.current === null ||
    (deps !== undefined && !shallowEqual(ref.current.deps, deps))

  if (needsUpdate) {
    const response =
      typeof responseOrFactory === 'function'
        ? responseOrFactory()
        : responseOrFactory
    ref.current = { response, deps }
  }

  const { signal } = ref.current!.response

  // ── Subscribe via useSyncExternalStore ─────────────────────────────────────
  // This is the React 18 official API for external stores.
  // It reads the current value synchronously, so even if the fetch already
  // completed before this component mounted, data is available immediately.

  const data = useSyncExternalStore(
    (notify) => signal.data.subscribe(notify),
    () => signal.data.value,
    () => null,
  )

  const status = useSyncExternalStore(
    (notify) => signal.status.subscribe(notify),
    () => signal.status.value,
    () => 'idle' as WeldStatus,
  )

  const error = useSyncExternalStore(
    (notify) => signal.error.subscribe(notify),
    () => signal.error.value,
    () => null,
  )

  return { data, status, error, loading: status === 'loading' }
}

// ── Shallow equality for deps array ──────────────────────────────────────────

function shallowEqual(
  a: readonly unknown[] | undefined,
  b: readonly unknown[] | undefined,
): boolean {
  if (a === b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false
  }
  return true
}
