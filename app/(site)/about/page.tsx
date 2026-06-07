import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import PlaceholderImage from '@/components/PlaceholderImage'
import TeamGridCrossfade from '@/components/TeamGridCrossfade'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who we are at Mosaic Christian Fellowship — our mission to Reach, Embrace, and Disciple, what we believe, and the story behind the name.',
}

const beliefs = [
  { heading: 'The Bible', text: 'We believe the Bible is the inspired, authoritative Word of God — our foundation for faith and practice.' },
  { heading: 'The Trinity', text: 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.' },
  { heading: 'Salvation', text: 'We believe salvation is by grace alone through faith alone in Christ alone.' },
  { heading: 'The Church', text: "We believe the local church is God's primary vehicle for discipleship, community, and mission in the world." },
]

export default function About() {
  return (
    <div>
      <PageHero
        overline="Who We Are"
        title="Built on faith. Rooted in community."
        subtitle="A home for seekers, believers, and everyone in between — here in northern New Jersey."
      />

      {/* Mission & Values */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Our Mission" heading="Reach. Embrace. Disciple." centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { word: 'Reach', description: 'We actively pursue those who are far from God — through relationships, outreach, and a culture of welcome.' },
              { word: 'Embrace', description: 'Everyone who walks through our doors is met with genuine warmth and a place at the table, regardless of background.' },
              { word: 'Disciple', description: 'We are committed to helping people grow in their faith through teaching, community, and intentional formation.' },
            ].map(({ word, description }) => (
              <div key={word} className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E7EB]">
                <PlaceholderImage label={`${word} photo`} aspectRatio="aspect-[4/3]" />
                <span className="text-2xl font-bold text-[#0066FF]">{word}</span>
                <p className="text-[#6B7280]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Story" heading="Who We Are" />
            <p className="text-[#6B7280] leading-relaxed">
              Mosaic Christian Fellowship exists for one reason: to help people find their place in
              God&apos;s family. We&apos;re a diverse community in Northvale, New Jersey — students,
              young families, longtime believers, and first-time guests — learning together what it
              means to reach the lost, embrace the broken, and grow as disciples of Jesus.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              The name says it best. A mosaic is made of different pieces, each carrying its own
              story, brought together into something beautiful. That&apos;s the church we&apos;re
              building — and there&apos;s a place in it for you.
            </p>
          </div>
          <PlaceholderImage label="Church History Photo" aspectRatio="aspect-[4/3]" />
        </div>
      </section>

      {/* Meet Our Team — Crossfade grid ported from wireframe */}
      <TeamGridCrossfade />

      {/* What We Believe */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Our Beliefs" heading="What We Believe" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beliefs.map(({ heading, text }) => (
              <div key={heading} className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
                <div className="w-20 h-20 rounded-xl bg-[#0066FF]/10 mb-4" aria-hidden />
                <h3 className="font-bold text-lg mb-2">{heading}</h3>
                <p className="text-[#6B7280]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mosaic Name — What It Means */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <SectionHeader overline="Why Mosaic?" heading="Broken Pieces, Beautiful Together" centered />
          <p className="text-[#6B7280] text-lg leading-relaxed">
            A mosaic is made from broken fragments — different colors, shapes, and textures — pieced
            together to form something beautiful. That&apos;s who we are. We&apos;re not a church for people
            who have it all together. We&apos;re a community of ordinary, imperfect people who believe
            that God takes the broken pieces of our lives and makes something meaningful.
          </p>
          <p className="text-[#6B7280] text-lg leading-relaxed">
            No matter where you&apos;ve been or what you carry, there&apos;s a place for you in this picture.
          </p>
        </div>
      </section>

      {/* Affiliation / Denomination */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Family" heading="Where We Belong" />
            <p className="text-[#6B7280] leading-relaxed">
              However you map the landscape of churches, what matters most to us is staying faithful
              to Scripture and connected to the wider family of God&apos;s people. We partner with
              other churches and ministries near and far to reach our community and serve the world.
            </p>
          </div>
          <div className="flex flex-col gap-4 p-8 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
            <h3 className="font-bold text-lg text-[#1E2024]">Quick Facts</h3>
            <div className="flex flex-col gap-3 text-[#6B7280] text-sm">
              <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]">
                <span>Location</span>
                <span className="font-medium text-[#1E2024] text-right">Northvale, NJ</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]">
                <span>Sunday Services</span>
                <span className="font-medium text-[#1E2024] text-right">9:30, 11:30 &amp; 1:30</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span>Mission</span>
                <span className="font-medium text-[#1E2024] text-right">Reach. Embrace. Disciple.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        overline="Ready to Visit?"
        heading="Come as you are."
        subtext="We'd love to meet you on a Sunday. Here's everything you need to know before your first visit."
        cta="Plan Your Visit"
        href="/im-new"
      />
    </div>
  )
}
