import data from '@/data/resources.json'

/**
 * The Resources reading list.
 *
 * This is a curated list, not a feed: the church chose these books once and
 * changes them rarely, so the data is a checked-in file rather than a Redis
 * cache or a Sanity document. Editing it is a pull request, which is also the
 * review step — a wrong book on a recommendation page matters more than a stale
 * one. `data/resources.json` is generated from the harvest scripts in
 * `assets/resources/`; see `docs/resources-data.md`.
 */

export type Cover = { src: string; width: number; height: number }

export type Book = {
  slug: string
  title: string
  author: string
  /** One or two sentences on why it is here, written for this site. */
  description: string
  /** Null for the handful of titles with no cover art we are able to use. */
  cover: Cover | null
}

/** Books sit under a question rather than a genre — "Why am I so anxious?". */
export type Group = { title: string; books: Book[] }

export type Organization = { name: string; shortName?: string; url: string }
export type Film = { title: string; year: number; platform: string }
export type Talk = { title: string; date: string; author?: string; source: string; url: string }

export type Section = {
  slug: string
  title: string
  groups: Group[]
  organizations?: Organization[]
  films?: Film[]
  talks?: Talk[]
}

export const SECTIONS = data.sections as Section[]

/** Short labels for the jump bar — the full section titles do not fit in a pill. */
export const SECTION_NAV: Record<string, string> = {
  general: 'General',
  'singles-couples': 'Singles & Couples',
  leadership: 'Leadership',
  'emotional-health': 'Emotional Health',
  'justice-mercy': 'Justice & Mercy',
  'race-reconciliation': 'Race & the Church',
}

/** Filename of an organisation's logo in `public/resources/logos/`. */
export function logoFile(name: string): string {
  return name.toLowerCase().replace(/^the /, '').replace(/[^a-z0-9]+/g, '-') + '.svg'
}
