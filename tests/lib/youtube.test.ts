import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPlaylistItems, fetchVideoDetails, checkLiveStream } from '@/lib/youtube'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('YOUTUBE_API_KEY', 'test-yt-key')
})

describe('fetchPlaylistItems', () => {
  it('fetches all items from a playlist with pagination', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          items: [
            { contentDetails: { videoId: 'v1' }, snippet: { title: 'Sermon 1', publishedAt: '2026-01-01T00:00:00Z', position: 0 } },
          ],
          nextPageToken: 'page2',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          items: [
            { contentDetails: { videoId: 'v2' }, snippet: { title: 'Sermon 2', publishedAt: '2026-01-08T00:00:00Z', position: 1 } },
          ],
        }),
      })

    const items = await fetchPlaylistItems('PLtest123')
    expect(items).toHaveLength(2)
    expect(items[0].videoId).toBe('v1')
    expect(items[1].videoId).toBe('v2')
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})

describe('fetchVideoDetails', () => {
  it('fetches details for a batch of video IDs', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'v1',
            snippet: { title: 'Sermon 1', description: 'Desc', thumbnails: { high: { url: 'thumb1.jpg' } } },
            contentDetails: { duration: 'PT35M16S' },
          },
        ],
      }),
    })

    const details = await fetchVideoDetails(['v1'])
    expect(details).toHaveLength(1)
    expect(details[0].id).toBe('v1')
    expect(details[0].durationSeconds).toBe(2116) // 35*60 + 16
    expect(details[0].thumbnail).toBe('thumb1.jpg')
  })
})

describe('checkLiveStream', () => {
  it('returns live video info when channel is broadcasting', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        items: [
          { id: { videoId: 'live123' }, snippet: { title: 'Sunday Service Live' } },
        ],
      }),
    })

    const result = await checkLiveStream('UCtest')
    expect(result).toEqual({ isLive: true, videoId: 'live123', title: 'Sunday Service Live' })
  })

  it('returns not live when no broadcast found', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    })

    const result = await checkLiveStream('UCtest')
    expect(result).toEqual({ isLive: false, videoId: null, title: null })
  })
})
