/**
 * @weld/vue — useWeld() composable
 *
 * Bridges @weld/core signals to Vue 3's reactivity system
 * using shallowRef + watchEffect. Returns Vue Refs for template binding.
 *
 * Usage:
 *   const { data, status, error, loading } = useWeld(api.get('v1/products', Schema))
 */

import { shallowRef, onUnmounted } from 'vue'
import type { ShallowRef }         from 'vue'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface UseWeldResult<T> {
  data:    ShallowRef<T | null>
  status:  ShallowRef<WeldStatus>
  error:   ShallowRef<Error | null>
  loading: ShallowRef<boolean>
}

/**
 * Subscribes to a WeldResponse and returns Vue reactive refs.
 * Automatically unsubscribes when the component is unmounted.
 *
 * @param response — The WeldResponse returned by api.get() / api.post() / etc.
 */
export function useWeld<T>(response: WeldResponse<T>): UseWeldResult<T> {
  const { signal } = response

  const data    = shallowRef<T | null>(signal.data.value)
  const status  = shallowRef<WeldStatus>(signal.status.value)
  const error   = shallowRef<Error | null>(signal.error.value)
  const loading = shallowRef<boolean>(signal.status.value === 'loading')

  // Subscribe to each signal and sync to Vue refs
  const unsubData   = signal.data.subscribe((v)   => { data.value    = v })
  const unsubStatus = signal.status.subscribe((v) => {
    status.value  = v
    loading.value = v === 'loading'
  })
  const unsubError  = signal.error.subscribe((v)  => { error.value   = v })

  // Clean up subscriptions when the component unmounts
  onUnmounted(() => {
    unsubData()
    unsubStatus()
    unsubError()
  })

  return { data, status, error, loading }
}
