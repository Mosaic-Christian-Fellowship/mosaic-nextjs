'use client'

import { useState, useEffect } from 'react'
import { apiFetch, formatDate, type SermonData } from '@/lib/api'

export default function AudioPanel() {
  const [episodes, setEpisodes] = useState<SermonData[]>([])
  const [totalWithSpotify, setTotalWithSpotify] = useState(274)

  useEffect(() => {
    apiFetch<SermonData[]>('/api/sermons', { limit: '50' }).then(({ data }) => {
      const withSpotify = data.filter((s) => s.spotifyUrl)
      setEpisodes(withSpotify.slice(0, 3))
      if (withSpotify.length > 0) setTotalWithSpotify(withSpotify.length)
    })
  }, [])

  return (
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
            <p className="text-white/50 text-sm">{totalWithSpotify} episodes</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {episodes.length > 0
            ? episodes.map((ep) => (
                <a
                  key={ep.id}
                  href={ep.spotifyUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF] text-sm shrink-0">
                    ▶
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{ep.title}</p>
                    <p className="text-white/40 text-xs">{ep.speaker} · {formatDate(ep.date)}</p>
                  </div>
                </a>
              ))
            : [
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
}
