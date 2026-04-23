import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'

interface Props {
  imageLabel?: string
  title: string
  description?: string
  href?: string
  cta?: string
}

export default function Card({ imageLabel, title, description, href, cta }: Props) {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
      {imageLabel && <PlaceholderImage label={imageLabel} aspectRatio="aspect-[4/3]" className="rounded-none" />}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-lg text-[#1E2024]">{title}</h3>
        {description && <p className="text-[#7F838A] text-sm flex-1">{description}</p>}
        {href && cta && (
          <Link
            href={href}
            className="mt-2 text-sm font-semibold text-[#0066FF] hover:text-[#0041A2] transition-colors"
          >
            {cta} →
          </Link>
        )}
      </div>
    </div>
  )
}
