---
title: Configuración del Router
description: Agregá enrutamiento del lado del cliente a tu app WELD.
---

Instalar:

```bash
npm install @weldjs/router
```

## Configuración básica

Envolvé tu app con `WeldRouter` dentro de tu `Shell`:

```tsx
import { WeldRouter, Route } from '@weldjs/router'
import { Weld, WeldProvider } from '@weldjs/react'

export function App() {
  return (
    <WeldProvider>
      <Weld.Shell>
        <Weld.Header fixed>Mi App</Weld.Header>
        <div style={{ display: 'flex' }}>
          <Weld.Sidebar>
            {/* navegación */}
          </Weld.Sidebar>
          <WeldRouter>
            <Route path="/"          component={Home} />
            <Route path="/users"     component={Users} />
            <Route path="/users/:id" component={UserDetail} />
          </WeldRouter>
        </div>
        <Weld.ToastProvider />
      </Weld.Shell>
    </WeldProvider>
  )
}
```

## Base path

Para apps desplegadas en una sub-ruta:

```tsx
<WeldRouter base="/mi-app">
  <Route path="/" component={Home} />
</WeldRouter>
```
