'use client'

import { useRef } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import PlaceholderImage from '@/components/PlaceholderImage'
import FeaturedSermon from '@/components/FeaturedSermon'
import EventsList from '@/components/EventsList'
import LiveStreamBanner from '@/components/LiveStreamBanner'

const ministries = [
  { title: 'Children & Family', imageLabel: 'Children & Family Photo', description: 'Programming for all ages — nursery through middle school. Safe, engaging, and age-appropriate.' },
  { title: 'Youth', imageLabel: 'Youth Ministry Photo', description: 'High school students exploring faith, community, and identity together.' },
  { title: 'College & Young Adults', imageLabel: 'College Group Photo', description: 'A community for college-age and young professionals rooted in authentic relationships.' },
  { title: "Men's & Women's", imageLabel: "Men's & Women's Photo", description: 'Focused groups for men and women to grow in faith and brotherhood/sisterhood.' },
  { title: 'Missions', imageLabel: 'Missions Photo', description: 'Serving locally and globally. Opportunities to engage in outreach and mission trips.' },
]


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const card = scrollRef.current.querySelector('[data-card]') as HTMLElement
    const distance = card ? card.offsetWidth + 24 : 304
    scrollRef.current.scrollBy({ left: dir === 'right' ? distance : -distance, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '70% 40%' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Progressive blur — strong left, fading to none right */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 65%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 65%)',
          }}
        />

        {/* Vignette Scrim — layered radials for organic feel */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 120% 100% at 0% 50%, rgba(30,58,95,0.92) 0%, rgba(30,58,95,0.65) 40%, transparent 70%)',
              'radial-gradient(ellipse 100% 140% at 0% 100%, rgba(30,58,95,0.75) 0%, transparent 50%)',
              'radial-gradient(ellipse 160% 100% at 50% 120%, rgba(30,58,95,0.5) 0%, transparent 40%)',
              'radial-gradient(circle at 0% 0%, rgba(30,58,95,0.65) 0%, transparent 50%)',
            ].join(', '),
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-xl flex flex-col gap-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2A9D8F]">
              Northvale, New Jersey
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              A place to belong, grow, and serve.
            </h1>
            <p className="text-white/80 text-lg">
              Mosaic is a community built around discipleship, genuine friendship, and
              teaching rooted in Scripture. Everyone is welcome here.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <LiveStreamBanner />
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <SectionHeader
              overline="Plan Your Visit"
              heading="What to Expect on a Sunday"
              subtext="Sundays at Mosaic are relaxed, welcoming, and centered on what matters. Here's what's available at each service."
            />
            <div className="flex flex-col gap-4">
              {/* 9:30 AM */}
              <div className="p-5 rounded-2xl border border-[#E2E8F0] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2A9D8F] text-lg">9:30 AM</span>
                  <span className="text-xs bg-slate-100 text-[#64748B] px-3 py-1 rounded-full">Full service</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs bg-[#4E8EBE]/10 text-[#2A9D8F] font-medium px-3 py-1 rounded-full">Children&apos;s Ministry</span>
                  <span className="text-xs bg-[#4E8EBE]/10 text-[#2A9D8F] font-medium px-3 py-1 rounded-full">All Education Ministries</span>
                </div>
              </div>
              {/* 11:30 AM */}
              <div className="p-5 rounded-2xl border border-[#E2E8F0] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2A9D8F] text-lg">11:30 AM</span>
                  <span className="text-xs bg-slate-100 text-[#64748B] px-3 py-1 rounded-full">Full service</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs bg-[#4E8EBE]/10 text-[#2A9D8F] font-medium px-3 py-1 rounded-full">Children&apos;s Ministry</span>
                  <span className="text-xs bg-[#4E8EBE]/10 text-[#2A9D8F] font-medium px-3 py-1 rounded-full">All Education Ministries</span>
                  <span className="text-xs bg-red-50 text-red-500 font-medium px-3 py-1 rounded-full">YouTube Livestream</span>
                </div>
              </div>
              {/* 1:30 PM */}
              <div className="p-5 rounded-2xl border border-[#E2E8F0] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2A9D8F] text-lg">1:30 PM</span>
                  <span className="text-xs bg-slate-100 text-[#64748B] px-3 py-1 rounded-full">General audience</span>
                </div>
                <p className="text-sm text-[#64748B]">No children&apos;s or education programming at this service.</p>
              </div>
            </div>
            <Link href="/im-new" className="text-[#2A9D8F] font-semibold hover:text-[#1E7A6E] transition-colors">
              More info for first-time visitors →
            </Link>
          </div>
          <div className="md:mt-42">
            <PlaceholderImage label="Sunday Service" aspectRatio="aspect-[4/3]" />
          </div>
        </div>
      </section>

      {/* Get Involved — Carousel */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="flex items-end justify-between">
            <SectionHeader
              overline="Get Involved"
              heading="Something for Every Stage of Life"
              subtext="Mosaic has programs and community for everyone — from young children to adults. Find where you fit."
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition-colors text-[#64748B]"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition-colors text-[#64748B]"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
        </div>
        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide mt-12"
        >
          <div
            className="flex gap-6 w-max"
            style={{
              paddingLeft: 'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))',
              paddingRight: 'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))',
            }}
          >
            {ministries.map((m) => (
              <div
                key={m.title}
                data-card
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col shrink-0 w-[280px]"
              >
                <PlaceholderImage label={m.imageLabel} aspectRatio="aspect-[3/4]" className="rounded-none" />
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold text-lg text-[#2D3748]">{m.title}</h3>
                  <p className="text-[#64748B] text-sm flex-1">{m.description}</p>
                  <Link href="/connect" className="mt-2 text-sm font-semibold text-[#2A9D8F] hover:text-[#1E7A6E] transition-colors">
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="bg-[#1E3A5F] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
            &ldquo;We reach the lost for Christ, embrace them in the gospel, and disciple them to Christ.&rdquo;
          </p>
          <Link
            href="/about"
            className="border border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Get to Know Us →
          </Link>
        </div>
      </section>

      {/* Featured Message */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="Latest Message" heading="This Week's Sermon" />
          <div className="max-w-2xl">
            <FeaturedSermon />
          </div>
          <Link href="/messages" className="text-[#2A9D8F] font-semibold hover:text-[#1E7A6E] text-sm transition-colors">
            Browse all messages →
          </Link>
        </div>
      </section>

      {/* Extended Cut — Podcast */}
      <section className="py-20 px-6 bg-[#1E3A5F]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2A9D8F]">
              Podcast
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Extended Cut
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Go deeper than Sunday. Extended Cut is our weekly podcast where we
              unpack the sermon, explore the passage in its historical context, and
              discuss what it means for everyday life.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://open.spotify.com/show/7AZydPQgOQOqdvpiXLGyRR"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#4E8EBE] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#3E7BA6] transition-colors text-sm"
              >
                Listen on Spotify
              </a>
              <a
                href="https://podcasts.apple.com/us/podcast/nj-mosaic-christian-fellowship/id1440078295"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
              >
                Apple Podcasts
              </a>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#2A9D8F]/30 flex items-center justify-center text-2xl">
                🎙️
              </div>
              <div>
                <p className="text-white font-bold">NJ Mosaic Christian Fellowship</p>
                <p className="text-white/50 text-sm">274 episodes</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { title: 'Latest Episode', date: 'New every week' },
                { title: 'Extended teaching & discussion', date: 'Beyond the Sunday sermon' },
                { title: 'Available everywhere', date: 'Spotify · Apple · YouTube' },
              ].map(({ title, date }) => (
                <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#2A9D8F]/20 flex items-center justify-center text-[#2A9D8F] text-sm shrink-0">
                    ▶
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{title}</p>
                    <p className="text-white/40 text-xs">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Events — Portrait Tiles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="What's Happening" heading="Upcoming Events" />
          <EventsList limit={6} layout="bento" />
        </div>
      </section>

      {/* We'd Love to Meet You — Map + Parking */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader
            overline="Find Us"
            heading="We'd Love to Meet You"
            subtext="Here's everything you need to know before you show up on a Sunday."            
          />
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d-73.9475!3d40.9883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2e9f5a3b7c001%3A0x1234567890abcdef!2s119+Rockland+Ave%2C+Northvale%2C+NJ+07647!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mosaic Christian Fellowship Location"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-[#2D3748]">Location</h3>
                <p className="text-[#64748B]">119 Rockland Ave<br />Northvale, NJ 07647</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-[#2D3748]">Service Times</h3>
                <p className="text-[#64748B]">Sundays at 9:30 AM, 11:30 AM, and 1:30 PM</p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg text-[#2D3748]">Parking</h3>
                <div className="p-5 rounded-2xl bg-[#4E8EBE]/10 border border-[#2A9D8F]/20 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#2A9D8F]">New Parking Lot — Now Open</span>
                  <p className="font-semibold text-[#2D3748]">147 Walnut St, Northvale, NJ 07647</p>
                  <p className="text-[#64748B] text-sm">
                    Our dedicated parking lot is a short walk from the building. Free for all attendees.
                    Accessible parking is available near the main entrance.
                  </p>
                </div>
              </div>
              <Link
                href="/im-new"
                className="bg-[#4E8EBE] text-white font-semibold px-6 py-3 rounded-full w-fit hover:bg-[#3E7BA6] transition-colors"
              >
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
