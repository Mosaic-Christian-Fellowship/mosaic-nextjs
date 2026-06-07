interface Props {
  label?: string
  aspectRatio?: string
  className?: string
}

/*
  Neutral image placeholder. Reads as an intentional "photo coming" slot
  rather than an unfinished developer block. Replaces the previous #FF69B4
  fill that was shipping to production across About, Staff, and I'm New.
*/
export default function PlaceholderImage({
  label = 'Image',
  aspectRatio = 'aspect-video',
  className = '',
}: Props) {
  return (
    <div
      role="img"
      aria-label={`${label} (photo coming soon)`}
      className={`${aspectRatio} flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F2F4F6] text-[#6B7280] ${className}`}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xs font-medium tracking-wide">{label}</span>
    </div>
  )
}
