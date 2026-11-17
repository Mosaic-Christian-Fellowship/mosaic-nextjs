/** Where the reviewer dragged the "Leave a comment" button, as its top-left corner in viewport pixels. */
export interface LauncherPosition {
  x: number
  y: number
}

const KEY = 'feedback-launcher-position'

/** Gap kept between the button and the viewport edge. */
export const EDGE = 8

/** Keeps the button fully on screen, e.g. after a resize or a rotate. */
export function clampPosition(
  pos: LauncherPosition,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
): LauncherPosition {
  const maxX = Math.max(EDGE, viewport.width - size.width - EDGE)
  const maxY = Math.max(EDGE, viewport.height - size.height - EDGE)
  return {
    x: Math.round(Math.min(Math.max(pos.x, EDGE), maxX)),
    y: Math.round(Math.min(Math.max(pos.y, EDGE), maxY)),
  }
}

// Same rule as identity.ts: a blocked localStorage means "use the default corner", never a crash.

export function loadPosition(storage?: Storage): LauncherPosition | null {
  try {
    const raw = (storage ?? window.localStorage).getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<LauncherPosition>
    if (!Number.isFinite(parsed.x) || !Number.isFinite(parsed.y)) return null
    return { x: parsed.x as number, y: parsed.y as number }
  } catch {
    return null
  }
}

export function savePosition(pos: LauncherPosition, storage?: Storage): void {
  try {
    ;(storage ?? window.localStorage).setItem(KEY, JSON.stringify(pos))
  } catch {
    // Not stored; the button returns to the default corner next visit.
  }
}
