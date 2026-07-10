/**
 * @weldjs/react — <Weld.Stack />
 *
 * Flex container for consistent spacing between elements.
 * Replaces manual gap/margin management.
 *
 * Usage:
 *   <Weld.Stack gap={12} direction="column">
 *     <Weld.Input label="Name" />
 *     <Weld.Input label="Email" />
 *     <Weld.Button>Submit</Weld.Button>
 *   </Weld.Stack>
 */

import React, { type ReactNode } from 'react'

export interface WeldStackProps {
  children?:  ReactNode
  direction?: 'row' | 'column'
  gap?:       number
  align?:     React.CSSProperties['alignItems']
  justify?:   React.CSSProperties['justifyContent']
  wrap?:      boolean
  className?: string
  style?:     React.CSSProperties
}

export function Stack({
  children,
  direction = 'column',
  gap = 12,
  align,
  justify,
  wrap = false,
  className,
  style,
}: WeldStackProps) {
  return (
    <div
      className={className}
      data-weld-stack
      style={{
        display:        'flex',
        flexDirection:  direction,
        gap:            `${gap}px`,
        alignItems:     align,
        justifyContent: justify,
        flexWrap:       wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
