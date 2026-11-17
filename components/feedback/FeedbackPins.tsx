'use client'

import { useEffect, useState } from 'react'
import { findBySelector } from './selector'

export interface Pin {
  number: number
  title: string
  note: string
  selector: string | null
}

interface Placed {
  pin: Pin
  top: number
  left: number
}

function place(pins: Pin[]): Placed[] {
  const placed: Placed[] = []
  for (const pin of pins) {
    if (!pin.selector) continue
    const el = findBySelector(document, pin.selector)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) continue
    placed.push({
      pin,
      top: Math.max(4, rect.top - 10),
      left: Math.min(window.innerWidth - 32, Math.max(4, rect.right - 18)),
    })
  }
  return placed
}

/** Numbered markers on elements that already have open comments. */
export default function FeedbackPins({ pins }: { pins: Pin[] }) {
  const [placed, setPlaced] = useState<Placed[]>([])
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setPlaced(place(pins)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    // Catches layout shifts from images and fonts loading after the first pass.
    const timer = window.setInterval(update, 1500)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.clearInterval(timer)
    }
  }, [pins])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {placed.map(({ pin, top, left }, i) => {
        const isOpen = open === pin.number
        return (
          <div key={pin.number} className="fixed" style={{ top, left, zIndex: 2147483000 }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : pin.number)}
              aria-expanded={isOpen}
              aria-label={`Comment ${i + 1}: ${pin.title}`}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#E5484D] font-sans text-xs font-bold text-white shadow-[0_1px_4px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
            >
              {i + 1}
            </button>
            {isOpen && (
              <div
                role="dialog"
                aria-label={`Comment ${i + 1}`}
                style={left < 300 ? { left: 0 } : { right: 0 }}
                className="absolute top-9 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-[#D4D4D8] bg-white p-3 font-sans text-sm text-[#18181B] shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
              >
                <p className="whitespace-pre-wrap break-words">{pin.note || pin.title}</p>
                <p className="mt-2 text-xs text-[#52525B]">Open comment #{pin.number}</p>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
