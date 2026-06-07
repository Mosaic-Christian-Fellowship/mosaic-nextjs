'use client'

import { useState } from 'react'
import { apiPost, type FormResponse } from '@/lib/api'

export default function PrayerRequestForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    prayerRequest: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.prayerRequest.trim()) {
      setError('Please enter your prayer request.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await apiPost<FormResponse>('/api/forms/prayer-request', {
        prayerRequest: form.prayerRequest,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        email: form.email || undefined,
      })
      if (res.success) setSuccess(true)
      else setError('Something went wrong. Please try again.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-bold text-[#1E2024] mb-2">Thank you for sharing.</p>
        <p className="text-[#6B7280]">Our prayer team will be praying for you.</p>
        <button
          onClick={() => { setSuccess(false); setForm({ firstName: '', lastName: '', email: '', prayerRequest: '' }) }}
          className="mt-4 text-sm text-[#0066FF] font-semibold hover:underline"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && (
        <p id="prayer-error" role="alert" className="text-sm text-red-700 flex items-center gap-1.5">
          <span aria-hidden="true">⚠</span>{error}
        </p>
      )}

      <div>
        <label htmlFor="prayer-request" className="sr-only">Prayer request</label>
        <textarea
          id="prayer-request"
          placeholder="What would you like prayer for? *"
          value={form.prayerRequest}
          onChange={(e) => setForm({ ...form, prayerRequest: e.target.value })}
          rows={4}
          required
          aria-describedby={error ? 'prayer-error' : undefined}
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:border-[#0066FF] resize-none"
        />
      </div>

      <p id="optional-fields-help" className="text-xs text-[#6B7280]">Name and email are optional — you can submit anonymously.</p>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label htmlFor="first-name" className="sr-only">First name</label>
          <input type="text" id="first-name" autoComplete="given-name" placeholder="First name" value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            aria-describedby="optional-fields-help"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:border-[#0066FF]" />
        </div>
        <div>
          <label htmlFor="last-name" className="sr-only">Last name</label>
          <input type="text" id="last-name" autoComplete="family-name" placeholder="Last name" value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            aria-describedby="optional-fields-help"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:border-[#0066FF]" />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input type="email" id="email" autoComplete="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-describedby="optional-fields-help"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:border-[#0066FF]" />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#0066FF] text-white font-semibold rounded-[10px] hover:bg-[#0041A2] transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Prayer Request'}
      </button>
    </form>
  )
}
