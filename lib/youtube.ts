const YT_BASE = 'https://www.googleapis.com/youtube/v3'

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY must be set')
  return key
}

export interface PlaylistItem {
  videoId: string
  title: string
  publishedAt: string
  position: number
}

export async function fetchPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
  const items: PlaylistItem[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
      key: getApiKey(),
    })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(`${YT_BASE}/playlistItems?${params}`)
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
    const json = await res.json()

    for (const item of json.items ?? []) {
      items.push({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        position: item.snippet.position,
      })
    }

    pageToken = json.nextPageToken
  } while (pageToken)

  return items
}

export interface VideoDetail {
  id: string
  title: string
  description: string
  thumbnail: string
  durationSeconds: number
}

function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  return hours * 3600 + minutes * 60 + seconds
}

export async function fetchVideoDetails(videoIds: string[]): Promise<VideoDetail[]> {
  if (videoIds.length === 0) return []

  // YouTube API accepts max 50 IDs per request
  const batches: string[][] = []
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50))
  }

  const allDetails: VideoDetail[] = []

  for (const batch of batches) {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      id: batch.join(','),
      key: getApiKey(),
    })

    const res = await fetch(`${YT_BASE}/videos?${params}`)
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
    const json = await res.json()

    for (const item of json.items ?? []) {
      allDetails.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails?.maxres?.url ??
          item.snippet.thumbnails?.standard?.url ??
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.default?.url ??
          '',
        durationSeconds: parseIsoDuration(item.contentDetails.duration),
      })
    }
  }

  return allDetails
}

export interface LiveStreamStatus {
  isLive: boolean
  videoId: string | null
  title: string | null
}

export async function checkLiveStream(channelId: string): Promise<LiveStreamStatus> {
  const params = new URLSearchParams({
    part: 'snippet',
    channelId,
    eventType: 'live',
    type: 'video',
    key: getApiKey(),
  })

  const res = await fetch(`${YT_BASE}/search?${params}`)
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
  const json = await res.json()

  if (json.items && json.items.length > 0) {
    return {
      isLive: true,
      videoId: json.items[0].id.videoId,
      title: json.items[0].snippet.title,
    }
  }

  return { isLive: false, videoId: null, title: null }
}
