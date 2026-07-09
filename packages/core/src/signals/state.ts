/**
 * WELD — Signal State Factory
 * Wraps @preact/signals-core to create reactive WeldSignalState<T> objects.
 * Framework adapters (React, Vue, Solid) consume these signals via their own bridges.
 */

import { signal } from '@preact/signals-core'
import type { WeldSignalState, WeldStatus } from '../types/response.js'

/**
 * Creates a fresh reactive state container for a single request.
 */
export function createSignalState<T>(): WeldSignalState<T> {
  return {
    data:   signal<T | null>(null),
    status: signal<WeldStatus>('idle'),
    error:  signal<Error | null>(null),
  }
}

/**
 * Updates the signal state to reflect a successful response.
 */
export function setSuccess<T>(state: WeldSignalState<T>, data: T): void {
  state.data.value   = data
  state.status.value = 'success'
  state.error.value  = null
}

/**
 * Updates the signal state to reflect a failed request.
 */
export function setError<T>(state: WeldSignalState<T>, error: Error): void {
  state.error.value  = error
  state.status.value = 'error'
}

/**
 * Sets the signal state to loading — clears previous error.
 */
export function setLoading<T>(state: WeldSignalState<T>): void {
  state.status.value = 'loading'
  state.error.value  = null
}
