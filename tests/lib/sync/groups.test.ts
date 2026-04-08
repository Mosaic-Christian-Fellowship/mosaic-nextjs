import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncGroups, type GroupData, PUBLIC_GROUP_TYPES } from '@/lib/sync/groups'
import * as pco from '@/lib/pco'

vi.mock('@/lib/pco')
const mockedPco = vi.mocked(pco)

beforeEach(() => vi.clearAllMocks())

describe('syncGroups', () => {
  it('fetches groups with group types, filters to public, and parses FG names', async () => {
    mockedPco.pcoFetch.mockResolvedValue({
      data: [
        {
          id: '1001',
          type: 'Group',
          attributes: {
            name: 'YA Co-Ed FG 1 (Tuesdays @ Dumont)',
            description: '<div>Join us!</div>',
            memberships_count: 12,
            enrollment_strategy: 'open',
            contact_email: 'leader@test.com',
            schedule: null,
            header_image: { original: 'https://s3.amazonaws.com/header1.jpg' },
          },
          relationships: {
            group_type: { data: { type: 'GroupType', id: 'gt1' } },
          },
        },
        {
          id: '1002',
          type: 'Group',
          attributes: {
            name: 'DT Leaders',
            description: null,
            memberships_count: 15,
            enrollment_strategy: 'closed',
            contact_email: null,
            schedule: null,
            header_image: { original: null },
          },
          relationships: {
            group_type: { data: { type: 'GroupType', id: 'gt2' } },
          },
        },
      ],
      included: [
        { id: 'gt1', type: 'GroupType', attributes: { name: 'Community Groups', church_center_visible: true } },
        { id: 'gt2', type: 'GroupType', attributes: { name: 'Lay Leadership', church_center_visible: false } },
      ],
      meta: { total_count: 2 },
    })

    const groups = await syncGroups()
    expect(groups).toHaveLength(1) // Lay Leadership filtered out
    expect(groups[0].name).toBe('YA Co-Ed FG 1 (Tuesdays @ Dumont)')
    expect(groups[0].groupType).toBe('Community Groups')
    expect(groups[0].demographic).toBe('YA Co-Ed')
    expect(groups[0].dayOfWeek).toBe('Tuesday')
    expect(groups[0].location).toBe('Dumont')
  })
})
