import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockSet = vi.fn()
const mockDel = vi.fn()
const mockKeys = vi.fn()

vi.mock('ioredis', () => {
  const MockRedis = function () {
    return {
      get: mockGet,
      set: mockSet,
      del: mockDel,
      keys: mockKeys,
    }
  }
  return { default: MockRedis }
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('mosaic_REDIS_URL', 'redis://localhost:6379')
})

import { kvGet, kvSet, kvGetAll, kvSetSyncStatus } from '@/lib/kv'

describe('kvGet', () => {
  it('fetches a typed value by key', async () => {
    mockGet.mockResolvedValue(JSON.stringify({ title: 'Test Sermon' }))
    const result = await kvGet<{ title: string }>('sermons:abc123')
    expect(mockGet).toHaveBeenCalledWith('sermons:abc123')
    expect(result).toEqual({ title: 'Test Sermon' })
  })

  it('returns null for missing keys', async () => {
    mockGet.mockResolvedValue(null)
    const result = await kvGet('sermons:missing')
    expect(result).toBeNull()
  })
})

describe('kvSet', () => {
  it('stores a value with optional TTL', async () => {
    await kvSet('sermons:abc123', { title: 'Test' }, 86400)
    expect(mockSet).toHaveBeenCalledWith(
      'sermons:abc123',
      JSON.stringify({ title: 'Test' }),
      'EX',
      86400
    )
  })

  it('stores without TTL when not specified', async () => {
    await kvSet('sermons:abc123', { title: 'Test' })
    expect(mockSet).toHaveBeenCalledWith(
      'sermons:abc123',
      JSON.stringify({ title: 'Test' })
    )
  })
})

describe('kvGetAll', () => {
  it('fetches all values matching a key pattern', async () => {
    mockKeys.mockResolvedValue(['sermons:a', 'sermons:b'])
    mockGet.mockResolvedValueOnce(JSON.stringify({ title: 'A' }))
    mockGet.mockResolvedValueOnce(JSON.stringify({ title: 'B' }))

    const results = await kvGetAll<{ title: string }>('sermons:*')
    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({ title: 'A' })
  })
})

describe('kvSetSyncStatus', () => {
  it('stores sync timestamp and status', async () => {
    await kvSetSyncStatus('sermons', true)
    expect(mockSet).toHaveBeenCalledWith(
      'sync:sermons',
      expect.stringContaining('"success":true'),
    )
  })
})
