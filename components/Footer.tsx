import Link from 'next/link'

function HexagonLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g transform="translate(1.785 0)">
        <path
          d="M 16.242 22.105 L 16.242 32.367 C 16.252 32.783 15.802 33.05 15.441 32.839 L 6.271 27.498 C 5.879 27.269 5.637 26.849 5.637 26.395 L 5.628 16.135 C 5.628 15.719 6.085 15.464 6.44 15.682 L 15.635 21.05 C 16.003 21.276 16.231 21.673 16.242 22.105"
          fill="#BCBEC4"
        />
        <path
          d="M 16.028 3.472 L 4.938 9.875 C 3.613 10.64 2.79 12.066 2.79 13.597 L 2.79 26.403 C 2.79 27.934 3.613 29.36 4.938 30.125 L 16.028 36.527 C 17.355 37.294 19.001 37.294 20.326 36.527 L 31.417 30.125 C 32.742 29.36 33.565 27.934 33.565 26.403 L 33.565 13.597 C 33.565 12.066 32.742 10.64 31.417 9.875 L 20.326 3.473 C 19.001 2.707 17.355 2.707 16.028 3.473 M 18.178 40 C 17.074 40 15.972 39.717 14.987 39.148 L 3.189 32.337 C 1.222 31.2 0 29.084 0 26.812 L 0 13.189 C 0 10.918 1.222 8.799 3.189 7.663 L 14.987 0.851 C 16.955 -0.284 19.4 -0.284 21.367 0.851 L 33.165 7.663 C 35.133 8.799 36.355 10.918 36.355 13.189 L 36.355 26.812 C 36.355 29.084 35.133 31.2 33.165 32.337 L 21.367 39.148 C 20.384 39.717 19.28 40 18.178 40"
          fill="#1E2024"
        />
      </g>
    </svg>
  )
}

const linkColumns = [
  {
    heading: 'The Gospel',
    links: [
      { label: 'Sermons', href: '/messages' },
      { label: 'Testimonies', href: '#' },
    ],
  },
  {
    heading: 'Quick Links',
    links: [
      { label: 'Our Beliefs', href: '/about' },
      { label: 'Our Team', href: '/about' },
      { label: 'Internships & Counseling', href: '#' },
      { label: 'Discipleship Training', href: '#' },
      { label: 'Resources', href: '#' },
    ],
  },
  {
    heading: 'Community Links',
    links: [
      { label: 'Our Ministries', href: '/connect' },
      { label: 'Community Groups', href: '/connect' },
      { label: 'Education Department', href: '#' },
      { label: 'Missions', href: '#' },
      { label: 'Gallery', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#DBDDE0] px-6 pt-16 pb-10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-10">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-[#1E2024] w-fit">
            <HexagonLogo className="w-8 h-8" />
            <span className="text-lg font-semibold tracking-tight">Mosaic</span>
          </Link>
          <p className="text-[14px] text-[#6B7280] leading-[1.6] max-w-sm">
            Mosaic Christian Fellowship is a diverse church in Northvale, NJ helping people know
            Jesus, grow in faith, and live in community. Join us for Sunday worship, small groups,
            and family-friendly ministries.
          </p>
          <a
            href="https://www.google.com/maps/place/Mosaic+Christian+Fellowship/@41.0001324,-73.9532318,16z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#1E2024] hover:text-[#0066FF] transition-colors w-fit"
          >
            119 Rockland Ave, Northvale, NJ 07647
          </a>
          <Link
            href="/im-new"
            className="text-[14px] text-[#1E2024] hover:text-[#0066FF] transition-colors w-fit"
          >
            I&apos;m new here
          </Link>
        </div>

        {linkColumns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-3">
            <h6 className="text-[16px] font-semibold text-[#1E2024]">{col.heading}</h6>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 text-[14px] text-[#1E2024] hover:text-[#0066FF] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#DBDDE0] text-[13px] text-[#6B7280]">
        © {new Date().getFullYear()} Mosaic Christian Fellowship
      </div>
    </footer>
  )
}
