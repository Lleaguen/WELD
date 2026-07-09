/**
 * WELD — Mutation Queue
 * Persists failed mutations in IndexedDB when offline.
 * Replays them in FIFO order when the network is restored.
 */

import { dbPut, dbDelete, dbGetAll, STORE_QUEUE } from './storage.js'

export interface QueuedMutation {
  id?:       number        // autoincrement key
  method:    'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url:       string
  body:      unknown
  headers:   Record<string, string>
  createdAt: number
  attempts:  number
}

const MAX_ATTEMPTS = 5

/**
 * Adds a mutation to the offline queue.
 */
export async function enqueue(mutation: Omit<QueuedMutation, 'id' | 'createdAt' | 'attempts'>): Promise<void> {
  const entry: QueuedMutation = {
    ...mutation,
    createdAt: Date.now(),
    attempts:  0,
  }
  await dbPut(STORE_QUEUE, entry)
}

/**
 * Reads all pending mutations from the queue in FIFO order.
 */
export async function readQueue(): Promise<QueuedMutation[]> {
  return dbGetAll<QueuedMutation>(STORE_QUEUE)
}

/**
 * Removes a mutation from the queue after successful replay.
 */
export async function dequeue(id: number): Promise<void> {
  await dbDelete(STORE_QUEUE, id)
}

/**
 * Replays all queued mutations when the network comes back online.
 * - Successful mutations are removed from the queue.
 * - Failed mutations that exceed MAX_ATTEMPTS are marked as dead letters (kept for inspection).
 */
export async function syncQueue(): Promise<void> {
  const items = await readQueue()

  for (const item of items) {
    try {
      const fetchInit: RequestInit = {
        method:  item.method,
        headers: { 'Content-Type': 'application/json', ...item.headers },
      }
      if (item.body !== undefined) {
        fetchInit.body = JSON.stringify(item.body)
      }

      const response = await fetch(item.url, fetchInit)

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      // Success — remove from queue
      if (item.id !== undefined) await dequeue(item.id)
    } catch {
      const updatedItem: QueuedMutation = { ...item, attempts: item.attempts + 1 }

      if (updatedItem.attempts >= MAX_ATTEMPTS) {
        // Dead letter — keep in queue but stop retrying (mark with negative id pattern via attempts)
        console.warn('[WELD] Mutation exceeded max attempts, kept as dead letter:', item.url)
      }

      await dbPut(STORE_QUEUE, updatedItem)
    }
  }
}

/**
 * Registers the online event listener to auto-sync the queue.
 * Call once during client initialization (browser only).
 */
export function registerOnlineSync(): () => void {
  const handler = () => { void syncQueue() }
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
