import SectionHeader from '@/components/SectionHeader'
import PlaceholderImage from '@/components/PlaceholderImage'
import TeamGridCrossfade from '@/components/TeamGridCrossfade'
import CTASection from '@/components/CTASection'

const beliefs = [
  { heading: 'The Bible', text: 'We believe the Bible is the inspired, authoritative Word of God — our foundation for faith and practice.' },
  { heading: 'The Trinity', text: 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.' },
  { heading: 'Salvation', text: 'We believe salvation is by grace alone through faith alone in Christ alone.' },
  { heading: 'The Church', text: "We believe the local church is God's primary vehicle for discipleship, community, and mission in the world." },
]

export default function About() {
  return (
    <div>
      {/* Page Hero */}
      <section className="bg-[#1E2024] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-left flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Who We Are</span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Built on faith.
            <br />
            Rooted in community.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            A home for seekers, believers, and everyone in between — for [X] years in northern New Jersey.
          </p>
        </div>
      </section>

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
                <p className="text-[#7F838A]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Story" heading="How Mosaic Began" />
            <p className="text-[#7F838A] leading-relaxed">
              [Placeholder: Church founding story. When it started, who started it, what the vision was,
              how it grew. 2-3 paragraphs that tell a human story about the church&apos;s history and identity.]
            </p>
            <p className="text-[#7F838A] leading-relaxed">
              [Placeholder: Where the church is today — congregation size, ministries, campus location,
              community impact.]
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
                <p className="text-[#7F838A]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mosaic Name — What It Means */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <SectionHeader overline="Why Mosaic?" heading="Broken Pieces, Beautiful Together" centered />
          <p className="text-[#7F838A] text-lg leading-relaxed">
            A mosaic is made from broken fragments — different colors, shapes, and textures — pieced
            together to form something beautiful. That&apos;s who we are. We&apos;re not a church for people
            who have it all together. We&apos;re a community of ordinary, imperfect people who believe
            that God takes the broken pieces of our lives and makes something meaningful.
          </p>
          <p className="text-[#7F838A] text-lg leading-relaxed">
            No matter where you&apos;ve been or what you carry, there&apos;s a place for you in this picture.
          </p>
        </div>
      </section>

      {/* Affiliation / Denomination */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Family" heading="Where We Belong" />
            <p className="text-[#7F838A] leading-relaxed">
              [Placeholder: Denomination or network affiliation. What larger body the church is
              connected to, what that means for governance, accountability, and shared mission.
              If non-denominational, explain the church&apos;s approach to autonomy and partnership.]
            </p>
          </div>
          <div className="flex flex-col gap-4 p-8 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
            <h3 className="font-bold text-lg text-[#1E2024]">Quick Facts</h3>
            <div className="flex flex-col gap-3 text-[#7F838A] text-sm">
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Founded</span>
                <span className="font-medium text-[#1E2024]">[Year]</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Location</span>
                <span className="font-medium text-[#1E2024]">Northvale, NJ</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Sunday Attendance</span>
                <span className="font-medium text-[#1E2024]">[Number]</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Affiliation</span>
                <span className="font-medium text-[#1E2024]">[TBD]</span>
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
