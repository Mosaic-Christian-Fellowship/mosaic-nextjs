import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import PlaceholderImage from '@/components/PlaceholderImage'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Our Staff',
  description:
    'Meet the people who lead, serve, and care for the Mosaic Christian Fellowship community every day.',
}

const staff = [
  { title: 'Lead Pastor', bio: 'With an academic background in theology and years of ministry experience, our lead pastor brings depth, warmth, and clarity to every message.' },
  { title: 'Associate Pastor', bio: 'Passionate about community development and discipleship, leading our small group and formation ministry.' },
  { title: 'Worship Director', bio: 'Leading our worship team with excellence and a heart for congregational participation.' },
  { title: 'Children & Family Director', bio: 'Creating safe, engaging environments where kids can discover faith at their own pace.' },
  { title: 'Youth Pastor', bio: 'Walking alongside high school students as they navigate faith, identity, and community.' },
  { title: 'Operations Director', bio: 'Keeping the church running behind the scenes — facilities, finance, and administration.' },
]

export default function Staff() {
  return (
    <div>
      <PageHero
        overline="Our Team"
        title="Meet Our Staff"
        subtitle="The people who lead, serve, and care for the Mosaic community every day."
        align="center"
      />

      {/* Staff Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {staff.map((person) => (
            <div key={person.title} className="flex flex-col gap-4">
              <PlaceholderImage label="Photo" aspectRatio="aspect-[3/4]" className="rounded-2xl" />
              <div>
                <h3 className="font-bold text-lg text-[#1E2024]">{person.title}</h3>
                <p className="text-[#6B7280] text-sm mt-2 leading-relaxed">{person.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        overline="Questions?"
        heading="We'd love to hear from you."
        subtext="Reach out anytime — our team is here to help you find your place at Mosaic."
        cta="Contact Us"
        href="/connect"
      />
    </div>
  )
}
