import Image from 'next/image'
import Link from 'next/link'

const cards = [
  { image: '/framer/stage-of-life/SxhzxV8ao1HtFEGdS1v6nT8KFw.jpg', title: 'Community Groups', href: '/connect' },
  { image: '/framer/stage-of-life/ULigcCSyd0TmrohdwqwgMb67Nrw.jpg', title: 'Education Department', href: '#' },
  { image: '/framer/stage-of-life/YRLYlc5g2NeUUHNg9EKHwwsLeKw.jpg', title: 'Ministries Directory', href: '/connect' },
  { image: '/framer/stage-of-life/Cpk7jBgsOKx9HczmVdH3AOE9pjg.jpg', title: 'Mosaic Team', href: '/about' },
  { image: '/framer/stage-of-life/zSVrJnDUK64kiEjToVnYgtBCOxc.jpg', title: 'Community Gallery', href: '#' },
  { image: '/framer/stage-of-life/MUKMullc3RpovcMHfY2iLUrJ3s.jpg', title: 'Testimonies', href: '#' },
  { image: '/framer/stage-of-life/psZwfs8AeLrbTtHECDGwhd6rx0.jpg', title: 'Resources', href: '#' },
  { image: '/framer/stage-of-life/gSKDv0TsW9e19h9d9UB7CClHZg.jpg', title: 'Discipleship Training', href: '#' },
  { image: '/framer/stage-of-life/VlWjAVp8XQYKAZvnXG20aiBTcY.jpg', title: 'Sermons', href: '/messages' },
  { image: '/framer/stage-of-life/uEaQ32le3R0KwRr7fryPQzxkPVQ.jpg', title: 'Community Group', href: '/connect' },
]

function Card({ card }: { card: (typeof cards)[number] }) {
  return (
    <Link
      href={card.href}
      className="group relative flex flex-col gap-4 w-[260px] md:w-[300px] shrink-0"
    >
      <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#F5F5F7]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-2 px-1">
        <span className="inline-flex self-start text-xs font-medium text-[#1E2024] bg-[#F5F5F7] px-3 py-1 rounded-full">
          Tag
        </span>
        <h3 className="text-[20px] md:text-[22px] font-semibold text-[#1E2024] leading-[1.3] group-hover:text-[#0066FF] transition-colors">
          {card.title}
        </h3>
        <p className="text-[14px] text-[#7F838A] leading-[1.6]">
          Add a short description to explain this card.
        </p>
      </div>
    </Link>
  )
}

export default function StageOfLife() {
  return (
    <section className="py-20 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex items-end justify-between gap-4 mb-10">
        <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1E2024] leading-[1.2]">
          Meet Our Community
        </h2>
        <Link
          href="/connect"
          className="text-[#0066FF] font-medium text-[15px] hover:opacity-70 transition-opacity shrink-0"
        >
          Explore →
        </Link>
      </div>

      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee w-max">
          {[...cards, ...cards].map((card, i) => (
            <Card key={`${card.title}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
