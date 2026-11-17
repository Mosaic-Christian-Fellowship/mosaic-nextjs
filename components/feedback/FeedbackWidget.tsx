'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { captureViewport } from './capture'
import { WIDGET_ATTR } from './config'
import FeedbackPins, { type Pin } from './FeedbackPins'
import { clearIdentity, loadIdentity, saveIdentity, type ReviewerIdentity } from './identity'
import { clampPosition, loadPosition, savePosition, type LauncherPosition } from './position'
import { buildSelector } from './selector'

type Mode = 'idle' | 'picking' | 'form' | 'sending' | 'sent'

interface Box {
  top: number
  left: number
  width: number
  height: number
}

const Z = 2147483000
const widgetProps = { [WIDGET_ATTR]: '' }

/** Clears the site's fixed nav when scrolling a picked element into view on phones. */
const NAV_CLEARANCE = 96
/** Arrow-key step for moving the launcher; Shift moves four times as far. */
const KEY_STEP = 16

function boxOf(el: Element): Box {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function insideWidget(el: Element | null): boolean {
  return !!el?.closest(`[${WIDGET_ATTR}]`)
}

const field =
  'w-full rounded-md border border-[#A1A1AA] bg-white px-3 py-2 text-base text-[#18181B] placeholder:text-[#71717A] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563EB]'
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]'

/**
 * Preview-only review tool: pick an element, write a note, and it becomes a
 * GitHub issue with a screenshot. Mounted only on preview deploys.
 */
export default function FeedbackWidget() {
  const pathname = usePathname() || '/'
  const [mode, setMode] = useState<Mode>('idle')
  const [hover, setHover] = useState<Box | null>(null)
  const [target, setTarget] = useState<{ el: Element; selector: string } | null>(null)
  const [targetBox, setTargetBox] = useState<Box | null>(null)
  const [identity, setIdentity] = useState<ReviewerIdentity | null>(null)
  const [note, setNote] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [launcherPos, setLauncherPos] = useState<LauncherPosition | null>(null)
  const [dragging, setDragging] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const launcherRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null)
  const lastPos = useRef<LauncherPosition | null>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const pickBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // localStorage is only readable after mount; reading it during render would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdentity(loadIdentity())
    setLauncherPos(loadPosition())
  }, [])

  const clampToViewport = useCallback((pos: LauncherPosition) => {
    const el = launcherRef.current
    const size = el ? { width: el.offsetWidth, height: el.offsetHeight } : { width: 0, height: 0 }
    return clampPosition(pos, size, { width: window.innerWidth, height: window.innerHeight })
  }, [])

  const placeLauncher = useCallback(
    (pos: LauncherPosition) => {
      const next = clampToViewport(pos)
      lastPos.current = next
      setLauncherPos(next)
      return next
    },
    [clampToViewport],
  )

  // A saved position from a wider screen, or a rotated phone, can leave the button off screen.
  useEffect(() => {
    const onResize = () => setLauncherPos((p) => (p ? clampToViewport(p) : p))
    const frame = requestAnimationFrame(onResize)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [clampToViewport])

  function onHandlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const box = launcherRef.current?.getBoundingClientRect()
    if (!box) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragOffset.current = { dx: e.clientX - box.left, dy: e.clientY - box.top }
    setDragging(true)
  }

  function onHandlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragOffset.current) return
    placeLauncher({ x: e.clientX - dragOffset.current.dx, y: e.clientY - dragOffset.current.dy })
  }

  function onHandlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragOffset.current) return
    dragOffset.current = null
    setDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
    // Save the last clamped position, not the on-screen box, which is still scaled up from the drag.
    if (lastPos.current) savePosition(lastPos.current)
  }

  function onHandleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const step = e.shiftKey ? KEY_STEP * 4 : KEY_STEP
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const move = moves[e.key]
    const box = launcherRef.current?.getBoundingClientRect()
    if (!move || !box) return
    e.preventDefault()
    savePosition(placeLauncher({ x: box.left + move[0], y: box.top + move[1] }))
  }

  useEffect(() => {
    let cancelled = false
    fetch(`/api/feedback?path=${encodeURIComponent(pathname)}`)
      .then((res) => (res.ok ? (res.json() as Promise<{ data?: Pin[] }>) : { data: [] }))
      .then((json) => {
        if (!cancelled) setPins(json.data ?? [])
      })
      // Pins are a convenience; a failed fetch just means none are shown.
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [pathname])

  const close = useCallback(() => {
    setMode('idle')
    setHover(null)
    setTarget(null)
    setTargetBox(null)
    setError(null)
    requestAnimationFrame(() => buttonRef.current?.focus())
  }, [])

  const select = useCallback((el: Element) => {
    setTarget({ el, selector: buildSelector(el) })
    setTargetBox(boxOf(el))
    setHover(null)
    setMode('form')
  }, [])

  // Picking: outline what's under the pointer, take the next click or tap.
  useEffect(() => {
    if (mode !== 'picking') return
    const prevCursor = document.body.style.cursor
    document.body.style.cursor = 'crosshair'
    pickBarRef.current?.querySelector('button')?.focus()

    const onMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      setHover(el && !insideWidget(el) ? boxOf(el) : null)
    }
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target : null
      if (!el || insideWidget(el)) return
      e.preventDefault()
      e.stopPropagation()
      select(el)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    const onScroll = () => setHover(null)

    document.addEventListener('pointermove', onMove, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.body.style.cursor = prevCursor
      document.removeEventListener('pointermove', onMove, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKey, true)
      window.removeEventListener('scroll', onScroll)
    }
  }, [mode, select, close])

  // While the form is open, keep the selected element outlined as the page scrolls.
  useEffect(() => {
    if (!target || (mode !== 'form' && mode !== 'sending')) return
    const update = () => setTargetBox(boxOf(target.el))
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [target, mode])

  useEffect(() => {
    // preventScroll so focusing doesn't undo the scroll below.
    if (mode === 'form') noteRef.current?.focus({ preventScroll: true })
  }, [mode])

  // If the open form covers the picked element, scroll the element up to just under the site nav.
  useEffect(() => {
    if (mode !== 'form' || !target) return
    const form = formRef.current?.getBoundingClientRect()
    const t = target.el.getBoundingClientRect()
    if (!form) return
    const overlaps = t.left < form.right && t.right > form.left && t.top < form.bottom && t.bottom > form.top
    if (overlaps) window.scrollBy({ top: t.top - NAV_CLEARANCE, behavior: 'smooth' })
  }, [mode, target])

  useEffect(() => {
    if (mode !== 'sent') return
    const t = window.setTimeout(() => setMode('idle'), 3000)
    return () => window.clearTimeout(t)
  }, [mode])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!target) return
    const who = identity ?? { name: name.trim(), email: email.trim() }
    if (!note.trim()) return setError('Write a comment before sending.')
    if (!who.name || !who.email) return setError("Add your name and email so we know who it's from.")

    setError(null)
    setMode('sending')
    const image = await captureViewport(boxOf(target.el))

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          note: note.trim(),
          name: who.name,
          email: who.email,
          path: pathname,
          pageUrl: window.location.href,
          selector: target.selector,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          userAgent: navigator.userAgent,
          image,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string; number?: number }
      if (!res.ok) {
        setError(json.error ?? `Something went wrong (${res.status}). Please try again.`)
        setMode('form')
        return
      }
      if (!identity) {
        saveIdentity(who)
        setIdentity(who)
      }
      if (json.number) {
        setPins((prev) => [...prev, { number: json.number!, title: note.trim(), note: note.trim(), selector: target.selector }])
      }
      setNote('')
      setTarget(null)
      setTargetBox(null)
      setMode('sent')
      requestAnimationFrame(() => buttonRef.current?.focus())
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
      setMode('form')
    }
  }

  function forgetMe() {
    clearIdentity()
    setName(identity?.name ?? '')
    setEmail(identity?.email ?? '')
    setIdentity(null)
  }

  const formOpen = mode === 'form' || mode === 'sending'

  return (
    <>
      {/* The screenshot leaves out fixed elements, so capture.ts draws its own outline instead of these. */}
      {mode === 'picking' && hover && (
        <div
          {...widgetProps}
          aria-hidden
          className="pointer-events-none fixed rounded-sm outline outline-2 outline-offset-2 outline-[#2563EB] bg-[#2563EB]/10"
          style={{ ...hover, zIndex: Z - 1 }}
        />
      )}
      {formOpen && targetBox && (
        <div
          {...widgetProps}
          aria-hidden
          className="pointer-events-none fixed rounded-sm outline outline-[3px] outline-offset-2 outline-[#E5484D]"
          style={{ ...targetBox, zIndex: Z - 1 }}
        />
      )}

      <div {...widgetProps} className="font-sans text-[#18181B]">
        <FeedbackPins pins={pins} />

        {mode === 'picking' && (
          <div
            ref={pickBarRef}
            role="status"
            className="fixed inset-x-4 top-4 mx-auto flex max-w-md flex-wrap items-center justify-between gap-2 rounded-lg bg-[#18181B] px-4 py-3 text-sm text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            style={{ zIndex: Z }}
          >
            <span>Click or tap what you want to comment on</span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => select(document.querySelector('main') ?? document.body)}
                className={`rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25 ${focusRing}`}
              >
                Comment on the whole page
              </button>
              <button
                type="button"
                onClick={close}
                className={`rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25 ${focusRing}`}
              >
                Cancel
              </button>
            </span>
          </div>
        )}

        {formOpen && (
          <form
            ref={formRef}
            onSubmit={send}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && mode === 'form') close()
            }}
            aria-labelledby="feedback-heading"
            className="fixed inset-x-4 bottom-4 flex max-h-[55svh] flex-col gap-3 overflow-y-auto overscroll-contain rounded-xl border border-[#D4D4D8] bg-white p-4 text-sm shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:left-auto sm:right-4 sm:max-h-[calc(100svh-2rem)] sm:w-96"
            style={{ zIndex: Z }}
          >
            <h2 id="feedback-heading" className="text-base font-semibold">
              Your comment
            </h2>
            <label className="flex flex-col gap-1">
              <span className="font-medium">What would you change, or what works?</span>
              <textarea
                ref={noteRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                maxLength={4000}
                required
                className={field}
              />
            </label>

            {identity ? (
              <p className="text-[#52525B]">
                Sending as {identity.name}.{' '}
                <button type="button" onClick={forgetMe} className={`underline ${focusRing}`}>
                  Not you?
                </button>
              </p>
            ) : (
              <>
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Your name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={100} className={field} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Your email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    maxLength={200}
                    className={field}
                  />
                </label>
                <p className="text-xs text-[#52525B]">This browser will remember you, so you only enter this once.</p>
              </>
            )}

            {error && (
              <p role="alert" className="rounded-md bg-[#FEF2F2] px-3 py-2 text-[#B91C1C]">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                disabled={mode === 'sending'}
                className={`rounded-md px-4 py-2 font-medium text-[#3F3F46] hover:bg-[#F4F4F5] disabled:opacity-50 ${focusRing}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mode === 'sending'}
                className={`rounded-md bg-[#18181B] px-4 py-2 font-medium text-white hover:bg-[#3F3F46] disabled:opacity-60 ${focusRing}`}
              >
                {mode === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        )}

        {!formOpen && mode !== 'picking' && (
          <div
            ref={launcherRef}
            className={`fixed flex items-stretch rounded-full bg-[#18181B] text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
              launcherPos ? '' : 'bottom-4 right-4'
            } ${dragging ? 'scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : ''} transition-[scale,box-shadow] duration-150`}
            style={{ zIndex: Z, ...(launcherPos ? { left: launcherPos.x, top: launcherPos.y } : {}) }}
          >
            {mode === 'sent' && (
              <p
                role="status"
                className={`absolute right-0 whitespace-nowrap rounded-md bg-[#18181B] px-3 py-2 text-sm text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                  launcherPos && launcherPos.y < 64 ? 'top-full mt-2' : 'bottom-full mb-2'
                }`}
              >
                Thanks! Your comment was sent.
              </p>
            )}
            <button
              type="button"
              aria-label="Move comment button"
              title="Drag to move"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              onKeyDown={onHandleKeyDown}
              className={`group flex min-h-11 w-9 touch-none items-center justify-center rounded-l-full border-r border-white/15 pl-1.5 ${
                dragging ? 'cursor-grabbing' : 'cursor-grab'
              } hover:bg-white/10 ${focusRing}`}
            >
              <svg aria-hidden width="10" height="16" viewBox="0 0 10 16" className="fill-[#A1A1AA] group-hover:fill-white">
                {[2, 8, 14].map((cy) => (
                  <g key={cy}>
                    <circle cx="2" cy={cy} r="1.5" />
                    <circle cx="8" cy={cy} r="1.5" />
                  </g>
                ))}
              </svg>
            </button>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => {
                setError(null)
                setMode('picking')
              }}
              className={`min-h-11 rounded-r-full py-2.5 pl-3 pr-5 text-sm font-semibold hover:bg-[#3F3F46] ${focusRing}`}
            >
              Leave a comment
            </button>
          </div>
        )}
      </div>
    </>
  )
}
