import PlaceholderImage from '@/components/PlaceholderImage'
import CTASection from '@/components/CTASection'

const staff = [
  { name: 'Pastor [Name]', title: 'Lead Pastor', bio: 'With an academic background in theology and over [X] years of ministry experience, our pastor brings depth, warmth, and clarity to every message.' },
  { name: '[Name]', title: 'Associate Pastor', bio: 'Passionate about community development and discipleship, leading our small group and formation ministry.' },
  { name: '[Name]', title: 'Worship Director', bio: 'Leading our worship team with excellence and a heart for congregational participation.' },
  { name: '[Name]', title: 'Children & Family Director', bio: 'Creating safe, engaging environments where kids can discover faith at their own pace.' },
  { name: '[Name]', title: 'Youth Pastor', bio: 'Walking alongside high school students as they navigate faith, identity, and community.' },
  { name: '[Name]', title: 'Operations Director', bio: 'Keeping the church running behind the scenes — facilities, finance, and administration.' },
]

export default function Staff() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1E2024] text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Our Team</span>
          <h1 className="text-4xl md:text-5xl font-bold">Meet Our Staff</h1>
          <p className="text-white/70 text-lg">
            The people who lead, serve, and care for the Mosaic community every day.
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {staff.map((person) => (
            <div key={person.name} className="flex flex-col gap-4">
              <PlaceholderImage label="Photo" aspectRatio="aspect-[3/4]" className="rounded-2xl" />
              <div>
                <h3 className="font-bold text-lg text-[#1E2024]">{person.name}</h3>
                <span className="text-[#0066FF] text-sm font-medium">{person.title}</span>
                <p className="text-[#7F838A] text-sm mt-2 leading-relaxed">{person.bio}</p>
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
