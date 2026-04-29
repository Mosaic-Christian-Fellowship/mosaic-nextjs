import Link from 'next/link'

interface Props {
  overline?: string
  heading: string
  subtext?: string
  cta: string
  href: string
}

export default function CTASection({ overline, heading, subtext, cta, href }: Props) {
  return (
    <section className="bg-[#1E2024] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        {overline && (
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
            {overline}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-white">{heading}</h2>
        {subtext && <p className="text-white/80 text-lg">{subtext}</p>}
        <Link
          href={href}
          className="bg-white text-[#1E2024] font-semibold px-8 py-3 rounded-[10px] hover:bg-slate-100 transition-colors"
        >
          {cta}
        </Link>
      </div>
    </section>
  )
}
