'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { HeroProps } from '@/lib/hero'

/** Render a heading string, converting "\n" into <br /> for forced line breaks. */
function renderHeading(heading: string): ReactNode {
  return heading.split('\n').flatMap((line, i) =>
    i === 0 ? [line] : [<br key={i} />, line]
  )
}

export default function Hero({
  heading,
  subtext,
  cta1,
  cta2,
  videoUrl,
  imageUrl,
}: HeroProps) {
  // Respect reduced-motion: hold the video on a static frame instead of looping.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section
      data-hero
      className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden"
    >
      <video
        autoPlay={!reduceMotion}
        muted
        loop={!reduceMotion}
        playsInline
        poster={imageUrl ?? undefined}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '70% 40%' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-2xl flex flex-col gap-6">
          <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.1] text-white text-balance">
            {renderHeading(heading)}
          </h1>

          {subtext ? (
            <p className="text-[15px] md:text-base font-normal leading-[1.6] text-white/85 max-w-xl whitespace-pre-line">
              {subtext}
            </p>
          ) : (
            <p className="text-[15px] md:text-base font-normal leading-[1.6] text-white/85 max-w-xl">
              Visit Mosaic Christian Fellowship for service, every Sunday at 9:30am and 11:30am.
              Join our livestream and view past recordings on{' '}
              <a
                href="https://www.youtube.com/channel/UCgI1-OGVDlM5cXy0xhllT_w"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
              >
                YouTube
              </a>
              .
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={cta1.href}
              className="inline-flex items-center h-[50px] px-8 bg-[#0066FF] text-white text-[15px] font-semibold rounded-[10px] hover:brightness-110 transition-[filter]"
            >
              {cta1.text}
            </Link>
            <Link
              href={cta2.href}
              className="inline-flex items-center h-[50px] px-8 bg-white/10 backdrop-blur-sm text-white text-[15px] font-semibold rounded-[10px] border border-white/20 hover:bg-white/20 transition-colors"
            >
              {cta2.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
