const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const projectId = /^[a-z0-9-]+$/.test(rawProjectId) ? rawProjectId : ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'
