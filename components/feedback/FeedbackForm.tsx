'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { ReviewerIdentity } from './identity'
import { useDraggable } from './useDraggable'

export interface Box {
  top: number
  left: number
  width: number
  height: number
}

export interface FeedbackValues {
  note: string
  name: string
  email: string
}

interface Props {
  /** The picked element's box when it was picked, used to place the form beside it. */
  anchor: Box
  /** Short description of what was picked, shown as a chip. */
  targetLabel: string
  wholePage: boolean
  identity: ReviewerIdentity | null
  sending: boolean
  error: string | null
  zIndex: number
  onSend: (values: FeedbackValues) => void
  onCancel: () => void
  onForgetMe: () => void
}

/** Below Tailwind's `sm`, the form is a bottom sheet until it's dragged. */
const SHEET_BREAKPOINT = 640
/** Space between the picked element and the form. */
const GAP = 12
/** Clears the site's fixed nav when scrolling a picked element into view. */
const NAV_CLEARANCE = 96

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]'
const field =
  'h-9 w-full min-w-0 rounded-lg border border-[#D4D4D8] bg-white px-3 text-sm text-[#18181B] placeholder:text-[#71717A] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563EB]'

/** Beside the element if there's room, otherwise below it, otherwise above it. */
function besideAnchor(anchor: Box, size: { width: number; height: number }, vw: number, vh: number) {
  const right = anchor.left + anchor.width + GAP
  if (right + size.width <= vw - GAP) return { x: right, y: anchor.top }
  const left = anchor.left - size.width - GAP
  if (left >= GAP) return { x: left, y: anchor.top }
  const below = anchor.top + anchor.height + GAP
  if (below + size.height <= vh - GAP) return { x: anchor.left, y: below }
  return { x: anchor.left, y: anchor.top - size.height - GAP }
}

function overlaps(a: DOMRect | Box & { right: number; bottom: number }, b: { left: number; top: number; right: number; bottom: number }) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

export default function FeedbackForm({
  anchor,
  targetLabel,
  wholePage,
  identity,
  sending,
  error,
  zIndex,
  onSend,
  onCancel,
  onForgetMe,
}: Props) {
  const [note, setNote] = useState('')
  const [name, setName] = useState(identity?.name ?? '')
  const [email, setEmail] = useState(identity?.email ?? '')
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const { ref, pos, place, dragging, handleProps } = useDraggable<HTMLFormElement>()

  // Place the form before first paint, then keep the picked element in view.
  useLayoutEffect(() => {
    const form = ref.current
    if (!form) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    let box: { left: number; top: number; right: number; bottom: number }
    if (vw < SHEET_BREAKPOINT) {
      box = form.getBoundingClientRect()
    } else if (wholePage) {
      const p = place({ x: vw - form.offsetWidth - 16, y: vh - form.offsetHeight - 16 })
      box = { left: p.x, top: p.y, right: p.x + form.offsetWidth, bottom: p.y + form.offsetHeight }
    } else {
      const p = place(besideAnchor(anchor, { width: form.offsetWidth, height: form.offsetHeight }, vw, vh))
      box = { left: p.x, top: p.y, right: p.x + form.offsetWidth, bottom: p.y + form.offsetHeight }
    }
    const target = { ...anchor, right: anchor.left + anchor.width, bottom: anchor.top + anchor.height }
    if (!wholePage && overlaps(target, box)) {
      window.scrollBy({ top: anchor.top - NAV_CLEARANCE, behavior: 'smooth' })
    }
    // preventScroll so focusing doesn't undo the scroll above.
    noteRef.current?.focus({ preventScroll: true })
    // Placement happens once, when the form opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function grow(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  const canSend = note.trim().length > 0 && !sending

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault()
        if (canSend) onSend({ note: note.trim(), name: name.trim(), email: email.trim() })
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !sending) onCancel()
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSend) e.currentTarget.requestSubmit()
      }}
      aria-labelledby="feedback-heading"
      className={`fixed flex max-h-[min(70svh,560px)] flex-col overflow-y-auto overscroll-contain rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm transition-[border-color] has-[textarea:focus]:border-[#71717A] shadow-[0_12px_40px_rgba(0,0,0,0.18)] motion-safe:animate-[feedback-in_160ms_ease-out] ${
        pos ? 'w-[min(420px,calc(100vw-16px))]' : 'inset-x-2 bottom-2 sm:inset-x-auto sm:w-[420px]'
      } ${dragging ? 'shadow-[0_20px_50px_rgba(0,0,0,0.25)]' : ''}`}
      style={{ zIndex, ...(pos ? { left: pos.x, top: pos.y } : {}) }}
    >
      <style>{'@keyframes feedback-in{from{opacity:0;transform:translateY(4px) scale(.98)}to{opacity:1;transform:none}}'}</style>
      <h2 id="feedback-heading" className="sr-only">
        Your comment
      </h2>

      <div className="flex items-center">
        <button
          type="button"
          aria-label="Move comment box"
          title="Drag to move"
          {...handleProps}
          className={`group flex h-6 flex-1 touch-none items-center justify-center rounded-t-2xl ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          } ${focusRing}`}
        >
          <span aria-hidden className="h-1 w-9 rounded-full bg-[#D4D4D8] transition-colors group-hover:bg-[#A1A1AA]" />
        </button>
      </div>

      <textarea
        ref={noteRef}
        value={note}
        onChange={(e) => {
          setNote(e.target.value)
          grow(e.target)
        }}
        aria-label="What would you change, or what works?"
        placeholder="What would you change, or what works?"
        rows={2}
        maxLength={4000}
        className="mx-4 resize-none bg-transparent text-[15px] leading-6 text-[#18181B] placeholder:text-[#A1A1AA]"
        // Inline, because the global :focus-visible ring in globals.css is unlayered and beats Tailwind classes.
        // The composer's border shows focus instead (has-[textarea:focus] on the form).
        style={{ outline: 'none' }}
      />

      {identity ? (
        <p className="mx-4 mt-2 text-xs text-[#52525B]">
          Sending as {identity.name}.{' '}
          <button type="button" onClick={onForgetMe} className={`cursor-pointer underline ${focusRing}`}>
            Not you?
          </button>
        </p>
      ) : (
        <div className="mx-4 mt-3 border-t border-[#E4E4E7] pt-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Your name"
              placeholder="Your name"
              autoComplete="name"
              maxLength={100}
              className={field}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Your email"
              placeholder="Your email"
              autoComplete="email"
              maxLength={200}
              className={field}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#52525B]">This browser will remember you, so you only enter this once.</p>
        </div>
      )}

      {error && (
        <p role="alert" className="mx-4 mt-2 rounded-lg bg-[#FEF2F2] px-3 py-2 text-[#B91C1C]">
          {error}
        </p>
      )}

      <div className="mt-2 flex items-center gap-2 px-3 pb-3">
        <span
          title={targetLabel}
          className="flex min-w-0 items-center gap-1.5 rounded-full bg-[#F4F4F5] px-2.5 py-1 text-xs text-[#52525B]"
        >
          <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            {wholePage ? <rect x="3" y="3" width="18" height="18" rx="2" /> : <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /></>}
          </svg>
          <span className="truncate">{targetLabel}</span>
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onCancel}
          disabled={sending}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] disabled:cursor-default disabled:opacity-50 ${focusRing}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSend}
          aria-label={sending ? 'Sending' : 'Send'}
          className={`flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#18181B] text-white transition-colors hover:bg-[#3F3F46] disabled:cursor-default disabled:bg-[#D4D4D8] ${focusRing}`}
        >
          {sending ? (
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.2-8.56" strokeLinecap="round" />
            </svg>
          ) : (
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}

/** A short, human label for a picked element: its text if it has any, else its tag. */
export function describeTarget(el: Element): string {
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text
  const alt = el.getAttribute('alt') || el.getAttribute('aria-label')
  return alt || `<${el.tagName.toLowerCase()}>`
}
