import Link from 'next/link'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import PlaceholderImage from '@/components/PlaceholderImage'
import Callout from '@/components/Callout'
import CTASection from '@/components/CTASection'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: true }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Missions',
  description:
    'Where Mosaic serves locally and around the world — short-term trips, Barnabas Vision Trips, and how giving supports our missionaries.',
})

/*
  Rebuilt from mosaicnj.org/missions and its "Short Term Trip Opportunities"
  page, plus what staff wrote in the content review doc. Every fact here comes
  from one of those. The amber "To fill in" callouts mark what the church still
  needs to supply; they must be answered or removed before this page goes live.

  Publish by setting draft: false and adding Missions as a top-level item in
  lib/nav.ts (moving it out of the Ministries menu).
*/

const CURRENT_TRIPS = [
  { place: 'Africa', work: ['English Camp', 'Prayer Walk'] },
  { place: 'Córdoba, Argentina', work: ['English Camp', 'Pastors Seminar'] },
  { place: 'Cambodia', work: ['English Camp', 'Science VBS'] },
]

const PLACES_SERVED = [
  'U.S.',
  'Mexico',
  'Argentina',
  'Northern Africa',
  'China',
  'Korea',
  'Cambodia',
  'Indonesia',
]

export default function Missions() {
  return (
    <div>
      <PageHero
        overline="Missions"
        title="Reaching our neighbors and the nations"
        subtitle="Reach is the first word of our mission. Here's where Mosaic goes and how you can be part of it."
        align="center"
      />

      {/* Current trips */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Short-Term Trips" heading="Where we serve" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CURRENT_TRIPS.map(({ place, work }) => (
              <div key={place} className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E7EB]">
                <PlaceholderImage label={`${place} trip photo`} aspectRatio="aspect-[4/3]" />
                <h3 className="text-xl font-bold text-[#1E2024] [text-wrap:balance]">{place}</h3>
                <ul className="flex flex-wrap gap-2">
                  {work.map((w) => (
                    <li
                      key={w}
                      className="text-sm font-semibold px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0041A2]"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Callout tone="warning" title="To fill in">
            <p>
              When is the next trip to each place, who can go, what it costs, and how do people sign up? The old
              site has none of this, and it&apos;s what someone interested in going needs first.
            </p>
          </Callout>
        </div>
      </section>

      {/* Places served */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center text-center">
          <SectionHeader overline="Where God Has Taken Mosaic" heading="Where our teams have served" centered />
          <p className="text-[#6B7280]">Short-term teams from Mosaic have served in:</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {PLACES_SERVED.map((place) => (
              <li
                key={place}
                className="px-4 py-2 rounded-full border border-[#E5E7EB] bg-[#FFFFFF] font-semibold text-[#1E2024]"
              >
                {place}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Barnabas Vision Trips + local outreach */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Encouraging Our Missionaries" heading="Barnabas Vision Trips" />
            <p className="text-[#6B7280] leading-relaxed">
              We hold Barnabas Vision Trips to support and encourage our missionaries on the field, and to see
              what God is doing in different nations.
            </p>
            <Callout tone="warning" title="To fill in">
              <p>Which missionaries and partner organizations does Mosaic support, and where do they serve?</p>
            </Callout>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Close to Home" heading="Local Outreach" />
            <Callout tone="warning" title="To fill in">
              <p>
                Which local outreach programs should be listed here? Staff noted that outreach programs belong
                on this page, and discipleship programs don&apos;t.
              </p>
            </Callout>
          </div>
        </div>
      </section>

      {/* Giving, sermons, and who leads */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
            <h3 className="font-bold text-lg text-[#1E2024]">Where giving goes</h3>
            <p className="text-[#6B7280]">
              Most of what our church gives goes to our missions organization, supporting our missionaries in
              different countries and our short-term mission trips.
            </p>
            <Link href="/give" className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit">
              Ways to give →
            </Link>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
            <h3 className="font-bold text-lg text-[#1E2024]">Missions Month</h3>
            <p className="text-[#6B7280]">
              Our Missions Month sermon series from 2022, 2023, 2024, and 2025 are in the sermon archive.
            </p>
            <Link
              href="/messages/sermons"
              className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
            >
              Browse sermons →
            </Link>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
            <h3 className="font-bold text-lg text-[#1E2024]">Who leads missions</h3>
            <p className="text-[#6B7280]">
              Christy Kim, our Worship &amp; Missions Director, mobilizes the church to reach people locally and
              abroad.
            </p>
            <Link
              href="/about/staff"
              className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
            >
              Meet our staff →
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        overline="Want to Go?"
        heading="Ask us about the next trip."
        subtext="Tell us where you'd like to serve, and we'll connect you with the missions team."
        cta="Contact Us"
        href="/connect#get-in-touch"
      />
    </div>
  )
}
