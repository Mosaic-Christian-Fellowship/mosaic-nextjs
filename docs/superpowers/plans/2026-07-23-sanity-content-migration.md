# Plan — Move page copy into Sanity

**Status:** proposed, not started
**Written:** 2026-07-23

## Why

Right now a content volunteer has no way to do content work except by editing `.tsx`
files and opening a pull request. The system asks a writer to behave like a developer,
and then everyone is surprised when the result needs an engineering review.

Every piece of copy that moves into Sanity is work that becomes:

- **self-serve** — staff and volunteers edit it in `/studio`, no branch, no PR, no review queue
- **safe** — no way to break a build by rewording a paragraph
- **off the maintainer's plate** — the bottleneck today is one person reviewing text changes

The lane guardrails (`CLAUDE.md` → *Who does what*) reduce the damage from scope creep.
This removes the cause.

## What already exists

More than you'd expect. **The schemas and queries are already written** — the gap is that
almost nothing consumes them, and the dataset is empty.

| Piece | State |
|---|---|
| `sanity/schemas/` — `homePage`, `staffMember`, `ministry`, `serviceTime`, `faqItem`, `landingPage`, `siteSettings` | Written |
| `sanity/lib/queries.ts` — a query per schema | Written |
| Studio at `/studio`, project `foa4a6im` | Live |
| Pages reading from Sanity | **Only the homepage hero** and the event detail page |
| `production` dataset | **Empty** |

So this is mostly wiring and seeding, not schema design. The precedent to copy is
`docs/superpowers/plans/2026-06-17-sanity-homepage-hero.md` — every field optional, falling
back to the hardcoded value, so an empty dataset renders the site exactly as it does now.

## Sequence

Ordered by value-per-effort. Each phase ships on its own and is worth doing alone.

### Phase 1 — The FAQ / guide content

The highest-value phase, because it's the live example: Michael's guide content
(PR #26, branch `FAQ-Page`) is exactly this shape, and it's already written.

- `faqItem` currently has a `category` field limited to `visitor | faith | family | general`.
  The guide needs topic sections instead — Formation Groups, Visiting and Membership,
  Ministries, Unique Groups, Care & Counseling, Baptism. Either widen that list or add a
  `guideSection` document type that owns an ordered list of `faqItem`s.
- Wire `faqItemsQuery` into whichever page hosts the content.
- Seed the real answers. **The placeholder answers should stay unpublished in Sanity
  rather than shipping as "content to come" text** — that's a better home for
  half-finished copy than a code comment.

Once this lands, Michael writes and edits directly in `/studio`. No branch, no PR.

### Phase 2 — Staff and ministries

`staffMember` and `ministry` schemas exist and are unused. The About page's staff list and
the ministries carousel are both hardcoded. This unblocks a long-standing open item — the
church supplying names and headshots — because they can then upload them without anyone
touching code.

### Phase 3 — Service times and site settings

`serviceTime` and `siteSettings` cover the service schedule, address, parking, and social
links. These change rarely but are exactly the thing nobody wants to file a pull request
for when the 1:30 service moves.

### Phase 4 — Long-form page copy

The About page's founding story and similar prose. Lowest priority and the most schema
design, since long-form needs Portable Text rather than plain strings.

## Rules to hold to

- **Every field optional, always fall back.** Never make a Sanity field required. An empty
  dataset must render the current site unchanged — that's what makes each phase safe to ship
  before anyone has entered content.
- **Sanity is for text and images people edit.** Sermons, events, and groups stay in Redis
  via the sync job. Don't blur that line.
- **Migrate, then delete.** Leaving hardcoded copy behind "just in case" creates two sources
  of truth and a confusing afternoon later.

## Open questions

- Widen `faqItem.category`, or introduce `guideSection`? Leaning toward `guideSection` —
  the guide's topics are an ordered structure, not a flat tag.
- Where does the guide content live — its own page, or folded into Plan a Visit? Raised
  with Michael on 2026-07-23, undecided.
- Who gets Sanity Studio logins, and at what role? Editing copy should not require GitHub
  access at all, which is rather the point.
