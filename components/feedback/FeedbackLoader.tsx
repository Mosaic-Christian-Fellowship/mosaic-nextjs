'use client'

import dynamic from 'next/dynamic'

// The layout renders this only on preview deploys. Importing the widget
// lazily keeps its code (and modern-screenshot) in a separate chunk that the
// browser fetches only when this component renders, so production pages never
// download it. A static import would bundle it into the layout's shared chunk.
const FeedbackWidget = dynamic(() => import('./FeedbackWidget'), { ssr: false })

export default function FeedbackLoader() {
  return <FeedbackWidget />
}
