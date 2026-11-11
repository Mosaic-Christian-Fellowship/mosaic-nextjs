import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { issueBody, issueTitle, pinsForPath, screenshotPath, validateFeedback } from '@/components/feedback/issue'

vi.mock('@/lib/kv', () => ({ kvIncrWithExpiry: vi.fn() }))
import { kvIncrWithExpiry } from '@/lib/kv'
const incr = vi.mocked(kvIncrWithExpiry)

// Smallest buffer that passes the JPEG magic-byte check.
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46])

const valid = {
  note: 'The parking address is wrong\nIt should say Walnut St.',
  name: 'Grace Lee',
  email: 'grace@example.com',
  path: '/im-new',
  pageUrl: 'https://mosaic-preview.vercel.app/im-new',
  selector: '#main-content > section:nth-of-type(3)',
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone)',
  image: `data:image/jpeg;base64,${JPEG.toString('base64')}`,
}

async function loadRoute() {
  vi.resetModules()
  return import('@/app/api/feedback/route')
}

const post = (route: Awaited<ReturnType<typeof loadRoute>>, body: unknown) =>
  route.POST(
    new NextRequest('https://example.com/api/feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

const get = (route: Awaited<ReturnType<typeof loadRoute>>, path: string) =>
  route.GET(new NextRequest(`https://example.com/api/feedback?path=${encodeURIComponent(path)}`))

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })
}

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.stubEnv('VERCEL_ENV', 'preview')
  vi.stubEnv('FEEDBACK_DEV', '')
  vi.stubEnv('FEEDBACK_GITHUB_TOKEN', 'test-token')
  vi.stubEnv('VERCEL_GIT_COMMIT_SHA', 'abc1234def')
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  incr.mockReset()
  incr.mockResolvedValue(1)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('validateFeedback', () => {
  it('accepts a complete submission and decodes the screenshot', () => {
    const r = validateFeedback(valid)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.image?.equals(JPEG)).toBe(true)
  })

  it('accepts a submission without a screenshot', () => {
    const r = validateFeedback({ ...valid, image: null })
    expect(r.ok && r.value.image).toBe(null)
  })

  it.each([
    ['empty note', { note: '   ' }],
    ['note over 4000 characters', { note: 'x'.repeat(4001) }],
    ['missing name', { name: '' }],
    ['missing email', { email: '' }],
    ['malformed email', { email: 'grace@' }],
    ['relative path', { path: 'im-new' }],
    ['non-http page URL', { pageUrl: 'javascript:alert(1)' }],
    ['PNG screenshot', { image: Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64') }],
    ['non-base64 screenshot', { image: 'not base64!!' }],
    ['screenshot over 1 MB', { image: Buffer.concat([JPEG, Buffer.alloc(1024 * 1024)]).toString('base64') }],
  ])('rejects %s', (_label, override) => {
    expect(validateFeedback({ ...valid, ...override }).ok).toBe(false)
  })

  it('accepts a note of exactly 4000 characters', () => {
    expect(validateFeedback({ ...valid, note: 'x'.repeat(4000) }).ok).toBe(true)
  })
})

describe('issue formatting', () => {
  it('titles the issue with the path and the first line of the note, capped at 70 characters', () => {
    expect(issueTitle('/about', 'Typo in heading\nmore detail')).toBe('[/about] Typo in heading')
    const long = issueTitle('/about', 'a'.repeat(100))
    expect(long.length).toBe('[/about] '.length + 70)
    expect(long.endsWith('…')).toBe(true)
  })

  it('names screenshots screenshots/<timestamp>-<random>.jpg', () => {
    expect(screenshotPath(new Date('2026-11-09T15:30:00.123Z'), 0.5)).toMatch(
      /^screenshots\/2026-11-09T15-30-00-123Z-[0-9a-z]{6}\.jpg$/,
    )
  })

  it('includes every field and the machine-readable lines', () => {
    const r = validateFeedback(valid)
    if (!r.ok) throw new Error(r.error)
    const body = issueBody(r.value, { screenshot: 'screenshots/x.jpg', commitSha: 'abc1234def' })

    expect(body).toContain('The parking address is wrong')
    expect(body).toContain('Grace Lee (grace@example.com)')
    expect(body).toContain(
      '![Screenshot](https://github.com/Mosaic-Christian-Fellowship/mosaic-feedback/blob/main/screenshots/x.jpg?raw=true)',
    )
    expect(body).toContain('https://mosaic-preview.vercel.app/im-new')
    expect(body).toContain('#main-content > section:nth-of-type(3)')
    expect(body).toContain('390 × 844')
    expect(body).toContain('Mozilla/5.0 (iPhone)')
    expect(body).toContain('abc1234def')
    expect(body.split('\n')).toContain('<!-- feedback-screenshot: screenshots/x.jpg -->')
    expect(body.split('\n')).toContain('<!-- feedback-selector: #main-content > section:nth-of-type(3) -->')
  })

  it('stops a note from forging a machine-readable line', () => {
    const r = validateFeedback({ ...valid, note: 'hi\n<!-- feedback-screenshot: screenshots/someone-else.jpg -->' })
    if (!r.ok) throw new Error(r.error)
    const body = issueBody(r.value, { screenshot: null, commitSha: undefined })
    expect(body).not.toMatch(/^<!-- feedback-screenshot:/m)
  })

  it('reads pins back out of issue bodies, filtered by path', () => {
    const r = validateFeedback(valid)
    if (!r.ok) throw new Error(r.error)
    const body = issueBody(r.value, { screenshot: 'screenshots/x.jpg', commitSha: 'abc' })
    const pins = pinsForPath(
      [
        { number: 4, title: '[/im-new] The parking address is wrong', body },
        { number: 5, title: '[/about] Other page', body: body.replace('feedback-path: /im-new', 'feedback-path: /about') },
        { number: 6, title: '[/im-new] A pull request', body, pull_request: {} },
      ],
      '/im-new',
    )
    expect(pins).toEqual([
      {
        number: 4,
        title: '[/im-new] The parking address is wrong',
        note: 'The parking address is wrong\nIt should say Walnut St.',
        selector: '#main-content > section:nth-of-type(3)',
      },
    ])
  })
})

describe('POST /api/feedback', () => {
  it('returns 404 outside preview deploys', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    const res = await post(await loadRoute(), valid)
    expect(res.status).toBe(404)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('runs locally when FEEDBACK_DEV=1', async () => {
    vi.stubEnv('VERCEL_ENV', '')
    vi.stubEnv('FEEDBACK_DEV', '1')
    fetchMock.mockResolvedValueOnce(json({}, 201)).mockResolvedValueOnce(json({ number: 1 }, 201))
    expect((await post(await loadRoute(), valid)).status).toBe(200)
  })

  it('explains a missing token instead of failing silently', async () => {
    vi.stubEnv('FEEDBACK_GITHUB_TOKEN', '')
    const res = await post(await loadRoute(), valid)
    expect(res.status).toBe(503)
    expect((await res.json()).error).toMatch(/not set up/)
  })

  it('rejects invalid input with 400 and never calls GitHub', async () => {
    const res = await post(await loadRoute(), { ...valid, note: '' })
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('commits the screenshot, then creates a labeled issue that links it', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 201)).mockResolvedValueOnce(json({ number: 12 }, 201))
    const res = await post(await loadRoute(), valid)

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ ok: true, number: 12 })

    const [putUrl, putInit] = fetchMock.mock.calls[0]
    expect(String(putUrl)).toMatch(
      /^https:\/\/api\.github\.com\/repos\/Mosaic-Christian-Fellowship\/mosaic-feedback\/contents\/screenshots\/.+\.jpg$/,
    )
    expect(putInit?.method).toBe('PUT')
    expect((putInit?.headers as Record<string, string>).Authorization).toBe('Bearer test-token')
    expect(JSON.parse(String(putInit?.body)).content).toBe(JPEG.toString('base64'))

    const [issueUrl, issueInit] = fetchMock.mock.calls[1]
    expect(String(issueUrl)).toBe('https://api.github.com/repos/Mosaic-Christian-Fellowship/mosaic-feedback/issues')
    const issue = JSON.parse(String(issueInit?.body))
    expect(issue.labels).toEqual(['feedback'])
    expect(issue.title).toBe('[/im-new] The parking address is wrong')
    const file = String(putUrl).split('/contents/')[1]
    expect(issue.body.split('\n')).toContain(`<!-- feedback-screenshot: ${file} -->`)
    expect(issue.body.split('\n')).toContain(`<!-- feedback-selector: ${valid.selector} -->`)
    expect(issue.body).toContain('abc1234def')
  })

  it('still creates the issue when the screenshot upload fails, without a screenshot line', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'nope' }, 422)).mockResolvedValueOnce(json({ number: 13 }, 201))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await post(await loadRoute(), valid)
    expect(res.status).toBe(200)
    const issue = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(issue.body).not.toContain('feedback-screenshot')
    expect(issue.body).toContain('could not be saved')
  })

  it('skips the upload when the browser sent no screenshot', async () => {
    fetchMock.mockResolvedValueOnce(json({ number: 14 }, 201))
    const res = await post(await loadRoute(), { ...valid, image: null })
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/issues$/)
  })

  it('returns 429 once an IP is over the limit', async () => {
    incr.mockResolvedValue(11)
    const res = await post(await loadRoute(), valid)
    expect(res.status).toBe(429)
    expect(incr).toHaveBeenCalledWith('feedback:rate:203.0.113.7', 600)
  })

  it('allows the request when Redis is unavailable', async () => {
    incr.mockRejectedValue(new Error('NOPERM'))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetchMock.mockResolvedValueOnce(json({}, 201)).mockResolvedValueOnce(json({ number: 15 }, 201))
    expect((await post(await loadRoute(), valid)).status).toBe(200)
  })

  it('reports a GitHub failure as 502', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 201)).mockResolvedValueOnce(json({ message: 'Bad credentials' }, 401))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect((await post(await loadRoute(), valid)).status).toBe(502)
  })
})

describe('GET /api/feedback', () => {
  it('returns 404 outside preview deploys', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    expect((await get(await loadRoute(), '/about')).status).toBe(404)
  })

  it('lists open issues for the page and caches the GitHub call', async () => {
    const body = '<!-- feedback-path: /about -->\n<!-- feedback-selector: #team -->'
    fetchMock.mockResolvedValue(json([{ number: 3, title: '[/about] Photo is old', body: `Photo is old\n\n---\n\n${body}` }]))
    const route = await loadRoute()

    const first = await (await get(route, '/about')).json()
    expect(first.data).toEqual([{ number: 3, title: '[/about] Photo is old', note: 'Photo is old', selector: '#team' }])
    expect(String(fetchMock.mock.calls[0][0])).toContain('state=open&labels=feedback')

    const other = await (await get(route, '/give')).json()
    expect(other.data).toEqual([])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
