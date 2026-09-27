import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Our Staff',
  description:
    'Meet the people who lead, serve, and care for the Mosaic Christian Fellowship community every day.',
}

type StaffMember = { name: string; title: string; photo: string; bio: string[] }

// Bios from mosaicnj.org/staff-leadership, as staff asked in the content review
// doc. Obvious typos from the old site are fixed; wording is otherwise unchanged.
const staff: StaffMember[] = [
  {
    name: 'Dave Park',
    title: 'Senior Pastor',
    photo: '/staff/dave-park.jpg',
    bio: [
      'Dave grew up outside of Philadelphia and first heard the Lord call him into ministry on a short-term trip to China. He expected to return as an overseas missionary, but the Lord slowly redirected him toward the beauty of pastoring a local church. He earned his Masters from Westminster Theological Seminary and his Doctorate from Missio Seminary, and along the way, one conviction has only deepened: the people of God are called to missionally make disciples. The Lord called Dave to Mosaic in 2013 and his longing for Mosaic is that it would be a church that reaches, embraces, and disciples men and women to Christ. Dave loves good books, long conversations that go somewhere, pickup basketball at the local Y, and an unreasonable number of Wawa sandwiches. He is married to Jimena, and together they are raising two daughters, Mia and Sophia, who make him laugh every single day.',
    ],
  },
  {
    name: 'Andre Choi',
    title: 'Discipleship Pastor',
    photo: '/staff/andre-choi.jpg',
    bio: [
      "Andre serves as the Discipleship Pastor at Mosaic overseeing the church's discipleship pathways. He earned his M.Div. from Reformed Theological Seminary where he discovered his love for Reformed doctrine and communicating the Bible's teachings with clarity and precision.",
      'His favorite quote is "We are all instruments in the Redeemer\'s hands" by Paul David Tripp and he desires to grow in this conviction while helping others see this is also true of them.',
      "When he's not working Andre enjoys working out, playing golf, and traveling all with his best friend and wife Nita.",
    ],
  },
  {
    name: 'Patrick Chi',
    title: 'College Pastor',
    photo: '/staff/patrick-chi.jpg',
    bio: [
      'Hi, my name is Patrick and I am married to my favorite person, Sungeun and we are dog parents of a mini-Goldendoodle named Louie. I was born and raised in Los Angeles and moved to the East Coast in 2018. While I was living in LA, I got saved and became a Christian while attending culinary school. After I graduated, I was working in the culinary industry while attending Bible College.',
      'A few of my hobbies include food, basketball, and having fun with people!',
    ],
  },
  {
    name: 'Samuel An',
    title: 'Family Pastor',
    photo: '/staff/samuel-an.jpg',
    bio: [
      'Sam grew up in Bergen County in a household that was deeply committed to church but had internal rules that were very Confucian. He is intentional about examining whether his assumptions about being a child, a spouse, and a parent are Confucian, Western, or Christian. He has many friends who are drawn to Jesus but have been disappointed by the church, and is excited to be a conversation partner that helps others discover the truths of scripture that nourish and guide us into a winsome and flourishing faith. He is currently working on his DMin in spiritual formation from Talbot Seminary and finds the classwork helps him be a better husband to Grace and father to Abigail.',
    ],
  },
  {
    name: 'William Gill',
    title: 'Executive Director',
    photo: '/staff/william-gill.jpg',
    bio: [
      'William serves as the Executive Director at Mosaic Church, providing strategic and operational leadership to help the church fulfill its mission and vision. He partners closely with the pastors and ministry leaders to align ministries, steward resources, and strengthen organizational health so the church can thrive in its mission.',
      'Before stepping into this role, William spent more than 30 years as a global technology leader in the pharmaceutical industry, leading digital transformation and organizational effectiveness initiatives across multiple regions. He brings a passion for developing teams, advancing organizational excellence, and building systems that enable lasting ministry impact.',
      "William loves serving the church and is passionate about discipleship, helping others grow in their faith and live out God's call in everyday life. He is married to Sonia, and together they have three adult children. He enjoys traveling, photography, and soccer.",
    ],
  },
  {
    name: 'Christy Kim',
    title: 'Worship & Missions Director',
    photo: '/staff/christy-kim.jpg',
    bio: [
      'Christy was born and raised in Bergen County, New Jersey. She has been blessed with over 17 years of worship leading experience, and she is grateful to work closely with the gifted musicians and worshipers within Mosaic. With over 10 years of vocational experience in education and a heart for unreached people groups, she is excited to also step into the missions director role to mobilize the church to reach those locally and abroad. In her free time, Christy can be found eating joyfully, laughing heartily, trolling close ones, or enjoying solitude with her more precious Friend, Jesus!',
    ],
  },
  {
    name: 'Harvey Choi',
    title: 'Creative & Technical Director',
    photo: '/staff/harvey-choi.jpg',
    bio: [
      "Harvey was a video editor for a marketing agency, but now, he is fulfilling his calling to use social media as a tool to help people know Jesus more and seek God. He always had the heart to serve people, but he was previously chasing acclamation and self-glory. Once he realized that his flesh is dead and renewed to the Spirit, he now lives to glorify Jesus Christ. He will continue to build God's kingdom reaching out to those who are lost and embracing them as they are using technology and media.",
      'Outside of work, he is a semi-pro bowler and plays pickleball. When the weather gets warmer, he loves playing golf.',
    ],
  },
  {
    name: 'Daniel Godsave',
    title: 'Church Planter',
    photo: '/staff/daniel-godsave.jpg',
    bio: [
      'Since high school, Daniel has felt a deep calling from God to serve and grow the church, a journey that led him through years of dedicated study at Moody Bible Institute and Missio Seminary. His heart for ministry is fueled by a genuine desire to see the church flourish and the gospel spread. After nearly a decade of pastoral work in Delaware, he took a leap of faith in 2024, moving his life to New Jersey to pursue a lifelong dream of church planting. He is currently pouring his energy into specialized training with City to City and Mosaic leadership as he prepares to plant a new church in Fort Lee in 2027. Outside ministry, Daniel enjoys running, hiking, and trying new food.',
    ],
  },
  {
    name: 'Eden Hong',
    title: 'Church Administrator',
    photo: '/staff/eden-hong.jpg',
    bio: [
      "Eden was born in Korea and raised in Michigan. She currently works full-time at Harman International as a Quality Project Leader. She earned her master's degree from Talbot School of Theology, driven by a desire to know God more deeply and to serve His people faithfully. Eden is especially passionate about investing in the next generation and finds joy in witnessing young people grow in their faith and fall in love with God.",
      "Outside of work and ministry, Eden enjoys life's simple joys—playing with her small but mighty dog, Gomi, planning her next travel adventure, or unwinding with video games.",
    ],
  },
  {
    name: 'IJ Hur',
    title: 'Intern',
    photo: '/staff/ij-hur.jpg',
    bio: [
      "IJ grew up as a PK (Pastor's Kid) in Fort Lee, NJ and earned his Master's degree from Gordon-Conwell Theological Seminary. Over the past decade, he has served in Youth and College Ministry within multiethnic churches. More recently, IJ sensed a renewed call to the Asian American church and entered a two-year season of rest and healing. Shaped by a 15 year journey of reconciliation with his father through Jesus, IJ is passionate about serving Asian American churches navigate intergenerational shame, building bridges, and encounter Jesus together.",
      'IJ is married to his wife, Ruth, and they love traveling and working out together. Outside of ministry, he enjoys fitness (though terrible at sports), fermenting foods like kombucha, and all things Korean skincare.',
    ],
  },
  {
    name: 'Young Lee',
    title: 'Sound Engineer',
    photo: '/staff/young-lee.jpg',
    bio: [
      'Young grew up in the NY/NJ area all his life and decided to pursue a career in music and received his Bachelor of Arts from Berklee College of Music in Boston. Later in his 20s he was called into ministry and received his Master of Divinity from Alliance Theological Seminary in NY. Young is a worship pastor/leader and has been leading worship for 10 plus years. Young has a heart to worship God with a pure heart and help raise up a new generation that seeks to do the same. Young loves to exercise on his free time and also to make worship videos on YouTube.',
    ],
  },
]

export default function Staff() {
  return (
    <div>
      <PageHero
        overline="Our Team"
        title="Meet Our Staff"
        subtitle="The people who lead, serve, and care for the Mosaic community every day."
        align="center"
        media={
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
            <Image
              src="/staff/team.jpg"
              alt="The Mosaic staff team together"
              fill
              priority
              sizes="(min-width: 1200px) 1152px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        }
      />

      {/* Staff Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {staff.map((person) => (
            <div key={person.name} className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F5F5F7]">
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1E2024] [text-wrap:balance]">{person.name}</h3>
                <p className="text-sm font-semibold text-[#0066FF]">{person.title}</p>
                {person.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[#6B7280] text-sm mt-2 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        overline="Questions?"
        heading="We'd love to hear from you."
        subtext="Reach out anytime — our team is here to help you find your place at Mosaic."
        cta="Contact Us"
        href="/connect"
      />
    </div>
  )
}
