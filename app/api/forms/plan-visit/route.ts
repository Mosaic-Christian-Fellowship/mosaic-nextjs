import { NextRequest, NextResponse } from 'next/server'
import { validateFormInput } from '@/lib/validate'
import { findOrCreatePerson, addNoteToPerson, NOTE_CATEGORIES } from '@/lib/forms/pco-people'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    const validation = validateFormInput(body, {
      required: ['firstName', 'lastName', 'email', 'visitorType', 'ageRange', 'service'],
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

    // Build structured note with all form fields
    const lines = [
      `Visitor Type: ${body.visitorType}`,
      `Age Range: ${body.ageRange}`,
      `Service: ${body.service}`,
    ]
    if (body.phone) lines.push(`Phone: ${body.phone}`)
    if (body.children) {
      const children = Array.isArray(body.children) ? body.children.join(', ') : body.children
      lines.push(`Children: ${children}`)
    }
    if (body.heardAbout) lines.push(`How did you hear: ${body.heardAbout}`)
    if (body.anythingElse) lines.push(`Additional: ${body.anythingElse}`)

    await addNoteToPerson(
      person.id,
      NOTE_CATEGORIES.REACH,
      `Plan Your Visit submission:\n${lines.join('\n')}`
    )

    return NextResponse.json({
      success: true,
      personId: person.id,
      created: person.created,
    })
  } catch (err) {
    console.error('POST /api/forms/plan-visit error:', err)
    return NextResponse.json({ error: 'Failed to submit form. Please try again.' }, { status: 500 })
  }
}
