import { NextRequest, NextResponse } from 'next/server'
import { validateFormInput } from '@/lib/validate'
import { findOrCreatePerson, addNoteToPerson, NOTE_CATEGORIES } from '@/lib/forms/pco-people'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    const validation = validateFormInput(body, {
      required: ['firstName', 'lastName', 'email', 'visitorType'],
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

    // The note is what the welcome team actually reads on the person's record,
    // so every line has to be plain English. The visitor type used to arrive as
    // a Planning Center option ID and printed as "Visitor Type: 6660965"; the
    // form sends the label now.
    //
    // Age range, service time and children are no longer asked for. Anything a
    // visitor wants to share about them comes through "about", where they chose
    // to say it.
    const lines = [`Visitor type: ${body.visitorType}`]
    if (body.phone) lines.push(`Phone: ${body.phone}`)
    if (body.heardAbout) lines.push(`How they heard about us: ${body.heardAbout}`)
    if (body.aboutYou) lines.push(`About them: ${body.aboutYou}`)

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
