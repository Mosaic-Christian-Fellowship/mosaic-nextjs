# Session Handoff — 2026-04-22 (Framer home-page port)

## Summary

Full Framer → Next.js home-page port completed on branch `feat/framer-home-port`. Ten git commits, one per unit of work, every section ported with values extracted directly from the Framer reference site's raw HTML/CSS/assets (no inference). Component-driven architecture: page.tsx is now an 8-line composition root; every section lives in its own reusable component under `components/`.

## Preview URL

**https://mosaic-nextjs-b9oychqfu-zb-kami.vercel.app**

All eight sections render. Typecheck + production build both pass. No hydration errors. HTTP 200 on home + all subroutes.

## Section-by-section status

| # | Section | Component | Framer source | Notes |
|---|---|---|---|---|
| 1 | Hero | `components/Hero.tsx` | `sections/hero.*` | Reuses existing `/hero-video.mp4`, 2 CTAs with Framer copy |
| 2 | Plan a Visit | `components/PlanVisitSection.tsx` | — | Current content, Framer tokens |
| 3 | Community Events | `components/CommunityEvents.tsx` | `sections/community-events.*` | **3 placeholder descriptions verbatim from Framer** |
| 4 | Full-Width Banner | `components/FullWidthBanner.tsx` | `sections/full-width-banner.*` | Banner image optimized 10M → 412K |
| 5 | Stage of Life | `components/StageOfLife.tsx` | `sections/stage-of-life.*` | 10-card infinite marquee, hover pause, **all placeholder descriptions** |
| 6 | This Week's Sermon | `components/FeaturedSermonSection.tsx` | — | Kept; retoned |
| 7 | Extended Cut | `components/ExtendedCut.tsx` | — | Kept; dark bg shifted #1E3A5F → #0041A2, eyebrow lime |
| 8 | We'd Love to Meet You | `components/MeetYou.tsx` | — | Current structure, Framer tokens |
| 9 | Footer | `components/Footer.tsx` | `sections/footer.*` | Rewrite from dark → Framer's light 4-column layout |

## Typography

Dual-font setup per Framer's actual usage:

- **Poppins** (`--next-poppins`) — body default, all sections, headings
- **Inter** (`--next-inter`, applied via `font-inter` class on `<Nav>` only) — UI chrome

Loaded via `next/font/google` in `app/layout.tsx`. Zero CDN requests to Google Fonts at runtime.

## Design tokens

Codified in `app/globals.css` `@theme` block and documented at `docs/research/framer-tokens.md`. Key colors:

- `#1E2024` primary ink (text)
- `#0041A2` deep blue (Extended Cut section bg)
- `#0066FF` brand blue (CTAs, links, accents)
- `#D2F944` lime accent (used in Extended Cut eyebrow)
- `#7F838A` muted grey (body copy, meta)

Per the project memory rule (Tailwind v4 gotcha): tokens are referenced as explicit hex values in Tailwind arbitrary classes (`bg-[#0066FF]`), NOT via CSS custom properties (which silently render transparent in Tailwind v4 arbitrary value syntax).

## CTA route mapping

| CTA label | Destination | Status |
|---|---|---|
| Plan your visit (hero, meet-you) | `/im-new` | existing route |
| Watch past sermons (hero) | `/messages` | existing route |
| Browse all events (community events) | `/events` | existing route |
| Get to know us (banner) | `/about` | existing route |
| Browse all messages (sermon) | `/messages` | existing route |
| I'm new here (footer) | `/im-new` | existing route |
| Sermons (footer Gospel col) | `/messages` | existing route |
| Our Beliefs / Our Team (footer Quick Links) | `/about` | existing route (same page) |
| Our Ministries / Community Groups (footer) | `/connect` | existing route |
| Stage-of-life card: Sermons | `/messages` | existing route |
| Stage-of-life card: Community Groups / Ministries Directory / Community Group | `/connect` | existing route |
| Stage-of-life card: Mosaic Team | `/about` | existing route |
| All other footer/card links | `#` | stubbed — awaiting real route decisions |

## Items flagged for your review

### Content (pending your edits)
1. **Community Events descriptions** — all three cards have "Add a short description to explain this card." (Framer placeholder). Titles are real (Community Groups, Bible Study, Soda Summer Retreat).
2. **Stage of Life cards** — all 10 cards use the same placeholder description. Titles are real but may need renaming (Framer's card #10 is literally "Community Group" singular — possibly a duplicate).
3. **Hero subcopy** — uses Framer's exact wording including the "YouTube" link. Verify phrasing reads right for the target audience.

### Design questions
4. **Footer — no social icons.** Framer footer has zero social links. CLAUDE.md mentions FB/IG/YT/Spotify. I ported exact per your directive; flag if you want a row added.
5. **Banner image** — I optimized Framer's 10MB original down to 412K (`sips -Z 1920`). If you have a higher-quality hero photo for later, drop it at `public/framer/banner/banner.jpg` and the component picks it up automatically.
6. **Extended Cut background** — I moved it from legacy `#1E3A5F` to Framer's deep blue `#0041A2`. Slightly brighter/bluer. Swap back if it reads wrong.
7. **Marquee speed** — 60 seconds per cycle. Feels natural at desktop widths; may read too slow on large monitors. Adjust in `globals.css` `@keyframes marquee` + `animation` shorthand.

### Architecture TODOs
8. **FAQ section not ported.** Framer has one; you didn't include it in scope (probably because Framer's version is 100% placeholder). Let me know if you want it.
9. **Sanity CMS wiring** — all content is hardcoded. Schemas exist but aren't wired. Marked as post-approval work.
10. **Route gap — the 13+ `#` stub links** in footer/stage-of-life need real destinations. Low-priority since client said "deal with routes later."

## Branch + git

- Branch: `feat/framer-home-port` pushed to origin
- Orphaned: `feat/nav-port` on origin (left from branch rename; you can delete via GitHub UI)
- 10 commits on the branch (foundation → Hero → Plan Visit → Community Events → Banner → Stage of Life → Sermon section → Extended Cut → Meet You → Footer → page.tsx rewire)
- Each commit is self-contained and reviewable independently

## Global components updated (CDD directive)

Per your component-driven development directive, global components are single source of truth:

- `Nav.tsx` — used by all `(site)/*` pages via `layout.tsx`
- `Footer.tsx` — same
- `SectionHeader.tsx` — retoned once, picked up by Plan Visit, Sermon, and Meet You sections automatically
- `FeaturedSermon.tsx` — retoned once, picks up on home + any future page using it

## What was NOT touched

- Other routes (`/about`, `/connect`, `/give`, `/im-new`, `/messages`) — still on legacy wireframe palette. These will need a similar retoning pass when we get there. Scope was explicitly home-page only.
- Form components (`ContactForm`, `PlanVisitForm`, `PrayerRequestForm`, `GroupFinder`, `ServeTeamCarousel`) — unchanged.
- API routes, Sanity schemas, Redis, PCO integration — all unchanged.

## Next steps (morning priorities)

1. Open the preview URL and walk through top-to-bottom
2. Flag which sections feel right and which need revision (use the numbered list above as a check template)
3. Decide on social icons in footer (yes/no)
4. Decide whether to port the FAQ section as well
5. Provide real copy for placeholder descriptions when ready
6. Once home page is signed off, I can retone the other routes to match
