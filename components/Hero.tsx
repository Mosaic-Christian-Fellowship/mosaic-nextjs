import Link from 'next/link'

export default function Hero() {
  return (
    <section
      data-hero
      className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '70% 40%' }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-2xl flex flex-col gap-6">
          <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.1] text-white">
            Welcome to Mosaic!
            <br />
            Join us in-person or online.
          </h1>
          <p className="text-[15px] md:text-base font-normal leading-[1.6] text-white/85 max-w-xl">
            Visit Mosaic Christian Fellowship for service, every Sunday at 9:30am and 11:30am.
            Join our livestream and view past recordings on{' '}
            <a
              href="https://www.youtube.com/channel/UCgI1-OGVDlM5cXy0xhllT_w"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
            >
              YouTube
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/im-new"
              className="inline-flex items-center h-[50px] px-8 bg-[#0066FF] text-white text-[15px] font-semibold rounded-[10px] hover:brightness-110 transition-[filter]"
            >
              Plan your visit
            </Link>
            <Link
              href="/messages"
              className="inline-flex items-center h-[50px] px-8 bg-white/10 backdrop-blur-sm text-white text-[15px] font-semibold rounded-[10px] border border-white/20 hover:bg-white/20 transition-colors"
            >
              Watch past sermons
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
