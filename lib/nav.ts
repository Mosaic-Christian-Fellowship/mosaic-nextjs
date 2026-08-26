/**
 * The site's navigation structure.
 *
 * This lives apart from `components/Nav.tsx` on purpose. What appears in the
 * menu, what it's called, and where it points are site-structure decisions the
 * maintainer owns; how the menu *looks* is design work anyone on that lane can
 * change freely. Splitting the two means the scope check can guard the
 * structure without getting in the way of restyling.
 *
 * Adding an entry here is how a draft page becomes published — see
 * `lib/pageMeta.ts`.
 */

export type SubItem = { label: string; href: string }
export type NavItem = { label: string; href?: string; items?: SubItem[] }

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Church',
    items: [
      { label: 'Our Beliefs', href: '/about' },
      { label: 'Our Team', href: '/about' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Events', href: '/events' },
      { label: 'Community Groups', href: '/connect' },
      { label: 'Internships & Counseling', href: '#' },
      { label: 'Discipleship Training', href: '#' },
      { label: 'Gallery', href: '#' },
    ],
  },
  {
    label: 'Ministries',
    items: [
      { label: 'Our Ministries', href: '/connect' },
      { label: 'Education Department', href: '#' },
      { label: 'Missions', href: '#' },
    ],
  },
  {
    label: 'Messages',
    items: [
      { label: 'Sermons', href: '/messages/sermons' },
      { label: 'Testimonies', href: '/messages/testimonies' },
      { label: 'Podcasts', href: '/messages/podcasts' },
      { label: 'Resources', href: '#' },
    ],
  },
  { label: 'Give', href: '/give' },
]
