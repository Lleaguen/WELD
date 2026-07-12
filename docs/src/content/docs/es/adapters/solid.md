---
title: Adaptador SolidJS
description: Usando weld-http con SolidJS
---

El adaptador SolidJS es el más natural para WELD — dado que Solid usa señales de grano fino nativamente, el bridge es mínimo. Las señales WELD se mapean directamente a `createSignal` de Solid con `onCleanup` manejando el ciclo de vida de la suscripción.

## Setup

Se requiere solid-js 1.8+ como peer dependency.

```bash
npm install weld-http zod
```

## useWeld()

```ts
import { useWeld } from 'weld-http/solid'

const { data, status, error, loading } = useWeld(weldResponse)
```

### Retorna

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `data` | `Accessor<T \| null>` | Los datos de respuesta validados |
| `status` | `Accessor<WeldStatus>` | Estado actual de la petición |
| `error` | `Accessor<Error \| null>` | Error si la petición falló |
| `loading` | `Accessor<boolean>` | Atajo para `status === 'loading'` |

## Ejemplo

```tsx
import { Weld } from 'weld-http'
import { useWeld } from 'weld-http/solid'
import { z } from 'zod'

const api = new Weld('https://api.ejemplo.com')

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
        <p>Cargando productos...</p>
      </Show>
      <Show when={error()}>
        <p>Error al cargar: {error()?.message}</p>
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
