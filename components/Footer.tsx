import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white/70 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-3 px-26">
          <span className="font-bold text-white text-lg">More Information</span>
          <p className="text-sm">Northvale, NJ</p>
          <p className="text-sm">welcoming@njmosaic.org</p>
        </div>
        <div className="flex flex-col gap-3 px-26">
          <span className="font-semibold text-white text-sm uppercase tracking-wider">Sunday Services</span>
          <p className="text-sm">9:30 AM</p>
          <p className="text-sm">11:30 AM (Livestream)</p>
          <p className="text-sm">1:30 PM</p>
        </div>
        <div className="flex flex-col gap-3 px-26">
          <span className="font-semibold text-white text-sm uppercase tracking-wider">Links</span>
          {[
            { href: '/about', label: 'About' },
            { href: '/messages', label: 'Messages' },
            { href: '/connect', label: 'Ministries' },
            { href: '/give', label: 'Give' },
            { href: '/im-new', label: "I'm New" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 text-xs text-center">
        © {new Date().getFullYear()} Mosaic Christian Fellowship. Wireframe prototype.
      </div>
    </footer>
  )
}
