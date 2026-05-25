import { fetchPlaylistItems, fetchVideoDetails, type PlaylistItem } from '../youtube'
import { parseSermonTitle, UNATTRIBUTED_SPEAKER } from '../parsers'
import { fetchSpotifyEpisodes } from '../spotify'
import { SPOTIFY_SHOW_ID } from './config'

export type PlaylistKind = 'master' | 'series' | 'excluded'

export interface PlaylistConfig {
  id: string
  name: string
  kind: PlaylistKind
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
}

export async function syncSermons(playlists: PlaylistConfig[]): Promise<SyncSermonsResult> {
  const masterPlaylist = playlists.find((p) => p.kind === 'master')
  const seriesPlaylists = playlists.filter((p) => p.kind === 'series')
  const excludedPlaylists = playlists.filter((p) => p.kind === 'excluded')

  if (!masterPlaylist) return { sermons: [], series: [] }

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

  if (allItemsMap.size === 0) return { sermons: [], series: [] }

  // 3. Fetch full video details for the union.
  const allItems = Array.from(allItemsMap.values())
  const videoIds = allItems.map((i) => i.videoId)
  const details = await fetchVideoDetails(videoIds)
  const detailMap = new Map(details.map((d) => [d.id, d]))

  // 4. Drop private/deleted (videos.list silently omits these).
  const accessibleItems = allItems.filter((item) => detailMap.has(item.videoId))
  const droppedPrivate = allItems.length - accessibleItems.length
  if (droppedPrivate > 0) {
    console.log(`syncSermons: dropped ${droppedPrivate} private/deleted playlist items`)
  }

  // 5. Build sermon records.
  const sermons: SermonData[] = accessibleItems.map((item) => {
    const detail = detailMap.get(item.videoId)!
    const parsed = parseSermonTitle(detail.title)
    const series = videoToSeries.get(item.videoId)
    return {
      id: item.videoId,
      title: parsed.title,
      speaker: parsed.speaker ?? UNATTRIBUTED_SPEAKER,
      seriesId: series?.id ?? null,
      seriesName: series?.name ?? null,
      date: item.publishedAt.split('T')[0],
      duration: detail.durationSeconds,
      thumbnail: detail.thumbnail,
      youtubeId: item.videoId,
      spotifyUrl: null, // Matched in a separate step
      applePodcastUrl: null,
      description: detail.description,
    }
  })

  // 6. Build series records — only series that ended up with at least one sermon.
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

  return { sermons, series }
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
