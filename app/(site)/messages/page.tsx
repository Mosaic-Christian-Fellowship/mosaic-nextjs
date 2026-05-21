import SectionHeader from '@/components/SectionHeader'
import SermonArchive from '@/components/SermonArchive'
import MessageTabs from '@/components/MessageTabs'

const videoPanel = (
  <div className="flex flex-col gap-12">
    <SectionHeader heading="All Sermons" />
    <SermonArchive />
  </div>
)

const audioPanel = (
  <div className="bg-[#1E2024] rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center">
    <div className="flex flex-col gap-6">
      <span className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">
        Podcast
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
        Extended Cut
      </h2>
      <p className="text-white/70 text-lg leading-relaxed">
        Go deeper than Sunday. Extended Cut is our weekly podcast where we
        unpack the sermon, explore the passage in its historical context, and
        discuss what it means for everyday life.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href="https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0066FF] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0041A2] transition-colors text-sm"
        >
          Listen on Spotify
        </a>
        <a
          href="https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
        >
          Apple Podcasts
        </a>
      </div>
    </div>
    <div className="bg-white/10 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl bg-[#0066FF]/30 flex items-center justify-center text-2xl">
          🎙️
        </div>
        <div>
          <p className="text-white font-bold">NJ Mosaic Christian Fellowship</p>
          <p className="text-white/50 text-sm">274 episodes</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[
          { title: 'Latest Episode', date: 'New every week' },
          { title: 'Extended teaching & discussion', date: 'Beyond the Sunday sermon' },
          { title: 'Available everywhere', date: 'Spotify · Apple · YouTube' },
        ].map(({ title, date }) => (
          <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF] text-sm shrink-0">
              ▶
            </div>
            <div>
              <p className="text-white text-sm font-medium">{title}</p>
              <p className="text-white/40 text-xs">{date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

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
