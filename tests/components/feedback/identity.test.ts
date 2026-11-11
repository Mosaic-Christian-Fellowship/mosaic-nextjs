import { describe, it, expect } from 'vitest'
import { clearIdentity, loadIdentity, saveIdentity } from '@/components/feedback/identity'

function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => Array.from(data.keys())[i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  }
}

/** Mimics Safari private mode or blocked site data: every call throws. */
function blockedStorage(): Storage {
  const fail = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError')
  }
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail }
}

describe('reviewer identity', () => {
  it('round-trips name and email', () => {
    const store = memoryStorage()
    expect(saveIdentity({ name: 'Grace', email: 'grace@example.com' }, store)).toBe(true)
    expect(loadIdentity(store)).toEqual({ name: 'Grace', email: 'grace@example.com' })
  })

  it('returns null when nothing is saved', () => {
    expect(loadIdentity(memoryStorage())).toBeNull()
  })

  it('returns null for corrupted or incomplete data', () => {
    const store = memoryStorage()
    store.setItem('feedback-reviewer', '{not json')
    expect(loadIdentity(store)).toBeNull()
    store.setItem('feedback-reviewer', JSON.stringify({ name: 'Grace', email: '' }))
    expect(loadIdentity(store)).toBeNull()
  })

  it('does not throw when storage is blocked', () => {
    const store = blockedStorage()
    expect(loadIdentity(store)).toBeNull()
    expect(saveIdentity({ name: 'Grace', email: 'grace@example.com' }, store)).toBe(false)
    expect(() => clearIdentity(store)).not.toThrow()
  })

  it('does not throw when there is no window at all', () => {
    expect(loadIdentity()).toBeNull()
    expect(saveIdentity({ name: 'Grace', email: 'grace@example.com' })).toBe(false)
  })

  it('clears a saved identity', () => {
    const store = memoryStorage()
    saveIdentity({ name: 'Grace', email: 'grace@example.com' }, store)
    clearIdentity(store)
    expect(loadIdentity(store)).toBeNull()
  })
})
