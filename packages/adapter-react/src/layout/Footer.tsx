/**
 * @weldjs/react — <Weld.Footer />
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
  const ref = useRef<HTMLElement>(null)
  const noStyle = neon === 'none' || neon === false

  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setFooterHeight(entry.contentRect.height)
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [setFooterHeight])

  const footerStyles: React.CSSProperties = noStyle ? {} : {
    borderTop:  '1px solid rgba(255,255,255,0.05)',
    padding:    '16px 24px',
    color:      'var(--weld-text-muted, #71717a)',
    fontSize:   '13px',
    background: '#030303',
    ...style,
  }

  return (
    <footer
      ref={ref}
      className={className}
      style={footerStyles}
      data-weld-footer
    >
      {children}
    </footer>
  )
}
