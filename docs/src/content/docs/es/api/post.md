---
title: api.post() / put() / patch() / delete()
description: Referencia de API para peticiones de mutación
---

WELD provee métodos para todos los verbos HTTP de mutación. Todos comparten la misma firma y comportamiento.

## Firmas

```ts
api.post(path, schema?, options?):   WeldResponse<T>
api.put(path, schema?, options?):    WeldResponse<T>
api.patch(path, schema?, options?):  WeldResponse<T>
api.delete(path, schema?, options?): WeldResponse<T>
```

## Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `path` | `keyof TRouter` | Sí | Ruta — autocompletada desde tu AppRouter |
| `schema` | `ZodSchema<T>` | No | Schema Zod para validar la respuesta |
| `options` | `WeldRequestOptions` | No | Usá `options.body` para el cuerpo de la petición |

## Ejemplos

### POST — Crear un recurso

```ts
const { promise } = api.post('v1/products', ProductSchema, {
  body: { name: 'Widget', price: 9.99 },
})

const created = await promise // tipo: Product
```

### DELETE — Eliminar un recurso

```ts
const { promise } = api.delete('v1/products/123')
await promise
```

### Comportamiento offline

Cuando el dispositivo está offline, las mutaciones se **encolan en IndexedDB** y se reproducen automáticamente cuando se restaura la red:

```ts
try {
  await api.post('v1/orders', Schema, { body: orderData }).promise
} catch (err) {
  if (err.message.includes('Offline')) {
    showToast('Orden guardada — se sincronizará al volver online')
  }
}
```
