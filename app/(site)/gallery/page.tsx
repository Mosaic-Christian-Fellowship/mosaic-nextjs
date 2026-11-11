import Image from 'next/image'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import Callout from '@/components/Callout'
import CTASection from '@/components/CTASection'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'
import { ALBUMS } from './albums'
import PhotoGrid from './PhotoGrid'

export const pageMeta: PageMeta = { draft: false }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Gallery',
  description: 'Photos from Mosaic retreats, barbecues, and family events.',
})

/*
  Rebuilt from mosaicnj.org/gallery. Each album shows a sample of up to 12
  photos from the old site's album. Album order follows the old site.
  The amber "To fill in" callout must be answered or removed before launch.
*/

export default function Gallery() {
  return (
    <div>
      <PageHero
        overline="Gallery"
        title="Life together at Mosaic"
        subtitle="Retreats, barbecues, and holiday events. Pick an album to see the photos."
        align="center"
      />

      <section className="py-16 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <SectionHeader overline="Albums" heading="Browse by event" centered />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALBUMS.map((a) => (
              <li key={a.slug}>
                <a
                  href={`#${a.slug}`}
                  className="group flex flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066FF]"
                >
                  <Image
                    src={a.cover.src}
                    alt={a.cover.alt}
                    width={a.cover.width}
                    height={a.cover.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="aspect-[16/9] w-full rounded-2xl object-cover"
                  />
                  <span className="text-lg font-bold text-[#1E2024] [text-wrap:balance] group-hover:text-[#0066FF] transition-colors">
                    {a.title}
                  </span>
                  <span className="text-sm text-[#6B7280]">{a.year}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {ALBUMS.map((a, n) => (
        <section
          key={a.slug}
          id={a.slug}
          aria-labelledby={`${a.slug}-heading`}
          className={`py-16 px-6 scroll-mt-24 ${n % 2 === 0 ? '' : 'bg-[#FFFFFF]'}`}
        >
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0066FF]">{a.year}</p>
              <h2
                id={`${a.slug}-heading`}
                className="text-2xl md:text-3xl font-bold text-[#1E2024] [text-wrap:balance]"
              >
                {a.title}
              </h2>
            </div>
            <PhotoGrid photos={a.photos} label={a.title} />
          </div>
        </section>
      ))}

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Callout tone="warning" title="To fill in">
            <p>
              The newest album is from 2024. Which 2025 and 2026 events should we add, and who will supply the
              photos?
            </p>
            <p className="mt-2">
              Many of these photos show children. Does the church have a photo-consent policy for the website?
              If it does, we can check each album against it before launch.
            </p>
          </Callout>
        </div>
      </section>

      <CTASection
        overline="Come Join Us"
        heading="Be part of the next photo."
        subtext="Visit on a Sunday, or find a community group to join."
        cta="Plan Your Visit"
        href="/im-new"
      />
    </div>
  )
}
