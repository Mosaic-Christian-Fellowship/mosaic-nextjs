import { notFound } from 'next/navigation'
import { client } from '@/sanity/sanity.client'
import { landingPageQuery, allLandingPagesQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export async function generateStaticParams() {
  const pages = await client.fetch(allLandingPagesQuery)
  return pages.map((page: { slug: { current: string } }) => ({
    slug: page.slug.current,
  }))
}

export default async function EventLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await client.fetch(landingPageQuery, { slug })
  if (!page) notFound()

  return (
    <div>
      <section className="bg-[#1E3A5F] text-white py-24 px-6">
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
        <section className="py-20 px-6 bg-[#F5F7FA]">
          <div className="max-w-lg mx-auto text-center">
            {page.ctaType === 'external-link' && page.ctaUrl && (
              <a href={page.ctaUrl} target="_blank" rel="noopener noreferrer"
                className="bg-[#4E8EBE] text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-[#3E7BA6] transition-colors inline-block">
                {page.ctaText || 'Learn More'}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
