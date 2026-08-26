# Messages Hub & Video Categories (PR 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/messages` into a hub with four child pages, and add the pipeline concept that lets a YouTube playlist be routed to its own collection instead of only kept or discarded — which is what makes a testimonies page possible.

**Architecture:** A fourth `PlaylistKind` (`'category'`) carries a `slug`. `syncSermons` removes those videos from the sermon set the way `'excluded'` does, but collects them into `categories[slug]` instead of dropping them. The cron writes one Redis key per category (`videos:testimonies`), and `/api/videos/[slug]` serves it. The four pages are thin: testimonies renders a shared `VideoGrid`, podcasts and sermons are lifts of content that already exists on `/messages`, and the hub is a static four-card layout.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, ioredis, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-26-messages-hub-and-collections-design.md`

## Global Constraints

- TypeScript only. Functional components with hooks. 2-space indent.
- Tailwind arbitrary values must use explicit hex (`bg-[#1E2024]`), never CSS custom properties — `bg-[--color-x]` does not resolve in Tailwind v4.
- Mobile-first `min-width` queries only. `clamp()` for type/spacing. Container queries for components that could sit in more than one parent.
- 44px minimum tap targets. `text-wrap: balance` on headings.
- Sermons must stay unchanged in behaviour this PR — they only move URL.
- The duration floor (`MIN_SERMON_DURATION_SECONDS`) must NOT apply to category playlists. Testimonies are often short and the playlist is staff-curated; membership is the filter.
- Run `bun run test`, `bun run build`, and `bun run lint` before each commit. Lint has 20 pre-existing errors; the count must not increase.

---

### Task 1: The `category` playlist kind

**Files:**
- Modify: `lib/sync/sermons.ts`
- Modify: `lib/sync/config.ts`
- Test: `tests/lib/sync/sermons.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `PlaylistKind` gains `'category'`; `PlaylistConfig` gains `slug?: string`; `SyncSermonsResult` gains `categories: Record<string, SermonData[]>`.

- [ ] **Step 1: Write the failing tests**

Add to `tests/lib/sync/sermons.test.ts`, inside the top-level `describe('syncSermons', ...)`:

```ts
  describe('category playlists', () => {
    const withTestimonies = () => {
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') {
          return [
            { videoId: 't1', title: 'My Story — Grace', publishedAt: '2026-05-01T00:00:00Z', position: 0 },
            { videoId: 't2', title: 'My Story — Sam', publishedAt: '2026-04-01T00:00:00Z', position: 1 },
          ]
        }
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
        { id: 't1', title: 'My Story — Grace', description: 'd1', thumbnail: 't1.jpg', durationSeconds: 240 },
        { id: 't2', title: 'My Story — Sam', description: 'd2', thumbnail: 't2.jpg', durationSeconds: 90 },
      ])
    }

    const CATEGORY_PLAYLISTS: PlaylistConfig[] = [
      { id: 'PLmaster', name: 'Sunday Service', kind: 'master' },
      { id: 'PLtestimony', name: 'Testimonies', kind: 'category', slug: 'testimonies' },
    ]

    it('collects category videos into their own bucket', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(Object.keys(result.categories)).toEqual(['testimonies'])
      expect(result.categories.testimonies.map((v) => v.id)).toEqual(['t1', 't2'])
    })

    it('keeps category videos out of the sermon archive', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['sermon'])
    })

    it('does not apply the duration floor to category videos', async () => {
      // t2 is 90s. In the sermon archive that is a promo; in a staff-curated
      // testimonies playlist it is a short testimony and must survive.
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.categories.testimonies.map((v) => v.id)).toContain('t2')
    })

    it('sorts category videos newest first', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.categories.testimonies.map((v) => v.date)).toEqual(['2026-05-01', '2026-04-01'])
    })

    it('throws when a category playlist has no slug', async () => {
      withTestimonies()

      await expect(
        syncSermons([
          { id: 'PLmaster', name: 'Sunday Service', kind: 'master' },
          { id: 'PLtestimony', name: 'Testimonies', kind: 'category' },
        ])
      ).rejects.toThrow(/slug/i)
    })

    it('returns an empty categories object when none are configured', async () => {
      withTestimonies()

      const result = await syncSermons([{ id: 'PLmaster', name: 'Sunday Service', kind: 'master' }])

      expect(result.categories).toEqual({})
    })

    it('keeps syncing sermons when a category playlist fails to load', async () => {
      // A deleted or privated playlist 404s. That must never take the sermon
      // archive down with it — a deleted playlist is exactly how the archive
      // silently stopped updating for months.
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') throw new Error('YouTube API error: 404')
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
      ])

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['sermon'])
      // No bucket for the failed slug, so the cron writes no key for it and the
      // last good collection keeps serving.
      expect(result.categories.testimonies).toBeUndefined()
    })
  })
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bun run test tests/lib/sync/sermons.test.ts`
Expected: FAIL — `result.categories` is undefined, and the no-slug case does not throw.

- [ ] **Step 3: Widen the types**

In `lib/sync/sermons.ts`, replace the `PlaylistKind` line and `PlaylistConfig`:

```ts
export type PlaylistKind = 'master' | 'series' | 'excluded' | 'category'

export interface PlaylistConfig {
  id: string
  name: string
  kind: PlaylistKind
  /**
   * Required when kind is 'category'. Used as the Redis key suffix
   * (`videos:<slug>`) and the URL segment (`/messages/<slug>`).
   */
  slug?: string
}
```

Extend the result type:

```ts
export interface SyncSermonsResult {
  sermons: SermonData[]
  series: SeriesData[]
  /** Videos routed out of the sermon archive into their own collection, keyed by slug. */
  categories: Record<string, SermonData[]>
}
```

- [ ] **Step 4: Extract the record builder**

`syncSermons` builds a `SermonData` inline. Category videos need the same shape, so lift it to a module-level helper in `lib/sync/sermons.ts` (place it above `syncSermons`):

```ts
function toSermonData(
  item: PlaylistItem,
  detail: VideoDetail,
  series: { id: string; name: string } | null
): SermonData {
  const parsed = parseSermonTitle(detail.title)
  return {
    id: item.videoId,
    title: parsed.title,
    speaker: parsed.speaker ?? UNATTRIBUTED_SPEAKER,
    seriesId: series?.id ?? null,
    seriesName: series?.name ?? null,
    date: item.publishedAt.split('T')[0],
    duration: detail.durationSeconds,
    thumbnail: detail.thumbnail,
    youtubeId: item.videoId,
    spotifyUrl: null, // Matched in a separate step
    applePodcastUrl: null,
    description: detail.description,
  }
}
```

Add `VideoDetail` to the existing youtube import:

```ts
import { fetchPlaylistItems, fetchVideoDetails, type PlaylistItem, type VideoDetail } from '../youtube'
```

Replace the body of the existing sermon `.map(...)` so it calls the helper:

```ts
  const sermons: SermonData[] = fullLengthItems.map((item) =>
    toSermonData(item, detailMap.get(item.videoId)!, videoToSeries.get(item.videoId) ?? null)
  )
```

- [ ] **Step 5: Collect category members**

In `syncSermons`, after the `excludedPlaylists` declaration, add:

```ts
  const categoryPlaylists = playlists.filter((p) => p.kind === 'category')
  for (const cp of categoryPlaylists) {
    if (!cp.slug) {
      throw new Error(`Playlist "${cp.name}" has kind 'category' but no slug`)
    }
  }
```

Immediately after the excluded-playlist removal block (the one that logs `dropped ... items present in excluded playlists`), add:

```ts
  // Category playlists leave the sermon archive exactly like an excluded one, but
  // their members are kept so they can be served on their own page. This is why
  // 'excluded' and 'category' are separate kinds: one discards, one redirects.
  const categoryItems = new Map<string, PlaylistItem[]>()
  for (const cp of categoryPlaylists) {
    try {
      const items = await fetchPlaylistItems(cp.id)
      categoryItems.set(cp.slug!, items)
      for (const item of items) {
        allItemsMap.delete(item.videoId)
        videoToSeries.delete(item.videoId)
      }
    } catch (err) {
      // A deleted or privated playlist 404s. Letting that throw would take the
      // whole sermon sync down — which is precisely how the archive silently
      // stopped updating for months. Skip the slug instead: the cron then
      // writes no key for it, so the last good collection keeps serving.
      console.error(
        `syncSermons: category "${cp.name}" (${cp.slug}) failed to load:`,
        err instanceof Error ? err.message : err
      )
    }
  }
```

- [ ] **Step 6: Fetch details for category videos too**

Category ids are no longer in `allItemsMap`, so they would miss the details call. Replace the `videoIds` line:

```ts
  const allItems = Array.from(allItemsMap.values())
  const categoryVideoIds = Array.from(categoryItems.values())
    .flat()
    .map((i) => i.videoId)
  const videoIds = Array.from(new Set([...allItems.map((i) => i.videoId), ...categoryVideoIds]))
```

- [ ] **Step 7: Build the category buckets**

Immediately before the `return { sermons, series }` statement, add:

```ts
  // No duration floor here. The floor keeps promos out of the SERMON archive;
  // a testimony is often short, and the playlist is curated by staff, so
  // membership is the filter. Applying the floor would silently drop content.
  const categories: Record<string, SermonData[]> = {}
  for (const [slug, items] of categoryItems) {
    categories[slug] = items
      .filter((item) => detailMap.has(item.videoId))
      .map((item) => toSermonData(item, detailMap.get(item.videoId)!, null))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
```

Change the return to:

```ts
  return { sermons, series, categories }
```

- [ ] **Step 8: Fix the two early returns**

`syncSermons` returns early twice — when there is no master playlist and when `allItemsMap` is empty. Both must satisfy the widened type. Change both:

```ts
  if (!masterPlaylist) return { sermons: [], series: [], categories: {} }
```

```ts
  if (allItemsMap.size === 0) return { sermons: [], series: [], categories: {} }
```

- [ ] **Step 9: Point the config at the Testimonies playlist**

In `lib/sync/config.ts`, replace the Testimonies line:

```ts
  { id: 'PLcVnilxMSYGJ9aPoAOxqP6VE1RtAPQnOw', name: 'Testimonies', kind: 'category', slug: 'testimonies' },
```

Update the `kind:` comment block at the top of the file to document the fourth kind:

```ts
//   'category' — routed out of the sermon archive into its own collection and
//                page, keyed by `slug`. Unlike 'excluded' the videos are kept.
```

- [ ] **Step 10: Run the tests to verify they pass**

Run: `bun run test`
Expected: PASS. The pre-existing suite must stay green — in particular the `'excluded'` tests, which prove discarding still discards.

- [ ] **Step 11: Verify the tests can fail**

Temporarily change the category filter in Step 7 to `.filter(() => false)` and re-run `bun run test tests/lib/sync/sermons.test.ts`. Expected: the category tests fail. Restore the line.

- [ ] **Step 12: Commit**

```bash
git add lib/sync/sermons.ts lib/sync/config.ts tests/lib/sync/sermons.test.ts
git commit -m "feat: route a playlist to its own collection with kind 'category'"
```

---

### Task 2: Write category buckets to the cache

**Files:**
- Modify: `app/api/cron/sync/route.ts`
- Modify: `app/api/admin/sync-sermons/route.ts`
- Test: `tests/api/cron-sync.test.ts`

**Interfaces:**
- Consumes: `syncSermons` returning `{ sermons, series, categories }` from Task 1.
- Produces: Redis key `videos:<slug>` holding `SermonData[]`; a `results['videos:<slug>']` entry in the cron response.

- [ ] **Step 1: Write the failing test**

Add to `tests/api/cron-sync.test.ts`, inside `describe('GET /api/cron/sync', ...)`:

```ts
  it('writes each category to its own cache key', async () => {
    mockedSermons.syncSermons.mockResolvedValue({
      sermons: [],
      series: [],
      categories: { testimonies: [{ id: 't1' }] as never },
    })

    const res = await GET(request())
    const body = await res.json()

    expect(mockedKv.kvSet).toHaveBeenCalledWith('videos:testimonies', [{ id: 't1' }])
    expect(body.results['videos:testimonies']).toEqual({ success: true, count: 1 })
  })

  it('does not fail the run when there are no categories', async () => {
    mockedSermons.syncSermons.mockResolvedValue({ sermons: [], series: [], categories: {} })

    const res = await GET(request())

    expect(res.status).toBe(200)
  })
```

Update the existing `beforeEach` mock so it matches the widened type:

```ts
  mockedSermons.syncSermons.mockResolvedValue({ sermons: [], series: [], categories: {} })
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test tests/api/cron-sync.test.ts`
Expected: FAIL — `kvSet` was never called with `videos:testimonies`.

- [ ] **Step 3: Write the category buckets in the cron**

In `app/api/cron/sync/route.ts`, change the destructure inside the sermon `try` block:

```ts
    const { sermons, series, categories } = await syncSermons(PLAYLISTS)
```

After the existing `kvSet('series:all', series)` line and before `kvSetSyncStatus('sermons', ...)`, add:

```ts
      // One key per category so a page can load only what it needs, and so a
      // failure in one collection cannot take the others down with it.
      for (const [slug, videos] of Object.entries(categories)) {
        await kvSet(`videos:${slug}`, videos)
        await kvSetSyncStatus(`videos:${slug}`, true, { itemCount: videos.length })
        results[`videos:${slug}`] = { success: true, count: videos.length }
      }
```

- [ ] **Step 4: Mirror it in the manual sync route**

`app/api/admin/sync-sermons/route.ts` duplicates the sermon write. Apply the same destructure and the same loop there, so a manual sync and the cron cannot drift apart.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun run test`
Expected: PASS, 100% of the existing suite included.

- [ ] **Step 6: Commit**

```bash
git add app/api/cron/sync/route.ts app/api/admin/sync-sermons/route.ts tests/api/cron-sync.test.ts
git commit -m "feat: write each video category to its own cache key"
```

---

### Task 3: Serve a category at `/api/videos/[slug]`

**Files:**
- Create: `app/api/videos/[slug]/route.ts`
- Test: `tests/api/videos-slug.test.ts`

**Interfaces:**
- Consumes: `videos:<slug>` written by Task 2.
- Produces: `GET /api/videos/[slug]` returning `{ data: SermonData[], meta: { total: number } }`.

- [ ] **Step 1: Write the failing test**

Create `tests/api/videos-slug.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/videos/[slug]/route'
import * as kv from '@/lib/kv'

vi.mock('@/lib/kv')
const mockedKv = vi.mocked(kv)

beforeEach(() => vi.clearAllMocks())

const ctx = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe('GET /api/videos/[slug]', () => {
  it('returns the cached videos for a slug', async () => {
    mockedKv.kvGet.mockResolvedValue([{ id: 't1' }, { id: 't2' }] as never)

    const res = await GET(new Request('https://example.com'), ctx('testimonies'))
    const body = await res.json()

    expect(mockedKv.kvGet).toHaveBeenCalledWith('videos:testimonies')
    expect(body.data).toHaveLength(2)
    expect(body.meta.total).toBe(2)
  })

  it('returns an empty list rather than 500 when the key is missing', async () => {
    // A collection can be empty because the sync has not run yet. An empty page
    // is a far better outcome than an error page.
    mockedKv.kvGet.mockResolvedValue(null as never)

    const res = await GET(new Request('https://example.com'), ctx('testimonies'))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data).toEqual([])
    expect(body.meta.total).toBe(0)
  })

  it('rejects a slug that is not a plain identifier', async () => {
    // The slug becomes a Redis key, so it must never carry separators.
    const res = await GET(new Request('https://example.com'), ctx('../sermons:all'))

    expect(res.status).toBe(400)
    expect(mockedKv.kvGet).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test tests/api/videos-slug.test.ts`
Expected: FAIL — module `@/app/api/videos/[slug]/route` does not exist.

- [ ] **Step 3: Write the route**

Create `app/api/videos/[slug]/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

interface VideoRecord {
  id: string
  [key: string]: unknown
}

// The slug is interpolated into a Redis key, so it is constrained to a plain
// identifier. Without this, a crafted slug could read another key entirely.
const SLUG_RE = /^[a-z0-9-]+$/

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  try {
    const videos = (await kvGet<VideoRecord[]>(`videos:${slug}`)) ?? []
    return NextResponse.json({ data: videos, meta: { total: videos.length } })
  } catch (err) {
    console.error(`Failed to load videos:${slug}:`, err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to load collection' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `bun run test tests/api/videos-slug.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/videos tests/api/videos-slug.test.ts
git commit -m "feat: serve a video collection at /api/videos/[slug]"
```

---

### Task 4: `VideoGrid` and the testimonies page

**Files:**
- Create: `components/VideoGrid.tsx`
- Create: `app/(site)/messages/testimonies/page.tsx`
- Test: `tests/components/video-grid.test.tsx`

**Interfaces:**
- Consumes: `/api/videos/[slug]` from Task 3; `SermonData` from `@/lib/api`; `speakerLabel` from `@/lib/parsers`.
- Produces: `<VideoGrid videos={SermonData[]} emptyMessage={string} />` — a presentational grid reused by testimonies now and by sermons in PR 2.

- [ ] **Step 1: Write the failing test**

Create `tests/components/video-grid.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import VideoGrid from '@/components/VideoGrid'
import type { SermonData } from '@/lib/api'

const video = (over: Partial<SermonData> = {}): SermonData => ({
  id: 'v1',
  title: 'My Story',
  speaker: 'Pastor Dave Park',
  seriesId: null,
  seriesName: null,
  date: '2026-05-01',
  duration: 240,
  thumbnail: 'thumb.jpg',
  youtubeId: 'abc123',
  spotifyUrl: null,
  applePodcastUrl: null,
  description: '',
  ...over,
})

describe('VideoGrid', () => {
  it('links each card to YouTube', () => {
    const html = renderToStaticMarkup(<VideoGrid videos={[video()]} emptyMessage="None yet." />)

    expect(html).toContain('https://www.youtube.com/watch?v=abc123')
    expect(html).toContain('My Story')
  })

  it('omits the speaker when it is unattributed', () => {
    // 'Undefined' is the stored sentinel and is truthy, so a plain truthy check
    // would print it to visitors.
    const html = renderToStaticMarkup(
      <VideoGrid videos={[video({ speaker: 'Undefined' })]} emptyMessage="None yet." />
    )

    expect(html).not.toContain('Undefined')
  })

  it('shows the empty message when there are no videos', () => {
    const html = renderToStaticMarkup(<VideoGrid videos={[]} emptyMessage="No testimonies yet." />)

    expect(html).toContain('No testimonies yet.')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test tests/components/video-grid.test.tsx`
Expected: FAIL — `@/components/VideoGrid` does not exist.

This is the repo's first `.tsx` test. That was verified to work before this plan was written: a probe rendering a component through `react-dom/server` passed with no config change, so nothing needs installing or adding to `vitest.config.mts`.

- [ ] **Step 3: Write the component**

Create `components/VideoGrid.tsx`:

```tsx
import { formatDate, formatDuration, type SermonData } from '@/lib/api'
import { speakerLabel } from '@/lib/parsers'

/**
 * A grid of video cards. Presentational and source-agnostic: sermons,
 * testimonies and podcasts all render the same card, so the three pages do not
 * fork three grids that then drift apart.
 *
 * Container queries rather than viewport breakpoints — this sits inside a full
 * page today and inside a narrower column later.
 */
export default function VideoGrid({
  videos,
  emptyMessage,
}: {
  videos: SermonData[]
  emptyMessage: string
}) {
  if (videos.length === 0) {
    return <p className="text-[15px] text-[#6B7280] leading-[1.6]">{emptyMessage}</p>
  }

  return (
    <div className="@container">
      <ul className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-6 list-none p-0 m-0">
        {videos.map((v) => {
          const speaker = speakerLabel(v.speaker)
          return (
            <li key={v.id}>
              <a
                href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 rounded-2xl overflow-hidden border border-[#DBDDE0] bg-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
                <div className="flex flex-col gap-1 p-4 pt-1">
                  <h3 className="text-[15px] font-semibold text-[#1E2024] leading-[1.3] text-balance group-hover:text-[#0066FF] transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-[1.5]">
                    {speaker && `${speaker} · `}
                    {formatDate(v.date)} · {formatDuration(v.duration)}
                  </p>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test tests/components/video-grid.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Create the testimonies page**

Create `app/(site)/messages/testimonies/page.tsx`:

```tsx
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import VideoGrid from '@/components/VideoGrid'
import { kvGet } from '@/lib/kv'
import type { SermonData } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Testimonies',
  description:
    'Stories from the Mosaic family — ordinary people describing what God has done in their lives.',
}

export const revalidate = 600

export default async function Testimonies() {
  // Read the cache directly rather than through /api/videos — this is a server
  // component, so an HTTP round trip back to our own origin buys nothing.
  const videos = (await kvGet<SermonData[]>('videos:testimonies')) ?? []

  return (
    <div>
      <PageHero
        overline="Stories"
        title="Testimonies"
        subtitle="Ordinary people describing what God has done in their lives — in their own words."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader heading="All Testimonies" />
          <VideoGrid
            videos={videos}
            emptyMessage="Testimonies will appear here as they are published."
          />
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 6: Verify the page builds and renders**

Run: `bun run build`
Expected: compiles, and `/messages/testimonies` appears in the route list.

- [ ] **Step 7: Commit**

```bash
git add components/VideoGrid.tsx app/\(site\)/messages/testimonies tests/components/video-grid.test.tsx
git commit -m "feat: add the testimonies page on a shared VideoGrid"
```

---

### Task 5: Split sermons and podcasts onto their own pages

**Files:**
- Create: `app/(site)/messages/sermons/page.tsx`
- Create: `app/(site)/messages/podcasts/page.tsx`
- Delete: `components/MessageTabs.tsx`
- Modify: `app/(site)/messages/page.tsx` (emptied in Task 6; this task only removes the tabs)

**Interfaces:**
- Consumes: existing `SermonArchive` and `AudioPanel` components, unchanged.
- Produces: routes `/messages/sermons` and `/messages/podcasts`.

- [ ] **Step 1: Create the sermons page**

Create `app/(site)/messages/sermons/page.tsx`. This is a lift of the current Video panel — `SermonArchive` is not modified in this PR:

```tsx
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import SermonArchive from '@/components/SermonArchive'

export const metadata: Metadata = {
  title: 'Sermons',
  description:
    'Explore the Mosaic sermon archive — every message rooted in Scripture and the context that makes it come alive.',
}

export default function Sermons() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Sermons"
        subtitle="Every message rooted in Scripture and grounded in the context that makes it come alive."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader heading="All Sermons" />
          <SermonArchive />
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create the podcasts page**

Create `app/(site)/messages/podcasts/page.tsx`. The subscribe links move here from the Messages hero, because this is now the page a listener lands on:

```tsx
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import AudioPanel from '@/components/AudioPanel'

export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    'Extended Cut — the Mosaic podcast. Go deeper than Sunday on Spotify and Apple Podcasts.',
}

const SUBSCRIBE = [
  { label: 'Spotify', href: 'https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR' },
  {
    label: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295',
  },
]

export default function Podcasts() {
  return (
    <div>
      <PageHero
        overline="Listen"
        title="Podcasts"
        subtitle="Go deeper than Sunday. Extended Cut unpacks the sermon, the passage, and what it means for everyday life."
      >
        <div className="flex flex-col items-start gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Subscribe &amp; follow
          </p>
          <div className="flex flex-wrap gap-3">
            {SUBSCRIBE.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 min-h-11 rounded-full hover:bg-white/10 hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2024]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </PageHero>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AudioPanel />
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Delete MessageTabs**

`MessageTabs` has exactly one consumer — the Video/Audio switch this PR removes. Delete the component and any test file that targets it:

```bash
git rm components/MessageTabs.tsx
git rm -r --ignore-unmatch tests/components/message-tabs.test.tsx
```

- [ ] **Step 4: Verify nothing still imports it**

Run: `grep -rn "MessageTabs" app components lib tests`
Expected: no output. If `app/(site)/messages/page.tsx` still imports it, that import is removed here; the file is rewritten in Task 6.

- [ ] **Step 5: Build and test**

Run: `bun run build && bun run test`
Expected: compiles with `/messages/sermons` and `/messages/podcasts` in the route list; suite green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: split sermons and podcasts onto their own pages"
```

---

### Task 6: The Messages hub, the Resources stub, and navigation

**Files:**
- Modify: `app/(site)/messages/page.tsx`
- Create: `app/(site)/messages/resources/page.tsx`
- Modify: `lib/nav.ts`

**Interfaces:**
- Consumes: routes created in Tasks 4 and 5.
- Produces: `/messages` as a hub; `/messages/resources` as a draft; nav entries pointing at all four children.

- [ ] **Step 1: Rewrite `/messages` as the hub**

Replace the entire contents of `app/(site)/messages/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Messages',
  description:
    'Sermons, testimonies, podcasts and resources from Mosaic Christian Fellowship.',
}

/*
  /messages used to be the sermon archive. It keeps its URL — it has been shared
  and indexed, so it must not 404 — and becomes the hub for the four child
  pages. A deep link now lands on a page that names its children rather than on
  the grid it expected; that is the trade for a coherent structure.
*/
const SECTIONS = [
  {
    href: '/messages/sermons',
    title: 'Sermons',
    blurb: 'Every Sunday message, grouped by series and searchable by speaker.',
  },
  {
    href: '/messages/testimonies',
    title: 'Testimonies',
    blurb: 'Stories from the Mosaic family, in their own words.',
  },
  {
    href: '/messages/podcasts',
    title: 'Podcasts',
    blurb: 'Extended Cut — going deeper than Sunday, on Spotify and Apple.',
  },
]

export default function Messages() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Messages"
        subtitle="Sermons, testimonies and podcasts — everything Mosaic teaches, in one place."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto @container">
          <ul className="grid grid-cols-1 @2xl:grid-cols-3 gap-6 list-none p-0 m-0">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex flex-col gap-3 h-full rounded-2xl border border-[#DBDDE0] bg-white p-8 min-h-11 hover:border-[#0066FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
                >
                  <h2 className="text-[22px] font-semibold text-[#1E2024] leading-[1.25] text-balance group-hover:text-[#0066FF] transition-colors">
                    {s.title}
                  </h2>
                  <p className="text-[15px] text-[#6B7280] leading-[1.6]">{s.blurb}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-[#0066FF]">
                    Explore →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
```

Resources is deliberately absent from `SECTIONS` — it is a draft, and the hub links only to live pages.

- [ ] **Step 2: Create the Resources draft stub**

Create `app/(site)/messages/resources/page.tsx`. This is the repo's first use of `pageMeta`, so follow the documented pattern exactly:

```tsx
import PageHero from '@/components/PageHero'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: true }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Resources',
  description:
    'Books, organisations and teaching Mosaic recommends, grouped by topic.',
})

/*
  Draft. The current site's Resources page is curated topical lists — books,
  organisations, links and talks under headings like General Resources,
  Singles & Couples, Leadership, Emotional Health, and Justice & Mercy. The
  maintainer is reorganising that content, so this route exists and is
  reviewable but is kept out of navigation and out of search until it is ready.
  Publish by setting draft: false and adding the nav entry in lib/nav.ts.
*/
export default function Resources() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Resources"
        subtitle="Books, organisations and teaching we recommend — grouped by topic."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[15px] text-[#6B7280] leading-[1.6]">
            This page is being put together. In the meantime, ask any member of
            the team for a recommendation.
          </p>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Update navigation**

In `lib/nav.ts`, replace the Messages entry:

```ts
  {
    label: 'Messages',
    items: [
      { label: 'Sermons', href: '/messages/sermons' },
      { label: 'Testimonies', href: '/messages/testimonies' },
      { label: 'Podcasts', href: '/messages/podcasts' },
      { label: 'Resources', href: '#' },
    ],
  },
```

Resources stays on `#` until its page is published — that is the deliberate act `lib/pageMeta.ts` describes.

- [ ] **Step 4: Build and test**

Run: `bun run build && bun run test && bun run lint`
Expected: compiles with `/messages`, `/messages/sermons`, `/messages/testimonies`, `/messages/podcasts`, `/messages/resources` all listed. Suite green. Lint error count unchanged at 20.

- [ ] **Step 5: Check every nav link resolves**

Run: `bun run dev` and visit each of the four Messages links plus `/messages/resources` directly.
Expected: no 404s; Resources renders but is absent from the nav dropdown.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: turn /messages into a hub and add the resources draft"
```

---

### Task 7: Verify against production data

**Files:** none — this is a verification gate before opening the PR.

- [ ] **Step 1: Confirm the category reaches the cache**

Trigger a sync against the preview deployment once the PR is open and Vercel has built it, using `CRON_SECRET` from `.env.local`:

```bash
curl -s -H "Authorization: Bearer $(grep '^CRON_SECRET=' .env.local | cut -d= -f2- | tr -d '"')" \
  "$PREVIEW_URL/api/cron/sync" | python3 -m json.tool
```

Expected: `results['videos:testimonies']` present with `count: 13`, and `results.sermons.count` still `393` — testimonies were already excluded from the sermon archive, so routing them must not change the sermon total.

- [ ] **Step 2: Confirm the endpoint serves them**

```bash
curl -s "$PREVIEW_URL/api/videos/testimonies" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['meta']['total'])"
```

Expected: `13`.

- [ ] **Step 3: Confirm the sermon count did not move**

```bash
curl -s "$PREVIEW_URL/api/sermons?limit=1" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['total'])"
```

Expected: `393`. Any other number means category routing changed the sermon set and must be investigated before merge.

- [ ] **Step 4: Open the pull request**

Include: the counts from Steps 1-3, the note that sermons only changed URL, and that Resources ships as a draft.

---

## Notes for the executor

- **Do not touch `SermonArchive`.** Grouping, collections, the sheet and pagination are PR 2. This PR moves sermons to a new URL and nothing else.
- **`kvSet` has no TTL here.** Category keys follow `sermons:all` and persist until the next sync overwrites them. That is deliberate: if a sync fails, the last good collection keeps serving.
- **The `'excluded'` tests are load-bearing.** They prove that adding `'category'` did not turn discarding into routing. If they fail, the two kinds have been conflated.
