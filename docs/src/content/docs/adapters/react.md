---
title: React Adapter
description: Using @weldjs/react with React 18+
---

`@weldjs/react` bridges WELD signals to React using `useSyncExternalStore` — the official React 18 API for external stores. It works correctly with Concurrent Mode, Suspense, and Strict Mode.

## Install

```bash
npm install @weldjs/react zod
```

## useWeld()

```tsx
import { useWeld } from '@weldjs/react'
```

### Signatures

```ts
// Overload 1 — stable reference (module-level or useMemo)
useWeld(response: WeldResponse<T>): UseWeldResult<T>

// Overload 2 — factory with deps (Strict Mode safe, recommended)
useWeld(factory: () => WeldResponse<T>, deps: unknown[]): UseWeldResult<T>
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `T \| null` | The validated response data |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Current request status |
| `error` | `Error \| null` | Error if the request failed |
| `loading` | `boolean` | Shorthand for `status === 'loading'` |

---

## How to call useWeld — 3 patterns, all work

### Pattern 1 — Module-level response (simplest, always safe)

Create the request outside the component. This is the most explicit pattern and has zero edge cases.

```tsx
import { Weld } from '@weldjs/http'
import { useWeld } from '@weldjs/react'
import { z } from 'zod'

const api = new Weld('https://api.example.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

// ✅ Created once at module level — stable across all renders
const productsRequest = api.get('v1/products', z.array(ProductSchema))

export function ProductList() {
  const { data, loading, error } = useWeld(productsRequest)

  if (loading) return <p>Loading...</p>
  if (error)   return <p>Error: {error.message}</p>

  return (
    <ul>
      {data?.map(p => <li key={p.id}>{p.name} — ${p.price}</li>)}
    </ul>
  )
}
```

### Pattern 2 — Factory with deps (recommended for dynamic requests)

Pass a factory function and a deps array — exactly like `useEffect`. The response is created once per dep change, and is Strict Mode safe.

```tsx
export function UserDetail({ id }: { id: string }) {
  const { data, loading } = useWeld(
    () => api.get(`users/${id}`, UserSchema),
    [id]   // recreate when id changes
  )

  if (loading) return <p>Loading user...</p>
  return <div>{data?.name}</div>
}
```

### Pattern 3 — useMemo (explicit, also works)

```tsx
import { useMemo } from 'react'

export function ProductList({ category }: { category: string }) {
  const request = useMemo(
    () => api.get('v1/products', z.array(ProductSchema), { query: { category } }),
    [category]
  )
  const { data, loading } = useWeld(request)
  // ...
}
```

:::danger[Don't do this]
Never call `api.get()` directly in the render body without memoization:

```tsx
// ❌ Creates a new request object on every render
const { data } = useWeld(api.get('v1/products', Schema))
```

This creates a new `WeldResponse` on every render, which breaks signal subscriptions.
:::

---

## Mutations

Mutations don't need `useWeld` — call them directly in event handlers:

```tsx
export function CreateProduct() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('v1/products', ProductSchema, {
      body: { name: 'Widget', price: 9.99 },
    }).promise
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Cancellation

Inside `useEffect` you have full lifecycle control — direct `api.get()` is fine here:

```tsx
import { useEffect } from 'react'

export function ProductList() {
  useEffect(() => {
    // ✅ Direct api.get() inside useEffect is fine — you control the lifecycle
    const { promise, abort } = api.get('v1/products', z.array(ProductSchema))
    promise.then(console.log).catch(console.error)

    return () => abort() // cancel on unmount
  }, [])
}
```
