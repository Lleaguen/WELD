---
title: Tipos Compartidos
description: Compartí el tipo AppRouter entre servidor y cliente para seguridad de tipos E2E.
---

Este es el valor central de WELD — tu frontend sabe exactamente qué devuelve tu backend, en tiempo de compilación.

## Setup fullstack

```
mi-app/
  server/
    index.ts      ← WeldServer + export type AppRouter
  src/
    lib/api.ts    ← new Weld<AppRouter>(...)
```

**server/index.ts:**
```ts
import { WeldServer } from '@weldjs/server'
import { z } from 'zod'

export const UserSchema = z.object({
  id:    z.number(),
  name:  z.string(),
  email: z.string(),
})

const server = new WeldServer({ port: 3000 })

server.get('users',     z.array(UserSchema), async () => getUsers())
server.get('users/:id', UserSchema,          async (req) => getUser(req.params.id))
server.post('users',    UserSchema,          async (req) => createUser(req.body))

export type AppRouter = typeof server.router

server.listen()
```

**src/lib/api.ts:**
```ts
import type { AppRouter } from '../../server'
import { Weld } from '@weldjs/http'

export const api = new Weld<AppRouter>(
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
)
```

Ahora en tus componentes:
```tsx
// TypeScript sabe que `data` es `{ id: number, name: string, email: string }[]`
const { data } = useWeld(api.get('users', UserArraySchema))
```
