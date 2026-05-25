# Spotify Podcast Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich sermon records with Spotify podcast URLs by matching YouTube sermon videos to Spotify episodes by publish date.

**Architecture:** New `lib/spotify.ts` handles Spotify Client Credentials auth and episode fetching. A new `enrichWithSpotify()` function in `lib/sync/sermons.ts` matches episodes to sermons by date (±1 day tolerance, title tiebreaker). Called in the existing cron and admin sync routes after YouTube sermon records are built.

**Tech Stack:** Spotify Web API, ioredis (existing), Vitest, Next.js App Router

**Spec:** `docs/superpowers/specs/2026-05-24-spotify-enrichment-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `lib/spotify.ts` | Spotify auth + episode fetching |
| Create | `tests/lib/spotify.test.ts` | Tests for Spotify client |
| Create | `tests/lib/sync/sermons-enrichment.test.ts` | Tests for date matching + enrichment |
| Modify | `lib/sync/config.ts` | Add `SPOTIFY_SHOW_ID` constant |
| Modify | `lib/sync/sermons.ts` | Add `enrichWithSpotify()` export |
| Modify | `app/api/cron/sync/route.ts` | Call enrichment after sermon sync |
| Modify | `app/api/admin/sync-sermons/route.ts` | Call enrichment after sermon sync |
| Modify | `app/api/health/route.ts` | Add `SPOTIFY_CLIENT_ID` check |

---

### Task 1: Spotify Client — Auth + Episode Fetching

**Files:**
- Create: `lib/spotify.ts`
- Create: `tests/lib/spotify.test.ts`

- [ ] **Step 1: Write failing tests for Spotify auth and episode fetch**

Create `tests/lib/spotify.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchSpotifyEpisodes } from '@/lib/spotify'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('SPOTIFY_CLIENT_ID', 'test-client-id')
  vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'test-client-secret')
})

describe('fetchSpotifyEpisodes', () => {
  it('returns empty array when credentials are missing', async () => {
    vi.stubEnv('SPOTIFY_CLIENT_ID', '')
    vi.stubEnv('SPOTIFY_CLIENT_SECRET', '')
    const episodes = await fetchSpotifyEpisodes('show123')
    expect(episodes).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('authenticates with Client Credentials flow and fetches episodes', async () => {
    mockFetch
      // Auth call
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token', expires_in: 3600 }),
      })
      // Episodes page 1
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          items: [
            {
              id: 'ep1',
              name: 'Sunday Sermon - January 5',
              release_date: '2026-01-05',
              external_urls: { spotify: 'https://open.spotify.com/episode/ep1' },
              duration_ms: 2400000,
            },
          ],
          next: null,
        }),
      })

    const episodes = await fetchSpotifyEpisodes('show123')

    expect(episodes).toEqual([
      {
        id: 'ep1',
        name: 'Sunday Sermon - January 5',
        releaseDate: '2026-01-05',
        spotifyUrl: 'https://open.spotify.com/episode/ep1',
        durationMs: 2400000,
      },
    ])

    // Verify auth request
    const authCall = mockFetch.mock.calls[0]
    expect(authCall[0]).toBe('https://accounts.spotify.com/api/token')
    expect(authCall[1].method).toBe('POST')
    expect(authCall[1].headers['Content-Type']).toBe('application/x-www-form-urlencoded')
    expect(authCall[1].body).toBe('grant_type=client_credentials')
  })

  it('paginates through all episodes', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token', expires_in: 3600 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          items: [
            { id: 'ep1', name: 'Ep 1', release_date: '2026-01-01', external_urls: { spotify: 'https://open.spotify.com/episode/ep1' }, duration_ms: 1000 },
          ],
          next: 'https://api.spotify.com/v1/shows/show123/episodes?offset=50',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          items: [
            { id: 'ep2', name: 'Ep 2', release_date: '2026-01-08', external_urls: { spotify: 'https://open.spotify.com/episode/ep2' }, duration_ms: 2000 },
          ],
          next: null,
        }),
      })

    const episodes = await fetchSpotifyEpisodes('show123')
    expect(episodes).toHaveLength(2)
    expect(episodes[0].id).toBe('ep1')
    expect(episodes[1].id).toBe('ep2')
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('returns empty array on auth failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

    const episodes = await fetchSpotifyEpisodes('show123')
    expect(episodes).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx vitest run tests/lib/spotify.test.ts`
Expected: FAIL — `Cannot find module '@/lib/spotify'`

- [ ] **Step 3: Implement `lib/spotify.ts`**

Create `lib/spotify.ts`:

```typescript
export interface SpotifyEpisode {
  id: string
  name: string
  releaseDate: string
  spotifyUrl: string
  durationMs: number
}

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

async function getAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
  const res = await fetch(SPOTIFY_AUTH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    console.error(`Spotify auth failed: ${res.status}`)
    return null
  }

  const data = await res.json()
  return data.access_token
}

export async function fetchSpotifyEpisodes(showId: string): Promise<SpotifyEpisode[]> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    console.log('Spotify credentials not set, skipping episode fetch')
    return []
  }

  const token = await getAccessToken(clientId, clientSecret)
  if (!token) return []

  const episodes: SpotifyEpisode[] = []
  let url: string | null =
    `${SPOTIFY_API_BASE}/shows/${showId}/episodes?limit=50&fields=${encodeURIComponent('items(id,name,release_date,external_urls,duration_ms),next')}`

  while (url) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!res.ok) {
      console.error(`Spotify episodes fetch failed: ${res.status}`)
      break
    }

    const data = await res.json()
    for (const item of data.items ?? []) {
      episodes.push({
        id: item.id,
        name: item.name,
        releaseDate: item.release_date,
        spotifyUrl: item.external_urls.spotify,
        durationMs: item.duration_ms,
      })
    }

    url = data.next ?? null
  }

  return episodes
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx vitest run tests/lib/spotify.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/spotify.ts tests/lib/spotify.test.ts
git commit -m "feat(spotify): add Spotify client with Client Credentials auth and episode fetching"
```

---

### Task 2: Date-Based Enrichment Logic

**Files:**
- Modify: `lib/sync/sermons.ts` — add `enrichWithSpotify()` export
- Modify: `lib/sync/config.ts` — add `SPOTIFY_SHOW_ID`
- Create: `tests/lib/sync/sermons-enrichment.test.ts`

- [ ] **Step 1: Write failing tests for date matching**

Create `tests/lib/sync/sermons-enrichment.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { enrichWithSpotify } from '@/lib/sync/sermons'
import type { SermonData } from '@/lib/sync/sermons'

vi.mock('@/lib/spotify', () => ({
  fetchSpotifyEpisodes: vi.fn(),
}))

import { fetchSpotifyEpisodes } from '@/lib/spotify'
const mockFetchEpisodes = vi.mocked(fetchSpotifyEpisodes)

function makeSermon(overrides: Partial<SermonData> = {}): SermonData {
  return {
    id: 'v1',
    title: 'Test Sermon',
    speaker: 'Pastor Kim',
    seriesId: null,
    seriesName: null,
    date: '2026-01-05',
    duration: 2100,
    thumbnail: 'thumb.jpg',
    youtubeId: 'v1',
    spotifyUrl: null,
    applePodcastUrl: null,
    description: 'A sermon',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('enrichWithSpotify', () => {
  it('matches episode to sermon by exact date', async () => {
    const sermons = [makeSermon({ id: 'v1', date: '2026-01-05', title: 'Grace Abounding' })]
    mockFetchEpisodes.mockResolvedValue([
      { id: 'ep1', name: 'Grace Abounding', releaseDate: '2026-01-05', spotifyUrl: 'https://open.spotify.com/episode/ep1', durationMs: 2100000 },
    ])

    const enriched = await enrichWithSpotify(sermons)
    expect(enriched[0].spotifyUrl).toBe('https://open.spotify.com/episode/ep1')
  })

  it('matches episode within ±1 day when no exact match exists', async () => {
    const sermons = [makeSermon({ id: 'v1', date: '2026-01-05', title: 'Sunday Message' })]
    mockFetchEpisodes.mockResolvedValue([
      { id: 'ep1', name: 'Sunday Message', releaseDate: '2026-01-06', spotifyUrl: 'https://open.spotify.com/episode/ep1', durationMs: 2100000 },
    ])

    const enriched = await enrichWithSpotify(sermons)
    expect(enriched[0].spotifyUrl).toBe('https://open.spotify.com/episode/ep1')
  })

  it('does not match episode beyond ±1 day', async () => {
    const sermons = [makeSermon({ id: 'v1', date: '2026-01-05' })]
    mockFetchEpisodes.mockResolvedValue([
      { id: 'ep1', name: 'Some Episode', releaseDate: '2026-01-08', spotifyUrl: 'https://open.spotify.com/episode/ep1', durationMs: 2100000 },
    ])

    const enriched = await enrichWithSpotify(sermons)
    expect(enriched[0].spotifyUrl).toBeNull()
  })

  it('uses title overlap as tiebreaker when multiple sermons share a date', async () => {
    const sermons = [
      makeSermon({ id: 'v1', date: '2026-01-05', title: 'The Promise of Grace' }),
      makeSermon({ id: 'v2', date: '2026-01-05', title: 'Evening Worship' }),
    ]
    mockFetchEpisodes.mockResolvedValue([
      { id: 'ep1', name: 'The Promise of Grace - Mosaic', releaseDate: '2026-01-05', spotifyUrl: 'https://open.spotify.com/episode/ep1', durationMs: 2100000 },
    ])

    const enriched = await enrichWithSpotify(sermons)
    expect(enriched[0].spotifyUrl).toBe('https://open.spotify.com/episode/ep1')
    expect(enriched[1].spotifyUrl).toBeNull()
  })

  it('leaves sermons unchanged when Spotify returns empty', async () => {
    const sermons = [makeSermon({ id: 'v1', date: '2026-01-05' })]
    mockFetchEpisodes.mockResolvedValue([])

    const enriched = await enrichWithSpotify(sermons)
    expect(enriched[0].spotifyUrl).toBeNull()
  })

  it('does not assign same episode to multiple sermons', async () => {
    const sermons = [
      makeSermon({ id: 'v1', date: '2026-01-05', title: 'Sermon A' }),
      makeSermon({ id: 'v2', date: '2026-01-06', title: 'Sermon B' }),
    ]
    mockFetchEpisodes.mockResolvedValue([
      { id: 'ep1', name: 'Sermon A', releaseDate: '2026-01-05', spotifyUrl: 'https://open.spotify.com/episode/ep1', durationMs: 2100000 },
    ])

    const enriched = await enrichWithSpotify(sermons)
    expect(enriched[0].spotifyUrl).toBe('https://open.spotify.com/episode/ep1')
    expect(enriched[1].spotifyUrl).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx vitest run tests/lib/sync/sermons-enrichment.test.ts`
Expected: FAIL — `enrichWithSpotify` is not exported from `@/lib/sync/sermons`

- [ ] **Step 3: Add `SPOTIFY_SHOW_ID` to config**

In `lib/sync/config.ts`, add after the `YOUTUBE_CHANNEL_ID` line:

```typescript
export const SPOTIFY_SHOW_ID = '7AZydPQgOQOqdvpiXLGyRR'
```

- [ ] **Step 4: Implement `enrichWithSpotify` in `lib/sync/sermons.ts`**

Add these imports at the top of `lib/sync/sermons.ts`:

```typescript
import { fetchSpotifyEpisodes, type SpotifyEpisode } from '../spotify'
import { SPOTIFY_SHOW_ID } from './config'
```

Add this function after the existing `syncSermons` function:

```typescript
function titleOverlap(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/))
  const wordsB = new Set(b.toLowerCase().split(/\s+/))
  let overlap = 0
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++
  }
  return overlap
}

function dayOffset(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00Z')
  const b = new Date(dateB + 'T00:00:00Z')
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)
}

export async function enrichWithSpotify(sermons: SermonData[]): Promise<SermonData[]> {
  const episodes = await fetchSpotifyEpisodes(SPOTIFY_SHOW_ID)
  if (episodes.length === 0) return sermons

  const matched = new Set<string>()

  for (const ep of episodes) {
    // Find candidate sermons within ±1 day
    const candidates = sermons
      .filter((s) => !s.spotifyUrl && dayOffset(s.date, ep.releaseDate) <= 1)
      .sort((a, b) => {
        const dayDiffA = dayOffset(a.date, ep.releaseDate)
        const dayDiffB = dayOffset(b.date, ep.releaseDate)
        if (dayDiffA !== dayDiffB) return dayDiffA - dayDiffB
        return titleOverlap(b.title, ep.name) - titleOverlap(a.title, ep.name)
      })

    const best = candidates.find((c) => !matched.has(c.id))
    if (best) {
      best.spotifyUrl = ep.spotifyUrl
      matched.add(best.id)
    }
  }

  return sermons
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx vitest run tests/lib/sync/sermons-enrichment.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 6: Run all existing tests to check for regressions**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx vitest run`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add lib/sync/config.ts lib/sync/sermons.ts tests/lib/sync/sermons-enrichment.test.ts
git commit -m "feat(spotify): add date-based enrichment matching Spotify episodes to sermons"
```

---

### Task 3: Wire Enrichment into Cron + Admin Routes

**Files:**
- Modify: `app/api/cron/sync/route.ts`
- Modify: `app/api/admin/sync-sermons/route.ts`

- [ ] **Step 1: Add enrichment to cron sync route**

In `app/api/cron/sync/route.ts`, add import at top:

```typescript
import { enrichWithSpotify } from '@/lib/sync/sermons'
```

Replace the daily sermon sync block (lines 56–68) with:

```typescript
  // Daily only: Sermon sync
  if (daily) {
    try {
      const { sermons, series } = await syncSermons(PLAYLISTS)

      // Spotify enrichment — runs in its own try/catch so failure doesn't break sermon sync
      let enrichedSermons = sermons
      try {
        enrichedSermons = await enrichWithSpotify(sermons)
        const spotifyCount = enrichedSermons.filter((s) => s.spotifyUrl).length
        console.log(`Spotify enrichment: matched ${spotifyCount}/${enrichedSermons.length} sermons`)
      } catch (err) {
        console.error('Spotify enrichment failed, continuing with YouTube-only data:', err instanceof Error ? err.message : err)
      }

      await kvSet('sermons:all', enrichedSermons)
      await kvSet('series:all', series)
      await kvSetSyncStatus('sermons', true, { itemCount: enrichedSermons.length })
      results.sermons = { success: true, count: enrichedSermons.length }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      console.error('Sermon sync failed:', msg)
      await kvSetSyncStatus('sermons', false, { error: msg })
      results.sermons = { success: false, error: msg }
    }
  }
```

- [ ] **Step 2: Add enrichment to admin sync route**

In `app/api/admin/sync-sermons/route.ts`, add import at top:

```typescript
import { enrichWithSpotify } from '@/lib/sync/sermons'
```

Replace the try block body (lines 14–22) with:

```typescript
    const { sermons, series } = await syncSermons(PLAYLISTS)

    let enrichedSermons = sermons
    try {
      enrichedSermons = await enrichWithSpotify(sermons)
    } catch (err) {
      console.error('Spotify enrichment failed:', err instanceof Error ? err.message : err)
    }

    await kvSet('sermons:all', enrichedSermons)
    await kvSet('series:all', series)
    await kvSetSyncStatus('sermons', true, { itemCount: enrichedSermons.length })

    const spotifyCount = enrichedSermons.filter((s) => s.spotifyUrl).length
    return NextResponse.json({
      ok: true,
      sermonCount: enrichedSermons.length,
      seriesCount: series.length,
      spotifyMatched: spotifyCount,
      syncedAt: new Date().toISOString(),
    })
```

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx next build 2>&1 | tail -20`
Expected: Build completes without type errors

- [ ] **Step 4: Commit**

```bash
git add app/api/cron/sync/route.ts app/api/admin/sync-sermons/route.ts
git commit -m "feat(spotify): wire enrichment into cron and admin sync routes"
```

---

### Task 4: Health Check Update

**Files:**
- Modify: `app/api/health/route.ts`

- [ ] **Step 1: Add Spotify env var check**

In `app/api/health/route.ts`, add after the `PCO_SECRET` check (line 10):

```typescript
  checks.SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ? 'set' : 'MISSING (optional)'
```

- [ ] **Step 2: Run full test suite**

Run: `cd /Users/dave/Claude/Code/Freelance/Mosaic/mosaic-nextjs && npx vitest run`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add app/api/health/route.ts
git commit -m "chore: add Spotify credential check to health endpoint"
```
