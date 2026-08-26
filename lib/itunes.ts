/**
 * Apple Podcasts episode links, via the public iTunes Lookup API.
 *
 * No auth and no key — this is the same endpoint Apple's own share sheets use.
 * The one hard limit is `limit=200`: Apple returns at most the 200 most recent
 * episodes of a show, and there is no cursor to reach past them. Mosaic's show
 * has 297, so roughly a third of the archive has no Apple deep link available
 * at all. That is a property of Apple's API, not a bug in the match — those
 * rows show a Spotify link only.
 */

export interface AppleEpisode {
  title: string
  /** ISO 8601 datetime, e.g. 2026-08-24T02:58:24Z */
  releaseDate: string
  /** Deep link to the individual episode on Apple Podcasts */
  appleUrl: string
}

const ITUNES_LOOKUP_URL = 'https://itunes.apple.com/lookup'

/** Apple's ceiling. Requesting more is accepted and silently truncated. */
export const APPLE_EPISODE_LIMIT = 200

interface ItunesResult {
  wrapperType?: string
  trackName?: string
  releaseDate?: string
  trackViewUrl?: string
}

export async function fetchAppleEpisodes(collectionId: string): Promise<AppleEpisode[]> {
  const url = `${ITUNES_LOOKUP_URL}?id=${encodeURIComponent(collectionId)}&entity=podcastEpisode&limit=${APPLE_EPISODE_LIMIT}`

  const res = await fetch(url)
  if (!res.ok) {
    console.error(`Apple Podcasts lookup failed: ${res.status}`)
    return []
  }

  // The lookup endpoint answers 200 with `text/javascript`, so `res.json()` is
  // fine but the payload also carries the show itself as the first result —
  // only `wrapperType: 'podcastEpisode'` rows are episodes.
  const data: { results?: ItunesResult[] } = await res.json()

  const episodes: AppleEpisode[] = []
  for (const r of data.results ?? []) {
    if (r.wrapperType !== 'podcastEpisode') continue
    if (!r.trackName || !r.releaseDate || !r.trackViewUrl) continue
    episodes.push({
      title: r.trackName,
      releaseDate: r.releaseDate,
      appleUrl: r.trackViewUrl,
    })
  }

  return episodes
}
