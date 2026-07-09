---
title: SolidJS Adapter
description: Using weld-http with SolidJS
---

The SolidJS adapter is the most natural fit for WELD — since Solid uses fine-grained signals natively, the bridge is minimal. WELD signals map directly to Solid `createSignal` with `onCleanup` handling the subscription lifecycle.

## Setup

solid-js 1.8+ is required as a peer dependency.

```bash
npm install weld-http zod
```

## useWeld()

```ts
import { useWeld } from 'weld-http/solid'

const { data, status, error, loading } = useWeld(weldResponse)
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `Accessor<T \| null>` | The validated response data |
| `status` | `Accessor<WeldStatus>` | Current request status |
| `error` | `Accessor<Error \| null>` | Error if the request failed |
| `loading` | `Accessor<boolean>` | Shorthand for `status === 'loading'` |

## Example

```tsx
import { Weld } from 'weld-http'
import { useWeld } from 'weld-http/solid'
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

  return (
    <>
      <Show when={loading()}>
        <p>Loading products...</p>
      </Show>
      <Show when={error()}>
        <p>Failed to load: {error()?.message}</p>
      </Show>
      <Show when={data()}>
        <ul>
          <For each={data()}>
            {(product) => (
              <li>
                <strong>{product.name}</strong> — ${product.price}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  )
}
```
