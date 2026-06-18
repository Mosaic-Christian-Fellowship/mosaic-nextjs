# Design — Sanity-editable Homepage Hero

**Date:** 2026-06-17
**Status:** Approved (design); implementation plan pending
**Scope:** Make the homepage hero (text, image, video) editable through Sanity Studio, as the first end-to-end test of the CMS content pipeline before wiring the rest of the site.

## Purpose

The Sanity migration is done (church-owned project `foa4a6im`, public `production` dataset, Studio live at `/studio`), but the dataset is empty and **no page actually reads editable content from Sanity yet**. This work proves the full pipeline — schema → Studio editing → asset optimization → live render → graceful fallback — on a single, high-value surface (the homepage hero) before expanding to every other section.

Today the hero (`components/Hero.tsx`) is fully hardcoded: headline, subhead (service times + a YouTube link), two CTAs, and a background `<video>` pointing at the static `public/hero-video.mp4`.

## Goals

- Editors can change the hero **headline, subhead, both CTAs, background image, and background video** from Studio.
- Images are **auto-optimized** via Sanity's built-in CDN image pipeline (WebP/AVIF, on-the-fly resize).
- The hero **video** lives in the CMS too, uploaded **pre-optimized** through the `optimize-video` skill (Sanity stores and serves it as-is — no third-party video service like Mux).
- The live hero **never breaks** while the document is empty or half-filled — every field falls back to its current hardcoded value.

## Non-goals (deliberately deferred)

- Draft/preview mode and `SANITY_API_TOKEN` wiring (content is published, public-CDN reads only).
- Portable Text rich subhead (keeping the inline YouTube link editable) — plain text for v1.
- The other homepage sections (What to Expect, Get Involved, etc.).
- Editor-driven *in-browser* video optimization (would require Mux/Cloudinary — a new billed account, counter to the just-completed account-minimization migration).

## Architecture decision: `homePage` singleton

A new dedicated `homePage` **document** type, configured as a **singleton** in Studio (one editable doc, editors can't create duplicates). Hero fields live here now; the rest of the homepage's sections become fields on this same document as the CMS expands.

Rejected alternatives:
- **Extend `siteSettings`** — conflates global site settings with homepage content; becomes a junk drawer as homepage sections are added.
- **Reusable `heroSection` object** — premature abstraction (YAGNI) for a single homepage hero.

## Components & changes

### 1. Schema — `sanity/schemas/homePage.ts`
`type: 'document'`, `name: 'homePage'`. Registered in `sanity/schemas/index.ts`. All fields **optional** (each has a code-side fallback):

| Field | Type | Notes |
|-------|------|-------|
| `heroHeading` | `string` | current default: "Welcome to Mosaic!" |
| `heroSubtext` | `text` | plain multi-line; when empty, the existing rich service-times/YouTube subhead renders unchanged |
| `heroCta1Text` | `string` | default: "Plan your visit" |
| `heroCta1Href` | `string` | default: `/im-new` |
| `heroCta2Text` | `string` | default: "Watch past sermons" |
| `heroCta2Href` | `string` | default: `/messages` |
| `heroImage` | `image` (`options: { hotspot: true }`) | auto-optimized; doubles as video poster + reduced-motion still |
| `heroVideo` | `file` (`options: { accept: 'video/mp4' }`) | the pre-optimized loop |

### 2. Studio singleton — `sanity/sanity.config.ts`
Customize `structureTool({ structure })` so the desk shows a single **"Home Page"** entry opening the doc with fixed `_id: 'homePage'`, and filter `homePage` out of the default creatable-document list. Standard singleton pattern (~15 lines).

### 3. Image URL builder — `sanity/lib/image.ts`
New file wiring `@sanity/image-url` (already a dependency) to the existing `client`. Export `urlFor(source)`. Hero image rendered with `next/image`, `.auto('format')`.

### 4. GROQ query — `sanity/lib/queries.ts`
Add `homePageHeroQuery`:
```groq
*[_type == "homePage"][0]{
  heroHeading,
  heroSubtext,
  heroCta1Text, heroCta1Href,
  heroCta2Text, heroCta2Href,
  heroImage,
  "heroVideoUrl": heroVideo.asset->url
}
```

### 5. Page fetch — `app/(site)/page.tsx`
Already a server component. Add:
```ts
const hero = await sanityFetch<HeroData | null>(homePageHeroQuery)
// ...
<Hero data={hero} />
```
Uses the existing `sanityFetch` helper (ISR 60s). When the singleton doesn't exist, the query returns `null` and the Hero falls back entirely.

### 6. Hero component — `components/Hero.tsx`
- Stays `'use client'` (keeps the `prefers-reduced-motion` hook).
- Accepts a new optional `data?: HeroData | null` prop.
- A **pure** `resolveHero(data)` helper merges Sanity values over a `HERO_FALLBACK` constant (the current hardcoded values, extracted into one object).
- **Background priority:**
  1. `prefers-reduced-motion` **or** no video → show the image still (`urlFor(heroImage)`), or the current static fallback if no image.
  2. Otherwise → play the video loop (`heroVideoUrl ?? '/hero-video.mp4'`) with the image as `poster`.
- `heroSubtext`: if present, render as plain text; if absent, render the existing rich subhead block (service times + YouTube link) unchanged.

### 7. Types
`HeroData` interface (in `sanity/lib/queries.ts` or a co-located types file) matching the GROQ projection. `resolveHero` returns a fully-resolved, fallback-applied shape consumed by the component.

## Data flow

```
Studio editor  →  homePage doc (Sanity, production dataset)
                      │
        sanityFetch (GROQ, ISR 60s)
                      │
        app/(site)/page.tsx (server)  →  <Hero data={hero}>
                      │
        resolveHero(data) merges over HERO_FALLBACK
                      │
   text / next/image (CDN-optimized) / <video> (pre-optimized asset)
```

## Content-seeding pipeline (one-time, post-deploy)

1. Deploy schema → "Home Page" appears in Studio.
2. Editor fills text fields + uploads a hero **image**.
3. **Video:** run `public/hero-video.mp4` (or a fresh source) through the **`optimize-video`** skill → upload the optimized MP4 to `heroVideo`. (A later convenience: a one-command "optimize + `client.assets.upload`" script.)
4. Verify live: text edits, image optimization (WebP served), video playback, and that clearing a field restores its fallback.

## Error handling & fallbacks

- `projectId` missing → existing safe-null client; `sanityFetch` returns `null`; hero renders 100% hardcoded fallback. No crash.
- Singleton absent or any field empty → per-field fallback via `resolveHero`.
- Video asset missing → `'/hero-video.mp4'`.
- Image absent under reduced motion → current static background.

## Testing

- Extract `resolveHero()` as a pure function; unit-test with Vitest (alongside the existing 205 tests):
  - `null` data → all fallbacks.
  - Partial data → per-field merge (Sanity value wins where present, fallback elsewhere).
  - Video present / absent and image present / absent → correct background-source selection.
- Manual: Studio edit → live verification per the seeding pipeline.

## Open questions

None blocking. Confirmed during design: plain-text subtext for v1; `heroImage` optional (static fallback covers the reduced-motion still).
