import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from '../sanity.client'

const builder = client ? imageUrlBuilder(client) : null

/** Returns an image-url builder for chaining (.width().auto('format').url()), or null if Sanity isn't configured. */
export function urlFor(source: SanityImageSource) {
  return builder ? builder.image(source) : null
}
