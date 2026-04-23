import Link from 'next/link'
import SectionHeader from './SectionHeader'
import FeaturedSermon from './FeaturedSermon'

export default function FeaturedSermonSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <SectionHeader overline="Latest Message" heading="This Week's Sermon" />
        <div className="max-w-2xl">
          <FeaturedSermon />
        </div>
        <Link
          href="/messages"
          className="text-[#0066FF] font-medium text-[15px] hover:opacity-70 transition-opacity"
        >
          Browse all messages →
        </Link>
      </div>
    </section>
  )
}
