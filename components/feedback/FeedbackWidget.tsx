'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { captureViewport } from './capture'
import { WIDGET_ATTR } from './config'
import FeedbackForm, { describeTarget, type Box, type FeedbackValues } from './FeedbackForm'
import FeedbackPins, { type Pin } from './FeedbackPins'
import { clearIdentity, loadIdentity, saveIdentity, type ReviewerIdentity } from './identity'
import { loadPosition, savePosition } from './position'
import { buildSelector } from './selector'
import { useDraggable } from './useDraggable'

type Mode = 'idle' | 'picking' | 'form' | 'sending' | 'sent'

interface Target {
  el: Element
  selector: string
  label: string
  wholePage: boolean
}

const Z = 2147483000
const widgetProps = { [WIDGET_ATTR]: '' }

function boxOf(el: Element): Box {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function insideWidget(el: Element | null): boolean {
  return !!el?.closest(`[${WIDGET_ATTR}]`)
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]'

/**
 * Preview-only review tool: pick an element, write a note, and it becomes a
 * GitHub issue with a screenshot. Mounted only on the review branch's preview.
 */
export default function FeedbackWidget() {
  const pathname = usePathname() || '/'
  const [mode, setMode] = useState<Mode>('idle')
  const [hover, setHover] = useState<Box | null>(null)
  const [target, setTarget] = useState<Target | null>(null)
  const [anchor, setAnchor] = useState<Box | null>(null)
  const [targetBox, setTargetBox] = useState<Box | null>(null)
  const [identity, setIdentity] = useState<ReviewerIdentity | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pins, setPins] = useState<Pin[]>([])

  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickBarRef = useRef<HTMLDivElement>(null)
  const {
    ref: launcherRef,
    pos,
    setPos: setLauncherPos,
    dragging: launcherDragging,
    handleProps: launcherHandle,
  } = useDraggable<HTMLDivElement>(savePosition)

  useEffect(() => {
    // localStorage is only readable after mount; reading it during render would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdentity(loadIdentity())
    setLauncherPos(loadPosition())
  }, [setLauncherPos])

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

  const select = useCallback((el: Element, wholePage = false) => {
    const box = boxOf(el)
    setTarget({ el, selector: buildSelector(el), label: wholePage ? 'Whole page' : describeTarget(el), wholePage })
    setAnchor(box)
    setTargetBox(box)
    setHover(null)
    setError(null)
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
    if (!target || target.wholePage || (mode !== 'form' && mode !== 'sending')) return
    const update = () => setTargetBox(boxOf(target.el))
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [target, mode])

  useEffect(() => {
    if (mode !== 'sent') return
    const t = window.setTimeout(() => setMode('idle'), 3000)
    return () => window.clearTimeout(t)
  }, [mode])

  async function send({ note, name, email }: FeedbackValues) {
    if (!target) return
    const who = identity ?? { name, email }
    if (!who.name || !who.email) return setError("Add your name and email so we know who it's from.")

    setError(null)
    setMode('sending')
    const image = await captureViewport(boxOf(target.el))

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          note,
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
        setPins((prev) => [...prev, { number: json.number!, title: note, note, selector: target.selector }])
      }
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
    setIdentity(null)
  }

  const formOpen = (mode === 'form' || mode === 'sending') && target && anchor

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
      {formOpen && !target.wholePage && targetBox && (
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
                onClick={() => select(document.querySelector('main') ?? document.body, true)}
                className={`cursor-pointer rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25 ${focusRing}`}
              >
                Comment on the whole page
              </button>
              <button
                type="button"
                onClick={close}
                className={`cursor-pointer rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25 ${focusRing}`}
              >
                Cancel
              </button>
            </span>
          </div>
        )}

        {formOpen && (
          <FeedbackForm
            key={target.selector}
            anchor={anchor}
            targetLabel={target.label}
            wholePage={target.wholePage}
            identity={identity}
            sending={mode === 'sending'}
            error={error}
            zIndex={Z}
            onSend={send}
            onCancel={close}
            onForgetMe={forgetMe}
          />
        )}

        {!formOpen && mode !== 'picking' && (
          <div
            ref={launcherRef}
            className={`fixed flex items-stretch rounded-full bg-[#18181B] text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
              pos ? '' : 'bottom-4 right-4'
            } ${launcherDragging ? 'scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : ''} transition-[scale,box-shadow] duration-150`}
            style={{ zIndex: Z, ...(pos ? { left: pos.x, top: pos.y } : {}) }}
          >
            {mode === 'sent' && (
              <p
                role="status"
                className={`absolute right-0 whitespace-nowrap rounded-md bg-[#18181B] px-3 py-2 text-sm text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                  pos && pos.y < 64 ? 'top-full mt-2' : 'bottom-full mb-2'
                }`}
              >
                Thanks! Your comment was sent.
              </p>
            )}
            <button
              type="button"
              aria-label="Move comment button"
              title="Drag to move"
              {...launcherHandle}
              className={`group flex min-h-11 w-9 touch-none items-center justify-center rounded-l-full border-r border-white/15 pl-1.5 ${
                launcherDragging ? 'cursor-grabbing' : 'cursor-grab'
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
              className={`min-h-11 cursor-pointer rounded-r-full py-2.5 pl-3 pr-5 text-sm font-semibold hover:bg-[#3F3F46] ${focusRing}`}
            >
              Leave a comment
            </button>
          </div>
        )}
      </div>
    </>
  )
}
