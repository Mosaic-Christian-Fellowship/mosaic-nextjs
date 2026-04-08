import { defineType, defineField } from 'sanity'

export const serviceTime = defineType({
  name: 'serviceTime',
  title: 'Service Time',
  type: 'document',
  fields: [
    defineField({ name: 'timeLabel', title: 'Time', type: 'string', validation: (r) => r.required(), description: 'e.g. "9:30 AM"' }),
    defineField({
      name: 'serviceType',
      title: 'Type',
      type: 'string',
      options: { list: ['full', 'general'] },
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{ type: 'string' }],
      description: "e.g. \"Children's Ministry\", \"YouTube Livestream\"",
    }),
    defineField({ name: 'notes', title: 'Notes', type: 'string', description: "e.g. \"No children's programming at this service\"" }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'timeLabel', subtitle: 'serviceType' } },
})
