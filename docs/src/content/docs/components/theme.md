---
title: Neon Theme Engine
description: Customize the WELD visual system — neon effects, 3D tilt, and design tokens.
---

WELD's aesthetic is **structure invisible, interactions weld with light**. At rest, components are dark and minimal. Neon activates only on focused inputs, loading buttons, active states, and network indicators.

## Customize via WeldProvider

```tsx
<WeldProvider
  theme={{
    primaryColor: '#a855f7',   // changes all plasma-cyan to purple
    accentColor:  '#ec4899',   // cobalt accent → pink
  }}
>
  <App />
</WeldProvider>
```

## Fine-grained token overrides

```tsx
<WeldProvider
  theme={{
    tokens: {
      '--weld-bg-base':     '#0a0a0f',
      '--weld-plasma-cyan': '#00ff88',
      '--weld-radius':      '8px',
    }
  }}
>
  <App />
</WeldProvider>
```

## Available CSS tokens

| Token | Default | Description |
|---|---|---|
| `--weld-bg-base` | `#09090b` | Page background |
| `--weld-bg-surface` | `#0d0d10` | Cards, panels |
| `--weld-bg-elevated` | `#111115` | Dropdowns, modals |
| `--weld-border` | `rgba(255,255,255,0.06)` | Default border |
| `--weld-plasma-cyan` | `#00d4ff` | Primary neon (focus, online, loading) |
| `--weld-plasma-cobalt` | `#3b6bff` | Accent neon |
| `--weld-text-primary` | `#f4f4f5` | Main text |
| `--weld-text-secondary` | `#a1a1aa` | Subtitles, labels |
| `--weld-text-muted` | `#52525b` | Placeholders, hints |
| `--weld-state-online` | `#00d4ff` | Network dot when connected |
| `--weld-state-offline` | `#ef4444` | Network dot when offline |
| `--weld-radius` | `5px` | Default border radius |
| `--weld-radius-lg` | `8px` | Cards, modals |

## Per-component `neon` prop

| Value | Behavior |
|---|---|
| `true` (default) | Plasma active on interactions |
| `{ color, intensity }` | Custom plasma color and glow strength |
| `false` | Weld styles applied, no glow effects |
| `'none'` | No styles — bring your own CSS |

---

## 3D Tilt effect

Components that support the `tilt` prop render a mouse-tracking 3D perspective effect on hover. It follows the same API shape as `neon` — opt-in, configurable, or fully disabled.

Available on: `Weld.Card`, `Weld.Button`, `Weld.Modal`.

```tsx
// Opt-in with defaults
<Weld.Card tilt>...</Weld.Card>

// Custom config
<Weld.Card tilt={{ max: 5, scale: 1.015, perspective: 800 }}>...</Weld.Card>

// Styles on, tilt off
<Weld.Card tilt={false}>...</Weld.Card>

// No effect, no will-change hint
<Weld.Card tilt="none">...</Weld.Card>
```

### `TiltConfig` options

| Option | Type | Default | Description |
|---|---|---|---|
| `max` | `number` | `8` | Max rotation in degrees |
| `scale` | `number` | `1.02` | Scale factor on hover |
| `perspective` | `number` | `900` | CSS perspective distance in px |
| `speed` | `number` | `200` | Transition duration in ms |

:::note
Each component uses slightly different defaults tuned to its size. `Button` uses `max: 6, scale: 1.03, perspective: 600`. `Modal` uses `max: 4, scale: 1.01, perspective: 1000`. Passing `tilt={true}` always applies those per-component defaults.
:::

### Per-component `tilt` prop

| Value | Behavior |
|---|---|
| `true` | Tilt active with per-component defaults |
| `{ max, scale, perspective, speed }` | Custom tilt config |
| `false` (default) | No tilt effect |
| `'none'` | No tilt, no `will-change` hint on the element |

:::tip
`tilt` is opt-in by default (`false`) on all components. WELD automatically disables tilt for users with `prefers-reduced-motion: reduce` set in their OS accessibility settings.
:::

### Using the hook directly

If you need tilt on a custom element, the underlying hook is exported:

```tsx
import { useTilt3D } from '@weldjs/react'

function MyCard({ tilt }) {
  const { ref, style } = useTilt3D(tilt)

  return (
    <div ref={ref} style={{ ...myStyles, ...style }}>
      content
    </div>
  )
}
```
