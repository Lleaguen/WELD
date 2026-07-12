---
title: WeldServer
description: Definí endpoints de backend tipados con @weldjs/server.
---

Instalar:

```bash
npm install @weldjs/server
```

## Uso básico

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

## Compartir tipos con el frontend

Exportá el tipo del router e importalo en tu cliente:

```ts
// server/index.ts
export type AppRouter = typeof server.router

// client/lib/api.ts
import type { AppRouter } from '../../server'
import { Weld } from '@weldjs/http'

export const api = new Weld<AppRouter>('http://localhost:3000')
```

Ahora `api.get()` y `api.post()` están completamente tipados contra tus rutas del servidor.
