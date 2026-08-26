import { formatDate, formatDuration, type SermonData } from '@/lib/api'
import { speakerLabel } from '@/lib/parsers'

/** Where a card points by default: the video on YouTube. */
const youtubeWatchUrl = (v: SermonData) => `https://www.youtube.com/watch?v=${v.youtubeId}`

/**
 * A grid of video cards. Presentational and source-agnostic: sermons,
 * testimonies and podcasts all render the same card, so the three pages do not
 * fork three grids that then drift apart.
 *
 * `linkFor` exists because the podcasts page lists the same records but sends
 * the visitor to Spotify rather than YouTube. Hardcoding the YouTube URL here
 * would have forced a second, near-identical card component the first time a
 * caller needed a different destination.
 *
 * Container queries rather than viewport breakpoints — this sits inside a full
 * page today and inside a narrower column later.
 */
export default function VideoGrid({
  videos,
  emptyMessage,
  linkFor = youtubeWatchUrl,
}: {
  videos: SermonData[]
  emptyMessage: string
  linkFor?: (video: SermonData) => string
}) {
  if (videos.length === 0) {
    return <p className="text-[15px] text-[#6B7280] leading-[1.6]">{emptyMessage}</p>
  }

  return (
    <div className="@container">
      <ul className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-6 list-none p-0 m-0">
        {videos.map((v) => {
          const speaker = speakerLabel(v.speaker)
          return (
            <li key={v.id}>
              <a
                href={linkFor(v)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 rounded-2xl overflow-hidden border border-[#DBDDE0] bg-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
                <div className="flex flex-col gap-1 p-4 pt-1">
                  <h3 className="text-[15px] font-semibold text-[#1E2024] leading-[1.3] text-balance group-hover:text-[#0066FF] transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-[1.5]">
                    {speaker && `${speaker} · `}
                    {formatDate(v.date)} · {formatDuration(v.duration)}
                  </p>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
