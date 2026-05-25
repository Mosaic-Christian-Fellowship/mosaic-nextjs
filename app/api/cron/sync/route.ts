import { NextRequest, NextResponse } from 'next/server'
import { kvSet, kvSetSyncStatus } from '@/lib/kv'
import { syncSermons, enrichWithSpotify } from '@/lib/sync/sermons'
import { syncEvents } from '@/lib/sync/events'
import { syncGroups } from '@/lib/sync/groups'
import { PLAYLISTS } from '@/lib/sync/config'

export const maxDuration = 60

function isDailyRun(): boolean {
  const now = new Date()
  const etHour = parseInt(
    now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false })
  )
  // Run daily syncs between 1 AM and 3 AM ET
  return etHour >= 1 && etHour <= 3
}

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this header for cron invocations)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, { success: boolean; count?: number; error?: string }> = {}
  const daily = isDailyRun()

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

  // Daily only: Sermon sync
  if (daily) {
    try {
      const { sermons, series } = await syncSermons(PLAYLISTS)

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
      await kvSetSyncStatus('sermons', true, { itemCount: enrichedSermons.length })
      results.sermons = { success: true, count: enrichedSermons.length }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      console.error('Sermon sync failed:', msg)
      await kvSetSyncStatus('sermons', false, { error: msg })
      results.sermons = { success: false, error: msg }
    }
  }

  return NextResponse.json({
    daily,
    results,
    syncedAt: new Date().toISOString(),
  })
}
