/**
 * @weldjs/react — <Weld.Badge />
 *
 * Inline status/label indicator.
 *
 * Usage:
 *   <Weld.Badge variant="success">Active</Weld.Badge>
 *   <Weld.Badge variant="error">Failed</Weld.Badge>
 *   <Weld.Badge dot>Online</Weld.Badge>
 */

import React, { type ReactNode } from 'react'

export interface WeldBadgeProps {
  children?:  ReactNode
  variant?:   'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** Show a colored dot before the text */
  dot?:       boolean
  className?: string
  style?:     React.CSSProperties
}

const badgeStyles: Record<NonNullable<WeldBadgeProps['variant']>, { bg: string; color: string; border: string; dot: string }> = {
  default: { bg: 'rgba(255,255,255,0.05)', color: 'var(--weld-text-secondary, #a1a1aa)', border: 'rgba(255,255,255,0.08)', dot: '#a1a1aa' },
  primary: { bg: 'rgba(0,212,255,0.08)',   color: 'var(--weld-plasma-cyan, #00d4ff)',    border: 'rgba(0,212,255,0.20)',    dot: '#00d4ff' },
  success: { bg: 'rgba(34,197,94,0.08)',   color: '#22c55e',                             border: 'rgba(34,197,94,0.20)',    dot: '#22c55e' },
  warning: { bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b',                             border: 'rgba(245,158,11,0.20)',   dot: '#f59e0b' },
  error:   { bg: 'rgba(239,68,68,0.08)',   color: '#ef4444',                             border: 'rgba(239,68,68,0.20)',    dot: '#ef4444' },
  info:    { bg: 'rgba(59,107,255,0.08)',  color: 'var(--weld-plasma-cobalt, #3b6bff)',  border: 'rgba(59,107,255,0.20)',   dot: '#3b6bff' },
}

export function Badge({
  children,
  variant = 'default',
  dot = false,
  className,
  style,
}: WeldBadgeProps) {
  const s = badgeStyles[variant]

  return (
    <span
      className={className}
      data-weld-badge
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '5px',
        padding:      '2px 8px',
        fontSize:     '0.7rem',
        fontWeight:   500,
        letterSpacing: '0.03em',
        borderRadius: '999px',
        background:   s.bg,
        color:        s.color,
        border:       `1px solid ${s.border}`,
        whiteSpace:   'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span style={{
          width:        '5px',
          height:       '5px',
          borderRadius: '50%',
          background:   s.dot,
          flexShrink:   0,
        }} />
      )}
      {children}
    </span>
  )
}
