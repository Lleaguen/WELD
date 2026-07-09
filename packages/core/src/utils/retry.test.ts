import { describe, it, expect, vi } from 'vitest'
import { withRetry } from './retry.js'

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withRetry(fn, { attempts: 3, delay: 0 })
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and succeeds eventually', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('ok')

    const result = await withRetry(fn, { attempts: 3, delay: 0 })
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after exhausting all attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'))
    await expect(withRetry(fn, { attempts: 2, delay: 0 })).rejects.toThrow('always fails')
    expect(fn).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
  })

  it('respects condition — skips retry when condition returns false', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('not retryable'))
    const condition = vi.fn().mockReturnValue(false)

    await expect(
      withRetry(fn, { attempts: 3, delay: 0, condition })
    ).rejects.toThrow('not retryable')

    expect(fn).toHaveBeenCalledTimes(1) // no retries
  })

  it('respects condition — retries when condition returns true', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('retry me'))
      .mockResolvedValue('ok')

    const condition = vi.fn().mockReturnValue(true)
    const result = await withRetry(fn, { attempts: 2, delay: 0, condition })
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
