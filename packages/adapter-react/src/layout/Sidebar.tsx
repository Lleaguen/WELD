/**
 * @weldjs/react — <Weld.Sidebar />
 *
 * Responsive sidebar with 3 states:
 * - mobile:  drawer (slides in from edge)
 * - tablet:  collapsed (icons only)
 * - desktop: expanded (icons + labels)
 *
 * Neon accent line reacts to online/offline state.
 */

import React, { useEffect, useState, type ReactNode } from 'react'
import { useShell }      from './Shell.js'
import { useResponsive } from '../hooks/useResponsive.js'

type NeonConfig = { color?: string; intensity?: number }

type ResponsiveConfig = {
  mobile?:  'drawer' | 'hidden'
  tablet?:  'collapsed' | 'hidden' | 'expanded'
  desktop?: 'expanded' | 'collapsed'
}

export interface WeldSidebarProps {
  children?:   ReactNode
  position?:   'left' | 'right'
  collapsible?: boolean
  neon?:       boolean | NeonConfig | 'none'
  responsive?: ResponsiveConfig
  className?:  string
  style?:      React.CSSProperties
  /** Width when expanded. Default: 240px */
  width?:      number
  /** Width when collapsed. Default: 56px */
  collapsedWidth?: number
}

const defaultResponsive: Required<ResponsiveConfig> = {
  mobile:  'drawer',
  tablet:  'collapsed',
  desktop: 'expanded',
}

export function Sidebar({
  children,
  position = 'left',
  collapsible = true,
  neon = true,
  responsive,
  className,
  style,
  width = 240,
  collapsedWidth = 56,
}: WeldSidebarProps) {
  const { sidebarOpen, setSidebarOpen, headerHeight } = useShell()
  const bp = useResponsive()
  const mergedResponsive = { ...defaultResponsive, ...responsive }

  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

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

  // Determine current display mode
  const mode = bp === 'mobile' ? mergedResponsive.mobile
    : bp === 'tablet' ? mergedResponsive.tablet
    : mergedResponsive.desktop

  const isDrawer    = mode === 'drawer'
  const isCollapsed = mode === 'collapsed'
  const isHidden    = mode === 'hidden'
  const currentWidth = isCollapsed ? collapsedWidth : width

  if (isHidden) return null

  const sidebarStyles: React.CSSProperties = noStyle ? {} : {
    position:       isDrawer ? 'fixed' : 'sticky',
    top:            isDrawer ? 0 : headerHeight,
    [position]:     isDrawer ? (sidebarOpen ? 0 : -width) : 0,
    height:         isDrawer ? '100dvh' : `calc(100dvh - ${headerHeight}px)`,
    width:          isDrawer ? width : currentWidth,
    zIndex:         isDrawer ? 200 : 10,
    overflowY:      'auto',
    overflowX:      'hidden',
    flexShrink:     0,
    background:     '#030303',
    borderRight:    position === 'left'
      ? `1px solid rgba(255,255,255,0.05)`
      : 'none',
    borderLeft:     position === 'right'
      ? `1px solid rgba(255,255,255,0.05)`
      : 'none',
    transition:     isDrawer
      ? `${position} 0.25s cubic-bezier(0.4,0,0.2,1)`
      : `width 0.2s ease`,
    display:        'flex',
    flexDirection:  'column',
    ...style,
  }

  // Neon accent line (top edge, reacts to online/offline)
  const accentLineStyles: React.CSSProperties = noStyle ? {} : {
    height:     '2px',
    width:      '100%',
    flexShrink: 0,
    background: online
      ? `linear-gradient(90deg, ${neonColor} 0%, #6366f1 100%)`
      : 'linear-gradient(90deg, #ef4444 0%, #7f1d1d 100%)',
    boxShadow:  online
      ? `0 0 ${8 * intensity}px ${neonColor}66`
      : '0 0 8px rgba(239,68,68,0.4)',
    transition: 'all 0.5s ease',
  }

  return (
    <>
      {/* Drawer backdrop */}
      {isDrawer && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position:   'fixed',
            inset:      0,
            zIndex:     199,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside
        className={className}
        style={sidebarStyles}
        data-weld-sidebar
        data-position={position}
        data-mode={mode}
      >
        {!noStyle && <div style={accentLineStyles} />}

        <div style={{ flex: 1, padding: isCollapsed ? '12px 8px' : '12px' }}>
          {children}
        </div>

        {/* Collapse toggle for desktop */}
        {collapsible && bp === 'desktop' && !noStyle && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              margin:        '8px',
              padding:       '8px',
              background:    'rgba(255,255,255,0.03)',
              border:        '1px solid rgba(255,255,255,0.06)',
              borderRadius:  '6px',
              cursor:        'pointer',
              color:         'var(--weld-text-muted, #71717a)',
              display:       'flex',
              alignItems:    'center',
              justifyContent: 'center',
              transition:    'all 0.15s',
            }}
            aria-label="Toggle sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d={position === 'left'
                  ? (isCollapsed ? 'M5 2l5 5-5 5' : 'M9 2L4 7l5 5')
                  : (isCollapsed ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5')}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </aside>
    </>
  )
}
