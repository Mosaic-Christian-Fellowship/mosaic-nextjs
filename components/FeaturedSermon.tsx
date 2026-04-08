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
    return (
      <div className="animate-pulse rounded-2xl bg-slate-200 aspect-video" />
    )
  }

  if (!sermon) return null

  return (
    <div className="rounded-2xl border border-[#E2E8F0] overflow-hidden bg-white">
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
      <div className="p-6">
        {sermon.seriesName && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2A9D8F] mb-2">
            {sermon.seriesName}
          </p>
        )}
        <h3 className="text-xl font-bold text-[#2D3748] mb-1">{sermon.title}</h3>
        <p className="text-sm text-[#64748B]">
          {sermon.speaker && `${sermon.speaker} · `}
          {formatDate(sermon.date)} · {formatDuration(sermon.duration)}
        </p>
        {showDescription && sermon.description && (
          <p className="text-sm text-[#64748B] mt-3 line-clamp-2">{sermon.description}</p>
        )}
        <div className="flex gap-3 mt-4">
          <a
            href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#4E8EBE] text-white text-sm font-semibold rounded-full hover:bg-[#3E7BA6] transition-colors"
          >
            Watch
          </a>
          {sermon.spotifyUrl && (
            <a
              href={sermon.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-[#E2E8F0] text-[#2D3748] text-sm font-semibold rounded-full hover:bg-slate-50 transition-colors"
            >
              Listen on Spotify
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
