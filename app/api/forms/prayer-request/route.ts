import { NextRequest, NextResponse } from 'next/server'
import { validateFormInput } from '@/lib/validate'
import { findOrCreatePerson, addNoteToPerson, NOTE_CATEGORIES } from '@/lib/forms/pco-people'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    const validation = validateFormInput(body, {
      required: ['prayerRequest'],
      emailField: body.email ? 'email' : undefined,
    })
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', errors: validation.errors }, { status: 400 })
    }

    const person = await findOrCreatePerson({
      firstName: (body.firstName as string) || 'Anonymous',
      lastName: (body.lastName as string) || '',
      email: (body.email as string) || 'anonymous@mosaicnj.org',
    })

    await addNoteToPerson(
      person.id,
      NOTE_CATEGORIES.PRAYER_REQUESTS,
      body.prayerRequest as string
    )

    return NextResponse.json({
      success: true,
      personId: person.id,
      created: person.created,
    })
  } catch (err) {
    console.error('POST /api/forms/prayer-request error:', err)
    return NextResponse.json({ error: 'Failed to submit prayer request. Please try again.' }, { status: 500 })
  }
}
