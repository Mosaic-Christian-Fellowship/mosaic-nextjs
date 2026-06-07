import type { ReactNode } from 'react'

type PageHeroProps = {
  overline?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  /** Optional CTA row or other content rendered below the subtitle. */
  children?: ReactNode
}

/*
  Unified page hero. One dark treatment for every secondary page so the site
  reads as one product (replaces the old per-page #FF69B4 placeholder heroes
  and the plain-white headers). Eyebrow uses #7AA9FF rather than #0066FF
  because #0066FF on #1E2024 only reaches ~3.5:1 — below WCAG AA for the
  small uppercase label.
*/
export default function PageHero({
  overline,
  title,
  subtitle,
  align = 'left',
  children,
}: PageHeroProps) {
  const alignment =
    align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start'

  return (
    <section className="relative overflow-hidden bg-[#1E2024] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(0,102,255,0.20),transparent_70%)]"
      />
      <div className="relative max-w-4xl mx-auto px-6 py-24">
        <div className={`flex flex-col gap-4 ${alignment}`}>
          {overline && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7AA9FF]">
              {overline}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </section>
  )
}
