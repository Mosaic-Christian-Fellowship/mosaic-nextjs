import { WIDGET_ATTR } from './config'

const MAX_WIDTH = 1600
const QUALITY = 0.7
// modern-screenshot waits up to 30s by default for each image, and lazy images
// below the fold never load, so a long page stalled for 30s. Cap each wait,
// and cap the whole capture so a slow page still sends the comment.
const ASSET_TIMEOUT_MS = 3000
const TOTAL_TIMEOUT_MS = 10000

export interface HighlightBox {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Captures what the reviewer can see right now (the visible viewport, not the
 * whole page) as a JPEG data URL, with the selected element outlined. The
 * widget itself is left out. Returns null if capture fails or takes too long,
 * so the comment can still be sent.
 *
 * Known gap: fixed and sticky elements (the site nav) render at the top of the
 * document rather than where they sit on screen, so a scrolled capture omits
 * them. The outline is drawn on the canvas afterwards for the same reason.
 */
export async function captureViewport(highlight: HighlightBox | null = null): Promise<string | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const { domToCanvas } = await import('modern-screenshot')
    const width = window.innerWidth
    const height = window.innerHeight
    const scale = Math.min(window.devicePixelRatio || 1, MAX_WIDTH / width)

    const capture = domToCanvas(document.documentElement, {
      width,
      height,
      scale,
      timeout: ASSET_TIMEOUT_MS,
      backgroundColor: '#FFFFFF',
      style: {
        transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)`,
        transformOrigin: 'top left',
      },
      filter: (node) => !(node instanceof Element && node.hasAttribute(WIDGET_ATTR)),
    })
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Screenshot timed out')), TOTAL_TIMEOUT_MS)
    })
    const canvas = await Promise.race([capture, timeout])
    if (highlight) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // The canvas may be capped below the requested scale; measure the real ratio.
        const ratio = canvas.width / width
        ctx.strokeStyle = '#E5484D'
        ctx.lineWidth = 3 * ratio
        const pad = 4 * ratio
        ctx.strokeRect(
          highlight.left * ratio - pad,
          highlight.top * ratio - pad,
          highlight.width * ratio + pad * 2,
          highlight.height * ratio + pad * 2,
        )
      }
    }
    return canvas.toDataURL('image/jpeg', QUALITY)
  } catch (err) {
    console.warn('Feedback screenshot failed; sending without one.', err)
    return null
  } finally {
    clearTimeout(timer)
  }
}
