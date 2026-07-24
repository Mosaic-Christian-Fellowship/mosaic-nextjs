import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'
import { matches } from '../.github/scripts/scope-check.mjs'

const ROOT = path.resolve(__dirname, '..')
const config = JSON.parse(readFileSync(path.join(ROOT, '.github', 'lanes.json'), 'utf8'))

describe('glob matching', () => {
  it('matches a directory tree with **', () => {
    expect(matches('lib/**', 'lib/nav.ts')).toBe(true)
    expect(matches('lib/**', 'lib/sync/events.ts')).toBe(true)
    expect(matches('lib/**', 'components/Nav.tsx')).toBe(false)
  })

  it('matches an extension anywhere with **/*', () => {
    expect(matches('**/*.css', 'app/globals.css')).toBe(true)
    expect(matches('**/*.css', 'styles.css')).toBe(true)
    expect(matches('**/*.css', 'app/page.tsx')).toBe(false)
  })

  it('keeps * inside a single segment', () => {
    expect(matches('.env*', '.env.local')).toBe(true)
    expect(matches('app/**/layout.tsx', 'app/(site)/layout.tsx')).toBe(true)
    expect(matches('app/**/layout.tsx', 'app/(site)/about/page.tsx')).toBe(false)
  })

  it('treats dots literally rather than as any-character', () => {
    expect(matches('next.config.ts', 'nextXconfig.ts')).toBe(false)
    expect(matches('next.config.ts', 'next.config.ts')).toBe(true)
  })
})

describe('lane configuration', () => {
  const lanes = Object.entries(config.lanes) as [string, { restricted: string[]; members: string[] }][]

  it('names a default lane that exists', () => {
    expect(Object.keys(config.lanes)).toContain(config.defaultLane)
  })

  it('assigns nobody to more than one lane', () => {
    const seen = lanes.flatMap(([, lane]) => lane.members)
    expect(seen).toEqual([...new Set(seen)])
  })

  it('never restricts a maintainer', () => {
    const members = lanes.flatMap(([, lane]) => lane.members)
    expect(members.filter((m) => config.maintainers.includes(m))).toEqual([])
  })

  it('blocks the content lane from navigation, config, and secrets', () => {
    const restricted = config.lanes.content.restricted as string[]
    const shouldFlag = ['lib/nav.ts', 'next.config.ts', 'package.json', '.env.local', 'app/globals.css']
    for (const file of shouldFlag) {
      expect(restricted.some((p) => matches(p, file)), `${file} should be restricted`).toBe(true)
    }
  })

  it('lets the content lane edit page copy and add media', () => {
    const restricted = config.lanes.content.restricted as string[]
    const shouldPass = ['app/(site)/about/page.tsx', 'components/FaqAccordion.tsx', 'public/images/team.jpg']
    for (const file of shouldPass) {
      expect(restricted.some((p) => matches(p, file)), `${file} should be allowed`).toBe(false)
    }
  })

  it('lets the design lane restyle components but not touch config or data', () => {
    const restricted = config.lanes.design.restricted as string[]
    expect(restricted.some((p) => matches(p, 'components/Nav.tsx'))).toBe(false)
    expect(restricted.some((p) => matches(p, 'app/globals.css'))).toBe(false)
    expect(restricted.some((p) => matches(p, 'lib/nav.ts'))).toBe(true)
    expect(restricted.some((p) => matches(p, 'package.json'))).toBe(true)
  })
})
