import Link from 'next/link'

interface Props {
  href: string
  children: React.ReactNode
  className?: string
}

export default function MoreLink({ href, children, className = '' }: Props) {
  return (
    <Link
      href={href}
      className={`font-inter inline-flex items-center gap-2 rounded-[10px] border border-[#F3F4F5] bg-white px-3 py-2 text-[14px] font-semibold text-[#131517] transition-colors hover:border-[#D2D5DA] ${className}`}
    >
      <span>{children}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0066FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  )
}
