import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import FaqAccordion from '@/components/FaqAccordion'
import GuideTableOfContents from '@/components/GuideTableOfContents'

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
        a: 'Formation Groups — or FGs — are the small communities where we gather together to experience Christ Jesus present among us — ministering to us and through us by His Spirit — so that our lives and our community are genuinely transformed. FGs are a vital aspect of fulfilling our vision to disciple people to Christ.',
      },
      {
        q: 'When are Formation Groups active?',
        a: 'Formation Groups are active in two semesters each year — in Spring they are generally active from late-February to late May, and in Fall, from late-September to early December.',
      },
      {
        q: 'What happens during Formation Groups? How are they run?',
        a: "Formation Groups are kept intentionally small — no more than 12–15 people — so there's room for everyone to be known and to participate. Most groups meet weekly at a consistent day, time, and location. In the Fall, leaders have the freedom to shape their group's focus: either discussing and reflecting together on that week's sermon, or working through an approved book. In the Spring, all groups return to a shared focus of discussing and reflecting on that week's sermon together.",
      },
      {
        q: 'How do I join Formation Groups?',
        a: "Start by downloading the Church Center app and creating an account. Once you're set up, search for and join Mosaic within the app. From there, tap on Groups in the bottom toolbar, browse until you find a group that interests you, and tap Register to join. You do not need to be a member in order to join a Formation Group.",
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
    ],
  },
  {
    id: 'visiting-and-membership',
    title: 'Visiting and Membership',
    items: [
      {
        q: 'What can I expect when I visit for the first time?',
        a: "When you first arrive at Mosaic you'll encounter our friendly welcoming team wearing white vests. Please let them know it's your first time attending, and they will talk with you to get to know you better! Then you can enter the sanctuary to worship, listen to and reflect on the Word, pray, and worship again! We invite you to stay after service to talk with our pastors, Welcoming Team, and new people you meet.",
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
    id: 'unique-groups',
    title: 'Unique Groups',
    items: [
      {
        q: 'What are Unique Groups?',
        a: 'While Formation Groups are the primary place we grow together as a church, Unique Groups exist alongside them to bring people together around a shared stage of life. These groups create space for the kind of understanding and support that comes from walking alongside people who are facing similar seasons, questions, and challenges, and they help make a large church feel like a close community.',
      },
      {
        q: 'What Unique Groups does Mosaic have?',
        a: (
          <div className="flex flex-col gap-4">
            <p>
              One of our Unique Groups is Family Connections, a ministry for families with children in
              1st grade through high school. Family Connections exists to reach and bring these Mosaic
              families together, and to give them a forum to get to know and embrace one another
              through quarterly family events.
            </p>
            <p>
              Another of our Unique Groups is SODA — Sons &amp; Daughters. It is the college fellowship
              we provide at our church. We believe that college is a crucial time to deepen one&apos;s
              faith and therefore make it a priority to provide a community for our students where they
              can learn more about the Gospel and how to live it out in their daily lives.
            </p>
            <p>
              Another of our Unique Groups is Young Adults (YA), for those ages 18–35. Our vision is to
              be a community of young adult disciples who are present and inspired, compelled by Gospel
              living and thinking. As young adults of Mosaic we aim to lead Formation Groups, serve,
              and gather together in large group experiences.
            </p>
            <p>
              Another of our Unique Groups is Coram Deo, for those 50 and older. Coram Deo is a Latin
              phrase meaning &ldquo;before the face of God&rdquo; — a reminder that this season of life
              is lived fully in His presence. This group brings together people of the same stage of
              life, giving them a place to pour into the church and its members with the wisdom and
              time that this season affords.
            </p>
          </div>
        ),
      },
      {
        q: 'What events do Unique Groups host? How often are they?',
        a: (
          <div className="flex flex-col gap-4">
            <p>
              Family Connections organizes events once per quarter. Some previous events have included
              bowling and apple picking!
            </p>
            <p>
              SODA College Ministry meets weekly during Summer when school is not in session. During
              Summer they generally have two events per month in addition to their weekly gatherings.
              There are also virtual Formation Groups specifically for SODA members that are away at
              school. Some fellowship-focused events have included barbeques, pool parties, beach days,
              and Winter gatherings. SODA also organizes a yearly retreat, generally in July.
            </p>
            <p>
              Young Adults (YA) generally organize monthly large group events. Some previous
              fellowship-focused events have included Bring Your Own Board Game Night, Serendipitous
              Dinners, and Whitewater Rafting. Some previous discipleship-focused events have included
              Are You Praying? Seminar, and a Biblical Literacy Seminar. Young Adults also organize a
              retreat each year, generally in February.
            </p>
            <p>
              Coram Deo generally organizes large group events quarterly. Some previous events have
              included Fellowship Dinners, hiking, apple picking, and Christmas white elephant holiday
              events.
            </p>
          </div>
        ),
      },
      {
        q: 'Can I visit a group before joining?',
        a: 'Yes, and we recommend it. Most groups are glad to have someone drop in for a night before deciding.',
      },
      {
        q: 'What if I cannot attend every event?',
        a: "Life happens, and we understand that you won't always be able to make it — so attend when you can. We do encourage attending events when possible, since there's real value in the fellowship and growth that happen when we gather together. But those same things — fellowship, growth, being known — aren't limited to official events; they happen just as much in the everyday moments and relationships that grow out of being part of the group.",
      },
    ],
  },
  {
    id: 'care-and-counseling',
    title: 'Care & Counseling',
    items: [
      {
        q: 'How can I request prayer?',
        a: "Our Tefillah Intercessory Prayer Ministry — named after the Hebrew word for prayer — is dedicated to interceding on behalf of the Mosaic family. While you're at church, you can scan the QR code on the back of any chair to reach the Tefillah prayer request form, and the same form is available anytime through the Church Center app. If you'd like to take part in this ministry yourself, Tefillah meets Sunday mornings at 8am in Cry Room #2.",
      },
      {
        q: 'How do I get connected to family or marriage counseling?',
        a: (
          <p>
            We recognize how important family and relationships are, and we want to walk alongside you
            through the seasons that are difficult as well as the ones that are good. If you&apos;re
            looking for support in your marriage or family life, our Family and Marriage Pastor, Sam
            An, would love to get to know you and help you — you can reach him directly at{' '}
            <a
              href="mailto:samuel.an@njmosaic.org"
              className="text-[#0052CC] underline underline-offset-2 hover:no-underline"
            >
              samuel.an@njmosaic.org
            </a>
            .
          </p>
        ),
      },
      {
        q: 'Is everything confidential?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'Placeholder question three',
        a: 'Placeholder answer — content to come.',
      },
    ],
  },
  {
    id: 'baptism',
    title: 'Baptism',
    items: [
      {
        q: 'What does baptism mean?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'Who can be baptized?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'How often do baptisms happen?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'What happens during a baptism?',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'What about baptizing children?',
        a: 'Placeholder answer — content to come.',
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
        q: 'Placeholder question one',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'Placeholder question two',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'Placeholder question three',
        a: 'Placeholder answer — content to come.',
      },
      {
        q: 'Placeholder question four',
        a: 'Placeholder answer — content to come.',
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
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
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
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          <GuideTableOfContents
            items={GUIDE_SECTIONS.map(({ id, title }) => ({ id, title }))}
          />
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {GUIDE_SECTIONS.map(({ id, title, items }) => (
              <div
                key={id}
                id={id}
                className="scroll-mt-28 bg-[#E8EFFD] rounded-3xl px-6 md:px-12 py-10 md:py-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-[#1E2024] mb-4">{title}</h2>
                <FaqAccordion items={items} variant="arrow" idPrefix={id} />
              </div>
            ))}
          </div>
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
