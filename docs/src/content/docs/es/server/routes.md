---
title: Rutas del Servidor
description: Definí rutas GET, POST, PUT, PATCH y DELETE en WeldServer.
---

## Todos los métodos HTTP

```ts
server.get('users',        UserArraySchema, async () => db.users.findAll())
server.get('users/:id',    UserSchema,      async (req) => db.users.find(req.params.id))
server.post('users',       UserSchema,      async (req) => db.users.create(req.body))
server.put('users/:id',    UserSchema,      async (req) => db.users.replace(req.params.id, req.body))
server.patch('users/:id',  UserSchema,      async (req) => db.users.update(req.params.id, req.body))
server.delete('users/:id', z.null(),        async (req) => { await db.users.delete(req.params.id); return null })
```

## Objeto de petición

```ts
interface WeldRequest<TBody> {
  body:    TBody
  params:  Record<string, string>   // Params de URL (:id)
  query:   Record<string, string>   // ?clave=valor
  headers: Record<string, string>
  url:     string
  method:  HttpMethod
}
```

## Helpers de respuesta

```ts
server.get('users', UserArraySchema, async (req, res) => {
  if (!req.headers['authorization']) {
    res.error('No autorizado', 401)
    return
  }
  return db.users.findAll()
})
```

## CORS

CORS está habilitado por defecto (`*`). Restringí los orígenes:

```ts
const server = new WeldServer({
  cors: { origins: ['https://miapp.com'] }
})
```
