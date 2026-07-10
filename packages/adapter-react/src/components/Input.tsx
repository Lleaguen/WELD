/**
 * @weldjs/react — <Weld.Input />
 *
 * Universal input. At rest: invisible, just a clean dark field.
 * On focus: the weld seam illuminates — thin cyan glow on the border.
 * On error: switches to red without glow. Clean signal, no noise.
 */

import React, {
  useState,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ChangeEvent,
} from 'react'
import type { ZodSchema } from 'zod'

// ─── Types ────────────────────────────────────────────────────────────────────

type InputType = 'text' | 'email' | 'password' | 'number' | 'multiline' | 'select' | 'date' | 'url' | 'tel'

type NeonConfig = { color?: string; intensity?: number }

export interface WeldInputProps {
  type?:         InputType
  label?:        string
  placeholder?:  string
  value?:        string | number
  defaultValue?: string | number
  onChange?:     (value: string) => void
  /** Zod schema for inline validation */
  schema?:       ZodSchema
  /** External error (e.g. from API response) */
  error?:        string
  hint?:         string
  disabled?:     boolean
  required?:     boolean
  options?:      string[] | { label: string; value: string }[]
  /**
   * - true/object → Neon Theme Engine (default)
   * - false/'none' → No styles, structure only
   */
  neon?:         boolean | NeonConfig | 'none'
  className?:    string
  name?:         string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Input({
  type = 'text',
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  schema,
  error: externalError,
  hint,
  disabled,
  required,
  options = [],
  neon = true,
  className,
  name,
}: WeldInputProps) {
  const id               = useId()
  const [touched, setTouched]       = useState(false)
  const [internalVal, setInternalVal] = useState(defaultValue ?? '')
  const [validationErr, setValidationErr] = useState<string | null>(null)
  const [focused, setFocused]       = useState(false)

  const currentValue = value !== undefined ? value : internalVal
  const displayError = externalError ?? (touched ? validationErr : null)
  const noStyle      = neon === 'none' || neon === false

  const plasma = typeof neon === 'object' && neon !== null && 'color' in neon
    ? (neon.color ?? 'var(--weld-plasma-cyan, #00d4ff)')
    : 'var(--weld-plasma-cyan, #00d4ff)'

  const intensity = typeof neon === 'object' && neon !== null && 'intensity' in neon
    ? (neon.intensity ?? 1) : 1

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value
    setInternalVal(val)
    onChange?.(val)
    if (schema) {
      const result = schema.safeParse(val)
      setValidationErr(result.success ? null : (result.error.issues[0]?.message ?? 'Invalid value'))
    }
  }

  if (noStyle) {
    const commonProps = { id, name, disabled, required, placeholder, className, onChange: handleChange, onBlur: () => setTouched(true) }
    let field: React.ReactNode
    if (type === 'multiline') field = <textarea {...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)} value={currentValue} />
    else if (type === 'select') field = (
      <select {...(commonProps as SelectHTMLAttributes<HTMLSelectElement>)} value={currentValue}>
        <option value="" disabled>{placeholder ?? 'Select an option'}</option>
        {options.map((o) => { const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label; return <option key={v} value={v}>{l}</option> })}
      </select>
    )
    else field = <input {...(commonProps as InputHTMLAttributes<HTMLInputElement>)} type={type} value={currentValue} />
    return <div className={className}>{label && <label htmlFor={id}>{label}{required && <span>*</span>}</label>}{field}{displayError && <span role="alert">{displayError}</span>}{hint && !displayError && <span>{hint}</span>}</div>
  }

  // ── Field styles — the weld seam ──────────────────────────────────────────
  // At rest: barely visible. On focus: thin plasma line activates.

  const fieldStyles: React.CSSProperties = {
    width:        '100%',
    padding:      type === 'multiline' ? '10px 12px' : '0 12px',
    height:       type === 'multiline' ? 'auto' : '36px',
    minHeight:    type === 'multiline' ? '96px' : undefined,
    fontSize:     '13px',
    lineHeight:   type === 'multiline' ? '1.6' : undefined,
    fontFamily:   'inherit',
    background:   focused
      ? 'var(--weld-bg-elevated, #111115)'
      : 'var(--weld-bg-surface, #0d0d10)',
    color:        'var(--weld-text-primary, #f4f4f5)',
    border:       displayError
      ? '1px solid rgba(239,68,68,0.50)'
      : focused
        ? `1px solid ${plasma}`
        : '1px solid var(--weld-border, rgba(255,255,255,0.06))',
    borderRadius: 'var(--weld-radius, 5px)',
    outline:      'none',
    transition:   'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
    // The weld seam: glow only on focus, diffused and subtle
    boxShadow: displayError
      ? '0 0 0 1px rgba(239,68,68,0.15)'
      : focused
        ? `0 0 0 1px ${plasma}18, 0 0 ${14 * intensity}px ${plasma}0e`
        : 'none',
    opacity:      disabled ? 0.45 : 1,
    cursor:       disabled ? 'not-allowed' : type === 'select' ? 'pointer' : 'text',
    resize:       type === 'multiline' ? 'vertical' : undefined,
  }

  const commonProps = {
    id, name, disabled, required, placeholder,
    style:    fieldStyles,
    onChange: handleChange,
    onBlur:   () => { setTouched(true); setFocused(false) },
    onFocus:  () => setFocused(true),
    'data-weld-input': type,
  }

  let field: React.ReactNode
  if (type === 'multiline') {
    field = <textarea {...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)} value={currentValue} rows={4} />
  } else if (type === 'select') {
    field = (
      <select {...(commonProps as SelectHTMLAttributes<HTMLSelectElement>)} value={currentValue}>
        <option value="" disabled>{placeholder ?? 'Select an option'}</option>
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value
          const l = typeof o === 'string' ? o : o.label
          return <option key={v} value={v}>{l}</option>
        })}
      </select>
    )
  } else {
    field = <input {...(commonProps as InputHTMLAttributes<HTMLInputElement>)} type={type} value={currentValue} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '12px', fontWeight: 500, color: 'var(--weld-text-secondary, #a1a1aa)', userSelect: 'none', letterSpacing: '0.01em' }}>
          {label}
          {required && <span style={{ color: 'var(--weld-state-error, #ef4444)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {field}
      {displayError && (
        <span role="alert" style={{ fontSize: '12px', color: 'var(--weld-state-error, #ef4444)', letterSpacing: '0.005em' }}>
          {displayError}
        </span>
      )}
      {hint && !displayError && (
        <span style={{ fontSize: '12px', color: 'var(--weld-text-muted, #52525b)' }}>
          {hint}
        </span>
      )}
    </div>
  )
}
