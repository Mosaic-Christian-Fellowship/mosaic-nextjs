import type { ReactNode } from 'react'

type Tone = 'info' | 'success' | 'warning'

const TONE_STYLES: Record<Tone, { box: string; title: string; body: string }> = {
  info: {
    box: 'border-[#0066FF]/25 bg-[#0066FF]/10',
    title: 'text-[#0041A2]',
    body: 'text-[#0041A2]/80',
  },
  success: {
    box: 'border-emerald-200 bg-emerald-50',
    title: 'text-emerald-900',
    body: 'text-emerald-900/80',
  },
  warning: {
    box: 'border-amber-200 bg-amber-50',
    title: 'text-amber-900',
    body: 'text-amber-900/80',
  },
}

interface Props {
  title: string
  children: ReactNode
  tone?: Tone
}

export default function Callout({ title, children, tone = 'info' }: Props) {
  const styles = TONE_STYLES[tone]
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles.box}`}>
      <p className={`font-semibold ${styles.title}`}>{title}</p>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
