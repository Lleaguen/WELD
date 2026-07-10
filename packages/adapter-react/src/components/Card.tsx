/**
 * @weldjs/react — <Weld.Card />
 *
 * Surface-elevated container. For grouping related content.
 * Optional header with title + actions, optional footer.
 *
 * Usage:
 *   <Weld.Card title="Details" actions={<Weld.Button size="sm">Edit</Weld.Button>}>
 *     <p>Content here</p>
 *   </Weld.Card>
 */

import React, { type ReactNode } from 'react'

export interface WeldCardProps {
  children?:  ReactNode
  title?:     string
  actions?:   ReactNode
  footer?:    ReactNode
  /** Add neon left border accent */
  accent?:    boolean
  className?: string
  style?:     React.CSSProperties
  onClick?:   () => void
}

export function Card({
  children,
  title,
  actions,
  footer,
  accent = false,
  className,
  style,
  onClick,
}: WeldCardProps) {
  const clickable = !!onClick

  return (
    <div
      className={className}
      onClick={onClick}
      data-weld-card
      style={{
        background:   'var(--weld-bg-surface, #0d0d10)',
        border:       '1px solid var(--weld-border, rgba(255,255,255,0.06))',
        borderRadius: 'var(--weld-radius-lg, 8px)',
        borderLeft:   accent
          ? '2px solid var(--weld-plasma-cyan, #00d4ff)'
          : undefined,
        overflow:     'hidden',
        cursor:       clickable ? 'pointer' : undefined,
        transition:   clickable ? 'border-color 0.15s ease, background 0.15s ease' : undefined,
        ...style,
      }}
    >
      {/* Header */}
      {(title || actions) && (
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '14px 16px',
          borderBottom:   '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          gap:            '12px',
        }}>
          {title && (
            <span style={{
              fontSize:   '0.8125rem',
              fontWeight: 600,
              color:      'var(--weld-text-primary, #f4f4f5)',
              letterSpacing: '-0.005em',
            }}>
              {title}
            </span>
          )}
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div style={{
          padding:     '12px 16px',
          borderTop:   '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          background:  'rgba(255,255,255,0.01)',
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
