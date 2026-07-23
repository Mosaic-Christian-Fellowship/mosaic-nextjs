import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'The Mosaic Guide',
  description:
    'A practical guide to life at Mosaic Christian Fellowship — formation groups, visiting and membership, ministries, care, baptism, and more.',
}

/*
  Formation Groups is real, ministry-supplied copy. Every other section below is
  placeholder drafted from what is already public on the site, and needs to be
  replaced by the relevant lead before this page is treated as authoritative.
*/
const GUIDE_SECTIONS: { id: string; title: string; items: { q: string; a: ReactNode }[] }[] = [
  {
    id: 'formation-groups',
    title: 'Formation Groups',
    items: [
      {
        q: 'What are formation groups?',
        a: 'Formation Groups — or FGs — are the small communities where we are formed into the likeness of Christ through the Holy Spirit and through one another. The goal is transformation, and to fulfill our vision of discipling people to Christ.',
      },
      {
        q: 'When are Formation Groups active?',
        a: 'Formation Groups are active in two semesters each year — in Spring from February to June, and in Fall, from September to December.',
      },
      {
        q: 'What happens during Formation Groups? How are they run?',
        a: "Formation Groups are kept intentionally small — no more than 12–15 people — so there's real room for everyone to be known and to participate. Most groups meet weekly at a consistent day, time, and location. In the Fall, leaders have the freedom to shape their group's focus: either reflecting together on the most recent sermon, or working through an approved book. In the Spring, all groups return to a shared rhythm of discussing and reflecting on the most recent sermon together.",
      },
      {
        q: 'How long do Formation Groups last?',
        a: 'Formation groups last approximately 3½ months.',
      },
      {
        q: 'How do I join Formation Groups?',
        a: "Start by downloading the Church Center app and creating an account. Once you're set up, search for and join Mosaic within the app. From there, tap on Groups in the bottom toolbar, browse until you find a group that interests you, and tap Register to join.",
      },
      {
        q: 'Who do I talk to if I have questions?',
        a: (
          <p>
            If you have any questions, please reach out to Discipleship Pastor Andre Choi via email at{' '}
            <a
              href="mailto:andre@njmosaic.org"
              className="text-[#0052CC] underline underline-offset-2 hover:no-underline"
            >
              andre@njmosaic.org
            </a>
            .
          </p>
        ),
      },
      {
        q: 'How do I become an FG leader?',
        a: (
          <>
            <p>
              Leading others spiritually is a serious and consequential responsibility, so we want to
              make sure we&apos;re serving the body of Christ well. To become an FG leader, you must be a
              member of the church and follow the process below:
            </p>
            <ol className="list-decimal pl-5 mt-3 flex flex-col gap-1">
              <li>Participate in an FG</li>
              <li>Be nominated by your leader</li>
              <li>Interview with the Discipleship Pastor</li>
              <li>Apprentice a term under a leader</li>
              <li>Lead the following semester</li>
            </ol>
          </>
        ),
      },
    ],
  },
  {
    id: 'visiting-and-membership',
    title: 'Visiting and Membership',
    items: [
      {
        q: 'What can I expect when I visit for the first time?',
        a: "When you first arrive at Mosaic you'll encounter our friendly welcoming team wearing white vests. Please let them know it's your first time attending, and they will talk with you to get to know you better!",
      },
      {
        q: 'What are some next steps after my first visit to get connected?',
        a: (
          <p>
            Before service, during announcements, and after service, keep an eye out for a QR code —
            it&apos;s your quickest way to download the Church Center app, where you&apos;ll find our
            announcements, church calendar, and sign-ups for upcoming events. And if you&apos;re looking
            for our social media, podcasts, or past sermons, you can find all of it in one place at
            our{' '}
            <a
              href="https://linktr.ee/mosaicnj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0052CC] underline underline-offset-2 hover:no-underline"
            >
              LinkTree
            </a>
            .
          </p>
        ),
      },
      {
        q: 'Who do I talk to if I have questions?',
        a: (
          <p>
            If you have any questions, please reach out to Discipleship Pastor Andre Choi via email at{' '}
            <a
              href="mailto:andre@njmosaic.org"
              className="text-[#0052CC] underline underline-offset-2 hover:no-underline"
            >
              andre@njmosaic.org
            </a>
            .
          </p>
        ),
      },
      {
        q: 'How do I become a member?',
        a: "Becoming a member starts with attending our two-session membership class, offered twice a year — usually in the Spring and the Fall — with both sessions held on Sunday afternoons following second service. Attendance at both sessions is required. This class gives us the chance to clearly walk through what we believe as a church, what membership entails, and guide you through all the details of our church. From there, an elder may ask to meet with you personally, as a way of getting to know you and hearing more about your faith journey. Once that process is complete, you'll formally become a member by affirming your vows in front of the congregation during whichever service you attend.",
      },
    ],
  },
  {
    id: 'ministries',
    title: 'Ministries',
    items: [
      {
        q: 'What are ministries? What ministries does Mosaic have?',
        a: "At Mosaic, a ministry is a team of people using their gifts to serve a specific need within our church family — whether that's welcoming people at the door, running sound and video, caring for our kids, or leading worship. No single group of leaders can carry the full life of this church alone; it takes many hands, working in different areas, all pointed toward the same purpose. Serving on a ministry team is one of the clearest ways to live out our calling to build up the body of Christ and to grow in relationship with the people you serve alongside.",
      },
      {
        q: 'Who can propose a new ministry?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'What is the approval process like?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: "Can I serve if I'm not a member?",
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'Do I need training or experience to serve?',
        a: 'Placeholder answer — content to come.',
      },
    ],
  },
  {
    id: 'groups',
    title: 'Groups',
    items: [
      {
        q: 'What is a community group?',
        a: 'A group of people from Mosaic who meet during the week to share a meal, talk honestly, and look out for each other.',
      },
      {
        q: 'Where do groups meet?',
        a: 'In homes throughout Bergen County, on a range of weeknights, so there is usually one near you.',
      },
      {
        q: 'Can I visit a group before joining?',
        a: 'Yes, and we recommend it. Most groups are glad to have someone drop in for a night before deciding.',
      },
      {
        q: 'Are there groups for specific stages of life?',
        a: 'Some groups are built around a stage of life — young adults, parents, empty nesters — and others are intentionally mixed.',
      },
      {
        q: 'What if I cannot make it every week?',
        a: 'Come when you can. Groups work best with consistency, but life happens and nobody is keeping attendance.',
      },
    ],
  },
  {
    id: 'care-and-counseling',
    title: 'Care & Counseling',
    items: [
      {
        q: 'What kind of care does Mosaic offer?',
        a: 'Prayer, pastoral conversation, practical help in a crisis, and referrals to licensed counselors when that is the right next step.',
      },
      {
        q: 'How do I request prayer?',
        a: 'Use the prayer request form on the site, or find a pastor after either service. Requests stay confidential unless you say otherwise.',
      },
      {
        q: 'Is counseling through the church confidential?',
        a: 'Yes, within the limits any counselor is bound by. We will explain those limits before you begin.',
      },
      {
        q: 'Is there a cost?',
        a: 'Pastoral care is free. Outside counselors we refer you to set their own fees, and we can sometimes help with the cost.',
      },
      {
        q: 'What if I need help urgently?',
        a: 'Call the church office and say it is urgent. If you are in immediate danger, call 911 first and then let us know.',
      },
    ],
  },
  {
    id: 'baptism',
    title: 'Baptism',
    items: [
      {
        q: 'What does baptism mean?',
        a: 'It is a public declaration that you are trusting Jesus and joining his people. It marks a decision rather than earning one.',
      },
      {
        q: 'Who can be baptized?',
        a: 'Anyone who has decided to follow Jesus and can say so for themselves. We talk with each person first.',
      },
      {
        q: 'How often do baptisms happen?',
        a: 'We schedule baptism Sundays a few times a year and announce them in advance.',
      },
      {
        q: 'What happens during a baptism?',
        a: 'You share briefly about your faith, a pastor baptizes you by immersion, and the church celebrates with you.',
      },
      {
        q: 'What about baptizing children?',
        a: 'We baptize children once they can express their own faith. For younger children we offer a dedication instead.',
      },
    ],
  },
  {
    id: 'childrens-services',
    title: "Children's Services",
    items: [
      {
        q: 'What happens with my kids during the service?',
        a: 'Children are welcome to stay with you, and we also run age-appropriate programming during both gatherings.',
      },
      {
        q: 'How does check-in work?',
        a: 'Check in at the kids table in the lobby. You get a matching tag and only you can pick your child up with it.',
      },
      {
        q: 'Are volunteers screened?',
        a: 'Yes. Everyone serving with children is background-checked and trained before they are with kids on their own.',
      },
      {
        q: 'What ages do you serve?',
        a: 'Nursery through elementary during both services, with youth programming meeting separately during the week.',
      },
      {
        q: 'What if my child has allergies or additional needs?',
        a: 'Tell us at check-in. We keep notes on file and will work with you so your child is safe and included.',
      },
    ],
  },
  {
    id: 'placeholder',
    title: 'Placeholder',
    items: [
      { q: 'Placeholder question one', a: 'Placeholder answer one.' },
      { q: 'Placeholder question two', a: 'Placeholder answer two.' },
      { q: 'Placeholder question three', a: 'Placeholder answer three.' },
      { q: 'Placeholder question four', a: 'Placeholder answer four.' },
      { q: 'Placeholder question five', a: 'Placeholder answer five.' },
    ],
  },
]

export default function MosaicGuide() {
  return (
    <div>
      <PageHero
        overline="About Us"
        title="The Mosaic Guide"
        subtitle="Everything you need to know about life at Mosaic — in one place."
      />

      {/* Intro */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <SectionHeader overline="Start Here" heading="Welcome to Mosaic" centered />
          <p className="text-[#6B7280] text-center leading-relaxed">
            Whether this is your first visit or you have been around for years, this guide walks
            through how our church works — what happens on a Sunday, how to find community, and
            where to take your next step.
          </p>
        </div>
      </section>

      {/* Guide sections */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {GUIDE_SECTIONS.map(({ id, title, items }) => (
            <div key={id} id={id} className="bg-[#E8EFFD] rounded-3xl px-6 md:px-12 py-10 md:py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E2024] mb-4">{title}</h2>
              <FaqAccordion items={items} variant="arrow" idPrefix={id} />
            </div>
          ))}
        </div>
      </section>

      {/* Next steps */}
      <section className="py-20 px-6 bg-[#FFFFFF]">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-8">
          <SectionHeader overline="Next Steps" heading="Come Visit Us" centered />
          <p className="text-[#6B7280] text-center">
            Planning your first visit? Let us know you are coming and we will look for you on Sunday.
          </p>
          <Link
            href="/im-new"
            className="bg-[#0066FF] text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-[#0052CC] transition-colors"
          >
            Plan Your Visit
          </Link>
        </div>
      </section>
    </div>
  )
}
