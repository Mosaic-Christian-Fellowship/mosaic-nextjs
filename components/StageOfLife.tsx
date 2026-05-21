'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProgressiveBlur from '@/components/ProgressiveBlur'

type Card = { image: string; title: string; href: string; description?: string }

const cards: Card[] = [
  { image: '/framer/stage-of-life/SxhzxV8ao1HtFEGdS1v6nT8KFw.jpg', title: 'Community Groups', href: '/connect' },
  { image: '/framer/stage-of-life/ULigcCSyd0TmrohdwqwgMb67Nrw.jpg', title: 'Education Department', href: '#' },
  { image: '/framer/stage-of-life/YRLYlc5g2NeUUHNg9EKHwwsLeKw.jpg', title: 'Ministries Directory', href: '/connect' },
  { image: '/framer/stage-of-life/Cpk7jBgsOKx9HczmVdH3AOE9pjg.jpg', title: 'Mosaic Team', href: '/about' },
  { image: '/framer/stage-of-life/zSVrJnDUK64kiEjToVnYgtBCOxc.jpg', title: 'Community Gallery', href: '#' },
  { image: '/framer/stage-of-life/MUKMullc3RpovcMHfY2iLUrJ3s.jpg', title: 'Testimonies', href: '#' },
  { image: '/framer/stage-of-life/psZwfs8AeLrbTtHECDGwhd6rx0.jpg', title: 'Resources', href: '#' },
  { image: '/framer/stage-of-life/gSKDv0TsW9e19h9d9UB7CClHZg.jpg', title: 'Discipleship Training', href: '#' },
  { image: '/framer/stage-of-life/VlWjAVp8XQYKAZvnXG20aiBTcY.jpg', title: 'Sermons', href: '/messages' },
  { image: '/framer/stage-of-life/uEaQ32le3R0KwRr7fryPQzxkPVQ.jpg', title: 'Community Group', href: '/connect' },
]

const CARD_W = 300
const GAP = 24
const STEP = CARD_W + GAP
const AUTOSCROLL_MS = 3500

function CommunityCard({ card }: { card: Card }) {
  return (
    <Link
      href={card.href}
      draggable={false}
      className="relative block overflow-hidden rounded-[12px] bg-black shrink-0"
      style={{ width: CARD_W, aspectRatio: '8 / 15' }}
    >
      <Image
        src={card.image}
        alt={card.title}
        fill
        sizes="300px"
        className="object-cover object-top opacity-50 select-none pointer-events-none"
        draggable={false}
      />

      <ProgressiveBlur direction="to bottom" />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,65,162,0) 0%, rgba(0,65,162,0.85) 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-20 flex h-full flex-col justify-end p-6">
        <h3
          className="text-[22px] font-semibold tracking-[-0.04em] text-[#F3F4F5] leading-[1.15]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {card.title}
        </h3>
        <p className="mt-2 text-[14px] text-[#F3F4F5]/85 leading-[1.5]">
          {card.description ?? 'Add a short description to explain this card.'}
        </p>
      </div>
    </Link>
  )
}

export default function StageOfLife() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(cards.length - 1)
  const [paused, setPaused] = useState(false)
  const dragState = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null)

  const recomputeMax = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const visible = Math.max(1, Math.floor((track.clientWidth + GAP) / STEP))
    setMaxIndex(Math.max(0, cards.length - visible))
  }, [])

  useEffect(() => {
    recomputeMax()
    const onResize = () => recomputeMax()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [recomputeMax])

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(maxIndex, i))
    setIndex(clamped)
    track.scrollTo({ left: clamped * STEP, behavior: smooth ? 'smooth' : 'auto' })
  }, [maxIndex])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1 > maxIndex ? 0 : prev + 1
        const track = trackRef.current
        if (track) track.scrollTo({ left: next * STEP, behavior: 'smooth' })
        return next
      })
    }, AUTOSCROLL_MS)
    return () => window.clearInterval(id)
  }, [paused, maxIndex])

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const i = Math.round(track.scrollLeft / STEP)
    if (i !== index) setIndex(Math.max(0, Math.min(maxIndex, i)))
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return
    track.setPointerCapture(e.pointerId)
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, moved: false }
    setPaused(true)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track || !dragState.current) return
    const dx = e.clientX - dragState.current.startX
    if (Math.abs(dx) > 4) dragState.current.moved = true
    track.scrollLeft = dragState.current.startScroll - dx
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track || !dragState.current) return
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId)
    const moved = dragState.current.moved
    dragState.current = null
    if (moved) {
      const i = Math.round(track.scrollLeft / STEP)
      scrollToIndex(i)
    }
  }

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current?.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const prev = () => {
    setPaused(true)
    scrollToIndex(index - 1)
  }
  const next = () => {
    setPaused(true)
    scrollToIndex(index + 1)
  }
  const goto = (i: number) => {
    setPaused(true)
    scrollToIndex(i)
  }

  const dotCount = maxIndex + 1

  return (
    <section className="py-20 md:py-24 overflow-hidden bg-white">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 mb-8 flex items-end justify-between gap-4">
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.04em] text-[#1E2024] leading-[1.1]">
          Meet Our Community
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={prev}
            disabled={index <= 0}
            aria-label="Previous"
            className="w-10 h-10 rounded-full border border-[#F3F4F5] bg-white text-[#1E2024] flex items-center justify-center hover:border-[#D2D5DA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= maxIndex}
            aria-label="Next"
            className="w-10 h-10 rounded-full border border-[#F3F4F5] bg-white text-[#1E2024] flex items-center justify-center hover:border-[#D2D5DA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="overflow-x-auto scrollbar-hide select-none"
        style={{
          scrollSnapType: 'x mandatory',
          cursor: 'grab',
          touchAction: 'pan-y',
          paddingLeft: 'max(1rem, calc((100vw - 1200px) / 2 + 2rem))',
          paddingRight: 'max(1rem, calc((100vw - 1200px) / 2 + 2rem))',
        }}
      >
        <div className="flex" style={{ gap: GAP, width: 'max-content' }}>
          {cards.map((card) => (
            <div key={`${card.title}-${card.image}`} style={{ scrollSnapAlign: 'start' }}>
              <CommunityCard card={card} />
            </div>
          ))}
        </div>
      </div>

      {dotCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => {
            const active = i === index
            return (
              <button
                key={i}
                type="button"
                onClick={() => goto(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                className="rounded-full transition-all"
                style={{
                  width: active ? 24 : 8,
                  height: 8,
                  backgroundColor: active ? '#1E2024' : '#D2D5DA',
                }}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
