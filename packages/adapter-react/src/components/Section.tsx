/**
 * @weldjs/react — <Weld.Section />
 *
 * Semantic page section with optional title, description and top divider.
 * The primary block-level building unit for page content.
 *
 * Usage:
 *   <Weld.Section title="Users" description="Manage your team">
 *     ...
 *   </Weld.Section>
 */

import React, { type ReactNode } from 'react'

export interface WeldSectionProps {
  children?:    ReactNode
  title?:       string
  description?: string
  /** Show a top border separator. Default: true (except first section) */
  divider?:     boolean
  /** Right-side slot — actions, buttons, etc. */
  actions?:     ReactNode
  className?:   string
  style?:       React.CSSProperties
}

export function Section({
  children,
  title,
  description,
  divider = true,
  actions,
  className,
  style,
}: WeldSectionProps) {
  return (
    <section
      className={className}
      style={{
        paddingTop:  divider ? '32px' : '0',
        marginTop:   divider ? '32px' : '0',
        borderTop:   divider ? '1px solid var(--weld-border, rgba(255,255,255,0.06))' : 'none',
        ...style,
      }}
      data-weld-section
    >
      {(title || actions) && (
        <div style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '16px',
          marginBottom:   description ? '6px' : '20px',
        }}>
          {title && (
            <h2 style={{
              margin:        0,
              fontSize:      '1rem',
              fontWeight:    600,
              letterSpacing: '-0.01em',
              color:         'var(--weld-text-primary, #f4f4f5)',
              lineHeight:    1.3,
            }}>
              {title}
            </h2>
          )}
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </div>
      )}

      {description && (
        <p style={{
          margin:     '0 0 20px',
          fontSize:   '0.8125rem',
          color:      'var(--weld-text-muted, #52525b)',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      )}

      {children}
    </section>
  )
}
