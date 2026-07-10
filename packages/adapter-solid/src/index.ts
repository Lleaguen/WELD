/**
 * @weld/solid — useWeld() primitive
 *
 * Bridges @weld/core signals to SolidJS's fine-grained reactivity.
 * Since Solid uses signals natively, the bridge is minimal — no overhead.
 *
 * Usage:
 *   const { data, status, error } = useWeld(api.get('v1/products', Schema))
 */

import { createSignal, onCleanup } from 'solid-js'
import type { Accessor }           from 'solid-js'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface UseWeldResult<T> {
  data:    Accessor<T | null>
  status:  Accessor<WeldStatus>
  error:   Accessor<Error | null>
  loading: Accessor<boolean>
}

/**
 * Subscribes to a WeldResponse and returns SolidJS Accessors.
 * Automatically cleans up when the owner scope is disposed.
 *
 * @param response — The WeldResponse returned by api.get() / api.post() / etc.
 */
export function useWeld<T>(response: WeldResponse<T>): UseWeldResult<T> {
  const { signal } = response

  const [data,   setData]   = createSignal<T | null>(signal.data.value)
  const [status, setStatus] = createSignal<WeldStatus>(signal.status.value)
  const [error,  setError]  = createSignal<Error | null>(signal.error.value)
  const [loading, setLoading] = createSignal<boolean>(signal.status.value === 'loading')

  const unsubData   = signal.data.subscribe((v)   => setData(() => v))
  const unsubStatus = signal.status.subscribe((v) => {
    setStatus(() => v)
    setLoading(v === 'loading')
  })
  const unsubError  = signal.error.subscribe((v)  => setError(() => v))

  onCleanup(() => {
    unsubData()
    unsubStatus()
    unsubError()
  })

  return { data, status, error, loading }
}
