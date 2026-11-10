import Image from 'next/image'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import Callout from '@/components/Callout'
import CTASection from '@/components/CTASection'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: false }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Discipleship Academy',
  description:
    'A hands-on environment of shared life, accountability, and Scripture, where members are equipped to disciple others.',
})

/*
  Rebuilt from mosaicnj.org/discipleship-academy. Every fact here comes from
  that page. The amber "To fill in" callouts mark what staff still need to
  supply; answer or remove them before this page goes live.
*/

const SIGN_UP_URL = 'https://njmosaic.churchcenter.com/people/forms/1290913'
const TALK_VIDEO_URL = 'https://www.youtube.com/watch?v=S4kQjvScXcU'

export default function DiscipleshipAcademy() {
  return (
    <div>
      <PageHero
        overline="Discipleship Academy"
        title="Learn to follow Jesus, and to help others follow him"
        subtitle="A hands-on environment of shared life, accountability, and Scripture."
        align="center"
        media={
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
            <Image
              src="/discipleship-academy/discipleship-academy.webp"
              alt="Wooden blocks stacked in steps, rising to the right"
              fill
              priority
              sizes="(min-width: 1200px) 1152px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        }
      />

      {/* What it is */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <SectionHeader overline="About the Academy" heading="What Discipleship Academy is" />
          <p className="text-[#6B7280] leading-relaxed">
            At Mosaic, we care about intentional learning, rich community, spiritual disciplines, and holistic
            formation. Discipleship Academy is one of the ways we walk alongside people so they see and follow
            God in every area of their lives.
          </p>
          <p className="text-[#6B7280] leading-relaxed">
            It is a more intentional, hands-on environment of shared life, active accountability, and
            Scripture. Members commit to become disciples who reproduce Jesus&apos; life in others. The emphasis
            is on being equipped to form others and being prepared to say, &ldquo;Follow me, as I follow
            Christ.&rdquo;
          </p>
          <a
            href={TALK_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
          >
            Watch &ldquo;Let&apos;s Talk: Discipleship&rdquo; on YouTube →
          </a>
        </div>
      </section>

      {/* Dates and registration */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="2027 Class" heading="Dates and registration" />
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1 p-6 rounded-2xl border border-[#E5E7EB]">
              <dt className="text-sm font-semibold uppercase tracking-widest text-[#6B7280]">Starts</dt>
              <dd className="text-xl font-bold text-[#1E2024] [text-wrap:balance]">
                The week of January 31, 2027
              </dd>
            </div>
            <div className="flex flex-col gap-1 p-6 rounded-2xl border border-[#E5E7EB]">
              <dt className="text-sm font-semibold uppercase tracking-widest text-[#6B7280]">Ends</dt>
              <dd className="text-xl font-bold text-[#1E2024] [text-wrap:balance]">
                The week of June 13, 2027
              </dd>
            </div>
          </dl>
          <p className="text-[#6B7280] leading-relaxed">
            The old site said registration was open until October 17.
          </p>
          <Callout tone="warning" title="To fill in">
            <p>
              Is registration for the 2027 class closed, or has the deadline been extended? If it is closed,
              should the sign-up button come down, or should it turn into a waitlist or interest form? The
              button below stays up until we know.
            </p>
          </Callout>
          <a
            href={SIGN_UP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0066FF] text-white font-semibold px-8 py-3 rounded-[10px] hover:bg-[#0041A2] transition-colors w-fit"
          >
            Sign up on Church Center
          </a>
          <p className="text-sm text-[#6B7280]">
            Registration may be closed. The link opens Church Center in a new tab.
          </p>
        </div>
      </section>

      {/* What a participant needs */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <SectionHeader overline="Before You Sign Up" heading="What we still need to tell you" />
          <Callout tone="warning" title="To fill in">
            <p>
              When does the Academy meet: which day of the week, what time, and where? Does it meet weekly the
              whole way through, January to June?
            </p>
          </Callout>
          <Callout tone="warning" title="To fill in">
            <p>Is there a cost, including books or materials? Is there a scholarship or other help?</p>
          </Callout>
          <Callout tone="warning" title="To fill in">
            <p>Who leads the Academy, and who teaches?</p>
          </Callout>
          <Callout tone="warning" title="To fill in">
            <p>
              Who is it for? Is there an age minimum, a membership requirement, or a limit on class size? Do
              people apply, or does everyone who registers get in?
            </p>
          </Callout>
          <Callout tone="warning" title="To fill in">
            <p>
              What will a week look like, and what will members study? The old page describes the approach but
              not the curriculum or the time commitment.
            </p>
          </Callout>
        </div>
      </section>

      <CTASection
        overline="Questions?"
        heading="Ask us about Discipleship Academy."
        subtext="Reach the church office at welcoming@njmosaic.org."
        cta="Contact Us"
        href="/connect#get-in-touch"
      />
    </div>
  )
}
