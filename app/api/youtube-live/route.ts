import { NextResponse } from 'next/server'
import { checkLiveStream } from '@/lib/youtube'
import { kvGet, kvSet } from '@/lib/kv'
import { YOUTUBE_CHANNEL_ID } from '@/lib/sync/config'

const CACHE_KEY = 'youtube:live'
const CACHE_TTL = 300 // 5 minutes

export async function GET() {
  try {
    // Check KV cache first
    const cached = await kvGet<{ isLive: boolean; videoId: string | null; title: string | null }>(CACHE_KEY)
    if (cached) {
      return NextResponse.json({ data: cached, cached: true }, {
        headers: { 'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` },
      })
    }

    // Fetch from YouTube API
    const status = await checkLiveStream(YOUTUBE_CHANNEL_ID)
    await kvSet(CACHE_KEY, status, CACHE_TTL)

    return NextResponse.json({ data: status, cached: false }, {
      headers: { 'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` },
    })
  } catch (err) {
    console.error('GET /api/youtube-live error:', err)
    // On error, return "not live" rather than breaking the homepage
    return NextResponse.json({
      data: { isLive: false, videoId: null, title: null },
      error: true,
    })
  }
}
