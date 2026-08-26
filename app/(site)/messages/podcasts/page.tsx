import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import AudioPanel from '@/components/AudioPanel'

export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    'Extended Cut — the Mosaic podcast. Go deeper than Sunday on Spotify and Apple Podcasts.',
}

const SUBSCRIBE = [
  { label: 'Spotify', href: 'https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR' },
  {
    label: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295',
  },
]

export default function Podcasts() {
  return (
    <div>
      <PageHero
        overline="Listen"
        title="Podcasts"
        subtitle="Go deeper than Sunday. Extended Cut unpacks the sermon, the passage, and what it means for everyday life."
      >
        <div className="flex flex-col items-start gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Subscribe &amp; follow
          </p>
          <div className="flex flex-wrap gap-3">
            {SUBSCRIBE.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 min-h-11 rounded-full hover:bg-white/10 hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2024]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </PageHero>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AudioPanel />
        </div>
      </section>
    </div>
  )
}
