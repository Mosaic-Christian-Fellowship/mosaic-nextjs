import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncSermons, MIN_SERMON_DURATION_SECONDS, type PlaylistConfig } from '@/lib/sync/sermons'
import { UNATTRIBUTED_SPEAKER } from '@/lib/parsers'
import * as youtube from '@/lib/youtube'

vi.mock('@/lib/youtube')
const mockedYt = vi.mocked(youtube)

beforeEach(() => vi.clearAllMocks())

const PLAYLISTS: PlaylistConfig[] = [
  { id: 'PLmaster', name: 'Sunday Service', kind: 'master' },
  { id: 'PLseries1', name: 'God of Promise Series', kind: 'series' },
]

describe('syncSermons', () => {
  it('fetches playlist items, video details, and returns structured sermon + series data', async () => {
    mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
      if (plId === 'PLmaster') {
        return [
          { videoId: 'v1', title: '"Our God of Promise" by Pastor Dave Park', publishedAt: '2026-01-04T00:00:00Z', position: 0 },
          { videoId: 'v2', title: 'Mosaic Christian Fellowship: "Thriving" by Pastor Andre Choi', publishedAt: '2026-01-11T00:00:00Z', position: 1 },
        ]
      }
      if (plId === 'PLseries1') {
        return [{ videoId: 'v1', title: '', publishedAt: '', position: 0 }]
      }
      return []
    })

    mockedYt.fetchVideoDetails.mockResolvedValue([
      { id: 'v1', title: '"Our God of Promise" by Pastor Dave Park', description: 'Desc 1', thumbnail: 'thumb1.jpg', durationSeconds: 2220 },
      { id: 'v2', title: 'Mosaic Christian Fellowship: "Thriving" by Pastor Andre Choi', description: 'Desc 2', thumbnail: 'thumb2.jpg', durationSeconds: 1800 },
    ])

    const result = await syncSermons(PLAYLISTS)

    expect(result.sermons).toHaveLength(2)
    expect(result.sermons[0].title).toBe('Our God of Promise')
    expect(result.sermons[0].speaker).toBe('Pastor Dave Park')
    expect(result.sermons[0].seriesId).toBe('PLseries1')
    expect(result.sermons[0].seriesName).toBe('God of Promise Series')

    expect(result.sermons[1].seriesId).toBeNull()

    expect(result.series).toHaveLength(1)
    expect(result.series[0].name).toBe('God of Promise Series')
    expect(result.series[0].sermonCount).toBe(1)
  })

  it('handles empty playlists gracefully', async () => {
    mockedYt.fetchPlaylistItems.mockResolvedValue([])
    mockedYt.fetchVideoDetails.mockResolvedValue([])

    const result = await syncSermons(PLAYLISTS)
    expect(result.sermons).toHaveLength(0)
    expect(result.series).toHaveLength(0)
  })

  it('includes series-only videos that are not in master', async () => {
    mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
      if (plId === 'PLmaster') {
        return [
          { videoId: 'v1', title: 'Sermon 1', publishedAt: '2026-01-04T00:00:00Z', position: 0 },
        ]
      }
      if (plId === 'PLseries1') {
        return [
          { videoId: 'v2', title: 'Series only video', publishedAt: '2026-01-11T00:00:00Z', position: 0 },
        ]
      }
      return []
    })

    mockedYt.fetchVideoDetails.mockResolvedValue([
      { id: 'v1', title: 'Sermon 1', description: '', thumbnail: 't1', durationSeconds: 1000 },
      { id: 'v2', title: 'Series only video', description: '', thumbnail: 't2', durationSeconds: 1500 },
    ])

    const result = await syncSermons(PLAYLISTS)
    expect(result.sermons).toHaveLength(2)
    const v2 = result.sermons.find((s) => s.id === 'v2')
    expect(v2?.seriesId).toBe('PLseries1')
    expect(result.series).toHaveLength(1)
    expect(result.series[0].sermonCount).toBe(1)
  })

  it('drops videos that appear in excluded playlists', async () => {
    const playlists: PlaylistConfig[] = [
      ...PLAYLISTS,
      { id: 'PLclips', name: 'Sermon Clips', kind: 'excluded' },
    ]

    mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
      if (plId === 'PLmaster') {
        return [
          { videoId: 'v1', title: 'Sermon 1', publishedAt: '2026-01-04T00:00:00Z', position: 0 },
          { videoId: 'v2', title: 'Sermon 2', publishedAt: '2026-01-11T00:00:00Z', position: 1 },
        ]
      }
      if (plId === 'PLclips') {
        return [{ videoId: 'v2', title: '', publishedAt: '', position: 0 }]
      }
      return []
    })
    mockedYt.fetchVideoDetails.mockResolvedValue([
      { id: 'v1', title: 'Sermon 1', description: '', thumbnail: 't1', durationSeconds: 1000 },
    ])

    const result = await syncSermons(playlists)
    expect(result.sermons).toHaveLength(1)
    expect(result.sermons[0].id).toBe('v1')
  })

  it('tags unattributed sermons as Undefined', async () => {
    mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
      if (plId === 'PLmaster') {
        return [
          { videoId: 'v1', title: 'Wrestling with Promise', publishedAt: '2026-01-04T00:00:00Z', position: 0 },
        ]
      }
      return []
    })
    mockedYt.fetchVideoDetails.mockResolvedValue([
      { id: 'v1', title: 'Wrestling with Promise', description: '', thumbnail: 't1', durationSeconds: 1000 },
    ])

    const result = await syncSermons(PLAYLISTS)
    expect(result.sermons[0].speaker).toBe(UNATTRIBUTED_SPEAKER)
  })

  describe('minimum sermon length', () => {
    // A landscape series trailer, a vertical Short, a real sermon, and a short piece of
    // genuine teaching sitting just above the line.
    const mixedLengths = () => {
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) =>
        plId === 'PLmaster'
          ? [
              { videoId: 'trailer', title: 'NEW SERMON SERIES: GUARD AND CONTEND', publishedAt: '2026-08-06T00:00:00Z', position: 0 },
              { videoId: 'short', title: 'See You Sunday!', publishedAt: '2026-06-12T00:00:00Z', position: 1 },
              { videoId: 'devo', title: '"How to Devo: SING!" by Pastor Dave Park', publishedAt: '2026-06-11T00:00:00Z', position: 2 },
              { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 3 },
            ]
          : []
      )
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'trailer', title: 'NEW SERMON SERIES: GUARD AND CONTEND', description: '', thumbnail: 't.jpg', durationSeconds: 82 },
        { id: 'short', title: 'See You Sunday!', description: '', thumbnail: 't.jpg', durationSeconds: 16 },
        { id: 'devo', title: '"How to Devo: SING!" by Pastor Dave Park', description: '', thumbnail: 't.jpg', durationSeconds: 355 },
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 't.jpg', durationSeconds: 5158 },
      ])
    }

    it('drops promos and Shorts alike, keeping only full-length videos', async () => {
      mixedLengths()

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['devo', 'sermon'])
    })

    it('drops a landscape trailer that is not a YouTube Short', async () => {
      // The regression this guards. Mosaic films trailers landscape, so a
      // youtube.com/shorts/<id> probe cleared them and 18 promos reached the archive —
      // one at position 4 of the messages page. Length is what actually separates them.
      mixedLengths()

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).not.toContain('trailer')
    })

    it('keeps genuine short-form teaching above the line', async () => {
      // The Devotional Series runs 5-9 minutes. The floor must not reach it: measured
      // across the archive, the longest promo is 157s and the shortest teaching 239s.
      mixedLengths()

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toContain('devo')
    })

    it('treats the boundary as exclusive — exactly 180s is not a sermon', async () => {
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) =>
        plId === 'PLmaster'
          ? [
              { videoId: 'atLine', title: 'Exactly at the line', publishedAt: '2026-06-12T00:00:00Z', position: 0 },
              { videoId: 'overLine', title: 'One second over', publishedAt: '2026-06-11T00:00:00Z', position: 1 },
            ]
          : []
      )
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'atLine', title: 'Exactly at the line', description: '', thumbnail: 't.jpg', durationSeconds: MIN_SERMON_DURATION_SECONDS },
        { id: 'overLine', title: 'One second over', description: '', thumbnail: 't.jpg', durationSeconds: MIN_SERMON_DURATION_SECONDS + 1 },
      ])

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['overLine'])
    })

    it('makes no network call beyond the YouTube API', async () => {
      // The removed probe issued one request per short video (~92 per sync), pushing the
      // run to 46.8s against a 60s function limit. Nothing should call fetch directly.
      const spy = vi.spyOn(globalThis, 'fetch')
      mixedLengths()

      await syncSermons(PLAYLISTS)

      expect(spy).not.toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  it('returns empty result when no master playlist is configured', async () => {
    const result = await syncSermons([
      { id: 'PLseries1', name: 'God of Promise Series', kind: 'series' },
    ])
    expect(result.sermons).toHaveLength(0)
    expect(result.series).toHaveLength(0)
  })
})
