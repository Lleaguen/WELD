/**
 * @weldjs/react — <Weld.Button />
 *
 * Directly "welded" to a network promise lifecycle.
 * At rest: clean, neutral, invisible structure.
 * On interaction: plasma glow activates — the weld lights up.
 */

import React, { useState, useCallback, type ReactNode, type ButtonHTMLAttributes } from 'react'
import type { WeldResponse } from '@weldjs/core'

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

type NeonConfig = {
  color?:     string
  intensity?: number  // 0–1, default 1
}

export interface WeldButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** The network action — returns a WeldResponse or a Promise */
  action?: () => WeldResponse<unknown> | Promise<unknown>
  children: ReactNode
  /**
   * - true / object → Plasma glow active on interactive states (default)
   * - false          → Weld styles still applied, glow disabled
   * - 'none'         → No visual styles at all (BYO CSS)
   */
  neon?: boolean | NeonConfig | 'none'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showSuccess?: boolean
}

// ─── Animations (injected once) ───────────────────────────────────────────────

if (typeof document !== 'undefined') {
  const styleId = '__weld_btn__'
  if (!document.getElementById(styleId)) {
    const s = document.createElement('style')
    s.id = styleId
    s.textContent = `
      @keyframes _weld-spin  { to { transform: rotate(360deg); } }
      @keyframes _weld-pulse { 0%,100% { opacity:1; } 50% { opacity:.45; } }
      @keyframes _weld-shake {
        0%,100% { transform:translateX(0); }
        20%      { transform:translateX(-3px); }
        40%      { transform:translateX(3px); }
        60%      { transform:translateX(-2px); }
        80%      { transform:translateX(2px); }
      }
    `
    document.head.appendChild(s)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  action,
  children,
  neon = true,
  variant = 'primary',
  size = 'md',
  showSuccess = true,
  className,
  disabled,
  ...rest
}: WeldButtonProps) {
  const [status, setStatus] = useState<ButtonStatus>('idle')
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback(async () => {
    if (!action || status === 'loading') return
    setStatus('loading')
    try {
      const result = action()
      await ('promise' in result ? result.promise : result)
      setStatus('success')
      if (showSuccess) setTimeout(() => setStatus('idle'), 1400)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [action, status, showSuccess])

  const isDisabled = disabled || status === 'loading'
  const noStyle    = neon === 'none'  // only 'none' strips all styles
  const glowOff    = neon === false   // false = styles yes, glow no

  const plasma = (!glowOff && typeof neon === 'object' && neon !== null && 'color' in neon)
    ? (neon.color ?? 'var(--weld-plasma-cyan, #00d4ff)')
    : 'var(--weld-plasma-cyan, #00d4ff)'

  const intensity = (!glowOff && typeof neon === 'object' && neon !== null && 'intensity' in neon)
    ? (neon.intensity ?? 1) : 1

  if (noStyle) {
    return (
      <button {...rest} disabled={isDisabled} onClick={handleClick} className={className}>
        {children}
      </button>
    )
  }

  // ── Base structural styles ────────────────────────────────────────────────
  const base: React.CSSProperties = {
    position:       'relative',
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '7px',
    fontFamily:     'inherit',
    fontWeight:     500,
    letterSpacing:  '0.01em',
    cursor:         isDisabled ? 'not-allowed' : 'pointer',
    transition:     'background 0.12s ease, border-color 0.12s ease, box-shadow 0.15s ease, opacity 0.12s ease',
    outline:        'none',
    userSelect:     'none',
    whiteSpace:     'nowrap',
    borderRadius:   'var(--weld-radius, 5px)',
    opacity:        isDisabled && status !== 'loading' ? 0.45 : 1,
    ...sizeMap[size],
    ...getStateStyles({ variant, status, hovered, plasma, intensity, glowOff }),
  }

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={base}
      data-weld-button
      data-status={status}
      data-variant={variant}
    >
      {status === 'loading' && <Spinner />}
      {status === 'success' && showSuccess && <CheckIcon />}
      {status === 'error'   && <ErrorIcon />}
      <span style={status === 'loading' ? { opacity: 0.55 } : undefined}>
        {children}
      </span>
    </button>
  )
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeMap: Record<NonNullable<WeldButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '5px 11px',  fontSize: '12px', height: '30px' },
  md: { padding: '7px 15px',  fontSize: '13px', height: '36px' },
  lg: { padding: '9px 19px',  fontSize: '14px', height: '42px' },
}

// ─── State-driven styles ──────────────────────────────────────────────────────
// At rest: clean, barely-there border.
// On action/hover: plasma activates.

function getStateStyles(p: {
  variant:   NonNullable<WeldButtonProps['variant']>
  status:    ButtonStatus
  hovered:   boolean
  plasma:    string
  intensity: number
  glowOff:   boolean
}): React.CSSProperties {
  const { variant, status, hovered, plasma, intensity, glowOff } = p

  // ── Active states (weld lights up) ────────────────────────────────────────
  if (status === 'loading') {
    return {
      background:  'var(--weld-bg-elevated, #111115)',
      border:      `1px solid ${plasma}`,
      color:       plasma,
      boxShadow:   `0 0 0 1px ${plasma}22, 0 0 ${14 * intensity}px ${plasma}18`,
      animation:   '_weld-pulse 1.4s ease-in-out infinite',
    }
  }

  if (status === 'success') {
    return {
      background: 'rgba(34,197,94,0.07)',
      border:     '1px solid rgba(34,197,94,0.35)',
      color:      'var(--weld-state-success, #22c55e)',
      boxShadow:  '0 0 10px rgba(34,197,94,0.08)',
    }
  }

  if (status === 'error') {
    return {
      background: 'rgba(239,68,68,0.07)',
      border:     '1px solid rgba(239,68,68,0.35)',
      color:      'var(--weld-state-error, #ef4444)',
      animation:  '_weld-shake 0.35s ease',
    }
  }

  // ── Idle variants ─────────────────────────────────────────────────────────
  const variants: Record<string, React.CSSProperties> = {
    primary: hovered
      ? {
          // hover: plasma activates
          background: plasma,
          border:     `1px solid ${plasma}`,
          color:      '#09090b',
          boxShadow:  `0 0 0 1px ${plasma}22, 0 0 ${12 * intensity}px ${plasma}20`,
        }
      : {
          // rest: solid but muted
          background: 'rgba(0,212,255,0.10)',
          border:     '1px solid rgba(0,212,255,0.18)',
          color:      plasma,
        },

    secondary: hovered
      ? {
          background: 'var(--weld-bg-elevated, #111115)',
          border:     '1px solid var(--weld-border-hover, rgba(255,255,255,0.10))',
          color:      'var(--weld-text-primary, #f4f4f5)',
        }
      : {
          background: 'var(--weld-bg-surface, #0d0d10)',
          border:     '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          color:      'var(--weld-text-secondary, #a1a1aa)',
        },

    ghost: hovered
      ? {
          background: 'rgba(255,255,255,0.04)',
          border:     '1px solid transparent',
          color:      'var(--weld-text-primary, #f4f4f5)',
        }
      : {
          background: 'transparent',
          border:     '1px solid transparent',
          color:      'var(--weld-text-muted, #52525b)',
        },

    danger: hovered
      ? {
          background: 'rgba(239,68,68,0.10)',
          border:     '1px solid rgba(239,68,68,0.45)',
          color:      '#ef4444',
          boxShadow:  '0 0 10px rgba(239,68,68,0.10)',
        }
      : {
          background: 'transparent',
          border:     '1px solid rgba(239,68,68,0.20)',
          color:      '#ef4444',
        },
  }

  return variants[variant] ?? variants['primary']!
}

// ─── Micro icons ──────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      width: '12px', height: '12px',
      borderRadius: '50%',
      border: '1.5px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      flexShrink: 0,
      animation: '_weld-spin 0.55s linear infinite',
    }} />
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1.5 6l3 3 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 2v4M6 9.5v.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}
