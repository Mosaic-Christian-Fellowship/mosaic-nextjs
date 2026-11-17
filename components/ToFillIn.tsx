import type { ReactNode } from 'react'

interface Item {
  label?: string
  question: ReactNode
}

interface Props {
  items: Item[]
  title?: string
}

export default function ToFillIn({ items, title = 'To fill in' }: Props) {
  return (
    <div
      role="note"
      aria-label={title}
      className="rounded-xl border border-[#F9A8D4] bg-[#FDF2F8] px-4 py-3 text-sm text-[#9D174D]"
    >
      <p className="font-semibold">{title}</p>
      <ul className="mt-2">
        {items.map((item, i) => (
          <li key={i} className={i > 0 ? 'mt-2 border-t border-[#FBCFE8] pt-2' : ''}>
            {item.label && <p className="font-semibold">{item.label}</p>}
            <div>{item.question}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
