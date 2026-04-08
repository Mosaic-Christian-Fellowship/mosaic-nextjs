import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

interface SermonRecord {
  id: string
  youtubeId: string
  [key: string]: unknown
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const allSermons = await kvGet<SermonRecord[]>('sermons:all')
    const sermon = allSermons?.find((s) => s.id === id || s.youtubeId === id)

    if (!sermon) return NextResponse.json({ error: 'Sermon not found' }, { status: 404 })
    return NextResponse.json({ data: sermon }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error(`GET /api/sermons/${id} error:`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
