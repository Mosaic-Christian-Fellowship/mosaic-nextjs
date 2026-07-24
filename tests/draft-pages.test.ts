import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { draftAwareMetadata } from '@/lib/pageMeta'
import { NAV_ITEMS, type NavItem } from '@/lib/nav'

const ROOT = path.resolve(__dirname, '..')
const SITE_DIR = path.join(ROOT, 'app', '(site)')

/** Every href reachable from the menu, top level and submenu alike. */
function navHrefs(items: NavItem[]): string[] {
  return items.flatMap((item) => [
    ...(item.href ? [item.href] : []),
    ...(item.items ?? []).map((sub) => sub.href),
  ])
}

function findPageFiles(dir: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      found.push(...findPageFiles(full))
    } else if (entry === 'page.tsx') {
      found.push(full)
    }
  }
  return found
}

/** app/(site)/mosaic-guide/page.tsx -> /mosaic-guide */
function routeFor(pageFile: string): string {
  const rel = path.relative(SITE_DIR, path.dirname(pageFile))
  return rel === '' ? '/' : `/${rel.split(path.sep).join('/')}`
}

function declaresDraft(source: string): boolean {
  // Matches `pageMeta` declarations whose object literal sets draft: true.
  const match = source.match(/pageMeta[^=]*=\s*\{([^}]*)\}/)
  return match ? /draft\s*:\s*true/.test(match[1]) : false
}

const draftPages = findPageFiles(SITE_DIR)
  .map((file) => ({ file, route: routeFor(file), source: readFileSync(file, 'utf8') }))
  .filter((page) => declaresDraft(page.source))

describe('draftAwareMetadata', () => {
  const base = { title: 'A page', description: 'Some description' }

  it('hides a draft page from search engines', () => {
    const result = draftAwareMetadata({ draft: true }, base)
    expect(result.robots).toMatchObject({ index: false, follow: false })
  })

  it('leaves a published page untouched', () => {
    expect(draftAwareMetadata({ draft: false }, base)).toEqual(base)
  })

  it('keeps the original title and description on a draft', () => {
    const result = draftAwareMetadata({ draft: true }, base)
    expect(result.title).toBe(base.title)
    expect(result.description).toBe(base.description)
  })
})

describe('draft pages stay unpublished', () => {
  it('finds no draft page linked from the navigation', () => {
    // Publishing is the maintainer's deliberate step: flip `draft` to false and
    // add the nav entry together. A draft reachable from the menu is live by
    // accident, which is the exact failure this guard exists to prevent.
    const hrefs = navHrefs(NAV_ITEMS)
    const linked = draftPages
      .filter((page) => hrefs.some((href) => href === page.route || href.startsWith(`${page.route}/`)))
      .map((page) => page.route)
    expect(
      linked,
      'draft pages must not appear in lib/nav.ts until they are published',
    ).toEqual([])
  })

  it('applies draft-aware metadata on every draft page', () => {
    const missing = draftPages
      .filter((page) => !page.source.includes('draftAwareMetadata'))
      .map((page) => path.relative(ROOT, page.file))
    expect(
      missing,
      'a draft page must build its metadata with draftAwareMetadata so it is not indexed',
    ).toEqual([])
  })
})
