// Raw shape returned by homePageHeroQuery (every field optional).
export interface HeroImageRef {
  asset?: { _ref?: string }
  hotspot?: unknown
  crop?: unknown
}

export interface HeroData {
  heroHeading?: string | null
  heroSubtext?: string | null
  heroCta1Text?: string | null
  heroCta1Href?: string | null
  heroCta2Text?: string | null
  heroCta2Href?: string | null
  heroImage?: HeroImageRef | null
  heroVideoUrl?: string | null
}

export interface ResolvedHero {
  heading: string // may contain "\n" for a forced line break
  subtext: string | null // null → component renders the hardcoded rich subhead
  cta1: { text: string; href: string }
  cta2: { text: string; href: string }
  heroImage: HeroImageRef | null // raw ref; page.tsx turns this into a URL
  videoUrl: string // always resolves
}

// Plain, serializable props handed to the client <Hero> component.
export interface HeroProps {
  heading: string
  subtext: string | null
  cta1: { text: string; href: string }
  cta2: { text: string; href: string }
  videoUrl: string
  imageUrl: string | null
}

export const HERO_FALLBACK = {
  heading: 'Welcome to Mosaic!\nJoin us in-person or online.',
  cta1: { text: 'Plan your visit', href: '/im-new' },
  cta2: { text: 'Watch past sermons', href: '/messages' },
  videoUrl: '/hero-video.mp4',
} as const

const clean = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : null

export function safeHref(h: string): string {
  const v = h.trim()
  // site-relative (but not protocol-relative "//evil.com")
  if (v.startsWith('/') && !v.startsWith('//')) return v
  try {
    const u = new URL(v)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(u.protocol) ? v : '#'
  } catch {
    return '#'
  }
}

export function safeVideoSrc(h: string): string {
  const v = h.trim()
  if (v.startsWith('/') && !v.startsWith('//')) return v
  try {
    return new URL(v).protocol === 'https:' ? v : HERO_FALLBACK.videoUrl
  } catch {
    return HERO_FALLBACK.videoUrl
  }
}

export function resolveHero(
  data: HeroData | HeroData[] | null | undefined
): ResolvedHero {
  // sanityFetch returns [] when the client is unconfigured — treat array/null as no data.
  const d = data && !Array.isArray(data) ? data : null
  return {
    heading: clean(d?.heroHeading) ?? HERO_FALLBACK.heading,
    subtext: clean(d?.heroSubtext),
    cta1: {
      text: clean(d?.heroCta1Text) ?? HERO_FALLBACK.cta1.text,
      href: safeHref(clean(d?.heroCta1Href) ?? HERO_FALLBACK.cta1.href),
    },
    cta2: {
      text: clean(d?.heroCta2Text) ?? HERO_FALLBACK.cta2.text,
      href: safeHref(clean(d?.heroCta2Href) ?? HERO_FALLBACK.cta2.href),
    },
    heroImage: d?.heroImage ?? null,
    videoUrl: safeVideoSrc(clean(d?.heroVideoUrl) ?? HERO_FALLBACK.videoUrl),
  }
}
