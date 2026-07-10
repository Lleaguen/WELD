/**
 * @weldjs/react — <Weld.Spinner /> + <Weld.Skeleton />
 *
 * Loading state primitives.
 *
 * Usage:
 *   <Weld.Spinner />
 *   <Weld.Spinner size="lg" label="Fetching data..." />
 *   <Weld.Skeleton width="100%" height={20} />
 *   <Weld.Skeleton variant="text" lines={3} />
 */

import React from 'react'

// ─── Spinner ──────────────────────────────────────────────────────────────────

if (typeof document !== 'undefined') {
  const id = '__weld_spinner__'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes _weld-rotate { to { transform: rotate(360deg); } }
      @keyframes _weld-shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `
    document.head.appendChild(s)
  }
}

export interface WeldSpinnerProps {
  size?:  'sm' | 'md' | 'lg'
  label?: string
  style?: React.CSSProperties
}

const spinnerSizes = { sm: 14, md: 20, lg: 28 }

export function Spinner({ size = 'md', label, style }: WeldSpinnerProps) {
  const px = spinnerSizes[size]

  return (
    <div
      data-weld-spinner
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        gap:        '8px',
        ...style,
      }}
    >
      <span style={{
        width:        `${px}px`,
        height:       `${px}px`,
        borderRadius: '50%',
        border:       `${size === 'lg' ? 2.5 : 2}px solid rgba(255,255,255,0.08)`,
        borderTopColor: 'var(--weld-plasma-cyan, #00d4ff)',
        display:      'inline-block',
        flexShrink:   0,
        animation:    '_weld-rotate 0.65s linear infinite',
      }} />
      {label && (
        <span style={{
          fontSize:  size === 'sm' ? '0.75rem' : '0.8125rem',
          color:     'var(--weld-text-muted, #52525b)',
        }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export interface WeldSkeletonProps {
  width?:   number | string
  height?:  number | string
  variant?: 'rect' | 'circle' | 'text'
  /** Number of text lines (only for variant="text") */
  lines?:   number
  style?:   React.CSSProperties
}

export function Skeleton({ width, height, variant = 'rect', lines = 3, style }: WeldSkeletonProps) {
  const shimmer: React.CSSProperties = {
    background:           'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize:       '200% 100%',
    animation:            '_weld-shimmer 1.6s ease-in-out infinite',
    borderRadius:         variant === 'circle' ? '50%' : 'var(--weld-radius, 5px)',
  }

  if (variant === 'text') {
    return (
      <div data-weld-skeleton style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{
            ...shimmer,
            height: '13px',
            width:  i === lines - 1 ? '60%' : '100%',
          }} />
        ))}
      </div>
    )
  }

  return (
    <div
      data-weld-skeleton
      style={{
        ...shimmer,
        width:  width ?? '100%',
        height: height ?? '16px',
        ...style,
      }}
    />
  )
}
