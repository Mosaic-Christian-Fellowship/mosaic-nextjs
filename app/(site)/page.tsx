import Hero from '@/components/Hero'
import PlanVisitSection from '@/components/PlanVisitSection'
import CommunityEvents from '@/components/CommunityEvents'
import FullWidthBanner from '@/components/FullWidthBanner'
import StageOfLife from '@/components/StageOfLife'
import FeaturedSermonSection from '@/components/FeaturedSermonSection'
import ExtendedCut from '@/components/ExtendedCut'
import MeetYou from '@/components/MeetYou'
import { sanityFetch } from '@/sanity/sanity.client'
import { homePageHeroQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { resolveHero, type HeroData } from '@/lib/hero'

export const revalidate = 600

export default async function Home() {
  const hero = await sanityFetch<HeroData | null>(homePageHeroQuery)
  const r = resolveHero(hero)
  const imageUrl = r.heroImage
    ? urlFor(r.heroImage)?.width(1920).height(1080).auto('format').url() ?? null
    : null

  return (
    <>
      <Hero
        heading={r.heading}
        subtext={r.subtext}
        cta1={r.cta1}
        cta2={r.cta2}
        videoUrl={r.videoUrl}
        imageUrl={imageUrl}
      />
      <PlanVisitSection />
      <CommunityEvents />
      <FullWidthBanner />
      <StageOfLife />
      <FeaturedSermonSection />
      <ExtendedCut />
      <MeetYou />
    </>
  )
}
