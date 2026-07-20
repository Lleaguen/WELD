---
title: TypeScript Tips
description: Getting the most out of WELD's type system
---

## Infer the router from your backend

If your backend is TypeScript, export the router type and import it directly in your frontend. This creates a single source of truth with zero drift.

```ts
// backend/src/router.ts
export type AppRouter = {
  'v1/products': {
    GET:  { response: Product[] }
    POST: { body: CreateProductDto; response: Product }
  }
}

// frontend/src/lib/api.ts
import type { AppRouter } from '../../backend/src/router'
import { Weld } from '@weldjs/http'

export const api = new Weld<AppRouter>('https://api.example.com')
```

Now if the backend changes `Product`, the frontend **fails to compile immediately**.

## Extract types from the router

Use the built-in type helpers to derive types without duplicating them:

```ts
import type { InferResponse, InferBody } from '@weldjs/http'

// The response type of a GET
type Products = InferResponse<AppRouter, 'v1/products', 'GET'>
// → Product[]

// The body type of a POST
type CreateProductDto = InferBody<AppRouter, 'v1/products', 'POST'>
// → { name: string; price: number }
```

## Narrowing status in templates

Use the `status` field to narrow your rendering logic with full type safety:

```ts
const { signal } = api.get('v1/products', z.array(ProductSchema))

signal.status.subscribe((status) => {
  if (status === 'success') {
    // signal.data.value is T | null here
    console.log(signal.data.value)
  }
  if (status === 'error') {
    // signal.error.value is Error | null here
    console.error(signal.error.value)
  }
})
```

## Reuse schemas across frontend and backend

Define your Zod schemas once and share them across both layers:

```ts
// shared/schemas/product.ts
import { z } from 'zod'

export const ProductSchema = z.object({
  id:    z.string().uuid(),
  name:  z.string().min(1).max(100),
  price: z.number().positive(),
})

export type Product = z.infer<typeof ProductSchema>
```

The `z.infer<typeof ProductSchema>` utility extracts the TypeScript type from the schema, so you define the shape **once** and get both runtime validation and static types for free.

## Creating a typed API singleton

Create a single typed client instance and export it across your app:

```ts
// lib/api.ts
import { Weld } from '@weldjs/http'
import type { AppRouter } from '../types/router'

export const api = new Weld<AppRouter>(
  import.meta.env.VITE_API_URL,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    },
  }
)
```

Import `api` wherever you need it — all routes, bodies and responses stay fully typed.
