import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const allEvents = await kvGet<Record<string, unknown>[]>('events:all')
    const event = allEvents?.find((e) => e.id === id || e.eventId === id)

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    return NextResponse.json({ data: event }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error(`GET /api/events/${id} error:`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
