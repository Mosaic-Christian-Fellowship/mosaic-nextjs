import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import PlaceholderImage from '@/components/PlaceholderImage'
import PlanVisitForm from '@/components/PlanVisitForm'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: "I'm New",
  description:
    'Planning your first visit to Mosaic? Service times, what to expect on a Sunday, kids programming, FAQs, and a way to let us know you’re coming.',
}

const faqs = [
  { q: "What should I wear?", a: "Come as you are — seriously. You'll see everything from jeans and t-shirts to business casual on a Sunday. There's no dress code." },
  { q: "How long is the service?", a: "About 75 minutes — live worship, a teaching that connects scripture to everyday life, and time to connect with people after." },
  { q: "Will I be called out as a first-time visitor?", a: "Not publicly. We won't put you on the spot. We do hope you'll introduce yourself to someone nearby — everyone's pretty friendly." },
  { q: "What happens with my kids?", a: "Children's programming runs during the 9:30 and 11:30 AM services. You'll check your kids in at our welcome area — staff will walk you through it." },
  { q: "Do I need to bring a Bible?", a: "Nope. Scripture is displayed on screen during the message. But bring one if you'd like to follow along." },
  { q: "I've had a bad experience with church before. Is it safe to try again?", a: "We hear that a lot — and we're sorry. Mosaic isn't a church for people who have it all together. It's a community of broken, ordinary people figuring out faith together. You're not a project. You're welcome at whatever pace feels right." },
  { q: "I'm not sure I believe in God anymore. Is that okay?", a: "Absolutely. Doubt isn't the opposite of faith — it's part of the journey. Our teaching is academically grounded and built for people who have real questions. You don't need to check your brain at the door." },
  { q: "Do I have to give money?", a: "No. Giving is part of our worship, but there's no pressure and no expectation for visitors. If the plate passes by, just pass it along." },
  { q: "Is there coffee?", a: "Yes. Grab a cup before the service and stick around after — some of the best conversations happen over coffee in the lobby." },
]

type ServiceFeature = 'childrens' | 'education' | 'livestream' | 'general'

const FEATURE_LABELS: Record<ServiceFeature, string> = {
  childrens: "Children's Ministry",
  education: 'Education Ministries',
  livestream: 'YouTube Livestream',
  general: 'General service',
}

const FEATURE_CHIP_STYLES: Record<ServiceFeature, string> = {
  childrens: 'bg-amber-100 text-amber-900 border-amber-200',
  education: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  livestream: 'bg-rose-100 text-rose-900 border-rose-200',
  general: 'bg-stone-100 text-stone-700 border-stone-200',
}

const services: Array<{ time: string; features: ServiceFeature[] }> = [
  { time: '9:30 AM', features: ['childrens', 'education'] },
  { time: '11:30 AM', features: ['childrens', 'education', 'livestream'] },
  { time: '1:30 PM', features: ['general'] },
]

const sundaySteps = [
  { step: '1', heading: 'Arrive & Be Welcomed', detail: 'Greeters meet you at the door. Grab a coffee, find a seat. No pressure.' },
  { step: '2', heading: 'Drop Off Your Kids', detail: 'Head to the welcome area to check your children in. Our kids team takes it from there.' },
  { step: '3', heading: 'Worship Together', detail: '20-25 minutes of congregational worship — live music, familiar and new songs.' },
  { step: '4', heading: 'The Message', detail: 'Our pastor teaches through books of the Bible, with historical context and practical application.' },
  { step: '5', heading: 'Stay & Connect', detail: "Don't rush out. Some of the best conversations happen after the service. Stick around." },
]

const getToKnowSteps = [
  { step: 'Show Up', desc: 'Come to a Sunday service. Grab coffee. See if it feels right.' },
  { step: 'Connect', desc: "Fill out a visit form or chat with someone after the service. We'll follow up — gently." },
  { step: 'Go Deeper', desc: 'Join a community group, serve on a team, or start asking the bigger questions.' },
  { step: 'Reach', desc: 'Once Mosaic feels like home, help someone else find theirs.' },
]

export default function ImNew() {
  return (
    <div>
      <PageHero
        align="center"
        title="Broken pieces, different stories. One beautiful mosaic."
        subtitle="Whether you're exploring faith for the first time, coming back after a long time away, or just looking for a place that feels like home — we have a seat for you."
      >
        <a
          href="#plan-your-visit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0066FF] font-semibold hover:bg-white/90 transition-colors"
        >
          Let us know you&apos;re coming
          <span aria-hidden>↓</span>
        </a>
      </PageHero>

      {/* Service Times & Location */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <SectionHeader overline="When & Where" heading="Service Times & Location" />

            <div className="flex flex-col gap-5">
              {services.map(({ time, features }) => (
                <div key={time} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <span className="font-bold text-[#0066FF] w-20 shrink-0">{time}</span>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f) => (
                      <span
                        key={f}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${FEATURE_CHIP_STYLES[f]}`}
                      >
                        {FEATURE_LABELS[f]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#0066FF]/25 bg-[#0066FF]/10 px-4 py-3 text-sm">
              <p className="font-semibold text-[#0041A2]">Parking</p>
              <p className="text-[#0041A2]/80">147 Walnut St, Northvale — our new lot, right next door.</p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
              <p className="font-semibold text-emerald-900">First time?</p>
              <p className="text-emerald-900/80">
                Arrive about 10 minutes early. Look for greeters outside — they&apos;ll show you where to go, help you check in your kids, and point you to coffee.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-[#1E2024]">
              119 Rockland Ave · Northvale, NJ 07647
            </p>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E7EB]">
              <iframe
                title="Map to Mosaic Christian Fellowship"
                src="https://maps.google.com/maps?q=119+Rockland+Ave+Northvale+NJ+07647&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                tabIndex={-1}
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What a Typical Sunday Looks Like */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <SectionHeader overline="What to Expect" heading="What a typical Sunday looks like" centered />

          <ol className="flex flex-col lg:flex-row gap-6 lg:gap-4 lg:items-stretch">
            {sundaySteps.map(({ step, heading, detail }, i) => (
              <li
                key={step}
                className="flex-1 flex lg:flex-col gap-4 lg:gap-3 items-start lg:items-center lg:text-center"
              >
                <div className="flex lg:flex-col items-center gap-3 shrink-0">
                  <span className="w-10 h-10 rounded-full bg-[#0066FF] text-white font-bold flex items-center justify-center shrink-0">
                    {step}
                  </span>
                  {i < sundaySteps.length - 1 && (
                    <span aria-hidden className="hidden lg:block w-px h-6 bg-[#E5E7EB]" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-base text-[#1E2024]">{heading}</h3>
                  <p className="text-sm text-[#6B7280]">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kids & Family */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <PlaceholderImage label="Kids Ministry Photo" aspectRatio="aspect-[4/3]" />
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Families Welcome" heading="Your Kids Are in Good Hands" />
            <p className="text-[#6B7280]">
              We have dedicated programming for every age group during the 9:30 and 11:30 AM services —
              from the nursery through 5th grade. All children&apos;s workers are background-checked and trained.
            </p>
            <div className="flex flex-col gap-2">
              {['Nursery (0-18 months)', 'Toddlers (18 months - 3 years)', 'Preschool (3-5 years)', 'Elementary (Grades 1-5)'].map((group) => (
                <div key={group} className="flex gap-3 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                  <span className="text-[#6B7280]">{group}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <SectionHeader overline="Common Questions" heading="FAQ" />
            <p className="text-[#6B7280] text-base leading-relaxed">
              Have a question we haven&apos;t answered yet? We&apos;d love to hear from you — no question
              is too small.
            </p>
            <a
              href="mailto:welcoming@njmosaic.org"
              className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
            >
              Get in touch →
            </a>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* Ways to get to know Mosaic */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="Your Journey" heading="Ways to get to know Mosaic" centered />
          <p className="text-[#6B7280] text-center">
            Some people show up for years before going deeper. Others jump in week one. Wherever you are, these are the doors that tend to be open.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {getToKnowSteps.map(({ step, desc }, i) => (
              <div key={step} className="flex flex-col gap-3 text-center">
                <span className="w-10 h-10 rounded-full bg-[#0066FF] text-white font-bold flex items-center justify-center mx-auto">{i + 1}</span>
                <h3 className="font-bold text-[#1E2024]">{step}</h3>
                <p className="text-sm text-[#6B7280]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Visit */}
      <section id="plan-your-visit" className="py-20 px-6 bg-[#F5F5F7] scroll-mt-20">
        <div className="max-w-lg mx-auto flex flex-col gap-8">
          <SectionHeader overline="We'd Love to Hear From You" heading="Plan Your Visit" centered />
          <p className="text-[#6B7280] text-center">
            Tell us you&apos;re coming and someone from our community will reach out — to answer questions, walk you through what to expect, or just be a familiar face at the door on Sunday. No pressure, no pitch. Just a way to make finding the right church a little easier.
          </p>
          <PlanVisitForm />
        </div>
      </section>
    </div>
  )
}
