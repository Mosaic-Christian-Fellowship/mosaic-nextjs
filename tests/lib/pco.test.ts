import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pcoFetch, pcoFetchAll, pcoPost, buildPcoAuthHeader } from '@/lib/pco'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('PCO_APP_ID', 'test-app-id')
  vi.stubEnv('PCO_SECRET', 'test-secret')
})

describe('buildPcoAuthHeader', () => {
  it('returns Basic auth header from env vars', () => {
    const header = buildPcoAuthHeader()
    const expected = 'Basic ' + Buffer.from('test-app-id:test-secret').toString('base64')
    expect(header).toBe(expected)
  })
})

describe('pcoFetch', () => {
  it('fetches a PCO endpoint with auth and returns parsed JSON:API data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [{ id: '1', attributes: { name: 'Test' } }],
        meta: { total_count: 1 },
      }),
    })

    const result = await pcoFetch('/calendar/v2/events', { per_page: '10' })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.planningcenteronline.com/calendar/v2/events?per_page=10',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Basic '),
        }),
      })
    )
    expect(result.data).toHaveLength(1)
    const data = result.data as unknown as Array<{ id: string; attributes: { name: string } }>
    expect(data[0].attributes.name).toBe('Test')
  })

  it('throws on non-OK response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve('Unauthorized'),
    })

    await expect(pcoFetch('/calendar/v2/events')).rejects.toThrow('PCO API error: 401')
  })
})

describe('pcoFetchAll', () => {
  it('paginates through all pages', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: '1', attributes: { name: 'A' } }],
          links: { next: 'https://api.planningcenteronline.com/calendar/v2/events?offset=1' },
          meta: { total_count: 2 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: '2', attributes: { name: 'B' } }],
          links: {},
          meta: { total_count: 2 },
        }),
      })

    const results = await pcoFetchAll('/calendar/v2/events')
    expect(results).toHaveLength(2)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})

describe('pcoPost', () => {
  it('sends POST request with JSON:API body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: { id: '123', type: 'FormSubmission', attributes: {} },
      }),
    })

    const result = await pcoPost('/people/v2/forms/123/form_submissions', {
      data: {
        type: 'FormSubmission',
        attributes: {},
      },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.planningcenteronline.com/people/v2/forms/123/form_submissions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      })
    )
    expect(result.data).toBeDefined()
  })

  it('throws on non-OK response with error body detail', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
      text: () => Promise.resolve('{"errors":[{"detail":"note_category_id must be present"}]}'),
    })

    await expect(
      pcoPost('/people/v2/people', { data: { type: 'Person', attributes: {} } })
    ).rejects.toThrow('note_category_id must be present')
  })
})
