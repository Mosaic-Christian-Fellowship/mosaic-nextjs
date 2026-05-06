import { NextRequest, NextResponse } from 'next/server'
import { kvSet, kvSetSyncStatus } from '@/lib/kv'
import { syncSermons } from '@/lib/sync/sermons'
import { PLAYLISTS } from '@/lib/sync/config'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sermons, series } = await syncSermons(PLAYLISTS)
    await kvSet('sermons:all', sermons)
    await kvSet('series:all', series)
    await kvSetSyncStatus('sermons', true, { itemCount: sermons.length })

    return NextResponse.json({
      ok: true,
      sermonCount: sermons.length,
      seriesCount: series.length,
      syncedAt: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Manual sermon sync failed:', msg)
    await kvSetSyncStatus('sermons', false, { error: msg })
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
