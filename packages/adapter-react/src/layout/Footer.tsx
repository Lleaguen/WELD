/**
 * @weldjs/react — <Weld.Footer />
 * Minimal footer. Single pixel top border, muted text, that's it.
 */

import React, { useEffect, useRef, type ReactNode } from 'react'
import { useShell } from './Shell.js'

export interface WeldFooterProps {
  children?:  ReactNode
  className?: string
  style?:     React.CSSProperties
  neon?:      boolean | 'none'
}

export function Footer({ children, className, style, neon = true }: WeldFooterProps) {
  const { setFooterHeight } = useShell()
  const ref     = useRef<HTMLElement>(null)
  const noStyle = neon === 'none' || neon === false

  useEffect(() => {
    if (!ref.current) return
    const obs = new ResizeObserver(([e]) => { if (e) setFooterHeight(e.contentRect.height) })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [setFooterHeight])

  const footerStyles: React.CSSProperties = noStyle ? {} : {
    borderTop:  '1px solid rgba(255,255,255,0.04)',
    padding:    '14px 24px',
    color:      'var(--weld-text-muted, #52525b)',
    fontSize:   '12px',
    background: '#09090b',
    ...style,
  }

  return (
    <footer ref={ref} className={className} style={footerStyles} data-weld-footer>
      {children}
    </footer>
  )
}
