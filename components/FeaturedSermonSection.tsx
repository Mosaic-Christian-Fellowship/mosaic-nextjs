import SectionHeader from './SectionHeader'
import MoreLink from './MoreLink'
import FeaturedSermon from './FeaturedSermon'

export default function FeaturedSermonSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader overline="Latest Message" heading="This Week's Sermon" />
          <div className="hidden md:block">
            <MoreLink href="/messages">Browse all messages</MoreLink>
          </div>
        </div>
        <div className="max-w-2xl">
          <FeaturedSermon />
        </div>
        <div className="md:hidden">
          <MoreLink href="/messages" className="w-full justify-center">
            Browse all messages
          </MoreLink>
        </div>
      </div>
    </section>
  )
}
