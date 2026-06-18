import { defineType, defineField } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'text',
      rows: 2,
      description: 'Line breaks are preserved (the default shows two lines).',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext',
      type: 'text',
      rows: 3,
      description: 'Leave empty to keep the default service-times line with the YouTube link.',
    }),
    defineField({ name: 'heroCta1Text', title: 'Primary Button Text', type: 'string' }),
    defineField({ name: 'heroCta1Href', title: 'Primary Button Link', type: 'string' }),
    defineField({ name: 'heroCta2Text', title: 'Secondary Button Text', type: 'string' }),
    defineField({ name: 'heroCta2Href', title: 'Secondary Button Link', type: 'string' }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Used as the video poster and the still shown to reduced-motion visitors.',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      options: { accept: 'video/mp4' },
      description: 'Upload an MP4 already optimized via the optimize-video skill.',
    }),
  ],
  preview: {
    select: { title: 'heroHeading', media: 'heroImage' },
    prepare: ({ title, media }) => ({ title: title || 'Home Page', media }),
  },
})
