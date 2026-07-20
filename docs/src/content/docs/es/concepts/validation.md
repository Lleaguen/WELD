---
title: Validación en Runtime
description: Cómo WELD usa Zod para validar respuestas en la frontera de la red
---

Los tipos de TypeScript desaparecen en runtime. Una aserción de tipo como `data as Product[]` no verifica nada realmente — solo le dice al compilador que deje de quejarse.

WELD usa **esquemas Zod** en la frontera de la red para validar que lo que el servidor realmente envía coincide con el contrato que definiste. Si no coincide, WELD lanza un `WeldValidationError` antes de que los datos lleguen a tu UI.

## Uso básico

```ts
import { z } from 'zod'

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number().positive(),
})

const { promise } = api.get('v1/products', z.array(ProductSchema))

// Si el servidor envía { id: 1 } (número en vez de string),
// WELD lanza WeldValidationError — tu UI nunca ve datos incorrectos
```

## Modo sin configuración

El schema siempre es opcional. Sin él, WELD devuelve la respuesta cruda:

```ts
// Sin schema — devuelve unknown, sin validación
const { promise } = api.get('v1/products')
const data = await promise // tipo: unknown
```

Esta es la opción correcta para prototipos rápidos o cuando confiás completamente en la API.

## Manejo de errores de validación

```ts
import { WeldValidationError } from '@weldjs/http'

try {
  const products = await api.get('v1/products', z.array(ProductSchema)).promise
} catch (err) {
  if (err instanceof WeldValidationError) {
    console.error('La respuesta de la API no coincide con el schema:', err.issues)
  }
}
```

Con señales:

```ts
const { signal } = api.get('v1/products', z.array(ProductSchema))

signal.error.subscribe((err) => {
  if (err instanceof WeldValidationError) {
    // Mostrar UI de error de validación
  }
})
```

## Transformaciones Zod

Los schemas Zod pueden transformar datos mientras los validan. WELD aplica las transformaciones automáticamente:

```ts
const ProductSchema = z.object({
  id:         z.string(),
  name:       z.string().trim(),
  price:      z.number(),
  // Parsear string ISO a objeto Date
  created_at: z.string().transform((s) => new Date(s)),
})

const { promise } = api.get('v1/products', z.array(ProductSchema))
const products = await promise
// products[0].created_at es un Date, no un string
```

## Dónde encaja la validación en el pipeline

La validación siempre se ejecuta **después** de recibir la respuesta de red y **antes** de que los datos lleguen a tus señales o promise. Esto significa:

- Tu UI solo recibe datos válidos y tipados
- Los errores de validación se tratan exactamente como errores de red — establecen `status = 'error'` y poblan `signal.error`
