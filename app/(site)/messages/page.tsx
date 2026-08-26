import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Messages',
  description:
    'Sermons, testimonies, podcasts and resources from Mosaic Christian Fellowship.',
}

/*
  /messages used to be the sermon archive. It keeps its URL — it has been shared
  and indexed, so it must not 404 — and becomes the hub for the four child
  pages. A deep link now lands on a page that names its children rather than on
  the grid it expected; that is the trade for a coherent structure.
*/
const SECTIONS = [
  {
    href: '/messages/sermons',
    title: 'Sermons',
    blurb: 'Every Sunday message, grouped by series and searchable by speaker.',
  },
  {
    href: '/messages/testimonies',
    title: 'Testimonies',
    blurb: 'Stories from the Mosaic family, in their own words.',
  },
  {
    href: '/messages/podcasts',
    title: 'Podcasts',
    blurb: 'Every message as an episode — listen on Spotify or Apple Podcasts.',
  },
]

export default function Messages() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Messages"
        subtitle="Sermons, testimonies and podcasts — everything Mosaic teaches, in one place."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto @container">
          <ul className="grid grid-cols-1 @2xl:grid-cols-3 gap-6 list-none p-0 m-0">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex flex-col gap-3 h-full rounded-2xl border border-[#DBDDE0] bg-white p-8 min-h-11 hover:border-[#0066FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
                >
                  <h2 className="text-[22px] font-semibold text-[#1E2024] leading-[1.25] text-balance group-hover:text-[#0066FF] transition-colors">
                    {s.title}
                  </h2>
                  <p className="text-[15px] text-[#6B7280] leading-[1.6]">{s.blurb}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-[#0066FF]">
                    Explore →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
