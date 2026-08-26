import { fetchPlaylistItems, fetchVideoDetails, type PlaylistItem, type VideoDetail } from '../youtube'
import { parseSermonTitle, UNATTRIBUTED_SPEAKER } from '../parsers'
import { fetchSpotifyEpisodes } from '../spotify'
import { SPOTIFY_SHOW_ID } from './config'

export type PlaylistKind = 'master' | 'series' | 'excluded' | 'category'

// Minimum length for a video to count as a sermon. Also YouTube's Shorts ceiling, so this
// single rule covers Shorts and landscape promo clips alike.
//
// This replaced a per-video probe of youtube.com/shorts/<id>. The probe answered "is this
// a Short?" exactly, but that turned out to be the wrong question: Mosaic's trailers are
// filmed landscape, so the probe cleared them and 18 promos landed in the archive — one at
// position 4 on the messages page. Measured across all 411 videos, the longest promo runs
// 157s and the shortest genuine teaching runs 239s, so 180 separates them cleanly with
// room on both sides. Dropping the probe also removed ~92 HTTP requests per sync, which
// had pushed the run to 46.8s against a 60s function limit.
//
// A title heuristic ("new sermon series", "sermon series") was considered and rejected: it
// caught at most 5 of the 18, every one of which was already under this line, and it would
// silently delete a real sermon the day someone titles one "... Sermon Series: Week 3".
//
// If a trailer longer than this ever appears, staff move it into a 'Non-Sermon Series'
// playlist — no code change. To check whether a single video is a true Short by hand,
// request youtube.com/shorts/<id>: 200 means Short, 303 means not.
export const MIN_SERMON_DURATION_SECONDS = 180

export interface PlaylistConfig {
  id: string
  name: string
  kind: PlaylistKind
  /**
   * Required when kind is 'category'. Used as the Redis key suffix
   * (`videos:<slug>`) and the URL segment (`/messages/<slug>`).
   */
  slug?: string
}

export interface SermonData {
  id: string
  title: string
  speaker: string // always set; UNATTRIBUTED_SPEAKER ('Undefined') when title parsing finds none
  seriesId: string | null
  seriesName: string | null
  date: string
  duration: number
  thumbnail: string
  youtubeId: string
  spotifyUrl: string | null
  applePodcastUrl: string | null
  description: string
}

export interface SeriesData {
  id: string
  name: string
  playlistId: string
  thumbnail: string | null
  sermonCount: number
}

export interface SyncSermonsResult {
  sermons: SermonData[]
  series: SeriesData[]
  /** Videos routed out of the sermon archive into their own collection, keyed by slug. */
  categories: Record<string, SermonData[]>
}

function toSermonData(
  item: PlaylistItem,
  detail: VideoDetail,
  series: { id: string; name: string } | null,
  isCategory = false
): SermonData {
  // parseSermonTitle assumes the `"Title" by Pastor X` sermon convention. Category
  // playlists (testimonies, etc.) use personal-narrative titles that convention doesn't
  // fit — the fallback's stripSpeakerTail would truncate "Saved by Grace" into title
  // "Saved" / speaker "Grace". Category records keep the raw title and stay unattributed.
  const parsed = isCategory ? { title: detail.title, speaker: null } : parseSermonTitle(detail.title)
  return {
    id: item.videoId,
    title: parsed.title,
    speaker: parsed.speaker ?? UNATTRIBUTED_SPEAKER,
    seriesId: series?.id ?? null,
    seriesName: series?.name ?? null,
    // Prefer the video's own publish date over the playlist-add date (see PlaylistItem
    // doc). Falls back to publishedAt for fixtures/records that predate this field.
    date: (item.videoPublishedAt ?? item.publishedAt).split('T')[0],
    duration: detail.durationSeconds,
    thumbnail: detail.thumbnail,
    youtubeId: item.videoId,
    spotifyUrl: null, // Matched in a separate step
    applePodcastUrl: null,
    description: detail.description,
  }
}

export async function syncSermons(playlists: PlaylistConfig[]): Promise<SyncSermonsResult> {
  const masterPlaylist = playlists.find((p) => p.kind === 'master')
  const seriesPlaylists = playlists.filter((p) => p.kind === 'series')
  const excludedPlaylists = playlists.filter((p) => p.kind === 'excluded')
  const categoryPlaylists = playlists.filter((p) => p.kind === 'category')
  for (const cp of categoryPlaylists) {
    if (!cp.slug) {
      throw new Error(`Playlist "${cp.name}" has kind 'category' but no slug`)
    }
  }

  if (!masterPlaylist) return { sermons: [], series: [], categories: {} }

  // 1. Build the union of master + all series playlist items, deduped by videoId.
  //    Master items take precedence; series mapping uses first-encountered series.
  const allItemsMap = new Map<string, PlaylistItem>()
  const videoToSeries = new Map<string, { id: string; name: string }>()

  const masterItems = await fetchPlaylistItems(masterPlaylist.id)
  for (const item of masterItems) {
    allItemsMap.set(item.videoId, item)
  }

  for (const sp of seriesPlaylists) {
    const items = await fetchPlaylistItems(sp.id)
    for (const item of items) {
      if (!videoToSeries.has(item.videoId)) {
        videoToSeries.set(item.videoId, { id: sp.id, name: sp.name })
      }
      if (!allItemsMap.has(item.videoId)) {
        allItemsMap.set(item.videoId, item)
      }
    }
  }

  // 2. Drop anything that appears in an excluded playlist (clips, highlights, testimonies).
  const excludedIds = new Set<string>()
  for (const ep of excludedPlaylists) {
    const items = await fetchPlaylistItems(ep.id)
    for (const item of items) excludedIds.add(item.videoId)
  }
  let droppedExcluded = 0
  for (const id of excludedIds) {
    if (allItemsMap.delete(id)) droppedExcluded++
    videoToSeries.delete(id)
  }
  if (droppedExcluded > 0) {
    console.log(`syncSermons: dropped ${droppedExcluded} items present in excluded playlists`)
  }

  // Category playlists leave the sermon archive exactly like an excluded one, but
  // their members are kept so they can be served on their own page. This is why
  // 'excluded' and 'category' are separate kinds: one discards, one redirects.
  //
  // Precedence when a video sits in BOTH an excluded playlist and a category playlist:
  // this loop fetches each category playlist's own membership directly, independent of
  // the excludedIds set above, so the video is dropped from the archive AND published on
  // its category page. Explicit routing (category) beats blanket exclusion (excluded) —
  // deliberate, see final-review.md Minor 7.
  const categoryItems = new Map<string, PlaylistItem[]>()
  for (const cp of categoryPlaylists) {
    try {
      const items = await fetchPlaylistItems(cp.id)
      categoryItems.set(cp.slug!, items)
      for (const item of items) {
        allItemsMap.delete(item.videoId)
        videoToSeries.delete(item.videoId)
      }
    } catch (err) {
      // A deleted or privated playlist 404s. Letting that throw would take the
      // whole sermon sync down — which is precisely how the archive silently
      // stopped updating for months. Skip the slug instead: the cron then
      // writes no key for it, so the last good collection keeps serving.
      console.error(
        `syncSermons: category "${cp.name}" (${cp.slug}) failed to load:`,
        err instanceof Error ? err.message : err
      )
    }
  }

  if (allItemsMap.size === 0) return { sermons: [], series: [], categories: {} }

  // 3. Fetch full video details for the union.
  const allItems = Array.from(allItemsMap.values())
  const categoryVideoIds = Array.from(categoryItems.values())
    .flat()
    .map((i) => i.videoId)
  const videoIds = Array.from(new Set([...allItems.map((i) => i.videoId), ...categoryVideoIds]))
  const details = await fetchVideoDetails(videoIds)
  const detailMap = new Map(details.map((d) => [d.id, d]))

  // 4. Drop private/deleted (videos.list silently omits these).
  const accessibleItems = allItems.filter((item) => detailMap.has(item.videoId))
  const droppedPrivate = allItems.length - accessibleItems.length
  if (droppedPrivate > 0) {
    console.log(`syncSermons: dropped ${droppedPrivate} private/deleted playlist items`)
  }

  // 5. Drop anything shorter than a sermon. This is the backstop for promo clips sitting in
  //    playlists nobody has marked 'excluded' — including series trailers, which are filed
  //    inside the very series playlist they advertise and so cannot be caught by playlist
  //    membership. See MIN_SERMON_DURATION_SECONDS for why this is a flat cut.
  const fullLengthItems = accessibleItems.filter(
    (item) => detailMap.get(item.videoId)!.durationSeconds > MIN_SERMON_DURATION_SECONDS
  )
  const droppedShort = accessibleItems.length - fullLengthItems.length
  if (droppedShort > 0) {
    console.log(
      `syncSermons: dropped ${droppedShort} videos at or under ${MIN_SERMON_DURATION_SECONDS}s`
    )
  }

  // 6. Build sermon records.
  const sermons: SermonData[] = fullLengthItems.map((item) =>
    toSermonData(item, detailMap.get(item.videoId)!, videoToSeries.get(item.videoId) ?? null)
  )

  // 7. Build series records — only series that ended up with at least one sermon.
  const activeSeries = new Set(sermons.filter((s) => s.seriesId).map((s) => s.seriesId!))
  const series: SeriesData[] = seriesPlaylists
    .filter((sp) => activeSeries.has(sp.id))
    .map((sp) => {
      const seriesSermons = sermons.filter((s) => s.seriesId === sp.id)
      return {
        id: sp.id,
        name: sp.name,
        playlistId: sp.id,
        thumbnail: seriesSermons[0]?.thumbnail ?? null,
        sermonCount: seriesSermons.length,
      }
    })

  // No duration floor here. The floor keeps promos out of the SERMON archive;
  // a testimony is often short, and the playlist is curated by staff, so
  // membership is the filter. Applying the floor would silently drop content.
  const categories: Record<string, SermonData[]> = {}
  for (const [slug, items] of categoryItems) {
    categories[slug] = items
      .filter((item) => detailMap.has(item.videoId))
      .map((item) => toSermonData(item, detailMap.get(item.videoId)!, null, true))
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  return { sermons, series, categories }
}

function titleOverlap(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/))
  const wordsB = new Set(b.toLowerCase().split(/\s+/))
  let overlap = 0
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++
  }
  return overlap
}

function dayOffset(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00Z')
  const b = new Date(dateB + 'T00:00:00Z')
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)
}

export async function enrichWithSpotify(sermons: SermonData[]): Promise<SermonData[]> {
  const episodes = await fetchSpotifyEpisodes(SPOTIFY_SHOW_ID)
  if (episodes.length === 0) return sermons

  const matched = new Set<string>()

  for (const ep of episodes) {
    // Find candidate sermons within ±1 day
    const candidates = sermons
      .filter((s) => !s.spotifyUrl && dayOffset(s.date, ep.releaseDate) <= 1)
      .sort((a, b) => {
        const dayDiffA = dayOffset(a.date, ep.releaseDate)
        const dayDiffB = dayOffset(b.date, ep.releaseDate)
        if (dayDiffA !== dayDiffB) return dayDiffA - dayDiffB
        return titleOverlap(b.title, ep.name) - titleOverlap(a.title, ep.name)
      })

    const best = candidates.find((c) => !matched.has(c.id))
    if (best) {
      best.spotifyUrl = ep.spotifyUrl
      matched.add(best.id)
    }
  }

  return sermons
}
