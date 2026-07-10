/**
 * @weldjs/react — <Weld.Input />
 *
 * Universal input component. A single abstraction that renders as:
 * - text, email, password, number → <input>
 * - multiline → <textarea>
 * - select → <select>
 * - date → <input type="date">
 *
 * Connects directly to a Zod schema for inline validation.
 * Shows network errors from WeldResponse automatically.
 *
 * Usage:
 *   <Weld.Input type="text"      label="Email"  schema={EmailSchema} />
 *   <Weld.Input type="multiline" label="Notes" />
 *   <Weld.Input type="select"    label="Role"   options={['admin','user']} />
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
  /** Input type — controls rendering and behavior */
  type?:    InputType
  /** Visible label */
  label?:   string
  /** Placeholder text */
  placeholder?: string
  /** Current value (controlled) */
  value?:   string | number
  /** Default value (uncontrolled) */
  defaultValue?: string | number
  /** onChange handler */
  onChange?: (value: string) => void
  /** Zod schema for inline validation */
  schema?:  ZodSchema
  /** External error message (e.g. from API response) */
  error?:   string
  /** Helper text shown below the input */
  hint?:    string
  /** Disabled state */
  disabled?: boolean
  /** Required field */
  required?: boolean
  /** Options for select type */
  options?: string[] | { label: string; value: string }[]
  /**
   * Neon theme:
   * - true/object → Neon Theme Engine active
   * - 'none' → No visual styles, only structure preserved
   */
  neon?:    boolean | NeonConfig | 'none'
  /** Additional class name */
  className?: string
  /** Name attribute */
  name?: string
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
  const id           = useId()
  const [touched,  setTouched]  = useState(false)
  const [internalVal, setInternalVal] = useState(defaultValue ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)

  const currentValue = value !== undefined ? value : internalVal
  const displayError = externalError ?? (touched ? validationError : null)
  const noStyle      = neon === 'none' || neon === false

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value
    setInternalVal(val)
    onChange?.(val)

    // Inline Zod validation
    if (schema) {
      const result = schema.safeParse(val)
      setValidationError(result.success ? null : result.error.issues[0]?.message ?? 'Invalid value')
    }
  }

  const handleBlur = () => setTouched(true)

  // ── Focus state for neon glow ─────────────────────────────────────────────
  const [focused, setFocused] = useState(false)

  const neonColor = typeof neon === 'object' && neon !== null && 'color' in neon
    ? (neon.color ?? 'var(--weld-neon-primary, #00d4ff)')
    : 'var(--weld-neon-primary, #00d4ff)'

  const intensity = typeof neon === 'object' && neon !== null && 'intensity' in neon
    ? (neon.intensity ?? 1)
    : 1

  // ── Shared field styles ────────────────────────────────────────────────────
  const fieldStyles: React.CSSProperties = noStyle ? {} : {
    width:           '100%',
    padding:         '9px 12px',
    fontSize:        '14px',
    fontFamily:      'inherit',
    background:      'var(--weld-bg-surface, #111113)',
    color:           'var(--weld-text-primary, #fafafa)',
    border:          displayError
      ? '1px solid #ef4444'
      : focused
        ? `1px solid ${neonColor}`
        : '1px solid var(--weld-border, rgba(255,255,255,0.08))',
    borderRadius:    'var(--weld-radius, 6px)',
    outline:         'none',
    transition:      'border 0.15s ease, box-shadow 0.15s ease',
    boxShadow:       focused && !displayError
      ? `0 0 0 1px ${neonColor}33, 0 0 ${10 * intensity}px ${neonColor}22`
      : displayError
        ? '0 0 0 1px rgba(239,68,68,0.3)'
        : 'none',
    opacity:         disabled ? 0.5 : 1,
    cursor:          disabled ? 'not-allowed' : 'text',
    resize:          type === 'multiline' ? 'vertical' : undefined,
    minHeight:       type === 'multiline' ? '100px' : undefined,
  }

  const commonProps = {
    id,
    name,
    disabled,
    required,
    placeholder,
    style:     fieldStyles,
    className,
    onChange:  handleChange,
    onBlur:    handleBlur,
    onFocus:   () => setFocused(true),
    'data-weld-input': type,
  }

  // ── Render field ──────────────────────────────────────────────────────────
  let field: React.ReactNode

  if (type === 'multiline') {
    field = (
      <textarea
        {...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        value={currentValue}
        rows={4}
      />
    )
  } else if (type === 'select') {
    field = (
      <select
        {...(commonProps as SelectHTMLAttributes<HTMLSelectElement>)}
        value={currentValue}
        style={{ ...fieldStyles, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <option value="" disabled>{placeholder ?? 'Select an option'}</option>
        {options.map((opt) => {
          const val   = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          return <option key={val} value={val}>{label}</option>
        })}
      </select>
    )
  } else {
    field = (
      <input
        {...(commonProps as InputHTMLAttributes<HTMLInputElement>)}
        type={type}
        value={currentValue}
      />
    )
  }

  // ── Wrapper ───────────────────────────────────────────────────────────────
  const wrapperStyles: React.CSSProperties = noStyle ? {} : {
    display:       'flex',
    flexDirection: 'column',
    gap:           '6px',
    width:         '100%',
  }

  const labelStyles: React.CSSProperties = noStyle ? {} : {
    fontSize:    '13px',
    fontWeight:  500,
    color:       'var(--weld-text-primary, #fafafa)',
    userSelect:  'none',
  }

  const errorStyles: React.CSSProperties = noStyle ? {} : {
    fontSize:  '12px',
    color:     '#ef4444',
    marginTop: '2px',
  }

  const hintStyles: React.CSSProperties = noStyle ? {} : {
    fontSize: '12px',
    color:    'var(--weld-text-muted, #71717a)',
  }

  return (
    <div style={wrapperStyles}>
      {label && (
        <label htmlFor={id} style={labelStyles}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {field}
      {displayError && <span style={errorStyles} role="alert">{displayError}</span>}
      {hint && !displayError && <span style={hintStyles}>{hint}</span>}
    </div>
  )
}
