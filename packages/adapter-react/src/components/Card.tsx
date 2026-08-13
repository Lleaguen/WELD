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
 *
 * 3D tilt (same API as `neon`):
 *   <Weld.Card tilt />                          // default — 8°, scale 1.02
 *   <Weld.Card tilt={{ max: 5, scale: 1.01 }} /> // custom
 *   <Weld.Card tilt={false} />                  // styles on, tilt off
 *   <Weld.Card tilt="none" />                   // no tilt at all
 */

import React, { type ReactNode } from 'react'
import { useTilt3D, type TiltProp } from '../hooks/useTilt3D.js'

export interface WeldCardProps {
  children?:  ReactNode
  title?:     string
  actions?:   ReactNode
  footer?:    ReactNode
  /** Neon left border accent */
  accent?:    boolean
  /**
   * 3D tilt effect on hover.
   * - true / object → tilt active (default: false)
   * - false         → no tilt
   * - 'none'        → no tilt, no will-change hint
   */
  tilt?:      TiltProp
  className?: string
  style?:     React.CSSProperties
  onClick?:   () => void
}

export function Card({
  children,
  title,
  actions,
  footer,
  accent    = false,
  tilt      = false,
  className,
  style,
  onClick,
}: WeldCardProps) {
  const clickable      = !!onClick
  const { ref, style: tiltStyle } = useTilt3D(tilt)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
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
        transition:   clickable
          ? 'border-color 0.15s ease, background 0.15s ease'
          : undefined,
        // Tilt overrides transition only when active
        ...(tilt && tilt !== 'none' ? tiltStyle : {}),
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
              fontSize:      '0.8125rem',
              fontWeight:    600,
              color:         'var(--weld-text-primary, #f4f4f5)',
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
          padding:    '12px 16px',
          borderTop:  '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          background: 'rgba(255,255,255,0.01)',
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
