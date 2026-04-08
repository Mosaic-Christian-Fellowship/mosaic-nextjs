import { describe, it, expect } from 'vitest'
import { parseSermonTitle, parseGroupName } from '@/lib/parsers'

describe('parseSermonTitle', () => {
  it('parses "Mosaic Christian Fellowship: "Title" by Pastor Name"', () => {
    const result = parseSermonTitle('Mosaic Christian Fellowship: "Thriving by Making Disciples" by Pastor Andre Choi')
    expect(result.title).toBe('Thriving by Making Disciples')
    expect(result.speaker).toBe('Pastor Andre Choi')
  })

  it('parses "Mosaic Christian Fellowship Live: "Title" Pastor Name"', () => {
    const result = parseSermonTitle('Mosaic Christian Fellowship Live: "Anchoring: The Love of God"  Pastor Dave Park')
    expect(result.title).toBe('Anchoring: The Love of God')
    expect(result.speaker).toBe('Pastor Dave Park')
  })

  it('parses quoted title by Pastor Name (no prefix)', () => {
    const result = parseSermonTitle('"Our God of Promise" by Pastor Dave Park')
    expect(result.title).toBe('Our God of Promise')
    expect(result.speaker).toBe('Pastor Dave Park')
  })

  it('parses "MM/DD/YYYY Series: Title"', () => {
    const result = parseSermonTitle('02/22/2026 Genesis: When Promise Feels Uncertain')
    expect(result.title).toBe('When Promise Feels Uncertain')
    expect(result.speaker).toBeNull()
    expect(result.seriesHint).toBe('Genesis')
  })

  it('parses "Month Day - Title"', () => {
    const result = parseSermonTitle('Sep 22 - Groaning for Glory (AUDIO FIXED)')
    expect(result.title).toBe('Groaning for Glory')
    expect(result.speaker).toBeNull()
  })

  it('returns raw title when no pattern matches', () => {
    const result = parseSermonTitle('Some Random Video Title')
    expect(result.title).toBe('Some Random Video Title')
    expect(result.speaker).toBeNull()
    expect(result.parsed).toBe(false)
  })

  it('handles "Title" by Pastor Name with Mosaic prefix and pipe', () => {
    const result = parseSermonTitle('Mosaic Christian Fellowship Live | "True Blessing in the New Year" by Pastor Gene Joo')
    expect(result.title).toBe('True Blessing in the New Year')
    expect(result.speaker).toBe('Pastor Gene Joo')
  })
})

describe('parseGroupName', () => {
  it('parses "Demographic FG # (Day @ Location)"', () => {
    const result = parseGroupName('YA Co-Ed FG 1 (Tuesdays @ Dumont)')
    expect(result.demographic).toBe('YA Co-Ed')
    expect(result.dayOfWeek).toBe('Tuesday')
    expect(result.location).toBe('Dumont')
    expect(result.parsed).toBe(true)
  })

  it('parses "50+ FG (Fridays @ Northvale)"', () => {
    const result = parseGroupName('50+ FG (Fridays @ Northvale)')
    expect(result.demographic).toBe('50+')
    expect(result.dayOfWeek).toBe('Friday')
    expect(result.location).toBe('Northvale')
  })

  it('parses "Mom\'s with Minis Kids FG (Thursdays @ Old Tappan/Englewood Cliffs)"', () => {
    const result = parseGroupName("Mom's with Minis Kids FG (Thursdays @ Old Tappan/Englewood Cliffs)")
    expect(result.demographic).toBe('Moms')
    expect(result.dayOfWeek).toBe('Thursday')
    expect(result.location).toBe('Old Tappan/Englewood Cliffs')
  })

  it('parses multi-word location with ampersand', () => {
    const result = parseGroupName("YA Men's FG 1 (Wednesdays & Fort Lee)")
    expect(result.demographic).toBe("YA Men's")
    expect(result.dayOfWeek).toBe('Wednesday')
    expect(result.location).toBe('Fort Lee')
  })

  it('returns fallback for non-FG groups', () => {
    const result = parseGroupName('Welcoming Team')
    expect(result.demographic).toBe('General')
    expect(result.dayOfWeek).toBeNull()
    expect(result.location).toBeNull()
    expect(result.parsed).toBe(false)
  })
})
