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

  it('returns empty result when no master playlist is configured', async () => {
    const result = await syncSermons([
      { id: 'PLseries1', name: 'God of Promise Series', kind: 'series' },
    ])
    expect(result.sermons).toHaveLength(0)
    expect(result.series).toHaveLength(0)
  })
})
