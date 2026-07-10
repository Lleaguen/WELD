/**
 * @weldjs/react — useWeld() hook
 * Bridges @weldjs/core signals to React's rendering cycle
 * using useSyncExternalStore (React 18+).
 */

import { useSyncExternalStore } from 'react'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface UseWeldResult<T> {
  data:    T | null
  status:  WeldStatus
  error:   Error | null
  loading: boolean
}

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

  return { data, status, error, loading: status === 'loading' }
}
