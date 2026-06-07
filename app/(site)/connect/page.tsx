import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import CTASection from '@/components/CTASection'
import GroupFinder from '@/components/GroupFinder'
import ServeTeamCarousel from '@/components/ServeTeamCarousel'
import EventsList from '@/components/EventsList'
import MoreLink from '@/components/MoreLink'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Connect',
  description:
    'Find a community group, join a serve team, see upcoming events, and get in touch. There’s a place for you at Mosaic.',
}

export default function Connect() {
  return (
    <div>
      <PageHero
        overline="Get Involved"
        title="Your Community Is Here"
        subtitle="Connection at Mosaic happens in groups, at events, and through serving together. There's a place for you here."
      />

      {/* Community Groups */}
      <section id="community-groups" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Community Groups" heading="Find Your People"/>
          <GroupFinder />
        </div>
      </section>

      {/* Events */}
      <section id="whats-coming-up" className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="What's Coming Up" heading="Events Calendar" />
          <EventsList limit={6} />
          <MoreLink href="/events">Browse all events</MoreLink>
        </div>
      </section>

      {/* Serve Teams */}
      <section id="ways-to-serve" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Ways to Serve" heading="Join a Serve Team" />
          <ServeTeamCarousel />
        </div>
      </section>

      {/* Contact */}
      <section id="get-in-touch" className="py-20 px-6">
        <div className="max-w-lg mx-auto flex flex-col gap-8">
          <SectionHeader overline="Get in Touch" heading="Contact Us" centered />
          <p className="text-[#6B7280] text-center">
            Have a question or want to connect? Drop us a message and we&apos;ll get back to you.
          </p>
          <ContactForm />
        </div>
      </section>

      <CTASection
        overline="New Here?"
        heading="Not sure where to start?"
        subtext="Reach out and we'll help you find the right place to plug in."
        cta="Contact Us"
        href="/im-new"
      />
    </div>
  )
}
