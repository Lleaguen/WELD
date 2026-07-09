/**
 * WELD — Request Types
 * Options accepted by every request method.
 */

import type { ZodSchema } from 'zod'

export interface RetryOptions {
  /** Number of retry attempts after first failure. Default: 3 */
  attempts:   number
  /** Base delay in ms for exponential backoff. Default: 300 */
  delay:      number
  /** Optional predicate — return false to skip retry for a given error */
  condition?: (error: Error) => boolean
}

export interface WeldRequestOptions<TBody = unknown> {
  /** Additional headers merged with client-level defaults */
  headers?:         Record<string, string>
  /** Query string parameters (appended to the URL) */
  query?:           Record<string, string | number | boolean>
  /** Request body — only used for POST / PUT / PATCH */
  body?:            TBody
  /** Zod schema for runtime response validation. Optional — omit for zero-config mode */
  schema?:          ZodSchema
  /**
   * Enable IndexedDB cache fallback when offline.
   * Automatically true for GET requests, false for mutations.
   */
  offlineFallback?: boolean
  /**
   * Deduplicate concurrent in-flight requests with the same key.
   * Default: true
   */
  deduplicate?:     boolean
  /** Retry config. Default: { attempts: 3, delay: 300 } */
  retry?:           RetryOptions
  /** Request timeout in ms. Default: 10_000 */
  timeout?:         number
}

export interface WeldClientConfig {
  /** Base URL prepended to every request path */
  baseUrl:   string
  /** Default headers sent with every request */
  headers?:  Record<string, string>
  /** Global retry config (can be overridden per request) */
  retry?:    RetryOptions
  /** Global timeout in ms. Default: 10_000 */
  timeout?:  number
  /** Global offline fallback toggle. Default: true */
  offline?:  boolean
}
