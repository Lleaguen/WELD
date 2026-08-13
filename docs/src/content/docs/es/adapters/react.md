---
title: Adaptador React
description: Usando @weldjs/react con React 18+
---

`@weldjs/react` conecta las señales WELD a React usando `useSyncExternalStore` — la API oficial de React 18 para stores externos. Funciona correctamente con Concurrent Mode, Suspense y Strict Mode.

## Instalar

```bash
npm install @weldjs/react zod
```

## useWeld()

```tsx
import { useWeld } from '@weldjs/react'
```

### Firmas

```ts
// Overload 1 — referencia estable (a nivel módulo o useMemo)
useWeld(response: WeldResponse<T>): UseWeldResult<T>

// Overload 2 — factory con deps (Strict Mode safe, recomendado)
useWeld(factory: () => WeldResponse<T>, deps: unknown[]): UseWeldResult<T>
```

### Retorna

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `data` | `T \| null` | Los datos de respuesta validados |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Estado actual de la petición |
| `error` | `Error \| null` | Error si la petición falló |
| `loading` | `boolean` | Atajo para `status === 'loading'` |

---

## Cómo llamar useWeld — 3 patrones, todos funcionan

### Patrón 1 — Respuesta a nivel módulo (más simple, siempre seguro)

Creá la petición fuera del componente. Es el patrón más explícito y no tiene casos borde.

```tsx
import { Weld } from '@weldjs/http'
import { useWeld } from '@weldjs/react'
import { z } from 'zod'

const api = new Weld('https://api.ejemplo.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

// ✅ Creada una vez a nivel módulo — estable en todos los renders
const productsRequest = api.get('v1/products', z.array(ProductSchema))

export function ProductList() {
  const { data, loading, error } = useWeld(productsRequest)

  if (loading) return <p>Cargando...</p>
  if (error)   return <p>Error: {error.message}</p>

  return (
    <ul>
      {data?.map(p => <li key={p.id}>{p.name} — ${p.price}</li>)}
    </ul>
  )
}
```

### Patrón 2 — Factory con deps (recomendado para peticiones dinámicas)

Pasá una factory y un array de deps — igual que `useEffect`. La respuesta se crea una vez por cambio de deps, y es Strict Mode safe.

```tsx
export function UserDetail({ id }: { id: string }) {
  const { data, loading } = useWeld(
    () => api.get(`users/${id}`, UserSchema),
    [id]   // recrear cuando id cambie
  )

  if (loading) return <p>Cargando usuario...</p>
  return <div>{data?.name}</div>
}
```

### Patrón 3 — useMemo (explícito, también funciona)

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

:::danger[No hagas esto]
Nunca llames `api.get()` directamente en el render sin memoización:

```tsx
// ❌ Crea un nuevo objeto request en cada render
const { data } = useWeld(api.get('v1/products', Schema))
```

Esto crea un `WeldResponse` nuevo en cada render, lo que rompe las suscripciones a señales.
:::

---

## Mutaciones

Las mutaciones no necesitan `useWeld` — llamalas directamente en los event handlers:

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

## Cancelación

Dentro de `useEffect` tenés control total del ciclo de vida — `api.get()` directo está bien ahí:

```tsx
import { useEffect } from 'react'

export function ProductList() {
  useEffect(() => {
    // ✅ api.get() directo dentro de useEffect está bien
    const { promise, abort } = api.get('v1/products', z.array(ProductSchema))
    promise.then(console.log).catch(console.error)

    return () => abort() // cancelar al desmontar
  }, [])
}
```
