---
title: Request Deduplication
description: How WELD prevents duplicate in-flight requests
---

When multiple components request the same resource at the same moment, WELD detects the duplicate and binds all callers to a **single in-flight Promise** instead of firing N requests to the server.

## The problem it solves

Imagine a dashboard with 3 components that all need the current user's data on mount:

```ts
// Component A
const user = await api.get('v1/me').promise

// Component B (mounts at the same time)
const user = await api.get('v1/me').promise

// Component C (mounts at the same time)
const user = await api.get('v1/me').promise
```

Without deduplication: **3 network requests** hit your server simultaneously.  
With WELD: **1 network request**, all three components get the same result.

## How it works

WELD generates a deterministic cache key from the request method, URL, query params, and body. If a request with that key is already in flight, the new caller gets the existing Promise back instead of starting a new one.

```
Request A → key: "GET::/v1/me::::" → no match → starts fetch, registers Promise
Request B → key: "GET::/v1/me::::" → match found → returns existing Promise
Request C → key: "GET::/v1/me::::" → match found → returns existing Promise

Server receives: 1 request
All 3 callers receive: same data
```

Once the Promise settles (success or error), it's removed from the map automatically.

## Deduplication is on by default

You don't need to configure anything. It's active for all GET requests automatically.

```ts
// These three calls — even from different components — share one request
api.get('v1/products', Schema)
api.get('v1/products', Schema)
api.get('v1/products', Schema)
```

## Disabling it

```ts
const { promise } = api.get('v1/products', Schema, {
  deduplicate: false, // always fires a new request
})
```

:::note
Deduplication only applies to GET requests. Mutations (POST, PUT, PATCH, DELETE) are always executed independently.
:::
