---
title: Server Routes
description: Define GET, POST, PUT, PATCH and DELETE routes in WeldServer.
---

## All HTTP methods

```ts
server.get('users',        UserArraySchema, async () => db.users.findAll())
server.get('users/:id',    UserSchema,      async (req) => db.users.find(req.params.id))
server.post('users',       UserSchema,      async (req) => db.users.create(req.body))
server.put('users/:id',    UserSchema,      async (req) => db.users.replace(req.params.id, req.body))
server.patch('users/:id',  UserSchema,      async (req) => db.users.update(req.params.id, req.body))
server.delete('users/:id', z.null(),        async (req) => { await db.users.delete(req.params.id); return null })
```

## Request object

```ts
interface WeldRequest<TBody> {
  body:    TBody
  params:  Record<string, string>   // URL params (:id)
  query:   Record<string, string>   // ?key=value
  headers: Record<string, string>
  url:     string
  method:  HttpMethod
}
```

## Response helpers

```ts
server.get('users', UserArraySchema, async (req, res) => {
  if (!req.headers['authorization']) {
    res.error('Unauthorized', 401)
    return
  }
  return db.users.findAll()
})
```

## CORS

CORS is enabled by default (`*`). Restrict origins:

```ts
const server = new WeldServer({
  cors: { origins: ['https://myapp.com'] }
})
```
