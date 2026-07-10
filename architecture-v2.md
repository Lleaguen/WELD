# WELD v2 — Arquitectura Framework Completo

## Visión

WELD evoluciona de cliente HTTP a **Framework de Infraestructura Unificado**.
La red, el tipado E2E, la validación, el estado de sincronización y el DOM semántico
se fusionan en un único sistema cohesivo bajo el scope `@weld`.

---

## Monorepo: Estructura de Paquetes

```
weld/
├── packages/
│   ├── core/              # @weld/core — Motor HTTP, pipeline, signals, offline
│   ├── react/             # @weld/react — Componentes UI + hooks para React
│   ├── vue/               # @weld/vue — (v3) Composables + componentes
│   ├── solid/             # @weld/solid — (v3) Primitivos nativos
│   ├── angular/           # @weld/angular — (v3) Observables + directivas
│   │
│   ├── theme/             # @weld/theme — Neon Theme Engine (CSS vars + tokens)
│   │
│   └── weld-http/         # weld-http — Re-export ligero del core (backward compat)
│
├── docs/                  # Doc site Astro + Starlight
└── examples/
    ├── next-app/
    ├── vite-react/
    └── nuxt/
```

---

## @weld/core (sin cambios de API, solo se amplía)

Sigue siendo el motor. Agrega:
- `WeldProvider` context (configuración global, router adapter, theme)
- Exports de tipos para el sistema de componentes

---

## @weld/react — Estructura interna

```
packages/react/src/
│
├── index.ts                    # Entry point público
│
├── hooks/
│   ├── useWeld.ts              # Hook reactivo existente (sin cambios)
│   ├── useWeldForm.ts          # Gestión de formularios conectados a Zod + red
│   └── useWeldNav.ts           # Genera árbol de navegación desde AppRouter
│
├── components/
│   │
│   ├── provider/
│   │   └── WeldProvider.tsx    # Context global: config, routerAdapter, theme
│   │
│   ├── primitives/             # Átomos — sin estilos, solo lógica
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   ├── Link.tsx
│   │   └── Select.tsx
│   │
│   ├── ui/                     # Moléculas — primitivos + Neon Theme aplicado
│   │   ├── Input.tsx           # <Weld.Input /> con glow en focus
│   │   ├── Button.tsx          # <Weld.Button /> con plasma pulse en loading
│   │   ├── Link.tsx            # <Weld.Link /> tipado contra AppRouter
│   │   └── Select.tsx
│   │
│   ├── layout/                 # Organismos de layout semántico
│   │   ├── Header.tsx          # <Weld.Header position="top|left" neon? fixed? />
│   │   ├── Sidebar.tsx         # <Weld.Sidebar position="left|right" collapsible? />
│   │   ├── Main.tsx            # <Weld.Main />
│   │   ├── Footer.tsx          # <Weld.Footer />
│   │   └── Shell.tsx           # <Weld.Shell /> — composición completa de layout
│   │
│   └── navigation/
│       ├── Navigation.tsx      # <Weld.Navigation source="automatic|manual" />
│       └── NavItem.tsx
│
├── adapters/                   # Router adapters
│   ├── types.ts                # RouterAdapter interface
│   ├── nextjs.ts               # NextjsAdapter
│   └── reactRouter.ts         # ReactRouterAdapter
│
└── theme/
    └── context.ts              # ThemeContext — acceso a tokens desde componentes
```

---

## Sistema de Componentes: Capas

```
┌─────────────────────────────────────────────────────┐
│  CAPA 3 — UI Components (@weld/react ui/)           │
│  Primitivos + Neon Theme Engine aplicado             │
│  <Weld.Input /> <Weld.Button /> <Weld.Layout />     │
├─────────────────────────────────────────────────────┤
│  CAPA 2 — Primitives (@weld/react primitives/)      │
│  Lógica pura sin estilos — headless                  │
│  Estado de red, Zod, offline, responsive logic       │
├─────────────────────────────────────────────────────┤
│  CAPA 1 — @weld/core                                │
│  Pipeline HTTP, signals, deduplicación, IndexedDB    │
└─────────────────────────────────────────────────────┘
```

Esto permite:
- Usar solo `@weld/core` → cliente HTTP puro (sin UI)
- Usar primitivos headless → BYO styles (Tailwind, CSS Modules, etc.)
- Usar componentes UI completos → Neon Theme Engine incluido

---

## Neon Theme Engine (@weld/theme)

### Tokens base

```ts
// Fondos ultra oscuros — estética Vercel/Linear
--weld-bg-base:       #09090b
--weld-bg-surface:    #111113
--weld-bg-elevated:   #18181b

// Bordes sutiles
--weld-border:        rgba(255,255,255,0.08)
--weld-border-hover:  rgba(255,255,255,0.15)

// Neón — solo en estados activos/interactivos
--weld-neon-primary:  #00d4ff   // cian reactivo
--weld-neon-accent:   #3b5bdb   // azul cobalto
--weld-neon-glow:     0 0 12px rgba(0,212,255,0.35)

// Texto
--weld-text-primary:  #fafafa
--weld-text-muted:    #71717a

// Estados de red
--weld-online:        #00d4ff
--weld-offline:       #ef4444
--weld-loading:       #f59e0b
```

### Los 3 niveles de configuración

**Nivel 1 — Zero-Config**
```tsx
<Weld.Header fixed neon />
// Aplica gradientes por defecto: cian + azul cobalto
// Sombras con resplandor luminiscente nativo
```

**Nivel 2 — Ajuste fino**
```tsx
<Weld.Header neon={{ color: 'magenta', intensity: 0.5 }} />
// Modifica variables de color y dispersión del filtro CSS
// Mantiene consistencia estructural y responsive
```

**Nivel 3 — Override total (apaga SOLO el diseño)**
```tsx
<Weld.Header position="top" className="my-header" style-color="none" />
// Desactiva el motor estético completamente
// MANTIENE: posición, responsive, layout estructural
// El desarrollador inyecta sus propios estilos
```

---

## Componentes de Layout

### `<Weld.Shell />`

Composición completa — el punto de entrada del layout.

```tsx
<Weld.Shell>
  <Weld.Header position="top" fixed neon />
  <Weld.Sidebar position="left" collapsible />
  <Weld.Main />
  <Weld.Footer />
</Weld.Shell>
```

### Posicionamiento

| Componente | `position` válidos | Default |
|---|---|---|
| `Weld.Header` | `"top"` | `"top"` |
| `Weld.Sidebar` | `"left"` \| `"right"` | `"left"` |
| `Weld.Footer` | `"bottom"` | `"bottom"` |

El `position` se respeta en todos los niveles de tema, incluyendo Nivel 3.

### Responsive predefinido

Cada componente de layout tiene breakpoints integrados:

```
Mobile  (< 768px):  Sidebar oculto → drawer deslizable desde el borde
Tablet  (768-1024): Sidebar colapsado → solo íconos
Desktop (> 1024px): Sidebar expandido con labels
```

```tsx
// Responsive automático — no necesitás escribir media queries
<Weld.Sidebar
  position="left"
  responsive={{
    mobile:  'drawer',    // default
    tablet:  'collapsed', // default
    desktop: 'expanded',  // default
  }}
/>
```

---

## Componentes Interactivos

### `<Weld.Input />`

```tsx
// Texto
<Weld.Input type="text" label="Email" schema={EmailSchema} />

// Textarea — mutación automática
<Weld.Input type="multiline" label="Descripción" />

// Select
<Weld.Input type="select" options={['A', 'B', 'C']} />

// Date con validación de rango
<Weld.Input type="date" min="2024-01-01" schema={DateRangeSchema} />
```

Estados visuales:
- `idle` → borde sutil `rgba(255,255,255,0.08)`
- `focus` → glow cian difuminado `box-shadow: 0 0 0 1px #00d4ff, 0 0 12px rgba(0,212,255,0.25)`
- `error` → glow rojo `0 0 0 1px #ef4444`
- `valid` → borde verde sutil

### `<Weld.Button />`

```tsx
<Weld.Button
  action={() => api.post('v1/orders', Schema, { body: orderData })}
>
  Crear Orden
</Weld.Button>
```

Estados automáticos — sin código adicional del usuario:
- `idle` → botón normal
- `loading` → deshabilitado + pulso de plasma animado
- `success` → checkmark breve
- `error` → shake + color rojo

### `<Weld.Link />`

```tsx
// Tipado contra AppRouter — error de compilación si la ruta no existe
<Weld.Link to="v1/products" adapter={NextjsAdapter}>
  Ver productos
</Weld.Link>
```

---

## Navegación Autogenerada

```tsx
// Genera todos los links del AppRouter automáticamente
<Weld.Navigation
  source="automatic"
  adapter={NextjsAdapter}
/>

// O manual con type safety
<Weld.Navigation source="manual">
  <Weld.NavItem to="v1/products" icon={BoxIcon} label="Productos" />
  <Weld.NavItem to="v1/users"    icon={UserIcon} label="Usuarios" />
</Weld.Navigation>
```

### Router Adapters

```ts
// Next.js App Router
import { NextjsAdapter } from '@weld/react/adapters/nextjs'

// React Router v6
import { ReactRouterAdapter } from '@weld/react/adapters/react-router'

// Custom
const MyAdapter: RouterAdapter = {
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  navigate: (to) => window.location.href = to,
}
```

---

## API de Uso Completo

```tsx
import { Weld, WeldProvider } from '@weld/react'
import { NextjsAdapter } from '@weld/react/adapters/nextjs'
import { api } from '../lib/api'

// Configuración global en el root
export function RootLayout({ children }) {
  return (
    <WeldProvider
      client={api}
      routerAdapter={NextjsAdapter}
      theme={{ mode: 'neon', primaryColor: '#00d4ff' }}
    >
      {children}
    </WeldProvider>
  )
}

// Dashboard completo
export function DashboardShell() {
  return (
    <Weld.Shell>
      <Weld.Header position="top" fixed neon>
        <Weld.Navigation source="automatic" />
      </Weld.Header>

      <Weld.Sidebar position="left" collapsible>
        <Weld.Navigation source="manual">
          <Weld.NavItem to="v1/products" label="Productos" />
          <Weld.NavItem to="v1/users"    label="Usuarios" />
        </Weld.Navigation>
      </Weld.Sidebar>

      <Weld.Main>
        {/* Contenido de la página */}
      </Weld.Main>
    </Weld.Shell>
  )
}
```

---

## Roadmap v2

| Fase | Paquete | Alcance |
|---|---|---|
| **v2.0 — Core UI** | `@weld/react` | Primitivos, Button, Input, theme tokens |
| **v2.1 — Layout** | `@weld/react` | Shell, Header, Sidebar, Main, Footer |
| **v2.2 — Navigation** | `@weld/react` | Navigation, NavItem, router adapters |
| **v2.3 — Forms** | `@weld/react` | useWeldForm, validación form-to-API |
| **v2.4 — Vue** | `@weld/vue` | Port de componentes a Vue 3 |
| **v3.0 — Stable** | todos | Solid, Angular, docs completas |
