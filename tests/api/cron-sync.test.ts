import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/cron/sync/route'
import * as sermonSync from '@/lib/sync/sermons'
import * as eventSync from '@/lib/sync/events'
import * as groupSync from '@/lib/sync/groups'
import * as kv from '@/lib/kv'

vi.mock('@/lib/sync/sermons')
vi.mock('@/lib/sync/events')
vi.mock('@/lib/sync/groups')
vi.mock('@/lib/kv')

const mockedSermons = vi.mocked(sermonSync)
const mockedEvents = vi.mocked(eventSync)
const mockedGroups = vi.mocked(groupSync)
const mockedKv = vi.mocked(kv)

const SECRET = 'test-cron-secret'

const request = (auth = `Bearer ${SECRET}`) =>
  new NextRequest('https://example.com/api/cron/sync', {
    headers: { authorization: auth },
  })

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('CRON_SECRET', SECRET)

  mockedSermons.syncSermons.mockResolvedValue({ sermons: [], series: [], categories: {} })
  mockedSermons.enrichWithSpotify.mockImplementation(async (s) => s)
  mockedEvents.syncEvents.mockResolvedValue([])
  mockedGroups.syncGroups.mockResolvedValue([])
  mockedKv.kvSet.mockResolvedValue(undefined)
  mockedKv.kvSetSyncStatus.mockResolvedValue(undefined)
})

describe('GET /api/cron/sync', () => {
  it('rejects a request without the cron secret', async () => {
    const res = await GET(request('Bearer wrong'))

    expect(res.status).toBe(401)
    expect(mockedSermons.syncSermons).not.toHaveBeenCalled()
  })

  it('syncs sermons on every authorized run, whatever the time of day', async () => {
    // The regression this guards: sermon sync used to sit behind a 1-3 AM ET window while
    // the only cron fired at 09:00 UTC (04:00/05:00 ET), so it never ran. Any reintroduced
    // time gate fails here, because these hours all sit outside that old window.
    for (const iso of [
      '2026-08-25T09:00:00Z', // the real cron time — 05:00 ET (EDT)
      '2026-01-15T09:00:00Z', // the real cron time — 04:00 ET (EST)
      '2026-08-25T18:00:00Z', // afternoon ET
    ]) {
      vi.clearAllMocks()
      vi.setSystemTime(new Date(iso))

      const res = await GET(request())
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(mockedSermons.syncSermons).toHaveBeenCalledTimes(1)
      expect(body.results.sermons).toEqual({ success: true, count: 0 })
    }

    vi.useRealTimers()
  })

  it('writes sermons and series to the cache', async () => {
    mockedSermons.syncSermons.mockResolvedValue({
      sermons: [{ id: 'v1' }] as never,
      series: [{ id: 's1' }] as never,
      categories: {},
    })
    mockedSermons.enrichWithSpotify.mockImplementation(async (s) => s)

    await GET(request())

    expect(mockedKv.kvSet).toHaveBeenCalledWith('sermons:all', [{ id: 'v1' }])
    expect(mockedKv.kvSet).toHaveBeenCalledWith('series:all', [{ id: 's1' }])
  })

  it('still reports events and groups when the sermon sync throws', async () => {
    mockedSermons.syncSermons.mockRejectedValue(new Error('YouTube down'))

    const res = await GET(request())
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.results.events.success).toBe(true)
    expect(body.results.groups.success).toBe(true)
    expect(body.results.sermons).toEqual({ success: false, error: 'YouTube down' })
  })

  it('keeps sermon data when only Spotify enrichment fails', async () => {
    mockedSermons.syncSermons.mockResolvedValue({
      sermons: [{ id: 'v1' }] as never,
      series: [],
      categories: {},
    })
    mockedSermons.enrichWithSpotify.mockRejectedValue(new Error('Spotify down'))

    const res = await GET(request())
    const body = await res.json()

    expect(body.results.sermons.success).toBe(true)
    expect(mockedKv.kvSet).toHaveBeenCalledWith('sermons:all', [{ id: 'v1' }])
  })

  it('writes each category to its own cache key', async () => {
    mockedSermons.syncSermons.mockResolvedValue({
      sermons: [],
      series: [],
      categories: { testimonies: [{ id: 't1' }] as never },
    })

    const res = await GET(request())
    const body = await res.json()

    expect(mockedKv.kvSet).toHaveBeenCalledWith('videos:testimonies', [{ id: 't1' }])
    expect(body.results['videos:testimonies']).toEqual({ success: true, count: 1 })
  })

  it('does not fail the run when there are no categories', async () => {
    mockedSermons.syncSermons.mockResolvedValue({ sermons: [], series: [], categories: {} })

    const res = await GET(request())

    expect(res.status).toBe(200)
  })

  it('isolates a category kvSet failure from the sermon result and the other categories', async () => {
    mockedSermons.syncSermons.mockResolvedValue({
      sermons: [],
      series: [],
      categories: {
        bad: [{ id: 'b1' }] as never,
        good: [{ id: 'g1' }] as never,
      },
    })
    mockedKv.kvSet.mockImplementation(async (key: string) => {
      if (key === 'videos:bad') throw new Error('Redis down')
    })

    const res = await GET(request())
    const body = await res.json()

    expect(body.results.sermons).toEqual({ success: true, count: 0 })
    expect(body.results['videos:bad']).toEqual({ success: false, error: 'Redis down' })
    expect(mockedKv.kvSet).toHaveBeenCalledWith('videos:good', [{ id: 'g1' }])
    expect(body.results['videos:good']).toEqual({ success: true, count: 1 })
  })
})
