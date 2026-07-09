---
title: WeldRequestOptions
description: All options available per request
---

Every request method accepts an optional `WeldRequestOptions` object as the last argument.

## Reference

```ts
interface WeldRequestOptions {
  headers?:         Record<string, string>
  query?:           Record<string, string | number | boolean>
  body?:            unknown
  schema?:          ZodSchema
  offlineFallback?: boolean
  deduplicate?:     boolean
  retry?:           RetryOptions
  timeout?:         number
}
```

## Fields

### `headers`

Additional headers merged with the client-level defaults.

```ts
api.get('v1/products', Schema, {
  headers: { 'X-Tenant-ID': 'acme-corp' },
})
```

### `query`

Query string parameters appended to the URL. All values are stringified automatically.

```ts
api.get('v1/products', Schema, {
  query: { page: 2, limit: 50, sort: 'price' },
})
// → GET /v1/products?page=2&limit=50&sort=price
```

### `body`

Request body for POST, PUT, and PATCH. Serialized as JSON automatically.

```ts
api.post('v1/products', Schema, {
  body: { name: 'Widget', price: 9.99 },
})
```

### `offlineFallback`

Enable or disable IndexedDB cache fallback for GET requests, or mutation queuing for POST/PUT/PATCH/DELETE.

Default: `true` for all requests.

```ts
api.get('v1/products', Schema, { offlineFallback: false })
```

### `deduplicate`

Deduplicate concurrent in-flight requests with the same cache key.

Default: `true` for GET requests.

```ts
api.get('v1/products', Schema, { deduplicate: false })
```

### `retry`

Override the global retry configuration for this specific request.

```ts
api.get('v1/products', Schema, {
  retry: {
    attempts:  5,
    delay:     1000,
    condition: (err) => err instanceof WeldNetworkError && err.status >= 500,
  },
})
```

### `timeout`

Request timeout in milliseconds. Overrides the client-level default.

```ts
api.get('v1/heavy-report', Schema, { timeout: 30_000 })
```

## RetryOptions

```ts
interface RetryOptions {
  attempts:   number               // retry attempts after first failure
  delay:      number               // base delay in ms (exponential backoff)
  condition?: (err: Error) => bool // return false to skip retry for this error
}
```

Backoff formula: `delay * 2^attempt`

| Attempt | Delay (base: 300ms) |
|---------|---------------------|
| 1st retry | 300ms |
| 2nd retry | 600ms |
| 3rd retry | 1200ms |
