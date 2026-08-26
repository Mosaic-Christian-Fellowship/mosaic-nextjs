import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/videos/[slug]/route'
import * as kv from '@/lib/kv'

vi.mock('@/lib/kv')
const mockedKv = vi.mocked(kv)

beforeEach(() => vi.clearAllMocks())

const ctx = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe('GET /api/videos/[slug]', () => {
  it('returns the cached videos for a slug', async () => {
    mockedKv.kvGet.mockResolvedValue([{ id: 't1' }, { id: 't2' }] as never)

    const res = await GET(new Request('https://example.com'), ctx('testimonies'))
    const body = await res.json()

    expect(mockedKv.kvGet).toHaveBeenCalledWith('videos:testimonies')
    expect(body.data).toHaveLength(2)
    expect(body.meta.total).toBe(2)
  })

  it('returns an empty list rather than 500 when the key is missing', async () => {
    // A collection can be empty because the sync has not run yet. An empty page
    // is a far better outcome than an error page.
    mockedKv.kvGet.mockResolvedValue(null as never)

    const res = await GET(new Request('https://example.com'), ctx('testimonies'))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data).toEqual([])
    expect(body.meta.total).toBe(0)
  })

  it('rejects a slug that is not a plain identifier', async () => {
    // The slug becomes a Redis key, so it must never carry separators.
    const res = await GET(new Request('https://example.com'), ctx('../sermons:all'))

    expect(res.status).toBe(400)
    expect(mockedKv.kvGet).not.toHaveBeenCalled()
  })
})
