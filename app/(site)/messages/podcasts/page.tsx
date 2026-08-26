import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import EpisodeList from '@/components/EpisodeList'
import Pagination from '@/components/Pagination'
import { kvGet } from '@/lib/kv'
import { APPLE_PODCAST_SHOW_URL } from '@/lib/sync/config'
import type { PodcastEpisode } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    'Every Mosaic message as a podcast episode — listen on Spotify or Apple Podcasts.',
}

export const revalidate = 600

const PER_PAGE = 24
const BASE_PATH = '/messages/podcasts'
const LIST_ANCHOR = 'episodes'

const SUBSCRIBE = [
  { label: 'Spotify', href: 'https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR' },
  { label: 'Apple Podcasts', href: APPLE_PODCAST_SHOW_URL },
]

/**
 * The full archive, synced from the Spotify show by `lib/sync/podcast.ts`.
 * This used to filter `sermons:all` for entries that happened to match an
 * episode, which meant an episode only appeared if it also had a video.
 */
async function getEpisodes(): Promise<PodcastEpisode[]> {
  try {
    return (await kvGet<PodcastEpisode[]>('podcast:episodes')) ?? []
  } catch (err) {
    console.error(
      'Failed to load podcast:episodes:',
      err instanceof Error ? err.message : err
    )
    return []
  }
}

export default async function Podcasts({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const episodes = await getEpisodes()
  const { page: pageParam } = await searchParams

  const totalPages = Math.max(1, Math.ceil(episodes.length / PER_PAGE))
  const requested = parseInt(pageParam ?? '', 10)
  const page = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), totalPages)
  const pageEpisodes = episodes.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <PageHero
        overline="Listen"
        title="Podcasts"
        subtitle="Every message from Mosaic, wherever you already listen. Catch the one you missed on the drive, on a walk, or over the dishes."
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

      <section id={LIST_ANCHOR} className="py-20 px-6 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader
            overline="Podcast"
            heading="All Episodes"
            subtext={
              episodes.length > 0
                ? `The complete archive — ${episodes.length} episodes, newest first.`
                : 'The complete archive, newest first.'
            }
          />
          <div className="flex flex-col gap-10">
            <EpisodeList episodes={pageEpisodes} />
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath={BASE_PATH}
              anchor={LIST_ANCHOR}
              label="Episodes"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
