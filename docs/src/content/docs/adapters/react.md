---
title: React Adapter
description: Using weld-http with React 18+
---

The React adapter bridges WELD signals to React's rendering cycle using `useSyncExternalStore` — the official React 18 API for subscribing to external stores. This means WELD integrates correctly with Concurrent Mode and Suspense without any extra configuration.

## Setup

React 18+ is required as a peer dependency.

```bash
npm install weld-http zod
```

## useWeld()

```tsx
import { useWeld } from 'weld-http/react'

const { data, status, error, loading } = useWeld(weldResponse)
```

:::caution[Important]
Never call `api.get()` directly inside the component body — it creates a new request on every render. Always create the request outside the component or memoize it:

```tsx
// ✅ Outside the component (static, no deps)
const productsRequest = api.get('v1/products', z.array(ProductSchema))

export function ProductList() {
  const { data, loading } = useWeld(productsRequest)
  // ...
}

// ✅ Inside with useMemo (if deps change)
export function ProductList({ category }: { category: string }) {
  const request = useMemo(
    () => api.get('v1/products', z.array(ProductSchema), { query: { category } }),
    [category]
  )
  const { data, loading } = useWeld(request)
  // ...
}
```

WELD's deduplication prevents duplicate network requests for the same key, but creating many request objects still has a cost.
:::

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `T \| null` | The validated response data |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Current request status |
| `error` | `Error \| null` | Error if the request failed |
| `loading` | `boolean` | Shorthand for `status === 'loading'` |

## Example

```tsx
import { Weld } from 'weld-http'
import { useWeld } from 'weld-http/react'
import { z } from 'zod'

const api = new Weld('https://api.example.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

export function ProductList() {
  const { data, loading, error } = useWeld(
    api.get('v1/products', z.array(ProductSchema))
  )

  if (loading) return <p>Loading products...</p>
  if (error)   return <p>Failed to load: {error.message}</p>

  return (
    <ul>
      {data?.map((product) => (
        <li key={product.id}>
          <strong>{product.name}</strong> — ${product.price}
        </li>
      ))}
    </ul>
  )
}
```

## Mutations

```tsx
import { useState } from 'react'

export function CreateProduct() {
  const [name,  setName]  = useState('')
  const [price, setPrice] = useState(0)

  const handleSubmit = async () => {
    const { promise } = api.post('v1/products', ProductSchema, {
      body: { name, price },
    })
    await promise
    // refresh product list...
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
      <input value={name}  onChange={(e) => setName(e.target.value)} />
      <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="number" />
      <button type="submit">Create</button>
    </form>
  )
}
```

## Cancellation

```tsx
import { useEffect } from 'react'

export function ProductList() {
  useEffect(() => {
    const { promise, abort } = api.get('v1/products', z.array(ProductSchema))
    promise.then(console.log).catch(console.error)

    // Cancel on unmount
    return () => abort()
  }, [])
}
```
