const DEFAULT_PREFIX_PATTERN = /^mosaic christian fellowship\s*[-–]\s*/i

const DEFAULT_LOCATION_TOKENS = [
  'mosaic christian fellowship',
  '119 rockland',
  'rockland ave',
  '147 walnut',
  'northvale, nj',
]

export function displayableLocation(loc: string | null | undefined): string | null {
  if (!loc) return null
  let trimmed = loc.trim()
  if (!trimmed) return null
  trimmed = trimmed.replace(DEFAULT_PREFIX_PATTERN, '').trim()
  if (!trimmed) return null
  const lower = trimmed.toLowerCase()
  if (DEFAULT_LOCATION_TOKENS.some((token) => lower.includes(token))) return null
  return trimmed
}
