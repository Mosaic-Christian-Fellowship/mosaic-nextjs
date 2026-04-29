import { kvGet } from '@/lib/kv'
import type { EventData } from '@/lib/api'
import EventsBrowser from './EventsBrowser'

export const revalidate = 600

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
    <main className="bg-white">
      <section className="px-6 md:px-8 pt-16 md:pt-20 pb-8">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
            What&rsquo;s Happening
          </span>
          <h1 className="text-[32px] md:text-[44px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1E2024]">
            All Upcoming Events
          </h1>
          <p className="max-w-[60ch] text-[15px] leading-[1.6] text-[#4B4F56]">
            Everything happening at Mosaic in the weeks ahead. Filter by what fits your schedule, sort by date or name, and switch between list and grid views.
          </p>
        </div>
      </section>

      <EventsBrowser events={events} />
    </main>
  )
}
