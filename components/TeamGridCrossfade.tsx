'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const photos = [
  'dave-park',
  'andre-choi',
  'patrick-chi',
  'samuel-an',
  'william-gill',
  'christy-kim',
  'harvey-choi',
  'daniel-godsave',
  'eden-hong',
  'ij-hur',
  'young-lee',
].map((name) => `/staff/square/${name}.jpg`)

const TILE_COUNT = 6

// Each tile holds two slots: the photo showing and the one it fades to next.
// The server and first client render use a fixed order (avoids a hydration
// mismatch); the shuffle happens after mount.
function defaultTileAssignments(): string[][] {
  return Array.from({ length: TILE_COUNT }, (_, i) => [photos[i], photos[(i + TILE_COUNT) % photos.length]])
}

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

// Picks a photo that no tile is showing or about to show, so the same face
// never appears twice in the grid.
function pickUnused(assignments: string[][], activeIndices: number[]): string {
  const inUse = new Set(assignments.flatMap((slots, i) => [slots[activeIndices[i]]]))
  const nextUp = new Set(assignments.map((slots, i) => slots[activeIndices[i] === 0 ? 1 : 0]))
  const free = photos.filter((p) => !inUse.has(p) && !nextUp.has(p))
  const fallback = photos.filter((p) => !inUse.has(p))
  const pool = free.length > 0 ? free : fallback
  return pool[Math.floor(Math.random() * pool.length)]
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
          key={i}
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
  const [activeIndices, setActiveIndices] = useState<number[]>(() => Array(TILE_COUNT).fill(0))

  // Randomize the starting photos only on the client, after hydration.
  useEffect(() => {
    const order = shuffled(photos)
    setAssignments(
      Array.from({ length: TILE_COUNT }, (_, i) => [order[i], order[(i + TILE_COUNT) % order.length]])
    )
  }, [])

  const flipTile = useCallback((tileIndex: number) => {
    setActiveIndices((prevActive) => {
      const nextActive = [...prevActive]
      nextActive[tileIndex] = prevActive[tileIndex] === 0 ? 1 : 0
      // Once the fade finishes, load a fresh photo into the slot that just
      // went hidden, ready for this tile's next turn.
      setTimeout(() => {
        setAssignments((prevAssign) => {
          const next = prevAssign.map((slots) => [...slots])
          const hiddenSlot = nextActive[tileIndex] === 0 ? 1 : 0
          next[tileIndex][hiddenSlot] = pickUnused(next, nextActive)
          return next
        })
      }, 1400)
      return nextActive
    })
  }, [])

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let flipTimer: ReturnType<typeof setInterval> | undefined
    const runCycle = () => {
      const order = shuffled([...Array(TILE_COUNT).keys()])
      let step = 0
      flipTimer = setInterval(() => {
        if (step >= order.length) {
          clearInterval(flipTimer)
          return
        }
        flipTile(order[step])
        step++
      }, 800)
    }

    let cycleTimer: ReturnType<typeof setInterval> | undefined
    const startDelay = setTimeout(() => {
      runCycle()
      cycleTimer = setInterval(runCycle, 7000)
    }, 1500)

    return () => {
      clearTimeout(startDelay)
      clearInterval(cycleTimer)
      clearInterval(flipTimer)
    }
  }, [flipTile])

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
