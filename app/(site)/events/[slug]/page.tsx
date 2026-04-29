import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/sanity.client'
import { landingPageQuery, allLandingPagesQuery } from '@/sanity/lib/queries'
import { PortableText, type PortableTextBlock } from '@portabletext/react'

interface LandingPage {
  title: string
  heroHeading?: string
  heroSubtext?: string
  body?: PortableTextBlock[]
  ctaType?: string
  ctaUrl?: string
  ctaText?: string
}

export async function generateStaticParams() {
  const pages = await sanityFetch<{ slug: { current: string } }[]>(allLandingPagesQuery)
  return pages.map((page) => ({
    slug: page.slug.current,
  }))
}

export default async function EventLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await sanityFetch<LandingPage | null>(landingPageQuery, { slug })
  if (!page) notFound()

  return (
    <div>
      <section className="bg-[#1E2024] text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">{page.heroHeading || page.title}</h1>
          {page.heroSubtext && <p className="text-white/70 text-lg">{page.heroSubtext}</p>}
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-lg">
          {page.body && <PortableText value={page.body} />}
        </div>
      </section>
      {page.ctaType && page.ctaType !== 'none' && (
        <section className="py-20 px-6 bg-[#F5F5F7]">
          <div className="max-w-lg mx-auto text-center">
            {page.ctaType === 'external-link' && page.ctaUrl && (
              <a href={page.ctaUrl} target="_blank" rel="noopener noreferrer"
                className="bg-[#0066FF] text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-[#0041A2] transition-colors inline-block">
                {page.ctaText || 'Learn More'}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
