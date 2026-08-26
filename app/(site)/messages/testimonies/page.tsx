import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import VideoGrid from '@/components/VideoGrid'
import { kvGet } from '@/lib/kv'
import type { SermonData } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Testimonies',
  description:
    'Stories from the Mosaic family — ordinary people describing what God has done in their lives.',
}

export const revalidate = 600

async function getTestimonies(): Promise<SermonData[]> {
  try {
    // Read the cache directly rather than through /api/videos — this is a
    // server component, so an HTTP round trip back to our own origin buys
    // nothing.
    return (await kvGet<SermonData[]>('videos:testimonies')) ?? []
  } catch (err) {
    console.error(
      'Failed to load videos:testimonies:',
      err instanceof Error ? err.message : err
    )
    return []
  }
}

export default async function Testimonies() {
  const videos = await getTestimonies()

  return (
    <div>
      <PageHero
        overline="Stories"
        title="Testimonies"
        subtitle="Ordinary people describing what God has done in their lives — in their own words."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader heading="All Testimonies" />
          <VideoGrid
            videos={videos}
            emptyMessage="Testimonies will appear here as they are published."
          />
        </div>
      </section>
    </div>
  )
}
