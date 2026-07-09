/**
 * WELD — Pipeline Layer 4: Validation
 * Validates runtime responses against a Zod schema.
 * If no schema is provided, the raw data passes through (zero-config mode).
 */

import type { ZodSchema } from 'zod'

export class WeldValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: unknown[],
  ) {
    super(message)
    this.name = 'WeldValidationError'
  }
}

/**
 * Validates `data` against `schema` using Zod's safeParse.
 * Returns the parsed (and potentially transformed) data on success.
 * Throws WeldValidationError on failure.
 *
 * If no schema is provided, returns data as-is (zero-config mode).
 */
export function validate<T>(data: unknown, schema?: ZodSchema<T> | undefined): T {
  if (!schema) return data as T

  const result = schema.safeParse(data)

  if (!result.success) {
    throw new WeldValidationError(
      `[WELD] Response validation failed: ${result.error.message}`,
      result.error.issues,
    )
  }

  return result.data
}
