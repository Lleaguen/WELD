/**
 * @weld/react — useWeld() hook
 *
 * Bridges @weld/core signals to React's rendering cycle
 * using useSyncExternalStore (React 18+). No unnecessary re-renders.
 *
 * Usage:
 *   const { data, status, error } = useWeld(api.get('v1/products', Schema))
 */

import { useSyncExternalStore } from 'react'
import type { WeldResponse, WeldStatus } from '@weld/core'

export interface UseWeldResult<T> {
  data:    T | null
  status:  WeldStatus
  error:   Error | null
  /** True while the request is in-flight */
  loading: boolean
}

/**
 * Subscribes to a WeldResponse and returns reactive state
 * compatible with React's concurrent rendering model.
 *
 * @param response — The WeldResponse returned by api.get() / api.post() / etc.
 */
export function useWeld<T>(response: WeldResponse<T>): UseWeldResult<T> {
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

  return {
    data,
    status,
    error,
    loading: status === 'loading',
  }
}
