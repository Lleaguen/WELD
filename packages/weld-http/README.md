# weld-http

[![npm version](https://img.shields.io/npm/v/weld-http.svg)](https://www.npmjs.com/package/weld-http)
[![npm downloads](https://img.shields.io/npm/dm/weld-http.svg)](https://www.npmjs.com/package/weld-http)
[![bundle size](https://img.shields.io/bundlephobia/minzip/weld-http)](https://bundlephobia.com/package/weld-http)
[![license](https://img.shields.io/npm/l/weld-http.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

**End-to-End Type-Safe HTTP Client** — Offline-first, zero-config, framework agnostic.

```bash
npm install weld-http zod
```

---

## The 4 Pillars

- **E2E Type Safety** — Absorbs your backend router contract. Autocomplete on routes, query params, body and response. Breaks at compile time if the backend changes. Cost: 0KB.
- **Runtime Validation** — Zod schemas at the network boundary. Catches API drift before it corrupts your UI.
- **Offline-First** — GET requests fall back to IndexedDB cache. Mutations queue locally and replay automatically when the network restores.
- **Request Deduplication** — Concurrent requests for the same resource share a single in-flight Promise.

---

## Quick Start

```ts
import { Weld } from 'weld-http'
import { z } from 'zod'

// 1. Define your backend contract (or infer it from your backend)
type AppRouter = {
  'v1/products': {
    GET:  { response: { id: string; name: string; price: number }[] }
    POST: { body: { name: string; price: number }; response: { id: string } }
  }
}

// 2. Zod schema for runtime validation
const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

// 3. Create the client
const api = new Weld<AppRouter>('https://api.example.com')

// 4. Make a type-safe request
const { signal, promise } = api.get('v1/products', z.array(ProductSchema))

// Via promise (async/await)
const products = await promise

// Via reactive signal (framework-agnostic)
signal.data.subscribe((products) => console.log(products))
```

---

## Framework Adapters

### React
```ts
import { useWeld } from 'weld-http/react'

function ProductList() {
  const { data, loading, error } = useWeld(api.get('v1/products', z.array(ProductSchema)))

  if (loading) return <p>Loading...</p>
  if (error)   return <p>Error: {error.message}</p>
  return <ul>{data?.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### Vue
```ts
import { useWeld } from 'weld-http/vue'

const { data, loading, error } = useWeld(api.get('v1/products', z.array(ProductSchema)))
```

### SolidJS
```ts
import { useWeld } from 'weld-http/solid'

const { data, loading } = useWeld(api.get('v1/products', z.array(ProductSchema)))
```

### Angular
```ts
import { toObservable } from 'weld-http/angular'

const { data$, loading$ } = toObservable(api.get('v1/products', z.array(ProductSchema)))
```

---

## Zero-Config Mode

No Zod schema? No problem. WELD returns raw data directly.

```ts
const { promise } = api.get('v1/products')
const data = await promise // unknown — no validation
```

---

## Offline-First

```ts
// GET — automatically cached in IndexedDB, served offline
const { promise } = api.get('v1/products', Schema, { offlineFallback: true })

// POST/PUT/DELETE — queued offline, replayed when network restores
const { promise } = api.post('v1/products', Schema, {
  body: { name: 'New Product', price: 99 }
})
```

---

## Client Configuration

```ts
const api = new Weld<AppRouter>('https://api.example.com', {
  headers: { Authorization: 'Bearer token' },
  timeout: 10_000,
  retry:   { attempts: 3, delay: 300 },
  offline: true,
})
```

---

## Cancellation

```ts
const { promise, abort } = api.get('v1/products')
abort() // cancels the in-flight request
```

---

## Peer Dependencies

| Adapter | Peer Dependency |
|---|---|
| `weld-http/react` | `react >= 18` |
| `weld-http/vue` | `vue >= 3.3` |
| `weld-http/solid` | `solid-js >= 1.8` |
| `weld-http/angular` | `rxjs >= 7` |

All peer dependencies are optional — install only what you use.

---

## License

MIT
