import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncEvents, type EventData } from '@/lib/sync/events'
import * as pco from '@/lib/pco'

vi.mock('@/lib/pco')
const mockedPco = vi.mocked(pco)

beforeEach(() => vi.clearAllMocks())

describe('syncEvents', () => {
  it('fetches future event instances and filters by visibility', async () => {
    mockedPco.pcoFetch.mockResolvedValue({
      data: [
        {
          id: 'inst1',
          type: 'EventInstance',
          attributes: {
            name: 'MINIS Winter Social',
            starts_at: '2026-03-15T17:00:00Z',
            ends_at: '2026-03-15T19:00:00Z',
            all_day_event: false,
            location: 'Appletree Playhouse',
          },
          relationships: {
            event: { data: { type: 'Event', id: 'ev1' } },
          },
        },
        {
          id: 'inst2',
          type: 'EventInstance',
          attributes: {
            name: 'Session Meeting',
            starts_at: '2026-03-28T00:00:00Z',
            ends_at: '2026-03-28T01:00:00Z',
            all_day_event: false,
            location: null,
          },
          relationships: {
            event: { data: { type: 'Event', id: 'ev2' } },
          },
        },
      ],
      included: [
        {
          id: 'ev1',
          type: 'Event',
          attributes: {
            name: 'MINIS Winter Social',
            description: '<div>Fun event</div>',
            summary: 'Fun event',
            visible_in_church_center: true,
            image_url: null,
            featured: false,
          },
        },
        {
          id: 'ev2',
          type: 'Event',
          attributes: {
            name: 'Session Meeting',
            description: '<div>Internal</div>',
            summary: 'Internal',
            visible_in_church_center: false,
            image_url: null,
            featured: false,
          },
        },
      ],
      meta: { total_count: 2 },
    })

    const events = await syncEvents()
    expect(events).toHaveLength(1) // Session Meeting filtered out
    expect(events[0].name).toBe('MINIS Winter Social')
    expect(events[0].eventId).toBe('ev1')
  })

  it('returns empty array when no future events', async () => {
    mockedPco.pcoFetch.mockResolvedValue({
      data: [],
      included: [],
      meta: { total_count: 0 },
    })

    const events = await syncEvents()
    expect(events).toHaveLength(0)
  })
})
