---
title: Seguridad de Tipos E2E
description: Cómo WELD aplica tu contrato de API en tiempo de compilación
---

La Seguridad de Tipos E2E es la característica más poderosa de WELD. Significa que el contrato de tu backend fluye directamente en cada petición — rutas incorrectas, cuerpos incorrectos y query params incorrectos **fallan en tiempo de compilación**, no en runtime en producción.

**Costo en bundle: 0KB** — todos los tipos se borran en compilación.

## Cómo funciona

Definís (o importás desde tu backend) un tipo `AppRouter` que describe cada ruta:

```ts
type AppRouter = {
  'v1/products': {
    GET: {
      query?:   { page?: number; limit?: number }
      response: Product[]
    }
    POST: {
      body:     { name: string; price: number }
      response: { id: string }
    }
  }
  'v1/users/:id': {
    GET: {
      params:   { id: string }
      response: User
    }
    DELETE: {
      response: null
    }
  }
}

const api = new Weld<AppRouter>('https://api.example.com')
```

Ahora TypeScript sabe todo sobre tu API:

```ts
// ✅ Correcto — TypeScript no se queja
api.get('v1/products')
api.post('v1/products', Schema, { body: { name: 'Widget', price: 9.99 } })

// ❌ Ruta incorrecta — error de compilación
api.get('v1/product') // Argument of type '"v1/product"' is not assignable...

// ❌ Cuerpo incorrecto — error de compilación
api.post('v1/products', Schema, { body: { title: 'Widget' } }) // falta 'name', 'price'
```

## Compartir el contrato desde tu backend

Si tu backend es TypeScript, podés exportar el tipo del router e importarlo directamente:

```ts
// backend/src/router.ts (tu backend)
export type AppRouter = { ... }

// frontend/src/lib/api.ts
import type { AppRouter } from '../../backend/src/router'
import { Weld } from '@weldjs/http'

export const api = new Weld<AppRouter>('https://api.example.com')
```

Ahora si el backend cambia una ruta, el frontend **falla en compilar** inmediatamente. El contrato se aplica automáticamente.

## Helpers de inferencia de tipos

WELD exporta tipos utilitarios para extraer partes del contrato:

```ts
import type { InferResponse, InferBody, InferQuery } from '@weldjs/http'

// Extraer el tipo de respuesta de una ruta
type Products = InferResponse<AppRouter, 'v1/products', 'GET'>
// → Product[]

// Extraer el tipo de cuerpo de una mutación
type CreateProduct = InferBody<AppRouter, 'v1/products', 'POST'>
// → { name: string; price: number }
```
