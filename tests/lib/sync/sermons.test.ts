import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncSermons, type PlaylistConfig } from '@/lib/sync/sermons'
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

  describe('YouTube Shorts', () => {
    const twoShortsAndASermon = () => {
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) =>
        plId === 'PLmaster'
          ? [
              { videoId: 'promo', title: 'See You Sunday!', publishedAt: '2026-06-12T00:00:00Z', position: 0 },
              { videoId: 'clip', title: 'A short but real clip', publishedAt: '2026-06-11T00:00:00Z', position: 1 },
              { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 2 },
            ]
          : []
      )
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'promo', title: 'See You Sunday!', description: '', thumbnail: 't.jpg', durationSeconds: 16 },
        { id: 'clip', title: 'A short but real clip', description: '', thumbnail: 't.jpg', durationSeconds: 120 },
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 't.jpg', durationSeconds: 5158 },
      ])
    }

    it('drops videos confirmed as Shorts', async () => {
      twoShortsAndASermon()
      mockedYt.isShort.mockImplementation(async (id) => id === 'promo')

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['clip', 'sermon'])
    })

    it('keeps a sub-3-minute video that is not actually a Short', async () => {
      twoShortsAndASermon()
      mockedYt.isShort.mockResolvedValue(false)

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['promo', 'clip', 'sermon'])
    })

    it('only probes videos at or under the Shorts duration ceiling', async () => {
      twoShortsAndASermon()
      mockedYt.isShort.mockResolvedValue(false)

      await syncSermons(PLAYLISTS)

      const probed = mockedYt.isShort.mock.calls.map(([id]) => id)
      expect(probed.sort()).toEqual(['clip', 'promo'])
      expect(probed).not.toContain('sermon')
    })

    it('keeps the video when the probe fails rather than dropping a possible sermon', async () => {
      twoShortsAndASermon()
      // isShort swallows its own errors and resolves false; this asserts syncSermons
      // treats that verdict as "keep", so a YouTube outage cannot empty the archive.
      mockedYt.isShort.mockResolvedValue(false)

      const result = await syncSermons(PLAYLISTS)

      expect(result.sermons).toHaveLength(3)
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
