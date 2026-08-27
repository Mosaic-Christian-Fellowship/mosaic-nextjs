import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/forms/plan-visit/route'
import * as pcoPeople from '@/lib/forms/pco-people'

vi.mock('@/lib/forms/pco-people', async (importOriginal) => {
  const actual = await importOriginal<typeof pcoPeople>()
  return {
    ...actual,
    findOrCreatePerson: vi.fn(),
    addNoteToPerson: vi.fn(),
  }
})

const mocked = vi.mocked(pcoPeople)

const submit = (body: Record<string, unknown>) =>
  POST(
    new NextRequest('https://example.com/api/forms/plan-visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )

const validSubmission = {
  firstName: 'Sam',
  lastName: 'Rivera',
  email: 'sam@example.com',
  visitorType: 'first-time visitor',
}

/** The note body handed to Planning Center for the most recent submission. */
const noteBody = () => mocked.addNoteToPerson.mock.calls[0][2]

beforeEach(() => {
  vi.clearAllMocks()
  mocked.findOrCreatePerson.mockResolvedValue({ id: '123', created: true })
  mocked.addNoteToPerson.mockResolvedValue(undefined as never)
})

describe('POST /api/forms/plan-visit', () => {
  it('accepts a submission without the age, service and children fields', async () => {
    // Those three were required until the form dropped them. Leaving them in
    // the required list would reject every submission from the current form.
    const res = await submit(validSubmission)

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true, personId: '123' })
  })

  it('writes the visitor type as a readable label, not a Planning Center id', async () => {
    // Regression: the form used to submit option IDs, so the welcome team read
    // "Visitor Type: 6660965" on the person's record.
    await submit(validSubmission)

    expect(noteBody()).toContain('Visitor type: first-time visitor')
    expect(noteBody()).not.toMatch(/\b\d{7}\b/)
  })

  it('includes what the visitor chose to share about themselves', async () => {
    await submit({
      ...validSubmission,
      phone: '201-555-0143',
      heardAbout: 'A friend from work',
      aboutYou: 'Two kids under five, hoping for the 9:30.',
    })

    const note = noteBody()
    expect(note).toContain('Phone: 201-555-0143')
    expect(note).toContain('How they heard about us: A friend from work')
    expect(note).toContain('About them: Two kids under five, hoping for the 9:30.')
  })

  it('leaves out the optional lines when they are blank', async () => {
    await submit(validSubmission)

    const note = noteBody()
    expect(note).not.toContain('Phone:')
    expect(note).not.toContain('About them:')
  })

  it('files the note under Reach, where the welcome team looks', async () => {
    await submit(validSubmission)

    expect(mocked.addNoteToPerson).toHaveBeenCalledWith(
      '123',
      pcoPeople.NOTE_CATEGORIES.REACH,
      expect.any(String)
    )
  })

  it('rejects a submission with no visitor type', async () => {
    const { visitorType, ...withoutType } = validSubmission
    void visitorType
    const res = await submit(withoutType)

    expect(res.status).toBe(400)
    expect(mocked.findOrCreatePerson).not.toHaveBeenCalled()
  })

  it('rejects a malformed email before touching Planning Center', async () => {
    const res = await submit({ ...validSubmission, email: 'not-an-email' })

    expect(res.status).toBe(400)
    expect(mocked.findOrCreatePerson).not.toHaveBeenCalled()
  })
})
