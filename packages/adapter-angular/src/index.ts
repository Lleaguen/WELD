/**
 * @weld/angular — toObservable()
 *
 * Bridges @weld/core signals to RxJS Observables for Angular consumption.
 * Use with the async pipe or subscribe directly in services.
 *
 * Usage:
 *   const { data$, status$, error$ } = toObservable(api.get('v1/products', Schema))
 */

import { Observable }              from 'rxjs'
import type { WeldResponse, WeldStatus } from '@weldjs/core'

export interface WeldObservables<T> {
  data$:    Observable<T | null>
  status$:  Observable<WeldStatus>
  error$:   Observable<Error | null>
  loading$: Observable<boolean>
}

/**
 * Converts a WeldResponse into RxJS Observables.
 * Each observable emits immediately with the current value and then on every change.
 *
 * @param response — The WeldResponse returned by api.get() / api.post() / etc.
 */
export function toObservable<T>(response: WeldResponse<T>): WeldObservables<T> {
  const { signal } = response

  const data$ = new Observable<T | null>((subscriber) => {
    subscriber.next(signal.data.value)
    const unsub = signal.data.subscribe((v) => subscriber.next(v))
    return () => unsub()
  })

  const status$ = new Observable<WeldStatus>((subscriber) => {
    subscriber.next(signal.status.value)
    const unsub = signal.status.subscribe((v) => subscriber.next(v))
    return () => unsub()
  })

  const error$ = new Observable<Error | null>((subscriber) => {
    subscriber.next(signal.error.value)
    const unsub = signal.error.subscribe((v) => subscriber.next(v))
    return () => unsub()
  })

  const loading$ = new Observable<boolean>((subscriber) => {
    subscriber.next(signal.status.value === 'loading')
    const unsub = signal.status.subscribe((v) => subscriber.next(v === 'loading'))
    return () => unsub()
  })

  return { data$, status$, error$, loading$ }
}
