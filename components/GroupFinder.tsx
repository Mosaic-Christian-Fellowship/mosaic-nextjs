'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch, apiPost, type GroupData, type FormResponse } from '@/lib/api'
import SanitizedRichText from '@/components/SanitizedRichText'

const DEMOGRAPHICS = [
  'Young Adults', 'Married Couples', 'Families', 'Moms',
  "Men's", "Women's", '50+', 'Co-Ed',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function GroupFinder() {
  const [groups, setGroups] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [demographic, setDemographic] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [interestForm, setInterestForm] = useState<string | null>(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { type: 'Community Groups' }
      if (demographic) params.demographic = demographic
      if (selectedDays.length > 0) params.days = selectedDays.join(',')

      const res = await apiFetch<GroupData[]>('/api/groups', params)
      setGroups(res.data)
    } catch (err) {
      console.error('Failed to fetch groups:', err)
    } finally {
      setLoading(false)
    }
  }, [demographic, selectedDays])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    if (!selectedGroupId) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedGroupId(null)
    }
    window.addEventListener('keydown', handler)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = prevOverflow
    }
  }, [selectedGroupId])

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const submitInterest = async (groupName: string) => {
    if (!formData.firstName || !formData.lastName || !formData.email) return
    setSubmitting(true)
    try {
      const res = await apiPost<FormResponse>('/api/forms/group-interest', {
        ...formData,
        groupName,
      })
      if (res.success) {
        setSubmitted((prev) => new Set(prev).add(groupName))
        setInterestForm(null)
        setFormData({ firstName: '', lastName: '', email: '', phone: '' })
      }
    } catch (err) {
      console.error('Failed to submit interest:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const renderInterestForm = (group: GroupData) => (
    <div onClick={(e) => e.stopPropagation()} className="mt-4 space-y-2">
      <input
        type="text"
        placeholder="First name *"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
      />
      <input
        type="text"
        placeholder="Last name *"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
      />
      <input
        type="email"
        placeholder="Email *"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={() => submitInterest(group.name)}
          disabled={submitting}
          className="px-4 py-2 bg-[#0066FF] text-white text-sm font-semibold rounded-full hover:bg-[#0041A2] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          onClick={() => setInterestForm(null)}
          className="px-4 py-2 text-sm text-[#7F838A] hover:text-[#1E2024]"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-sm font-semibold text-[#1E2024] mb-2">Who are you?</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDemographic('')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                !demographic
                  ? 'bg-[#0066FF] text-white'
                  : 'border border-[#E5E7EB] text-[#1E2024] hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {DEMOGRAPHICS.map((d) => (
              <button
                key={d}
                onClick={() => setDemographic(d === demographic ? '' : d)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  d === demographic
                    ? 'bg-[#0066FF] text-white'
                    : 'border border-[#E5E7EB] text-[#1E2024] hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1E2024] mb-2">Days available</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedDays.includes(day)
                    ? 'bg-[#0066FF] text-white'
                    : 'border border-[#E5E7EB] text-[#1E2024] hover:bg-slate-50'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && groups.length === 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-200 h-48" />
          ))}
        </div>
      ) : !loading && groups.length === 0 ? (
        <p className="text-center text-[#7F838A] py-12">
          No groups match your filters. Try broadening your search.
        </p>
      ) : (
        <div
          aria-busy={loading}
          className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            loading ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {groups.map((group) => (
            <div
              key={group.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedGroupId(group.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedGroupId(group.id)
                }
              }}
              className="text-left rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-200 cursor-pointer hover:border-[#0066FF]/40 hover:shadow-[0_4px_16px_rgba(0,102,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <h3 className="text-lg font-bold text-[#1E2024]">{group.name}</h3>
                {!submitted.has(group.name) && interestForm !== group.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setInterestForm(group.id)
                    }}
                    className="self-start sm:shrink-0 px-5 py-2.5 border border-[#0066FF] text-[#0066FF] text-sm font-semibold rounded-full hover:bg-[#0066FF] hover:text-white transition-colors"
                  >
                    I&apos;m Interested
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {group.dayOfWeek && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-semibold">
                    {group.dayOfWeek}
                  </span>
                )}
                {group.demographic && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#7F838A] text-xs font-semibold">
                    {group.demographic}
                  </span>
                )}
                {group.location && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#7F838A] text-xs font-semibold">
                    {group.location}
                  </span>
                )}
              </div>
              {group.description && (
                <SanitizedRichText
                  html={group.description}
                  className="text-sm text-[#7F838A] mt-3 line-clamp-3 [&_a]:text-[#0066FF] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-[#1E2024] [&_strong]:font-semibold"
                />
              )}
              <p className="text-xs text-[#7F838A] mt-2">{group.membersCount} members</p>

              {submitted.has(group.name) ? (
                <p className="mt-4 text-sm font-semibold text-[#0066FF]">Interest submitted!</p>
              ) : interestForm === group.id ? (
                renderInterestForm(group)
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Slideout panel */}
      {selectedGroup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="group-panel-title"
          className="fixed inset-0 z-50 flex justify-end motion-safe:animate-[fade-in_200ms_ease-out]"
        >
          <button
            type="button"
            aria-label="Close panel"
            onClick={() => setSelectedGroupId(null)}
            className="absolute inset-0 bg-black/40 cursor-default"
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col motion-safe:animate-[slide-in-right_250ms_ease-out] motion-reduce:animate-[fade-in_200ms_ease-out]">
            <header className="flex items-start justify-between gap-4 p-6 border-b border-[#E5E7EB]">
              <h2 id="group-panel-title" className="text-xl font-bold text-[#1E2024] leading-tight">
                {selectedGroup.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedGroupId(null)}
                aria-label="Close"
                className="shrink-0 -mt-1 -mr-1 p-2 rounded-full text-[#7F838A] hover:bg-[#F5F5F7] transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {selectedGroup.dayOfWeek && (
                  <span className="px-2.5 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-semibold">
                    {selectedGroup.dayOfWeek}
                  </span>
                )}
                {selectedGroup.demographic && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[#7F838A] text-xs font-semibold">
                    {selectedGroup.demographic}
                  </span>
                )}
                {selectedGroup.location && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[#7F838A] text-xs font-semibold">
                    {selectedGroup.location}
                  </span>
                )}
              </div>
              {selectedGroup.description && (
                <SanitizedRichText
                  html={selectedGroup.description}
                  className="text-sm text-[#4B4F56] leading-relaxed [&_p]:mb-3 [&_a]:text-[#0066FF] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-[#1E2024] [&_strong]:font-semibold"
                />
              )}
              <div className="flex flex-col gap-1 pt-2 border-t border-[#E5E7EB]">
                <p className="text-xs uppercase tracking-[0.12em] font-semibold text-[#7F838A]">Members</p>
                <p className="text-sm text-[#1E2024]">{selectedGroup.membersCount} members in this group</p>
              </div>
            </div>
            <footer className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB]">
              {submitted.has(selectedGroup.name) ? (
                <p className="text-sm font-semibold text-[#0066FF] text-center">Interest submitted — we&apos;ll be in touch!</p>
              ) : interestForm === selectedGroup.id ? (
                renderInterestForm(selectedGroup)
              ) : (
                <button
                  type="button"
                  onClick={() => setInterestForm(selectedGroup.id)}
                  className="w-full px-5 py-3 bg-[#0066FF] text-white text-sm font-semibold rounded-full hover:brightness-110 transition-[filter]"
                >
                  I&apos;m Interested
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
