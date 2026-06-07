import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import SermonArchive from '@/components/SermonArchive'
import MessageTabs from '@/components/MessageTabs'
import AudioPanel from '@/components/AudioPanel'

export const metadata: Metadata = {
  title: 'Messages',
  description:
    'Explore the Mosaic sermon archive — every message rooted in Scripture and the context that makes it come alive. Watch on YouTube or listen on Spotify and Apple Podcasts.',
}

const videoPanel = (
  <div className="flex flex-col gap-12">
    <SectionHeader heading="All Sermons" />
    <SermonArchive />
  </div>
)

const audioPanel = <AudioPanel />

export default function Messages() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Messages"
        subtitle="Explore our sermon archive — every message rooted in Scripture and grounded in the context that makes it come alive."
      >
        <div className="flex flex-col items-start gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Subscribe &amp; follow</p>
          <div className="flex flex-wrap gap-3">
              <a
                href="https://www.youtube.com/channel/UCgI1-OGVDlM5cXy0xhllT_w?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 min-h-11 rounded-full hover:bg-white/10 hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2024]"
              >
                YouTube
              </a>
              <a
                href="https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 min-h-11 rounded-full hover:bg-white/10 hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2024]"
              >
                Spotify
              </a>
              <a
                href="https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 min-h-11 rounded-full hover:bg-white/10 hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2024]"
              >
                Apple Podcasts
              </a>
          </div>
        </div>
      </PageHero>

      {/* Tabs + content */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <MessageTabs
            tabs={[
              { id: 'video', label: 'Video', panel: videoPanel },
              { id: 'audio', label: 'Audio', panel: audioPanel },
            ]}
          />
        </div>
      </section>

    </div>
  )
}
