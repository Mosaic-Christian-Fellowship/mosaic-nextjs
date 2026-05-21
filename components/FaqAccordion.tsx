'use client'

import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

interface Props {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-[#E5E7EB]">
      {items.map(({ q, a }, i) => {
        const isOpen = openIndex === i
        return (
          <div key={q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex justify-between items-center gap-4 py-5 text-left group"
            >
              <span className="font-bold text-lg text-[#1E2024]">{q}</span>
              <span
                aria-hidden
                className={`text-2xl text-[#0066FF] shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : ''
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-8 text-[#7F838A]">{a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
