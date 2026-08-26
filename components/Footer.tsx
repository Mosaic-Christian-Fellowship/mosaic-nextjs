import Link from 'next/link'
import Logo from './Logo'

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
          <Link href="/" className="flex items-center text-[#1E2024] w-fit">
            <Logo className="h-10 w-auto" />
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
