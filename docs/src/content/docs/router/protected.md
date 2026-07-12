---
title: Protected Routes
description: Guard routes behind authentication with ProtectedRoute.
---

```tsx
import { ProtectedRoute } from '@weldjs/router'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <WeldRouter>
      <Route path="/login" component={Login} />

      <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/users"     component={Users} />
      </ProtectedRoute>
    </WeldRouter>
  )
}
```

| Prop | Type | Default |
|---|---|---|
| `isAllowed` | `boolean` | required |
| `redirectTo` | `string` | `'/login'` |
| `component` | `ComponentType` | — |
| `children` | `ReactNode` | — |

If `isAllowed` is `false`, the user is redirected to `redirectTo` immediately. No flash of protected content.
