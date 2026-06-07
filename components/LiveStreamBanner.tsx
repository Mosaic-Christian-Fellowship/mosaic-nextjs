'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch, type LiveStreamStatus } from '@/lib/api'

export default function LiveStreamBanner() {
  const [status, setStatus] = useState<LiveStreamStatus>({ isLive: false, videoId: null, title: null })

  useEffect(() => {
    apiFetch<LiveStreamStatus>('/api/youtube-live')
      .then((res) => setStatus(res.data))
      .catch(console.error)

    // Re-check every 2 minutes
    const interval = setInterval(() => {
      apiFetch<LiveStreamStatus>('/api/youtube-live')
        .then((res) => setStatus(res.data))
        .catch(console.error)
    }, 120_000)

    return () => clearInterval(interval)
  }, [])

  if (status.isLive) {
    return (
      <a
        href={`https://youtube.com/watch?v=${status.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors"
      >
        <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse motion-reduce:animate-none" />
        Watch Live
      </a>
    )
  }

  return (
    <Link
      href="/messages"
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] text-white text-sm font-semibold rounded-full hover:bg-[#0041A2] transition-colors"
    >
      Watch Sermons
    </Link>
  )
}
