---
title: Neon Theme Engine
description: Customize the WELD visual system via WeldProvider.
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

## Per-component neon prop

| Value | Behavior |
|---|---|
| `true` (default) | Plasma active on interactions |
| `{ color, intensity }` | Custom plasma color and glow strength |
| `false` | Weld styles applied, no glow effects |
| `'none'` | No styles — bring your own CSS |
