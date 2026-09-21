/**
 * @weldjs/react — useWeld() hook
 * Bridges @weldjs/core signals to React's rendering cycle
 * using useSyncExternalStore (React 18+).
 *
 * Strict Mode safe: uses useRef for stable identity across double renders.
 *
 * Abort safe: cancels the previous in-flight request when deps change or
 * the component unmounts — no stale data, no memory leaks.
 *
 * Usage:
 *   // ✅ Recommended — factory function, deps array like useEffect
 *   const { data, loading, error } = useWeld(() => api.get('v1/products', Schema), [])
 *
 *   // ✅ With changing deps — previous request is aborted automatically
 *   const { data } = useWeld(() => api.get(`users/${id}`, Schema), [id])
 *
 *   // ✅ Module-level response (stable, never re-created)
 *   const productsReq = api.get('v1/products', Schema)
 *   function MyComponent() {
 *     const { data } = useWeld(productsReq)
 *   }
 */

import { useRef, useEffect, useSyncExternalStore } from 'react'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface UseWeldResult<T> {
  data:    T | null
  status:  WeldStatus
  error:   Error | null
  loading: boolean
}

// Overload 1: pass a stable WeldResponse directly (module-level or useMemo)
export function useWeld<T>(response: WeldResponse<T>): UseWeldResult<T>

// Overload 2: pass a factory + deps — response is created/aborted per dep change
export function useWeld<T>(
  factory: () => WeldResponse<T>,
  deps:    readonly unknown[]
): UseWeldResult<T>

export function useWeld<T>(
  responseOrFactory: WeldResponse<T> | (() => WeldResponse<T>),
  deps?: readonly unknown[],
): UseWeldResult<T> {

  // ── Stable response reference — Strict Mode + abort safe ──────────────────
  // We store { response, deps } in the ref.
  // When deps change (shallow comparison), we abort the previous response
  // and create a new one. On unmount, we abort the current one.

  const ref = useRef<{
    response: WeldResponse<T>
    deps:     readonly unknown[] | undefined
    isOwned:  boolean   // true only when created by factory — we are responsible for aborting
  } | null>(null)

  // Determine if we need to (re)create the response
  const isFactory   = typeof responseOrFactory === 'function'
  const needsUpdate =
    ref.current === null ||
    (deps !== undefined && !shallowEqual(ref.current.deps, deps))

  if (needsUpdate) {
    // Abort the previous response only if we created it (factory mode)
    if (ref.current?.isOwned) {
      ref.current.response.abort()
    }

    const response = isFactory
      ? (responseOrFactory as () => WeldResponse<T>)()
      : responseOrFactory as WeldResponse<T>

    ref.current = { response, deps, isOwned: isFactory }
  }

  // ── Abort on unmount (factory mode only) ──────────────────────────────────
  useEffect(() => {
    // Capture the current ref value for the cleanup closure
    const current = ref.current
    return () => {
      if (current?.isOwned) {
        current.response.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const { signal } = ref.current!.response

  // ── Subscribe via useSyncExternalStore ─────────────────────────────────────
  // React 18 official API for external stores.
  // Reads current value synchronously — data available immediately even if
  // the fetch completed before this component mounted.

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
