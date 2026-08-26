import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import VideoGrid from '@/components/VideoGrid'
import { kvGet } from '@/lib/kv'
import type { SermonData } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    'Extended Cut — the Mosaic podcast. Go deeper than Sunday on Spotify and Apple Podcasts.',
}

export const revalidate = 600

/** How many episodes the page lists. Roughly 70% of sermons have a matched episode. */
const EPISODE_LIMIT = 12

const SUBSCRIBE = [
  { label: 'Spotify', href: 'https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR' },
  {
    label: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295',
  },
]

/**
 * Episodes are sermons that matched a Spotify episode during sync — not a
 * separate podcast feed — so they carry the same title, date, speaker and
 * thumbnail as their video, and render in the same card as every other page.
 */
async function getEpisodes(): Promise<SermonData[]> {
  try {
    const sermons = (await kvGet<SermonData[]>('sermons:all')) ?? []
    return sermons.filter((s) => s.spotifyUrl).slice(0, EPISODE_LIMIT)
  } catch (err) {
    console.error(
      'Failed to load sermons:all for podcasts:',
      err instanceof Error ? err.message : err
    )
    return []
  }
}

export default async function Podcasts() {
  const episodes = await getEpisodes()

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
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader
            overline="Podcast"
            heading="Extended Cut"
            subtext="Every week we unpack the sermon, explore the passage in its historical context, and discuss what it means for everyday life."
          />
          <VideoGrid
            videos={episodes}
            emptyMessage="Episodes will appear here as they are published."
            linkFor={(v) => v.spotifyUrl!}
          />
        </div>
      </section>
    </div>
  )
}
