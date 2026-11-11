'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Photo } from './albums'

// Thumbnail grid with a lightbox built on the native <dialog> element.
// showModal() traps focus, closes on Esc, and returns focus to the button that opened it.
// Could move to components/ if another page needs a photo grid.
export default function PhotoGrid({ photos, label }: { photos: Photo[]; label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState(0)

  const open = (i: number) => {
    setActive(i)
    dialogRef.current?.showModal()
  }
  const step = (d: number) => setActive((i) => (i + d + photos.length) % photos.length)
  const photo = photos[active]

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`View larger: ${p.alt}`}
              className="block w-full overflow-hidden rounded-xl bg-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF]"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${label} photo viewer`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close()
        }}
        className="m-auto w-[min(96vw,1200px)] max-h-[94svh] overflow-hidden rounded-2xl bg-[#1E2024] p-0 text-white backdrop:bg-black/80"
      >
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-white/80" aria-live="polite">
              {label}: {active + 1} of {photos.length}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="min-h-11 rounded-full px-4 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              Close
            </button>
          </div>
          {photo && (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="96vw"
              className="mx-auto max-h-[70svh] w-auto rounded-lg object-contain"
            />
          )}
          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              className="min-h-11 rounded-full bg-white/10 px-5 text-sm font-semibold hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="min-h-11 rounded-full bg-white/10 px-5 text-sm font-semibold hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              Next →
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
