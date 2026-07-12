---
title: UI Components Overview
description: WELD ships a complete set of UI components out of the box.
---

WELD includes a full component library accessible via the `Weld` namespace. No extra installs needed — everything comes with `@weldjs/react`.

```tsx
import { Weld } from '@weldjs/react'
```

## Component Categories

| Category | Components |
|---|---|
| **Layout** | `Shell`, `Header`, `Sidebar`, `Main`, `Footer` |
| **Structure** | `Section`, `Card`, `Stack`, `Grid`, `Divider`, `Container` |
| **Typography** | `Heading`, `Text`, `Badge` |
| **Forms** | `Button`, `Input` |
| **Feedback** | `Alert`, `Spinner`, `Skeleton`, `Empty`, `ToastProvider` |
| **Overlay** | `Modal`, `Tooltip`, `Dropdown` |
| **Navigation** | `Breadcrumb`, `Avatar`, `Tabs` |
| **Data** | `Table`, `Stat` |

## The Neon Theme Engine

All components support three levels of styling:

```tsx
// Level 1 — default, neon on active states
<Weld.Button>Save</Weld.Button>

// Level 2 — custom plasma color
<Weld.Button neon={{ color: '#a855f7', intensity: 0.8 }}>Save</Weld.Button>

// Level 3 — no styles (BYO CSS / Tailwind)
<Weld.Button neon="none">Save</Weld.Button>
```

At rest, components are invisible structure. Neon activates only on focus, loading, hover, and network state changes.
