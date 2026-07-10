/**
 * @weldjs/react — Design Tokens
 *
 * Philosophy: Structure is invisible (Vercel/Linear), interactions weld with light.
 * Neon is reserved exclusively for active, focused, loading, or network-reactive states.
 * At rest, everything is neutral, dark, and clean.
 */

export const defaultTokens: Record<string, string> = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  // Ultra dark, matte. No gradients at rest.
  '--weld-bg-base':     '#09090b',   // page background
  '--weld-bg-surface':  '#0d0d10',   // cards, panels
  '--weld-bg-elevated': '#111115',   // dropdowns, tooltips, modals

  // ── Borders — extremely subtle, almost invisible ───────────────────────────
  '--weld-border':         'rgba(255,255,255,0.06)',
  '--weld-border-hover':   'rgba(255,255,255,0.10)',
  '--weld-border-focus':   'rgba(0,212,255,0.40)',   // neon only on focus

  // ── Weld Plasma — used ONLY on active/interactive states ──────────────────
  // Cyan: focused inputs, active buttons, online indicator
  '--weld-plasma-cyan':    '#00d4ff',
  // Cobalt: accent, secondary active states
  '--weld-plasma-cobalt':  '#3b6bff',
  // Glow — diffused, never harsh
  '--weld-glow-cyan':      '0 0 0 1px rgba(0,212,255,0.20), 0 0 16px rgba(0,212,255,0.10)',
  '--weld-glow-cobalt':    '0 0 0 1px rgba(59,107,255,0.25), 0 0 14px rgba(59,107,255,0.12)',

  // ── Text ───────────────────────────────────────────────────────────────────
  '--weld-text-primary':   '#f4f4f5',   // main content
  '--weld-text-secondary': '#a1a1aa',   // labels, subtitles
  '--weld-text-muted':     '#52525b',   // placeholders, hints
  '--weld-text-disabled':  '#3f3f46',

  // ── Semantic states — muted at rest, bright on trigger ────────────────────
  '--weld-state-online':   '#00d4ff',   // matches plasma-cyan: online = connected
  '--weld-state-offline':  '#ef4444',
  '--weld-state-loading':  '#00d4ff',   // pulse animation, same cyan
  '--weld-state-success':  '#22c55e',
  '--weld-state-error':    '#ef4444',

  // ── Shape ──────────────────────────────────────────────────────────────────
  '--weld-radius':     '5px',
  '--weld-radius-lg':  '8px',
  '--weld-radius-xl':  '12px',

  // ── Responsive breakpoints ─────────────────────────────────────────────────
  '--weld-bp-mobile':  '768',
  '--weld-bp-tablet':  '1024',
} as const

export type WeldTokens = Record<string, string>
