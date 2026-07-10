/**
 * @weldjs/react — <Weld.Shell />
 *
 * Root layout container. Orchestrates Header, Sidebar, Main and Footer
 * into a responsive grid structure.
 *
 * Usage:
 *   <Weld.Shell>
 *     <Weld.Header position="top" fixed neon />
 *     <Weld.Sidebar position="left" collapsible />
 *     <Weld.Main />
 *     <Weld.Footer />
 *   </Weld.Shell>
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useResponsive } from '../hooks/useResponsive.js'

// ─── Shell Context (shared between layout children) ───────────────────────────

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
  if (!ctx) throw new Error('[Weld.Shell] Layout components must be used inside <Weld.Shell>')
  return ctx
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface WeldShellProps {
  children:   ReactNode
  className?: string
  style?:     React.CSSProperties
  /** Disable all Weld visual styles */
  noStyle?:   boolean
}

export function Shell({ children, className, style, noStyle }: WeldShellProps) {
  const bp = useResponsive()
  const [sidebarOpen, setSidebarOpen] = useState(bp === 'desktop')
  const [headerHeight, setHeaderHeight] = useState(60)
  const [footerHeight, setFooterHeight] = useState(0)

  const shellStyles: React.CSSProperties = noStyle ? {} : {
    display:         'flex',
    flexDirection:   'column',
    minHeight:       '100dvh',
    background:      'var(--weld-bg-base, #09090b)',
    color:           'var(--weld-text-primary, #fafafa)',
    fontFamily:      'system-ui, -apple-system, sans-serif',
    ...style,
  }

  return (
    <ShellContext.Provider value={{
      sidebarOpen, setSidebarOpen,
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
