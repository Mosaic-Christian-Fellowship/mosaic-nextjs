import { describe, it, expect, vi, beforeEach } from 'vitest'
import { matchAppleLinks, coreTitle, syncPodcastEpisodes } from '@/lib/sync/podcast'
import type { SpotifyEpisode } from '@/lib/spotify'
import type { AppleEpisode } from '@/lib/itunes'

vi.mock('@/lib/spotify', () => ({ fetchSpotifyEpisodes: vi.fn() }))
vi.mock('@/lib/itunes', () => ({ fetchAppleEpisodes: vi.fn() }))

import { fetchSpotifyEpisodes } from '@/lib/spotify'
import { fetchAppleEpisodes } from '@/lib/itunes'

const mockSpotify = vi.mocked(fetchSpotifyEpisodes)
const mockApple = vi.mocked(fetchAppleEpisodes)

function spotifyEpisode(overrides: Partial<SpotifyEpisode> = {}): SpotifyEpisode {
  return {
    id: 'ep1',
    name: 'Grace Abounding',
    releaseDate: '2026-01-05',
    spotifyUrl: 'https://open.spotify.com/episode/ep1',
    durationMs: 2_100_000,
    description: 'On grace.',
    ...overrides,
  }
}

function appleEpisode(overrides: Partial<AppleEpisode> = {}): AppleEpisode {
  return {
    title: 'Grace Abounding',
    releaseDate: '2026-01-05T14:00:00Z',
    appleUrl: 'https://podcasts.apple.com/us/podcast/grace-abounding/id1?i=1',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('coreTitle', () => {
  it('strips the speaker attribution Spotify appends but Apple does not', () => {
    expect(coreTitle('“Known By Love” By Pastor Richard Lee')).toBe('known by love')
    expect(coreTitle('Known By Love')).toBe('known by love')
  })

  it('keeps a "by" that belongs to the title', () => {
    // These two are real, and a rule that cut at the first " by " would reduce
    // both to "thriving" and let one claim the other's Apple link.
    expect(coreTitle('“Thriving by Making Disciples” by Pastor Andre Choi')).toBe(
      'thriving by making disciples'
    )
    expect(coreTitle('“Thriving by Loving” by Pastor Kevin Butcher')).toBe('thriving by loving')
  })

  it('leaves an attribution alone when no honorific introduces it', () => {
    // Both feeds publish these the same way, so they match without stripping.
    expect(coreTitle('Say Yes to Jesus by Kevin Calkins')).toBe('say yes to jesus by kevin calkins')
  })
})

describe('matchAppleLinks', () => {
  it('links an episode whose titles match once the attribution is stripped', () => {
    const links = matchAppleLinks(
      [spotifyEpisode({ id: 'ep1', name: '“Grace Abounding” by Pastor Dave Park' })],
      [appleEpisode({ appleUrl: 'apple://grace' })]
    )

    expect(links.get('ep1')).toBe('apple://grace')
  })

  it('links by release date when the titles were rewritten', () => {
    const links = matchAppleLinks(
      [spotifyEpisode({ id: 'ep1', name: 'A Completely Different Title' })],
      [appleEpisode({ title: 'Grace Abounding', appleUrl: 'apple://grace' })]
    )

    expect(links.get('ep1')).toBe('apple://grace')
  })

  it('refuses to guess when two episodes share a release date and neither title matches', () => {
    const links = matchAppleLinks(
      [
        spotifyEpisode({ id: 'ep1', name: 'Renamed One' }),
        spotifyEpisode({ id: 'ep2', name: 'Renamed Two' }),
      ],
      [
        appleEpisode({ title: 'Original One', appleUrl: 'apple://one' }),
        appleEpisode({ title: 'Original Two', appleUrl: 'apple://two' }),
      ]
    )

    expect(links.size).toBe(0)
  })

  it('still separates two episodes released the same day when their titles match', () => {
    // The church regularly publishes two messages on one date. Title matching
    // has to run before the date fallback or these two would be ambiguous.
    const links = matchAppleLinks(
      [
        spotifyEpisode({ id: 'ep1', name: '“Evil and Suffering” by Pastor Daniel Godsave' }),
        spotifyEpisode({ id: 'ep2', name: '“Spiritual Dryness” by Pastor Dave Park' }),
      ],
      [
        appleEpisode({ title: 'Evil and Suffering', appleUrl: 'apple://evil' }),
        appleEpisode({ title: 'Spiritual Dryness', appleUrl: 'apple://dryness' }),
      ]
    )

    expect(links.get('ep1')).toBe('apple://evil')
    expect(links.get('ep2')).toBe('apple://dryness')
  })

  it('never hands the same Apple episode to two Spotify episodes', () => {
    const links = matchAppleLinks(
      [
        spotifyEpisode({ id: 'ep1', name: 'Grace Abounding' }),
        spotifyEpisode({ id: 'ep2', name: 'Grace Abounding' }),
      ],
      [appleEpisode({ appleUrl: 'apple://grace' })]
    )

    expect([...links.values()]).toEqual(['apple://grace'])
  })

  it('tolerates Apple timestamps drifting a day either side of the Spotify date', () => {
    const links = matchAppleLinks(
      [spotifyEpisode({ id: 'ep1', releaseDate: '2026-01-05' })],
      [appleEpisode({ releaseDate: '2026-01-06T02:58:24Z', appleUrl: 'apple://grace' })]
    )

    expect(links.get('ep1')).toBe('apple://grace')
  })

  it('leaves episodes older than Apple’s window unlinked', () => {
    const links = matchAppleLinks(
      [spotifyEpisode({ id: 'old', name: 'Skin to Skin', releaseDate: '2022-09-18' })],
      [appleEpisode()]
    )

    expect(links.has('old')).toBe(false)
  })
})

describe('syncPodcastEpisodes', () => {
  it('lists every Spotify episode, newest first, with Apple links where matched', async () => {
    mockSpotify.mockResolvedValue([
      spotifyEpisode({ id: 'old', name: 'Older One', releaseDate: '2022-09-18' }),
      spotifyEpisode({ id: 'new', name: 'Newer One', releaseDate: '2026-01-05' }),
    ])
    mockApple.mockResolvedValue([appleEpisode({ title: 'Newer One', appleUrl: 'apple://newer' })])

    const episodes = await syncPodcastEpisodes()

    expect(episodes.map((e) => e.id)).toEqual(['new', 'old'])
    expect(episodes[0].appleUrl).toBe('apple://newer')
    expect(episodes[1].appleUrl).toBeNull()
  })

  it('still lists the archive when the Apple lookup fails', async () => {
    mockSpotify.mockResolvedValue([spotifyEpisode()])
    mockApple.mockRejectedValue(new Error('itunes down'))

    const episodes = await syncPodcastEpisodes()

    expect(episodes).toHaveLength(1)
    expect(episodes[0].spotifyUrl).toBe('https://open.spotify.com/episode/ep1')
    expect(episodes[0].appleUrl).toBeNull()
  })

  it('throws when Spotify returns nothing instead of emptying the archive', async () => {
    // fetchSpotifyEpisodes answers [] on auth failure too. Returning that would
    // let the caller write an empty list over a good one.
    mockSpotify.mockResolvedValue([])

    await expect(syncPodcastEpisodes()).rejects.toThrow(/no episodes/)
    expect(mockApple).not.toHaveBeenCalled()
  })
})
