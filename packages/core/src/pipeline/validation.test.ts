import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validate, WeldValidationError } from './validation.js'

describe('validate', () => {
  it('returns data as-is when no schema is provided (zero-config mode)', () => {
    const data = { id: '1', name: 'Product' }
    expect(validate(data)).toBe(data)
  })

  it('returns validated data when schema matches', () => {
    const schema = z.object({ id: z.string(), name: z.string() })
    const data   = { id: '1', name: 'Product' }
    const result = validate(data, schema)
    expect(result).toEqual(data)
  })

  it('throws WeldValidationError when schema does not match', () => {
    const schema = z.object({ id: z.string(), price: z.number() })
    const data   = { id: '1', price: 'not-a-number' }

    expect(() => validate(data, schema)).toThrow(WeldValidationError)
  })

  it('WeldValidationError contains issues array', () => {
    const schema = z.object({ count: z.number() })
    try {
      validate({ count: 'wrong' }, schema)
    } catch (err) {
      expect(err).toBeInstanceOf(WeldValidationError)
      expect((err as WeldValidationError).issues.length).toBeGreaterThan(0)
    }
  })

  it('applies Zod transforms', () => {
    const schema = z.object({ name: z.string().trim().toUpperCase() })
    const result = validate({ name: '  hello  ' }, schema)
    expect(result.name).toBe('HELLO')
  })
})
