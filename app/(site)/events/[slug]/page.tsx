import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/sanity.client'
import { landingPageQuery, allLandingPagesQuery } from '@/sanity/lib/queries'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { kvGet } from '@/lib/kv'
import { formatDate, formatEventTime, type EventData } from '@/lib/api'

export const revalidate = 600

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
  try {
    const pages = await sanityFetch<{ slug: { current: string } }[]>(allLandingPagesQuery)
    if (!Array.isArray(pages)) return []
    return pages.map((page) => ({ slug: page.slug.current }))
  } catch {
    return []
  }
}

async function getSanityLandingPage(slug: string): Promise<LandingPage | null> {
  try {
    const result = await sanityFetch<LandingPage | LandingPage[] | null>(landingPageQuery, { slug })
    if (!result || Array.isArray(result)) return null
    return result
  } catch {
    return null
  }
}

async function getPcoEvent(id: string): Promise<EventData | null> {
  try {
    const all = await kvGet<EventData[]>('events:all')
    return all?.find((e) => e.id === id) ?? null
  } catch {
    return null
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const landingPage = await getSanityLandingPage(slug)
  if (landingPage) return <SanityLandingView page={landingPage} />

  const event = await getPcoEvent(slug)
  if (event) return <PcoEventView event={event} />

  notFound()
}

function SanityLandingView({ page }: { page: LandingPage }) {
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
      {page.ctaType && page.ctaType !== 'none' && page.ctaType === 'external-link' && page.ctaUrl && (
        <section className="py-20 px-6 bg-[#F5F5F7]">
          <div className="max-w-lg mx-auto text-center">
            <a
              href={page.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0066FF] text-white font-semibold px-10 py-4 rounded-[10px] text-lg hover:bg-[#0041A2] transition-colors inline-block"
            >
              {page.ctaText || 'Learn More'}
            </a>
          </div>
        </section>
      )}
    </div>
  )
}

function PcoEventView({ event }: { event: EventData }) {
  const description = event.description ? stripHtml(event.description) : ''
  const summary = event.summary && event.summary !== description ? event.summary : null

  return (
    <div className="bg-white">
      <section className="px-6 md:px-8 pt-12 md:pt-16 pb-8">
        <div className="mx-auto max-w-[1000px]">
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-[14px] text-[#7F838A] hover:text-[#1E2024] transition-colors"
          >
            ← Back to all events
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1000px] grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {event.recurrenceDescription && (
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
                  {event.recurrenceDescription}
                </span>
              )}
              <h1 className="text-[32px] md:text-[44px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1E2024]">
                {event.name}
              </h1>
              {summary && (
                <p className="text-[17px] leading-[1.5] text-[#4B4F56]">{summary}</p>
              )}
            </div>

            {description && description !== summary && (
              <div className="text-[15px] leading-[1.7] text-[#1E2024]">
                {description}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {event.hasRegistration && event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center h-[48px] px-7 bg-[#0066FF] text-white text-[15px] font-semibold rounded-[10px] hover:brightness-110 transition-[filter]"
                >
                  Register
                </a>
              )}
              {event.churchCenterUrl && (
                <a
                  href={event.churchCenterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center h-[48px] px-7 border border-[#E5E7EB] text-[#1E2024] text-[15px] font-semibold rounded-[10px] hover:bg-[#F5F5F7] transition-colors"
                >
                  View on Church Center
                </a>
              )}
            </div>
          </div>

          <aside className="md:col-span-5 flex flex-col gap-4">
            {event.imageUrl && (
              <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden bg-[#F5F5F7]">
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-3 p-5 rounded-[12px] border border-[#E5E7EB] bg-white">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7F838A]">
                  Date
                </span>
                <span className="text-[15px] text-[#1E2024]">{formatDate(event.startsAt)}</span>
              </div>
              {!event.allDay && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7F838A]">
                    Time
                  </span>
                  <span className="text-[15px] text-[#1E2024]">
                    {formatEventTime(event.startsAt, event.endsAt)}
                  </span>
                </div>
              )}
              {event.location && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7F838A]">
                    Location
                  </span>
                  <span className="text-[15px] text-[#1E2024] leading-[1.4]">{event.location}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
