/**
 * WELD — Cache Key Generator
 * Produces a deterministic string key from a request descriptor.
 * Used by the deduplication layer and the IndexedDB cache.
 */

export interface HashInput {
  method: string
  url:    string
  query?: Record<string, string | number | boolean>
  body?:  unknown
}

/**
 * Generates a stable cache key for a given request.
 * Keys are sorted to ensure { a: 1, b: 2 } and { b: 2, a: 1 } produce the same hash.
 */
export function buildCacheKey(input: HashInput): string {
  const queryPart = input.query
    ? Object.keys(input.query)
        .sort()
        .map((k) => `${k}=${String(input.query![k])}`)
        .join('&')
    : ''

  const bodyPart =
    input.body !== undefined ? JSON.stringify(input.body) : ''

  return `${input.method}::${input.url}::${queryPart}::${bodyPart}`
}
