---
title: Router Setup
description: Add client-side routing to your WELD app.
---

Install:

```bash
npm install @weldjs/router
```

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
