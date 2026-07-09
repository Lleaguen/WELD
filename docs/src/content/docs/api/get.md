---
title: api.get()
description: API reference for GET requests
---

Executes a GET request through the full WELD pipeline.

## Signature

```ts
api.get(path, schema?, options?): WeldResponse<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `keyof TRouter` | Yes | Route path — autocompleted from your AppRouter |
| `schema` | `ZodSchema<T>` | No | Zod schema for runtime validation. Omit for zero-config mode |
| `options` | `WeldRequestOptions` | No | Per-request configuration |

## Returns

[`WeldResponse<T>`](/api/response) — contains `signal`, `promise`, and `abort`.

## Examples

### Zero-config

```ts
const { promise } = api.get('v1/products')
const data = await promise // type: unknown
```

### With validation

```ts
const { promise } = api.get('v1/products', z.array(ProductSchema))
const products = await promise // type: Product[]
```

### With query params

```ts
const { promise } = api.get('v1/products', z.array(ProductSchema), {
  query: { page: 1, limit: 20, category: 'electronics' },
})
```

### With custom headers

```ts
const { signal } = api.get('v1/products', z.array(ProductSchema), {
  headers: { 'X-Custom-Header': 'value' },
})
```

### With cancellation

```ts
const { promise, abort } = api.get('v1/products', z.array(ProductSchema))

// Cancel after 2 seconds if not resolved
setTimeout(abort, 2000)

const products = await promise
```

### With reactive signals

```ts
const { signal } = api.get('v1/products', z.array(ProductSchema))

signal.status.subscribe((status) => {
  console.log('Status changed:', status) // 'loading' → 'success'
})

signal.data.subscribe((products) => {
  console.log('Products:', products)
})
```
