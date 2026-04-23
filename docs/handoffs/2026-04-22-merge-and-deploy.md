# Session Handoff — 2026-04-22 (part 2: merge + deploy + cleanup)

## Summary

PR #3 (full Framer home-page port) merged to `main` via squash-merge at commit `4d0c2a6`. Production deployed. All orphaned feature branches cleaned up. Statusline fixes (reset line, ccusage removal) committed to `~/.claude/statusline-command.sh`. Three new feedback memories saved (fidelity rule, branch convention, component-driven development).

## Key Decisions

- **Squash-merge strategy** for PR #3 — keeps `main` history clean (1 commit per shipped feature) instead of 11 individual commits
- **Password-gate removal (`9cc2b4f`)** got auto-absorbed into PR #3's merge because the feature branch base didn't have `proxy.ts`. No separate PR needed.
- **PR #2's wireframe UI tweaks discarded** in favor of my hifi port, per user: "we can ignore PR 2 since that was before our hifi update which is the actual result"
- **Manual `vercel deploy --prod`** retained — GitHub ↔ Vercel integration still not connected (user attempted to wire it earlier but GitHub list didn't show personal account)
- **Password gate scope narrowed** in memory: required only for ZB/ZenBusiness + select freelance projects, NOT blanket across all Vercel projects
- **Branch naming convention locked in:** `feat/<topic>`, `fix/<topic>`, etc. No `claude/` prefix for AI-authored branches.
- **Component-driven development directive:** global components (Nav, Footer, SectionHeader, FeaturedSermon) are single source of truth. Updates propagate everywhere automatically.

## Technical Details

- **Production URL:** https://mosaic-nextjs.vercel.app
- **Immutable prod deployment:** https://mosaic-nextjs-l1qoan4sl-zb-kami.vercel.app
- **Main branch tip:** `4d0c2a6 feat(home): port home page from Framer reference (nav + 8 sections) (#3)`
- **PR #3 merge commit:** `4d0c2a65c7d7aa8e0b19a7fe12e4aeb7f7a0ce4f`
- **Extraction artifacts** (not in repo, local only): `/tmp/framer-extract/` — 20MB of HTML/CSS/assets. Safe to clean up when you want.
- **New components added this session** (under `components/`):
  - `Hero.tsx`, `PlanVisitSection.tsx`, `CommunityEvents.tsx`, `FullWidthBanner.tsx`, `StageOfLife.tsx`, `FeaturedSermonSection.tsx`, `ExtendedCut.tsx`, `MeetYou.tsx`
- **Modified globals:** `Nav.tsx` (hexagon + dropdowns + CTA hover), `Footer.tsx` (Framer light 4-column), `SectionHeader.tsx` (Framer tokens), `FeaturedSermon.tsx` (Framer tokens)
- **Foundation files:**
  - `app/layout.tsx` — loads Poppins + Inter via `next/font/google`
  - `app/globals.css` — `@theme` with `--font-sans`, `--font-inter`, Framer color tokens, `@keyframes marquee`
- **Reference docs:** `docs/research/framer-tokens.md` (full token distillation), `docs/handoffs/2026-04-22-framer-home-port.md` (overnight port log)
- **Assets under `public/framer/`:** events (3 PNGs, 124K), stage-of-life (10 JPGs + 2 SVGs, 1.3MB), banner (1 JPG, 412K after optimization from 10MB), footer (1 SVG)

## Current State

- **Branch:** `main` (local + origin synced at `4d0c2a6`)
- **Last deploy:** Production at `https://mosaic-nextjs.vercel.app` — commit `4d0c2a6`
- **Linear issues:** None touched this session
- **Orphaned branches:** All cleaned (`feat/nav-port`, `initial-frontend-changes`, `intial-frontend-changes`)

## Next Steps

1. **Client review of the live prod site** — walk through section-by-section, flag tweaks
2. **Placeholder copy replacement** — Community Events (3 descriptions) and Stage of Life (10 card descriptions) are all Framer's verbatim "Add a short description to explain this card." Client needs to supply real copy.
3. **Social icons decision** — Framer footer has zero; brand spec mentions FB/IG/YT/Spotify. Confirm whether to add.
4. **FAQ section** — Framer has one with placeholder copy only. Not in scope of this port. Decide whether to include.
5. **Other routes retoned to Framer tokens** — `/about`, `/connect`, `/give`, `/im-new`, `/messages` still use legacy wireframe palette (teal #2A9D8F, slate #2D3748, muted #64748B). Similar retoning pass needed.
6. **Route mapping for 13+ `#` stub links** in footer + stage-of-life — need real destinations
7. **GitHub ↔ Vercel integration** — user tried earlier and personal account didn't show up. Later task.
8. **Sanity wiring** — schemas exist but not wired. Phase 2 task per original migration plan.

## Open Issues

- **`package-lock.json` artifact** — PR #2 introduced it but project uses `bun.lock`. Consider deleting in a cleanup PR.
- **Stage of Life card #10** ("Community Group" singular) — likely a duplicate of card #1 ("Community Groups"). Verify.
- **/events/[slug] landing pages** — untouched this session, still driven by Sanity schemas (not yet wired to a real Sanity project).

## Config Changes Pending Restart

- None. All changes are file-based (components, tokens, docs). Statusline changes take effect automatically on next render.
