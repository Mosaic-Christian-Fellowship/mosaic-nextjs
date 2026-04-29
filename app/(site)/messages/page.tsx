import SectionHeader from '@/components/SectionHeader'
import FeaturedSermon from '@/components/FeaturedSermon'
import SermonArchive from '@/components/SermonArchive'

export default function Messages() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1E2024] text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Teaching</span>
          <h1 className="text-4xl md:text-5xl font-bold">Messages</h1>
          <p className="text-white/70 text-lg">
            Explore our sermon archive — every message rooted in Scripture and grounded in the context
            that makes it come alive.
          </p>
        </div>
      </section>

      {/* Latest Message */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="Most Recent" heading="Latest Message" />
          <div className="max-w-2xl">
            <FeaturedSermon />
          </div>
        </div>
      </section>

      {/* Extended Cut — Podcast */}
      <section className="py-20 px-6 bg-[#1E2024]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
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
      </section>

      {/* Sermon Archive */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Archive" heading="Browse All Sermons" />
          <SermonArchive />
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <SectionHeader overline="Never Miss a Message" heading="Subscribe & Follow" centered />
          <p className="text-[#7F838A]">Listen wherever you get your podcasts or subscribe on YouTube to get notified of new messages every week.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['YouTube', 'Spotify', 'Apple Podcasts'].map((platform) => (
              <button key={platform} className="border border-[#E5E7EB] px-6 py-3 rounded-full font-medium text-sm hover:border-[#0066FF] hover:text-[#0066FF] transition-colors">
                {platform}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
