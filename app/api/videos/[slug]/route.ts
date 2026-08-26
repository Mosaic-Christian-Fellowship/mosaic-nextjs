import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

interface VideoRecord {
  id: string
  [key: string]: unknown
}

// The slug is interpolated into a Redis key, so it is constrained to a plain
// identifier. Without this, a crafted slug could read another key entirely.
const SLUG_RE = /^[a-z0-9-]+$/

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  try {
    const videos = (await kvGet<VideoRecord[]>(`videos:${slug}`)) ?? []
    return NextResponse.json({ data: videos, meta: { total: videos.length } })
  } catch (err) {
    console.error(`Failed to load videos:${slug}:`, err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to load collection' }, { status: 500 })
  }
}
