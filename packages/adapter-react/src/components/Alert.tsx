/**
 * @weldjs/react — <Weld.Alert />
 *
 * Inline feedback message for info, success, warning and error states.
 *
 * Usage:
 *   <Weld.Alert variant="error" title="Request failed">
 *     Check your network connection and try again.
 *   </Weld.Alert>
 */

import React, { type ReactNode } from 'react'

export interface WeldAlertProps {
  children?:  ReactNode
  variant?:   'info' | 'success' | 'warning' | 'error'
  title?:     string
  /** Left accent line — default: true */
  accent?:    boolean
  className?: string
  style?:     React.CSSProperties
}

const alertStyles = {
  info:    { bg: 'rgba(59,107,255,0.06)',  border: 'rgba(59,107,255,0.18)',  accent: '#3b6bff', icon: 'ℹ',  color: 'var(--weld-plasma-cobalt, #3b6bff)' },
  success: { bg: 'rgba(34,197,94,0.06)',   border: 'rgba(34,197,94,0.18)',   accent: '#22c55e', icon: '✓',  color: '#22c55e' },
  warning: { bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.18)',  accent: '#f59e0b', icon: '⚠',  color: '#f59e0b' },
  error:   { bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.18)',   accent: '#ef4444', icon: '✕',  color: '#ef4444' },
}

export function Alert({
  children,
  variant = 'info',
  title,
  accent = true,
  className,
  style,
}: WeldAlertProps) {
  const s = alertStyles[variant]

  return (
    <div
      className={className}
      role="alert"
      data-weld-alert
      data-variant={variant}
      style={{
        display:     'flex',
        gap:         '10px',
        padding:     '12px 14px',
        background:  s.bg,
        border:      `1px solid ${s.border}`,
        borderLeft:  accent ? `2px solid ${s.accent}` : undefined,
        borderRadius: 'var(--weld-radius, 5px)',
        ...style,
      }}
    >
      {/* Icon */}
      <span style={{
        fontSize:   '0.8rem',
        color:      s.color,
        fontWeight: 600,
        flexShrink: 0,
        marginTop:  '1px',
      }}>
        {s.icon}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{
            margin:     '0 0 3px',
            fontSize:   '0.8125rem',
            fontWeight: 600,
            color:      s.color,
          }}>
            {title}
          </p>
        )}
        {children && (
          <div style={{
            fontSize: '0.8125rem',
            color:    'var(--weld-text-secondary, #a1a1aa)',
            lineHeight: 1.55,
          }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
