/**
 * @weldjs/react — <Weld.Divider />
 *
 * Horizontal or vertical separator.
 *
 * Usage:
 *   <Weld.Divider />
 *   <Weld.Divider label="OR" />
 *   <Weld.Divider orientation="vertical" />
 */

import React from 'react'

export interface WeldDividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?:       string
  style?:       React.CSSProperties
}

export function Divider({ orientation = 'horizontal', label, style }: WeldDividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        data-weld-divider
        style={{
          width:      '1px',
          alignSelf:  'stretch',
          background: 'var(--weld-border, rgba(255,255,255,0.06))',
          flexShrink: 0,
          ...style,
        }}
      />
    )
  }

  if (label) {
    return (
      <div
        data-weld-divider
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '12px',
          margin:     '20px 0',
          ...style,
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--weld-border, rgba(255,255,255,0.06))' }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--weld-text-muted, #52525b)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--weld-border, rgba(255,255,255,0.06))' }} />
      </div>
    )
  }

  return (
    <hr
      data-weld-divider
      style={{
        border:     'none',
        borderTop:  '1px solid var(--weld-border, rgba(255,255,255,0.06))',
        margin:     '20px 0',
        ...style,
      }}
    />
  )
}
