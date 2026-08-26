# Messages hub and sermon collections — design

**Status:** approved 2026-08-26
**Author:** Dave Yoon with Claude

## Summary

The Messages page lists all 393 sermons as a flat, date-ordered grid behind a
"Load more" button, with an in-page Video/Audio tab switch. This design turns
Messages into a hub with four child pages, groups sermons by series so the grid
shows 90 tiles instead of 393, opens a series in a sheet or modal, replaces
"Load more" with numbered pagination, and gives testimonies and podcasts their
own pages instead of sharing the sermon surface.

It also adds the pipeline concept that makes a testimonies page possible at all:
a playlist can now be *routed to its own collection* rather than only kept or
discarded.

## Why

Three problems, in order of how much they cost a visitor:

1. **The grid buries the teaching.** 393 tiles in reverse-date order means a
   15-part series appears as 15 unrelated cards, and a visitor looking for
   "that series on Joshua" has to scroll past everything newer. 361 of the 393
   sermons belong to one of 58 series; only one series has a single entry.

2. **Testimonies are unreachable.** 13 videos exist on the channel and are
   dropped by the sync. They are among the most persuasive content a
   first-time visitor could see, and today nothing on the site links to them.

3. **Audio is hidden behind a tab.** Podcast listeners have no URL to land on,
   nothing to share, and nothing indexable.

## Structure

| Route | Content | State |
|---|---|---|
| `/messages` | Hub — four cards driving into the children | new |
| `/messages/sermons` | Grouped grid, collections, pagination | moved from `/messages` |
| `/messages/testimonies` | 13 videos, flat grid | new |
| `/messages/podcasts` | Today's Audio panel content | moved out of the tab |
| `/messages/resources` | Stub, `draft: true` | new |

`lib/nav.ts` already declares a Messages dropdown with Sermons, Testimonies and
Resources, the last two parked on `#`. This repoints Sermons to
`/messages/sermons`, fills in Testimonies, and adds Podcasts. Resources stays on
`#` — `lib/pageMeta.ts` keeps a `draft: true` page out of navigation and out of
search until the maintainer flips the flag.

**`/messages` keeps its URL and stops being the sermon list.** It has been
shared and indexed, so it must not 404; it becomes the hub. Deep links land on
a page that names its children rather than on the grid they expected, which is
an acceptable trade for a coherent structure.

### Resources is deliberately empty

The current site's Resources page is curated topical lists — books,
organisations, links, talks under headings like *General Resources*, *Singles &
Couples*, *Leadership*, *Emotional Health*, *Justice & Mercy*. It is editorial
content being reorganised by the maintainer. This design ships the route as a
draft stub and ports none of that content.

## Pipeline: routing a playlist to a collection

Today `PlaylistKind` is `'master' | 'series' | 'excluded'`, and `'excluded'`
means *discard before anything is written*. Testimonies are therefore not
"hidden from the sermon list" — they do not exist in Redis at all.

Add a fourth kind:

```ts
export type PlaylistKind = 'master' | 'series' | 'excluded' | 'category'

export interface PlaylistConfig {
  id: string
  name: string
  kind: PlaylistKind
  /** Required when kind is 'category'. Cache key and URL segment. */
  slug?: string
}
```

```ts
{ id: 'PLcVnilxMSYGJ9aPoAOxqP6VE1RtAPQnOw', name: 'Testimonies',
  kind: 'category', slug: 'testimonies' },
```

`syncSermons` returns `{ sermons, series, categories }` where `categories` is
`Record<string, SermonData[]>`. A `'category'` playlist behaves like
`'excluded'` with respect to the sermon archive — its videos are removed from
the sermon set — but its members are collected into their own bucket instead of
being dropped.

The cron writes one cache key per category: `videos:testimonies`.

**Why a general mechanism rather than a `testimonies` special case.** The same
config line would surface `Sermon Clips` (153 videos), `Welcome to Mosaic!`, or
`End of Year Recap Videos` as a page later with no code change. Those are live
questions in the church's open-questions doc right now, so the second consumer
is foreseeable rather than speculative.

**The duration floor does not apply to categories.** `MIN_SERMON_DURATION_SECONDS`
exists to keep promos out of the *sermon* archive. Testimonies are frequently
short by nature, and the playlist is curated by staff, so membership is the
filter. Applying the floor here would silently drop valid testimonies.

## Grouping happens on the server

The grid's unit becomes a *tile*, not a sermon. A tile is either a series or a
standalone sermon.

Grouping cannot be done in the client from the existing paginated endpoint:
page 1 would hold part of a series and page 2 the rest, so counts and ordering
would both be wrong. The grouping must therefore be computed over the full
cached list, which is cheap — 393 records already in Redis.

New endpoint:

```
GET /api/sermons/grid?page=1&limit=24
```

```ts
type GridTile =
  | { type: 'sermon'; sermon: SermonData }
  | { type: 'series'; id: string; name: string; count: number
      thumbnail: string | null; latestDate: string }

{ data: GridTile[], meta: { total, page, limit } }
```

Ordering: every tile carries a date — a sermon's own, or a series' most recent
sermon — and tiles sort by that date descending, interleaved. This puts the
current series first as a collection rather than as three loose cards.

Today that yields **90 tiles across 4 pages** (58 series + 32 ungrouped).
The ungrouped count falls as staff file videos into playlists, with no code
change; the grid improves on its own.

### Filters bypass grouping entirely

Search, series filter and speaker filter continue to call the existing flat
`/api/sermons` and render individual videos, never collections. "Show me every
Dave Park sermon" is a different intent from browsing, and a collection tile is
a wrong answer to it. Clearing all filters restores the grouped grid.

### Series children load on open

Children are not inlined in the grid response. 24 tiles times up to 15 sermons
is a large payload for content most visitors never open. The sheet fetches on
open:

```
GET /api/series/[id]/sermons
```

This also gives the sheet a real loading state, which it wants regardless — an
instant 15-item list is indistinguishable from a rendering bug on a slow
connection.

## Components

| Component | Responsibility |
|---|---|
| `VideoGrid` | Renders a list of video cards. Shared by sermons, testimonies, podcasts so three pages do not fork three grids. |
| `SeriesCard` | Collection tile: offset stacked edges behind the card plus a "15 messages" badge. |
| `SeriesSheet` | Bottom sheet below 768px, centred modal above. One component, one breakpoint. |
| `Pagination` | Numbered pages. Replaces "Load more". |
| `MessagesHub` | The four-card landing layout. |

`MessageTabs` is used in exactly one place — the Video/Audio switch this design
removes. It is deleted along with its tests rather than left orphaned. If a tabbed
surface is wanted later it can come back from git history.

### SeriesSheet requirements

Non-negotiable, because a dialog that skips these is broken for keyboard and
screen-reader users:

- focus moves into the sheet on open and is trapped while it is open
- Escape closes; focus returns to the tile that opened it
- background scroll locked while open
- `role="dialog"`, `aria-modal="true"`, labelled by the series name
- the sheet is dismissible by clicking the backdrop

Motion respects `prefers-reduced-motion` — the existing `Hero` already reads it,
so follow that pattern rather than inventing a second one.

## Responsive

Per the project's standing rules: mobile-first `min-width` queries only,
`clamp()` for type and spacing, container queries for anything that could sit in
more than one parent. `VideoGrid` and `SeriesCard` are both reusable in that
sense, so they use container queries rather than viewport breakpoints. The
sheet-versus-modal switch is a genuine page-level shift and uses a viewport
breakpoint.

Tap targets stay at 44px minimum. Headlines carry `text-wrap: balance`.

## Error handling

| Case | Behaviour |
|---|---|
| Grid fetch fails | Existing archive error treatment; page does not blank |
| Series children fetch fails | Sheet shows an inline retry, stays open |
| A series has 1 sermon | Rendered as a normal sermon tile, not a collection |
| Category cache key missing | Page renders an empty state, does not 500 |
| Category playlist deleted upstream | Sync logs and leaves the last good cache in place |

## Testing

- `syncSermons` routes a `'category'` playlist to its bucket and removes those
  videos from the sermon set
- a `'category'` playlist is not subject to the duration floor
- `'excluded'` still discards entirely — no bucket is created
- grid endpoint groups, orders by latest date, and paginates at the tile level
- a series split across a page boundary cannot occur (regression test for the
  reason grouping is server-side)
- filters return flat sermons and never a collection tile
- `SeriesSheet` traps focus, closes on Escape, and restores focus

Every new filter or grouping test must be shown to fail when the behaviour it
guards is neutralised — the same discipline applied to the duration floor.

## Rollout: two pull requests

Splitting so the data change is not bundled with the riskiest UI:

**PR 1 — structure and data.** The `'category'` kind, `videos:testimonies`,
`/api/videos/[slug]`, the hub, testimonies, podcasts, the resources stub, nav.
Sermons stay exactly as they are today at their new URL.

**PR 2 — collections.** Grid endpoint, `SeriesCard`, `SeriesSheet`,
`Pagination`, and the sermons page rework.

PR 1 is independently valuable: it ships three pages and reaches content that is
currently unreachable, even if PR 2 slips.

## Out of scope

- The Messages hero — explicitly left as is
- The `by Dr. Mac Pier` speaker-parsing bug, which yields "Dr"
- IM.possible's missing series label, which is a staff playlist action
- Porting Resources content
- Any brand or palette work arising from the new logo
