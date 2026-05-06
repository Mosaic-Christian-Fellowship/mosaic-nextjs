import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'
import { UNATTRIBUTED_SPEAKER } from '@/lib/parsers'

interface SermonRecord {
  speaker: string
}

export async function GET() {
  try {
    const allSermons = await kvGet<SermonRecord[]>('sermons:all')
    if (!allSermons) return NextResponse.json({ data: [] })

    const counts = new Map<string, number>()
    for (const s of allSermons) {
      const sp = s.speaker || UNATTRIBUTED_SPEAKER
      counts.set(sp, (counts.get(sp) ?? 0) + 1)
    }

    // Sort: most sermons first; pin UNATTRIBUTED_SPEAKER to the end so the
    // "diagnostic" bucket doesn't compete with real speakers visually.
    const data = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (a.name === UNATTRIBUTED_SPEAKER) return 1
        if (b.name === UNATTRIBUTED_SPEAKER) return -1
        return b.count - a.count
      })

    return NextResponse.json({ data }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error('GET /api/speakers error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
