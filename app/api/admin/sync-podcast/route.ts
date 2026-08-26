import { NextRequest, NextResponse } from 'next/server'
import { kvSet, kvSetSyncStatus } from '@/lib/kv'
import { syncPodcastEpisodes } from '@/lib/sync/podcast'

export const maxDuration = 60

/**
 * Manual podcast refresh, mirroring /api/admin/sync-sermons. The daily cron
 * covers the normal case; this exists for the maintainer to pull a new episode
 * in immediately after it publishes, without waiting for 09:00 UTC.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const episodes = await syncPodcastEpisodes()
    await kvSet('podcast:episodes', episodes)
    await kvSetSyncStatus('podcast', true, { itemCount: episodes.length })

    return NextResponse.json({
      ok: true,
      episodeCount: episodes.length,
      appleLinked: episodes.filter((e) => e.appleUrl).length,
      syncedAt: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Manual podcast sync failed:', msg)
    await kvSetSyncStatus('podcast', false, { error: msg })
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
