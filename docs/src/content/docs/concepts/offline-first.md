---
title: Offline-First
description: How WELD handles network outages automatically
---

WELD is built for the real world, where networks are unreliable. It handles offline scenarios differently depending on the type of request.

## GET requests — Cache fallback

When you make a GET request, WELD automatically caches the successful response in **IndexedDB**. If the network goes down and the same request is made again, WELD serves the cached data transparently.

```ts
const { promise } = api.get('v1/products', ProductArraySchema, {
  offlineFallback: true, // default for GET requests
})

// Online: fetches from server, caches the response
// Offline: returns the cached data from IndexedDB
const products = await promise
```

The cache has a default TTL of 5 minutes. You can configure this globally or per-request in a future version.

## Mutation queue — POST, PUT, PATCH, DELETE

When a mutation fails because the device is offline, WELD doesn't throw an error and give up. Instead, it **enqueues the mutation in IndexedDB** and replays it automatically when the network is restored.

```ts
// User is offline — this doesn't fail
const { promise } = api.post('v1/orders', Schema, {
  body: { productId: '123', quantity: 2 },
})

// The mutation is stored in the queue
// When network comes back, it fires automatically
```

## How queue sync works

WELD listens to the browser's `navigator.onLine` event. When it fires, the queue processor:

1. Reads all pending mutations from IndexedDB in **FIFO order** (first in, first out)
2. Replays each mutation against the server
3. On success — removes it from the queue
4. On failure — increments the attempt counter
5. After 5 failed attempts — marks it as a dead letter (kept for inspection, doesn't block others)

## Manual sync

You can trigger a sync manually if needed:

```ts
import { syncQueue } from 'weld-http'

// Force replay all queued mutations now
await syncQueue()
```

## Disabling offline support

```ts
// Disable for a specific request
const { promise } = api.get('v1/products', Schema, {
  offlineFallback: false,
})

// Disable globally
const api = new Weld<AppRouter>('https://api.example.com', {
  offline: false,
})
```

## Browser support

Offline-First requires `IndexedDB` and `navigator.onLine`, which are available in all modern browsers. In Node.js, Bun, and Deno, offline mode is automatically disabled since these environments don't have `IndexedDB`.
