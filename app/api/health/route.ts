import { NextResponse } from 'next/server'
import Redis from 'ioredis'

export async function GET() {
  const checks: Record<string, string> = {}

  // Check env vars
  checks.mosaic_REDIS_URL = process.env.mosaic_REDIS_URL ? 'set' : 'MISSING'
  checks.PCO_APP_ID = process.env.PCO_APP_ID ? 'set' : 'MISSING'
  checks.PCO_SECRET = process.env.PCO_SECRET ? 'set' : 'MISSING'

  // Try Redis connection
  try {
    const url = process.env.mosaic_REDIS_URL
    if (url) {
      const client = new Redis(url)
      await client.ping()
      checks.redis = 'connected'
      await client.quit()
    } else {
      checks.redis = 'no URL'
    }
  } catch (err) {
    checks.redis = `error: ${(err as Error).message}`
  }

  return NextResponse.json({ status: 'ok', checks })
}
