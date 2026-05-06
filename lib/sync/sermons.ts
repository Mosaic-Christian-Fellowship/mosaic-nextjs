import { fetchPlaylistItems, fetchVideoDetails } from '../youtube'
import { parseSermonTitle } from '../parsers'

export interface PlaylistConfig {
  id: string
  name: string
}

export interface SermonData {
  id: string
  title: string
  speaker: string | null
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
  const masterPlaylist = playlists.find((p) => p.name === 'Sunday Service')
  const seriesPlaylists = playlists.filter((p) => p.name !== 'Sunday Service')

  if (!masterPlaylist) {
    return { sermons: [], series: [] }
  }

  // 1. Fetch master playlist to get all sermon video IDs
  const masterItems = await fetchPlaylistItems(masterPlaylist.id)
  if (masterItems.length === 0) {
    return { sermons: [], series: [] }
  }

  // 2. Fetch series playlists to build videoId → series mapping
  const videoToSeries = new Map<string, { id: string; name: string }>()
  const seriesCounts = new Map<string, number>()

  for (const sp of seriesPlaylists) {
    const items = await fetchPlaylistItems(sp.id)
    for (const item of items) {
      if (!videoToSeries.has(item.videoId)) {
        videoToSeries.set(item.videoId, { id: sp.id, name: sp.name })
      }
      seriesCounts.set(sp.id, (seriesCounts.get(sp.id) ?? 0) + 1)
    }
  }

  // 3. Fetch full video details
  const videoIds = masterItems.map((i) => i.videoId)
  const details = await fetchVideoDetails(videoIds)
  const detailMap = new Map(details.map((d) => [d.id, d]))

  // 4. Drop private/deleted items. videos.list silently omits videos the API key
  // can't read (private, deleted, region-blocked), so absence from detailMap is
  // a reliable signal that the playlist item should not be surfaced publicly.
  const accessibleItems = masterItems.filter((item) => detailMap.has(item.videoId))
  const dropped = masterItems.length - accessibleItems.length
  if (dropped > 0) {
    console.log(`syncSermons: dropped ${dropped} private/deleted playlist items`)
  }

  // 5. Build sermon records
  const sermons: SermonData[] = accessibleItems.map((item) => {
    const detail = detailMap.get(item.videoId)!
    const parsed = parseSermonTitle(detail.title)
    const series = videoToSeries.get(item.videoId)

    return {
      id: item.videoId,
      title: parsed.title,
      speaker: parsed.speaker,
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

  // 6. Build series records (only series that have sermons in the master list)
  const activeSeries = new Set(sermons.filter((s) => s.seriesId).map((s) => s.seriesId!))
  const series: SeriesData[] = seriesPlaylists
    .filter((sp) => activeSeries.has(sp.id))
    .map((sp) => {
      const count = sermons.filter((s) => s.seriesId === sp.id).length
      const firstSermon = sermons.find((s) => s.seriesId === sp.id)
      return {
        id: sp.id,
        name: sp.name,
        playlistId: sp.id,
        thumbnail: firstSermon?.thumbnail ?? null,
        sermonCount: count,
      }
    })

  return { sermons, series }
}
