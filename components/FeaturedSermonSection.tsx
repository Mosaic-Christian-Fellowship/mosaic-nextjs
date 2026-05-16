import SectionHeader from './SectionHeader'
import MoreLink from './MoreLink'
import { kvGet } from '@/lib/kv'
import { formatDate, formatDuration, type SermonData } from '@/lib/api'

async function getLatestSermons(): Promise<SermonData[]> {
  try {
    const all = await kvGet<SermonData[]>('sermons:all')
    if (!all || all.length === 0) return []
    return all
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3)
  } catch {
    return []
  }
}

function LargeSermonCard({ sermon }: { sermon: SermonData }) {
  return (
    <article className="rounded-[12px] border border-[#E5E7EB] overflow-hidden bg-white flex flex-col h-full">
      <a
        href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <img
          src={sermon.thumbnail}
          alt={sermon.title}
          className="w-full aspect-video object-cover group-hover:opacity-95 transition-opacity"
        />
      </a>
      <div className="p-6 flex flex-col gap-2 flex-1">
        {sermon.seriesName && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
            {sermon.seriesName}
          </p>
        )}
        <h3 className="text-[22px] font-semibold text-[#1E2024] leading-[1.25]">{sermon.title}</h3>
        <p className="text-sm text-[#7F838A] leading-[1.6]">
          {sermon.speaker && `${sermon.speaker} · `}
          {formatDate(sermon.date)} · {formatDuration(sermon.duration)}
        </p>
        {sermon.description && (
          <p className="text-sm text-[#7F838A] leading-[1.6] line-clamp-2 mt-1">{sermon.description}</p>
        )}
        <div className="flex gap-3 mt-auto pt-4">
          <a
            href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center h-10 px-5 bg-[#0066FF] text-white text-sm font-semibold rounded-[10px] hover:brightness-110 transition-[filter]"
          >
            Watch
          </a>
          {sermon.spotifyUrl && (
            <a
              href={sermon.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-10 px-5 border border-[#E5E7EB] text-[#1E2024] text-sm font-semibold rounded-[10px] hover:bg-[#F5F5F7] transition-colors"
            >
              Listen on Spotify
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function SmallSermonCard({ sermon }: { sermon: SermonData }) {
  return (
    <a
      href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-[12px] border border-[#E5E7EB] overflow-hidden bg-white flex flex-col"
    >
      <img
        src={sermon.thumbnail}
        alt={sermon.title}
        className="w-full aspect-video object-cover group-hover:opacity-95 transition-opacity"
      />
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {sermon.seriesName && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
            {sermon.seriesName}
          </p>
        )}
        <h4 className="text-[15px] font-semibold text-[#1E2024] leading-[1.3] line-clamp-2">
          {sermon.title}
        </h4>
        <p className="text-xs text-[#7F838A] leading-[1.5]">
          {sermon.speaker && `${sermon.speaker} · `}
          {formatDate(sermon.date)}
        </p>
      </div>
    </a>
  )
}

export default async function FeaturedSermonSection() {
  const sermons = await getLatestSermons()
  if (sermons.length === 0) return null

  const [latest, ...rest] = sermons

  return (
    <section className="py-20 md:py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader overline="Latest Message" heading="This Week's Sermon" />
          <div className="hidden md:block">
            <MoreLink href="/messages">Browse all messages</MoreLink>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <LargeSermonCard sermon={latest} />
          </div>
          {rest.length > 0 && (
            <div className="flex flex-col gap-6">
              {rest.map((sermon) => (
                <SmallSermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          )}
        </div>

        <div className="md:hidden">
          <MoreLink href="/messages" className="w-full justify-center">
            Browse all messages
          </MoreLink>
        </div>
      </div>
    </section>
  )
}
