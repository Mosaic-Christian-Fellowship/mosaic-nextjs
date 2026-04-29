import Image from 'next/image'
import Link from 'next/link'
import ProgressiveBlur from '@/components/ProgressiveBlur'

type Event = {
  title: string
  description: string
  image: string
  href: string
  tag?: string
}

const events: Event[] = [
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

function BentoCard({
  event,
  size,
}: {
  event: Event
  size: 'large' | 'small'
}) {
  const isLarge = size === 'large'
  return (
    <Link
      href={event.href}
      className="group relative block overflow-hidden rounded-[12px] bg-black h-full"
    >
      <Image
        src={event.image}
        alt={event.title}
        fill
        sizes={isLarge ? '(min-width: 810px) 66vw, 100vw' : '(min-width: 810px) 33vw, 100vw'}
        className="object-cover object-top"
        priority={isLarge}
      />

      <ProgressiveBlur direction="to left" />

      <div
        className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: '#002E74' }}
        aria-hidden
      />

      <div
        className={`relative z-20 flex h-full flex-col justify-end ${
          isLarge ? 'p-8' : 'p-6'
        }`}
      >
        {isLarge && event.tag && (
          <span
            className="inline-flex self-start mb-3 px-2.5 py-1 text-[12px] font-medium text-[#1E2024]"
            style={{ backgroundColor: '#D2F944' }}
          >
            {event.tag}
          </span>
        )}
        <h3
          className={`font-semibold tracking-[-0.04em] text-[#F3F4F5] leading-[1.1] ${
            isLarge ? 'text-[38px] md:text-[48px]' : 'text-[24px] md:text-[28px]'
          }`}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {event.title}
        </h3>
        <p
          className={`mt-2 max-w-[36ch] text-[#F3F4F5]/85 leading-[1.5] ${
            isLarge ? 'text-[15px]' : 'text-[14px]'
          }`}
        >
          {event.description}
        </p>
      </div>
    </Link>
  )
}

export default function CommunityEvents() {
  const [hero, ...rest] = events
  return (
    <section className="bg-white py-20 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.04em] text-[#1E2024] leading-[1.1]">
            Upcoming Community Events
          </h2>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-1.5 rounded-[10px] border border-[#F3F4F5] bg-white px-3 py-2 text-[14px] font-semibold text-[#131517] hover:border-[#D2D5DA] transition-colors shrink-0"
          >
            Browse all events
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 md:auto-rows-[280px]">
          <div className="md:col-span-8 md:row-span-2 h-[360px] md:h-auto">
            <BentoCard event={hero} size="large" />
          </div>
          {rest.map((event) => (
            <div key={event.title} className="md:col-span-4 h-[260px] md:h-auto">
              <BentoCard event={event} size="small" />
            </div>
          ))}
        </div>

        <Link
          href="/events"
          className="mt-6 md:hidden inline-flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#F3F4F5] bg-white px-3 py-2 text-[14px] font-semibold text-[#131517]"
        >
          Browse all events
        </Link>
      </div>
    </section>
  )
}
