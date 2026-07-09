import { describe, it, expect } from 'vitest'
import { createSignalState, setSuccess, setError, setLoading } from './state.js'

describe('signal state', () => {
  it('creates state with idle defaults', () => {
    const state = createSignalState<string>()
    expect(state.data.value).toBeNull()
    expect(state.status.value).toBe('idle')
    expect(state.error.value).toBeNull()
  })

  it('setLoading updates status to loading and clears error', () => {
    const state = createSignalState<string>()
    state.error.value = new Error('previous error')

    setLoading(state)

    expect(state.status.value).toBe('loading')
    expect(state.error.value).toBeNull()
  })

  it('setSuccess updates data and status to success', () => {
    const state = createSignalState<string>()
    setSuccess(state, 'hello')

    expect(state.data.value).toBe('hello')
    expect(state.status.value).toBe('success')
    expect(state.error.value).toBeNull()
  })

  it('setError updates error and status to error', () => {
    const state = createSignalState<string>()
    const err   = new Error('something went wrong')
    setError(state, err)

    expect(state.error.value).toBe(err)
    expect(state.status.value).toBe('error')
  })

  it('signal notifies subscribers on change', () => {
    const state   = createSignalState<number>()
    const values: (number | null)[] = []

    state.data.subscribe((v) => values.push(v))
    setSuccess(state, 42)
    setSuccess(state, 99)

    expect(values).toContain(42)
    expect(values).toContain(99)
  })
})
