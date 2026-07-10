/**
 * @weldjs/react — <Weld.Sidebar />
 *
 * At rest: dark panel, invisible border. No decoration.
 * The neon accent line (top edge) reacts to network state:
 *   - Online  → cyan plasma line, diffused glow
 *   - Offline → red, no glow
 * That single line is the only light source in the sidebar.
 *
 * Responsive:
 *   - mobile:  drawer (slides in, backdrop blur)
 *   - tablet:  collapsed (icon width only)
 *   - desktop: expanded
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
  children?:      ReactNode
  position?:      'left' | 'right'
  collapsible?:   boolean
  neon?:          boolean | NeonConfig | 'none'
  responsive?:    ResponsiveConfig
  className?:     string
  style?:         React.CSSProperties
  width?:         number
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
  width = 232,
  collapsedWidth = 52,
}: WeldSidebarProps) {
  const { sidebarOpen, setSidebarOpen, headerHeight } = useShell()
  const bp      = useResponsive()
  const noStyle = neon === 'none' || neon === false
  const merged  = { ...defaultResponsive, ...responsive }

  const plasma    = typeof neon === 'object' && neon !== null && 'color' in neon ? (neon.color ?? '#00d4ff') : '#00d4ff'
  const intensity = typeof neon === 'object' && neon !== null && 'intensity' in neon ? (neon.intensity ?? 1) : 1

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

  const mode = bp === 'mobile' ? merged.mobile : bp === 'tablet' ? merged.tablet : merged.desktop
  const isDrawer    = mode === 'drawer'
  const isCollapsed = mode === 'collapsed'
  if (mode === 'hidden') return null

  const currentWidth = isCollapsed ? collapsedWidth : width

  const sidebarStyles: React.CSSProperties = noStyle ? {} : {
    position:      isDrawer ? 'fixed' : 'sticky',
    top:           isDrawer ? 0 : headerHeight,
    [position]:    isDrawer ? (sidebarOpen ? 0 : -width) : 0,
    height:        isDrawer ? '100dvh' : `calc(100dvh - ${headerHeight}px)`,
    width:         isDrawer ? width : currentWidth,
    zIndex:        isDrawer ? 200 : 10,
    overflowY:     'auto',
    overflowX:     'hidden',
    flexShrink:    0,
    background:    '#0a0a0c',
    // Single pixel border — very faint
    borderRight:   position === 'left'  ? '1px solid rgba(255,255,255,0.04)' : 'none',
    borderLeft:    position === 'right' ? '1px solid rgba(255,255,255,0.04)' : 'none',
    transition:    isDrawer ? `${position} 0.22s cubic-bezier(0.4,0,0.2,1)` : `width 0.18s ease`,
    display:       'flex',
    flexDirection: 'column',
    ...style,
  }

  // The weld seam — the only decorative element. Reacts to network.
  const accentLine: React.CSSProperties = noStyle ? {} : {
    height:     '1.5px',
    flexShrink: 0,
    background: online
      ? `linear-gradient(90deg, ${plasma} 0%, rgba(59,107,255,0.8) 60%, transparent 100%)`
      : 'linear-gradient(90deg, #ef4444 0%, rgba(127,29,29,0.6) 60%, transparent 100%)',
    boxShadow: online
      ? `0 0 ${8 * intensity}px rgba(0,212,255,${0.35 * intensity})`
      : 'none',
    transition: 'background 0.5s ease, box-shadow 0.5s ease',
  }

  return (
    <>
      {/* Drawer backdrop */}
      {isDrawer && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         199,
            background:     'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(3px)',
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
        {/* The weld seam */}
        {!noStyle && <div style={accentLine} />}

        {/* Content — nav items stack naturally */}
        <div style={{
          flex:          1,
          padding:       isCollapsed ? '10px 6px' : '12px 8px',
          display:       'flex',
          flexDirection: 'column',
          gap:           '2px',
        }}>
          {children}
        </div>

        {/* Collapse toggle — desktop only, minimal */}
        {collapsible && bp === 'desktop' && !noStyle && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              margin:     '6px',
              padding:    '7px',
              background: 'transparent',
              border:     '1px solid rgba(255,255,255,0.05)',
              borderRadius: 'var(--weld-radius, 5px)',
              cursor:     'pointer',
              color:      'var(--weld-text-muted, #52525b)',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            aria-label="Toggle sidebar"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d={position === 'left'
                  ? (isCollapsed ? 'M4 2l4 4-4 4' : 'M8 2L4 6l4 4')
                  : (isCollapsed ? 'M8 2L4 6l4 4' : 'M4 2l4 4-4 4')}
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
