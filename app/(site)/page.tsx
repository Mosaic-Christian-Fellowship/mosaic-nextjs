import Hero from '@/components/Hero'
import PlanVisitSection from '@/components/PlanVisitSection'
import CommunityEvents from '@/components/CommunityEvents'
import FullWidthBanner from '@/components/FullWidthBanner'
import StageOfLife from '@/components/StageOfLife'
import FeaturedSermonSection from '@/components/FeaturedSermonSection'
import ExtendedCut from '@/components/ExtendedCut'
import MeetYou from '@/components/MeetYou'

export default function Home() {
  return (
    <>
      <Hero />
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
