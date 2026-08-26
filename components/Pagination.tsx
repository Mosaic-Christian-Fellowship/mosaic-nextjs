import Link from 'next/link'

interface PaginationProps {
  /** 1-based current page */
  page: number
  totalPages: number
  /** Path the page links point at, e.g. "/messages/podcasts" */
  basePath: string
  /** Fragment to jump to, so paging doesn't land the reader back at the hero */
  anchor?: string
  /** Describes what's being paged, for screen readers: "episodes", "sermons" */
  label: string
}

/**
 * Plain links, no client JavaScript — each page is its own URL, so paging works
 * with the back button, can be shared, and is crawlable.
 */
export default function Pagination({ page, totalPages, basePath, anchor, label }: PaginationProps) {
  if (totalPages <= 1) return null

  const suffix = anchor ? `#${anchor}` : ''
  const hrefFor = (n: number) => (n === 1 ? `${basePath}${suffix}` : `${basePath}?page=${n}${suffix}`)

  const linkClass =
    'px-5 py-2.5 min-h-11 inline-flex items-center rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#1E2024] hover:border-[#0066FF] hover:text-[#0066FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2'
  const disabledClass =
    'px-5 py-2.5 min-h-11 inline-flex items-center rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#6B7280] opacity-50 cursor-not-allowed'

  return (
    <nav className="flex items-center justify-between gap-4" aria-label={`${label} pagination`}>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={linkClass}>
          ← Newer
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden>
          ← Newer
        </span>
      )}

      <p className="text-sm text-[#6B7280]" aria-live="polite">
        Page {page} of {totalPages}
      </p>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={linkClass}>
          Older →
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden>
          Older →
        </span>
      )}
    </nav>
  )
}
