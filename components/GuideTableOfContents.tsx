'use client'

interface TocItem {
  id: string
  title: string
}

/*
  Sticky left-rail table of contents for The Mosaic Guide. Anchors are kept as
  real <a href="#id"> for keyboard/right-click accessibility; the click handler
  upgrades the jump to a smooth scroll without changing scroll behavior
  site-wide. The panels carry scroll-mt-* so the sticky site header does not
  cover the target heading.
*/
export default function GuideTableOfContents({ items }: { items: TocItem[] }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:block lg:w-64 shrink-0 lg:sticky lg:top-24 self-start"
    >
      <div className="bg-[#E8EFFD] rounded-3xl px-6 py-6">
        <h2 className="text-2xl font-bold text-[#1E2024] mb-2">Content</h2>
        <ul className="flex flex-col divide-y divide-[#1E2024]/25">
          {items.map(({ id, title }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className="block py-3 text-[15px] text-[#1E2024] hover:opacity-70 transition-opacity"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
