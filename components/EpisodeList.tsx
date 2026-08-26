import { formatDate, formatDuration, type PodcastEpisode } from '@/lib/api'

interface EpisodeListProps {
  episodes: PodcastEpisode[]
  emptyMessage?: string
}

const linkClass =
  'inline-flex items-center justify-center px-4 py-2 min-h-11 rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#1E2024] hover:border-[#0066FF] hover:text-[#0066FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2'

/**
 * The podcast archive as a list, not a card grid. Every episode shares the same
 * cover art, so a thumbnail per row would repeat one image 24 times and push
 * the titles out of view — the row itself carries the information instead.
 *
 * Rows are not links. Each episode has two possible destinations and no page of
 * its own on this site, so the choice belongs to the reader.
 */
export default function EpisodeList({
  episodes,
  emptyMessage = 'Episodes will appear here as they are published.',
}: EpisodeListProps) {
  if (episodes.length === 0) {
    return <p className="text-center text-[#6B7280] py-12">{emptyMessage}</p>
  }

  return (
    <ul className="border-t border-[#E5E7EB]">
      {episodes.map((episode) => (
        <li
          key={episode.id}
          className="border-b border-[#E5E7EB] py-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
        >
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-[#1E2024] text-balance">{episode.title}</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              {/* Dates arrive as YYYY-MM-DD. Parsed bare they land on UTC
                  midnight and render a day early west of Greenwich. */}
              {formatDate(`${episode.date}T12:00:00`)} ·{' '}
              {formatDuration(Math.round(episode.durationMs / 1000))}
            </p>
            {episode.description && (
              <p className="mt-2 text-sm text-[#6B7280] line-clamp-2">{episode.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <a
              href={episode.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              aria-label={`Listen to ${episode.title} on Spotify`}
            >
              Spotify
            </a>
            {/* Apple exposes only its 200 most recent episodes, so older rows
                carry a Spotify link alone rather than a button that would drop
                the reader on the show's front page. */}
            {episode.appleUrl && (
              <a
                href={episode.appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label={`Listen to ${episode.title} on Apple Podcasts`}
              >
                Apple Podcasts
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
