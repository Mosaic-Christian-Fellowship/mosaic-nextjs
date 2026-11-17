import { describe, expect, it } from 'vitest'
import { EDGE, clampPosition, loadPosition, savePosition } from '@/components/feedback/position'

const size = { width: 200, height: 44 }
const viewport = { width: 390, height: 664 }

function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
    clear: () => data.clear(),
    key: () => null,
    get length() {
      return data.size
    },
  }
}

const blocked = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
} as unknown as Storage

describe('clampPosition', () => {
  it('leaves an on-screen position alone', () => {
    expect(clampPosition({ x: 100, y: 300 }, size, viewport)).toEqual({ x: 100, y: 300 })
  })

  it('pulls a position back inside every edge', () => {
    expect(clampPosition({ x: -50, y: -50 }, size, viewport)).toEqual({ x: EDGE, y: EDGE })
    expect(clampPosition({ x: 999, y: 999 }, size, viewport)).toEqual({ x: 390 - 200 - EDGE, y: 664 - 44 - EDGE })
  })

  it('pins to the top-left edge when the button is wider than the viewport', () => {
    expect(clampPosition({ x: 50, y: 50 }, { width: 500, height: 44 }, viewport).x).toBe(EDGE)
  })
})

describe('position storage', () => {
  it('round-trips a saved position', () => {
    const store = memoryStorage()
    savePosition({ x: 12, y: 340 }, store)
    expect(loadPosition(store)).toEqual({ x: 12, y: 340 })
  })

  it('ignores missing or malformed values', () => {
    const store = memoryStorage()
    expect(loadPosition(store)).toBeNull()
    store.setItem('feedback-launcher-position', '{"x":"left"}')
    expect(loadPosition(store)).toBeNull()
  })

  it('survives a blocked localStorage', () => {
    expect(loadPosition(blocked)).toBeNull()
    expect(() => savePosition({ x: 1, y: 1 }, blocked)).not.toThrow()
  })
})
