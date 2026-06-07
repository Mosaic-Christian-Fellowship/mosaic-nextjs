import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Give',
  description:
    'Generosity is an act of worship. Give securely online, by check, or set up recurring giving to support the ministry of Mosaic Christian Fellowship.',
}

export default function Give() {
  return (
    <div>
      <PageHero
        overline="Generosity"
        title="Give"
        subtitle="Generosity is an act of worship and a practice of trust. Thank you for partnering with us."
      />

      {/* Why We Give */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <SectionHeader overline="Why It Matters" heading="Generosity at Mosaic" centered />
          <p className="text-[#6B7280] text-center leading-relaxed">
            Your giving funds the ministries, outreach, and community programs that make Mosaic possible.
            It supports our staff, our building, our children&apos;s programming, and the missions work we do
            locally and globally.
          </p>
          <p className="text-[#6B7280] text-center leading-relaxed">
            We believe generosity is less about an amount and more about a posture — a willingness to
            hold our resources with open hands.
          </p>
        </div>
      </section>

      {/* Give Online */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-8">
          <SectionHeader overline="Online Giving" heading="Give Online" centered />
          <p className="text-[#6B7280] text-center">
            Secure online giving through Planning Center. Set up a one-time or recurring gift in minutes.
          </p>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="bg-[#0066FF] text-white font-semibold px-10 py-4 rounded-full text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Give Now
          </button>
          <p className="text-xs text-[#6B7280] text-center">
            Secure online giving opens here once the Church Center account is connected.
          </p>
        </div>
      </section>

      {/* Other Ways */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="Other Options" heading="Other Ways to Give" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { method: 'By Check', detail: 'Make checks payable to Mosaic Christian Fellowship and mail or drop off on a Sunday.' },
              { method: 'Recurring Giving', detail: 'Set up automatic weekly or monthly giving through the ChurchCenter app.' },
              { method: 'Legacy Giving', detail: 'Interested in including Mosaic in your estate planning? Contact us to learn more.' },
            ].map(({ method, detail }) => (
              <div key={method} className="p-6 rounded-2xl border border-[#E5E7EB] flex flex-col gap-2">
                <h3 className="font-bold">{method}</h3>
                <p className="text-[#6B7280] text-sm">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
