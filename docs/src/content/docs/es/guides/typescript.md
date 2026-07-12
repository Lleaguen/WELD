---
title: Tips de TypeScript
description: Aprovechá al máximo el sistema de tipos de WELD
---

## Inferir el router desde tu backend

Si tu backend es TypeScript, exportá el tipo del router e importalo directamente en tu frontend. Esto crea una única fuente de verdad sin drift.

```ts
// backend/src/router.ts
export type AppRouter = {
  'v1/products': {
    GET:  { response: Product[] }
    POST: { body: CreateProductDto; response: Product }
  }
}

// frontend/src/lib/api.ts
import type { AppRouter } from '../../backend/src/router'
import { Weld } from 'weld-http'

export const api = new Weld<AppRouter>('https://api.ejemplo.com')
```

Ahora si el backend cambia `Product`, el frontend **falla en compilar inmediatamente**.

## Extraer tipos del router

Usá los helpers de tipos integrados para derivar tipos sin duplicarlos:

```ts
import type { InferResponse, InferBody } from 'weld-http'

// El tipo de respuesta de un GET
type Products = InferResponse<AppRouter, 'v1/products', 'GET'>
// → Product[]

// El tipo de cuerpo de un POST
type CreateProductDto = InferBody<AppRouter, 'v1/products', 'POST'>
// → { name: string; price: number }
```

## Reutilizar schemas entre frontend y backend

Definí tus schemas Zod una vez y compartilos entre ambas capas:

```ts
// shared/schemas/product.ts
import { z } from 'zod'

export const ProductSchema = z.object({
  id:    z.string().uuid(),
  name:  z.string().min(1).max(100),
  price: z.number().positive(),
})

export type Product = z.infer<typeof ProductSchema>
```

`z.infer<typeof ProductSchema>` extrae el tipo TypeScript del schema, así definís la forma **una sola vez** y obtenés validación en runtime y tipos estáticos gratis.

## Crear un singleton de API tipado

Creá una única instancia tipada del cliente y exportala en toda tu app:

```ts
// lib/api.ts
import { Weld } from 'weld-http'
import type { AppRouter } from '../types/router'

export const api = new Weld<AppRouter>(
  import.meta.env.VITE_API_URL,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    },
  }
)
```

Importá `api` donde lo necesites — todas las rutas, cuerpos y respuestas permanecen completamente tipados.
