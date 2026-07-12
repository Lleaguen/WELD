---
title: Routes & Params
description: Define routes with dynamic params in @weldjs/router.
---

## Static routes

```tsx
<Route path="/"        component={Home} />
<Route path="/about"   component={About} />
<Route path="/contact" component={Contact} />
```

## Dynamic params

Use `:paramName` syntax:

```tsx
<Route path="/users/:id"           component={UserDetail} />
<Route path="/posts/:slug/comments" component={PostComments} />
```

Access params in the component via `useParams`:

```tsx
import { useParams } from '@weldjs/router'

function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const { data } = useWeld(api.get(`users/${id}`, UserSchema))
  // ...
}
```

Or as direct props when using the `component` prop:

```tsx
function UserDetail({ id }: { id: string }) {
  // id is injected from the URL
}
```

## Inline children

```tsx
<Route path="/dashboard">
  <Weld.Main>
    <Dashboard />
  </Weld.Main>
</Route>
```
