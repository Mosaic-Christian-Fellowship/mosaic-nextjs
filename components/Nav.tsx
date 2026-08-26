'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/nav'
import Logo from './Logo'

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
        <Link href="/" className="flex items-center text-[#1E2024]">
          <Logo className="h-10 w-auto" />
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
