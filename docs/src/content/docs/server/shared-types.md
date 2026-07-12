---
title: Shared Types
description: Share the AppRouter type between server and client for E2E type safety.
---

This is the core value of WELD — your frontend knows exactly what your backend returns, at compile time.

## Full-stack setup

```
my-app/
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

Now in your components:
```tsx
// TypeScript knows `data` is `{ id: number, name: string, email: string }[]`
const { data } = useWeld(api.get('users', UserArraySchema))
```
