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
