import { fetchSpotifyEpisodes, type SpotifyEpisode } from '../spotify'
import { fetchAppleEpisodes, type AppleEpisode } from '../itunes'
import { SPOTIFY_SHOW_ID, APPLE_PODCAST_ID } from './config'
import type { PodcastEpisode } from '../api'

/**
 * The podcast archive, listed from Spotify and cross-linked to Apple.
 *
 * Spotify is the source of record here rather than the church's RSS feed or the
 * sermon sync:
 *  - Its API returns the whole show (297 episodes at time of writing), with a
 *    per-episode link, duration and show notes in one paginated call.
 *  - The RSS feed lives on mosaicnj.org, which still points at the old
 *    Squarespace site. Building on it would break the moment that domain moves.
 *  - The old page derived "episodes" from sermons that happened to match a
 *    Spotify episode during sermon sync, which silently dropped every episode
 *    without a video and capped the list at 12.
 *
 * Apple only exposes its 200 most recent episodes, so older rows carry a
 * Spotify link alone. That is expected, not a matching failure.
 */

/**
 * Titles for comparison. Both feeds usually carry the speaker in the title —
 * `“Known By Love” by Pastor Richard Lee` — but Apple sometimes publishes the
 * bare `Known By Love`, so the trailing attribution comes off both sides.
 *
 * Only an attribution introduced by an honorific is stripped. Titles like
 * `“Thriving by Making Disciples”` and `“Thriving by Loving”` also contain
 * " by ", and a rule that cut at the first one would reduce both to "thriving"
 * and hand one episode the other's Apple link.
 */
const ATTRIBUTION = /\s+by\s+(?:pastor|reverend|rev\.?|dr\.?|ps\.?)\s+[a-z.\- ]+$/

export function coreTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[‘’“”"']/g, '')
    .replace(ATTRIBUTION, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function daysApart(isoA: string, isoB: string): number {
  const a = new Date(isoA).getTime()
  const b = new Date(isoB).getTime()
  return Math.abs(a - b) / 86_400_000
}

/** Spotify publishes a date; Apple publishes a datetime. Compare on the date. */
function dateOf(iso: string): string {
  return iso.slice(0, 10)
}

/**
 * Pair each Spotify episode with its Apple counterpart.
 *
 * Two passes, strictest first, and every Apple episode is claimed at most once
 * so a near-miss can't steal a link that belongs to another row:
 *  1. Same core title, released within 3 days. Apple's timestamps drift from
 *     Spotify's dates by up to a day either way, and re-published episodes by
 *     more.
 *  2. Failing that, the only unclaimed Apple episode sharing the release date.
 *     Weeks with two episodes are skipped by this pass rather than guessed at.
 *
 * Measured against the live feeds: all 200 episodes inside Apple's window match.
 */
export function matchAppleLinks(
  spotify: SpotifyEpisode[],
  apple: AppleEpisode[]
): Map<string, string> {
  const links = new Map<string, string>()
  const claimed = new Set<AppleEpisode>()

  const byTitle = new Map<string, AppleEpisode[]>()
  for (const a of apple) {
    const key = coreTitle(a.title)
    const bucket = byTitle.get(key)
    if (bucket) bucket.push(a)
    else byTitle.set(key, [a])
  }

  for (const s of spotify) {
    const match = (byTitle.get(coreTitle(s.name)) ?? []).find(
      (a) => !claimed.has(a) && daysApart(a.releaseDate, `${s.releaseDate}T00:00:00Z`) <= 3
    )
    if (match) {
      claimed.add(match)
      links.set(s.id, match.appleUrl)
    }
  }

  for (const s of spotify) {
    if (links.has(s.id)) continue
    const sameDay = apple.filter((a) => !claimed.has(a) && dateOf(a.releaseDate) === s.releaseDate)
    if (sameDay.length !== 1) continue
    claimed.add(sameDay[0])
    links.set(s.id, sameDay[0].appleUrl)
  }

  return links
}

export async function syncPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const spotify = await fetchSpotifyEpisodes(SPOTIFY_SHOW_ID)

  // fetchSpotifyEpisodes answers [] on missing credentials or a failed auth,
  // which is indistinguishable here from a genuinely empty show. Throwing keeps
  // the caller from overwriting a good archive with an empty one — the last
  // successful sync stays in Redis and the page keeps listing.
  if (spotify.length === 0) {
    throw new Error('Spotify returned no episodes; keeping the existing archive')
  }

  // Apple is a nice-to-have second link. If its lookup is down, the archive
  // still lists in full with Spotify links.
  let apple: AppleEpisode[] = []
  try {
    apple = await fetchAppleEpisodes(APPLE_PODCAST_ID)
  } catch (err) {
    console.error(
      'Apple Podcasts lookup failed, listing Spotify links only:',
      err instanceof Error ? err.message : err
    )
  }

  const appleLinks = matchAppleLinks(spotify, apple)

  return spotify
    .map((s) => ({
      id: s.id,
      title: s.name,
      date: s.releaseDate,
      durationMs: s.durationMs,
      description: s.description,
      spotifyUrl: s.spotifyUrl,
      appleUrl: appleLinks.get(s.id) ?? null,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
