'use client'

import { useState, useEffect } from 'react'
import { apiFetch, formatDuration, formatDate, type SermonData } from '@/lib/api'

interface Props {
  showDescription?: boolean
  apiUrl?: string
}

export default function FeaturedSermon({ showDescription = true }: Props) {
  const [sermon, setSermon] = useState<SermonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<SermonData[]>('/api/sermons', { limit: '1' })
      .then((res) => {
        if (res.data.length > 0) setSermon(res.data[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="animate-pulse rounded-[12px] bg-[#F5F5F7] aspect-video" />
  }

  if (!sermon) return null

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] overflow-hidden bg-white">
      <a
        href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={sermon.thumbnail}
          alt={sermon.title}
          className="w-full aspect-video object-cover"
        />
      </a>
      <div className="p-6 flex flex-col gap-2">
        {sermon.seriesName && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
            {sermon.seriesName}
          </p>
        )}
        <h3 className="text-[20px] font-semibold text-[#1E2024] leading-[1.3]">{sermon.title}</h3>
        <p className="text-sm text-[#7F838A] leading-[1.6]">
          {sermon.speaker && `${sermon.speaker} · `}
          {formatDate(sermon.date)} · {formatDuration(sermon.duration)}
        </p>
        {showDescription && sermon.description && (
          <p className="text-sm text-[#7F838A] leading-[1.6] line-clamp-2 mt-1">{sermon.description}</p>
        )}
        <div className="flex gap-3 mt-3">
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
    </div>
  )
}
