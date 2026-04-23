interface Props {
  overline?: string
  heading: string
  subtext?: string
  centered?: boolean
}

export default function SectionHeader({ overline, heading, subtext, centered = false }: Props) {
  const align = centered ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-3 ${align}`}>
      {overline && (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
          {overline}
        </span>
      )}
      <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1E2024] leading-[1.2]">
        {heading}
      </h2>
      {subtext && (
        <p className="text-[#7F838A] text-[15px] md:text-base leading-[1.6] max-w-xl">{subtext}</p>
      )}
    </div>
  )
}
