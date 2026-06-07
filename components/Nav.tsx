'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SubItem = { label: string; href: string }
type NavItem = { label: string; href?: string; items?: SubItem[] }

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Church',
    items: [
      { label: 'Our Beliefs', href: '/about' },
      { label: 'Our Team', href: '/about' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Events', href: '/events' },
      { label: 'Community Groups', href: '/connect' },
      { label: 'Internships & Counseling', href: '#' },
      { label: 'Discipleship Training', href: '#' },
      { label: 'Gallery', href: '#' },
    ],
  },
  {
    label: 'Ministries',
    items: [
      { label: 'Our Ministries', href: '/connect' },
      { label: 'Education Department', href: '#' },
      { label: 'Missions', href: '#' },
    ],
  },
  {
    label: 'Messages',
    items: [
      { label: 'Sermons', href: '/messages' },
      { label: 'Testimonies', href: '#' },
      { label: 'Resources', href: '#' },
    ],
  },
  { label: 'Give', href: '/give' },
]

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

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-hero]')
    if (!hero) {
      setScrolled(true)
      return
    }
    const getThreshold = () => hero.offsetHeight / 2
    let threshold = getThreshold()
    const onScroll = () => setScrolled(window.scrollY > threshold)
    const onResize = () => {
      threshold = getThreshold()
      onScroll()
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    setOpenDropdown(null)
    setMobileOpen(false)
  }, [pathname])

  const headerBg = scrolled
    ? 'bg-white border-b border-[#E2E8F0]'
    : 'bg-white/95 backdrop-blur-sm border-b border-transparent'

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 font-inter transition-[background-color,border-color] duration-200 ${headerBg}`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-5 px-5 md:px-10 py-5">
        <Link href="/" className="flex items-center gap-2 text-[#1E2024]">
          <HexagonLogo className="w-8 h-8" />
          <span className="text-lg font-semibold tracking-tight">Mosaic</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) =>
            item.items ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown((cur) => (cur === item.label ? null : item.label))}
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                  className="flex items-center gap-1 text-[15px] font-medium text-[#1E2024] hover:opacity-70 transition-opacity"
                >
                  {item.label}
                  <ChevronDown className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                    <div role="menu" className="min-w-[200px] bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-2">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-[#1E2024] hover:bg-[#F5F7FA] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="text-[15px] font-medium text-[#1E2024] hover:opacity-70 transition-opacity"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/im-new"
            className="group relative hidden md:inline-flex items-center h-[50px] rounded-[30px] bg-[#0066FF] border border-[rgba(19,21,23,0.1)] overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="absolute left-[5px] top-[5px] bottom-[5px] w-10 bg-white rounded-full transition-[width] duration-300 ease-out group-hover:w-[calc(100%-10px)]"
            />
            <span className="relative z-10 flex items-center justify-center w-10 h-10 ml-[5px] text-[#0066FF] shrink-0">
              <ArrowRight />
            </span>
            <span className="relative z-10 ml-[15px] mr-[30px] text-[15px] font-semibold text-white transition-colors duration-300 group-hover:text-[#0066FF]">
              Plan a visit
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span aria-hidden="true" className={`block w-5 h-0.5 bg-[#1E2024] transition-transform ${mobileOpen ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span aria-hidden="true" className={`block w-5 h-0.5 bg-[#1E2024] transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span aria-hidden="true" className={`block w-5 h-0.5 bg-[#1E2024] transition-transform ${mobileOpen ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-[#E2E8F0] bg-white">
          <div className="max-w-[1200px] mx-auto px-5 py-4 flex flex-col">
            {NAV_ITEMS.map((item) =>
              item.items ? (
                <div key={item.label} className="py-1">
                  <button
                    onClick={() => setOpenDropdown((cur) => (cur === item.label ? null : item.label))}
                    aria-expanded={openDropdown === item.label}
                    className="flex items-center justify-between w-full text-[15px] font-medium text-[#1E2024] py-3"
                  >
                    {item.label}
                    <ChevronDown className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4 flex flex-col pb-2">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block py-3 text-sm text-[#1E2024]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="block py-3 text-[15px] font-medium text-[#1E2024]"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/im-new"
              className="mt-3 inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#0066FF] text-white text-[15px] font-semibold"
            >
              Plan a visit
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
