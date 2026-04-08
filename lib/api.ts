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

export interface EventData {
  id: string
  eventId: string
  name: string
  description: string
  summary: string
  startsAt: string
  endsAt: string
  allDay: boolean
  location: string | null
  imageUrl: string | null
  featured: boolean
  hasRegistration: boolean
}

export interface GroupData {
  id: string
  name: string
  description: string
  groupType: string
  headerImage: string | null
  membersCount: number
  dayOfWeek: string | null
  location: string | null
  demographic: string
  contactEmail: string | null
  enrollmentOpen: boolean
}

export interface LiveStreamStatus {
  live: boolean
  videoId?: string
}

export interface ApiResponse<T> {
  data: T
  meta?: { total?: number; page?: number; limit?: number }
}

export interface FormResponse {
  success: boolean
  personId?: string
  created?: boolean
  error?: string
  errors?: Array<{ field: string; message: string }>
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = new URL(path, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v)
    })
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function apiPost<T = FormResponse>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json() as Promise<T>
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  return `${mins} min`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatEventTime(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const time = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${time} – ${endTime}`
}
