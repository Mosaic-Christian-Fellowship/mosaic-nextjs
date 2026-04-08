import Redis from 'ioredis'

let client: Redis | null = null

function getClient(): Redis {
  if (client) return client

  const url = process.env.mosaic_REDIS_URL
  if (!url) throw new Error('mosaic_REDIS_URL must be set')

  client = new Redis(url)
  return client
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const c = getClient()
  const val = await c.get(key)
  if (val === null) return null
  return JSON.parse(val) as T
}

export async function kvSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  const c = getClient()
  const json = JSON.stringify(value)
  if (ttlSeconds) {
    await c.set(key, json, 'EX', ttlSeconds)
  } else {
    await c.set(key, json)
  }
}

export async function kvDel(key: string): Promise<void> {
  const c = getClient()
  await c.del(key)
}

export async function kvGetAll<T>(pattern: string): Promise<T[]> {
  const c = getClient()
  const keys = await c.keys(pattern)
  if (keys.length === 0) return []
  const results = await Promise.all(keys.map((k) => c.get(k)))
  return results
    .filter((r): r is string => r !== null)
    .map((r) => JSON.parse(r) as T)
}

export interface SyncStatus {
  success: boolean
  syncedAt: string
  error?: string
  itemCount?: number
}

export async function kvSetSyncStatus(
  dataType: string,
  success: boolean,
  details?: { error?: string; itemCount?: number }
): Promise<void> {
  const status: SyncStatus = {
    success,
    syncedAt: new Date().toISOString(),
    ...details,
  }
  await kvSet(`sync:${dataType}`, status)
}

export async function kvGetSyncStatus(dataType: string): Promise<SyncStatus | null> {
  return kvGet<SyncStatus>(`sync:${dataType}`)
}
