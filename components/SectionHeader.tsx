interface Props {
  overline?: string
  heading: string
  subtext?: string
  centered?: boolean
}

export default function SectionHeader({ overline, heading, subtext, centered = false }: Props) {
  const align = centered ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-2 ${align}`}>
      {overline && (
        <span className="text-xs font-semibold uppercase tracking-widest text-[#2A9D8F]">
          {overline}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-[#2D3748] leading-tight">
        {heading}
      </h2>
      {subtext && (
        <p className="text-[#64748B] text-lg max-w-xl">{subtext}</p>
      )}
    </div>
  )
}
