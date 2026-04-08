import { pcoFetch, pcoPost } from '../pco'

export interface PersonInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface PersonResult {
  id: string
  created: boolean
}

// Note category IDs for Mosaic's PCO org
export const NOTE_CATEGORIES = {
  GENERAL: '105278',
  PRAYER_REQUESTS: '105279',
  REACH: '120285',
} as const

export async function findOrCreatePerson(input: PersonInput): Promise<PersonResult> {
  // Search for existing person by email
  const searchResult = await pcoFetch('/people/v2/people', {
    'where[search_name_or_email]': input.email,
    per_page: '1',
  })

  const existing = Array.isArray(searchResult.data) ? searchResult.data : [searchResult.data]
  if (existing.length > 0 && existing[0].id) {
    return { id: existing[0].id, created: false }
  }

  // Create person (attributes only — no included array)
  const createResult = await pcoPost('/people/v2/people', {
    data: {
      type: 'Person',
      attributes: {
        first_name: input.firstName,
        last_name: input.lastName,
      },
    },
  })

  const person = Array.isArray(createResult.data) ? createResult.data[0] : createResult.data
  const personId = person.id

  // Add email (separate POST)
  await pcoPost(`/people/v2/people/${personId}/emails`, {
    data: {
      type: 'Email',
      attributes: {
        address: input.email,
        location: 'Home',
        primary: true,
      },
    },
  })

  // Add phone if provided (separate POST)
  if (input.phone) {
    await pcoPost(`/people/v2/people/${personId}/phone_numbers`, {
      data: {
        type: 'PhoneNumber',
        attributes: {
          number: input.phone,
          location: 'Mobile',
          primary: true,
        },
      },
    })
  }

  return { id: personId, created: true }
}

export async function addNoteToPerson(
  personId: string,
  categoryId: string,
  note: string
): Promise<void> {
  await pcoPost(`/people/v2/people/${personId}/notes`, {
    data: {
      type: 'Note',
      attributes: {
        note,
      },
      relationships: {
        note_category: {
          data: { type: 'NoteCategory', id: categoryId },
        },
      },
    },
  })
}
