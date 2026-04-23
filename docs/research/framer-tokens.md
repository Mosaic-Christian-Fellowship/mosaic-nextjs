# Framer Design Tokens

Distilled from the live Framer reference site (https://mosaicnj.framer.website/) on 2026-04-22 via direct raw HTML/CSS/asset extraction. Every value below is source-traced, not inferred.

## Fonts

| Family | Where used | Weights |
|---|---|---|
| **Poppins** | All section text, headlines, body, footer — the primary content font | 400, 600 (500/700 added for utility coverage) |
| **Inter** | Nav/header only — UI chrome | 400, 500, 600, 700 |
| ~~Satoshi~~ | Loaded by Framer template but never actually used — dropped from port | — |

Loaded via `next/font/google` in `app/layout.tsx`:
- `--next-poppins` → Tailwind `font-sans` (default body font)
- `--next-inter` → Tailwind `font-inter` (applied on `<Nav>` only)

## Text style presets (Framer's typography system — 11 presets)

All Poppins, `#1E2024` text color, line-height `1.2em` for headings / `1.6em` for body.

| Preset | Size / Weight | Use |
|---|---|---|
| `17ifws6` | 40px / 600 | Hero h1 |
| `1d93tan` | 34px / 600 | Stage-of-life card titles |
| `11zr3hq` | 28px / 600 | Section h2s (community events, banner, stage-of-life, meet-you) |
| `a1vm45` | 20px / 400 | FAQ subhead |
| `mor1ix` | 16px / 600 | Footer column headings |
| `sdy95r` | 14px / 400 | Hero subcopy, stage-of-life body |
| `13vx92` | 14px / 400 | Community events body |
| `5u4n6r` | 14px / 400 (`#000`) | Footer links |

## Colors

| Token | Hex | Role | Frequency |
|---|---|---|---|
| `--color-framer-ink` | `#1E2024` | Primary text | pervasive |
| `--color-framer-deep-blue` | `#0041A2` | Button borders, depth | 3× |
| `--color-framer-blue` | `#0066FF` | CTA fill, link brand | nav CTA, hero CTA |
| `--color-framer-lime` | `#D2F944` | Bright lime accent | 83× |
| `--color-framer-grey` | `#7F838A` | Muted text | — |

**Per Tailwind v4 / Mosaic memory rule:** use these as CSS variables for plain CSS (body styles, inline styles) only. In Tailwind arbitrary values (`bg-*`, `border-*`, `text-*`), use the explicit hex value: `bg-[#0066FF]` — NOT `bg-[var(--color-framer-blue)]` (which silently renders transparent).

## Border radii

- **`12px`** — dominant (2,739 hits) — card corners, input fields
- **`10px`** — secondary — smaller elements
- **`40px`** — pill buttons
- **50%** — circular avatars/icons

## Spacing scale

- **Section inline padding:** 40–80px
- **Card gaps:** 10px / 20px / 40px
- **Button padding:** 15px 30px (vertical / horizontal)

## Shadows

Framer uses only ONE shadow, and only on buttons:
```
inset 0px 2px 1px 0px rgba(255, 255, 255, 0.2)
```
(Inner top highlight — gives primary buttons a subtle "raised" feel.)

## Assets (extracted + optimized)

| Section | Asset | Path in public/ | Notes |
|---|---|---|---|
| Hero | — | (reuses existing `/hero-video.mp4`) | Per user direction |
| Community events | 3 PNGs | `/framer/events/` | 124K total |
| Full-width banner | `banner.jpg` | `/framer/banner/banner.jpg` | Optimized 10M → 412K via `sips -Z 1920` |
| Stage of life | 10 JPGs + 2 SVGs | `/framer/stage-of-life/` | 1.3MB total |
| Footer | 1 SVG (logo) | `/framer/footer/inline-0.svg` | Currently unused — using header's hexagon logo instead |

## What's NOT ported from Framer

- **FAQ section** — Framer has it with placeholder copy only. User's scope didn't include it. Skipped.
- **Social icons in footer** — Framer has NONE despite the brand spec mentioning FB/IG/YT/Spotify. Ported exact per user directive. Add later if needed.
- **Satoshi font** — loaded but unused in Framer. Skipped.
- **All dropdown/link hrefs** — Framer has all stubbed to `./`. Mapped to existing routes in `Nav.tsx` and `Footer.tsx`; unmapped items use `#`.

## Deviations from pure Framer source (intentional)

| Item | Framer | Next.js port | Why |
|---|---|---|---|
| Nav stickiness | `position: relative` (scrolls away) | `position: sticky` with scroll-transition opacity | Per user direction |
| Hero video | Framer CDN MP4 | Local `/hero-video.mp4` (existing) | Per user Q3 answer |
| CTA routes | All `./` stubs | Mapped to existing `/im-new`, `/give`, `/messages`, `/events` | Per user Q4 answer |
| Stage-of-life content | Framer's 10 generic "Meet Our Community" cards with placeholder descriptions | **TBD on review** — currently Framer cards verbatim | Per user: port as-is, review/edit after |
| Banner image | 10MB original (7952×5304) | 1920×w optimized JPEG (412K) | Performance — would be absurd to ship 10MB |
