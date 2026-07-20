---
title: From HTML to WELD
description: A step-by-step migration guide for developers who already know HTML, CSS, and JavaScript.
---

If you've built a page with plain HTML and `fetch`, you already know most of what you need. This guide takes a real HTML page and migrates it to WELD step by step.

## Starting point — plain HTML

Here's a simple product listing page. No framework, just HTML and `fetch`:

```html
<!DOCTYPE html>
<html>
  <head><title>My App</title></head>
  <body>
    <header>My App</header>
    <main id="content">Loading...</main>
    <script>
      fetch('https://api.example.com/products')
        .then(r => r.json())
        .then(data => {
          document.getElementById('content').innerHTML =
            data.map(p => `<div>${p.name} — $${p.price}</div>`).join('')
        })
    </script>
  </body>
</html>
```

It works, but there are a few problems:

- If the server returns bad data, the app silently breaks.
- There's no real loading state — users see "Loading..." forever if the request fails.
- There's no offline support — the page is blank with no connection.
- Everything is strings. TypeScript can't help you here.

Let's fix all of that.

---

## Step 1 — Install WELD

```bash
npm create weld-app@latest my-app
cd my-app
npm install
npm run dev
```

This gives you a React app with WELD already configured.

---

## Step 2 — The same UI in WELD components

The `<header>` becomes `<Weld.Header>`. The `<main>` becomes `<Weld.Main>`. Wrap everything in `<WeldProvider>` and `<Weld.Shell>`:

```tsx
import { Weld, WeldProvider } from '@weldjs/react'

export function App() {
  return (
    <WeldProvider>
      <Weld.Shell>
        <Weld.Header>My App</Weld.Header>
        <Weld.Main>
          <ProductList />
        </Weld.Main>
      </Weld.Shell>
    </WeldProvider>
  )
}
```

That's it for the layout. `Weld.Shell` handles the dark background and full-height flex. `Weld.Header` is sticky. You don't write any CSS.

---

## Step 3 — The same fetch in useWeld

First, define a schema that describes what a product looks like. This is the key step — WELD uses this to validate the server's response at runtime:

```ts
import { z } from 'zod'
import { Weld } from '@weldjs/http'

const api = new Weld('https://api.example.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})
```

Then use `useWeld` instead of `fetch` + `useEffect`:

```tsx
import { useWeld } from '@weldjs/http/react'

export function ProductList() {
  const { data, loading, error } = useWeld(
    () => api.get('v1/products', z.array(ProductSchema)),
    []
  )

  if (loading) return <p>Loading products...</p>
  if (error)   return <p>Failed to load: {error.message}</p>

  return (
    <div>
      {data?.map(p => (
        <div key={p.id}>{p.name} — ${p.price}</div>
      ))}
    </div>
  )
}
```

Compare this to the original `fetch` code. The logic is almost identical — but now:

- `loading` is built in. No more "Loading..." string stuck on screen.
- `error` is built in. If the request fails, you show the message automatically.
- `data` is typed. TypeScript knows it's `{ id: string, name: string, price: number }[]`.

---

## Step 4 — What you gained

| | Plain HTML + fetch | WELD |
|---|---|---|
| Loading state | Manual (`"Loading..."` string) | Automatic (`loading` boolean) |
| Error handling | Manual (`.catch` + DOM update) | Automatic (`error` object) |
| Type safety | None | Full — TypeScript knows the shape |
| Runtime validation | None | Zod schema checks every response |
| Offline support | None | Last response cached in IndexedDB |
| Deduplication | None | Concurrent fetches share one request |

The code you write is roughly the same size. The protection you get is dramatically better.

---

## Full example

```tsx
import { Weld as WeldClient } from '@weldjs/http'
import { useWeld } from '@weldjs/http/react'
import { Weld, WeldProvider } from '@weldjs/react'
import { z } from 'zod'

const api = new WeldClient('https://api.example.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

function ProductList() {
  const { data, loading, error } = useWeld(
    () => api.get('v1/products', z.array(ProductSchema)),
    []
  )

  if (loading) return <p>Loading products...</p>
  if (error)   return <p>Failed to load: {error.message}</p>

  return (
    <div>
      {data?.map(p => (
        <div key={p.id}>{p.name} — ${p.price}</div>
      ))}
    </div>
  )
}

export function App() {
  return (
    <WeldProvider>
      <Weld.Shell>
        <Weld.Header>My App</Weld.Header>
        <Weld.Main>
          <ProductList />
        </Weld.Main>
      </Weld.Shell>
    </WeldProvider>
  )
}
```

## Next steps

- [Router Setup](/router/setup) — add multiple pages
- [Forms](/forms/use-form) — handle user input
- [Offline-First](/concepts/offline-first) — understand how the cache works
