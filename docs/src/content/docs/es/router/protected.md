---
title: Rutas Protegidas
description: Protegé rutas detrás de autenticación con ProtectedRoute.
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

| Prop | Tipo | Por defecto |
|---|---|---|
| `isAllowed` | `boolean` | requerido |
| `redirectTo` | `string` | `'/login'` |
| `component` | `ComponentType` | — |
| `children` | `ReactNode` | — |

Si `isAllowed` es `false`, el usuario es redirigido a `redirectTo` inmediatamente. Sin flash de contenido protegido.
