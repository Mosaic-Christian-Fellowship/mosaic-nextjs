'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  apiFetch,
  formatDuration,
  formatDate,
  type SermonData,
  type SeriesData,
} from '@/lib/api'

interface SpeakerEntry {
  name: string
  count: number
}

export default function SermonArchive() {
  const [sermons, setSermons] = useState<SermonData[]>([])
  const [series, setSeries] = useState<SeriesData[]>([])
  const [speakerOptions, setSpeakerOptions] = useState<SpeakerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSeries, setSelectedSeries] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 12
  const sentinelRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchSermons = useCallback(async () => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    try {
      const url = new URL('/api/sermons', window.location.origin)
      url.searchParams.set('page', String(page))
      url.searchParams.set('limit', String(limit))
      if (search) url.searchParams.set('search', search)
      if (selectedSeries) url.searchParams.set('series', selectedSeries)
      if (selectedSpeaker) url.searchParams.set('speaker', selectedSpeaker)

      const res = await fetch(url.toString(), { signal: ac.signal })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const json = await res.json()

      setSermons((prev) => (page === 1 ? json.data : [...prev, ...json.data]))
      setTotal(json.meta?.total ?? 0)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('Failed to fetch sermons:', err)
    } finally {
      if (!ac.signal.aborted) setLoading(false)
    }
  }, [page, search, selectedSeries, selectedSpeaker])

  useEffect(() => {
    fetchSermons()
  }, [fetchSermons])

  useEffect(() => {
    apiFetch<SeriesData[]>('/api/series')
      .then((res) => setSeries(res.data))
      .catch(console.error)
    apiFetch<SpeakerEntry[]>('/api/speakers')
      .then((res) => setSpeakerOptions(res.data))
      .catch(console.error)
  }, [])

  const isDefaultView = !search && !selectedSeries && !selectedSpeaker
  const hasMore = sermons.length < total

  // Auto-trigger Load More when sentinel scrolls into view
  useEffect(() => {
    if (!hasMore || loading) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1)
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading])

  const showInitialSkeleton = sermons.length === 0 && loading

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <label htmlFor="sermon-search" className="sr-only">Search sermons</label>
        <input
          id="sermon-search"
          type="text"
          placeholder="Search sermons..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 px-4 py-2.5 rounded-full border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#0066FF]"
        />
        <label htmlFor="sermon-series-filter" className="sr-only">Filter by series</label>
        <select
          id="sermon-series-filter"
          value={selectedSeries}
          onChange={(e) => { setSelectedSeries(e.target.value); setPage(1) }}
          className="pl-4 pr-8 py-2.5 rounded-full border border-[#E5E7EB] text-sm bg-white"
        >
          <option value="">All Series</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({s.sermonCount})</option>
          ))}
        </select>
        <label htmlFor="sermon-speaker-filter" className="sr-only">Filter by speaker</label>
        <select
          id="sermon-speaker-filter"
          value={selectedSpeaker}
          onChange={(e) => { setSelectedSpeaker(e.target.value); setPage(1) }}
          className="pl-4 pr-8 py-2.5 rounded-full border border-[#E5E7EB] text-sm bg-white"
        >
          <option value="">All Speakers</option>
          {speakerOptions.map((s) => (
            <option key={s.name} value={s.name}>{s.name} ({s.count})</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {showInitialSkeleton ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-200 aspect-video" />
          ))}
        </div>
      ) : sermons.length === 0 ? (
        <p className="text-center text-[#7F838A] py-12">No sermons found.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite" aria-busy={loading}>
            {sermons.map((sermon, idx) => {
              const isLatest = isDefaultView && idx === 0
              return (
                <a
                  key={sermon.id}
                  href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl border overflow-hidden bg-white hover:shadow-md transition-shadow ${
                    isLatest ? 'border-[#0066FF] ring-1 ring-[#0066FF]' : 'border-[#E5E7EB]'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full aspect-video object-cover"
                    />
                    {isLatest && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#0066FF] text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden />
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    {sermon.seriesName && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#0066FF] mb-1">
                        {sermon.seriesName}
                      </p>
                    )}
                    <h3 className="text-sm font-bold text-[#1E2024] group-hover:text-[#0066FF] transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="text-xs text-[#7F838A] mt-1">
                      {sermon.speaker && `${sermon.speaker} · `}
                      {formatDate(sermon.date)} · {formatDuration(sermon.duration)}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Infinite-scroll sentinel + manual load-more affordance */}
          {hasMore ? (
            <div ref={sentinelRef} className="flex justify-center mt-10">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                className="px-6 py-3 min-h-11 rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#1E2024] hover:border-[#0066FF] hover:text-[#0066FF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2"
              >
                {loading ? 'Loading…' : 'Load more sermons'}
              </button>
            </div>
          ) : (
            sermons.length > limit && (
              <p className="text-center text-[#7F838A] text-sm mt-10">
                You&rsquo;ve reached the end — {total} sermons total.
              </p>
            )
          )}
        </>
      )}
    </div>
  )
}
