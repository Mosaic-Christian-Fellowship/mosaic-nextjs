import { NextRequest, NextResponse } from 'next/server'
import { validateFormInput } from '@/lib/validate'
import { findOrCreatePerson, addNoteToPerson, NOTE_CATEGORIES } from '@/lib/forms/pco-people'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    const validation = validateFormInput(body, {
      required: ['firstName', 'lastName', 'email', 'decision', 'interestedIn'],
      emailField: 'email',
    })
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', errors: validation.errors }, { status: 400 })
    }

    const person = await findOrCreatePerson({
      firstName: body.firstName as string,
      lastName: body.lastName as string,
      email: body.email as string,
      phone: body.phone as string | undefined,
    })

    const lines = [
      `Decision: ${body.decision}`,
      `Interested in: ${body.interestedIn}`,
    ]
    if (body.phone) lines.push(`Phone: ${body.phone}`)

    await addNoteToPerson(
      person.id,
      NOTE_CATEGORIES.REACH,
      `Call to Faith submission:\n${lines.join('\n')}`
    )

    return NextResponse.json({
      success: true,
      personId: person.id,
      created: person.created,
    })
  } catch (err) {
    console.error('POST /api/forms/faith-response error:', err)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
