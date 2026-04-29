type Direction = 'to top' | 'to bottom' | 'to left' | 'to right'

const STOPS = [
  { z: 1, blur: 0.5, start: 0 },
  { z: 2, blur: 0.5625, start: 12.5 },
  { z: 3, blur: 1.125, start: 25 },
  { z: 4, blur: 2.25, start: 37.5 },
  { z: 5, blur: 4.5, start: 50 },
  { z: 6, blur: 9, start: 62.5 },
  { z: 7, blur: 18, start: 75 },
  { z: 8, blur: 36, start: 87.5 },
]

export default function ProgressiveBlur({
  direction = 'to bottom',
  radius = 12,
}: {
  direction?: Direction
  radius?: number
}) {
  return (
    <div
      className="absolute inset-0"
      style={{ borderRadius: radius, pointerEvents: 'none' }}
      aria-hidden
    >
      {STOPS.map(({ z, blur, start }) => {
        const a = start
        const b = start + 12.5
        const c = start + 25
        const d = start + 37.5
        const stops = d <= 100
          ? `rgba(0,0,0,0) ${a}%, rgba(0,0,0,1) ${b}%, rgba(0,0,0,1) ${c}%, rgba(0,0,0,0) ${d}%`
          : c <= 100
            ? `rgba(0,0,0,0) ${a}%, rgba(0,0,0,1) ${b}%, rgba(0,0,0,1) ${c}%`
            : `rgba(0,0,0,0) ${a}%, rgba(0,0,0,1) ${b}%`
        const mask = `linear-gradient(${direction}, ${stops})`
        return (
          <div
            key={z}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: z,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
              borderRadius: radius,
              pointerEvents: 'none',
            }}
          />
        )
      })}
    </div>
  )
}
