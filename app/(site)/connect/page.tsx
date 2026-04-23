import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'
import GroupFinder from '@/components/GroupFinder'
import ServeTeamCarousel from '@/components/ServeTeamCarousel'
import EventsList from '@/components/EventsList'
import ContactForm from '@/components/ContactForm'

export default function Connect() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1E2024] text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Get Involved</span>
          <h1 className="text-4xl md:text-5xl font-bold">Your Community Is Here</h1>
          <p className="text-white/70 text-lg">
            Connection at Mosaic happens in groups, at events, and through serving together.
            There&apos;s a place for you here.
          </p>
        </div>
      </section>

      {/* Community Groups */}
      <section id="Community-Groups" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Community Groups" heading="Find Your People"/>
          <GroupFinder />
        </div>
      </section>

      {/* Events */}
      <section id="Whats-Coming-Up" className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="What's Coming Up" heading="Events Calendar" />
          <EventsList />
        </div>
      </section>

      {/* Serve Teams */}
      <section id="Ways-To-Serve" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Ways to Serve" heading="Join a Serve Team" />
          <ServeTeamCarousel />
        </div>
      </section>

      {/* Contact */}
      <section id="Get-In-Touch" className="py-20 px-6">
        <div className="max-w-lg mx-auto flex flex-col gap-8">
          <SectionHeader overline="Get in Touch" heading="Contact Us" centered />
          <p className="text-[#7F838A] text-center">
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
