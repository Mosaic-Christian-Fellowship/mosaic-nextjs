export interface SpotifyEpisode {
  id: string
  name: string
  releaseDate: string
  spotifyUrl: string
  durationMs: number
}

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

async function getAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
  const res = await fetch(SPOTIFY_AUTH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    console.error(`Spotify auth failed: ${res.status}`)
    return null
  }

  const data = await res.json()
  return data.access_token
}

export async function fetchSpotifyEpisodes(showId: string): Promise<SpotifyEpisode[]> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    console.log('Spotify credentials not set, skipping episode fetch')
    return []
  }

  const token = await getAccessToken(clientId, clientSecret)
  if (!token) return []

  const episodes: SpotifyEpisode[] = []
  let url: string | null =
    `${SPOTIFY_API_BASE}/shows/${showId}/episodes?limit=50&fields=${encodeURIComponent('items(id,name,release_date,external_urls,duration_ms),next')}`

  while (url) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!res.ok) {
      console.error(`Spotify episodes fetch failed: ${res.status}`)
      break
    }

    const data = await res.json()
    for (const item of data.items ?? []) {
      episodes.push({
        id: item.id,
        name: item.name,
        releaseDate: item.release_date,
        spotifyUrl: item.external_urls.spotify,
        durationMs: item.duration_ms,
      })
    }

    url = data.next ?? null
  }

  return episodes
}
