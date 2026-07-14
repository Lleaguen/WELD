/**
 * @weldjs/react — useWeld() hook
 * Bridges @weldjs/core signals to React's rendering cycle
 * using useSyncExternalStore (React 18+).
 *
 * Usage:
 *   // ✅ Pass the response directly (stable reference)
 *   const request = useMemo(() => api.get('v1/products', Schema), [])
 *   const { data } = useWeld(request)
 *
 *   // ✅ Or pass a factory — useWeld memoizes it for you
 *   const { data } = useWeld(() => api.get('v1/products', Schema), [])
 */

import { useMemo, useSyncExternalStore } from 'react'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface UseWeldResult<T> {
  data:    T | null
  status:  WeldStatus
  error:   Error | null
  loading: boolean
}

// Overload 1: pass a stable WeldResponse directly
export function useWeld<T>(response: WeldResponse<T>): UseWeldResult<T>

// Overload 2: pass a factory + deps (like useMemo)
export function useWeld<T>(
  factory: () => WeldResponse<T>,
  deps:    readonly unknown[]
): UseWeldResult<T>

export function useWeld<T>(
  responseOrFactory: WeldResponse<T> | (() => WeldResponse<T>),
  deps?: readonly unknown[],
): UseWeldResult<T> {
  // If a factory was passed, memoize it so api.get() only runs when deps change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const response = useMemo<WeldResponse<T>>(
    typeof responseOrFactory === 'function'
      ? responseOrFactory
      : () => responseOrFactory,
    // If a factory + deps were passed use those deps.
    // If a direct response was passed, use the response itself as the dep
    // so a new object reference triggers a new subscription.
    deps ?? [responseOrFactory],
  )

  const { signal } = response

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
