import { pcoFetch, type PcoRecord } from '../pco'
import { parseGroupName } from '../parsers'

export const PUBLIC_GROUP_TYPES = [
  'Serve Board',
  'Community Groups',
  'Outreach Opportunities',
  'Unique Groups',
  'Sports Ministry',
]

export interface GroupData {
  id: string
  name: string
  description: string
  groupType: string
  headerImage: string | null
  membersCount: number
  dayOfWeek: string | null
  location: string | null
  demographic: string
  contactEmail: string | null
  enrollmentOpen: boolean
}

export async function syncGroups(): Promise<GroupData[]> {
  const response = await pcoFetch('/groups/v2/groups', {
    per_page: '100',
    include: 'group_type',
  })

  const groups = Array.isArray(response.data) ? response.data : [response.data]
  const included = response.included ?? []

  // Build group type lookup
  const typeMap = new Map<string, { name: string; visible: boolean }>()
  for (const inc of included) {
    if (inc.type === 'GroupType') {
      typeMap.set(inc.id, {
        name: inc.attributes.name as string,
        visible: inc.attributes.church_center_visible as boolean,
      })
    }
  }

  const result: GroupData[] = []

  for (const group of groups) {
    const typeRel = group.relationships?.group_type?.data
    const typeId = Array.isArray(typeRel) ? typeRel[0]?.id : typeRel?.id
    const groupType = typeId ? typeMap.get(typeId) : null

    // Filter: only public group types
    if (!groupType?.visible) continue
    if (!PUBLIC_GROUP_TYPES.includes(groupType.name)) continue

    const attrs = group.attributes
    const parsed = parseGroupName(attrs.name as string)
    const headerImg = attrs.header_image as Record<string, string | null> | null

    result.push({
      id: group.id,
      name: attrs.name as string,
      description: (attrs.description as string) || '',
      groupType: groupType.name,
      headerImage: headerImg?.original || null,
      membersCount: (attrs.memberships_count as number) || 0,
      dayOfWeek: parsed.dayOfWeek,
      location: parsed.location,
      demographic: parsed.demographic,
      contactEmail: (attrs.contact_email as string) || null,
      enrollmentOpen: (attrs.enrollment_strategy as string) !== 'closed',
    })
  }

  return result
}
