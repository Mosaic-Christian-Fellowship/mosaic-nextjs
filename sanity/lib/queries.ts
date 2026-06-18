import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`
export const staffMembersQuery = groq`*[_type == "staffMember"] | order(order asc)`
export const faqItemsQuery = groq`*[_type == "faqItem"] | order(order asc)`
export const ministriesQuery = groq`*[_type == "ministry"] | order(order asc)`
export const serviceTimesQuery = groq`*[_type == "serviceTime"] | order(order asc)`
export const landingPageQuery = groq`*[_type == "landingPage" && slug.current == $slug][0]`
export const allLandingPagesQuery = groq`*[_type == "landingPage"]{ slug }`

export const homePageHeroQuery = groq`*[_type == "homePage"][0]{
  heroHeading,
  heroSubtext,
  heroCta1Text,
  heroCta1Href,
  heroCta2Text,
  heroCta2Href,
  heroImage,
  "heroVideoUrl": heroVideo.asset->url
}`
