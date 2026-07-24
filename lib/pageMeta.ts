import type { Metadata } from 'next'

/**
 * Declared by a page to describe its publication state.
 *
 * A draft page is finished enough to merge but not ready for visitors. It stays
 * reachable at its own address so it can be reviewed, but it is kept out of the
 * navigation and hidden from search engines. The maintainer publishes it by
 * setting `draft: false` and adding the navigation entry — one deliberate act,
 * separate from merging the code.
 *
 * Volunteers building a new page should ship it as a draft. See CONTRIBUTING.md.
 */
export type PageMeta = {
  /** True while the page should not be treated as live. */
  draft: boolean
}

/** Keeps a page out of search results while it is still a draft. */
const NOINDEX = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
} as const

/**
 * Wraps a page's metadata so a draft is never indexed.
 *
 * Use it in place of exporting `metadata` directly:
 *
 *   export const pageMeta: PageMeta = { draft: true }
 *   export const metadata = draftAwareMetadata(pageMeta, {
 *     title: 'The Mosaic Guide',
 *     description: '…',
 *   })
 *
 * When the page is published, flip `draft` to false and the noindex disappears
 * with it — there is no second place to remember to update.
 */
export function draftAwareMetadata(meta: PageMeta, base: Metadata): Metadata {
  if (!meta.draft) return base
  return { ...base, robots: NOINDEX }
}
