---
title: Runtime Validation
description: How WELD uses Zod to validate responses at the network boundary
---

TypeScript types disappear at runtime. A type assertion like `data as Product[]` doesn't actually check anything — it just tells the compiler to stop complaining.

WELD uses **Zod schemas** at the network boundary to validate that what the server actually sends matches the contract you defined. If it doesn't, WELD throws a `WeldValidationError` before the data reaches your UI.

## Basic usage

```ts
import { z } from 'zod'

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number().positive(),
})

const { promise } = api.get('v1/products', z.array(ProductSchema))

// If the server sends { id: 1 } (number instead of string),
// WELD throws WeldValidationError — your UI never sees bad data
```

## Zero-config mode

Schema is always optional. Without one, WELD returns the raw response:

```ts
// No schema — returns unknown, no validation
const { promise } = api.get('v1/products')
const data = await promise // type: unknown
```

This is the right choice for quick prototypes or when you trust the API completely.

## Handling validation errors

```ts
import { WeldValidationError } from '@weldjs/http'

try {
  const products = await api.get('v1/products', z.array(ProductSchema)).promise
} catch (err) {
  if (err instanceof WeldValidationError) {
    console.error('API response did not match schema:', err.issues)
  }
}
```

With signals:

```ts
const { signal } = api.get('v1/products', z.array(ProductSchema))

signal.error.subscribe((err) => {
  if (err instanceof WeldValidationError) {
    // Show validation error UI
  }
})
```

## Zod transforms

Zod schemas can transform data as they validate it. WELD applies transforms automatically:

```ts
const ProductSchema = z.object({
  id:         z.string(),
  name:       z.string().trim(),
  price:      z.number(),
  // Parse ISO string into Date object
  created_at: z.string().transform((s) => new Date(s)),
})

const { promise } = api.get('v1/products', z.array(ProductSchema))
const products = await promise
// products[0].created_at is a Date, not a string
```

## Where validation fits in the pipeline

Validation always runs **after** the network response is received and **before** the data reaches your signals or promise. This means:

- Your UI only ever receives valid, typed data
- Validation errors are treated exactly like network errors — they set `status = 'error'` and populate `signal.error`
