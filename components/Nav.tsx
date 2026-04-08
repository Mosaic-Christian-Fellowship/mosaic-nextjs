'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/messages', label: 'Messages' },
  { href: '/connect', label: 'Ministries' },
  { href: '/give', label: 'Give' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setOpen(false)

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#2D3748]">
          Mosaic
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                (href === '/' ? pathname === '/' : pathname.startsWith(href))
                  ? 'text-[#2A9D8F]'
                  : 'text-[#64748B] hover:text-[#2D3748]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/im-new"
            className="bg-[#4E8EBE] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#3E7BA6] transition-colors"
          >
            I'm New
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block w-5 h-0.5 bg-[#2D3748] transition-transform ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#2D3748] transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#2D3748] transition-transform ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-[#E2E8F0] bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`text-sm font-medium py-2 transition-colors ${
                  pathname === href
                    ? 'text-[#2A9D8F]'
                    : 'text-[#64748B]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
