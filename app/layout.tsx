import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--next-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--next-inter',
})

const SITE_URL = 'https://mosaic-nextjs.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mosaic Christian Fellowship | Northvale, NJ',
    template: '%s | Mosaic Christian Fellowship',
  },
  description:
    'A diverse church in Northvale, NJ helping people know Jesus, grow in faith, and live in community. Join us Sundays at 9:30, 11:30, and 1:30 — in person or online.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Mosaic Christian Fellowship',
    title: 'Mosaic Christian Fellowship | Northvale, NJ',
    description:
      'A place to belong, grow, and serve. Join us Sundays at 9:30, 11:30, and 1:30 — in person or online.',
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mosaic Christian Fellowship | Northvale, NJ',
    description:
      'A place to belong, grow, and serve. Join us Sundays at 9:30, 11:30, and 1:30 — in person or online.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const churchJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'Mosaic Christian Fellowship',
  url: SITE_URL,
  email: 'welcoming@njmosaic.org',
  description:
    'A diverse church in Northvale, NJ helping people know Jesus, grow in faith, and live in community.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '119 Rockland Ave',
    addressLocality: 'Northvale',
    addressRegion: 'NJ',
    postalCode: '07647',
    addressCountry: 'US',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '11:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '13:30' },
  ],
  sameAs: [
    'https://www.youtube.com/channel/UCgI1-OGVDlM5cXy0xhllT_w',
    'https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#0066FF] focus:text-white focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
