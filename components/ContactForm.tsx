'use client'

import { useState } from 'react'
import { apiPost, type FormResponse } from '@/lib/api'

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.firstName) newErrors.firstName = 'Required'
    if (!form.lastName) newErrors.lastName = 'Required'
    if (!form.email) newErrors.email = 'Required'
    if (!form.message) newErrors.message = 'Required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      const res = await apiPost<FormResponse>('/api/forms/contact', form)
      if (res.success) setSuccess(true)
      else setErrors({ form: 'Something went wrong. Please try again.' })
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-bold text-[#1E2024] mb-2">Message sent!</p>
        <p className="text-[#7F838A]">We'll get back to you soon.</p>
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm ${
      errors[field] ? 'border-red-400' : 'border-[#E5E7EB]'
    } focus:outline-none focus:border-[#0066FF]`

  return (
    <form onSubmit={submit} className="space-y-4">
      {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-firstName" className="sr-only">First name</label>
          <input id="contact-firstName" type="text" placeholder="First name *" value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
            aria-describedby={errors.firstName ? 'contact-firstName-error' : undefined}
            className={inputClass('firstName')} />
          {errors.firstName && <p id="contact-firstName-error" className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="contact-lastName" className="sr-only">Last name</label>
          <input id="contact-lastName" type="text" placeholder="Last name *" value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
            aria-describedby={errors.lastName ? 'contact-lastName-error' : undefined}
            className={inputClass('lastName')} />
          {errors.lastName && <p id="contact-lastName-error" className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="sr-only">Email</label>
        <input id="contact-email" type="email" placeholder="Email *" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={inputClass('email')} />
        {errors.email && <p id="contact-email-error" className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">Your message</label>
        <textarea id="contact-message" placeholder="Your message *" value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          required
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${inputClass('message')} resize-none`} />
        {errors.message && <p id="contact-message-error" className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#0066FF] text-white font-semibold rounded-full hover:bg-[#0041A2] transition-colors disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
