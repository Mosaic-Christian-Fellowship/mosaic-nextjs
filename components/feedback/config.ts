// Every Mosaic-specific value for the preview feedback widget lives here, so
// moving the widget into a shared package later means moving this folder plus
// app/api/feedback.

export const FEEDBACK_CONFIG = {
  owner: 'Mosaic-Christian-Fellowship',
  repo: 'mosaic-feedback',
  branch: 'main',
  label: 'feedback',
  screenshotDir: 'screenshots',
  /** POSTs allowed per IP per window. */
  rateLimit: { max: 10, windowSeconds: 600 },
  /** How long the open-issue list for pins is cached. */
  listCacheSeconds: 60,
} as const

/** Marks every element the widget renders. Screenshots and the picker skip anything inside it. */
export const WIDGET_ATTR = 'data-feedback-widget'

/**
 * The widget and its API exist on preview deploys only. `FEEDBACK_DEV=1`
 * turns them on for local development.
 */
export function feedbackEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_ENV === 'preview' || env.FEEDBACK_DEV === '1'
}
