---
title: api.get()
description: Referencia de API para peticiones GET
---

Ejecuta una petición GET a través del pipeline completo de WELD.

## Firma

```ts
api.get(path, schema?, options?): WeldResponse<T>
```

## Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `path` | `keyof TRouter` | Sí | Ruta — autocompletada desde tu AppRouter |
| `schema` | `ZodSchema<T>` | No | Schema Zod para validación en runtime |
| `options` | `WeldRequestOptions` | No | Configuración por petición |

## Retorna

[`WeldResponse<T>`](/es/api/response) — contiene `signal`, `promise` y `abort`.

## Ejemplos

### Sin configuración

```ts
const { promise } = api.get('v1/products')
const data = await promise // tipo: unknown
```

### Con validación

```ts
const { promise } = api.get('v1/products', z.array(ProductSchema))
const products = await promise // tipo: Product[]
```

### Con query params

```ts
const { promise } = api.get('v1/products', z.array(ProductSchema), {
  query: { page: 1, limit: 20, category: 'electronica' },
})
```

### Con cancelación

```ts
const { promise, abort } = api.get('v1/products', z.array(ProductSchema))

// Cancelar después de 2 segundos si no resolvió
setTimeout(abort, 2000)

const products = await promise
```

### Con señales reactivas

```ts
const { signal } = api.get('v1/products', z.array(ProductSchema))

signal.status.subscribe((status) => {
  console.log('Status cambió:', status) // 'loading' → 'success'
})
```
