/**
 * WELD — Pipeline Layer 1: Deduplication
 * If multiple components request the same resource concurrently,
 * WELD binds them to a single in-flight Promise instead of firing N requests.
 */

// Map of cacheKey → active Promise
const inflightMap = new Map<string, Promise<unknown>>()

/**
 * Returns the existing in-flight promise for a key, or undefined if none exists.
 */
export function getInflight<T>(key: string): Promise<T> | undefined {
  return inflightMap.get(key) as Promise<T> | undefined
}

/**
 * Registers a promise as the active in-flight request for a given key.
 * Automatically removes itself from the map when it settles.
 */
export function registerInflight<T>(key: string, promise: Promise<T>): Promise<T> {
  inflightMap.set(key, promise as Promise<unknown>)

  const cleanup = () => inflightMap.delete(key)
  promise.then(cleanup, cleanup)

  return promise
}

/**
 * Checks if there is already an active request for the given key.
 */
export function hasInflight(key: string): boolean {
  return inflightMap.has(key)
}
