import { defineType, defineField } from 'sanity'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Event Landing Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubtext', title: 'Hero Subtext', type: 'text', rows: 2 }),
    defineField({ name: 'body', title: 'Body Content', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
    defineField({
      name: 'ctaType',
      title: 'CTA Type',
      type: 'string',
      options: { list: ['rsvp-form', 'contact-form', 'external-link', 'none'] },
    }),
    defineField({ name: 'ctaUrl', title: 'CTA External URL', type: 'url', hidden: ({ parent }) => parent?.ctaType !== 'external-link' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current', media: 'heroImage' } },
})
