import Image from 'next/image'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import Callout from '@/components/Callout'
import ToFillIn from '@/components/ToFillIn'
import CTASection from '@/components/CTASection'
import FaqAccordion from '@/components/FaqAccordion'
import MinisCapacityNotice from '@/components/MinisCapacityNotice'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: false }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Education Department',
  description:
    'Children, youth, and college ministries at Mosaic: MINIS (ages 2–6), Precious Jewels, Kingdom Kids, Firm Foundations, Resurgence, and SODA.',
})

/*
  Rebuilt from mosaicnj.org/education. Facts come from that page only.
  The pink "To fill in" callouts mark what staff still need to answer; they
  must be answered or removed before this page goes live. Individual staff
  emails from the old page are deliberately not copied here.
*/

type Ministry = {
  id: string
  name: string
  ages: string
  photo: { src: string; alt: string }
  about: string
  times: string[]
  pastors?: string[]
  link?: { href: string; label: string }
}

const MINISTRIES: Ministry[] = [
  {
    id: 'minis',
    name: 'MINIS',
    ages: 'Ages 2–6',
    photo: { src: '/education/minis.webp', alt: 'A MINIS teacher shows a puppet to a circle of young children on a blue rug' },
    about:
      'Mosaic MINIS is our children’s ministry for ages 2–6. We want to help little ones become disciples of Christ (Matthew 28:19–20) by showing them God’s love, teaching them that Jesus is their Savior, and helping them know the Bible, worship, and love God.',
    times: ['Sunday 9:30 AM', 'Sunday 11:30 AM'],
  },
  {
    id: 'pjm',
    name: 'Precious Jewels (PJM)',
    ages: 'Grades 1–2',
    photo: { src: '/education/pjm.webp', alt: 'Precious Jewels students at a Sunday gathering' },
    about:
      'Precious Jewels Ministry serves early elementary children. We teach the truth of the Gospel and guide them to love God, their neighbor, and themselves in the love of the Triune God.',
    times: ['Sunday 9:30 AM', 'Sunday 11:30 AM'],
    pastors: ['Ellie E. Cho'],
    link: { href: 'http://www.chodaepjm.com', label: 'More about PJM' },
  },
  {
    id: 'kkm',
    name: 'Kingdom Kids (KKM)',
    ages: 'Grades 3–5',
    photo: { src: '/education/kkm.webp', alt: 'Kingdom Kids students together' },
    about:
      'Kingdom Kids Ministry serves elementary children. We help them know God’s love, grow in faith, worship, enjoy fellowship, and experience His work.',
    times: ['Sunday 9:30 AM', 'Sunday 11:30 AM'],
    pastors: ['Karen Oh', 'Jee Yeon Kim'],
    link: { href: 'http://chodaekkm.org/', label: 'More about KKM' },
  },
  {
    id: 'ffm',
    name: 'Firm Foundations (FFM)',
    ages: 'Grades 6–8',
    photo: { src: '/education/ffm.webp', alt: 'Firm Foundations junior high students together' },
    about:
      'Firm Foundations Ministry exists for junior high students to know God, to find Him, and to make Him known to others. Small groups meet before service, divided by grade and gender.',
    times: ['Sunday 9:30 AM', 'Sunday 11:30 AM', 'Friday Night Fellowship, 8 PM'],
    pastors: ['Boyoung Lee', 'Matthew Yoon', 'Yunhwan Kim'],
    link: { href: 'https://ffmchodae.org', label: 'More about FFM' },
  },
  {
    id: 'resurgence',
    name: 'Resurgence',
    ages: 'Grades 9–12',
    photo: { src: '/education/resurgence.webp', alt: 'Resurgence high school students together' },
    about:
      'Our high school ministry raises up students as disciples of Jesus who are committed to the Great Commandment and the Great Commission. We want every student to center their life on the Gospel and live with the joy and peace of being God’s sons and daughters. Small groups meet by grade and gender after service.',
    times: [
      'Sunday 9:30 AM',
      'Sunday 11:30 AM',
      'BRUH (Bible Reading Understand HIS-story): Wednesday 8 PM, on Zoom',
      'Friday Night Revival (FNR): Friday 8 PM',
    ],
    pastors: ['Pat Nam'],
    link: { href: 'https://www.resurgenceministry.org', label: 'More about Resurgence' },
  },
]

const FAQS = [
  {
    q: 'How do service times work?',
    a: 'The 9:30 AM service is often called “2nd Service” and the 11:30 AM service “3rd Service”, after Chodae’s service schedule. These times line up with Mosaic’s 1st and 2nd services.',
  },
  {
    q: 'Are there youth ministries at the 1:30 PM service?',
    a: 'No. Children’s and youth ministries meet at the 9:30 AM and 11:30 AM services only.',
  },
  {
    q: 'When do students move up a grade?',
    a: 'Students move up in early September.',
  },
  {
    q: 'I’m new. How do I register my child?',
    a: 'Stop by the welcome desk at your child’s ministry and register there.',
  },
  {
    q: 'How do the ministries reach out to parents?',
    a: 'Each ministry uses Kakao Groups for weekly messages to parents. If you haven’t been added, ask a leader in your child’s ministry.',
  },
  {
    q: 'Do the youth ministries have a PTA?',
    a: 'KKM, FFM, and Resurgence each have their own PTA. Ask a leader in that ministry to get connected.',
  },
]

const GLANCE_LINK =
  'flex flex-col gap-1 p-5 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#0066FF] transition-colors h-full'

export default function Education() {
  return (
    <div>
      <PageHero
        overline="Education Department"
        title="Raising up the next generation"
        subtitle="From toddlers to college students, there is a place for every age to learn the Gospel and grow together."
        align="center"
        media={
          <div className="relative aspect-[3/2] md:aspect-[2/1] overflow-hidden rounded-2xl">
            <Image
              src="/education/education.webp"
              alt="Children raising their hands during a Sunday gathering"
              fill
              priority
              sizes="(min-width: 1200px) 1152px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        }
      />

      {/* At a glance */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <SectionHeader overline="At a Glance" heading="Find your child’s group" centered />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MINISTRIES.map((m) => (
              <li key={m.id}>
                <a href={`#${m.id}`} className={GLANCE_LINK}>
                  <span className="text-sm font-semibold text-[#0066FF]">{m.ages}</span>
                  <span className="text-lg font-bold text-[#1E2024]">{m.name}</span>
                  <span className="text-sm text-[#6B7280]">Sundays at 9:30 AM and 11:30 AM</span>
                </a>
              </li>
            ))}
            <li>
              <a href="#soda" className={GLANCE_LINK}>
                <span className="text-sm font-semibold text-[#0066FF]">College</span>
                <span className="text-lg font-bold text-[#1E2024]">SODA</span>
                <span className="text-sm text-[#6B7280]">Weekly gatherings</span>
              </a>
            </li>
          </ul>
          <Callout tone="info" title="Service times">
            <p>
              Children’s and youth ministries meet at our 9:30 AM and 11:30 AM services. They do not meet at the
              1:30 PM service.
            </p>
          </Callout>
          <MinisCapacityNotice />
          <p className="text-[#6B7280] leading-relaxed max-w-3xl [text-wrap:pretty]">
            Our grade school and youth ministries are run in partnership with Chodae Community Church, Mosaic’s
            mother church. New families register at the welcome desk of their child’s ministry.
          </p>
          <ToFillIn
            items={[
              {
                label: 'Check-in',
                question: (
                  <p>
                    What should a parent expect at check-in on a first Sunday (where the desk is, ID or security
                    steps, allergy forms)? Is there a child safety or background-check policy we should link to? The
                    old page only says check-in and check-out are required for PJM.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Ministries */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <SectionHeader overline="Children and Youth" heading="Our ministries by age" centered />
          {MINISTRIES.map((m, i) => (
            <article
              key={m.id}
              id={m.id}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center scroll-mt-24"
            >
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={m.photo.src}
                    alt={m.photo.alt}
                    fill
                    sizes="(min-width: 768px) 560px, calc(100vw - 48px)"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="w-fit text-sm font-semibold px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0041A2]">
                  {m.ages}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-[#1E2024] [text-wrap:balance]">{m.name}</h3>
                <p className="text-[#6B7280] leading-relaxed [text-wrap:pretty]">{m.about}</p>
                <ul className="flex flex-col gap-1 text-[#1E2024] font-medium">
                  {m.times.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {m.id === 'pjm' && (
                  <p className="text-sm text-[#6B7280]">
                    Parents pick up children around 10:45 AM or 12:45 PM. Check-in and check-out are required, and
                    PJM may end 5–10 minutes early.
                  </p>
                )}
                {m.id === 'resurgence' && (
                  <p className="text-sm text-[#6B7280]">Follow Resurgence on Instagram at @resurgenceofchodae.</p>
                )}
                {m.pastors && (
                  <p className="text-sm text-[#6B7280]">
                    {m.pastors.length > 1 ? 'Pastors' : 'Pastor'}: {m.pastors.join(', ')}
                  </p>
                )}
                {m.link && (
                  <a
                    href={m.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
                  >
                    {m.link.label} →
                  </a>
                )}
              </div>
            </article>
          ))}
          <ToFillIn
            items={[
              {
                label: 'Contacts',
                question: (
                  <p>
                    The old page lists individual pastor emails and a Gmail address for MINIS. We left them off. Which
                    contact should each ministry show: a ministry address, welcoming@njmosaic.org, or the Chodae
                    ministry sites linked above? Should MINIS list its board of directors by name?
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* SODA */}
      <section id="soda" className="py-20 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex flex-col gap-4">
            <span className="w-fit text-sm font-semibold px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0041A2]">
              College
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E2024] [text-wrap:balance]">
              SODA (Sons and Daughters)
            </h2>
            <p className="text-[#6B7280] leading-relaxed [text-wrap:pretty]">
              SODA is our college fellowship. It gives students a community to grow in faith, learn the Gospel,
              and live it out every day. We meet weekly to share meals, study Scripture, and enjoy fellowship.
              College students are always welcome at our gatherings and at Sunday services.
            </p>
            <p className="text-sm text-[#6B7280]">Pastor: Patrick Chi</p>
            <ToFillIn
              items={[
                {
                  label: 'SODA',
                  question: (
                    <p>
                      What day, time, and place does SODA meet each week? What does a first-time student need to know,
                      and which contact should we list instead of Pastor Chi’s email?
                    </p>
                  ),
                },
              ]}
            />
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/education/soda.webp"
              alt="SODA college students together"
              fill
              sizes="(min-width: 768px) 560px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="FAQs" heading="Questions parents ask" centered />
          <FaqAccordion items={FAQS} />
          <ToFillIn
            items={[
              {
                label: 'FAQ wording',
                question: (
                  <p>
                    The old FAQ explains the times as Chodae’s “2nd and 3rd Service.” Is that wording still useful to
                    new families, or should we drop it? Please also confirm the September 2026 pause on new MINIS 9:30
                    AM students is still current.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      <CTASection
        overline="New to Mosaic?"
        heading="Come with your kids this Sunday."
        subtext="Stop by your child’s welcome desk to register. Questions first? Write to welcoming@njmosaic.org."
        cta="Plan Your Visit"
        href="/im-new"
      />
    </div>
  )
}
