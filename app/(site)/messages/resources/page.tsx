import Link from 'next/link'
import BookCard from '@/components/BookCard'
import CTASection from '@/components/CTASection'
import JumpLinks from '@/components/JumpLinks'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import { SECTIONS, SECTION_NAV, logoFile, type Section } from '@/lib/resources'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: true }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Resources',
  description:
    'Books, organisations and teaching Mosaic recommends, grouped by the question they answer.',
})

/*
  The reading list the church already keeps, rebuilt from the old site's five
  Resources pages. Everything is on one page rather than split across six
  routes: someone arriving with a question ("why am I so anxious?") should be
  able to scan for it, and the jump bar makes a long page navigable without
  hiding five sixths of the list behind a tab.

  Still a draft — the section intros below are placeholders written from the
  book lists, not copy the church has approved, and two titles have no cover.
  Publish by setting draft: false and pointing the Resources nav entry at this
  route in lib/nav.ts.
*/
const INTROS: Record<string, string> = {
  general:
    'Where to start — on the faith itself, on doubt, and on reading the Bible.',
  'singles-couples':
    'For women, for men, for married couples, and for parents.',
  leadership:
    'Faith at work, sharing it with others, leading well, and the church’s work overseas.',
  'emotional-health': 'On anxiety and on shame — two of the things we hear most.',
  'justice-mercy':
    'Books on poverty and injustice, and the organisations Mosaic supports.',
  'race-reconciliation':
    'Books, films and talks on race and the American church.',
}

function OrganizationList({ section }: { section: Section }) {
  if (!section.organizations) return null
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-[18px] font-semibold text-[#1E2024]">
        Organisations we support
      </h3>
      {/* auto-fit rather than a column count: seven logos of very different
          widths, and the row should just fill whatever space it has */}
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 list-none p-0 m-0">
        {section.organizations.map((org) => (
          <li key={org.name}>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-24 px-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#0066FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG logos
                  of seven different aspect ratios; the optimizer does not touch
                  SVG and object-contain needs the intrinsic ratio */}
              <img
                src={`/resources/logos/${logoFile(org.name)}`}
                alt={org.name}
                loading="lazy"
                className="max-h-10 w-auto max-w-full object-contain"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FilmList({ section }: { section: Section }) {
  if (!section.films) return null
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[18px] font-semibold text-[#1E2024]">Films</h3>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {section.films.map((film) => (
          <li key={film.title} className="text-[15px] text-[#4B5563]">
            <span className="font-semibold text-[#1E2024]">{film.title}</span>{' '}
            <span className="text-[#6B7280]">
              ({film.year}) — {film.platform}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TalkList({ section }: { section: Section }) {
  if (!section.talks) return null
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[18px] font-semibold text-[#1E2024]">Talks and articles</h3>
      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {section.talks.map((talk) => (
          <li key={talk.url}>
            <a
              href={talk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-baseline gap-x-2 min-h-11 py-1 text-[15px] font-semibold text-[#0066FF] hover:text-[#0041A2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] rounded"
            >
              {talk.title}
              <span className="font-medium text-[#6B7280]">
                {talk.author ? `${talk.author} · ` : ''}
                {talk.source}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Resources() {
  const links = SECTIONS.map((s) => ({ id: s.slug, label: SECTION_NAV[s.slug] ?? s.title }))

  return (
    <div>
      <PageHero
        overline="Teaching"
        title="Resources"
        subtitle="Books, organisations and teaching we recommend — grouped by the question they answer."
      />
      <JumpLinks links={links} label="Sections of this page" />

      {SECTIONS.map((section, i) => (
        <section
          key={section.slug}
          id={section.slug}
          // Clears the nav plus the docked jump bar, which together are 150px.
          className={`scroll-mt-[150px] py-16 px-6 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F7F6F4]'}`}
        >
          <div className="max-w-6xl mx-auto @container flex flex-col gap-10">
            <SectionHeader heading={section.title} subtext={INTROS[section.slug]} />

            {section.groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                {/* The group titles are the reader's own questions, so they are
                    set as headings rather than as small labels. */}
                <h3 className="text-[18px] font-semibold text-[#1E2024] leading-[1.35] text-balance">
                  {group.title}
                </h3>
                <ul className="grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-4 list-none p-0 m-0">
                  {group.books.map((book) => (
                    <BookCard key={book.slug} book={book} />
                  ))}
                </ul>
              </div>
            ))}

            <OrganizationList section={section} />
            <FilmList section={section} />
            <TalkList section={section} />
          </div>
        </section>
      ))}

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[15px] text-[#6B7280] leading-[1.6]">
            Looking for something that is not here? Ask any member of the team, or{' '}
            <Link href="/connect" className="font-semibold text-[#0066FF] hover:text-[#0041A2]">
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      <CTASection
        overline="Keep going"
        heading="Read alongside other people"
        subtext="Most of these books land better in conversation. Community groups meet through the week."
        cta="Find a group"
        href="/connect"
      />
    </div>
  )
}
