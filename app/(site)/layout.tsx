import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FeedbackWidget from '@/components/feedback/FeedbackWidget'
import { feedbackEnabled } from '@/components/feedback/config'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      {/* Preview deploys only. Production never renders it, so the browser never loads its code. */}
      {feedbackEnabled() && <FeedbackWidget />}
    </div>
  )
}
