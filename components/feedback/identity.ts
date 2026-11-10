export interface ReviewerIdentity {
  name: string
  email: string
}

const KEY = 'feedback-reviewer'

// localStorage throws in some private windows and when site data is blocked.
// Every access is wrapped so a blocked store means "ask again", never a crash.

export function loadIdentity(storage?: Storage): ReviewerIdentity | null {
  try {
    const store = storage ?? window.localStorage
    const raw = store.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ReviewerIdentity>
    if (typeof parsed.name !== 'string' || typeof parsed.email !== 'string') return null
    if (!parsed.name.trim() || !parsed.email.trim()) return null
    return { name: parsed.name, email: parsed.email }
  } catch {
    return null
  }
}

/** Returns false when the browser would not store it. */
export function saveIdentity(identity: ReviewerIdentity, storage?: Storage): boolean {
  try {
    const store = storage ?? window.localStorage
    store.setItem(KEY, JSON.stringify(identity))
    return true
  } catch {
    return false
  }
}

export function clearIdentity(storage?: Storage): void {
  try {
    const store = storage ?? window.localStorage
    store.removeItem(KEY)
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
