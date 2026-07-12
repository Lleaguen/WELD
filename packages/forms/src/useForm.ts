import { useState, useCallback, useRef } from 'react'
import type { ZodSchema, ZodError } from 'zod'
import type { WeldResponse } from '@weldjs/core'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export type FieldTouched<T> = Partial<Record<keyof T, boolean>>

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface UseFormOptions<T extends Record<string, unknown>> {
  /** Initial field values */
  initialValues:  T
  /** Zod schema for full-form validation */
  schema?:        ZodSchema<T>
  /** Called on valid submit. Return a WeldResponse or Promise. */
  onSubmit:       (values: T) => WeldResponse<unknown> | Promise<unknown>
  /** Called after successful submit */
  onSuccess?:     (result: unknown) => void
  /** Called on submit error */
  onError?:       (error: Error) => void
  /** Validate on change. Default: false (validates on blur + submit) */
  validateOnChange?: boolean
}

export interface UseFormResult<T extends Record<string, unknown>> {
  values:      T
  errors:      FieldErrors<T>
  touched:     FieldTouched<T>
  status:      FormStatus
  isSubmitting: boolean
  isValid:     boolean
  isDirty:     boolean
  /** Register a field — spread onto <input> or pass to <Weld.Input> */
  register:    (name: keyof T) => {
    name:     string
    value:    unknown
    onChange: (value: string) => void
    onBlur:   () => void
    error?:   string
  }
  /** Set a single field value */
  setValue:    (name: keyof T, value: unknown) => void
  /** Set a field error manually */
  setError:    (name: keyof T, message: string) => void
  /** Mark field as touched */
  setTouched:  (name: keyof T) => void
  /** Submit handler — attach to form onSubmit */
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  /** Reset to initial values */
  reset:       () => void
}

export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormResult<T> {
  const { initialValues, schema, onSubmit, onSuccess, onError, validateOnChange = false } = options

  const [values,  setValues]  = useState<T>({ ...initialValues })
  const [errors,  setErrors]  = useState<FieldErrors<T>>({})
  const [touched, setTouchedState] = useState<FieldTouched<T>>({})
  const [status,  setStatus]  = useState<FormStatus>('idle')
  const initialRef = useRef(initialValues)

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialRef.current)
  const isValid = Object.keys(errors).length === 0

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = useCallback((vals: T): FieldErrors<T> => {
    if (!schema) return {}
    const result = schema.safeParse(vals)
    if (result.success) return {}
    const errs: FieldErrors<T> = {}
    ;(result.error as ZodError).issues.forEach((issue) => {
      const key = issue.path[0] as keyof T | undefined
      if (key && !errs[key]) errs[key] = issue.message
    })
    return errs
  }, [schema])

  // ── setValue ───────────────────────────────────────────────────────────────
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      if (validateOnChange) setErrors(validate(next))
      return next
    })
  }, [validate, validateOnChange])

  const setError = useCallback((name: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }))
  }, [])

  const setTouched = useCallback((name: keyof T) => {
    setTouchedState((prev) => ({ ...prev, [name]: true }))
    // Validate on blur
    setErrors(validate(values))
  }, [validate, values])

  // ── register ───────────────────────────────────────────────────────────────
  const register = useCallback((name: keyof T): {
    name: string
    value: unknown
    onChange: (value: string) => void
    onBlur: () => void
    error?: string
  } => {
    const fieldError = touched[name] ? (errors[name] as string | undefined) : undefined
    return {
      name:     String(name),
      value:    values[name] as unknown,
      onChange: (value: string) => setValue(name, value),
      onBlur:   () => setTouched(name),
      ...(fieldError !== undefined ? { error: fieldError } : {}),
    }
  }, [values, errors, touched, setValue, setTouched])

  // ── handleSubmit ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    // Touch all fields
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true
      return acc
    }, {} as FieldTouched<T>)
    setTouchedState(allTouched)

    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    try {
      const result = onSubmit(values)
      const resolved = await ('promise' in result ? result.promise : result)
      setStatus('success')
      onSuccess?.(resolved)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setStatus('error')
      onError?.(error)
    }
  }, [values, validate, onSubmit, onSuccess, onError])

  // ── reset ──────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setValues({ ...initialRef.current })
    setErrors({})
    setTouchedState({})
    setStatus('idle')
  }, [])

  return {
    values,
    errors,
    touched,
    status,
    isSubmitting: status === 'submitting',
    isValid,
    isDirty,
    register,
    setValue,
    setError,
    setTouched,
    handleSubmit,
    reset,
  }
}
