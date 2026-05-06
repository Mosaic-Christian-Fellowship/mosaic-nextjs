import type { PlaylistConfig } from './sermons'

export const YOUTUBE_CHANNEL_ID = 'UCgI1-OGVDlM5cXy0xhllT_w'

// kind:
//   'master'   — canonical full-archive playlist (Sunday Service); always one
//   'series'   — sermon series; videos surface in the archive AND group under the series
//   'excluded' — clips/highlights/testimonies; videos in these are dropped from the archive entirely
export const PLAYLISTS: PlaylistConfig[] = [
  { id: 'PLcVnilxMSYGI-LVxJbeCCRNg2VPxOgq7L', name: 'Sunday Service', kind: 'master' },
  { id: 'PLcVnilxMSYGLTHy8xjdb3CaIB0axomgxd', name: 'God of Promise Series', kind: 'series' },
  { id: 'PLcVnilxMSYGIBRluW_HNkB3oVLzn2rVqa', name: 'Highlights', kind: 'excluded' },
  { id: 'PLcVnilxMSYGLZdeUjrCE8ZPDlLZu6zOEC', name: 'Sermon Clips', kind: 'excluded' },
  { id: 'PLcVnilxMSYGI3tJD8kfKVO8JdTDuw416N', name: 'Healing, Anchoring, Thriving Series', kind: 'series' },
  { id: 'PLcVnilxMSYGJvNAPRGXzi32iLlTjfa7M8', name: 'Ministry Magnified', kind: 'series' },
  { id: 'PLcVnilxMSYGLxElwnvRqRXmlAyH4jHi42', name: 'See You Sunday', kind: 'series' },
  { id: 'PLcVnilxMSYGIJ9kSij-mS2W-eMB-ShIyc', name: 'Coffee Met Bagel', kind: 'series' },
  { id: 'PLcVnilxMSYGKQFAS8xgW0HhCZ8CVwWULL', name: 'Devotional Series', kind: 'series' },
  { id: 'PLcVnilxMSYGJDSH5-Des6MbXJToUeEuwO', name: 'Hebrews Sermon Series', kind: 'series' },
  { id: 'PLcVnilxMSYGK7QtZXH3YQgDakfolV9U32', name: 'Serving Series', kind: 'series' },
  { id: 'PLcVnilxMSYGJpDlASMai5P-VyRSOmmXXw', name: 'Consecrate Week', kind: 'series' },
  { id: 'PLcVnilxMSYGJbMQwmKoeiT4g8SCJI8_Md', name: 'Jeremiah: Return to the Promise', kind: 'series' },
  { id: 'PLcVnilxMSYGJ1peaxVCbERsviSnNHrqZU', name: 'Community Series', kind: 'series' },
  { id: 'PLcVnilxMSYGINcBu-kvqP7vsZr36fbcIY', name: 'Mosaic Community', kind: 'series' },
  { id: 'PLcVnilxMSYGJ9aPoAOxqP6VE1RtAPQnOw', name: 'Testimonies', kind: 'excluded' },
]
