/**
 * WELD — Retry with Exponential Backoff
 * Wraps any async operation with configurable retry logic.
 */

import type { RetryOptions } from '../types/request.js'

const DEFAULT_RETRY: RetryOptions = {
  attempts:  3,
  delay:     300,
}

/**
 * Executes `fn` and retries up to `options.attempts` times on failure,
 * with exponential backoff: delay * 2^attempt.
 *
 * If `options.condition` is provided, only retries when it returns true.
 */
export async function withRetry<T>(
  fn:       () => Promise<T>,
  options?: Partial<RetryOptions>,
): Promise<T> {
  const config = { ...DEFAULT_RETRY, ...options }
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 0; attempt <= config.attempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      const isLastAttempt = attempt === config.attempts
      const shouldRetry   = config.condition ? config.condition(lastError) : true

      if (isLastAttempt || !shouldRetry) break

      const backoff = config.delay * Math.pow(2, attempt)
      await sleep(backoff)
    }
  }

  throw lastError
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
