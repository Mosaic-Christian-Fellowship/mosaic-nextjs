import Image from 'next/image'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import ToFillIn from '@/components/ToFillIn'
import CTASection from '@/components/CTASection'
import { draftAwareMetadata, type PageMeta } from '@/lib/pageMeta'

export const pageMeta: PageMeta = { draft: false }

export const metadata = draftAwareMetadata(pageMeta, {
  title: 'Counseling',
  description:
    'Mosaic partners with other New Jersey churches through the Lighthouse Counseling Network. Reach out and we will help you get connected.',
})

/*
  Rebuilt from mosaicnj.org/learn-more-1 ("Counseling"). The old page's
  newsletter signup block was broken and is left out. The pink "To fill in"
  callouts mark what someone looking for counseling needs that the old page
  doesn't say.
*/

export default function Counseling() {
  return (
    <div>
      <PageHero
        overline="Counseling"
        title="You don't have to carry it alone"
        subtitle="If you or someone you know is looking for counseling, reach out. We'll help you get connected."
      />

      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Partnership" heading="Lighthouse Counseling Network" />
            <p className="text-[#6B7280] leading-relaxed">
              The Lighthouse Counseling Network is a group of New Jersey churches, Mosaic among them, that have
              partnered to provide counseling aid.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              If you or someone you know is looking for counseling, please reach out to us and we&apos;ll help you
              get connected.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:admin@njmosaic.org"
                className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
              >
                admin@njmosaic.org
              </a>
              <a
                href="https://lighthousecounseling.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
              >
                Visit the Lighthouse Counseling website →
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] max-w-md w-full mx-auto overflow-hidden rounded-2xl">
            <Image
              src="/missions/counseling/worship.webp"
              alt="A person with a raised hand during a Mosaic worship service"
              fill
              sizes="(min-width: 768px) 448px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <SectionHeader overline="Getting Started" heading="What to expect when you reach out" />
          <ToFillIn
            items={[
              {
                label: 'After you email',
                question: (
                  <p>
                    What happens after someone emails? Who replies, how fast, and how are they matched with a counselor
                    at one of the partner churches or through Lighthouse?
                  </p>
                ),
              },
              {
                label: 'Cost',
                question: (
                  <p>Is there a cost? Do sessions have a fee, a sliding scale, or help from the church?</p>
                ),
              },
              {
                label: 'Confidentiality',
                question: (
                  <p>
                    What can we promise about confidentiality? People will want to know who at Mosaic sees their request.
                  </p>
                ),
              },
              {
                label: 'Contact',
                question: (
                  <p>
                    Which address should people use, admin@njmosaic.org or welcoming@njmosaic.org? Is there a phone
                    number or form we should offer as well?
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      <CTASection
        overline="Reach Out"
        heading="Ask us about counseling."
        subtext="Tell us what you're looking for and we'll help you get connected."
        cta="Contact Us"
        href="/connect#get-in-touch"
      />
    </div>
  )
}
