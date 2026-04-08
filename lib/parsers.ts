export interface ParsedSermonTitle {
  title: string
  speaker: string | null
  seriesHint: string | null
  parsed: boolean
}

export function parseSermonTitle(raw: string): ParsedSermonTitle {
  // Pattern 1: Mosaic Christian Fellowship[: / Live: / Live |] "Title" [by] Pastor Name
  const mosaicPattern = /Mosaic Christian Fellowship(?:\s*Live)?[\s:|]+\s*["\u201C](.+?)["\u201D]\s*(?:by\s+)?(?:Pastor\s+.+)/i
  const mosaicMatch = raw.match(mosaicPattern)
  if (mosaicMatch) {
    const speakerMatch = raw.match(/(?:by\s+)?(Pastor\s+[\w\s]+?)$/i)
    return {
      title: mosaicMatch[1].trim(),
      speaker: speakerMatch ? speakerMatch[1].trim() : null,
      seriesHint: null,
      parsed: true,
    }
  }

  // Pattern 2: "Title" by Pastor Name (no prefix)
  const quotedPattern = /^["\u201C](.+?)["\u201D]\s+by\s+(Pastor\s+[\w\s]+)$/i
  const quotedMatch = raw.match(quotedPattern)
  if (quotedMatch) {
    return {
      title: quotedMatch[1].trim(),
      speaker: quotedMatch[2].trim(),
      seriesHint: null,
      parsed: true,
    }
  }

  // Pattern 3: MM/DD/YYYY Series: Title
  const dateSeriesPattern = /^\d{2}\/\d{2}\/\d{4}\s+(.+?):\s+(.+)$/
  const dateSeriesMatch = raw.match(dateSeriesPattern)
  if (dateSeriesMatch) {
    return {
      title: dateSeriesMatch[2].trim(),
      speaker: null,
      seriesHint: dateSeriesMatch[1].trim(),
      parsed: true,
    }
  }

  // Pattern 4: Month Day - Title (optionally with parenthetical notes)
  const monthDayPattern = /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+\s*-\s*(.+?)(?:\s*\(.*\))?$/i
  const monthDayMatch = raw.match(monthDayPattern)
  if (monthDayMatch) {
    return {
      title: monthDayMatch[1].trim(),
      speaker: null,
      seriesHint: null,
      parsed: true,
    }
  }

  // No pattern matched — return raw title
  return {
    title: raw.trim(),
    speaker: null,
    seriesHint: null,
    parsed: false,
  }
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
  // Pattern: [Demographic] FG [#] ([Day] @ [Location])
  // Also handles: [Demographic] FG [#] ([Day] & [Location])
  const fgPattern = /^(.+?)\s*FG\s*\d*\s*\((\w+)\s*[@&]\s*(.+)\)$/i
  const match = name.match(fgPattern)

  if (!match) {
    return { demographic: 'General', dayOfWeek: null, location: null, parsed: false }
  }

  const rawDemographic = match[1].trim()
  const rawDay = match[2].trim().toLowerCase()
  const rawLocation = match[3].trim()

  // Normalize demographic
  let demographic = rawDemographic
  for (const [pattern, label] of DEMOGRAPHIC_MAP) {
    if (pattern.test(rawDemographic)) {
      demographic = label
      break
    }
  }

  // Normalize day
  const dayOfWeek = DAY_MAP[rawDay] ?? null

  return {
    demographic,
    dayOfWeek,
    location: rawLocation,
    parsed: true,
  }
}
