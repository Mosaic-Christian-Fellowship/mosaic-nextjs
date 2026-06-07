import Link from 'next/link'
import SectionHeader from './SectionHeader'

export default function MeetYou() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <SectionHeader
          overline="Find Us"
          heading="We'd Love to Meet You"
          subtext="Here's everything you need to know before you show up on a Sunday."
          centered
        />

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3 aspect-[16/10] rounded-[12px] overflow-hidden border border-[#E5E7EB]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d-73.9475!3d40.9883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2e9f5a3b7c001%3A0x1234567890abcdef!2s119+Rockland+Ave%2C+Northvale%2C+NJ+07647!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              tabIndex={-1}
              referrerPolicy="no-referrer-when-downgrade"
              title="Mosaic Christian Fellowship Location"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-semibold text-[#1E2024]">Location</h3>
              <p className="text-[15px] text-[#6B7280] leading-[1.6]">
                119 Rockland Ave
                <br />
                Northvale, NJ 07647
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-semibold text-[#1E2024]">Service Times</h3>
              <p className="text-[15px] text-[#6B7280] leading-[1.6]">
                Sundays at 9:30 AM, 11:30 AM, and 1:30 PM
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[16px] font-semibold text-[#1E2024]">Parking</h3>
              <div className="p-5 rounded-[12px] bg-[#0066FF]/5 border border-[#0066FF]/15 flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0066FF]">
                  New Parking Lot — Now Open
                </span>
                <p className="text-[15px] font-semibold text-[#1E2024]">
                  147 Walnut St, Northvale, NJ 07647
                </p>
                <p className="text-[14px] text-[#6B7280] leading-[1.6]">
                  Our dedicated parking lot is a short walk from the building. Free for all
                  attendees. Accessible parking is available near the main entrance.
                </p>
              </div>
            </div>

            <Link
              href="/im-new"
              className="inline-flex items-center justify-center h-[50px] px-7 bg-[#0066FF] text-white text-[15px] font-semibold rounded-[10px] w-full md:w-fit hover:brightness-110 transition-[filter]"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
