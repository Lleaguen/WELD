---
title: Router Setup
description: Add client-side routing to your WELD app.
---

Install:

```bash
npm install @weldjs/router
```

## Provider Tree

Every WELD app follows this structure. Getting this wrong is the most common source of errors:

```
<WeldProvider>          ← Required. Wrap your entire app. Provides theme + context.
  <Weld.Shell>          ← Root layout. Sets dark background + full-height flex.
    <Weld.Header />     ← Sticky top bar.
    <WeldRouter>        ← Client-side routing.
      <Route path="/" component={Home} />
    </WeldRouter>
    <Weld.Footer />     ← Bottom bar.
    <Weld.ToastProvider />  ← Toast notifications (place inside Shell, after content).
  </Weld.Shell>
</WeldProvider>
```

:::caution[Common mistake]
`Weld.Header`, `Weld.Sidebar`, `Weld.Main`, and `Weld.Footer` must be **inside** `<Weld.Shell>`.  
`Weld.Shell` must be **inside** `<WeldProvider>`.  
If you see an error about "useWeldContext" or "useShell", check this tree.
:::

## Basic Setup

Wrap your app with `WeldRouter` inside your `Shell`:

```tsx
import { WeldRouter, Route } from '@weldjs/router'
import { Weld, WeldProvider } from '@weldjs/react'

export function App() {
  return (
    <WeldProvider>
      <Weld.Shell>
        <Weld.Header fixed>My App</Weld.Header>
        <div style={{ display: 'flex' }}>
          <Weld.Sidebar>
            {/* navigation */}
          </Weld.Sidebar>
          <WeldRouter>
            <Route path="/"       component={Home} />
            <Route path="/users"  component={Users} />
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

For apps deployed at a sub-path:

```tsx
<WeldRouter base="/my-app">
  <Route path="/" component={Home} />
</WeldRouter>
```
