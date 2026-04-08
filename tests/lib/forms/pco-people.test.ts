import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findOrCreatePerson, addNoteToPerson, NOTE_CATEGORIES } from '@/lib/forms/pco-people'
import * as pco from '@/lib/pco'

vi.mock('@/lib/pco')
const mockedPco = vi.mocked(pco)

beforeEach(() => vi.clearAllMocks())

describe('findOrCreatePerson', () => {
  it('returns existing person when found by email', async () => {
    mockedPco.pcoFetch.mockResolvedValue({
      data: [
        {
          id: '999',
          type: 'Person',
          attributes: { first_name: 'John', last_name: 'Doe' },
        },
      ],
      meta: { total_count: 1 },
    })

    const person = await findOrCreatePerson({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
    })

    expect(person.id).toBe('999')
    expect(person.created).toBe(false)
    expect(mockedPco.pcoPost).not.toHaveBeenCalled()
  })

  it('creates new person with separate email POST when not found', async () => {
    mockedPco.pcoFetch.mockResolvedValue({
      data: [],
      meta: { total_count: 0 },
    })
    // First pcoPost: create person
    mockedPco.pcoPost.mockResolvedValueOnce({
      data: {
        id: '1000',
        type: 'Person',
        attributes: { first_name: 'Jane', last_name: 'Smith' },
      },
    })
    // Second pcoPost: add email
    mockedPco.pcoPost.mockResolvedValueOnce({
      data: { id: 'email1', type: 'Email', attributes: {} },
    })

    const person = await findOrCreatePerson({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@test.com',
    })

    expect(person.id).toBe('1000')
    expect(person.created).toBe(true)
    // Person creation
    expect(mockedPco.pcoPost).toHaveBeenNthCalledWith(1,
      '/people/v2/people',
      expect.objectContaining({
        data: expect.objectContaining({ type: 'Person' }),
      })
    )
    // Email addition (separate call)
    expect(mockedPco.pcoPost).toHaveBeenNthCalledWith(2,
      '/people/v2/people/1000/emails',
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'Email',
          attributes: expect.objectContaining({ address: 'jane@test.com' }),
        }),
      })
    )
    // No phone call (not provided)
    expect(mockedPco.pcoPost).toHaveBeenCalledTimes(2)
  })

  it('creates person with phone when provided', async () => {
    mockedPco.pcoFetch.mockResolvedValue({ data: [], meta: { total_count: 0 } })
    mockedPco.pcoPost
      .mockResolvedValueOnce({ data: { id: '1001', type: 'Person', attributes: {} } })
      .mockResolvedValueOnce({ data: { id: 'email1', type: 'Email', attributes: {} } })
      .mockResolvedValueOnce({ data: { id: 'phone1', type: 'PhoneNumber', attributes: {} } })

    const person = await findOrCreatePerson({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@test.com',
      phone: '2015551234',
    })

    expect(person.id).toBe('1001')
    expect(mockedPco.pcoPost).toHaveBeenCalledTimes(3)
    expect(mockedPco.pcoPost).toHaveBeenNthCalledWith(3,
      '/people/v2/people/1001/phone_numbers',
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'PhoneNumber',
          attributes: expect.objectContaining({ number: '2015551234' }),
        }),
      })
    )
  })
})

describe('addNoteToPerson', () => {
  it('creates a note with category relationship', async () => {
    mockedPco.pcoPost.mockResolvedValue({
      data: { id: 'note1', type: 'Note', attributes: {} },
    })

    await addNoteToPerson('999', NOTE_CATEGORIES.GENERAL, 'Hello from the website')

    expect(mockedPco.pcoPost).toHaveBeenCalledWith(
      '/people/v2/people/999/notes',
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'Note',
          attributes: { note: 'Hello from the website' },
          relationships: {
            note_category: {
              data: { type: 'NoteCategory', id: '105278' },
            },
          },
        }),
      })
    )
  })
})

describe('NOTE_CATEGORIES', () => {
  it('has correct category IDs', () => {
    expect(NOTE_CATEGORIES.GENERAL).toBe('105278')
    expect(NOTE_CATEGORIES.PRAYER_REQUESTS).toBe('105279')
    expect(NOTE_CATEGORIES.REACH).toBe('120285')
  })
})
