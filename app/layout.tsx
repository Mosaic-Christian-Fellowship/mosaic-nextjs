import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mosaic Christian Fellowship',
  description: 'A place to belong, grow, and serve — Northvale, NJ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
