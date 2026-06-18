import { describe, it, expect } from 'vitest'
import { resolveHero, HERO_FALLBACK } from '@/lib/hero'

describe('resolveHero', () => {
  it('returns all fallbacks when data is null', () => {
    const r = resolveHero(null)
    expect(r.heading).toBe(HERO_FALLBACK.heading)
    expect(r.cta1).toEqual(HERO_FALLBACK.cta1)
    expect(r.cta2).toEqual(HERO_FALLBACK.cta2)
    expect(r.videoUrl).toBe(HERO_FALLBACK.videoUrl)
    expect(r.subtext).toBeNull()
    expect(r.heroImage).toBeNull()
  })

  it('treats the empty array from an unconfigured client as no data', () => {
    expect(resolveHero([])).toEqual(resolveHero(null))
  })

  it('merges per field — Sanity value wins where present, fallback elsewhere', () => {
    const r = resolveHero({ heroHeading: 'Hi there', heroCta1Text: 'Go' })
    expect(r.heading).toBe('Hi there')
    expect(r.cta1.text).toBe('Go')
    expect(r.cta1.href).toBe(HERO_FALLBACK.cta1.href) // untouched → fallback
  })

  it('returns subtext only when non-empty (null means render the hardcoded subhead)', () => {
    expect(resolveHero({ heroSubtext: 'Custom line' }).subtext).toBe('Custom line')
    expect(resolveHero({ heroSubtext: '   ' }).subtext).toBeNull()
    expect(resolveHero({ heroSubtext: '' }).subtext).toBeNull()
  })

  it('uses the Sanity video URL when present, else the static fallback', () => {
    expect(resolveHero({ heroVideoUrl: 'https://cdn.sanity.io/x.mp4' }).videoUrl).toBe(
      'https://cdn.sanity.io/x.mp4'
    )
    expect(resolveHero(null).videoUrl).toBe('/hero-video.mp4')
  })

  it('passes through a raw image ref for server-side url building', () => {
    const img = { asset: { _ref: 'image-abc-1920x1080-jpg' } }
    expect(resolveHero({ heroImage: img }).heroImage).toEqual(img)
  })
})
