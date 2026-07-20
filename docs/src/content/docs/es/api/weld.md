---
title: new Weld()
description: Referencia de API para el constructor del cliente Weld
---

Crea una nueva instancia del cliente WELD vinculada a una URL base.

## Firma

```ts
new Weld<TRouter extends AppRouter>(
  baseUrl: string,
  config?: WeldClientConfig
)
```

## Parámetros

### `baseUrl`

Tipo: `string`

La URL base que se antepone a cada ruta de petición.

```ts
const api = new Weld('https://api.ejemplo.com')
// api.get('v1/products') → GET https://api.ejemplo.com/v1/products
```

### `config`

Tipo: `WeldClientConfig` — opcional

| Campo | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `headers` | `Record<string, string>` | `{}` | Headers por defecto enviados con cada petición |
| `timeout` | `number` | `10000` | Timeout en milisegundos |
| `retry` | `RetryOptions` | `{ attempts: 3, delay: 300 }` | Configuración global de reintentos |
| `offline` | `boolean` | `true` | Habilitar caché/cola offline globalmente |

## Ejemplos

### Setup mínimo

```ts
import { Weld } from '@weldjs/http'

const api = new Weld('https://api.ejemplo.com')
```

### Con autenticación

```ts
const api = new Weld('https://api.ejemplo.com', {
  headers: {
    Authorization: `Bearer ${token}`,
    'X-App-Version': '1.0.0',
  },
})
```

### Con configuración completa

```ts
const api = new Weld<AppRouter>('https://api.ejemplo.com', {
  headers: { Authorization: 'Bearer token' },
  timeout: 15_000,
  retry: {
    attempts:  3,
    delay:     500,
    condition: (err) => err.message !== '401', // no reintentar errores de auth
  },
  offline: true,
})
```

### Generic de TypeScript

Pasá tu tipo `AppRouter` como generic para habilitar la seguridad de tipos E2E:

```ts
type AppRouter = {
  'v1/products': {
    GET: { response: Product[] }
  }
}

const api = new Weld<AppRouter>('https://api.ejemplo.com')
//    ^ ahora conoce cada ruta, método, cuerpo y tipo de respuesta
```
