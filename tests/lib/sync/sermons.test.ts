import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncSermons, type SermonData, type SeriesData } from '@/lib/sync/sermons'
import * as youtube from '@/lib/youtube'

vi.mock('@/lib/youtube')
const mockedYt = vi.mocked(youtube)

beforeEach(() => vi.clearAllMocks())

const PLAYLISTS = [
  { id: 'PLmaster', name: 'Sunday Service' },
  { id: 'PLseries1', name: 'God of Promise Series' },
]

describe('syncSermons', () => {
  it('fetches playlist items, video details, and returns structured sermon + series data', async () => {
    // Sunday Service master playlist has 2 videos
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

    expect(result.sermons[1].seriesId).toBeNull() // not in any series playlist

    expect(result.series).toHaveLength(1) // only non-master playlists with videos
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
})
