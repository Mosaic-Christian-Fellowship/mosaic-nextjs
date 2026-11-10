import { WIDGET_ATTR } from './config'

const MAX_WIDTH = 1600
const QUALITY = 0.7

/**
 * Captures what the reviewer can see right now (the visible viewport, not the
 * whole page) as a JPEG data URL. The widget itself is left out. Returns null
 * if capture fails for any reason, so the comment can still be sent.
 */
export async function captureViewport(): Promise<string | null> {
  try {
    const { domToJpeg } = await import('modern-screenshot')
    const width = window.innerWidth
    const height = window.innerHeight
    const scale = Math.min(window.devicePixelRatio || 1, MAX_WIDTH / width)

    return await domToJpeg(document.documentElement, {
      width,
      height,
      scale,
      quality: QUALITY,
      backgroundColor: '#FFFFFF',
      style: {
        transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)`,
        transformOrigin: 'top left',
      },
      filter: (node) => !(node instanceof Element && node.hasAttribute(WIDGET_ATTR)),
    })
  } catch (err) {
    console.warn('Feedback screenshot failed; sending without one.', err)
    return null
  }
}
