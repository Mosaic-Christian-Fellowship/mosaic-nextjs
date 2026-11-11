import Image from 'next/image'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import ToFillIn from '@/components/ToFillIn'
import CTASection from '@/components/CTASection'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: false }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Internships',
  description:
    'Mosaic’s pastoral internship program raises up future men and women for church planting and ministry, through learning, watching, and doing.',
})

/*
  Rebuilt from mosaicnj.org/learn-more ("Internship"). The goal, the three
  pillars, and the contact are from that page. The pink "To fill in" callouts
  mark what a prospective intern needs that the old page doesn't say.
*/

const PILLARS = [
  {
    verb: 'Learn',
    name: 'Spiritual Development',
    intro: 'Growth starts on the inside, so interns spend time on their own walk with God.',
    points: [
      'Using spiritual disciplines for the sake of growth',
      'Developing the private life of a leader',
      'Learning the rhythms and habits of self-discipline',
      'Reading and reflecting on important theological topics and church ministry values',
    ],
  },
  {
    verb: 'Watch',
    name: 'Apprenticeship',
    intro: 'Interns learn by seeing ministry up close.',
    points: [
      'Weekly meetings with Pastor Dave to deepen the relationship, with accountability and prayer',
      'Watching how leaders lead and communicate change',
      'Watching how a sermon gets prepared',
      'Watching counseling and shepherding',
    ],
  },
  {
    verb: 'Do',
    name: 'Engagement',
    intro: 'Interns serve in two areas and learn from doing the work.',
    points: [
      'Exploring ministry: lead a ministry of your choice, or build a new one, with room to explore inside a guided vision',
      'Organizing ministry: take on responsibilities in Sunday service and event planning, working with staff to organize worship and community events',
    ],
  },
]

export default function Internships() {
  return (
    <div>
      <PageHero
        overline="Internships"
        title="Raising up the next generation of church leaders"
        subtitle="Our pastoral internship equips men and women for church planting and ministry, whether that's at Mosaic or somewhere else."
      />

      {/* Goal */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Goal" heading="To raise up and develop future men and women for church planting and ministry" />
            <p className="text-[#6B7280] leading-relaxed">
              God has given Mosaic a vision to make disciples, be on mission, and plant churches. The internship
              isn&apos;t meant to build our own staff. It&apos;s meant to equip future pastors for ministry, even
              outside our church.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              We value apprenticeship and watching ministry up close, and we value ministry where interns learn
              firsthand from experience. We also expect interns to learn through reading and reflecting on topics
              in church ministry and church planting.
            </p>
          </div>
          <div className="relative aspect-[16/7] overflow-hidden rounded-2xl">
            <Image
              src="/missions/internships/internship-program.webp"
              alt="Mosaic Internship Program"
              fill
              sizes="(min-width: 768px) 560px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="3 Pillars of Internship" heading="Learn, watch, and do" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map(({ verb, name, intro, points }) => (
              <div
                key={name}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">{verb}</span>
                <h3 className="text-xl font-bold text-[#1E2024] [text-wrap:balance]">{name}</h3>
                <p className="text-[#6B7280]">{intro}</p>
                <ul className="flex flex-col gap-2 text-[#1E2024] list-disc pl-5">
                  {points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* To fill in */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <SectionHeader overline="Interested?" heading="What you'd want to know before applying" />
          <ToFillIn
            items={[
              {
                label: 'Eligibility',
                question: (
                  <p>
                    Who can apply, and is there a minimum age, church membership, or experience? The old page doesn&apos;t
                    say.
                  </p>
                ),
              },
              {
                label: 'Applying',
                question: (
                  <p>How does someone apply, and is there an application or an interview?</p>
                ),
              },
              {
                label: 'Length and pay',
                question: (
                  <p>
                    How long is the internship, when does it start, and how many hours a week does it take? Is it paid,
                    unpaid, or a stipend?
                  </p>
                ),
              },
              {
                label: 'Contact',
                question: (
                  <p>
                    Who should people contact about the internship? The old page lists one staff member&apos;s email
                    address. We&apos;re using the church&apos;s main address (welcoming@njmosaic.org) until you tell us
                    which one to show.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      <CTASection
        overline="Interested?"
        heading="Talk with us about the internship."
        subtext="Write to welcoming@njmosaic.org and we'll point you to the right person."
        cta="Contact Us"
        href="/connect#get-in-touch"
      />
    </div>
  )
}
