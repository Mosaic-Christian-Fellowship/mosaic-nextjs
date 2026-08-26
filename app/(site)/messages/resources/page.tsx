import PageHero from '@/components/PageHero'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: true }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Resources',
  description:
    'Books, organisations and teaching Mosaic recommends, grouped by topic.',
})

/*
  Draft. The current site's Resources page is curated topical lists — books,
  organisations, links and talks under headings like General Resources,
  Singles & Couples, Leadership, Emotional Health, and Justice & Mercy. The
  maintainer is reorganising that content, so this route exists and is
  reviewable but is kept out of navigation and out of search until it is ready.
  Publish by setting draft: false and adding the nav entry in lib/nav.ts.
*/
export default function Resources() {
  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Resources"
        subtitle="Books, organisations and teaching we recommend — grouped by topic."
      />
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[15px] text-[#6B7280] leading-[1.6]">
            This page is being put together. In the meantime, ask any member of
            the team for a recommendation.
          </p>
        </div>
      </section>
    </div>
  )
}
