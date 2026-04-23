'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch, formatDate, formatEventTime, type EventData } from '@/lib/api'

interface Props {
  limit?: number
  layout?: 'list' | 'featured' | 'tiles' | 'bento'
}

function EventTile({ event, size = 'default' }: { event: EventData; size?: 'default' | 'large' | 'stacked' | 'small' }) {
  const date = new Date(event.startsAt)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  const aspectClass = size === 'large' ? 'h-full min-h-[400px]'
    : size === 'stacked' ? 'flex-1 min-h-[192px]'
    : size === 'small' ? 'aspect-[4/3]'
    : 'aspect-[3/4]'

  return (
    <div className={`${aspectClass} rounded-2xl bg-[#1E2024] relative overflow-hidden flex flex-col justify-between p-6`}>
      {/* Background visual placeholder */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E2024] via-[#1E2024]/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-slate-300/20" />

      {/* Date badge */}
      <div className="relative z-[2]">
        <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-[#0066FF]">{month}</span>
          <span className="text-lg font-bold text-white">{day}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[2]">
        <h3 className={`${size === 'large' ? 'text-xl' : 'text-lg'} font-bold text-white leading-snug`}>{event.name}</h3>
        <p className="text-sm text-white/60 mt-1">
          {formatDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}
        </p>
        {event.summary && size !== 'small' && (
          <p className="text-sm text-white/50 mt-2 line-clamp-2">{event.summary}</p>
        )}
      </div>
    </div>
  )
}

function EventCard({ event, featured = false }: { event: EventData; featured?: boolean }) {
  const date = new Date(event.startsAt)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  if (featured) {
    return (
      <div className="flex flex-col justify-end p-8 rounded-2xl border border-[#E5E7EB] bg-[#1E2024] h-full min-h-[320px] relative overflow-hidden">
        <div className="absolute top-6 left-8">
          <div className="w-16 h-16 rounded-xl bg-white/10 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-[#0066FF]">{month}</span>
            <span className="text-xl font-bold text-white">{day}</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{event.name}</h3>
          <p className="text-sm text-white/60 mt-1">
            {formatDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}
          </p>
          {event.location && (
            <p className="text-sm text-white/50 mt-1">{event.location}</p>
          )}
          {event.summary && (
            <p className="text-sm text-white/70 mt-3 line-clamp-3">{event.summary}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 p-5 rounded-2xl border border-[#E5E7EB] bg-white h-full">
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#0066FF]/10 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-[#0066FF]">{month}</span>
        <span className="text-lg font-bold text-[#1E2024]">{day}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-[#1E2024]">{event.name}</h3>
        <p className="text-sm text-[#7F838A] mt-0.5">
          {formatDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}
        </p>
        {event.location && (
          <p className="text-sm text-[#7F838A] line-clamp-1">{event.location}</p>
        )}
      </div>
    </div>
  )
}

export default function EventsList({ limit, layout = 'list' }: Props) {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params: Record<string, string> = {}
    if (limit) params.limit = String(limit)

    apiFetch<EventData[]>('/api/events', params)
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) {
    const isBento = layout === 'bento'
    const isTiles = layout === 'tiles'
    return (
      <div className={(isBento || isTiles) ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-4'}>
        {Array.from({ length: (isBento || isTiles) ? 4 : (limit || 3) }).map((_, i) => (
          <div key={i} className={`animate-pulse rounded-2xl bg-slate-200 ${(isBento || isTiles) ? 'aspect-[3/4]' : 'h-24'}`} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return <p className="text-center text-[#7F838A] py-8">No upcoming events.</p>
  }

  if (layout === 'bento') {
    const topEvents = events.slice(0, 3)
    const bottomEvents = events.slice(3, 6)
    return (
      <div className="flex flex-col gap-4">
        {/* Top row: featured (3 cols) + 2 stacked (1 col) */}
        <div className="grid md:grid-cols-5 gap-4">
          {topEvents[0] && (
            <div className="md:col-span-3">
              <EventTile event={topEvents[0]} size="large" />
            </div>
          )}
          <div className="md:col-span-2 flex flex-col gap-4">
            {topEvents[1] && <EventTile event={topEvents[1]} size="stacked" />}
            {topEvents[2] && <EventTile event={topEvents[2]} size="stacked" />}
          </div>
        </div>
        {/* Bottom row: 3 events + CTA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bottomEvents.map((event) => (
            <EventTile key={event.id} event={event} size="small" />
          ))}
          <Link
            href="/connect"
            className="aspect-[4/3] rounded-2xl bg-[#1E2024] flex flex-col items-center justify-center gap-3 hover:bg-[#1E2024]/90 transition-colors group"
          >
            <span className="text-white font-semibold text-sm">Browse all events →</span>
          </Link>
        </div>
      </div>
    )
  }

  if (layout === 'tiles') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {events.slice(0, 3).map((event) => (
          <EventTile key={event.id} event={event} />
        ))}
        {/* "All Events" CTA tile */}
        <Link
          href="/connect"
          className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-4 hover:border-[#0066FF] hover:bg-[#0066FF]/5 transition-colors group"
        >
          <div className="w-14 h-14 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] text-2xl group-hover:bg-[#0066FF]/20 transition-colors">
            →
          </div>
          <span className="text-[#1E2024] font-semibold text-sm">All Upcoming Events</span>
        </Link>
      </div>
    )
  }

  if (layout === 'featured' && events.length >= 2) {
    const [first, ...rest] = events
    return (
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <EventCard event={first} featured />
        </div>
        <div className="md:col-span-2 flex flex-col gap-6">
          {rest.slice(0, 2).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
