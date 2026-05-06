export const UNATTRIBUTED_SPEAKER = 'Undefined'

export interface ParsedSermonTitle {
  title: string
  speaker: string | null
  seriesHint: string | null
  parsed: boolean
}

// "by [Pastor] Name" — captured globally so we can take the LAST match.
// (Titles can contain mid-phrase "by", e.g., "Walk by Faith" — speaker is the trailing one.)
const SPEAKER_BY_RE = /\bby:?\s+(Pastor\s+)?([A-Z][a-zA-Z'’]+(?:\s+[A-Z][a-zA-Z'’]+){0,2})\b/gi

// "Pastor Name" preceded by a closing quote or pipe (catches titles that drop "by").
const SPEAKER_PASTOR_RE = /(?:["”]|\|)\s*(Pastor\s+[A-Z][a-zA-Z'’]+(?:\s+[A-Z][a-zA-Z'’]+){0,2})\b/i

function extractSpeaker(raw: string): string | null {
  const byMatches = [...raw.matchAll(SPEAKER_BY_RE)]
  if (byMatches.length > 0) {
    const last = byMatches[byMatches.length - 1]
    const prefix = last[1] ? 'Pastor ' : ''
    return `${prefix}${last[2]}`.replace(/\s+/g, ' ').trim()
  }
  const pastorMatch = raw.match(SPEAKER_PASTOR_RE)
  if (pastorMatch) return pastorMatch[1].replace(/\s+/g, ' ').trim()
  return null
}

// Strip a trailing "by [...] Name" tail from a title for cleaner display.
// Conservative: only strip if the match sits within the last 30 chars.
function stripSpeakerTail(raw: string): string {
  const m = raw.match(/\bby:?\s+(?:Pastor\s+)?[A-Z][a-zA-Z'’]+(?:\s+[A-Z][a-zA-Z'’]+){0,2}\b/i)
  if (!m || m.index === undefined) return raw
  const matchEnd = m.index + m[0].length
  if (raw.length - matchEnd > 30) return raw
  return raw.substring(0, m.index).replace(/[\s|—:\-]+$/, '').trim()
}

export function parseSermonTitle(raw: string): ParsedSermonTitle {
  const speaker = extractSpeaker(raw)

  // Pattern: Mosaic Christian Fellowship[: / Live: / Live |] "Title" ...
  const mosaicMatch = raw.match(/Mosaic Christian Fellowship(?:\s*Live)?[\s:|]+\s*["“](.+?)["”]/i)
  if (mosaicMatch) {
    return { title: mosaicMatch[1].trim(), speaker, seriesHint: null, parsed: true }
  }

  // Pattern: leading quoted title — "Title" ...
  const quotedMatch = raw.match(/^["“](.+?)["”]/)
  if (quotedMatch) {
    return { title: quotedMatch[1].trim(), speaker, seriesHint: null, parsed: true }
  }

  // Pattern: M/D/YY[YY] Series: Title  (also accepts 1-2 digit month/day, 2 or 4 digit year)
  const dateSeriesMatch = raw.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}\s+(.+?):\s+(.+)$/)
  if (dateSeriesMatch) {
    let title = stripSpeakerTail(dateSeriesMatch[2].trim())
    title = title.replace(/^["“](.+)["”]$/, '$1').trim()
    return { title, speaker, seriesHint: dateSeriesMatch[1].trim(), parsed: true }
  }

  // Pattern: Month Day - Title  (drops trailing parenthetical notes like "(AUDIO FIXED)")
  const monthDayMatch = raw.match(/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+\s*-\s*(.+?)(?:\s*\(.*\))?$/i)
  if (monthDayMatch) {
    return { title: stripSpeakerTail(monthDayMatch[1].trim()), speaker, seriesHint: null, parsed: true }
  }

  // Fallback: whole raw string with the speaker tail removed.
  // parsed=true if we at least captured a speaker; false if neither title nor speaker was matchable.
  return { title: stripSpeakerTail(raw), speaker, seriesHint: null, parsed: speaker !== null }
}

export interface ParsedGroupName {
  demographic: string
  dayOfWeek: string | null
  location: string | null
  parsed: boolean
}

const DAY_MAP: Record<string, string> = {
  mondays: 'Monday', monday: 'Monday',
  tuesdays: 'Tuesday', tuesday: 'Tuesday',
  wednesdays: 'Wednesday', wednesday: 'Wednesday',
  thursdays: 'Thursday', thursday: 'Thursday',
  fridays: 'Friday', friday: 'Friday',
  saturdays: 'Saturday', saturday: 'Saturday',
  sundays: 'Sunday', sunday: 'Sunday',
}

const DEMOGRAPHIC_MAP: [RegExp, string][] = [
  [/^50\+/i, '50+'],
  [/^mom'?s?\b/i, 'Moms'],
  [/^daytime\s+mom/i, 'Moms'],
  [/^daytime\s+women/i, "Women's"],
  [/^women'?s?\b/i, "Women's"],
  [/^men'?s?\b/i, "Men's"],
  [/^ya\s+women/i, "YA Women's"],
  [/^ya\s+men/i, "YA Men's"],
  [/^ya\s+co-?ed/i, 'YA Co-Ed'],
  [/^co-?ed\b/i, 'Co-Ed'],
  [/^married\b/i, 'Married'],
  [/^famil(?:y|ies)\s+with\s+teen/i, 'Families with Teens'],
  [/^famil(?:y|ies)\s+with\s+older/i, 'Families with Kids'],
  [/^famil(?:y|ies)\s+with\s+kid/i, 'Families with Kids'],
]

export function parseGroupName(name: string): ParsedGroupName {
  const fgPattern = /^(.+?)\s*FG\s*\d*\s*\((\w+)\s*[@&]\s*(.+)\)$/i
  const match = name.match(fgPattern)

  if (!match) {
    return { demographic: 'General', dayOfWeek: null, location: null, parsed: false }
  }

  const rawDemographic = match[1].trim()
  const rawDay = match[2].trim().toLowerCase()
  const rawLocation = match[3].trim()

  let demographic = rawDemographic
  for (const [pattern, label] of DEMOGRAPHIC_MAP) {
    if (pattern.test(rawDemographic)) {
      demographic = label
      break
    }
  }

  const dayOfWeek = DAY_MAP[rawDay] ?? null

  return {
    demographic,
    dayOfWeek,
    location: rawLocation,
    parsed: true,
  }
}
