# Spotify Podcast Enrichment — Design Spec

## Goal

Enrich existing sermon records with Spotify podcast URLs by matching YouTube sermon videos to Spotify podcast episodes by publish date. The Spotify show (ID: `7AZydPQgOQOqdvpiXLGyRR`, ~274 episodes) maps to the same sermons already synced from YouTube.

## Architecture

### New file: `lib/spotify.ts`

Spotify API client using Client Credentials flow (no user login needed).

**Auth:** POST `https://accounts.spotify.com/api/token` with `grant_type=client_credentials`, Basic auth header (base64 of `clientId:clientSecret`). Returns a bearer token valid for 1 hour.

**Fetch episodes:** GET `https://api.spotify.com/v1/shows/{showId}/episodes` with pagination (max 50/page, ~6 pages for 274 episodes). Fields limited to `items(id,name,release_date,external_urls,duration_ms),next` to reduce payload.

**Exports:**
```typescript
interface SpotifyEpisode {
  id: string
  name: string
  releaseDate: string        // YYYY-MM-DD
  spotifyUrl: string         // https://open.spotify.com/episode/{id}
  durationMs: number
}

function fetchSpotifyEpisodes(): Promise<SpotifyEpisode[]>
```

Env vars: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`. If either is missing, `fetchSpotifyEpisodes` returns `[]` (graceful skip).

### Modified: `lib/sync/sermons.ts`

New exported function:

```typescript
function enrichWithSpotify(sermons: SermonData[]): Promise<SermonData[]>
```

Called after `syncSermons()` builds the sermon array. For each Spotify episode, finds a sermon whose `date` field matches `releaseDate` (exact match first, then +/-1 day). On match, sets `sermon.spotifyUrl`.

**Matching rules:**
1. Exact date match (same YYYY-MM-DD) — use it
2. If multiple sermons share the same date, pick the one whose title has the highest word overlap with the episode name
3. If no exact match, try +/-1 day with the same title tiebreaker
4. Unmatched episodes are silently skipped (no error)
5. Each sermon gets at most one Spotify URL; each episode matches at most one sermon

### Modified: `app/api/cron/sync/route.ts`

In the daily sermons sync block, after `syncSermons(PLAYLISTS)`, call `enrichWithSpotify(sermons)` before writing to KV. Wrapped in its own try/catch so a Spotify failure doesn't break the sermons sync.

### Modified: `app/api/admin/sync-sermons/route.ts`

Same enrichment call added after `syncSermons()`.

### Modified: `app/api/health/route.ts`

Add `SPOTIFY_CLIENT_ID` to env var checks (informational, not blocking).

### Config: `lib/sync/config.ts`

Add: `export const SPOTIFY_SHOW_ID = '7AZydPQgOQOqdvpiXLGyRR'`

## What stays the same

- KV schema: no new keys. `sermons:all` already carries `spotifyUrl` (currently `null`).
- API routes: `/api/sermons` already returns `spotifyUrl` in the response — it just starts having values.
- Frontend: any UI that reads `spotifyUrl` will start showing links once data flows.
- Cron schedule: no changes. Spotify runs inside the existing daily sermons window.
- `SermonData` type: unchanged (field already exists).

## Error handling

- Missing env vars: skip Spotify enrichment entirely, log once
- Auth failure (bad credentials): log error, return sermons without Spotify URLs
- Rate limit (429): log warning, return partial results (matched so far)
- Network timeout: same as auth failure — sermons sync succeeds without enrichment

## Testing

- Unit test for date matching logic (exact, +/-1 day, multi-sermon tiebreaker)
- Unit test for Spotify auth token fetch (mocked)
- Manual verification via `/api/admin/sync-sermons` (trigger enrichment, check KV for populated `spotifyUrl` values)
