'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch, apiPost, type GroupData, type FormResponse } from '@/lib/api'

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
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-200 h-48" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <p className="text-center text-[#7F838A] py-12">
          No groups match your filters. Try broadening your search.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
            >
              <h3 className="text-lg font-bold text-[#1E2024]">{group.name}</h3>
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
                <p className="text-sm text-[#7F838A] mt-3 line-clamp-3">{group.description}</p>
              )}
              <p className="text-xs text-[#7F838A] mt-2">{group.membersCount} members</p>

              {submitted.has(group.name) ? (
                <p className="mt-4 text-sm font-semibold text-[#0066FF]">Interest submitted!</p>
              ) : interestForm === group.id ? (
                <div className="mt-4 space-y-2">
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
              ) : (
                <button
                  onClick={() => setInterestForm(group.id)}
                  className="mt-4 px-5 py-2.5 border border-[#0066FF] text-[#0066FF] text-sm font-semibold rounded-full hover:bg-[#0066FF] hover:text-white transition-colors"
                >
                  I'm Interested
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
