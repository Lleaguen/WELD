/**
 * @weldjs/react — <Weld.Container />
 *
 * Centered content wrapper with max-width and horizontal padding.
 * Use inside Main when you need a contained content area.
 *
 * Usage:
 *   <Weld.Container>
 *     <Weld.Section title="Overview">...</Weld.Section>
 *   </Weld.Container>
 *
 *   <Weld.Container size="sm">  // narrow form layouts
 *     <Weld.Card title="Sign in">...</Weld.Card>
 *   </Weld.Container>
 */

import React, { type ReactNode } from 'react'

export interface WeldContainerProps {
  children?:  ReactNode
  size?:      'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  style?:     React.CSSProperties
}

const maxWidths = { sm: '480px', md: '640px', lg: '860px', xl: '1100px', full: '100%' }

export function Container({ children, size = 'lg', className, style }: WeldContainerProps) {
  return (
    <div
      className={className}
      data-weld-container
      style={{
        width:    '100%',
        maxWidth: maxWidths[size],
        margin:   '0 auto',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
