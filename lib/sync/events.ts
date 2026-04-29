import { pcoFetch, type PcoRecord } from '../pco'

export interface EventData {
  id: string
  eventId: string
  recurringEventId: string
  name: string
  description: string
  summary: string
  startsAt: string
  endsAt: string
  allDay: boolean
  location: string | null
  imageUrl: string | null
  featured: boolean
  visibleInChurchCenter: boolean
  hasRegistration: boolean
  churchCenterUrl: string | null
  registrationUrl: string | null
  recurrenceDescription: string | null
}

export async function syncEvents(): Promise<EventData[]> {
  // Fetch future event instances within 30-day window
  const now = new Date()
  const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const response = await pcoFetch('/calendar/v2/event_instances', {
    filter: 'future',
    per_page: '100',
    order: 'starts_at',
    include: 'event',
    'where[ends_at][lte]': thirtyDaysOut.toISOString(),
  })

  const instances = Array.isArray(response.data) ? response.data : [response.data]
  const included = response.included ?? []

  // Build event lookup from included data
  const eventMap = new Map<string, PcoRecord>()
  for (const inc of included) {
    if (inc.type === 'Event') {
      eventMap.set(inc.id, inc)
    }
  }

  // Build event data, filtering to visible_in_church_center only
  const events: EventData[] = []

  for (const inst of instances) {
    const eventRel = inst.relationships?.event?.data
    const eventId = Array.isArray(eventRel) ? eventRel[0]?.id : eventRel?.id
    if (!eventId) continue

    const event = eventMap.get(eventId)
    if (!event) continue

    // Filter: only public events
    if (!event.attributes.visible_in_church_center) continue

    const registrationUrl = (event.attributes.registration_url as string) || null

    events.push({
      id: inst.id,
      eventId,
      recurringEventId: eventId,
      name: (inst.attributes.name as string) || (event.attributes.name as string) || '',
      description: (event.attributes.description as string) || '',
      summary: (event.attributes.summary as string) || '',
      startsAt: inst.attributes.starts_at as string,
      endsAt: inst.attributes.ends_at as string,
      allDay: (inst.attributes.all_day_event as boolean) || false,
      location: (inst.attributes.location as string) || null,
      imageUrl: (event.attributes.image_url as string) || null,
      featured: (event.attributes.featured as boolean) || false,
      visibleInChurchCenter: true,
      hasRegistration: registrationUrl !== null,
      churchCenterUrl: (inst.attributes.church_center_url as string) || null,
      registrationUrl,
      recurrenceDescription: (inst.attributes.compact_recurrence_description as string) || null,
    })
  }

  return events
}
