'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  panel: ReactNode
}

interface MessageTabsProps {
  tabs: Tab[]
  defaultId?: string
}

export default function MessageTabs({ tabs, defaultId }: MessageTabsProps) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0]?.id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeIndex = tabs.findIndex((t) => t.id === activeId)

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length
    setActiveId(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusTab(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusTab(index - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusTab(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusTab(tabs.length - 1)
    }
  }

  return (
    <div className="flex flex-col gap-12">
      <div
        role="tablist"
        aria-label="Message format"
        className="self-center inline-flex items-center gap-1 p-1 rounded-full bg-[#F5F7FA]"
      >
        {tabs.map((tab, i) => {
          const selected = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[i] = el }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={[
                'px-5 py-2.5 min-h-11 rounded-full text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2',
                'motion-reduce:transition-none',
                selected
                  ? 'bg-[#0066FF] text-white'
                  : 'text-[#6B7280] hover:text-[#1E2024]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={i !== activeIndex}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}
