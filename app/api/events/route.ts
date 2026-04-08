import { NextRequest, NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

export async function GET(req: NextRequest) {
  try {
    const allEvents = await kvGet<Record<string, unknown>[]>('events:all')
    if (!allEvents) return NextResponse.json({ data: [], meta: { total: 0 } })

    // Only return future events
    const now = new Date().toISOString()
    let filtered = allEvents.filter((e) => (e.startsAt as string) >= now)

    // Sort by start date ascending (soonest first)
    filtered.sort((a, b) => (a.startsAt as string).localeCompare(b.startsAt as string))

    // Optional limit (for homepage "What's Happening" — next 5)
    const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '') || filtered.length
    const limited = filtered.slice(0, limit)

    return NextResponse.json({
      data: limited,
      meta: { total: filtered.length },
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error('GET /api/events error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
