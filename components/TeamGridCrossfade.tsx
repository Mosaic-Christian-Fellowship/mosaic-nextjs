'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const photos = Array.from({ length: 12 }, (_, i) =>
  `/team-photos/staff-${String(i + 1).padStart(2, '0')}.png`
)

// Deterministic pairing for the server + first client render (avoids a
// hydration mismatch); the random shuffle happens after mount in useEffect.
function defaultTileAssignments(): string[][] {
  return Array.from({ length: 6 }, (_, i) => [photos[i], photos[i + 6]])
}

function buildTileAssignments(): string[][] {
  const shuffled = [...photos].sort(() => Math.random() - 0.5)
  return Array.from({ length: 6 }, (_, i) => [shuffled[i], shuffled[i + 6]])
}

interface TileProps {
  images: string[]
  activeIndex: number
  eager?: boolean
}

function Tile({ images, activeIndex, eager = false }: TileProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#0A0C0F]">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 160px, 33vw"
          priority={eager}
          className="object-cover transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        />
      ))}
    </div>
  )
}

export default function TeamGridCrossfade() {
  const [assignments, setAssignments] = useState<string[][]>(defaultTileAssignments)
  const [activeIndices, setActiveIndices] = useState(() => Array(6).fill(0))

  // Randomize tile pairings only on the client, after hydration.
  useEffect(() => {
    setAssignments(buildTileAssignments())
  }, [])

  const flipNext = useCallback(() => {
    const order = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5)
    let step = 0

    const interval = setInterval(() => {
      if (step >= order.length) {
        clearInterval(interval)
        return
      }
      const tileIndex = order[step]
      setActiveIndices((prev) => {
        const next = [...prev]
        next[tileIndex] = next[tileIndex] === 0 ? 1 : 0
        return next
      })
      step++
    }, 800)
  }, [])

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const startDelay = setTimeout(() => {
      flipNext()
      const cycleInterval = setInterval(flipNext, 7000)
      return () => clearInterval(cycleInterval)
    }, 1500)

    return () => clearTimeout(startDelay)
  }, [flipNext])

  return (
    <section className="py-20 px-6 bg-[#1E2024]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            Meet the People Behind Mosaic
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md">
            Mosaic is led by a team of pastors, directors, and ministry leaders who are passionate
            about building a community where everyone can belong, grow, and serve.
          </p>
          <Link
            href="/about/staff"
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white transition-[filter] hover:brightness-110"
          >
            Meet Our Staff
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {assignments.map((images, i) => (
            <Tile key={i} images={images} activeIndex={activeIndices[i]} eager={i < 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
