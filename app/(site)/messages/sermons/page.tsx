import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import SermonArchive from '@/components/SermonArchive'

export const metadata: Metadata = {
  title: 'Sermons',
  description:
    'Explore the Mosaic sermon archive — every message rooted in Scripture and the context that makes it come alive.',
}

export default function Sermons() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Sermons"
        subtitle="Every message rooted in Scripture and grounded in the context that makes it come alive."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader heading="All Sermons" />
          <SermonArchive />
        </div>
      </section>
    </div>
  )
}
