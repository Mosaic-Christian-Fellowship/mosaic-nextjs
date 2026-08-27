'use client'

import { useEffect, useState } from 'react'

interface JumpLink {
  /** id of the section this points at */
  id: string
  label: string
}

interface JumpLinksProps {
  links: JumpLink[]
  /** Describes the set for screen readers: "Sections of this page" */
  label: string
}

/**
 * A row of in-page links that docks below the main nav once the reader scrolls
 * past the hero.
 *
 * `Nav` is `sticky top-0` and 80px tall on a phone, 90px once its CTA button
 * appears, so this sits at exactly those offsets rather than overlapping it.
 * Sections carry a matching `scroll-mt` so a jump doesn't hide the heading
 * underneath both bars. Scrolling itself is smooth — that's `scroll-behavior`
 * on `html` in globals.css, which also means it respects reduced-motion.
 */
export default function JumpLinks({ links, label }: JumpLinksProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    // The band the "current" section is judged in: from just under the docked
    // bars down to 55% of the viewport. Without the top inset a section counts
    // as current while it sits behind the nav; without the bottom one, two
    // sections qualify at once on a tall screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-150px 0px -45% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [links])

  return (
    <nav
      aria-label={label}
      className="sticky top-[80px] md:top-[90px] z-40 bg-[#0066FF] shadow-sm"
    >
      {/* Horizontal scroll rather than wrapping — six labels do not fit on a
          phone, and a two-line bar would eat a third of a small screen. */}
      <ul className="max-w-6xl mx-auto flex md:justify-center gap-1 overflow-x-auto scrollbar-hide px-4 md:px-6 list-none m-0 py-2">
        {links.map((link) => {
          const isActive = link.id === activeId
          return (
            <li key={link.id} className="shrink-0">
              <a
                href={`#${link.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex items-center min-h-11 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0066FF] ${
                  isActive
                    ? 'bg-white text-[#0066FF]'
                    : 'text-white hover:bg-white hover:text-[#0066FF] focus-visible:bg-white focus-visible:text-[#0066FF]'
                }`}
              >
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
