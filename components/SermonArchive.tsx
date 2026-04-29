'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  apiFetch,
  formatDuration,
  formatDate,
  type SermonData,
  type SeriesData,
} from '@/lib/api'

export default function SermonArchive() {
  const [sermons, setSermons] = useState<SermonData[]>([])
  const [series, setSeries] = useState<SeriesData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSeries, setSelectedSeries] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 12

  const fetchSermons = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
      }
      if (search) params.search = search
      if (selectedSeries) params.series = selectedSeries
      if (selectedSpeaker) params.speaker = selectedSpeaker

      const res = await apiFetch<SermonData[]>('/api/sermons', params)
      setSermons(res.data)
      setTotal(res.meta?.total ?? 0)
    } catch (err) {
      console.error('Failed to fetch sermons:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, selectedSeries, selectedSpeaker])

  useEffect(() => {
    fetchSermons()
  }, [fetchSermons])

  useEffect(() => {
    apiFetch<SeriesData[]>('/api/series')
      .then((res) => setSeries(res.data))
      .catch(console.error)
  }, [])

  const speakers = [...new Set(sermons.map((s) => s.speaker).filter(Boolean))] as string[]
  const totalPages = Math.ceil(total / limit)

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
          className="px-4 py-2.5 rounded-full border border-[#E5E7EB] text-sm bg-white"
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
          className="px-4 py-2.5 rounded-full border border-[#E5E7EB] text-sm bg-white"
        >
          <option value="">All Speakers</option>
          {speakers.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-200 aspect-video" />
          ))}
        </div>
      ) : sermons.length === 0 ? (
        <p className="text-center text-[#7F838A] py-12">No sermons found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <a
              key={sermon.id}
              href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <img
                src={sermon.thumbnail}
                alt={sermon.title}
                className="w-full aspect-video object-cover"
              />
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
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            aria-label="Previous page"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full border border-[#E5E7EB] text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-[#7F838A]">
            Page {page} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full border border-[#E5E7EB] text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
