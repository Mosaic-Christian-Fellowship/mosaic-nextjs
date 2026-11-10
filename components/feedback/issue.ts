// Server-side helpers for app/api/feedback: input validation, the GitHub issue
// body, and parsing that body back for the pins. Nothing here touches the
// network or the token, so it is safe to unit test directly.

import { FEEDBACK_CONFIG } from './config'

export const LIMITS = {
  noteMax: 4000,
  nameMax: 100,
  emailMax: 200,
  pathMax: 300,
  urlMax: 2000,
  selectorMax: 500,
  userAgentMax: 400,
  imageMaxBytes: 1024 * 1024,
  titleNoteMax: 70,
} as const

export interface FeedbackInput {
  note: string
  name: string
  email: string
  path: string
  pageUrl: string
  selector: string
  viewport: { width: number; height: number }
  userAgent: string
  /** Decoded JPEG bytes, or null when the screenshot failed in the browser. */
  image: Buffer | null
}

export type ValidationResult =
  | { ok: true; value: FeedbackInput }
  | { ok: false; error: string }

const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+$/

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function decodeJpeg(raw: unknown): { image: Buffer | null; error?: string } {
  if (raw === undefined || raw === null || raw === '') return { image: null }
  if (typeof raw !== 'string') return { image: null, error: 'Screenshot must be a base64 string.' }
  const base64 = raw.replace(/^data:image\/jpeg;base64,/, '')
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) return { image: null, error: 'Screenshot is not valid base64.' }
  // Reject before decoding anything far too large.
  if ((base64.length * 3) / 4 > LIMITS.imageMaxBytes + 3) {
    return { image: null, error: 'Screenshot is larger than 1 MB.' }
  }
  const bytes = Buffer.from(base64, 'base64')
  if (bytes.length > LIMITS.imageMaxBytes) return { image: null, error: 'Screenshot is larger than 1 MB.' }
  if (bytes.length < 3 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
    return { image: null, error: 'Screenshot must be a JPEG.' }
  }
  return { image: bytes }
}

export function validateFeedback(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Request body must be JSON.' }
  const b = body as Record<string, unknown>

  const note = str(b.note)
  if (!note) return { ok: false, error: 'Please write a note.' }
  if (note.length > LIMITS.noteMax) return { ok: false, error: `Notes can be up to ${LIMITS.noteMax} characters.` }

  const name = str(b.name)
  if (!name) return { ok: false, error: 'Please enter your name.' }
  if (name.length > LIMITS.nameMax || /[\r\n<>]/.test(name)) return { ok: false, error: 'That name looks wrong.' }

  const email = str(b.email)
  if (!email) return { ok: false, error: 'Please enter your email.' }
  if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) return { ok: false, error: 'That email looks wrong.' }

  const path = str(b.path)
  if (!path.startsWith('/') || path.length > LIMITS.pathMax || /[\s<>]/.test(path)) {
    return { ok: false, error: 'Invalid page path.' }
  }

  const pageUrl = str(b.pageUrl)
  try {
    const u = new URL(pageUrl)
    if (!['http:', 'https:'].includes(u.protocol) || pageUrl.length > LIMITS.urlMax) throw new Error()
  } catch {
    return { ok: false, error: 'Invalid page URL.' }
  }

  const selector = str(b.selector) || 'body'
  if (selector.length > LIMITS.selectorMax || /[\r\n]/.test(selector)) {
    return { ok: false, error: 'Invalid element selector.' }
  }

  const vp = (b.viewport ?? {}) as Record<string, unknown>
  const width = Number(vp.width)
  const height = Number(vp.height)
  const viewport = {
    width: Number.isFinite(width) && width > 0 ? Math.round(width) : 0,
    height: Number.isFinite(height) && height > 0 ? Math.round(height) : 0,
  }

  const userAgent = str(b.userAgent).slice(0, LIMITS.userAgentMax).replace(/[\r\n]/g, ' ')

  const { image, error } = decodeJpeg(b.image)
  if (error) return { ok: false, error }

  return { ok: true, value: { note, name, email, path, pageUrl, selector, viewport, userAgent, image } }
}

/** `[/about] First line of the note` with the note part capped at 70 characters. */
export function issueTitle(path: string, note: string): string {
  const firstLine = note.split(/\r?\n/).find((l) => l.trim())?.trim() ?? ''
  const short =
    firstLine.length > LIMITS.titleNoteMax ? `${firstLine.slice(0, LIMITS.titleNoteMax - 1).trimEnd()}…` : firstLine
  return `[${path}] ${short}`
}

/** `screenshots/<timestamp>-<random>.jpg` */
export function screenshotPath(now = new Date(), random = Math.random()): string {
  const stamp = now.toISOString().replace(/[:.]/g, '-')
  const suffix = Math.floor(random * 36 ** 6).toString(36).padStart(6, '0')
  return `${FEEDBACK_CONFIG.screenshotDir}/${stamp}-${suffix}.jpg`
}

export function screenshotUrl(filePath: string): string {
  const { owner, repo, branch } = FEEDBACK_CONFIG
  return `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}?raw=true`
}

// Reviewer text must not be able to forge one of our machine-readable comment
// lines (the cleanup Action deletes whatever file the screenshot line names).
function neutralizeComments(text: string): string {
  return text.replace(/<!--/g, '&lt;!--').replace(/-->/g, '--&gt;')
}

function encodeSelector(selector: string): string {
  return selector.replace(/-->/g, '--\\>')
}

function decodeSelector(selector: string): string {
  return selector.replace(/--\\>/g, '-->')
}

export function issueBody(
  input: FeedbackInput,
  extra: { screenshot: string | null; commitSha: string | undefined; screenshotFailed?: boolean },
): string {
  const lines: string[] = []
  lines.push(neutralizeComments(input.note), '', '---', '')
  lines.push(`**From:** ${neutralizeComments(input.name)} (${input.email})`)
  lines.push(`**Page:** ${neutralizeComments(input.pageUrl)}`)
  lines.push(`**Element:** \`${input.selector.replace(/`/g, "'")}\``)
  lines.push(`**Viewport:** ${input.viewport.width} × ${input.viewport.height}`)
  lines.push(`**Browser:** ${neutralizeComments(input.userAgent) || 'unknown'}`)
  lines.push(`**Commit:** ${extra.commitSha || 'unknown'}`)
  lines.push('')
  if (extra.screenshot) {
    lines.push(`![Screenshot](${screenshotUrl(extra.screenshot)})`)
  } else if (extra.screenshotFailed) {
    lines.push('_The screenshot could not be saved._')
  } else {
    lines.push('_No screenshot (the browser could not capture one)._')
  }
  lines.push('')
  lines.push(`<!-- feedback-path: ${input.path} -->`)
  lines.push(`<!-- feedback-selector: ${encodeSelector(input.selector)} -->`)
  if (extra.screenshot) lines.push(`<!-- feedback-screenshot: ${extra.screenshot} -->`)
  return lines.join('\n')
}

export interface PinItem {
  number: number
  title: string
  note: string
  selector: string | null
}

interface GitHubIssue {
  number: number
  title: string
  body?: string | null
  pull_request?: unknown
}

const PATH_LINE = /^<!-- feedback-path: (.*?) -->$/m
const SELECTOR_LINE = /^<!-- feedback-selector: (.*?) -->$/m

function decodeEntities(text: string): string {
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

/** The open issues that belong to one page, shaped for the pins. */
export function pinsForPath(issues: GitHubIssue[], path: string): PinItem[] {
  const pins: PinItem[] = []
  for (const issue of issues) {
    if (issue.pull_request) continue
    const body = issue.body ?? ''
    const issuePath = body.match(PATH_LINE)?.[1] ?? issue.title.match(/^\[([^\]]+)\]/)?.[1]
    if (issuePath !== path) continue
    const selectorMatch = body.match(SELECTOR_LINE)?.[1]
    const note = decodeEntities(body.split(/\n---\n/)[0] ?? '').trim()
    pins.push({
      number: issue.number,
      title: issue.title,
      note: note.length > 280 ? `${note.slice(0, 279).trimEnd()}…` : note,
      selector: selectorMatch ? decodeSelector(selectorMatch) : null,
    })
  }
  return pins.sort((a, b) => a.number - b.number)
}
