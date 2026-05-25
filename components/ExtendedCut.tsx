'use client'

import { useState, useEffect } from 'react'
import { apiFetch, formatDate, type SermonData } from '@/lib/api'

export default function ExtendedCut() {
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
    <section className="py-20 md:py-24 px-6 bg-[#0041A2]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D2F944]">
            Podcast
          </span>
          <h2 className="text-[28px] md:text-[40px] font-semibold text-white leading-[1.15]">
            Extended Cut
          </h2>
          <p className="text-white/80 text-[15px] md:text-base leading-[1.6]">
            Go deeper than Sunday. Extended Cut is our weekly podcast where we unpack the sermon,
            explore the passage in its historical context, and discuss what it means for
            everyday life.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-[50px] px-7 bg-[#0066FF] text-white text-[15px] font-semibold rounded-full hover:brightness-110 transition-[filter]"
              style={{ boxShadow: 'inset 0px 2px 1px 0px rgba(255, 255, 255, 0.2)' }}
            >
              Listen on Spotify
            </a>
            <a
              href="https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-[50px] px-7 border border-white/25 text-white text-[15px] font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Apple Podcasts
            </a>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[12px] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[12px] bg-[#D2F944]/20 flex items-center justify-center text-2xl">
              🎙️
            </div>
            <div>
              <p className="text-white font-semibold text-[15px]">NJ Mosaic Christian Fellowship</p>
              <p className="text-white/50 text-[13px]">{totalWithSpotify} episodes</p>
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
                    className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#D2F944]/20 flex items-center justify-center text-[#D2F944] text-sm shrink-0">
                      ▶
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-[14px] font-medium truncate">{ep.title}</p>
                      <p className="text-white/50 text-[12px]">{ep.speaker} · {formatDate(ep.date)}</p>
                    </div>
                  </a>
                ))
              : [
                  { title: 'Latest Episode', date: 'New every week' },
                  { title: 'Extended teaching & discussion', date: 'Beyond the Sunday sermon' },
                  { title: 'Available everywhere', date: 'Spotify · Apple · YouTube' },
                ].map(({ title, date }) => (
                  <div key={title} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-[#D2F944]/20 flex items-center justify-center text-[#D2F944] text-sm shrink-0">
                      ▶
                    </div>
                    <div>
                      <p className="text-white text-[14px] font-medium">{title}</p>
                      <p className="text-white/50 text-[12px]">{date}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}
