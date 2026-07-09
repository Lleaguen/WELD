/**
 * WELD — GET Response Cache
 * Persists successful GET responses in IndexedDB for offline fallback.
 */

import { dbGet, dbPut, STORE_CACHE } from './storage.js'

const DEFAULT_TTL_MS = 5 * 60 * 1_000 // 5 minutes

interface CacheEntry<T> {
  key:       string
  data:      T
  timestamp: number
  ttl:       number
}

/**
 * Reads a cached response for a given key.
 * Returns undefined if the entry doesn't exist or has expired.
 */
export async function readCache<T>(key: string): Promise<T | undefined> {
  const entry = await dbGet<CacheEntry<T>>(STORE_CACHE, key)

  if (!entry) return undefined

  const isExpired = Date.now() - entry.timestamp > entry.ttl
  if (isExpired) return undefined

  return entry.data
}

/**
 * Persists a response in the cache with a TTL.
 */
export async function writeCache<T>(
  key:  string,
  data: T,
  ttl:  number = DEFAULT_TTL_MS,
): Promise<void> {
  const entry: CacheEntry<T> = {
    key,
    data,
    timestamp: Date.now(),
    ttl,
  }
  await dbPut(STORE_CACHE, entry)
}
