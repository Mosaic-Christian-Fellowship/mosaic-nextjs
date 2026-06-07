# Mosaic Website — Full Design Audit

**Date:** 2026-06-06
**Scope:** Whole site, held to hi-fi / production standards
**Basis:** Live site (`mosaic-nextjs.vercel.app`) rendered across desktop / tablet / mobile + full source review
**Method:** Four parallel dimension specialists — Visual & Composition, Accessibility (WCAG 2.1 AA), Responsive & Mobile, Web Interface Guidelines & Code — using the `design-craft`, `responsive-craft`, and `web-design-guidelines` skills.
**Pages covered:** `/`, `/about`, `/about/staff`, `/connect`, `/events`, `/give`, `/im-new`, `/messages`
**Screenshots:** `screenshots/audit-2026-06-06/` (24 renders, gitignored)

---

## The headline

The site is built from **two competing visual systems plus a layer of developer placeholders**, so it reads as "assembled parts," not one finished product. The most damaging part: a church whose entire differentiator is *genuine warmth and real people* currently greets first-time visitors with **hot-pink (`#FF69B4`) placeholder blocks on 5 of 8 pages** — including the staff page (all six cards say `[Photo]` / `[Name]`) and the kids-ministry reassurance block on `/im-new`, which is exactly where anxious young families look.

The good news: a small number of fixes clear a disproportionate share of the findings. Killing the pink and unifying on one hero treatment resolves 6+ critical items across three of the four lenses at once.

### Confidence note — what all four lenses agreed on

When independent specialists flag the same thing, it's real. These were corroborated across multiple lenses:

| Issue | Flagged by |
|---|---|
| Hot-pink `#FF69B4` placeholder heroes live in production | Visual, Accessibility, Code |
| `#7F838A` muted text fails contrast (3.81:1) site-wide | Accessibility, Visual |
| Form inputs strip `focus:outline-none` with no visible replacement | Accessibility, Responsive, Code |
| No `viewport-fit=cover` / viewport export | Responsive, Code |
| Sermon thumbnails are raw `<img>` (CLS) + no labels on inline forms | Accessibility, Code |
| `/messages` mobile page is enormous (61 MB render) — runaway auto-load | Responsive, Code |
| Carousels (ServeTeam) unusable at mobile widths | Visual, Responsive |
| Auto-scrolling carousel ignores `prefers-reduced-motion` | Accessibility, Code |

---

## Do these first (highest impact, lowest effort)

Ranked by *findings-cleared per hour of work*:

1. **Kill `#FF69B4` everywhere → one shared `PageHero` (dark `#1E2024` band).** Replace the four pink page heroes (`about`, `connect`, `give`, `im-new`) and every `PlaceholderImage` / pink content block. Single biggest visual + accessibility win — existing white hero text already passes 16:1 on `#1E2024`. *Clears ~6 criticals.*
2. **Replace `#7F838A` muted text with `#6B7280` (4.63:1) site-wide.** One token change in `globals.css:19` + hardcoded uses. Fixes dozens of contrast failures in Footer, FAQ, forms, section subtexts, event/sermon metadata.
3. **Add a global focus ring + fix form focus.** Swap `focus:outline-none focus:border-[#0066FF]` for `focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2` across ContactForm, PlanVisitForm, PrayerRequestForm, SermonArchive search, EventsBrowser search, Nav, CTASection, carousels.
4. **Add viewport export with `viewport-fit=cover`** to `app/layout.tsx`.
5. **Lock form controls to 16px** (`input, textarea, select { font-size: max(16px, 1rem) }` in `globals.css`) to stop iOS zoom-on-focus.
6. **Per-page metadata + Open Graph + `Church` JSON-LD.** Every page currently serves the same generic title/description — a hard SEO blocker for "church Northvale NJ" searches.
7. **Cap `/messages` auto-load + `loading="lazy"` on sermon images.** Stops the runaway DOM/image growth on mobile.
8. **Error/red text `text-red-500` → `text-red-700`** (3.76:1 → 6.47:1) and add a non-color error icon across the three forms.

Items 1–3 alone resolve the majority of the criticals below.

---

## Critical findings by theme

### A. Placeholders in production
- **Hot-pink heroes** on `/about` (`about/page.tsx:17`), `/connect` (`connect/page.tsx:12`), `/give` (`give/page.tsx:7`), `/im-new` (`im-new/page.tsx:59`). White text on `#FF69B4` = 2.65:1 (fails AA badly).
- **Pink image placeholders:** `PlaceholderImage.tsx:14`, `ServeTeamCarousel.tsx:88`, home "What to Expect" (`PlanVisitSection.tsx:68`), about R/E/D cards + founding story (`about/page.tsx:42,65`), im-new kids ministry (`im-new/page.tsx:165`).
- **Staff page is 100% placeholder** — all six cards render literal `[Photo]` / `[Name]` brackets. Should arguably be unlinked until populated (Sanity staff schema exists).
- **Literal copy placeholders** render verbatim: `[X] years`, `[Year]`, `[Number]`, `[TBD]`, `[Placeholder: Church founding story…]` on `/about`.

### B. Three incompatible hero treatments + two live color systems
- Dark-ink (home, staff, messages), hot-pink (about, connect, give, im-new), plain-white (events) — navigating page to page feels like three different sites. **Fix:** one `PageHero` component used everywhere; video hero reserved for home.
- `globals.css:13-30` ships both the Framer palette (`#0066FF`/`#0041A2`/`#1E2024`) **and** the legacy wireframe palette (`#2A9D8F` teal, `#4E8EBE`, etc.). Dead tokens that invite drift — delete the legacy block once confirmed unreferenced.

### C. Accessibility blockers on core flows
- **No skip link** anywhere (`app/layout.tsx`) — keyboard users tab through the full sticky nav before reaching content (WCAG 2.4.1).
- **`#7F838A` muted text fails 4.5:1** (3.81:1) — the single largest contrast failure, used pervasively.
- **Form error text `text-red-500`** fails (3.76:1) and error state is color-only (no icon).
- **GroupFinder slide-out dialog** (`GroupFinder.tsx:265-276`) is `role="dialog" aria-modal` but does **not** trap focus on open or restore it on close.
- **GroupFinder inline interest form** (`GroupFinder.tsx:88-124`) has placeholder-only inputs, no `<label>` (ServeTeamCarousel does this correctly — copy that pattern).
- **Home Community Events bento** (`CommunityEvents.tsx:116`) hides title/details behind hover-only `opacity-0` — on touch devices the cards are **permanently unlabeled blue rectangles**, and keyboard focus doesn't reveal them either (WCAG 1.4.13).

### D. Responsive breakage
- **No viewport meta / `viewport-fit=cover`** (`app/layout.tsx`) — notched-device safe areas silently return zero.
- **Form controls at 14px** trigger iOS zoom-on-focus across all forms.
- **ServeTeamCarousel** (`ServeTeamCarousel.tsx:86`) hardcodes `w-[calc(33.333%-1rem)]` with no mobile override → three ~120px cards at 390px, names/buttons unreadable, no swipe wired.
- **`/im-new` hero** (`im-new/page.tsx:62`) `max-w-[60%]` crushes the 36px headline into ~234px on mobile → severe word-by-word wrapping. (Also violates the no-manual-widow-hack rule — use `text-wrap: balance`.)
- **Nav pill CTA** stays visible on mobile next to the hamburger, crowding the wordmark — hide on mobile, surface inside the menu.
- **`/connect` and `/messages` render unbounded lists** (~26k px and 61 MB respectively) — no pagination on EventsList/GroupFinder; SermonArchive's `IntersectionObserver` `rootMargin: '300px'` auto-loads runaway pages.

### E. Code / robustness / SEO
- **Per-page metadata, Open Graph, and `Church` JSON-LD all missing** — every page is SEO-undifferentiated; no rich results, no social cards.
- **Raw `<img>` (no width/height, no lazy)** on sermon thumbnails (`FeaturedSermonSection.tsx:28,81`, `SermonArchive.tsx:157`) and PCO team images (`ServeTeamCarousel.tsx:90`) → CLS. `CommunityEvents`/`EventsBrowser` already use `next/image` — match them.
- **No error boundaries** (`error.tsx`) and silent failure modes: `FeaturedSermonSection` returns `null` when KV is empty (homepage's main content vanishes); `ExtendedCut.tsx:11` fetches with no `.catch`.
- **`TeamGridCrossfade` hydration mismatch** — `Math.random()` shuffle differs server vs client (`TeamGridCrossfade.tsx:7-13`); move randomization into `useEffect`.
- **`/give` "Give Now" button** has no `type="button"` and no handler/disabled state — a button that does nothing (`give/page.tsx:40`).
- **EventsList cards are `<div>`s, not links** (`EventsList.tsx`) — events on `/connect` aren't navigable, unlike `EventsBrowser`.

---

## Full findings by dimension

The four specialist reports below are lightly deduped against the synthesis above. Each finding carries severity + `file:line` + a specific fix.

---

## 1. Visual & Composition Craft

### Cross-cutting
- **[CRITICAL]** Hot-pink `#FF69B4` placeholders shipped live — page heroes (`about/page.tsx:17`, `connect/page.tsx:12`, `give/page.tsx:7`, `im-new/page.tsx:59`) and image blocks (`PlaceholderImage.tsx:14`, `ServeTeamCarousel.tsx:88`). **Fix:** dark-ink hero treatment + real photos / neutral `#E5E7EB` interim blocks.
- **[CRITICAL]** Three incompatible hero treatments fracture cohesion. **Fix:** one `PageHero` component; video hero for home only.
- **[REFINEMENT]** Two live color systems in tokens (`globals.css:13-30`) — delete the legacy wireframe block (`:20-30`) once unreferenced.
- **[REFINEMENT]** No neutral/spacing scale — 6+ near-identical grays as arbitrary values (`#E5E7EB`, `#E2E8F0`, `#DBDDE0`, `#F5F7FA`, `#F5F5F7`, `#F3F4F5`, `#D2D5DA`). Promote 3-4 named neutral tokens.
- **[REFINEMENT]** Section H2s vary at the same hierarchy level: `CommunityEvents.tsx:150` (28/34px) vs `StageOfLife.tsx:173` (36/48px). Normalize to one section-H2 size.
- **[REFINEMENT]** Thin focus-visible coverage (~14 refs site-wide); nav/dropdown/CTA rely on `hover:opacity-70`. Add a shared focus utility.

### Per page
- **Home** — [CRITICAL] Community Events bento cards show no title at rest, text is hover-only (`CommunityEvents.tsx:116`) → always render title + persistent scrim. [CRITICAL] "What to Expect" right column is a pink placeholder (`PlanVisitSection.tsx:68`). [REFINEMENT] "Meet Our Community" photos muddy — `opacity-50` over black + 85% blue gradient (`StageOfLife.tsx:41,50-53`) → raise image opacity ~0.85, lighten gradient ~0.55. [REFINEMENT] "Meet Our Community" H2 (48px) dwarfs siblings.
- **About** — [CRITICAL] Pink hero + four pink placeholder blocks (`about/page.tsx:17,42,65`). [REFINEMENT] Abrupt dark band drops in between white sections.
- **Staff** — [CRITICAL] Every card is a pink `[Photo]` / `[Name]` placeholder.
- **Connect** — [CRITICAL] Pink hero. [REFINEMENT] "Find Your People" is a wall of ~40 identical cards, no hierarchy → group by type, feature 3-4, collapse the rest.
- **Events** — [REFINEMENT] Endless flat list, uniform weight → group by month, feature next event. [REFINEMENT] Plain-white hero breaks site language.
- **Give** — [CRITICAL] Pink hero. [POLISH] Sparse/unbalanced layout → add warmth element (community photo / impact stat).
- **I'm New** — [CRITICAL] Pink hero + pink kids-ministry block (`im-new/page.tsx:59,165`). [POLISH] Raw Google Maps iframe looks utilitarian.
- **Messages** — [REFINEMENT] Inconsistent sermon thumbnails (real stills mixed with text-only series graphics) → enforce consistent crop + fallback. (Otherwise the most production-ready page.)

---

## 2. Accessibility (WCAG 2.1 AA)

### Cross-cutting
- No skip link (2.4.1); `#7F838A` muted text fails 4.5:1 (1.4.3); all form inputs strip outline with no compliant replacement (2.4.7); `text-red-500` error text fails + color-only (1.4.3 / 1.4.1); pink placeholder heroes fail contrast badly; `StageOfLife` auto-scroll (3500ms) ignores `prefers-reduced-motion` (2.2.2) while `TeamGridCrossfade` does it correctly — copy that.

### Selected findings (full list has 28)
- **[CRITICAL]** 2.4.1 — add skip link in `app/layout.tsx`; `id="main-content"` on `<main>` (`app/(site)/layout.tsx:8`).
- **[CRITICAL]** 1.4.3 — `#7F838A` (`globals.css:19`) → `#6B7280`/`#696D74`. Affects Footer, FAQ, SectionHeader, GroupFinder, FeaturedSermonSection, EventsList, MeetYou.
- **[CRITICAL]** 2.4.7 — form inputs `focus:outline-none focus:border-[#0066FF]` → `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF]` (ContactForm, PlanVisitForm, PrayerRequestForm, SermonArchive:104).
- **[CRITICAL]** 1.4.3 — error text `text-red-500` → `text-red-700` + error icon (color independence).
- **[CRITICAL]** 1.4.3 — pink heroes → `bg-[#1E2024]` (white text passes 16.31:1).
- **[CRITICAL]** 1.4.3 — `AudioPanel.tsx:77` `text-white/40` (3.74:1) → `/60`; `ExtendedCut.tsx:79` `text-white/50` (3.44:1) → `/80`.
- **[SERIOUS]** 2.4.7 — no focus styles on Nav buttons/links/CTA (`Nav.tsx:163,185,197,234`), CTASection (`:23`), ServeTeamCarousel join (`:167`).
- **[SERIOUS]** 2.2.2 — `StageOfLife.tsx:101-111` auto-scroll needs reduced-motion guard + visible pause; `LiveStreamBanner.tsx:33` add `motion-reduce:animate-none`.
- **[SERIOUS]** 4.1.2 — desktop dropdowns lack `role="menu"`/arrow-key nav (`Nav.tsx:149-193`).
- **[SERIOUS]** 2.4.3 — GroupFinder dialog doesn't move focus in/out (`GroupFinder.tsx:262-278`).
- **[SERIOUS]** 1.3.1 — FaqAccordion missing `aria-controls`/panel `id` (`FaqAccordion.tsx:23-49`); GroupFinder inline form has no labels (`:86-124`); EventsBrowser Sort label unassociated (`EventsBrowser.tsx:96`).
- **[SERIOUS]** ServeTeamCarousel track needs `motion-reduce:transition-none` (`:80`).
- **[MODERATE]** color-only pill selected states (GroupFinder, PlanVisitForm) → add checkmark/weight; BentoCard hover-only content needs `group-focus-visible:` (1.4.13); required-field `*` only in placeholders → visible legend (3.3.2); GroupFinder/EventsBrowser result updates need `aria-live` (4.1.3); duplicate adjacent links in FeaturedSermonSection (2.4.9); generic "I'm Interested" button names need `aria-label` (2.5.3); PlanVisitForm fieldset errors need `aria-describedby`.

*(Nav logo inner fill 1.4.11 is exempt — already `aria-hidden`.)*

---

## 3. Responsive & Mobile

### Cross-cutting
- **[CRITICAL]** No viewport meta tag (`app/layout.tsx`) — add `viewport-fit=cover`.
- **[CRITICAL]** All form controls `text-sm` (14px) → iOS zoom. Global `globals.css` `input,textarea,select { font-size: max(16px,1rem) }`.
- Mobile-first throughout (no `max-width` queries) — convention-compliant ✓.

### Per page
- **Home** — [CRITICAL] Nav pill CTA crowds wordmark on mobile (`Nav.tsx:196-211`) → hide, move into menu. [CRITICAL] StageOfLife card width 300px too wide <360px (`StageOfLife.tsx:23`) → `clamp(260px,80vw,300px)`. [REFINEMENT] FeaturedSermonSection CTA row needs `flex-wrap` (`:48`); MeetYou CTA `w-fit` → full-width on mobile (`:62`).
- **Staff** — placeholder `aspect-[3/4]` makes a very tall all-pink page (resolves with real photos).
- **Connect** — [CRITICAL] EventsList + GroupFinder render everything, page ~26k px tall → paginate (`connect/page.tsx:35`, GroupFinder show-more). [CRITICAL] Group panel footer needs safe-area padding (`GroupFinder.tsx:331`). [REFINEMENT] ServeTeamCarousel cards unreadable; filter pills `py-2` ≈ 36px < 44px (`:136,146,163`).
- **I'm New** — [CRITICAL] hero `max-w-[60%]` crushes headline (`im-new/page.tsx:62`); visitor-type buttons need `flex-wrap` (`:160`).
- **Messages** — [CRITICAL] runaway auto-load → `rootMargin:'0px'`, cap to 2-3 auto-loads then manual, `loading="lazy"` on imgs (`SermonArchive.tsx:86,157`).
- **Footer / Nav** — [REFINEMENT] footer 2-col on mobile + link `py-1` (`Footer.tsx:53,87`); mobile menu items `py-3` for 44px (`Nav.tsx:235,248`).

---

## 4. Web Interface Guidelines & Code Quality

### Cross-cutting
- No per-page `<title>`/description; no Open Graph/Twitter; no JSON-LD; no `viewport` export; no `autocomplete` on forms; raw `<img>` on sermon/team thumbnails; no error boundaries; `transition-all` (GroupFinder:210, StageOfLife:241); missing `touch-action:manipulation`.

### Selected findings (full list: 14 critical / 17 refinement / 5 polish)
- **[CRITICAL]** Per-page `export const metadata` on all pages + title template in root.
- **[CRITICAL]** Open Graph + Twitter card in root metadata.
- **[CRITICAL]** `Church` JSON-LD (address, geo, service times, tel) in root layout.
- **[CRITICAL]** `viewport` export with `viewport-fit=cover`.
- **[CRITICAL]** `<img>` → `next/image` on sermon thumbnails (`FeaturedSermonSection.tsx:28,81`, `SermonArchive.tsx:157`) and PCO images (`ServeTeamCarousel.tsx:90`).
- **[CRITICAL]** Form focus rings (matches A11y finding); `autocomplete` attrs on all form fields; GroupFinder inline form labels; GroupFinder dialog focus trap.
- **[CRITICAL]** `/give` button: add `type="button"` + handler or disabled state (`give/page.tsx:40`).
- **[CRITICAL]** Robustness: FeaturedSermonSection returns `null` on empty KV (`:106`) → skeleton/empty state; ExtendedCut fetch has no `.catch` (`:11`).
- **[REFINEMENT]** EventsBrowser search/Sort label+id association (`:72,96`); Nav hamburger spans `aria-hidden`; FaqAccordion `aria-controls`; StageOfLife dot `aria-current` misuse; ServeTeamCarousel focus styles; **TeamGridCrossfade hydration mismatch** (`Math.random()` shuffle → `useEffect`); StageOfLife auto-scroll runs off-screen (add IntersectionObserver pause); ExtendedCut over-fetches 50 to show 3; `text-wrap: balance` on all hero H1/H2 (replace `max-w-[60%]` hack); EventsList cards `<div>` → `<Link>`; dropdown `role="menu"`; GroupFinder filter groups → `<fieldset><legend>`; inline `fontFamily` styles → `font-sans`/`font-inter` classes; ContactForm per-field API errors; Hero `<video>` reduced-motion fallback; Maps iframes `tabIndex={-1}`; connect section ids → kebab-case.
- **[POLISH]** FaqAccordion `+` → SVG chevron; emoji 🎙️ → SVG icon; index keys; split EventsList components; `href:'#'` placeholder nav links; literal `[X] years`/`[TBD]` copy on `/about`.

---

## Suggested remediation sequence

**Phase 1 — Stop the bleeding (the live site looks unfinished):** items 1–3 from "Do these first" — kill pink + `PageHero`, fix `#7F838A`, global focus ring. Plus replace `[bracket]` copy and either populate or unlink the staff page.

**Phase 2 — Make it usable on a phone:** viewport export, 16px form controls, ServeTeamCarousel responsive width, Nav pill, `/im-new` headline, `/messages` auto-load cap, list pagination on `/connect`.

**Phase 3 — Accessibility hardening:** skip link, dialog focus trap, reduced-motion guards, form labels/`aria-controls`/`aria-live`, error-icon + `text-red-700`, hover-only content reveal.

**Phase 4 — SEO + robustness + polish:** per-page metadata + OG + JSON-LD, `next/image` swap, error boundaries + empty states, hydration-mismatch fix, token cleanup, `text-wrap: balance`, remaining refinements/polish.

Phases 1–2 are what move the site from "half-built prototype" to "credible, mobile-ready church site." Phases 3–4 are what make it production-grade.
