---
title: Motor de Tema Neon
description: Personalizá el sistema visual de WELD a través de WeldProvider.
---

La estética de WELD es **estructura invisible, interacciones que se sueldan con luz**. En reposo, los componentes son oscuros y minimalistas. El neon se activa solo en inputs enfocados, botones cargando, estados activos e indicadores de red.

## Personalizar con WeldProvider

```tsx
<WeldProvider
  theme={{
    primaryColor: '#a855f7',   // cambia todo el plasma-cyan a violeta
    accentColor:  '#ec4899',   // acento cobalt → rosa
  }}
>
  <App />
</WeldProvider>
```

## Overrides de tokens granulares

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

## Tokens CSS disponibles

| Token | Por defecto | Descripción |
|---|---|---|
| `--weld-bg-base` | `#09090b` | Fondo de página |
| `--weld-bg-surface` | `#0d0d10` | Cards, paneles |
| `--weld-bg-elevated` | `#111115` | Dropdowns, modales |
| `--weld-border` | `rgba(255,255,255,0.06)` | Borde por defecto |
| `--weld-plasma-cyan` | `#00d4ff` | Neon primario (foco, online, carga) |
| `--weld-plasma-cobalt` | `#3b6bff` | Neon de acento |
| `--weld-text-primary` | `#f4f4f5` | Texto principal |
| `--weld-text-secondary` | `#a1a1aa` | Subtítulos, etiquetas |
| `--weld-text-muted` | `#52525b` | Placeholders, hints |
| `--weld-state-online` | `#00d4ff` | Punto de red cuando está conectado |
| `--weld-state-offline` | `#ef4444` | Punto de red cuando está desconectado |
| `--weld-radius` | `5px` | Radio de borde por defecto |
| `--weld-radius-lg` | `8px` | Cards, modales |

## Prop neon por componente

| Valor | Comportamiento |
|---|---|
| `true` (por defecto) | Plasma activo en interacciones |
| `{ color, intensity }` | Color plasma personalizado e intensidad de glow |
| `false` | Estilos WELD aplicados, sin efectos de glow |
| `'none'` | Sin estilos — traé tu propio CSS |
