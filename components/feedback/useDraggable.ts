'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { clampPosition, type LauncherPosition } from './position'

/** Arrow-key step when moving with the keyboard; Shift moves four times as far. */
const KEY_STEP = 16

/**
 * Makes a fixed-position element movable by a handle: pointer drag (mouse,
 * pen, touch) and arrow keys. `pos` is the element's top-left corner in
 * viewport pixels, or null while it sits at its CSS default. Positions are
 * always clamped inside the viewport, including after a resize.
 */
export function useDraggable<T extends HTMLElement>(onDrop?: (pos: LauncherPosition) => void) {
  const ref = useRef<T>(null)
  const [pos, setPos] = useState<LauncherPosition | null>(null)
  const [dragging, setDragging] = useState(false)
  const offset = useRef<{ dx: number; dy: number } | null>(null)
  const last = useRef<LauncherPosition | null>(null)

  const clamp = useCallback((p: LauncherPosition) => {
    const el = ref.current
    const size = el ? { width: el.offsetWidth, height: el.offsetHeight } : { width: 0, height: 0 }
    return clampPosition(p, size, { width: window.innerWidth, height: window.innerHeight })
  }, [])

  /** Moves the element, clamped to the viewport, and returns where it landed. */
  const place = useCallback(
    (p: LauncherPosition) => {
      const next = clamp(p)
      last.current = next
      setPos(next)
      return next
    },
    [clamp],
  )

  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clamp(p) : p))
    const frame = requestAnimationFrame(onResize)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [clamp])

  const handleProps = {
    onPointerDown(e: React.PointerEvent<HTMLElement>) {
      if (e.button !== 0) return
      const box = ref.current?.getBoundingClientRect()
      if (!box) return
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      offset.current = { dx: e.clientX - box.left, dy: e.clientY - box.top }
      setDragging(true)
    },
    onPointerMove(e: React.PointerEvent<HTMLElement>) {
      if (!offset.current) return
      place({ x: e.clientX - offset.current.dx, y: e.clientY - offset.current.dy })
    },
    onPointerUp(e: React.PointerEvent<HTMLElement>) {
      if (!offset.current) return
      offset.current = null
      setDragging(false)
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
      // The last clamped position, not the on-screen box, which may still be scaled up from the drag.
      if (last.current) onDrop?.(last.current)
    },
    onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
      const step = e.shiftKey ? KEY_STEP * 4 : KEY_STEP
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }
      const move = moves[e.key]
      const box = ref.current?.getBoundingClientRect()
      if (!move || !box) return
      e.preventDefault()
      onDrop?.(place({ x: box.left + move[0], y: box.top + move[1] }))
    },
  }

  return { ref, pos, setPos, place, dragging, handleProps: { ...handleProps, onPointerCancel: handleProps.onPointerUp } }
}
