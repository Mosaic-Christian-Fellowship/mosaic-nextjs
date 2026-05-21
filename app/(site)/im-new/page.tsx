import SectionHeader from '@/components/SectionHeader'
import PlaceholderImage from '@/components/PlaceholderImage'
import PlanVisitForm from '@/components/PlanVisitForm'

const faqs = [
  { q: "What should I wear?", a: "Come as you are — seriously. You'll see everything from jeans and t-shirts to business casual on a Sunday. There's no dress code." },
  { q: "How long is the service?", a: "About 75 minutes — live worship, a teaching that connects scripture to everyday life, and time to connect with people after." },
  { q: "Will I be called out as a first-time visitor?", a: "Not publicly. We won't put you on the spot. We do hope you'll introduce yourself to someone nearby — everyone's pretty friendly." },
  { q: "What happens with my kids?", a: "Children's programming runs during the 9:30 and 11:30 AM services. You'll check your kids in at our welcome area — staff will walk you through it." },
  { q: "Do I need to bring a Bible?", a: "Nope. Scripture is displayed on screen during the message. But bring one if you'd like to follow along." },
  { q: "I've had a bad experience with church before. Is it safe to try again?", a: "We hear that a lot — and we're sorry. Mosaic isn't a church for people who have it all together. It's a community of broken, ordinary people figuring out faith together. You're not a project. You're welcome at whatever pace feels right." },
  { q: "I'm not sure I believe in God anymore. Is that okay?", a: "Absolutely. Doubt isn't the opposite of faith — it's part of the journey. Our teaching is academically grounded and built for people who have real questions. You don't need to check your brain at the door." },
  { q: "Do I have to give money?", a: "No. Giving is part of our worship, but there's no pressure and no expectation for visitors. If the plate passes by, just pass it along." },
  { q: "Is there coffee?", a: "Yes. Grab a cup before the service and stick around after — some of the best conversations happen over coffee in the lobby." },
]

export default function ImNew() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0066FF] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-left flex flex-col gap-5">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Broken pieces. Different stories.<br />One beautiful mosaic.</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Broken pieces from different lives, forming something beautiful together.
            Whether you&apos;re exploring faith for the first time, coming back after a long time away, or just looking for a place that feels like home — we have a seat for you.
          </p>
        </div>
      </section>

      {/* Service Times & Location */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="When & Where" heading="Service Times & Location" />
            <div className="flex flex-col gap-4">
              {[
                { time: '9:30 AM', note: 'Full service · Children\'s Ministry + all education ministries' },
                { time: '11:30 AM', note: 'Full service · Children\'s Ministry + all education · YouTube Livestream' },
                { time: '1:30 PM', note: 'General service · No children\'s or education programming' },
              ].map(({ time, note }) => (
                <div key={time} className="flex gap-4 items-start">
                  <span className="font-bold text-[#0066FF] w-20 shrink-0">{time}</span>
                  <span className="text-[#7F838A]">{note}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="p-4 bg-[#F5F5F7] rounded-xl text-sm text-[#7F838A]">
                119 Rockland Ave · Northvale, NJ 07647
              </div>
              <div className="p-4 bg-[#F5F5F7] rounded-xl text-sm text-[#7F838A]">
                Parking at 147 Walnut St, Northvale (our new lot — it&apos;s right next door)
              </div>
              <p className="text-sm text-[#7F838A]">
                <strong className="text-[#1E2024]">First time?</strong> Arrive about 10 minutes early. Look for greeters outside — they&apos;ll show you where to go, help you check in your kids, and point you to coffee.
              </p>
            </div>
          </div>
          <PlaceholderImage label="Map / Building Photo" aspectRatio="aspect-[4/3]" />
        </div>
      </section>

      {/* What Sunday Looks Like */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="What to Expect" heading="What a Sunday Looks Like" centered />
          <div className="flex flex-col gap-6">
            {[
              { step: '1', heading: 'Arrive & Be Welcomed', detail: 'Greeters will meet you at the door. Grab a coffee, find a seat. No pressure.' },
              { step: '2', heading: 'Drop Off Your Kids', detail: 'Head to the welcome area to check your children in. Our kids team will take it from there.' },
              { step: '3', heading: 'Worship Together', detail: 'We open with 20-25 minutes of congregational worship — live music, familiar and new songs.' },
              { step: '4', heading: 'The Message', detail: 'Our pastor teaches through books of the Bible, providing historical context and practical application.' },
              { step: '5', heading: 'Stay & Connect', detail: "Don't rush out. Some of the best conversations happen after the service. Stick around." },
            ].map(({ step, heading, detail }) => (
              <div key={step} className="flex gap-6 items-start">
                <span className="w-10 h-10 rounded-full bg-[#0066FF] text-white font-bold flex items-center justify-center shrink-0">
                  {step}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{heading}</h3>
                  <p className="text-[#7F838A]">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kids & Family */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <PlaceholderImage label="Kids Ministry Photo" aspectRatio="aspect-[4/3]" />
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Families Welcome" heading="Your Kids Are in Good Hands" />
            <p className="text-[#7F838A]">
              We have dedicated programming for every age group during the 9:30 and 11:30 AM services —
              from the nursery through 5th grade. All children&apos;s workers are background-checked and trained.
            </p>
            <div className="flex flex-col gap-2">
              {['Nursery (0-18 months)', 'Toddlers (18 months - 3 years)', 'Preschool (3-5 years)', 'Elementary (Grades 1-5)'].map((group) => (
                <div key={group} className="flex gap-3 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                  <span className="text-[#7F838A]">{group}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <SectionHeader overline="Common Questions" heading="FAQ" />
            <p className="text-[#7F838A] text-base leading-relaxed">
              Have a question we haven&apos;t answered yet? We&apos;d love to hear from you — no question
              is too small.
            </p>
            <a
              href="mailto:welcoming@njmosaic.org"
              className="text-[#0066FF] font-semibold hover:text-[#0041A2] transition-colors w-fit"
            >
              Get in touch →
            </a>
          </div>
          <div className="flex flex-col divide-y divide-[#E5E7EB]">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group py-4 [&::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 marker:hidden">
                  <h3 className="font-semibold text-lg text-[#1E2024] flex-1">{q}</h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="shrink-0 mt-1.5 text-[#7F838A] transition-transform group-open:rotate-180"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="mt-3 text-[#7F838A] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Your Next Steps */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <SectionHeader overline="Your Journey" heading="What Getting Involved Looks Like" centered />
          <p className="text-[#7F838A] text-center">There&apos;s no formula and no pressure. But if you&apos;re wondering what a path forward might look like, here&apos;s how most people find their way in.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 'Show Up', desc: 'Come to a Sunday service. Grab coffee. See if it feels right.' },
              { step: 'Connect', desc: 'Fill out a visit form or chat with someone after the service. We\'ll follow up — gently.' },
              { step: 'Go Deeper', desc: 'Join a community group, serve on a team, or start asking the bigger questions.' },
              { step: 'Reach', desc: 'Once Mosaic feels like home, help someone else find theirs.' },
            ].map(({ step, desc }, i) => (
              <div key={step} className="flex flex-col gap-3 text-center">
                <span className="w-10 h-10 rounded-full bg-[#0066FF] text-white font-bold flex items-center justify-center mx-auto">{i + 1}</span>
                <h3 className="font-bold text-[#1E2024]">{step}</h3>
                <p className="text-sm text-[#7F838A]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Visit */}
      <section className="py-20 px-6 bg-[#F5F5F7]">
        <div className="max-w-lg mx-auto flex flex-col gap-8">
          <SectionHeader overline="We'd Love to Hear From You" heading="Plan Your Visit" centered />
          <p className="text-[#7F838A] text-center">
            Let us know you&apos;re coming and we&apos;ll make sure someone&apos;s there to welcome you personally.
          </p>
          <PlanVisitForm />
        </div>
      </section>
    </div>
  )
}
