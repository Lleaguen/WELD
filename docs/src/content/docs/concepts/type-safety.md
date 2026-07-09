---
title: E2E Type Safety
description: How WELD enforces your API contract at compile time
---

E2E Type Safety is WELD's most powerful feature. It means your backend contract flows directly into every request — wrong paths, wrong bodies, and wrong query params **break at compile time**, not at runtime in production.

**Bundle cost: 0KB** — all types are erased at compile time.

## How it works

You define (or import from your backend) an `AppRouter` type that describes every route:

```ts
type AppRouter = {
  'v1/products': {
    GET: {
      query?:   { page?: number; limit?: number }
      response: Product[]
    }
    POST: {
      body:     { name: string; price: number }
      response: { id: string }
    }
  }
  'v1/users/:id': {
    GET: {
      params:   { id: string }
      response: User
    }
    DELETE: {
      response: null
    }
  }
}

const api = new Weld<AppRouter>('https://api.example.com')
```

Now TypeScript knows everything about your API:

```ts
// ✅ Correct — TypeScript is happy
api.get('v1/products')
api.post('v1/products', Schema, { body: { name: 'Widget', price: 9.99 } })

// ❌ Wrong path — compile error
api.get('v1/product') // Argument of type '"v1/product"' is not assignable...

// ❌ Wrong body shape — compile error
api.post('v1/products', Schema, { body: { title: 'Widget' } }) // missing 'name', 'price'
```

## Sharing the contract from your backend

If your backend is TypeScript, you can export the router type and import it directly:

```ts
// backend/src/router.ts (your backend)
export type AppRouter = { ... }

// frontend/src/lib/api.ts
import type { AppRouter } from '../../backend/src/router'
import { Weld } from 'weld-http'

export const api = new Weld<AppRouter>('https://api.example.com')
```

Now if the backend changes a route, the frontend **fails to compile** immediately. The contract is enforced automatically.

## Type inference helpers

WELD exports utility types for extracting parts of the contract:

```ts
import type { InferResponse, InferBody, InferQuery } from 'weld-http'

// Extract the response type of a route
type Products = InferResponse<AppRouter, 'v1/products', 'GET'>
// → Product[]

// Extract the body type of a mutation
type CreateProduct = InferBody<AppRouter, 'v1/products', 'POST'>
// → { name: string; price: number }
```
