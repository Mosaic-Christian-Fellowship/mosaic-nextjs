import Link from 'next/link'
import SectionHeader from './SectionHeader'
import PlaceholderImage from './PlaceholderImage'

const services = [
  {
    time: '9:30 AM',
    badge: 'Full service',
    tags: ["Children's Ministry", 'All Education Ministries'],
  },
  {
    time: '11:30 AM',
    badge: 'Full service',
    tags: ["Children's Ministry", 'All Education Ministries', 'YouTube Livestream'],
  },
  {
    time: '1:30 PM',
    badge: 'General audience',
    note: "No children's or education programming at this service.",
  },
]

export default function PlanVisitSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="flex flex-col gap-8">
          <SectionHeader
            overline="Plan Your Visit"
            heading="What to Expect on a Sunday"
            subtext="Sundays at Mosaic are relaxed, welcoming, and centered on what matters. Here's what's available at each service."
          />
          <div className="flex flex-col gap-4">
            {services.map((s) => (
              <div
                key={s.time}
                className="p-5 rounded-[12px] border border-[#E5E7EB] bg-white flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#1E2024]">{s.time}</span>
                  <span className="text-xs font-medium text-[#6B7280] bg-[#F5F5F7] px-3 py-1 rounded-full">
                    {s.badge}
                  </span>
                </div>
                {s.tags && (
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-semibold text-[#0041A2] bg-[#0066FF]/10 px-3 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {s.note && <p className="text-sm text-[#6B7280] leading-[1.6]">{s.note}</p>}
              </div>
            ))}
          </div>
          <Link
            href="/im-new"
            className="text-[#0066FF] font-semibold text-[15px] hover:opacity-70 transition-opacity"
          >
            More info for first-time visitors →
          </Link>
        </div>
        <PlaceholderImage label="Sunday Service" aspectRatio="aspect-[4/3]" />
      </div>
    </section>
  )
}
