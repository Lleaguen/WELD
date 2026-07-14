/**
 * @weldjs/react — <Weld.Shell />
 *
 * Root layout container. Pure structure, zero decoration.
 * Orchestrates Header, Sidebar, Main, Footer into a responsive grid.
 * The shell itself is invisible — components inside it bring the light.
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useResponsive } from '../hooks/useResponsive.js'

// ─── Shell Context ────────────────────────────────────────────────────────────

export interface ShellContextValue {
  sidebarOpen:     boolean
  setSidebarOpen:  (v: boolean) => void
  headerHeight:    number
  setHeaderHeight: (v: number) => void
  footerHeight:    number
  setFooterHeight: (v: number) => void
}

export const ShellContext = createContext<ShellContextValue | null>(null)

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error(
    '[WELD] Layout components must be used inside <Weld.Shell>.\n' +
    'Wrap your layout with <Weld.Shell>:\n\n' +
    '  <Weld.Shell>\n' +
    '    <Weld.Header />\n' +
    '    <Weld.Main />\n' +
    '  </Weld.Shell>'
  )
  return ctx
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface WeldShellProps {
  children:   ReactNode
  className?: string
  style?:     React.CSSProperties
  noStyle?:   boolean
}

export function Shell({ children, className, style, noStyle }: WeldShellProps) {
  const bp = useResponsive()
  const [sidebarOpen,  setSidebarOpen]  = useState(bp === 'desktop')
  const [headerHeight, setHeaderHeight] = useState(56)
  const [footerHeight, setFooterHeight] = useState(0)

  const shellStyles: React.CSSProperties = noStyle ? {} : {
    display:     'flex',
    flexDirection: 'column',
    minHeight:   '100dvh',
    background:  'var(--weld-bg-base, #09090b)',
    color:       'var(--weld-text-primary, #f4f4f5)',
    fontFamily:  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize:    '14px',
    lineHeight:  '1.5',
    ...style,
  }

  return (
    <ShellContext.Provider value={{
      sidebarOpen,  setSidebarOpen,
      headerHeight, setHeaderHeight,
      footerHeight, setFooterHeight,
    }}>
      <div
        className={className}
        style={shellStyles}
        data-weld-shell
        data-breakpoint={bp}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
}
