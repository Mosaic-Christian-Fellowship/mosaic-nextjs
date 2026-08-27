'use client'

import { useState } from 'react'
import { apiPost, type FormResponse } from '@/lib/api'

/**
 * Two choices, phrased the way a visitor would describe themselves. They map to
 * the two groups the welcome team already sorts by.
 *
 * These used to be submitted as Planning Center form-field option IDs
 * ('6660965'). Those IDs only mean anything to the Forms API, which our access
 * token cannot post to — so the ID landed verbatim in the note on the person's
 * record and the welcome team read "Visitor Type: 6660965". The label goes now.
 */
const VISITOR_TYPES = ['first-time visitor', 'coming back after a while']

export default function PlanVisitForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    visitorType: '',
    heardAbout: '',
    aboutYou: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const newErrors: Record<string, string> = {}
    if (!form.firstName) newErrors.firstName = 'Required'
    if (!form.lastName) newErrors.lastName = 'Required'
    if (!form.email) newErrors.email = 'Required'
    if (!form.visitorType) newErrors.visitorType = 'Required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      const res = await apiPost<FormResponse>('/api/forms/plan-visit', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        visitorType: form.visitorType,
        heardAbout: form.heardAbout || undefined,
        aboutYou: form.aboutYou || undefined,
      })
      if (res.success) {
        setSuccess(true)
      } else if (res.errors) {
        const fieldErrors: Record<string, string> = {}
        res.errors.forEach((e) => { fieldErrors[e.field] = e.message })
        setErrors(fieldErrors)
      }
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-bold text-[#1E2024] mb-2">We can&apos;t wait to meet you!</p>
        <p className="text-[#6B7280]">We&apos;ve received your information and our welcome team will be ready for you.</p>
      </div>
    )
  }

  /*
    White fill against the section's #F5F5F7 ground, so a field reads as
    somewhere to type rather than as another panel. #D1D5DB borders instead of
    #E5E7EB: the lighter grey disappeared against the tint. Corners are 8px —
    enough to match the site, not so much that a one-line input reads as a pill.
  */
  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border bg-white text-sm text-[#1E2024] transition-colors hover:border-[#9CA3AF] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/40 ${
      errors[field] ? 'border-red-500' : 'border-[#D1D5DB]'
    }`

  const labelClass = 'block text-sm font-semibold text-[#1E2024] mb-1.5'

  /* Choice pills stay round — they are buttons, not fields. */
  const optionClass = (selected: boolean) =>
    `inline-flex items-center gap-1.5 px-4 py-2.5 min-h-11 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 ${
      selected
        ? 'bg-[#0066FF] text-white font-semibold hover:bg-[#0041A2]'
        : 'bg-white border border-[#D1D5DB] text-[#1E2024] hover:border-[#0066FF] hover:text-[#0066FF]'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-xs text-[#6B7280]"><span aria-hidden="true">*</span> Required field</p>
      {errors.form && (
        <p id="form-error" role="alert" className="text-sm text-red-700 text-center flex items-center justify-center gap-1.5">
          <span aria-hidden="true">⚠</span>{errors.form}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name <span aria-hidden="true">*</span>
          </label>
          <input id="firstName" type="text" autoComplete="given-name" value={form.firstName}
            required
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={inputClass('firstName')} />
          {errors.firstName && <p id="firstName-error" className="text-xs text-red-700 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name <span aria-hidden="true">*</span>
          </label>
          <input id="lastName" type="text" autoComplete="family-name" value={form.lastName}
            required
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={inputClass('lastName')} />
          {errors.lastName && <p id="lastName-error" className="text-xs text-red-700 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input id="email" type="email" autoComplete="email" value={form.email}
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass('email')} />
          {errors.email && <p id="email-error" className="text-xs text-red-700 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" type="tel" autoComplete="tel" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass('phone')} />
        </div>
      </div>

      {/* Label and options share one line — two short choices, so dropping the
          reader to a second row for them wastes the width.
          A labelled group rather than fieldset/legend: browsers special-case
          how a <legend> lays out, and it does not behave as a flex item. */}
      <div
        role="group"
        aria-labelledby="visitorType-label"
        aria-describedby={errors.visitorType ? 'visitorType-error' : undefined}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span id="visitorType-label" className="text-sm font-semibold text-[#1E2024]">
            I am a&hellip; <span aria-hidden="true">*</span>
          </span>
          {VISITOR_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setForm({ ...form, visitorType: t })}
              aria-pressed={form.visitorType === t}
              className={optionClass(form.visitorType === t)}>
              {form.visitorType === t && <span aria-hidden="true">✓</span>}
              {t}
            </button>
          ))}
        </div>
        {errors.visitorType && <p id="visitorType-error" className="text-xs text-red-700 mt-1">{errors.visitorType}</p>}
      </div>

      <div>
        <label htmlFor="heardAbout" className={labelClass}>How did you hear about Mosaic?</label>
        <input id="heardAbout" type="text" value={form.heardAbout}
          onChange={(e) => setForm({ ...form, heardAbout: e.target.value })}
          className={inputClass('heardAbout')} />
      </div>

      <div>
        <label htmlFor="aboutYou" className={labelClass}>Tell us a little about yourself</label>
        <textarea id="aboutYou" value={form.aboutYou}
          onChange={(e) => setForm({ ...form, aboutYou: e.target.value })}
          rows={4}
          aria-describedby="aboutYou-help"
          className={`${inputClass('aboutYou')} resize-none`} />
        <p id="aboutYou-help" className="text-xs text-[#6B7280] mt-2 leading-relaxed">
          We won&apos;t share your information with anyone. If you mention your age, whether you have
          children, or which service you&apos;re thinking of coming to, we can connect you with the
          right person to meet you.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 min-h-11 bg-[#0066FF] text-white font-semibold rounded-lg transition-colors hover:bg-[#0041A2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:hover:bg-[#0066FF]"
      >
        {submitting ? 'Submitting...' : 'Plan My Visit'}
      </button>
    </form>
  )
}
