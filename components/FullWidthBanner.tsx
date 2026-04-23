import Image from 'next/image'
import Link from 'next/link'

export default function FullWidthBanner() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <Image
        src="/framer/banner/banner.jpg"
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <h2 className="text-[28px] md:text-[40px] font-semibold text-white leading-[1.2]">
          We reach the lost for Christ, embrace them in the Gospel,
          and disciple them to Christ.
        </h2>
        <Link
          href="/about"
          className="inline-flex items-center h-[50px] px-8 bg-[#0066FF] text-white text-[15px] font-semibold rounded-full border border-[rgba(19,21,23,0.1)] hover:brightness-110 transition-[filter]"
          style={{ boxShadow: 'inset 0px 2px 1px 0px rgba(255, 255, 255, 0.2)' }}
        >
          Get to know us
        </Link>
      </div>
    </section>
  )
}
