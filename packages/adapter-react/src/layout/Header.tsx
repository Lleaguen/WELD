/**
 * @weldjs/react — <Weld.Header />
 *
 * At rest: dark, borderless, nearly invisible — pure structure.
 * Online indicator: a 6px dot. Cyan when connected, red when not.
 * The only light in the header is that dot. Everything else is shadow.
 */

import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { useShell }      from './Shell.js'
import { useResponsive } from '../hooks/useResponsive.js'

type NeonConfig = { color?: string; intensity?: number }

export interface WeldHeaderProps {
  children?:  ReactNode
  fixed?:     boolean
  neon?:      boolean | NeonConfig | 'none'
  position?:  'top'
  className?: string
  style?:     React.CSSProperties
}

export function Header({
  children,
  fixed = false,
  neon = true,
  position = 'top',
  className,
  style,
}: WeldHeaderProps) {
  const { setHeaderHeight, setSidebarOpen, sidebarOpen } = useShell()
  const bp      = useResponsive()
  const ref     = useRef<HTMLElement>(null)
  const noStyle = neon === 'none' || neon === false

  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    if (!ref.current) return
    const obs = new ResizeObserver(([e]) => { if (e) setHeaderHeight(e.contentRect.height) })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [setHeaderHeight])

  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const headerStyles: React.CSSProperties = noStyle ? {} : {
    position:       fixed ? 'fixed' : 'sticky',
    top:            0,
    left:           0,
    right:          0,
    zIndex:         100,
    height:         '56px',
    display:        'flex',
    alignItems:     'center',
    padding:        '0 18px',
    gap:            '12px',
    // Dark glass — barely translucent, not the shiny kind
    background:     'rgba(9,9,11,0.88)',
    backdropFilter: 'blur(12px) saturate(140%)',
    // Single pixel border, barely visible
    borderBottom:   '1px solid rgba(255,255,255,0.05)',
    ...style,
  }

  return (
    <header
      ref={ref}
      className={className}
      style={headerStyles}
      data-weld-header
      data-position={position}
    >
      {/* Mobile hamburger — minimal, no background */}
      {bp !== 'desktop' && !noStyle && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            padding:    '4px',
            color:      'var(--weld-text-secondary, #a1a1aa)',
            display:    'flex',
            flexDirection: 'column',
            gap:        '4px',
            flexShrink: 0,
          }}
          aria-label="Toggle menu"
        >
          <span style={{ width: '16px', height: '1.5px', background: 'currentColor', display: 'block', transition: 'transform 0.2s', transform: sidebarOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none' }} />
          <span style={{ width: '16px', height: '1.5px', background: 'currentColor', display: 'block', transition: 'opacity 0.2s', opacity: sidebarOpen ? 0 : 1 }} />
          <span style={{ width: '16px', height: '1.5px', background: 'currentColor', display: 'block', transition: 'transform 0.2s', transform: sidebarOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none' }} />
        </button>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
        {children}
      </div>

      {/* Network state dot — the only weld light in the header */}
      {!noStyle && (
        <div
          title={online ? 'Online' : 'Offline — mutations queued'}
          style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            flexShrink:   0,
            background:   online
              ? 'var(--weld-plasma-cyan, #00d4ff)'
              : 'var(--weld-state-offline, #ef4444)',
            // Glow only when online — the weld is active
            boxShadow: online
              ? '0 0 6px rgba(0,212,255,0.60)'
              : 'none',
            transition: 'background 0.4s ease, box-shadow 0.4s ease',
          }}
        />
      )}
    </header>
  )
}
