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
