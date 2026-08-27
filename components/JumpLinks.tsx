interface JumpLink {
  /** id of the section this points at */
  id: string
  label: string
}

interface JumpLinksProps {
  links: JumpLink[]
  /** Describes the set for screen readers: "Plan a visit sections" */
  label: string
}

/**
 * A row of in-page links that docks below the main nav once the reader scrolls
 * past the hero.
 *
 * `Nav` is `sticky top-0` and 80px tall on a phone, 90px once its CTA button
 * appears, so this sits at exactly those offsets rather than overlapping it.
 * Sections carry a matching `scroll-mt` so a jump doesn't hide the heading
 * underneath both bars.
 *
 * Plain anchors, no JavaScript: the bar works before hydration and each section
 * is linkable on its own.
 */
export default function JumpLinks({ links, label }: JumpLinksProps) {
  return (
    <nav
      aria-label={label}
      className="sticky top-[80px] md:top-[90px] z-40 bg-white/95 backdrop-blur border-b border-[#E5E7EB]"
    >
      {/* Horizontal scroll rather than wrapping — six labels do not fit on a
          phone, and a two-line bar would eat a third of a small screen. */}
      <ul className="max-w-6xl mx-auto flex gap-1 overflow-x-auto px-4 md:px-6 list-none m-0 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <li key={link.id} className="shrink-0">
            <a
              href={`#${link.id}`}
              className="inline-flex items-center min-h-11 px-4 rounded-full text-sm font-semibold text-[#6B7280] whitespace-nowrap hover:text-[#0066FF] hover:bg-[#F5F7FA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
