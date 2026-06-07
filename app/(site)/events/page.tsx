import type { Metadata } from 'next'
import { kvGet } from '@/lib/kv'
import type { EventData } from '@/lib/api'
import PageHero from '@/components/PageHero'
import EventsBrowser from './EventsBrowser'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Everything happening at Mosaic in the weeks ahead. Filter by what fits your schedule and switch between list and grid views.',
}

async function getAllEvents(): Promise<EventData[]> {
  try {
    const all = await kvGet<EventData[]>('events:all')
    if (!all) return []
    const now = new Date().toISOString()
    return all
      .filter((e) => e.startsAt >= now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  } catch {
    return []
  }
}

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <div className="bg-white">
      <PageHero
        overline="What's Happening"
        title="All Upcoming Events"
        subtitle="Everything happening at Mosaic in the weeks ahead. Filter by what fits your schedule, sort by date or name, and switch between list and grid views."
      />

      <EventsBrowser events={events} />
    </div>
  )
}
