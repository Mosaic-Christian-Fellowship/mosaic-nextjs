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

  describe('category playlists', () => {
    const withTestimonies = () => {
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') {
          return [
            { videoId: 't1', title: 'My Story — Grace', publishedAt: '2026-05-01T00:00:00Z', position: 0 },
            { videoId: 't2', title: 'My Story — Sam', publishedAt: '2026-04-01T00:00:00Z', position: 1 },
          ]
        }
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
        { id: 't1', title: 'My Story — Grace', description: 'd1', thumbnail: 't1.jpg', durationSeconds: 240 },
        { id: 't2', title: 'My Story — Sam', description: 'd2', thumbnail: 't2.jpg', durationSeconds: 90 },
      ])
    }

    const CATEGORY_PLAYLISTS: PlaylistConfig[] = [
      { id: 'PLmaster', name: 'Sunday Service', kind: 'master' },
      { id: 'PLtestimony', name: 'Testimonies', kind: 'category', slug: 'testimonies' },
    ]

    it('collects category videos into their own bucket', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(Object.keys(result.categories)).toEqual(['testimonies'])
      expect(result.categories.testimonies.map((v) => v.id)).toEqual(['t1', 't2'])
    })

    it('keeps category videos out of the sermon archive', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['sermon'])
    })

    it('does not apply the duration floor to category videos', async () => {
      // t2 is 90s. In the sermon archive that is a promo; in a staff-curated
      // testimonies playlist it is a short testimony and must survive.
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.categories.testimonies.map((v) => v.id)).toContain('t2')
    })

    it('sorts category videos newest first', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.categories.testimonies.map((v) => v.date)).toEqual(['2026-05-01', '2026-04-01'])
    })

    it('throws when a category playlist has no slug', async () => {
      withTestimonies()

      await expect(
        syncSermons([
          { id: 'PLmaster', name: 'Sunday Service', kind: 'master' },
          { id: 'PLtestimony', name: 'Testimonies', kind: 'category' },
        ])
      ).rejects.toThrow(/slug/i)
    })

    it('returns an empty categories object when none are configured', async () => {
      withTestimonies()

      const result = await syncSermons([{ id: 'PLmaster', name: 'Sunday Service', kind: 'master' }])

      expect(result.categories).toEqual({})
    })

    it('keeps syncing sermons when a category playlist fails to load', async () => {
      // A deleted or privated playlist 404s. That must never take the sermon
      // archive down with it — a deleted playlist is exactly how the archive
      // silently stopped updating for months.
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') throw new Error('YouTube API error: 404')
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
      ])

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.sermons.map((s) => s.id)).toEqual(['sermon'])
      // No bucket for the failed slug, so the cron writes no key for it and the
      // last good collection keeps serving.
      expect(result.categories.testimonies).toBeUndefined()
    })

    it('dates a category video from the video\'s own publish date, not the playlist-add date', async () => {
      // t1 was uploaded to YouTube 2025-01-01 but only added to the Testimonies
      // playlist on 2026-05-01 (publishedAt). The rendered date and sort order must
      // come from videoPublishedAt, not from when staff filed it into the playlist.
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') {
          return [
            {
              videoId: 't1',
              title: 'My Story — Grace',
              publishedAt: '2026-05-01T00:00:00Z',
              videoPublishedAt: '2025-01-01T00:00:00Z',
              position: 0,
            },
          ]
        }
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
        { id: 't1', title: 'My Story — Grace', description: 'd1', thumbnail: 't1.jpg', durationSeconds: 240 },
      ])

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.categories.testimonies[0].date).toBe('2025-01-01')
    })

    it('falls back to publishedAt when videoPublishedAt is absent', async () => {
      withTestimonies()

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      // withTestimonies' fixtures carry no videoPublishedAt at all.
      expect(result.categories.testimonies.map((v) => v.date)).toEqual(['2026-05-01', '2026-04-01'])
    })

    it('keeps the full raw title and leaves the speaker unattributed for category videos', async () => {
      // "Saved by Grace" is personal-narrative phrasing, not the sermon convention
      // parseSermonTitle targets. Its fallback would strip the trailing "by Grace" and
      // report title "Saved", speaker "Grace" — wrong on both counts for a testimony.
      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') {
          return [
            { videoId: 't1', title: 'Saved by Grace', publishedAt: '2026-05-01T00:00:00Z', position: 0 },
          ]
        }
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
        { id: 't1', title: 'Saved by Grace', description: 'd1', thumbnail: 't1.jpg', durationSeconds: 240 },
      ])

      const result = await syncSermons(CATEGORY_PLAYLISTS)

      expect(result.categories.testimonies[0].title).toBe('Saved by Grace')
      expect(result.categories.testimonies[0].speaker).toBe(UNATTRIBUTED_SPEAKER)
    })

    it('keeps a video that is in both an excluded and a category playlist on the category page', async () => {
      // Explicit routing (category) beats blanket exclusion (excluded): the video must
      // be dropped from the sermon archive AND published on its category page.
      const playlists: PlaylistConfig[] = [
        ...CATEGORY_PLAYLISTS,
        { id: 'PLclips', name: 'Sermon Clips', kind: 'excluded' },
      ]

      mockedYt.fetchPlaylistItems.mockImplementation(async (plId) => {
        if (plId === 'PLmaster') {
          return [
            { videoId: 'sermon', title: '"Calling" by Pastor Dave Park', publishedAt: '2026-06-07T00:00:00Z', position: 0 },
          ]
        }
        if (plId === 'PLtestimony') {
          return [{ videoId: 't1', title: 'My Story — Grace', publishedAt: '2026-05-01T00:00:00Z', position: 0 }]
        }
        if (plId === 'PLclips') {
          return [{ videoId: 't1', title: '', publishedAt: '', position: 0 }]
        }
        return []
      })
      mockedYt.fetchVideoDetails.mockResolvedValue([
        { id: 'sermon', title: '"Calling" by Pastor Dave Park', description: '', thumbnail: 's.jpg', durationSeconds: 5158 },
        { id: 't1', title: 'My Story — Grace', description: 'd1', thumbnail: 't1.jpg', durationSeconds: 240 },
      ])

      const result = await syncSermons(playlists)

      expect(result.sermons.map((s) => s.id)).toEqual(['sermon'])
      expect(result.categories.testimonies.map((v) => v.id)).toEqual(['t1'])
    })
  })
})
