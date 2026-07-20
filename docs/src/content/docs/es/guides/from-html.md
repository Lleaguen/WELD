---
title: De HTML a WELD
description: Una guía de migración paso a paso para developers que ya conocen HTML, CSS y JavaScript.
---

Si construiste una página con HTML puro y `fetch`, ya sabés la mayor parte de lo que necesitás. Esta guía toma una página HTML real y la migra a WELD paso a paso.

## Punto de partida — HTML puro

Acá hay una página simple de listado de productos. Sin framework, solo HTML y `fetch`:

```html
<!DOCTYPE html>
<html>
  <head><title>Mi App</title></head>
  <body>
    <header>Mi App</header>
    <main id="content">Cargando...</main>
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

Funciona, pero hay algunos problemas:

- Si el servidor devuelve datos incorrectos, la app falla silenciosamente.
- No hay un estado de carga real — los usuarios ven "Cargando..." para siempre si la petición falla.
- No hay soporte offline — la página está en blanco sin conexión.
- Todo son strings. TypeScript no puede ayudarte aquí.

Vamos a solucionar todo eso.

---

## Paso 1 — Instalar WELD

```bash
npm create weld-app@latest mi-app
cd mi-app
npm install
npm run dev
```

Esto te da una app de React con WELD ya configurado.

---

## Paso 2 — La misma UI en componentes WELD

El `<header>` se convierte en `<Weld.Header>`. El `<main>` se convierte en `<Weld.Main>`. Envolvé todo en `<WeldProvider>` y `<Weld.Shell>`:

```tsx
import { Weld, WeldProvider } from '@weldjs/react'

export function App() {
  return (
    <WeldProvider>
      <Weld.Shell>
        <Weld.Header>Mi App</Weld.Header>
        <Weld.Main>
          <ProductList />
        </Weld.Main>
      </Weld.Shell>
    </WeldProvider>
  )
}
```

Eso es todo para el layout. `Weld.Shell` maneja el fondo oscuro y el flex de altura completa. `Weld.Header` es sticky. No escribís ningún CSS.

---

## Paso 3 — El mismo fetch en useWeld

Primero, definí un esquema que describe cómo luce un producto. Este es el paso clave — WELD lo usa para validar la respuesta del servidor en tiempo de ejecución:

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

Luego usá `useWeld` en lugar de `fetch` + `useEffect`:

```tsx
import { useWeld } from '@weldjs/http/react'

export function ProductList() {
  const { data, loading, error } = useWeld(
    () => api.get('v1/products', z.array(ProductSchema)),
    []
  )

  if (loading) return <p>Cargando productos...</p>
  if (error)   return <p>Error al cargar: {error.message}</p>

  return (
    <div>
      {data?.map(p => (
        <div key={p.id}>{p.name} — ${p.price}</div>
      ))}
    </div>
  )
}
```

Compará esto con el código `fetch` original. La lógica es casi idéntica — pero ahora:

- `loading` está incorporado. No más string "Cargando..." pegado en pantalla.
- `error` está incorporado. Si la petición falla, mostrás el mensaje automáticamente.
- `data` está tipado. TypeScript sabe que es `{ id: string, name: string, price: number }[]`.

---

## Paso 4 — Qué ganaste

| | HTML puro + fetch | WELD |
|---|---|---|
| Estado de carga | Manual (string `"Cargando..."`) | Automático (booleano `loading`) |
| Manejo de errores | Manual (`.catch` + actualización del DOM) | Automático (objeto `error`) |
| Seguridad de tipos | Ninguna | Completa — TypeScript conoce la forma |
| Validación en runtime | Ninguna | Esquema Zod verifica cada respuesta |
| Soporte offline | Ninguno | Última respuesta cacheada en IndexedDB |
| Deduplicación | Ninguna | Fetches concurrentes comparten una petición |

El código que escribís es aproximadamente del mismo tamaño. La protección que obtenés es dramáticamente mejor.

---

## Ejemplo completo

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

  if (loading) return <p>Cargando productos...</p>
  if (error)   return <p>Error al cargar: {error.message}</p>

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
        <Weld.Header>Mi App</Weld.Header>
        <Weld.Main>
          <ProductList />
        </Weld.Main>
      </Weld.Shell>
    </WeldProvider>
  )
}
```

## Próximos pasos

- [Configuración del Router](/es/router/setup) — agregá múltiples páginas
- [Formularios](/es/forms/use-form) — manejá input del usuario
- [Offline-First](/es/concepts/offline-first) — entendé cómo funciona el caché
