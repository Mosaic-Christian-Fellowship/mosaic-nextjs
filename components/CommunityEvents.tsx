import Image from 'next/image'
import Link from 'next/link'
import ProgressiveBlur from '@/components/ProgressiveBlur'
import MoreLink from '@/components/MoreLink'
import { kvGet } from '@/lib/kv'
import type { EventData } from '@/lib/api'

type Event = {
  title: string
  description: string
  image: string | null
  href: string
  tag?: string
}

const PLACEHOLDER_EVENTS: Event[] = [
  {
    title: 'Community Groups',
    description: 'Add a short description to explain this card.',
    image: '/framer/events/DZe6dlJCd284zYdtTrAhEeA0Eko.png',
    href: '#',
    tag: 'Tag',
  },
  {
    title: 'Bible Study',
    description: 'Add a short description to explain this card.',
    image: '/framer/events/Dho9fqWUmd9f4hz0WBrCY4kGw.png',
    href: '#',
  },
  {
    title: 'Soda Summer Retreat',
    description: 'Add a short description to explain this card.',
    image: '/framer/events/oEbRG6TrgZJOQJCvILBod9cv1s.png',
    href: '#',
  },
]

async function getHomepageEvents(): Promise<Event[]> {
  try {
    const all = await kvGet<EventData[]>('events:all')
    if (!all || all.length === 0) return PLACEHOLDER_EVENTS

    const now = new Date().toISOString()
    const upcoming = all
      .filter((e) => e.startsAt >= now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

    const featured = upcoming.filter((e) => e.featured)
    const rest = upcoming.filter((e) => !e.featured)
    const selected = [...featured, ...rest].slice(0, 3)

    if (selected.length === 0) return PLACEHOLDER_EVENTS

    return selected.map((e) => ({
      title: e.name,
      description: e.summary || '',
      image: e.imageUrl,
      href: `/events/${e.id}`,
    }))
  } catch {
    return PLACEHOLDER_EVENTS
  }
}

function BentoCard({ event, size }: { event: Event; size: 'large' | 'small' }) {
  const isLarge = size === 'large'
  return (
    <Link
      href={event.href}
      className="group relative block h-full overflow-hidden rounded-[12px] bg-black"
    >
      {event.image ? (
        <>
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes={isLarge ? '(min-width: 810px) 66vw, 100vw' : '(min-width: 810px) 33vw, 100vw'}
            className="object-cover object-top"
            priority={isLarge}
          />
          <ProgressiveBlur direction="to left" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0066FF 0%, #0041A2 100%)' }}
        />
      )}

      <div
        className="absolute inset-0 z-10 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        style={{ backgroundColor: 'rgba(0, 46, 116, 0.6)' }}
        aria-hidden
      />

      <div className="relative z-20 flex h-full translate-y-2 flex-col justify-end gap-3 p-6 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        {event.tag && (
          <span
            className="inline-flex self-start px-2.5 py-1 text-[12px] font-medium text-[#1E2024]"
            style={{ backgroundColor: '#D2F944' }}
          >
            {event.tag}
          </span>
        )}
        <h3
          className={`font-semibold tracking-[-0.04em] text-white leading-[1.15] ${
            isLarge ? 'text-[32px]' : 'text-[22px]'
          }`}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {event.title}
        </h3>
        {event.description && (
          <p className="max-w-[36ch] text-[13px] leading-[1.5] text-white/85">
            {event.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default async function CommunityEvents() {
  const events = await getHomepageEvents()
  const [hero, ...rest] = events

  return (
    <section className="bg-white py-20 md:py-24 px-6 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-[28px] md:text-[34px] font-semibold leading-[1.2] text-[#1E2024]">
            Upcoming Community Events
          </h2>
          <div className="hidden md:block">
            <MoreLink href="/events">Browse all events</MoreLink>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-12 md:auto-rows-[200px]">
          <div className="h-[360px] md:col-span-8 md:row-span-2 md:h-auto">
            <BentoCard event={hero} size="large" />
          </div>
          {rest.map((event) => (
            <div key={event.title} className="h-[200px] md:col-span-4 md:h-auto">
              <BentoCard event={event} size="small" />
            </div>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <MoreLink href="/events" className="w-full justify-center">
            Browse all events
          </MoreLink>
        </div>
      </div>
    </section>
  )
}
