---
title: Resumen de Componentes UI
description: WELD incluye un conjunto completo de componentes UI listos para usar.
---

WELD incluye una librería completa de componentes accesible a través del namespace `Weld`. No se necesitan instalaciones adicionales — todo viene con `@weldjs/react`.

```tsx
import { Weld } from '@weldjs/react'
```

## Categorías de Componentes

| Categoría | Componentes |
|---|---|
| **Layout** | `Shell`, `Header`, `Sidebar`, `Main`, `Footer` |
| **Estructura** | `Section`, `Card`, `Stack`, `Grid`, `Divider`, `Container` |
| **Tipografía** | `Heading`, `Text`, `Badge` |
| **Formularios** | `Button`, `Input` |
| **Feedback** | `Alert`, `Spinner`, `Skeleton`, `Empty`, `ToastProvider` |
| **Overlay** | `Modal`, `Tooltip`, `Dropdown` |
| **Navegación** | `Breadcrumb`, `Avatar`, `Tabs` |
| **Datos** | `Table`, `Stat` |

## El Motor de Tema Neon

Todos los componentes soportan tres niveles de estilo:

```tsx
// Nivel 1 — por defecto, neon en estados activos
<Weld.Button>Guardar</Weld.Button>

// Nivel 2 — color plasma personalizado
<Weld.Button neon={{ color: '#a855f7', intensity: 0.8 }}>Guardar</Weld.Button>

// Nivel 3 — sin estilos (BYO CSS / Tailwind)
<Weld.Button neon="none">Guardar</Weld.Button>
```

En reposo, los componentes son estructura invisible. El neon se activa solo en foco, carga, hover y cambios de estado de red.
