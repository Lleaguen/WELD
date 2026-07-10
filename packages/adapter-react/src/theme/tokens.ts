/**
 * @weldjs/react — Neon Theme Tokens
 * CSS custom properties injected at the WeldProvider level.
 */

export const defaultTokens: Record<string, string> = {
  // Backgrounds
  '--weld-bg-base':     '#09090b',
  '--weld-bg-surface':  '#111113',
  '--weld-bg-elevated': '#18181b',

  // Borders
  '--weld-border':       'rgba(255,255,255,0.08)',
  '--weld-border-hover': 'rgba(255,255,255,0.15)',

  // Neon — only on active/interactive states
  '--weld-neon-primary': '#00d4ff',
  '--weld-neon-accent':  '#3b5bdb',
  '--weld-neon-glow':    '0 0 12px rgba(0,212,255,0.35)',

  // Text
  '--weld-text-primary':  '#fafafa',
  '--weld-text-muted':    '#71717a',
  '--weld-text-disabled': '#3f3f46',

  // Network state colors
  '--weld-online':  '#00d4ff',
  '--weld-offline': '#ef4444',
  '--weld-loading': '#f59e0b',

  // Radius & spacing
  '--weld-radius':  '6px',
  '--weld-radius-lg': '10px',

  // Responsive breakpoints (used in JS for programmatic checks)
  '--weld-bp-mobile':  '768',
  '--weld-bp-tablet':  '1024',
} as const

export type WeldTokens = Record<string, string>
