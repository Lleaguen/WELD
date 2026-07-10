/**
 * @weldjs/react — <Weld.Header />
 *
 * Semantic header with neon theme, fixed/sticky support,
 * online/offline indicator and full responsive behavior.
 */

import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useShell }      from './Shell.js'
import { useResponsive } from '../hooks/useResponsive.js'

type NeonConfig = { color?: string; intensity?: number }

export interface WeldHeaderProps {
  children?:  ReactNode
  /** Fixed to top of viewport */
  fixed?:     boolean
  /** Neon theme — true, config object, or 'none' to disable visuals */
  neon?:      boolean | NeonConfig | 'none'
  /** Position — only 'top' supported for Header */
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
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  // Track header height for Main offset
  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeaderHeight(entry.contentRect.height)
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [setHeaderHeight])

  // Online/offline indicator
  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const noStyle   = neon === 'none' || neon === false
  const neonColor = typeof neon === 'object' && 'color' in neon ? neon.color ?? '#00e5ff' : '#00e5ff'
  const intensity = typeof neon === 'object' && 'intensity' in neon ? neon.intensity ?? 1 : 1

  const headerStyles: React.CSSProperties = noStyle ? {} : {
    position:       fixed ? 'fixed' : 'sticky',
    top:            0,
    left:           0,
    right:          0,
    zIndex:         100,
    height:         '60px',
    display:        'flex',
    alignItems:     'center',
    padding:        '0 20px',
    gap:            '12px',
    background:     'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(16px) saturate(180%)',
    borderBottom:   `1px solid rgba(${hexToRgb(neonColor)}, ${0.12 * intensity})`,
    boxShadow:      `0 1px 0 rgba(${hexToRgb(neonColor)}, ${0.06 * intensity})`,
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
      {/* Mobile hamburger */}
      {bp !== 'desktop' && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            padding:    '6px',
            color:      'var(--weld-text-primary, #fafafa)',
            display:    'flex',
            flexDirection: 'column',
            gap:        '4px',
            flexShrink: 0,
          }}
          aria-label="Toggle menu"
        >
          <span style={{ width: '18px', height: '1.5px', background: 'currentColor', display: 'block', transition: 'all 0.2s', transform: sidebarOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ width: '18px', height: '1.5px', background: 'currentColor', display: 'block', opacity: sidebarOpen ? 0 : 1 }} />
          <span style={{ width: '18px', height: '1.5px', background: 'currentColor', display: 'block', transition: 'all 0.2s', transform: sidebarOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
        {children}
      </div>

      {/* Online/offline dot */}
      {!noStyle && (
        <div
          title={online ? 'Online' : 'Offline — mutations queued'}
          style={{
            width:        '7px',
            height:       '7px',
            borderRadius: '50%',
            flexShrink:   0,
            background:   online ? 'var(--weld-neon-primary, #00e5ff)' : '#ef4444',
            boxShadow:    online
              ? `0 0 6px var(--weld-neon-primary, #00e5ff)`
              : '0 0 6px #ef4444',
            transition:   'all 0.3s ease',
          }}
        />
      )}
    </header>
  )
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r},${g},${b}`
}
