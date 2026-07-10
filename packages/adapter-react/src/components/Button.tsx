/**
 * @weldjs/react — <Weld.Button />
 *
 * A button that is directly "welded" to a network promise lifecycle.
 * Automatically manages loading, disabled, success and error states
 * without any local state boilerplate from the user.
 *
 * Usage:
 *   <Weld.Button action={() => api.post('v1/orders', Schema, { body })}>
 *     Create Order
 *   </Weld.Button>
 */

import React, { useState, useCallback, type ReactNode, type ButtonHTMLAttributes } from 'react'
import type { WeldResponse } from '@weldjs/core'

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

type NeonConfig = {
  color?:     string  // neon color override
  intensity?: number  // 0–1, default 1
}

export interface WeldButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** The network action — returns a WeldResponse or a Promise */
  action?: () => WeldResponse<unknown> | Promise<unknown>
  /** Button content */
  children: ReactNode
  /**
   * Neon theme level:
   * - true / object → Level 1 or 2: Neon Theme Engine active
   * - false / "none" → Level 3: No visual styles, only structure
   */
  neon?: boolean | NeonConfig | 'none'
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Show success checkmark briefly after action resolves */
  showSuccess?: boolean
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

  const handleClick = useCallback(async () => {
    if (!action || status === 'loading') return

    setStatus('loading')
    try {
      const result = action()
      // Support both WeldResponse and plain Promise
      await ('promise' in result ? result.promise : result)
      setStatus('success')
      if (showSuccess) {
        setTimeout(() => setStatus('idle'), 1500)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [action, status, showSuccess])

  const isDisabled = disabled || status === 'loading'
  const noStyle    = neon === 'none' || neon === false

  // ── Styles ─────────────────────────────────────────────────────────────────

  const baseStyles: React.CSSProperties = noStyle ? {} : {
    position:        'relative',
    display:         'inline-flex',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             '8px',
    fontFamily:      'inherit',
    fontWeight:      500,
    letterSpacing:   '0.01em',
    cursor:          isDisabled ? 'not-allowed' : 'pointer',
    transition:      'all 0.15s ease',
    border:          '1px solid transparent',
    outline:         'none',
    userSelect:      'none',
    whiteSpace:      'nowrap',
    borderRadius:    'var(--weld-radius, 6px)',
    // Size
    ...sizeStyles[size],
    // Variant + status
    ...getVariantStyles(variant, status, neon),
  }

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onClick={handleClick}
      className={className}
      style={noStyle ? undefined : baseStyles}
      data-weld-status={status}
      data-weld-variant={variant}
    >
      {status === 'loading' && !noStyle && <PulseIcon />}
      {status === 'success' && !noStyle && showSuccess && <CheckIcon />}
      {status === 'error'   && !noStyle && <ErrorIcon />}
      <span style={status === 'loading' && !noStyle ? { opacity: 0.6 } : undefined}>
        {children}
      </span>
    </button>
  )
}

// ─── Size styles ──────────────────────────────────────────────────────────────

const sizeStyles: Record<NonNullable<WeldButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '6px 12px',  fontSize: '13px', height: '32px' },
  md: { padding: '8px 16px',  fontSize: '14px', height: '38px' },
  lg: { padding: '10px 20px', fontSize: '15px', height: '44px' },
}

// ─── Variant + status styles ──────────────────────────────────────────────────

function getVariantStyles(
  variant: NonNullable<WeldButtonProps['variant']>,
  status:  ButtonStatus,
  neon:    WeldButtonProps['neon'],
): React.CSSProperties {
  const neonColor = typeof neon === 'object' && neon !== null && 'color' in neon
    ? (neon.color ?? 'var(--weld-neon-primary, #00d4ff)')
    : 'var(--weld-neon-primary, #00d4ff)'

  const intensity = typeof neon === 'object' && neon !== null && 'intensity' in neon
    ? (neon.intensity ?? 1)
    : 1

  if (status === 'loading') {
    return {
      background:  `var(--weld-bg-elevated, #18181b)`,
      border:      `1px solid ${neonColor}`,
      color:       neonColor,
      boxShadow:   `0 0 ${12 * intensity}px ${neonColor}59`,
      animation:   'weld-pulse 1.2s ease-in-out infinite',
    }
  }

  if (status === 'error') {
    return {
      background: 'rgba(239,68,68,0.1)',
      border:     '1px solid #ef4444',
      color:      '#ef4444',
      animation:  'weld-shake 0.4s ease',
    }
  }

  if (status === 'success') {
    return {
      background: 'rgba(0,212,100,0.1)',
      border:     '1px solid #00d464',
      color:      '#00d464',
    }
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: neonColor,
      border:     `1px solid ${neonColor}`,
      color:      '#09090b',
    },
    secondary: {
      background:  'var(--weld-bg-elevated, #18181b)',
      border:      `1px solid var(--weld-border, rgba(255,255,255,0.08))`,
      color:       'var(--weld-text-primary, #fafafa)',
    },
    ghost: {
      background: 'transparent',
      border:     '1px solid transparent',
      color:      'var(--weld-text-muted, #71717a)',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      border:     '1px solid rgba(239,68,68,0.4)',
      color:      '#ef4444',
    },
  }

  return variants[variant] ?? variants.primary!
}

// ─── Micro icons ──────────────────────────────────────────────────────────────

function PulseIcon() {
  return (
    <span
      style={{
        width:        '14px',
        height:       '14px',
        borderRadius: '50%',
        border:       '2px solid currentColor',
        borderTopColor: 'transparent',
        display:      'inline-block',
        animation:    'weld-spin 0.6s linear infinite',
        flexShrink:   0,
      }}
    />
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── CSS animations (injected once) ──────────────────────────────────────────

if (typeof document !== 'undefined') {
  const styleId = '__weld_button_styles__'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes weld-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes weld-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.5; }
      }
      @keyframes weld-shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-4px); }
        40%       { transform: translateX(4px); }
        60%       { transform: translateX(-3px); }
        80%       { transform: translateX(3px); }
      }
      [data-weld-variant]:not([style*="none"]):hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }
      [data-weld-variant]:not([style*="none"]):active:not(:disabled) {
        transform: translateY(0);
      }
    `
    document.head.appendChild(style)
  }
}
