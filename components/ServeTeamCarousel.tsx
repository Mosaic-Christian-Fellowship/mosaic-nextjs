'use client'

import { useState, useEffect } from 'react'
import { apiFetch, apiPost, type GroupData, type FormResponse } from '@/lib/api'

export default function ServeTeamCarousel() {
  const [teams, setTeams] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [interestForm, setInterestForm] = useState<string | null>(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())

  useEffect(() => {
    apiFetch<GroupData[]>('/api/groups', { type: 'Serve Board' })
      .then((res) => setTeams(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const visibleCount = 3
  const maxIndex = Math.max(0, teams.length - visibleCount)

  const submitInterest = async (teamName: string) => {
    if (!formData.firstName || !formData.lastName || !formData.email) return
    setSubmitting(true)
    try {
      const res = await apiPost<FormResponse>('/api/forms/serve-interest', {
        ...formData,
        teams: [teamName],
      })
      if (res.success) {
        setSubmitted((prev) => new Set(prev).add(teamName))
        setInterestForm(null)
        setFormData({ firstName: '', lastName: '', email: '', phone: '' })
      }
    } catch (err) {
      console.error('Failed to submit:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-1/3 animate-pulse rounded-2xl bg-slate-200 aspect-[3/4]" />
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Navigation */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setScrollIndex((i) => Math.max(0, i - 1))}
          disabled={scrollIndex === 0}
          aria-label="Previous teams"
          className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center disabled:opacity-30"
        >
          ←
        </button>
        <button
          onClick={() => setScrollIndex((i) => Math.min(maxIndex, i + 1))}
          disabled={scrollIndex >= maxIndex}
          aria-label="Next teams"
          className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center disabled:opacity-30"
        >
          →
        </button>
      </div>

      {/* Cards */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-300"
          style={{ transform: `translateX(-${scrollIndex * (100 / visibleCount + 2)}%)` }}
        >
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex-shrink-0 w-[calc(33.333%-1rem)] rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden"
            >
              <div className="aspect-[3/4] bg-slate-200 relative">
                {team.headerImage ? (
                  <img src={team.headerImage} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                    [ {team.name} ]
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-[#2D3748]">{team.name}</h3>
                {team.description && (
                  <p className="text-sm text-[#64748B] mt-1 line-clamp-2">{team.description}</p>
                )}

                {submitted.has(team.name) ? (
                  <p className="mt-3 text-sm font-semibold text-[#2A9D8F]">Interest submitted!</p>
                ) : interestForm === team.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      submitInterest(team.name)
                    }}
                    className="mt-3 space-y-2"
                  >
                    <label htmlFor={`serve-firstName-${team.id}`} className="sr-only">
                      First name
                    </label>
                    <input
                      id={`serve-firstName-${team.id}`}
                      type="text"
                      placeholder="First name *"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm"
                    />
                    <label htmlFor={`serve-lastName-${team.id}`} className="sr-only">
                      Last name
                    </label>
                    <input
                      id={`serve-lastName-${team.id}`}
                      type="text"
                      placeholder="Last name *"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm"
                    />
                    <label htmlFor={`serve-email-${team.id}`} className="sr-only">
                      Email
                    </label>
                    <input
                      id={`serve-email-${team.id}`}
                      type="email"
                      placeholder="Email *"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-[#4E8EBE] text-white text-sm font-semibold rounded-full disabled:opacity-50"
                      >
                        {submitting ? '...' : 'Join'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterestForm(null)}
                        className="px-4 py-2 text-sm text-[#64748B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setInterestForm(team.id)}
                    className="mt-3 px-5 py-2 bg-[#4E8EBE] text-white text-sm font-semibold rounded-full hover:bg-[#3E7BA6] transition-colors"
                  >
                    Join This Team
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
