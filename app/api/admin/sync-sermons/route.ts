import { NextRequest, NextResponse } from 'next/server'
import { kvSet, kvSetSyncStatus } from '@/lib/kv'
import { syncSermons, enrichWithSpotify } from '@/lib/sync/sermons'
import { PLAYLISTS } from '@/lib/sync/config'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sermons, series, categories } = await syncSermons(PLAYLISTS)

    let enrichedSermons = sermons
    try {
      enrichedSermons = await enrichWithSpotify(sermons)
    } catch (err) {
      console.error('Spotify enrichment failed:', err instanceof Error ? err.message : err)
    }

    await kvSet('sermons:all', enrichedSermons)
    await kvSet('series:all', series)

    // One key per category so a page can load only what it needs, and so a
    // failure in one collection cannot take the others down with it.
    const categoryCounts: Record<string, number> = {}
    for (const [slug, videos] of Object.entries(categories)) {
      await kvSet(`videos:${slug}`, videos)
      await kvSetSyncStatus(`videos:${slug}`, true, { itemCount: videos.length })
      categoryCounts[slug] = videos.length
    }

    await kvSetSyncStatus('sermons', true, { itemCount: enrichedSermons.length })

    const spotifyCount = enrichedSermons.filter((s) => s.spotifyUrl).length
    return NextResponse.json({
      ok: true,
      sermonCount: enrichedSermons.length,
      seriesCount: series.length,
      spotifyMatched: spotifyCount,
      categoryCounts,
      syncedAt: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Manual sermon sync failed:', msg)
    await kvSetSyncStatus('sermons', false, { error: msg })
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
