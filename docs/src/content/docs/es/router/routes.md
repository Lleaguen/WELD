---
title: Rutas y Parámetros
description: Definí rutas con parámetros dinámicos en @weldjs/router.
---

## Rutas estáticas

```tsx
<Route path="/"         component={Home} />
<Route path="/about"    component={About} />
<Route path="/contact"  component={Contact} />
```

## Parámetros dinámicos

Usá la sintaxis `:paramName`:

```tsx
<Route path="/users/:id"              component={UserDetail} />
<Route path="/posts/:slug/comments"   component={PostComments} />
```

Accedé a los params en el componente con `useParams`:

```tsx
import { useParams } from '@weldjs/router'

function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const { data } = useWeld(api.get(`users/${id}`, UserSchema))
  // ...
}
```

## Children inline

```tsx
<Route path="/dashboard">
  <Weld.Main>
    <Dashboard />
  </Weld.Main>
</Route>
```
