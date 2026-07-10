/**
 * @weldjs/react — <Weld.Main />
 * Main content area. Invisible structure — just space and offset.
 */

import React, { type ReactNode } from 'react'
import { useShell } from './Shell.js'

export interface WeldMainProps {
  children?:  ReactNode
  className?: string
  style?:     React.CSSProperties
  neon?:      boolean | 'none'
  maxWidth?:  number | string
  centered?:  boolean
}

export function Main({
  children,
  className,
  style,
  neon = true,
  maxWidth,
  centered = false,
}: WeldMainProps) {
  const { headerHeight } = useShell()
  const noStyle = neon === 'none' || neon === false

  const mainStyles: React.CSSProperties = noStyle ? {} : {
    flex:      1,
    minWidth:  0,
    minHeight: `calc(100dvh - ${headerHeight}px)`,
    padding:   '28px 24px',
    ...style,
  }

  const innerStyles: React.CSSProperties = (centered || maxWidth) ? {
    maxWidth: maxWidth ?? '820px',
    margin:   centered ? '0 auto' : undefined,
    width:    '100%',
  } : {}

  return (
    <main className={className} style={mainStyles} data-weld-main>
      {(centered || maxWidth)
        ? <div style={innerStyles}>{children}</div>
        : children}
    </main>
  )
}
