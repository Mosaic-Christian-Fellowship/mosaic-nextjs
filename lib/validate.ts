export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): ValidationError[] {
  const errors: ValidationError[] = []
  for (const field of fields) {
    const value = data[field]
    if (value === undefined || value === null || value === '') {
      errors.push({ field, message: `${field} is required` })
    }
  }
  return errors
}

export function validateEmail(email: string | undefined | null): boolean {
  if (email === undefined || email === null) return true
  if (email === '') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const DEFAULT_MAX_LENGTH = 5000

export function validateStringLength(
  data: Record<string, unknown>,
  maxLength = DEFAULT_MAX_LENGTH
): ValidationError[] {
  const errors: ValidationError[] = []
  for (const [field, value] of Object.entries(data)) {
    if (typeof value === 'string' && value.length > maxLength) {
      errors.push({ field, message: `${field} exceeds maximum length of ${maxLength}` })
    }
  }
  return errors
}

export function validateArray(
  data: Record<string, unknown>,
  field: string
): ValidationError[] {
  const value = data[field]
  if (value !== undefined && value !== null && !Array.isArray(value)) {
    return [{ field, message: `${field} must be an array` }]
  }
  return []
}

export function validateFormInput(
  data: Record<string, unknown>,
  options: {
    required: string[]
    emailField?: string
    arrayFields?: string[]
    maxLength?: number
  }
): ValidationResult {
  const errors: ValidationError[] = []

  errors.push(...validateRequired(data, options.required))

  if (options.emailField) {
    const email = data[options.emailField] as string | undefined
    if (email && !validateEmail(email)) {
      errors.push({ field: options.emailField, message: 'Invalid email address' })
    }
  }

  if (options.arrayFields) {
    for (const field of options.arrayFields) {
      errors.push(...validateArray(data, field))
    }
  }

  errors.push(...validateStringLength(data, options.maxLength))

  return { valid: errors.length === 0, errors }
}
