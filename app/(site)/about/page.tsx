import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import PlaceholderImage from '@/components/PlaceholderImage'
import TeamGridCrossfade from '@/components/TeamGridCrossfade'
import CTASection from '@/components/CTASection'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who we are at Mosaic Christian Fellowship — our mission to Reach, Embrace, and Disciple, what we believe, and the story behind the name.',
}

const CORE_VALUES = [
  'Gospel Centered',
  'Grace Based',
  'Scripture Anchored',
  'Discipleship Focused',
  'Missions Minded',
  'Local & Global',
  'Movement & Multiplication',
]

// Statement of faith as supplied by staff in the content review doc (Sep 2026).
const STATEMENT_OF_FAITH = [
  { q: 'Trinity', a: 'We believe there is one God who made everything that exists, and that this one God has always existed as three persons: the Father, the Son, and the Holy Spirit. They are equally God, perfectly loving one another, and have invited us into that love.' },
  { q: 'Holy Spirit', a: "We believe the Holy Spirit is God's living presence with us today. He opens our eyes to the truth about Jesus, awakens our hearts when we are spiritually dead, lives inside every believer, and gives us the power to grow, to love, and to live in a way that honors God." },
  { q: 'Scriptures', a: "We believe the Bible, both the Old and New Testaments, is God's Word to us. It is true, trustworthy, and tells us everything we need to know to be saved and to follow Jesus, and it is our final authority for what we believe and how we live." },
  { q: 'Christ', a: 'We believe Jesus is fully God and fully human. He was conceived by the Holy Spirit and born of the Virgin Mary, lived a perfect life, died on the cross to pay for our sins, rose from the dead, and is now in heaven, where He represents us before the Father and prays for us.' },
  { q: 'Humankind', a: "We believe every person, man and woman, was created in the image of God with dignity and worth. But we have all turned away from God through sin, and on our own we cannot find our way back. We need the Rescuer in Jesus to find our way back to God and everything we've been made for." },
  { q: 'The Gospel', a: "We believe the gospel is the best news in the world: God sent His Son Jesus to live the perfect life we couldn't live, to die in our place for the sins we have committed, and to rise again, defeating sin and death forever. This rescue is not something we earn by being good enough, it is a free gift, received by trusting in Jesus alone." },
  { q: 'Salvation', a: 'We believe we are made right with God only through what Jesus has done for us, His perfect life and His death on the cross. When we put our trust in Him, we are immediately reconciled to God and the Holy Spirit gives us new life. In this salvation, we begin to be transformed and remade. We believe this process of being transformed requires both the work of God and the work of man.' },
  { q: 'Sacraments', a: "We believe Jesus gave His Church two sacred practices to remind us of His promises and to strengthen our faith: baptism and the Lord's Supper (Communion). Baptism is a visible sign that we have been united to Jesus and welcomed into His family, and the Lord's Supper is a sacred meal where we remember Jesus' death for us, spiritually feed on Him by faith, and look forward to the day He returns." },
  { q: 'Church', a: 'We believe that everyone who truly trusts in Jesus is part of one global family called the Church. We belong to one another, we serve one another, and together we make up the Body of Christ, with Jesus Himself as our Head.' },
  { q: 'Return of Christ', a: 'We believe Jesus is coming back. When He returns, He will make all things right, raise the dead, and welcome His people into everlasting joy with Him. Those who have refused Him will face His just judgment. This hope shapes how we live today.' },
]

export default function About() {
  return (
    <div>
      <PageHero
        overline="Who We Are"
        title="Built on faith. Rooted in community."
        subtitle="A home for seekers, believers, and everyone in between — here in northern New Jersey."
      />

      {/* Mission & Values */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Our Mission" heading="Reach. Embrace. Disciple." centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { word: 'Reach', description: 'We actively pursue those who are far from God — through relationships, outreach, and a culture of welcome.' },
              { word: 'Embrace', description: 'Everyone who walks through our doors is met with genuine warmth and a place at the table, regardless of background.' },
              { word: 'Disciple', description: 'We are committed to helping people grow in their faith through teaching, community, and intentional formation.' },
            ].map(({ word, description }) => (
              <div key={word} className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E7EB]">
                <PlaceholderImage label={`${word} photo`} aspectRatio="aspect-[4/3]" />
                <span className="text-2xl font-bold text-[#0066FF]">{word}</span>
                <p className="text-[#6B7280]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Story" heading="Who We Are" />
            <p className="text-[#6B7280] leading-relaxed">
              Mosaic Christian Fellowship exists for one reason: to help people find their place in
              God&apos;s family. We&apos;re a diverse community in Northvale, New Jersey — students,
              young families, longtime believers, and first-time guests — learning together what it
              means to reach the lost, embrace the broken, and grow as disciples of Jesus.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              The name says it best. A mosaic is made of different pieces, each carrying its own
              story, brought together into something beautiful. That&apos;s the church we&apos;re
              building — and there&apos;s a place in it for you.
            </p>
          </div>
          <PlaceholderImage label="Church History Photo" aspectRatio="aspect-[4/3]" />
        </div>
      </section>

      {/* Meet Our Team — Crossfade grid ported from wireframe */}
      <TeamGridCrossfade />

      {/* What We Believe */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeader overline="Our Beliefs" heading="What We Believe" centered />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
              <h3 className="font-bold text-lg text-[#1E2024]">Our Core Values</h3>
              <ul className="flex flex-wrap gap-2">
                {CORE_VALUES.map((value) => (
                  <li
                    key={value}
                    className="text-sm font-semibold px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0041A2]"
                  >
                    {value}
                  </li>
                ))}
              </ul>
              <p className="text-[#6B7280]">
                Mosaic Christian Fellowship makes efforts to keep these core values at the forefront of all that
                we do. These values fuel our decision making, convictions, and most importantly our vision and
                mission.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
                <h3 className="font-bold text-lg text-[#1E2024] mb-2">Our Vision</h3>
                <p className="text-[#6B7280]">Reach. Embrace. Disciple.</p>
              </div>
              <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
                <h3 className="font-bold text-lg text-[#1E2024] mb-2">Our Mission</h3>
                <p className="text-[#6B7280]">
                  We reach the lost for Christ, embrace them in the Gospel, and disciple them to Christ.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
            <h3 className="font-bold text-2xl text-[#1E2024] text-center [text-wrap:balance]">
              Our Statement of Faith
            </h3>
            <FaqAccordion items={STATEMENT_OF_FAITH} />
          </div>
        </div>
      </section>

      {/* Mosaic Name — What It Means */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <SectionHeader overline="Why Mosaic?" heading="Broken Pieces, Beautiful Together" centered />
          <p className="text-[#6B7280] text-lg leading-relaxed">
            A mosaic is made from broken fragments — different colors, shapes, and textures — pieced
            together to form something beautiful. That&apos;s who we are. We&apos;re not a church for people
            who have it all together. We&apos;re a community of ordinary, imperfect people who believe
            that God takes the broken pieces of our lives and makes something meaningful.
          </p>
          <p className="text-[#6B7280] text-lg leading-relaxed">
            No matter where you&apos;ve been or what you carry, there&apos;s a place for you in this picture.
          </p>
        </div>
      </section>

      {/* Affiliation / Denomination */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeader overline="Our Family" heading="Where We Belong" />
            <p className="text-[#6B7280] leading-relaxed">
              However you map the landscape of churches, what matters most to us is staying faithful
              to Scripture and connected to the wider family of God&apos;s people. We partner with
              other churches and ministries near and far to reach our community and serve the world.
            </p>
          </div>
          <div className="flex flex-col gap-4 p-8 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
            <h3 className="font-bold text-lg text-[#1E2024]">Quick Facts</h3>
            <div className="flex flex-col gap-3 text-[#6B7280] text-sm">
              <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]">
                <span>Location</span>
                <span className="font-medium text-[#1E2024] text-right">Northvale, NJ</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]">
                <span>Sunday Services</span>
                <span className="font-medium text-[#1E2024] text-right">9:30, 11:30 &amp; 1:30</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span>Mission</span>
                <span className="font-medium text-[#1E2024] text-right">Reach. Embrace. Disciple.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        overline="Ready to Visit?"
        heading="Come as you are."
        subtext="We'd love to meet you on a Sunday. Here's everything you need to know before your first visit."
        cta="Plan Your Visit"
        href="/im-new"
      />
    </div>
  )
}
