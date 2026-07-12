---
title: WeldServer
description: Define typed backend endpoints with @weldjs/server.
---

Install:

```bash
npm install @weldjs/server
```

## Basic usage

```ts
import { WeldServer } from '@weldjs/server'
import { z } from 'zod'

const server = new WeldServer({ port: 3000 })

server.get('users', z.array(UserSchema), async () => {
  return db.users.findAll()
})

server.post('users', UserSchema, async (req) => {
  return db.users.create(req.body)
})

server.listen()
```

## Sharing types with the frontend

Export the router type and import it in your client:

```ts
// server/index.ts
export type AppRouter = typeof server.router

// client/lib/api.ts
import type { AppRouter } from '../../server'
import { Weld } from '@weldjs/http'

export const api = new Weld<AppRouter>('http://localhost:3000')
```

Now `api.get()` and `api.post()` are fully typed against your server routes.
