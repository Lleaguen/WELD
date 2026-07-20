---
title: Configuración del Router
description: Agregá enrutamiento del lado del cliente a tu app WELD.
---

Instalar:

```bash
npm install @weldjs/router
```

## Árbol de Proveedores

Cada app WELD sigue esta estructura. Equivocarse aquí es la fuente de errores más común:

```
<WeldProvider>          ← Requerido. Envuelve toda tu app. Provee tema + contexto.
  <Weld.Shell>          ← Layout raíz. Define fondo oscuro + flex de altura completa.
    <Weld.Header />     ← Barra superior fija.
    <WeldRouter>        ← Enrutamiento del lado del cliente.
      <Route path="/" component={Home} />
    </WeldRouter>
    <Weld.Footer />     ← Barra inferior.
    <Weld.ToastProvider />  ← Notificaciones toast (colocar dentro del Shell, después del contenido).
  </Weld.Shell>
</WeldProvider>
```

:::caution[Error común]
`Weld.Header`, `Weld.Sidebar`, `Weld.Main` y `Weld.Footer` deben estar **dentro** de `<Weld.Shell>`.  
`Weld.Shell` debe estar **dentro** de `<WeldProvider>`.  
Si ves un error sobre "useWeldContext" o "useShell", revisá este árbol.
:::

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
