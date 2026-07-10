/**
 * @weldjs/react — WeldProvider
 * Root context provider. Must wrap your app.
 *
 * Provides:
 * - Global Weld client instance
 * - Router adapter
 * - Theme tokens (injected as CSS custom properties)
 * - Responsive breakpoint config
 */

import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { WeldTokens }  from '../theme/tokens.js'
import { injectTokens }     from '../theme/inject.js'

// ─── Router Adapter ───────────────────────────────────────────────────────────

export interface RouterAdapter {
  Link: React.ComponentType<{ to: string; children: ReactNode; className?: string }>
  navigate: (to: string) => void
}

// ─── Breakpoints ──────────────────────────────────────────────────────────────

export interface WeldBreakpoints {
  mobile:  number  // default: 768
  tablet:  number  // default: 1024
}

const defaultBreakpoints: WeldBreakpoints = {
  mobile:  768,
  tablet:  1024,
}

// ─── Theme Config ─────────────────────────────────────────────────────────────

export interface WeldThemeConfig {
  /** Neon primary color override. Default: '#00d4ff' */
  primaryColor?: string
  /** Neon accent color override. Default: '#3b5bdb' */
  accentColor?: string
  /** Fine-grained token overrides */
  tokens?: WeldTokens
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface WeldContextValue {
  routerAdapter?: RouterAdapter | undefined
  breakpoints:    WeldBreakpoints
  theme:          WeldThemeConfig
}

const WeldContext = createContext<WeldContextValue | null>(null)

export function useWeldContext(): WeldContextValue {
  const ctx = useContext(WeldContext)
  if (!ctx) throw new Error('[WeldProvider] useWeldContext must be used inside <WeldProvider>')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface WeldProviderProps {
  children:       ReactNode
  routerAdapter?: RouterAdapter
  breakpoints?:   Partial<WeldBreakpoints>
  theme?:         WeldThemeConfig
}

export function WeldProvider({
  children,
  routerAdapter,
  breakpoints,
  theme = {},
}: WeldProviderProps) {
  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints }

  // Inject CSS tokens on mount and when theme changes
  useEffect(() => {
    const tokenOverrides: WeldTokens = { ...theme.tokens }
    if (theme.primaryColor) {
      tokenOverrides['--weld-neon-primary'] = theme.primaryColor
      tokenOverrides['--weld-neon-glow']    = `0 0 12px ${theme.primaryColor}59`
    }
    if (theme.accentColor) {
      tokenOverrides['--weld-neon-accent'] = theme.accentColor
    }
    if (typeof document !== 'undefined') {
      injectTokens(tokenOverrides)
    }
  }, [theme])

  return (
    <WeldContext.Provider value={{ routerAdapter, breakpoints: mergedBreakpoints, theme }}>
      {children}
    </WeldContext.Provider>
  )
}
