---
title: api.post() / put() / patch() / delete()
description: API reference for mutation requests
---

WELD provides methods for all HTTP mutation verbs. They all share the same signature and behavior.

## Signatures

```ts
api.post(path, schema?, options?):   WeldResponse<T>
api.put(path, schema?, options?):    WeldResponse<T>
api.patch(path, schema?, options?):  WeldResponse<T>
api.delete(path, schema?, options?): WeldResponse<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `keyof TRouter` | Yes | Route path — autocompleted from your AppRouter |
| `schema` | `ZodSchema<T>` | No | Zod schema to validate the response |
| `options` | `WeldRequestOptions` | No | Per-request configuration — use `options.body` for the request body |

## Examples

### POST — Create a resource

```ts
const { promise } = api.post('v1/products', ProductSchema, {
  body: { name: 'Widget', price: 9.99 },
})

const created = await promise // type: Product
```

### PUT — Replace a resource

```ts
const { promise } = api.put('v1/products/123', ProductSchema, {
  body: { name: 'Updated Widget', price: 14.99 },
})
```

### PATCH — Partial update

```ts
const { promise } = api.patch('v1/products/123', ProductSchema, {
  body: { price: 19.99 },
})
```

### DELETE — Remove a resource

```ts
const { promise } = api.delete('v1/products/123')
await promise
```

### Offline behavior

When the device is offline, mutations are **queued in IndexedDB** and replayed automatically when the network is restored. The promise will reject with an offline message so your UI can respond:

```ts
try {
  await api.post('v1/orders', Schema, { body: orderData }).promise
} catch (err) {
  if (err.message.includes('Offline')) {
    showToast('Order saved — will sync when back online')
  }
}
```
