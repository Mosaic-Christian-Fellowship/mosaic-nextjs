interface Props {
  label?: string
  aspectRatio?: string
  className?: string
}

export default function PlaceholderImage({
  label = 'Image',
  aspectRatio = 'aspect-video',
  className = '',
}: Props) {
  return (
    <div
      className={`${aspectRatio} bg-slate-200 rounded-2xl flex items-center justify-center ${className}`}
    >
      <span className="text-sm font-medium text-[#64748B]">[ {label} ]</span>
    </div>
  )
}
