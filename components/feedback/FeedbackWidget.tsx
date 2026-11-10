'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { captureViewport } from './capture'
import { WIDGET_ATTR } from './config'
import FeedbackPins, { type Pin } from './FeedbackPins'
import { clearIdentity, loadIdentity, saveIdentity, type ReviewerIdentity } from './identity'
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

  const buttonRef = useRef<HTMLButtonElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const pickBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // localStorage is only readable after mount; reading it during render would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdentity(loadIdentity())
  }, [])

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
    if (mode === 'form') noteRef.current?.focus()
  }, [mode])

  useEffect(() => {
    if (mode !== 'sent') return
    const t = window.setTimeout(() => setMode('idle'), 3000)
    return () => window.clearTimeout(t)
  }, [mode])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!target) return
    const who = identity ?? { name: name.trim(), email: email.trim() }
    if (!note.trim()) return setError('Please write a note.')
    if (!who.name || !who.email) return setError('Please add your name and email.')

    setError(null)
    setMode('sending')
    const image = await captureViewport()

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
      {/* Outlines sit outside the widget root on purpose: the selected outline shows in the screenshot. */}
      {mode === 'picking' && hover && (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-sm outline outline-2 outline-offset-2 outline-[#2563EB] bg-[#2563EB]/10"
          style={{ ...hover, zIndex: Z - 1 }}
        />
      )}
      {formOpen && targetBox && (
        <div
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
            <span>Click the part of the page you mean</span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => select(document.querySelector('main') ?? document.body)}
                className={`rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25 ${focusRing}`}
              >
                Whole page
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
            onSubmit={send}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && mode === 'form') close()
            }}
            aria-labelledby="feedback-heading"
            className="fixed inset-x-4 bottom-4 flex flex-col gap-3 rounded-xl border border-[#D4D4D8] bg-white p-4 text-sm shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:left-auto sm:right-4 sm:w-96"
            style={{ zIndex: Z }}
          >
            <h2 id="feedback-heading" className="text-base font-semibold">
              Leave feedback
            </h2>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Your note</span>
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
                <p className="text-xs text-[#52525B]">Asked once. This browser remembers it.</p>
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
          <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2" style={{ zIndex: Z }}>
            {mode === 'sent' && (
              <p role="status" className="rounded-md bg-[#18181B] px-3 py-2 text-sm text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                Sent — thanks
              </p>
            )}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => {
                setError(null)
                setMode('picking')
              }}
              className={`min-h-11 rounded-full bg-[#18181B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-[#3F3F46] ${focusRing}`}
            >
              Feedback
            </button>
          </div>
        )}
      </div>
    </>
  )
}
