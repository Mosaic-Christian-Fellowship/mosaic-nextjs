'use client'

import { useState } from 'react'
import { apiPost, type FormResponse } from '@/lib/api'

const VISITOR_TYPES = ['Newcomer', 'Returning Visitor']
const AGE_RANGES = ['College/18-22', '22-35', '35-50', '50+']
const SERVICES = ['9:30 AM', '11:30 AM', '1:30 PM', 'Undecided']
const CHILDREN_OPTIONS = [
  'Infant-K', '1st-2nd', '3rd-5th', 'Middle School', 'High School', 'College', 'Adult Children',
]

const VISITOR_TYPE_IDS: Record<string, string> = {
  'Newcomer': '6660965',
  'Returning Visitor': '6660966',
}
const AGE_RANGE_IDS: Record<string, string> = {
  'College/18-22': '6664883',
  '22-35': '6664978',
  '35-50': '6664980',
  '50+': '6903166',
}
const SERVICE_IDS: Record<string, string> = {
  '9:30 AM': '6660963',
  '11:30 AM': '6660964',
  '1:30 PM': '8031536',
  'Undecided': '8031537',
}

export default function PlanVisitForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    visitorType: '',
    ageRange: '',
    service: '',
    children: [] as string[],
    heardAbout: '',
    anythingElse: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleChild = (opt: string) => {
    setForm((f) => ({
      ...f,
      children: f.children.includes(opt)
        ? f.children.filter((c) => c !== opt)
        : [...f.children, opt],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const newErrors: Record<string, string> = {}
    if (!form.firstName) newErrors.firstName = 'Required'
    if (!form.lastName) newErrors.lastName = 'Required'
    if (!form.email) newErrors.email = 'Required'
    if (!form.visitorType) newErrors.visitorType = 'Required'
    if (!form.ageRange) newErrors.ageRange = 'Required'
    if (!form.service) newErrors.service = 'Required'
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
        visitorType: VISITOR_TYPE_IDS[form.visitorType] || form.visitorType,
        ageRange: AGE_RANGE_IDS[form.ageRange] || form.ageRange,
        service: SERVICE_IDS[form.service] || form.service,
        children: form.children.length > 0 ? form.children : undefined,
        heardAbout: form.heardAbout || undefined,
        anythingElse: form.anythingElse || undefined,
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
        <p className="text-2xl font-bold text-[#2D3748] mb-2">We can't wait to meet you!</p>
        <p className="text-[#64748B]">We've received your information and our welcome team will be ready for you.</p>
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm ${
      errors[field] ? 'border-red-400' : 'border-[#E2E8F0]'
    } focus:outline-none focus:border-[#2A9D8F]`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <p id="form-error" className="text-sm text-red-500 text-center">{errors.form}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="sr-only">First name</label>
          <input id="firstName" type="text" placeholder="First name *" value={form.firstName}
            required
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={inputClass('firstName')} />
          {errors.firstName && <p id="firstName-error" className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="sr-only">Last name</label>
          <input id="lastName" type="text" placeholder="Last name *" value={form.lastName}
            required
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={inputClass('lastName')} />
          {errors.lastName && <p id="lastName-error" className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input id="email" type="email" placeholder="Email *" value={form.email}
            required
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass('email')} />
          {errors.email && <p id="email-error" className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="sr-only">Phone</label>
          <input id="phone" type="tel" placeholder="Phone (optional)" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass('phone')} />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-[#2D3748] mb-2">I am a... *</legend>
        <div className="flex gap-2" role="group">
          {VISITOR_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setForm({ ...form, visitorType: t })}
              aria-pressed={form.visitorType === t}
              className={`px-4 py-2 rounded-full text-sm ${
                form.visitorType === t ? 'bg-[#4E8EBE] text-white' : 'border border-[#E2E8F0]'
              }`}>
              {t}
            </button>
          ))}
        </div>
        {errors.visitorType && <p id="visitorType-error" className="text-xs text-red-500 mt-1">{errors.visitorType}</p>}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[#2D3748] mb-2">Age range *</legend>
        <div className="flex flex-wrap gap-2" role="group">
          {AGE_RANGES.map((a) => (
            <button key={a} type="button" onClick={() => setForm({ ...form, ageRange: a })}
              aria-pressed={form.ageRange === a}
              className={`px-4 py-2 rounded-full text-sm ${
                form.ageRange === a ? 'bg-[#4E8EBE] text-white' : 'border border-[#E2E8F0]'
              }`}>
              {a}
            </button>
          ))}
        </div>
        {errors.ageRange && <p id="ageRange-error" className="text-xs text-red-500 mt-1">{errors.ageRange}</p>}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[#2D3748] mb-2">Service time *</legend>
        <div className="flex flex-wrap gap-2" role="group">
          {SERVICES.map((s) => (
            <button key={s} type="button" onClick={() => setForm({ ...form, service: s })}
              aria-pressed={form.service === s}
              className={`px-4 py-2 rounded-full text-sm ${
                form.service === s ? 'bg-[#4E8EBE] text-white' : 'border border-[#E2E8F0]'
              }`}>
              {s}
            </button>
          ))}
        </div>
        {errors.service && <p id="service-error" className="text-xs text-red-500 mt-1">{errors.service}</p>}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[#2D3748] mb-2">I have children (optional)</legend>
        <div className="flex flex-wrap gap-2" role="group">
          {CHILDREN_OPTIONS.map((c) => (
            <button key={c} type="button" onClick={() => toggleChild(c)}
              aria-pressed={form.children.includes(c)}
              className={`px-4 py-2 rounded-full text-sm ${
                form.children.includes(c) ? 'bg-[#4E8EBE] text-white' : 'border border-[#E2E8F0]'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="heardAbout" className="sr-only">How did you hear about Mosaic?</label>
        <input id="heardAbout" type="text" placeholder="How did you hear about Mosaic? (optional)"
          value={form.heardAbout}
          onChange={(e) => setForm({ ...form, heardAbout: e.target.value })}
          className={inputClass('heardAbout')} />
      </div>

      <div>
        <label htmlFor="anythingElse" className="sr-only">Anything else you'd like us to know?</label>
        <textarea id="anythingElse" placeholder="Anything else you'd like us to know? (optional)"
          value={form.anythingElse}
          onChange={(e) => setForm({ ...form, anythingElse: e.target.value })}
          rows={3}
          className={`${inputClass('anythingElse')} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#4E8EBE] text-white font-semibold rounded-full hover:bg-[#3E7BA6] transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Plan My Visit'}
      </button>
    </form>
  )
}
