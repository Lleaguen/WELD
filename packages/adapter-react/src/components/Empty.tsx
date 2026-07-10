/**
 * @weldjs/react — <Weld.Empty />
 *
 * Empty state placeholder for lists, tables, search results, etc.
 *
 * Usage:
 *   <Weld.Empty title="No results" description="Try adjusting your filters" />
 *   <Weld.Empty icon="📭" title="No posts yet" action={<Weld.Button>Create one</Weld.Button>} />
 */

import React, { type ReactNode } from 'react'

export interface WeldEmptyProps {
  icon?:        string | ReactNode
  title?:       string
  description?: string
  action?:      ReactNode
  style?:       React.CSSProperties
}

export function Empty({ icon = '○', title = 'Nothing here', description, action, style }: WeldEmptyProps) {
  return (
    <div
      data-weld-empty
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '48px 24px',
        gap:            '10px',
        textAlign:      'center',
        ...style,
      }}
    >
      <span style={{ fontSize: '2rem', opacity: 0.25, lineHeight: 1 }}>
        {icon}
      </span>
      <p style={{
        margin:     0,
        fontSize:   '0.875rem',
        fontWeight: 500,
        color:      'var(--weld-text-secondary, #a1a1aa)',
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          margin:   0,
          fontSize: '0.8rem',
          color:    'var(--weld-text-muted, #52525b)',
          maxWidth: '280px',
          lineHeight: 1.55,
        }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '4px' }}>{action}</div>}
    </div>
  )
}
