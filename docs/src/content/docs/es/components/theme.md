---
title: Motor de Tema Neon
description: Personalizá el sistema visual de WELD — efectos neon, tilt 3D y design tokens.
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

## Prop `neon` por componente

| Valor | Comportamiento |
|---|---|
| `true` (por defecto) | Plasma activo en interacciones |
| `{ color, intensity }` | Color plasma personalizado e intensidad de glow |
| `false` | Estilos WELD aplicados, sin efectos de glow |
| `'none'` | Sin estilos — traé tu propio CSS |

---

## Efecto de tilt 3D

Los componentes que soportan la prop `tilt` renderizan un efecto de perspectiva 3D que sigue el movimiento del mouse al hacer hover. Sigue la misma forma de API que `neon` — opt-in, configurable, o completamente desactivable.

Disponible en: `Weld.Card`, `Weld.Button`, `Weld.Modal`.

```tsx
// Opt-in con valores por defecto
<Weld.Card tilt>...</Weld.Card>

// Config personalizada
<Weld.Card tilt={{ max: 5, scale: 1.015, perspective: 800 }}>...</Weld.Card>

// Estilos sí, tilt no
<Weld.Card tilt={false}>...</Weld.Card>

// Sin efecto y sin will-change
<Weld.Card tilt="none">...</Weld.Card>
```

### Opciones de `TiltConfig`

| Opción | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `max` | `number` | `8` | Rotación máxima en grados |
| `scale` | `number` | `1.02` | Factor de escala en hover |
| `perspective` | `number` | `900` | Distancia de perspectiva CSS en px |
| `speed` | `number` | `200` | Duración de la transición en ms |

:::note
Cada componente usa valores por defecto distintos ajustados a su tamaño. `Button` usa `max: 6, scale: 1.03, perspective: 600`. `Modal` usa `max: 4, scale: 1.01, perspective: 1000`. Pasar `tilt={true}` siempre aplica esos defaults por componente.
:::

### Prop `tilt` por componente

| Valor | Comportamiento |
|---|---|
| `true` | Tilt activo con defaults por componente |
| `{ max, scale, perspective, speed }` | Config de tilt personalizada |
| `false` (por defecto) | Sin efecto de tilt |
| `'none'` | Sin tilt y sin hint `will-change` en el elemento |

:::tip
`tilt` es opt-in por defecto (`false`) en todos los componentes. WELD desactiva automáticamente el tilt para usuarios con `prefers-reduced-motion: reduce` activado en la configuración de accesibilidad de su sistema operativo.
:::

### Usar el hook directamente

Si necesitás tilt en un elemento personalizado, el hook está exportado:

```tsx
import { useTilt3D } from '@weldjs/react'

function MiCard({ tilt }) {
  const { ref, style } = useTilt3D(tilt)

  return (
    <div ref={ref} style={{ ...misEstilos, ...style }}>
      contenido
    </div>
  )
}
```
