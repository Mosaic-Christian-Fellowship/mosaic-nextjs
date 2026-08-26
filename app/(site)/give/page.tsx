import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Give',
  description:
    'Generosity is an act of worship. Give securely online, by check, or set up recurring giving to support the ministry of Mosaic Christian Fellowship.',
}

const OTHER_WAYS = [
  {
    method: 'By Check',
    detail:
      'Make checks payable to Mosaic Christian Fellowship and mail or drop off on a Sunday.',
  },
  {
    method: 'Recurring Giving',
    detail: 'Set up automatic weekly or monthly giving through the ChurchCenter app.',
  },
  {
    method: 'Legacy Giving',
    detail:
      'Interested in including Mosaic in your estate planning? Contact us to learn more.',
  },
]

export default function Give() {
  return (
    <div>
      <PageHero
        overline="Generosity"
        title="Give"
        subtitle="Generosity is an act of worship and a practice of trust. Thank you for partnering with us."
      />

      {/*
        Left-aligned in a max-w-6xl section, matching the Messages child pages.
        The separate "Give Online" section was folded into the single CTA below —
        it held one button and a sentence, which read as a section break for no
        reason once the page was left-aligned.
      */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="Why It Matters" heading="Generosity at Mosaic" />

          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[#6B7280] text-[15px] md:text-base leading-[1.6]">
              Your giving funds the ministries, outreach, and community programs that make
              Mosaic possible. It supports our staff, our building, our children&apos;s
              programming, and the missions work we do locally and globally.
            </p>
            <p className="text-[#6B7280] text-[15px] md:text-base leading-[1.6]">
              We believe generosity is less about an amount and more about a posture — a
              willingness to hold our resources with open hands.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="bg-[#0066FF] text-white font-semibold px-10 py-4 min-h-11 rounded-full text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Give Now
            </button>
            {/*
              The button stays disabled until the church's Church Center account is
              connected. Saying so is deliberate: a dead button with no explanation
              reads as a broken site rather than a pending integration.
            */}
            <p className="text-xs text-[#6B7280] leading-[1.5]">
              Secure online giving opens here once the Church Center account is connected.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHeader heading="Other Ways to Give" />
          <div className="@container">
            <ul className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-6 list-none p-0 m-0">
              {OTHER_WAYS.map(({ method, detail }) => (
                <li
                  key={method}
                  className="p-6 rounded-2xl border border-[#DBDDE0] bg-white flex flex-col gap-2"
                >
                  <h3 className="text-[15px] font-semibold text-[#1E2024] leading-[1.3] text-balance">
                    {method}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-[1.6]">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
