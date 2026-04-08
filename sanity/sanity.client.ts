import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './env'

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!client) {
    console.warn('Sanity client not configured — NEXT_PUBLIC_SANITY_PROJECT_ID is missing')
    return [] as unknown as T
  }
  return client.fetch<T>(query, params ?? {}, { next: { revalidate: 60 } })
}
