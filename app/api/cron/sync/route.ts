import { NextRequest, NextResponse } from 'next/server'
import { kvSet, kvSetSyncStatus } from '@/lib/kv'
import { syncSermons, enrichWithSpotify } from '@/lib/sync/sermons'
import { syncEvents } from '@/lib/sync/events'
import { syncGroups } from '@/lib/sync/groups'
import { PLAYLISTS } from '@/lib/sync/config'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this header for cron invocations)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, { success: boolean; count?: number; error?: string }> = {}

  // Always: Event sync
  try {
    const events = await syncEvents()
    await kvSet('events:all', events)
    await kvSetSyncStatus('events', true, { itemCount: events.length })
    results.events = { success: true, count: events.length }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Event sync failed:', msg)
    await kvSetSyncStatus('events', false, { error: msg })
    results.events = { success: false, error: msg }
  }

  // Always: Group sync
  try {
    const groups = await syncGroups()
    await kvSet('groups:all', groups)
    await kvSetSyncStatus('groups', true, { itemCount: groups.length })
    results.groups = { success: true, count: groups.length }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Group sync failed:', msg)
    await kvSetSyncStatus('groups', false, { error: msg })
    results.groups = { success: false, error: msg }
  }

  // Sermon sync. This used to be gated behind a 1-3 AM ET window, which made sense while
  // the cron ran every 2 hours. The schedule is now a single daily run (`0 9 * * *` in
  // vercel.json), and Vercel cron schedules are UTC — 09:00 UTC is 05:00 ET in summer and
  // 04:00 ET in winter, so the window never opened and sermons silently stopped syncing.
  // The cron is the throttle now; don't reintroduce a time gate here.
  try {
    const { sermons, series, categories } = await syncSermons(PLAYLISTS)

    // Spotify enrichment — runs in its own try/catch so failure doesn't break sermon sync
    let enrichedSermons = sermons
    try {
      enrichedSermons = await enrichWithSpotify(sermons)
      const spotifyCount = enrichedSermons.filter((s) => s.spotifyUrl).length
      console.log(`Spotify enrichment: matched ${spotifyCount}/${enrichedSermons.length} sermons`)
    } catch (err) {
      console.error('Spotify enrichment failed, continuing with YouTube-only data:', err instanceof Error ? err.message : err)
    }

    await kvSet('sermons:all', enrichedSermons)
    await kvSet('series:all', series)

    // One key per category, each in its own try/catch (same isolation pattern as
    // Spotify enrichment above) so a single category's kvSet throwing cannot mark
    // sermon sync as failed and cannot stop the remaining categories from writing.
    for (const [slug, videos] of Object.entries(categories)) {
      try {
        await kvSet(`videos:${slug}`, videos)
        await kvSetSyncStatus(`videos:${slug}`, true, { itemCount: videos.length })
        results[`videos:${slug}`] = { success: true, count: videos.length }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Category sync failed for "${slug}":`, msg)
        await kvSetSyncStatus(`videos:${slug}`, false, { error: msg })
        results[`videos:${slug}`] = { success: false, error: msg }
      }
    }

    await kvSetSyncStatus('sermons', true, { itemCount: enrichedSermons.length })
    results.sermons = { success: true, count: enrichedSermons.length }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Sermon sync failed:', msg)
    await kvSetSyncStatus('sermons', false, { error: msg })
    results.sermons = { success: false, error: msg }
  }

  return NextResponse.json({
    results,
    syncedAt: new Date().toISOString(),
  })
}
