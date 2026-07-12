import React, { type ReactNode } from 'react'

export interface WeldFormFieldProps {
  label?:    string
  error?:    string
  hint?:     string
  required?: boolean
  children:  ReactNode
}

export function FormField({ label, error, hint, required, children }: WeldFormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--weld-text-secondary, #a1a1aa)', letterSpacing: '0.01em' }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {children}
      {error && <span role="alert" style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: '12px', color: 'var(--weld-text-muted, #52525b)' }}>{hint}</span>}
    </div>
  )
}
