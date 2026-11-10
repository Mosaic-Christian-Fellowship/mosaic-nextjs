import { NextRequest, NextResponse } from 'next/server'
import { FEEDBACK_CONFIG, feedbackEnabled } from '@/components/feedback/config'
import { issueBody, issueTitle, pinsForPath, screenshotPath, validateFeedback } from '@/components/feedback/issue'
import { kvIncrWithExpiry } from '@/lib/kv'

// Preview deploys only. Creates a GitHub issue (with a screenshot committed to
// the same private repo) for each comment, and lists open ones for the pins.
// The token stays on the server.

const API = 'https://api.github.com'
const REDIS_TIMEOUT_MS = 1500

type Issue = Parameters<typeof pinsForPath>[0][number]

// Per-instance cache of all open feedback issues. One GitHub call serves every
// page's pins for 60 seconds.
let listCache: { at: number; issues: Issue[] } | null = null

function notFound() {
  return new NextResponse('Not found', { status: 404 })
}

function github(path: string, token: string, init: RequestInit = {}) {
  return fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/** True when the request is over the limit. Fails open if Redis is unavailable or read-only. */
async function overRateLimit(ip: string): Promise<boolean> {
  const { max, windowSeconds } = FEEDBACK_CONFIG.rateLimit
  try {
    const count = await Promise.race([
      kvIncrWithExpiry(`feedback:rate:${ip}`, windowSeconds),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), REDIS_TIMEOUT_MS)),
    ])
    return count > max
  } catch (err) {
    console.warn('Feedback rate limit skipped:', err instanceof Error ? err.message : err)
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!feedbackEnabled()) return notFound()

  const token = process.env.FEEDBACK_GITHUB_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'Feedback is not set up on this deploy yet (missing GitHub token).' },
      { status: 503 },
    )
  }

  if (await overRateLimit(clientIp(req))) {
    return NextResponse.json({ error: 'Too many comments in a short time. Try again in a few minutes.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON.' }, { status: 400 })
  }

  const result = validateFeedback(body)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  const input = result.value
  const { owner, repo, branch, label } = FEEDBACK_CONFIG

  try {
    // 1. Commit the screenshot. If that fails, the comment still goes through.
    let screenshot: string | null = null
    let screenshotFailed = false
    if (input.image) {
      const filePath = screenshotPath()
      const res = await github(`/repos/${owner}/${repo}/contents/${filePath}`, token, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Add feedback screenshot for ${input.path}`,
          content: input.image.toString('base64'),
          branch,
        }),
      })
      if (res.ok) {
        screenshot = filePath
      } else {
        screenshotFailed = true
        console.error('Feedback screenshot upload failed:', res.status, await res.text())
      }
    }

    // 2. Create the issue.
    const res = await github(`/repos/${owner}/${repo}/issues`, token, {
      method: 'POST',
      body: JSON.stringify({
        title: issueTitle(input.path, input.note),
        body: issueBody(input, { screenshot, screenshotFailed, commitSha: process.env.VERCEL_GIT_COMMIT_SHA }),
        labels: [label],
      }),
    })
    if (!res.ok) {
      console.error('Feedback issue creation failed:', res.status, await res.text())
      return NextResponse.json({ error: 'Could not save your comment. Please try again.' }, { status: 502 })
    }
    const issue = (await res.json()) as { number: number }
    listCache = null
    return NextResponse.json({ ok: true, number: issue.number, selector: input.selector })
  } catch (err) {
    console.error('POST /api/feedback error:', err)
    return NextResponse.json({ error: 'Could not save your comment. Please try again.' }, { status: 502 })
  }
}

export async function GET(req: NextRequest) {
  if (!feedbackEnabled()) return notFound()

  const path = req.nextUrl.searchParams.get('path')
  if (!path || !path.startsWith('/')) {
    return NextResponse.json({ error: 'Missing ?path=' }, { status: 400 })
  }

  const token = process.env.FEEDBACK_GITHUB_TOKEN
  if (!token) return NextResponse.json({ data: [] })

  const ttl = FEEDBACK_CONFIG.listCacheSeconds
  try {
    if (!listCache || Date.now() - listCache.at > ttl * 1000) {
      const { owner, repo, label } = FEEDBACK_CONFIG
      const res = await github(
        `/repos/${owner}/${repo}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=100`,
        token,
      )
      if (!res.ok) {
        console.error('Feedback issue list failed:', res.status, await res.text())
        return NextResponse.json({ data: [] })
      }
      listCache = { at: Date.now(), issues: (await res.json()) as Issue[] }
    }
    return NextResponse.json(
      { data: pinsForPath(listCache.issues, path) },
      { headers: { 'Cache-Control': `private, max-age=${ttl}` } },
    )
  } catch (err) {
    console.error('GET /api/feedback error:', err)
    return NextResponse.json({ data: [] })
  }
}
