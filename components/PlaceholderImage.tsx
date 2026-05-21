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
      className={`${aspectRatio} bg-[#FF69B4] rounded-2xl flex items-center justify-center ${className}`}
    >
      <span className="text-sm font-semibold text-white tracking-wide">[ {label} ]</span>
    </div>
  )
}
