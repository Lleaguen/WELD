---
title: Adaptador React
description: Using @weldjs/http with React 18+
---

El adaptador React conecta las señales WELD al ciclo de renderizado de React usando `useSyncExternalStore` — la API oficial de React 18 para suscribirse a stores externos. Esto significa que WELD se integra correctamente con Concurrent Mode y Suspense sin configuración adicional.

## Setup

Se requiere React 18+ como peer dependency.

```bash
npm install @weldjs/http zod
```

## useWeld()

```tsx
import { useWeld } from '@weldjs/http/react'

const { data, status, error, loading } = useWeld(weldResponse)
```

### Retorna

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `data` | `T \| null` | Los datos de respuesta validados |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Estado actual de la petición |
| `error` | `Error \| null` | Error si la petición falló |
| `loading` | `boolean` | Atajo para `status === 'loading'` |

## Ejemplo

```tsx
import { Weld } from '@weldjs/http'
import { useWeld } from '@weldjs/http/react'
import { z } from 'zod'

const api = new Weld('https://api.ejemplo.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

export function ProductList() {
  const { data, loading, error } = useWeld(
    () => api.get('v1/products', z.array(ProductSchema)),
    []
  )

  if (loading) return <p>Cargando productos...</p>
  if (error)   return <p>Error al cargar: {error.message}</p>

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

## Cancelación

Dentro de `useEffect` es el lugar correcto para llamadas directas a `api.get()` —
tenés control del ciclo de vida y podés llamar a `abort()` al limpiar.

```tsx
import { useEffect } from 'react'

export function ProductList() {
  useEffect(() => {
    // ✅ api.get() directo está bien aquí — useEffect controla el ciclo de vida
    const { promise, abort } = api.get('v1/products', z.array(ProductSchema))
    promise.then(console.log).catch(console.error)

    // Cancelar al desmontar
    return () => abort()
  }, [])
}
```
