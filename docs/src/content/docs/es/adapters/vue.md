---
title: Adaptador Vue
description: Usando weld-http con Vue 3
---

El adaptador Vue convierte las señales WELD en objetos `ShallowRef` de Vue usando suscripciones directas. Las suscripciones se limpian automáticamente cuando el componente se desmonta a través de `onUnmounted`.

## Setup

Se requiere Vue 3.3+ como peer dependency.

```bash
npm install weld-http zod
```

## useWeld()

```ts
import { useWeld } from 'weld-http/vue'

const { data, status, error, loading } = useWeld(weldResponse)
```

### Retorna

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `data` | `ShallowRef<T \| null>` | Los datos de respuesta validados |
| `status` | `ShallowRef<WeldStatus>` | Estado actual de la petición |
| `error` | `ShallowRef<Error \| null>` | Error si la petición falló |
| `loading` | `ShallowRef<boolean>` | Atajo para `status === 'loading'` |

## Ejemplo

```vue
<script setup lang="ts">
import { Weld } from 'weld-http'
import { useWeld } from 'weld-http/vue'
import { z } from 'zod'

const api = new Weld('https://api.ejemplo.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

const { data, loading, error } = useWeld(
  api.get('v1/products', z.array(ProductSchema))
)
</script>

<template>
  <p v-if="loading">Cargando productos...</p>
  <p v-else-if="error">Error al cargar: {{ error.message }}</p>
  <ul v-else>
    <li v-for="product in data" :key="product.id">
      <strong>{{ product.name }}</strong> — ${{ product.price }}
    </li>
  </ul>
</template>
```
