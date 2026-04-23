import Image from 'next/image'
import Link from 'next/link'

const events = [
  {
    title: 'Community Groups',
    image: '/framer/events/DZe6dlJCd284zYdtTrAhEeA0Eko.png',
    // TODO: client to replace placeholder description
    description: 'Add a short description to explain this card.',
    href: '#',
  },
  {
    title: 'Bible Study',
    image: '/framer/events/Dho9fqWUmd9f4hz0WBrCY4kGw.png',
    description: 'Add a short description to explain this card.',
    href: '#',
  },
  {
    title: 'Soda Summer Retreat',
    image: '/framer/events/oEbRG6TrgZJOQJCvILBod9cv1s.png',
    description: 'Add a short description to explain this card.',
    href: '#',
  },
]

export default function CommunityEvents() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1E2024] leading-[1.2]">
            Upcoming Community Events
          </h2>
          <Link
            href="/events"
            className="text-[#0066FF] font-medium text-[15px] hover:opacity-70 transition-opacity shrink-0"
          >
            Browse all events →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.title}
              href={event.href}
              className="group flex flex-col gap-5 rounded-[12px] overflow-hidden bg-white hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-[16/9] bg-[#F5F5F7] rounded-[12px] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 px-1">
                <span className="inline-flex self-start text-xs font-medium text-[#1E2024] bg-[#F5F5F7] px-3 py-1 rounded-full">
                  Tag
                </span>
                <h3 className="text-[20px] font-semibold text-[#1E2024] leading-[1.3] group-hover:text-[#0066FF] transition-colors">
                  {event.title}
                </h3>
                <p className="text-[14px] text-[#7F838A] leading-[1.6]">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
