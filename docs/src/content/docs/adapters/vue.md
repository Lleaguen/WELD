---
title: Vue Adapter
description: Using weld-http with Vue 3
---

The Vue adapter converts WELD signals into Vue `ShallowRef` objects using direct signal subscriptions. Subscriptions are cleaned up automatically when the component unmounts via `onUnmounted`.

## Setup

Vue 3.3+ is required as a peer dependency.

```bash
npm install weld-http zod
```

## useWeld()

```ts
import { useWeld } from 'weld-http/vue'

const { data, status, error, loading } = useWeld(weldResponse)
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `ShallowRef<T \| null>` | The validated response data |
| `status` | `ShallowRef<WeldStatus>` | Current request status |
| `error` | `ShallowRef<Error \| null>` | Error if the request failed |
| `loading` | `ShallowRef<boolean>` | Shorthand for `status === 'loading'` |

## Example

```vue
<script setup lang="ts">
import { Weld } from 'weld-http'
import { useWeld } from 'weld-http/vue'
import { z } from 'zod'

const api = new Weld('https://api.example.com')

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
  <p v-if="loading">Loading products...</p>
  <p v-else-if="error">Failed to load: {{ error.message }}</p>
  <ul v-else>
    <li v-for="product in data" :key="product.id">
      <strong>{{ product.name }}</strong> — ${{ product.price }}
    </li>
  </ul>
</template>
```

## Mutations

```vue
<script setup lang="ts">
import { ref } from 'vue'

const name  = ref('')
const price = ref(0)

async function handleSubmit() {
  const { promise } = api.post('v1/products', ProductSchema, {
    body: { name: name.value, price: price.value },
  })
  await promise
}
</script>
```
