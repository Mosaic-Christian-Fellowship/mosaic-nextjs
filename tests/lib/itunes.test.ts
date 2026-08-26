import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchAppleEpisodes, APPLE_EPISODE_LIMIT } from '@/lib/itunes'

const originalFetch = globalThis.fetch

function respond(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 503,
    json: async () => body,
  })
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

describe('fetchAppleEpisodes', () => {
  it('drops the show itself, which the lookup returns as the first result', async () => {
    globalThis.fetch = respond({
      resultCount: 2,
      results: [
        { wrapperType: 'track', kind: 'podcast', collectionName: 'NJ Mosaic', trackCount: 297 },
        {
          wrapperType: 'podcastEpisode',
          trackName: 'Known By Love',
          releaseDate: '2026-08-24T02:58:24Z',
          trackViewUrl: 'https://podcasts.apple.com/us/podcast/known-by-love/id1?i=2',
        },
      ],
    }) as unknown as typeof fetch

    const episodes = await fetchAppleEpisodes('1440078295')

    expect(episodes).toEqual([
      {
        title: 'Known By Love',
        releaseDate: '2026-08-24T02:58:24Z',
        appleUrl: 'https://podcasts.apple.com/us/podcast/known-by-love/id1?i=2',
      },
    ])
  })

  it('skips episodes missing a deep link rather than emitting a broken row', async () => {
    globalThis.fetch = respond({
      results: [
        { wrapperType: 'podcastEpisode', trackName: 'No Link', releaseDate: '2026-08-24T00:00:00Z' },
      ],
    }) as unknown as typeof fetch

    expect(await fetchAppleEpisodes('1440078295')).toEqual([])
  })

  it('returns an empty list when the lookup fails, so the sync can carry on', async () => {
    globalThis.fetch = respond({}, false) as unknown as typeof fetch

    expect(await fetchAppleEpisodes('1440078295')).toEqual([])
  })

  it('requests Apple’s maximum page of episodes', async () => {
    const fetchMock = respond({ results: [] })
    globalThis.fetch = fetchMock as unknown as typeof fetch

    await fetchAppleEpisodes('1440078295')

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('id=1440078295')
    expect(url).toContain('entity=podcastEpisode')
    expect(url).toContain(`limit=${APPLE_EPISODE_LIMIT}`)
  })
})
