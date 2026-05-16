'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatEventTime, type EventData } from '@/lib/api'
import { displayableLocation } from '@/lib/events'

type Layout = 'list' | 'grid'
type SortKey = 'date-asc' | 'date-desc' | 'name-asc'
type WindowFilter = 'all' | 'this-week' | 'this-month'

interface Props {
  events: EventData[]
}

const WINDOW_LABEL: Record<WindowFilter, string> = {
  all: 'All upcoming',
  'this-week': 'This week',
  'this-month': 'This month',
}

const SORT_LABEL: Record<SortKey, string> = {
  'date-asc': 'Soonest first',
  'date-desc': 'Latest first',
  'name-asc': 'Name (A–Z)',
}

function withinWindow(event: EventData, win: WindowFilter): boolean {
  if (win === 'all') return true
  const start = new Date(event.startsAt).getTime()
  const now = Date.now()
  if (win === 'this-week') return start - now <= 7 * 24 * 3600 * 1000
  if (win === 'this-month') return start - now <= 31 * 24 * 3600 * 1000
  return true
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export default function EventsBrowser({ events }: Props) {
  const [layout, setLayout] = useState<Layout>('list')
  const [search, setSearch] = useState('')
  const [windowFilter, setWindowFilter] = useState<WindowFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date-asc')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let result = events.filter((e) => withinWindow(e, windowFilter))
    if (q) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.summary?.toLowerCase().includes(q) ?? false) ||
          (e.location?.toLowerCase().includes(q) ?? false),
      )
    }
    result = [...result].sort((a, b) => {
      if (sortKey === 'name-asc') return a.name.localeCompare(b.name)
      const cmp = a.startsAt.localeCompare(b.startsAt)
      return sortKey === 'date-asc' ? cmp : -cmp
    })
    return result
  }, [events, search, windowFilter, sortKey])

  return (
    <section className="px-6 md:px-8 pb-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="flex-1 max-w-[320px] h-10 px-3 rounded-[10px] border border-[#E5E7EB] text-[14px] bg-white focus:outline-none focus:border-[#0066FF]"
            />
            <div className="flex items-center gap-1">
              {(Object.keys(WINDOW_LABEL) as WindowFilter[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWindowFilter(w)}
                  className={`h-10 px-3 text-[13px] font-semibold rounded-[10px] border transition-colors ${
                    windowFilter === w
                      ? 'bg-[#1E2024] text-white border-[#1E2024]'
                      : 'bg-white text-[#1E2024] border-[#E5E7EB] hover:border-[#D2D5DA]'
                  }`}
                >
                  {WINDOW_LABEL[w]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[13px] text-[#7F838A]">Sort</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-10 pl-3 pr-8 rounded-[10px] border border-[#E5E7EB] text-[13px] bg-white"
            >
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABEL[k]}
                </option>
              ))}
            </select>
            <div className="flex items-center rounded-[10px] border border-[#E5E7EB] bg-white p-1">
              <button
                onClick={() => setLayout('list')}
                aria-pressed={layout === 'list'}
                aria-label="List view"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  layout === 'list' ? 'bg-[#F5F5F7] text-[#1E2024]' : 'text-[#7F838A]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => setLayout('grid')}
                aria-pressed={layout === 'grid'}
                aria-label="Grid view"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  layout === 'grid' ? 'bg-[#F5F5F7] text-[#1E2024]' : 'text-[#7F838A]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 text-[13px] text-[#7F838A]">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F5F5F7] p-10 text-center">
            <p className="text-[15px] text-[#7F838A]">
              No events match your filters.
            </p>
          </div>
        ) : layout === 'list' ? (
          <ul className="flex flex-col divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
            {filtered.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function EventRow({ event }: { event: EventData }) {
  const date = new Date(event.startsAt)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const desc = event.summary || (event.description ? stripHtml(event.description) : '')

  return (
    <li>
      <Link
        href={`/events/${event.id}`}
        className="group flex items-center gap-5 py-5 transition-colors hover:bg-[#F5F5F7]/50 -mx-3 px-3 rounded-[8px]"
      >
        <div className="shrink-0 w-14 h-14 rounded-[10px] bg-[#0066FF]/8 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-[#0066FF]">{month}</span>
          <span className="text-[18px] font-bold text-[#1E2024] leading-none">{day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-semibold text-[#1E2024] group-hover:text-[#0066FF] transition-colors">
            {event.name}
          </h3>
          <p className="text-[13px] text-[#7F838A] mt-0.5">
            {formatDate(event.startsAt)}
            {!event.allDay && ` · ${formatEventTime(event.startsAt, event.endsAt)}`}
            {event.recurrenceDescription && ` · ${event.recurrenceDescription}`}
          </p>
          {desc && (
            <p className="text-[13px] text-[#4B4F56] mt-1 line-clamp-1">{desc}</p>
          )}
        </div>
        {(() => {
          const loc = displayableLocation(event.location)
          return (
            loc && (
              <p className="hidden lg:block text-[13px] text-[#7F838A] max-w-[280px] truncate">
                {loc}
              </p>
            )
          )
        })()}
        <span aria-hidden className="text-[#7F838A] group-hover:text-[#0066FF] transition-colors shrink-0">
          →
        </span>
      </Link>
    </li>
  )
}

function EventCard({ event }: { event: EventData }) {
  const date = new Date(event.startsAt)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const desc = event.summary || (event.description ? stripHtml(event.description) : '')

  return (
    <li>
      <Link
        href={`/events/${event.id}`}
        className="group flex flex-col h-full rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden transition-colors hover:border-[#0066FF]/40"
      >
        <div className="relative aspect-[5/3] bg-[#F5F5F7]">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #0066FF 0%, #0041A2 100%)' }}
            />
          )}
          <div className="absolute top-3 left-3 w-12 h-12 rounded-[10px] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-[#0066FF]">{month}</span>
            <span className="text-[16px] font-bold text-[#1E2024] leading-none">{day}</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-1 p-4">
          <h3 className="text-[16px] font-semibold leading-[1.3] text-[#1E2024] group-hover:text-[#0066FF] transition-colors line-clamp-2">
            {event.name}
          </h3>
          <p className="text-[12px] text-[#7F838A]">
            {formatDate(event.startsAt)}
            {!event.allDay && ` · ${formatEventTime(event.startsAt, event.endsAt)}`}
          </p>
          {desc && (
            <p className="text-[13px] text-[#4B4F56] mt-1 line-clamp-2">{desc}</p>
          )}
        </div>
      </Link>
    </li>
  )
}
