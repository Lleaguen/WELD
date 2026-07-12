---
title: WeldRequestOptions
description: Todas las opciones disponibles por petición
---

Cada método de petición acepta un objeto `WeldRequestOptions` opcional como último argumento.

## Referencia

```ts
interface WeldRequestOptions {
  headers?:         Record<string, string>
  query?:           Record<string, string | number | boolean>
  body?:            unknown
  schema?:          ZodSchema
  offlineFallback?: boolean
  deduplicate?:     boolean
  retry?:           RetryOptions
  timeout?:         number
}
```

## Campos

### `headers`

Headers adicionales mezclados con los defaults del cliente.

```ts
api.get('v1/products', Schema, {
  headers: { 'X-Tenant-ID': 'mi-empresa' },
})
```

### `query`

Parámetros de query string adjuntados a la URL. Todos los valores se convierten a string automáticamente.

```ts
api.get('v1/products', Schema, {
  query: { page: 2, limit: 50, sort: 'price' },
})
// → GET /v1/products?page=2&limit=50&sort=price
```

### `body`

Cuerpo de la petición para POST, PUT y PATCH. Serializado como JSON automáticamente.

### `retry`

Override de la configuración global de reintentos para esta petición específica.

```ts
api.get('v1/products', Schema, {
  retry: {
    attempts:  5,
    delay:     1000,
    condition: (err) => err instanceof WeldNetworkError && err.status >= 500,
  },
})
```

## RetryOptions

```ts
interface RetryOptions {
  attempts:   number               // intentos de reintento después del primer fallo
  delay:      number               // delay base en ms (backoff exponencial)
  condition?: (err: Error) => bool // devolver false para saltear reintento
}
```

Fórmula de backoff: `delay * 2^intento`

| Intento | Delay (base: 300ms) |
|---------|---------------------|
| 1er reintento | 300ms |
| 2do reintento | 600ms |
| 3er reintento | 1200ms |
