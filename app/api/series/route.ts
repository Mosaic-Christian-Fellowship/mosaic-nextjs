import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

export async function GET() {
  try {
    const series = await kvGet<Record<string, unknown>[]>('series:all')
    return NextResponse.json({ data: series ?? [] }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (err) {
    console.error('GET /api/series error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
