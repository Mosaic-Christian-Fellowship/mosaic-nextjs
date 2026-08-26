import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import VideoGrid from '@/components/VideoGrid'
import type { SermonData } from '@/lib/api'

const video = (over: Partial<SermonData> = {}): SermonData => ({
  id: 'v1',
  title: 'My Story',
  speaker: 'Pastor Dave Park',
  seriesId: null,
  seriesName: null,
  date: '2026-05-01',
  duration: 240,
  thumbnail: 'thumb.jpg',
  youtubeId: 'abc123',
  spotifyUrl: null,
  applePodcastUrl: null,
  description: '',
  ...over,
})

describe('VideoGrid', () => {
  it('links each card to YouTube', () => {
    const html = renderToStaticMarkup(<VideoGrid videos={[video()]} emptyMessage="None yet." />)

    expect(html).toContain('https://www.youtube.com/watch?v=abc123')
    expect(html).toContain('My Story')
  })

  it('omits the speaker when it is unattributed', () => {
    // 'Undefined' is the stored sentinel and is truthy, so a plain truthy check
    // would print it to visitors.
    const html = renderToStaticMarkup(
      <VideoGrid videos={[video({ speaker: 'Undefined' })]} emptyMessage="None yet." />
    )

    expect(html).not.toContain('Undefined')
  })

  it('shows the empty message when there are no videos', () => {
    const html = renderToStaticMarkup(<VideoGrid videos={[]} emptyMessage="No testimonies yet." />)

    expect(html).toContain('No testimonies yet.')
  })

  it('lets a caller override the link target', () => {
    // The podcasts page lists the same records but sends visitors to Spotify.
    // Without this the grid would have to be forked into a second card component.
    const html = renderToStaticMarkup(
      <VideoGrid
        videos={[video({ spotifyUrl: 'https://open.spotify.com/episode/xyz' })]}
        emptyMessage="None yet."
        linkFor={(v) => v.spotifyUrl!}
      />
    )

    expect(html).toContain('https://open.spotify.com/episode/xyz')
    expect(html).not.toContain('youtube.com/watch')
  })

  it('still defaults to YouTube when no override is given', () => {
    const html = renderToStaticMarkup(<VideoGrid videos={[video()]} emptyMessage="None yet." />)

    expect(html).toContain('https://www.youtube.com/watch?v=abc123')
  })
})
