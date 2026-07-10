/**
 * @weldjs/react — <Weld.Grid />
 *
 * CSS Grid container with responsive columns.
 *
 * Usage:
 *   <Weld.Grid cols={3} gap={16}>
 *     <Weld.Card>...</Weld.Card>
 *     <Weld.Card>...</Weld.Card>
 *     <Weld.Card>...</Weld.Card>
 *   </Weld.Grid>
 */

import React, { type ReactNode } from 'react'

export interface WeldGridProps {
  children?:  ReactNode
  /** Number of columns. Default: 2 */
  cols?:      number
  /** Min column width for auto-fit behavior */
  minWidth?:  number
  gap?:       number
  className?: string
  style?:     React.CSSProperties
}

export function Grid({
  children,
  cols,
  minWidth,
  gap = 16,
  className,
  style,
}: WeldGridProps) {
  const templateColumns = minWidth
    ? `repeat(auto-fit, minmax(${minWidth}px, 1fr))`
    : `repeat(${cols ?? 2}, 1fr)`

  return (
    <div
      className={className}
      data-weld-grid
      style={{
        display:             'grid',
        gridTemplateColumns: templateColumns,
        gap:                 `${gap}px`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
