import { NextRequest, NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

interface SermonRecord {
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

export async function GET(req: NextRequest) {
  try {
    const allSermons = await kvGet<SermonRecord[]>('sermons:all')
    if (!allSermons) return NextResponse.json({ data: [], meta: { total: 0 } })

    let filtered = [...allSermons]

    // Filter by speaker (exact match, case-insensitive — values come from /api/speakers dropdown)
    const speaker = req.nextUrl.searchParams.get('speaker')
    if (speaker) {
      const target = speaker.toLowerCase()
      filtered = filtered.filter((s) => s.speaker?.toLowerCase() === target)
    }

    // Filter by series
    const seriesId = req.nextUrl.searchParams.get('series')
    if (seriesId) {
      filtered = filtered.filter((s) => s.seriesId === seriesId)
    }

    // Search by title
    const search = req.nextUrl.searchParams.get('search')
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.speaker?.toLowerCase().includes(q) ||
          s.seriesName?.toLowerCase().includes(q)
      )
    }

    // Sort by date descending (newest first)
    filtered.sort((a, b) => b.date.localeCompare(a.date))

    // Pagination
    const page = parseInt(req.nextUrl.searchParams.get('page') ?? '') || 1
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '') || 20, 100)
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      data: paginated,
      meta: { total: filtered.length, page, limit },
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error('GET /api/sermons error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
