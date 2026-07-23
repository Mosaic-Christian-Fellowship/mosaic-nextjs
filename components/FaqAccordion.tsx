'use client'

import { useState, type ReactNode } from 'react'

interface FaqItem {
  q: string
  /** A plain string is wrapped in a paragraph; pass JSX for links or lists. */
  a: ReactNode
}

interface Props {
  items: FaqItem[]
  /**
   * 'plus' — blue + that rotates into an x (default, used on /im-new).
   * 'arrow' — down arrow that flips on open, on darker rules; matches the
   * panel treatment on /mosaic-guide.
   */
  variant?: 'plus' | 'arrow'
  /** Unique per-instance prefix so aria ids stay unique if two render on one page. */
  idPrefix?: string
}

function ArrowDown({ className = '' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4v15m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FaqAccordion({ items, variant = 'plus', idPrefix = 'faq' }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isArrow = variant === 'arrow'

  return (
    <div className={`flex flex-col divide-y ${isArrow ? 'divide-[#1E2024]/25' : 'divide-[#E5E7EB]'}`}>
      {items.map(({ q, a }, i) => {
        const isOpen = openIndex === i
        return (
          <div key={q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`${idPrefix}-panel-${i}`}
              id={`${idPrefix}-trigger-${i}`}
              className="w-full flex justify-between items-center gap-4 py-5 text-left group"
            >
              <span
                className={
                  isArrow
                    ? 'text-lg md:text-xl text-[#1E2024] transition-opacity group-hover:opacity-70'
                    : 'font-bold text-lg text-[#1E2024]'
                }
              >
                {q}
              </span>
              {isArrow ? (
                <ArrowDown
                  className={`text-[#1E2024] shrink-0 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              ) : (
                <span
                  aria-hidden
                  className={`text-2xl text-[#0066FF] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              )}
            </button>
            <div
              id={`${idPrefix}-panel-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-trigger-${i}`}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pr-8 text-[#6B7280] leading-relaxed">
                  {typeof a === 'string' ? <p>{a}</p> : a}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
