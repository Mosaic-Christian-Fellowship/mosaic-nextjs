# Sanity Homepage Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero (heading, subhead, two CTAs, background image, background video) editable through Sanity Studio, with graceful fallback to the current hardcoded values.

**Architecture:** A new `homePage` singleton document holds the hero fields. The homepage server component fetches it via GROQ, runs a pure `resolveHero()` that merges Sanity values over hardcoded fallbacks, computes the optimized image URL server-side, and passes plain string props to the (still client) `Hero` component. Every field is optional — empty fields render today's hardcoded hero, so the live site never breaks while content is seeded.

**Tech Stack:** Next.js 16 (App Router, async server components), React 19, Sanity v5 / next-sanity (`sanityFetch`, public CDN read), `@sanity/image-url`, Vitest.

**Spec:** `docs/superpowers/specs/2026-06-17-sanity-homepage-hero-design.md`

**Worktree:** Execute on a feature branch (e.g. `feat/sanity-homepage-hero`) created via `superpowers:using-git-worktrees`. `main` is branch-protected (PR + 1 approval).

**Package manager:** `bun`. Run tests with `bun run test` (alias for `vitest run`).

---

## File Structure

| File | Responsibility | Action |
|------|---------------|--------|
| `lib/hero.ts` | Types, `HERO_FALLBACK`, pure `resolveHero()` | Create |
| `tests/lib/hero.test.ts` | Unit tests for `resolveHero()` | Create |
| `sanity/lib/image.ts` | `urlFor()` image-URL builder | Create |
| `sanity/lib/queries.ts` | Add `homePageHeroQuery` | Modify |
| `sanity/schemas/homePage.ts` | `homePage` singleton schema | Create |
| `sanity/schemas/index.ts` | Register `homePage` | Modify |
| `sanity/sanity.config.ts` | Singleton desk structure + actions | Modify |
| `components/Hero.tsx` | Presentational hero, plain props + fallbacks | Modify |
| `app/(site)/page.tsx` | Fetch, resolve, compute image URL, pass props | Modify |

---

## Task 1: Pure hero-data resolver (`lib/hero.ts`)

The testable core. No React, no Sanity client — just types and a merge function. Must treat the `[]` that `sanityFetch` returns when unconfigured as "no data."

**Files:**
- Create: `lib/hero.ts`
- Test: `tests/lib/hero.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/hero.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- hero`
Expected: FAIL — `Cannot find module '@/lib/hero'`.

- [ ] **Step 3: Write the implementation**

Create `lib/hero.ts`:

```ts
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
      href: clean(d?.heroCta1Href) ?? HERO_FALLBACK.cta1.href,
    },
    cta2: {
      text: clean(d?.heroCta2Text) ?? HERO_FALLBACK.cta2.text,
      href: clean(d?.heroCta2Href) ?? HERO_FALLBACK.cta2.href,
    },
    heroImage: d?.heroImage ?? null,
    videoUrl: clean(d?.heroVideoUrl) ?? HERO_FALLBACK.videoUrl,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test -- hero`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/hero.ts tests/lib/hero.test.ts
git commit -m "feat(hero): pure resolveHero with hardcoded fallbacks"
```

---

## Task 2: Image URL builder (`sanity/lib/image.ts`)

Thin wrapper over `@sanity/image-url`. Returns `null` when the client is unconfigured so callers degrade gracefully. (No unit test — it's config glue verified by typecheck + the build.)

**Files:**
- Create: `sanity/lib/image.ts`

- [ ] **Step 1: Write the implementation**

Create `sanity/lib/image.ts`:

```ts
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '../sanity.client'

const builder = client ? imageUrlBuilder(client) : null

/** Returns an image-url builder for chaining (.width().auto('format').url()), or null if Sanity isn't configured. */
export function urlFor(source: SanityImageSource) {
  return builder ? builder.image(source) : null
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors referencing `sanity/lib/image.ts`.

- [ ] **Step 3: Commit**

```bash
git add sanity/lib/image.ts
git commit -m "feat(sanity): add urlFor image builder"
```

---

## Task 3: GROQ query (`sanity/lib/queries.ts`)

**Files:**
- Modify: `sanity/lib/queries.ts`

- [ ] **Step 1: Add the query**

Append to `sanity/lib/queries.ts` (the file already imports `groq` from `next-sanity`):

```ts
export const homePageHeroQuery = groq`*[_type == "homePage"][0]{
  heroHeading,
  heroSubtext,
  heroCta1Text,
  heroCta1Href,
  heroCta2Text,
  heroCta2Href,
  heroImage,
  "heroVideoUrl": heroVideo.asset->url
}`
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add sanity/lib/queries.ts
git commit -m "feat(sanity): add homePageHeroQuery"
```

---

## Task 4: `homePage` schema (`sanity/schemas/homePage.ts` + register)

**Files:**
- Create: `sanity/schemas/homePage.ts`
- Modify: `sanity/schemas/index.ts`

- [ ] **Step 1: Create the schema**

Create `sanity/schemas/homePage.ts` (follows the existing `landingPage.ts` pattern):

```ts
import { defineType, defineField } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'text',
      rows: 2,
      description: 'Line breaks are preserved (the default shows two lines).',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext',
      type: 'text',
      rows: 3,
      description: 'Leave empty to keep the default service-times line with the YouTube link.',
    }),
    defineField({ name: 'heroCta1Text', title: 'Primary Button Text', type: 'string' }),
    defineField({ name: 'heroCta1Href', title: 'Primary Button Link', type: 'string' }),
    defineField({ name: 'heroCta2Text', title: 'Secondary Button Text', type: 'string' }),
    defineField({ name: 'heroCta2Href', title: 'Secondary Button Link', type: 'string' }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Used as the video poster and the still shown to reduced-motion visitors.',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      options: { accept: 'video/mp4' },
      description: 'Upload an MP4 already optimized via the optimize-video skill.',
    }),
  ],
  preview: {
    select: { title: 'heroHeading', media: 'heroImage' },
    prepare: ({ title, media }) => ({ title: title || 'Home Page', media }),
  },
})
```

- [ ] **Step 2: Register it**

Modify `sanity/schemas/index.ts` — add the import and array entry:

```ts
import { siteSettings } from './siteSettings'
import { staffMember } from './staffMember'
import { faqItem } from './faqItem'
import { ministry } from './ministry'
import { serviceTime } from './serviceTime'
import { landingPage } from './landingPage'
import { homePage } from './homePage'

export const schemaTypes = [
  siteSettings,
  staffMember,
  faqItem,
  ministry,
  serviceTime,
  landingPage,
  homePage,
]
```

- [ ] **Step 3: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemas/homePage.ts sanity/schemas/index.ts
git commit -m "feat(sanity): add homePage document schema"
```

---

## Task 5: Singleton desk structure (`sanity/sanity.config.ts`)

Make `homePage` a singleton: one "Home Page" entry, no duplicate creation, no delete.

**Files:**
- Modify: `sanity/sanity.config.ts`

- [ ] **Step 1: Replace the config**

Replace the full contents of `sanity/sanity.config.ts` with:

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { projectId, dataset } from './env'

const SINGLETONS = ['homePage']

export default defineConfig({
  name: 'mosaic-studio',
  title: 'Mosaic Church',
  projectId: projectId || 'placeholder',
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETONS.includes(item.getId() as string)
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Singletons can't be created or deleted — only edited.
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action)
          )
        : input,
  },
})
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add sanity/sanity.config.ts
git commit -m "feat(sanity): make homePage a Studio singleton"
```

---

## Task 6: Wire the page + presentational Hero

Resolve everything server-side; `Hero` becomes a pure presentational client component taking plain props.

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `app/(site)/page.tsx`

- [ ] **Step 1: Rewrite `Hero.tsx` to take props**

Replace the full contents of `components/Hero.tsx` with:

```tsx
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { HeroProps } from '@/lib/hero'

/** Render a heading string, converting "\n" into <br /> for forced line breaks. */
function renderHeading(heading: string): ReactNode {
  return heading.split('\n').flatMap((line, i) =>
    i === 0 ? [line] : [<br key={i} />, line]
  )
}

export default function Hero({
  heading,
  subtext,
  cta1,
  cta2,
  videoUrl,
  imageUrl,
}: HeroProps) {
  // Respect reduced-motion: hold the video on a static frame instead of looping.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section
      data-hero
      className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden"
    >
      <video
        autoPlay={!reduceMotion}
        muted
        loop={!reduceMotion}
        playsInline
        poster={imageUrl ?? undefined}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '70% 40%' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-2xl flex flex-col gap-6">
          <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.1] text-white text-balance">
            {renderHeading(heading)}
          </h1>

          {subtext ? (
            <p className="text-[15px] md:text-base font-normal leading-[1.6] text-white/85 max-w-xl whitespace-pre-line">
              {subtext}
            </p>
          ) : (
            <p className="text-[15px] md:text-base font-normal leading-[1.6] text-white/85 max-w-xl">
              Visit Mosaic Christian Fellowship for service, every Sunday at 9:30am and 11:30am.
              Join our livestream and view past recordings on{' '}
              <a
                href="https://www.youtube.com/channel/UCgI1-OGVDlM5cXy0xhllT_w"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
              >
                YouTube
              </a>
              .
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={cta1.href}
              className="inline-flex items-center h-[50px] px-8 bg-[#0066FF] text-white text-[15px] font-semibold rounded-[10px] hover:brightness-110 transition-[filter]"
            >
              {cta1.text}
            </Link>
            <Link
              href={cta2.href}
              className="inline-flex items-center h-[50px] px-8 bg-white/10 backdrop-blur-sm text-white text-[15px] font-semibold rounded-[10px] border border-white/20 hover:bg-white/20 transition-colors"
            >
              {cta2.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

Notes: `text-balance` on the `<h1>` satisfies the global no-widows rule; `whitespace-pre-line` lets an editor's multi-line subtext keep its breaks.

- [ ] **Step 2: Wire `page.tsx` to fetch + resolve + build image URL**

Replace the full contents of `app/(site)/page.tsx` with:

```tsx
import Hero from '@/components/Hero'
import PlanVisitSection from '@/components/PlanVisitSection'
import CommunityEvents from '@/components/CommunityEvents'
import FullWidthBanner from '@/components/FullWidthBanner'
import StageOfLife from '@/components/StageOfLife'
import FeaturedSermonSection from '@/components/FeaturedSermonSection'
import ExtendedCut from '@/components/ExtendedCut'
import MeetYou from '@/components/MeetYou'
import { sanityFetch } from '@/sanity/sanity.client'
import { homePageHeroQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { resolveHero, type HeroData } from '@/lib/hero'

export const revalidate = 600

export default async function Home() {
  const hero = await sanityFetch<HeroData>(homePageHeroQuery)
  const r = resolveHero(hero)
  const imageUrl = r.heroImage
    ? urlFor(r.heroImage)?.width(1920).height(1080).auto('format').url() ?? null
    : null

  return (
    <>
      <Hero
        heading={r.heading}
        subtext={r.subtext}
        cta1={r.cta1}
        cta2={r.cta2}
        videoUrl={r.videoUrl}
        imageUrl={imageUrl}
      />
      <PlanVisitSection />
      <CommunityEvents />
      <FullWidthBanner />
      <StageOfLife />
      <FeaturedSermonSection />
      <ExtendedCut />
      <MeetYou />
    </>
  )
}
```

- [ ] **Step 3: Typecheck + tests**

Run: `bunx tsc --noEmit && bun run test -- hero`
Expected: no type errors; hero tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx "app/(site)/page.tsx"
git commit -m "feat(hero): drive homepage hero from Sanity with fallbacks"
```

---

## Task 7: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `bun run test`
Expected: all tests pass (the existing ~205 + the new hero tests). No regressions.

- [ ] **Step 2: Production build**

Run: `bun run build`
Expected: build succeeds; `/` and `/studio` compile with no type or lint errors.

- [ ] **Step 3: Local smoke test**

Run: `bun run dev`, open `http://localhost:3000`.
Expected: the hero looks **identical to today** (dataset is empty → full fallback): two-line heading, service-times subhead with YouTube link, both CTAs, looping `/hero-video.mp4`.
Open `http://localhost:3000/studio` → confirm a single **"Home Page"** entry appears and opens the editor with the eight hero fields; confirm you cannot create a second Home Page document.

- [ ] **Step 4: Commit any fixes, then open the PR**

```bash
git push -u origin feat/sanity-homepage-hero
gh pr create --fill --title "feat: Sanity-editable homepage hero" \
  --body "Implements docs/superpowers/specs/2026-06-17-sanity-homepage-hero-design.md. Hero is now CMS-driven with full fallback to current hardcoded values (verified identical while dataset is empty)."
```

---

## Task 8: Seed content + verify live (operational — after PR merge & deploy)

**Files:** none (Studio + skill operations)

- [ ] **Step 1:** In production `/studio`, open **Home Page**. Fill `heroHeading`, optionally `heroSubtext`, and the four CTA fields. Upload a `heroImage`. **Publish.**
- [ ] **Step 2:** Optimize the hero video: run the `optimize-video` skill on `public/hero-video.mp4` (or a fresh source) → produces a web-optimized MP4 (+ WebP poster).
- [ ] **Step 3:** Upload the optimized MP4 to the **Hero Background Video** field. **Publish.**
- [ ] **Step 4:** Verify on the live site (wait out the 60s ISR or redeploy): edited text appears; the image is served as WebP/AVIF (DevTools → Network → the `cdn.sanity.io` image request shows `format=...`); the new video plays; reduced-motion shows the image still.
- [ ] **Step 5:** Regression check — clear a single field in Studio, publish, confirm that field falls back to its hardcoded default without breaking the page.

---

## Self-Review

**Spec coverage:**
- Schema `homePage` singleton + all 8 fields → Tasks 4, 5. ✅
- Image pipeline (`urlFor`, `@sanity/image-url`, next-format) → Task 2 + Task 6 Step 2. ✅
- GROQ query resolving video URL → Task 3. ✅
- Page fetch + server component → Task 6 Step 2. ✅
- `resolveHero` over `HERO_FALLBACK`, array-from-unconfigured-client guard → Task 1. ✅
- Background priority (reduced-motion/poster, video fallback) → Task 6 Step 1. ✅
- Subtext plain-text-or-hardcoded-rich-block → Task 6 Step 1 (conditional). ✅
- Fallbacks never break the live site → Task 1 + Task 7 Step 3. ✅
- Testing (null/partial/video/image cases) → Task 1. ✅
- Content seeding incl. optimize-video → Task 8. ✅

**Placeholder scan:** No TBD/TODO; every code step shows complete code; no "add error handling" hand-waves. ✅

**Type consistency:** `HeroData`, `ResolvedHero`, `HeroProps`, `HERO_FALLBACK`, `resolveHero`, `urlFor`, `homePageHeroQuery`, `homePage` — names used identically across Tasks 1–6. `Hero` props in Task 6 Step 1 match the `HeroProps` interface from Task 1 and the call site in Task 6 Step 2. ✅
