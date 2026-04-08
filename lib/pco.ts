const PCO_BASE = 'https://api.planningcenteronline.com'

export interface PcoRecord {
  id: string
  type: string
  attributes: Record<string, unknown>
  relationships?: Record<string, { data: { type: string; id: string } | { type: string; id: string }[] }>
  links?: Record<string, string>
}

export interface PcoResponse {
  data: PcoRecord[] | PcoRecord
  included?: PcoRecord[]
  links?: { next?: string }
  meta?: { total_count?: number }
}

export function buildPcoAuthHeader(): string {
  const appId = process.env.PCO_APP_ID
  const secret = process.env.PCO_SECRET
  if (!appId || !secret) throw new Error('PCO_APP_ID and PCO_SECRET must be set')
  return 'Basic ' + Buffer.from(`${appId}:${secret}`).toString('base64')
}

export async function pcoFetch(
  path: string,
  params?: Record<string, string>
): Promise<PcoResponse> {
  const url = new URL(path, PCO_BASE)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: buildPcoAuthHeader(),
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`PCO API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<PcoResponse>
}

export async function pcoFetchAll(
  path: string,
  params?: Record<string, string>
): Promise<PcoRecord[]> {
  const allRecords: PcoRecord[] = []
  let nextUrl: string | undefined

  // First request
  const firstResult = await pcoFetch(path, { per_page: '100', ...params })
  const firstData = Array.isArray(firstResult.data) ? firstResult.data : [firstResult.data]
  allRecords.push(...firstData)
  nextUrl = firstResult.links?.next

  // Paginate
  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: {
        Authorization: buildPcoAuthHeader(),
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error(`PCO API error: ${res.status} ${res.statusText}`)
    const json = (await res.json()) as PcoResponse
    const data = Array.isArray(json.data) ? json.data : [json.data]
    allRecords.push(...data)
    nextUrl = json.links?.next
  }

  return allRecords
}

export async function pcoPost(
  path: string,
  body: Record<string, unknown>
): Promise<PcoResponse> {
  const url = new URL(path, PCO_BASE)

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: buildPcoAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let detail = ''
    try {
      const errorBody = await res.text()
      detail = ` — ${errorBody}`
    } catch {}
    throw new Error(`PCO API error: ${res.status} ${res.statusText}${detail}`)
  }

  return res.json() as Promise<PcoResponse>
}
