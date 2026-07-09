/**
 * WELD — Response Types
 * Defines the reactive state shape returned by every request.
 */

import type { Signal } from '@preact/signals-core'

export type WeldStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * The internal reactive state. Each field is a @preact/signals-core Signal,
 * making it subscribable from any framework adapter or vanilla JS.
 */
export interface WeldSignalState<T> {
  data:   Signal<T | null>
  status: Signal<WeldStatus>
  error:  Signal<Error | null>
}

/**
 * The object returned by every api.get() / api.post() / etc. call.
 *
 * - `signal`  — reactive state (subscribe from any framework adapter)
 * - `promise` — direct Promise for async/await usage
 * - `abort`   — cancel the in-flight request
 */
export interface WeldResponse<T> {
  signal:  WeldSignalState<T>
  promise: Promise<T>
  abort:   () => void
}
