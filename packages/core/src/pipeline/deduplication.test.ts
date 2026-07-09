import { describe, it, expect, beforeEach } from 'vitest'
import { getInflight, registerInflight, hasInflight } from './deduplication.js'

// Clear the internal map between tests by letting promises settle
beforeEach(async () => {
  await new Promise((r) => setTimeout(r, 0))
})

describe('deduplication', () => {
  it('returns undefined when no in-flight request exists', () => {
    expect(getInflight('nonexistent-key')).toBeUndefined()
  })

  it('registers a promise and retrieves it by key', () => {
    const key     = `dedup-test-${Date.now()}`
    const promise = Promise.resolve('data')
    registerInflight(key, promise)
    expect(getInflight(key)).toBe(promise)
  })

  it('hasInflight returns true while promise is pending', () => {
    const key     = `dedup-pending-${Date.now()}`
    const promise = new Promise<string>((resolve) => setTimeout(() => resolve('ok'), 50))
    registerInflight(key, promise)
    expect(hasInflight(key)).toBe(true)
  })

  it('removes promise from map after it resolves', async () => {
    const key     = `dedup-resolve-${Date.now()}`
    const promise = Promise.resolve('done')
    registerInflight(key, promise)
    await promise
    // Wait for the cleanup microtask
    await new Promise((r) => setTimeout(r, 0))
    expect(hasInflight(key)).toBe(false)
  })

  it('removes promise from map after it rejects', async () => {
    const key     = `dedup-reject-${Date.now()}`
    const promise = Promise.reject(new Error('fail'))
    registerInflight(key, promise)
    await promise.catch(() => {})
    await new Promise((r) => setTimeout(r, 0))
    expect(hasInflight(key)).toBe(false)
  })

  it('returns the same promise for concurrent registrations', () => {
    const key     = `dedup-same-${Date.now()}`
    const promise = new Promise<string>((resolve) => setTimeout(() => resolve('ok'), 50))
    registerInflight(key, promise)
    // Second caller gets the same promise back
    expect(getInflight(key)).toBe(promise)
  })
})
