import { describe, it, expect } from 'vitest'
import {
  validateRequired,
  validateEmail,
  validateFormInput,
  validateStringLength,
  validateArray,
  type ValidationError,
} from '@/lib/validate'

describe('validateRequired', () => {
  it('returns error for missing fields', () => {
    const errors = validateRequired({ name: '', email: 'test@test.com' }, ['name', 'email'])
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('name')
  })

  it('returns empty array when all required fields present', () => {
    const errors = validateRequired({ name: 'John', email: 'test@test.com' }, ['name', 'email'])
    expect(errors).toHaveLength(0)
  })

  it('treats null and undefined as missing', () => {
    const errors = validateRequired({ name: null, email: undefined }, ['name', 'email'])
    expect(errors).toHaveLength(2)
  })
})

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('user+tag@sub.domain.com')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('notanemail')).toBe(false)
    expect(validateEmail('@missing.com')).toBe(false)
  })

  it('accepts undefined when not required', () => {
    expect(validateEmail(undefined)).toBe(true)
  })
})

describe('validateStringLength', () => {
  it('rejects strings exceeding max length', () => {
    const errors = validateStringLength({ msg: 'a'.repeat(6000) }, 5000)
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('msg')
  })

  it('accepts strings within limit', () => {
    const errors = validateStringLength({ msg: 'short' }, 5000)
    expect(errors).toHaveLength(0)
  })

  it('ignores non-string values', () => {
    const errors = validateStringLength({ count: 999, arr: [1, 2] }, 5000)
    expect(errors).toHaveLength(0)
  })
})

describe('validateArray', () => {
  it('rejects non-array values', () => {
    const errors = validateArray({ teams: 'not an array' }, 'teams')
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toContain('must be an array')
  })

  it('accepts array values', () => {
    const errors = validateArray({ teams: ['a', 'b'] }, 'teams')
    expect(errors).toHaveLength(0)
  })

  it('accepts undefined/null (not present)', () => {
    const errors = validateArray({}, 'teams')
    expect(errors).toHaveLength(0)
  })
})

describe('validateFormInput', () => {
  it('returns errors for invalid input', () => {
    const result = validateFormInput(
      { email: 'bad' },
      { required: ['name', 'email'], emailField: 'email' }
    )
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('returns valid for correct input', () => {
    const result = validateFormInput(
      { name: 'John', email: 'john@test.com' },
      { required: ['name', 'email'], emailField: 'email' }
    )
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects non-array when arrayFields specified', () => {
    const result = validateFormInput(
      { name: 'John', email: 'john@test.com', teams: 'not-array' },
      { required: ['name', 'email'], arrayFields: ['teams'] }
    )
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'teams')).toBe(true)
  })

  it('rejects oversized string inputs', () => {
    const result = validateFormInput(
      { name: 'John', message: 'x'.repeat(6000) },
      { required: ['name'], maxLength: 5000 }
    )
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'message')).toBe(true)
  })
})
