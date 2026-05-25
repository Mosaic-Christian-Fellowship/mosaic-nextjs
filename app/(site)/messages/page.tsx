import SectionHeader from '@/components/SectionHeader'
import SermonArchive from '@/components/SermonArchive'
import MessageTabs from '@/components/MessageTabs'
import AudioPanel from '@/components/AudioPanel'

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
      {/* Hero */}
      <section className="bg-[#1E2024] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Teaching</span>
            <h1 className="text-4xl md:text-5xl font-bold">Messages</h1>
            <p className="text-white/70 text-lg">
              Explore our sermon archive — every message rooted in Scripture and grounded in the context
              that makes it come alive.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Subscribe &amp; follow</p>
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
        </div>
      </section>

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
