/**
 * WELD — IndexedDB Storage Abstraction
 * Thin wrapper over the IndexedDB API with a Promise-based interface.
 * Used by both the cache (GET) and the mutation queue (POST/PUT/PATCH/DELETE).
 */

const DB_NAME    = 'weld_db'
const DB_VERSION = 1

export const STORE_CACHE = 'weld_cache'
export const STORE_QUEUE = 'weld_queue'

let dbInstance: IDBDatabase | null = null

/**
 * Opens (or reuses) the IndexedDB database.
 * Creates object stores on first run.
 */
export function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE, { keyPath: 'key' })
      }

      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, {
          keyPath:       'id',
          autoIncrement: true,
        })
      }
    }

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result
      resolve(dbInstance)
    }

    request.onerror = () => reject(request.error)
  })
}

/**
 * Reads a single record from a store by key.
 */
export async function dbGet<T>(store: string, key: string): Promise<T | undefined> {
  const db      = await openDatabase()
  const tx      = db.transaction(store, 'readonly')
  const objStore = tx.objectStore(store)

  return new Promise((resolve, reject) => {
    const req = objStore.get(key)
    req.onsuccess = () => resolve(req.result as T | undefined)
    req.onerror   = () => reject(req.error)
  })
}

/**
 * Writes a record to a store. Overwrites if key already exists.
 */
export async function dbPut<T>(store: string, value: T): Promise<void> {
  const db       = await openDatabase()
  const tx       = db.transaction(store, 'readwrite')
  const objStore = tx.objectStore(store)

  return new Promise((resolve, reject) => {
    const req = objStore.put(value)
    req.onsuccess = () => resolve()
    req.onerror   = () => reject(req.error)
  })
}

/**
 * Deletes a record from a store by key.
 */
export async function dbDelete(store: string, key: string | number): Promise<void> {
  const db       = await openDatabase()
  const tx       = db.transaction(store, 'readwrite')
  const objStore = tx.objectStore(store)

  return new Promise((resolve, reject) => {
    const req = objStore.delete(key)
    req.onsuccess = () => resolve()
    req.onerror   = () => reject(req.error)
  })
}

/**
 * Returns all records from a store, in insertion order.
 */
export async function dbGetAll<T>(store: string): Promise<T[]> {
  const db       = await openDatabase()
  const tx       = db.transaction(store, 'readonly')
  const objStore = tx.objectStore(store)

  return new Promise((resolve, reject) => {
    const req = objStore.getAll()
    req.onsuccess = () => resolve(req.result as T[])
    req.onerror   = () => reject(req.error)
  })
}
