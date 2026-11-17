import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      {/* The nav is fixed. Pages that start with a hero run under it; the rest
          are padded by the nav's height (80px phone, 90px desktop). */}
      <main
        id="main-content"
        className="flex-1 pt-20 md:pt-[90px] has-[[data-hero]]:pt-0 md:has-[[data-hero]]:pt-0"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
