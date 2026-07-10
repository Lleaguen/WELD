/**
 * @weldjs/react — WeldProvider
 *
 * Root context provider. Must wrap your app.
 * Injects CSS tokens + base typography styles so raw HTML looks good
 * out of the box without any extra configuration from the user.
 *
 * Usage:
 *   <WeldProvider>
 *     <App />
 *   </WeldProvider>
 */

import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { WeldTokens } from '../theme/tokens.js'
import { injectTokens }    from '../theme/inject.js'

// ─── Router Adapter ───────────────────────────────────────────────────────────

export interface RouterAdapter {
  Link:     React.ComponentType<{ to: string; children: ReactNode; className?: string }>
  navigate: (to: string) => void
}

// ─── Breakpoints ──────────────────────────────────────────────────────────────

export interface WeldBreakpoints {
  mobile:  number   // default: 768
  tablet:  number   // default: 1024
}

const defaultBreakpoints: WeldBreakpoints = { mobile: 768, tablet: 1024 }

// ─── Theme Config ─────────────────────────────────────────────────────────────

export interface WeldThemeConfig {
  /** Plasma primary color override. Default: '#00d4ff' */
  primaryColor?: string
  /** Plasma accent color override. Default: '#3b6bff' */
  accentColor?:  string
  /** Fine-grained token overrides */
  tokens?:       WeldTokens
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

// ─── Base styles injected once ────────────────────────────────────────────────
// Makes raw HTML (h1-h6, p, code, hr, a) look clean inside Weld layouts.
// Scoped to [data-weld-shell] so it never leaks outside.

const BASE_STYLE_ID = '__weld_base__'

function injectBaseStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(BASE_STYLE_ID)) return

  const s = document.createElement('style')
  s.id = BASE_STYLE_ID
  s.textContent = `
    /* ── Weld base typography — scoped to shell ─────────────────────────── */
    [data-weld-shell] *,
    [data-weld-shell] *::before,
    [data-weld-shell] *::after {
      box-sizing: border-box;
    }

    [data-weld-shell] h1,
    [data-weld-shell] h2,
    [data-weld-shell] h3,
    [data-weld-shell] h4,
    [data-weld-shell] h5,
    [data-weld-shell] h6 {
      margin: 1.5em 0 0.4em;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.02em;
      color: var(--weld-text-primary, #f4f4f5);
    }

    /* First heading in a block shouldn't have top margin */
    [data-weld-shell] *:first-child > h1:first-child,
    [data-weld-shell] *:first-child > h2:first-child,
    [data-weld-shell] *:first-child > h3:first-child,
    [data-weld-shell] h1:first-child,
    [data-weld-shell] h2:first-child,
    [data-weld-shell] h3:first-child {
      margin-top: 0;
    }

    [data-weld-shell] h1 { font-size: 1.6rem;  letter-spacing: -0.03em; }
    [data-weld-shell] h2 { font-size: 1.15rem; }
    [data-weld-shell] h3 { font-size: 0.95rem; font-weight: 500; color: var(--weld-text-secondary, #a1a1aa); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.72rem; }
    [data-weld-shell] h4 { font-size: 0.875rem; font-weight: 500; }

    [data-weld-shell] p {
      margin: 0 0 1em;
      color: var(--weld-text-secondary, #a1a1aa);
      font-size: 0.875rem;
      line-height: 1.7;
    }

    [data-weld-shell] p:last-child { margin-bottom: 0; }

    [data-weld-shell] a {
      color: var(--weld-plasma-cyan, #00d4ff);
      text-decoration: none;
    }
    [data-weld-shell] a:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    [data-weld-shell] code,
    [data-weld-shell] kbd {
      font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
      font-size: 0.8em;
      background: var(--weld-bg-elevated, #111115);
      border: 1px solid var(--weld-border, rgba(255,255,255,0.06));
      border-radius: 3px;
      padding: 0.15em 0.4em;
      color: var(--weld-plasma-cyan, #00d4ff);
    }

    [data-weld-shell] pre {
      background: var(--weld-bg-surface, #0d0d10);
      border: 1px solid var(--weld-border, rgba(255,255,255,0.06));
      border-radius: var(--weld-radius, 5px);
      padding: 16px;
      overflow-x: auto;
      font-size: 0.8rem;
    }

    [data-weld-shell] pre code {
      background: none;
      border: none;
      padding: 0;
      color: var(--weld-text-primary, #f4f4f5);
    }

    [data-weld-shell] hr {
      border: none;
      border-top: 1px solid var(--weld-border, rgba(255,255,255,0.06));
      margin: 20px 0;
    }

    [data-weld-shell] strong {
      font-weight: 600;
      color: var(--weld-text-primary, #f4f4f5);
    }

    [data-weld-shell] small {
      font-size: 0.75rem;
      color: var(--weld-text-muted, #52525b);
    }

    [data-weld-shell] ul,
    [data-weld-shell] ol {
      padding-left: 1.25em;
      margin: 0 0 0.75em;
      color: var(--weld-text-secondary, #a1a1aa);
      font-size: 0.875rem;
      line-height: 1.65;
    }

    [data-weld-shell] li + li { margin-top: 0.3em; }

    /* ── Sidebar nav layout ───────────────────────────────────────────────── */
    /* Buttons inside sidebar stack vertically with spacing */
    [data-weld-sidebar] > div > [data-weld-button],
    [data-weld-sidebar] > div > * > [data-weld-button] {
      width: 100%;
      justify-content: flex-start;
      margin-bottom: 2px;
    }

    /* ── Scrollbar — subtle ──────────────────────────────────────────────── */
    [data-weld-shell] ::-webkit-scrollbar { width: 4px; height: 4px; }
    [data-weld-shell] ::-webkit-scrollbar-track { background: transparent; }
    [data-weld-shell] ::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
    }
    [data-weld-shell] ::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.14);
    }

    /* ── Selection ───────────────────────────────────────────────────────── */
    [data-weld-shell] ::selection {
      background: rgba(0,212,255,0.18);
      color: var(--weld-text-primary, #f4f4f5);
    }
  `
  document.head.appendChild(s)
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

  useEffect(() => {
    // Inject base styles once
    injectBaseStyles()

    // Inject / update CSS tokens
    const overrides: WeldTokens = { ...theme.tokens }
    if (theme.primaryColor) {
      overrides['--weld-plasma-cyan'] = theme.primaryColor
      overrides['--weld-state-online']  = theme.primaryColor
      overrides['--weld-state-loading'] = theme.primaryColor
    }
    if (theme.accentColor) {
      overrides['--weld-plasma-cobalt'] = theme.accentColor
    }
    if (typeof document !== 'undefined') {
      injectTokens(overrides)
    }
  }, [theme])

  return (
    <WeldContext.Provider value={{ routerAdapter, breakpoints: mergedBreakpoints, theme }}>
      {children}
    </WeldContext.Provider>
  )
}
