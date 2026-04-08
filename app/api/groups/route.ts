import { NextRequest, NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

export async function GET(req: NextRequest) {
  try {
    const allGroups = await kvGet<Record<string, unknown>[]>('groups:all')
    if (!allGroups) return NextResponse.json({ data: [], meta: { total: 0 } })

    let filtered = [...allGroups]

    // Filter by group type
    const type = req.nextUrl.searchParams.get('type')
    if (type) {
      filtered = filtered.filter((g) => g.groupType === type)
    }

    // Filter by demographic
    const demographic = req.nextUrl.searchParams.get('demographic')
    if (demographic) {
      filtered = filtered.filter((g) => g.demographic === demographic)
    }

    // Filter by day(s) — comma-separated, e.g., "Monday,Tuesday"
    const days = req.nextUrl.searchParams.get('days')
    if (days) {
      const dayList = days.split(',').map((d) => d.trim())
      filtered = filtered.filter((g) =>
        g.dayOfWeek === null || dayList.includes(g.dayOfWeek as string)
      )
    }

    return NextResponse.json({
      data: filtered,
      meta: { total: filtered.length },
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (err) {
    console.error('GET /api/groups error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
