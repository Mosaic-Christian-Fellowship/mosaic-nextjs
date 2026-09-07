import Image from 'next/image'
import type { Book } from '@/lib/resources'

/*
  One recommendation: cover, title, author, and the one-line reason it is on the
  list.

  The card is a row at every width rather than a column. A column would put a
  full-width cover above the text on a phone, which turns a 72-book page into a
  very long scroll and buries the blurb — and the blurb is what answers "is this
  for me?". The cover stays a fixed width and the text takes the rest.

  Every book has cover art today. The fallback stays because the data allows a
  null cover: rather than a grey box, it sets the title in the same space, so
  the row still reads as a book.
*/
export default function BookCard({ book }: { book: Book }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="shrink-0 w-[84px] @lg:w-[104px]">
        {book.cover ? (
          <Image
            src={book.cover.src}
            alt={`${book.title} — book cover`}
            width={book.cover.width}
            height={book.cover.height}
            sizes="(min-width: 1024px) 104px, 84px"
            className="w-full h-auto rounded-md shadow-sm"
          />
        ) : (
          <div
            aria-hidden
            className="flex items-center justify-center aspect-[2/3] rounded-md border border-[#E5E7EB] bg-[#F7F6F4] p-2 text-center text-[11px] font-semibold leading-[1.3] text-[#6B7280] text-balance"
          >
            {book.title}
          </div>
        )}
      </div>
      {/* min-w-0 or a long title with no spaces pushes the cover out of the card */}
      <div className="flex flex-col gap-1 min-w-0">
        <h4 className="text-[16px] font-semibold text-[#1E2024] leading-[1.3] text-balance">
          {book.title}
        </h4>
        <p className="text-[13px] font-medium text-[#6B7280]">{book.author}</p>
        <p className="text-[14px] text-[#4B5563] leading-[1.55] text-pretty">
          {book.description}
        </p>
      </div>
    </li>
  )
}
