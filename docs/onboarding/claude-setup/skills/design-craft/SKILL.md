---
name: design-craft
version: 1.0.0
description: |
  UI/UX design quality — intent, accessibility, typography, design systems, critique.
  Use when building, reviewing, or planning any user interface. Enforces intentional
  design choices, WCAG 2.1 AA accessibility, and craft quality across the full design
  lifecycle. Framework-agnostic with React/Tailwind defaults and React Native/mobile
  as a first-class concern.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
---

# Design Craft

Enforces UI/UX design quality across the full build lifecycle through three phases: pre-build intent, in-flight enforcement, and post-build critique. Framework-agnostic with React/Tailwind defaults and React Native/mobile as a first-class concern.

---

## Core Philosophy

### 1. Intent Before Pixels

Before any UI work, answer three questions:

- **Who is the user?** Be specific. "Small business owner filing their first LLC" is useful. "Users" is not.
- **What must they accomplish?** State the verb, not the container. "Compare three plan options and select one" — not "use the pricing page."
- **What should it feel like?** Use specific emotional/experiential terms. "Confident and unhurried, like a concierge desk" — not "clean and modern."

These answers anchor every downstream decision. If you can't answer them, you're not ready to build.

### 2. Intentional Choices, Not Default Choices

This skill enforces intentionality, not specific aesthetic opinions. There are no banned fonts, forbidden colors, or mandated styles. What's right depends on the project.

**Requirements for intentional design:**

- **Name 3 defaults you're consciously rejecting** and what replaces them. Defaults include: the framework's default font stack, the most common color palette for the industry, the prevailing layout pattern for the product type.
- **Swap test:** If you swapped your choices for the most common alternatives and the design didn't feel different, you never made real choices. Example: choosing Inter + rounded corners + blue accent for a fintech app fails the swap test — that describes half the industry. Choosing a geometric sans with sharp corners and dark teal accent *could* pass if the choices connect to specific brand attributes.
- **Domain exploration:** Identify 5+ concepts from the product's world and 5+ colors from its physical or conceptual domain. A marine logistics app might pull from nautical charts, cargo manifests, port signage — yielding slate blues, rust orange, signal yellow. Not "blue because trust."
- **Commit fully to one extreme aesthetic direction** rather than hedging toward a safe average — a distinctive committed choice beats a competent average.

### 3. Accessibility Is Architecture, Not Decoration

WCAG 2.1 AA is a structural requirement, not a polish pass. Accessibility decisions are made at build time:

- **Contrast ratios** (4.5:1 body text, 3:1 large text/UI components) are checked when choosing colors, not after the palette is locked.
- **Touch targets** (44x44px minimum) are part of the layout, not afterthought padding.
- **Focus states** (`focus-visible`) are designed alongside hover states.
- **Semantic markup** (landmarks, headings, labels) is the skeleton, not a retrofit.
- **Reduced motion** (`prefers-reduced-motion`) is handled in the same pass as animation.

---

## Fidelity Modes

The skill infers fidelity from context. No prompt or flag is needed.

### Detection Signals

| Fidelity | Signals |
|----------|---------|
| **Lo-fi** | "wireframe", "sketch", "lo-fi", "layout", "structure", "flow", `[data-theme="wireframe"]`, exploratory/structural work |
| **Mid-fi** | "prototype", "interactive", "clickable", "mid-fi", placeholder content with real components |
| **Hi-fi / Production** | "production", "ship", "deploy", "hi-fi", "pixel-perfect", "final", real brand tokens/assets/content |
| **Ambiguous** | Default to mid-fi; mention the assumed level so the user can correct |

### Convention Deference

If the project's `CLAUDE.md` or global conventions specify a fidelity starting point (e.g., wireframe-first prototype workflow), those conventions take precedence. The inference engine is a fallback, not an override.

### Escalation Scope

Fidelity shifts apply to the scope of the current request, not the entire project. A single component can be hi-fi while the rest of the project remains mid-fi.

---

## Phase 1: Design Intent (Pre-Build)

*Triggers when: starting a new UI component, page, or feature.*

### Register

Before making any type, color, layout, or motion decision, classify the surface:

| Register | What it is | Design stance | Goal |
|----------|------------|---------------|------|
| **Brand** | Marketing, hero sections, landing pages, campaign surfaces | Expressive permission — committed color, characterful type, asymmetric composition, signature motion | Distinctiveness |
| **Product** | App UI, dashboards, forms, settings, data views | Restraint — typically one font family, semantic state colors, predictable grids, motion only to convey state change | Clarity and low cognitive load |

**Why it matters:** the same "good design" advice inverts between registers. A committed, unexpected color choice is a virtue on a landing page and a liability inside a dashboard. Expressive type hierarchy signals brand voice in marketing and creates noise in a task UI. Pick the register before opening a token file — it's the lens for every decision that follows.

**Mosaic context:** this site is almost entirely brand register — it exists to make a first impression on a visitor deciding whether to show up on Sunday. The Sanity Studio at `/studio` is the one product-register surface. The shared token system (Poppins, `#0066FF` / `#0041A2`, `#1E2024` ink) applies throughout; the register determines how expressive you can be with it.

### PRODUCT.md

For any non-trivial project (multi-session, 3+ pages/screens, or shipped to stakeholders), capture or confirm a `PRODUCT.md` at the repo root before design work begins. It is read at the start of every session to anchor decisions. Sections:

- **Register** — brand or product (see above)
- **Users** — specific description of who they are, what they already know, and what brings them here
- **Product Purpose** — what success looks like for both user and builder; how the product is measured
- **Brand Personality** — three-word personality plus tone guidance; what the brand is NOT
- **Anti-references** — specific visual patterns, competitor aesthetics, or clichés to actively avoid
- **Design Principles** — strategic principles that guide decisions ("show, don't tell", "expert confidence") — NOT visual rules like "use OKLCH" or "dark backgrounds only"; those belong in tokens
- **Accessibility & Inclusion** — baseline commitment and any project-specific constraints

If a `PRODUCT.md` already exists, read it before design work. If it doesn't exist and the project warrants one, draft it collaboratively — five minutes now prevents drift across every session that follows.

*Schema sourced from [impeccable](https://github.com/pbakaus/impeccable) (Apache 2.0).*

| Check | Lo-fi | Mid-fi | Hi-fi / Production |
|-------|-------|--------|---------------------|
| Register classification | Implicit | State it | Explicit — name brand or product before first component |
| PRODUCT.md | Skip | Optional if 3+ pages | Create or confirm at session start |
| Intent questions | Who + what verb only | Full intent (who, what, feeling) | Full intent |
| Domain exploration | Skip | Optional — recommended if no brand tokens exist yet | 5+ concepts, 5+ colors, signature element |
| Anti-default mandate | Skip | Light — name 1-2 intentional choices | Full — 3 defaults rejected, swap test |
| Token definition | Skip | Light tokens (enough for consistency) | Full token system |
| Per-component checkpoint | Skip | Optional | Required |

### Per-Component Checkpoint (Hi-fi)

Before writing each component at hi-fi, state:

1. **Intent** — what this component must accomplish
2. **Palette** — which tokens and why they fit this context
3. **Depth** — shadow/elevation choices and why (or why flat)
4. **Surfaces** — background treatment, borders, and why
5. **Typography** — scale choices and why
6. **Spacing** — rhythm choices and why

This prevents drift where individual components feel disconnected from the whole.

### Token Definition Guidance

**Light tokens (mid-fi):** Define just enough for consistency across the prototype. At minimum:
- 2-3 brand colors (primary, secondary, neutral)
- A spacing unit (e.g., 8px base)
- Font stack (1 heading family, 1 body family — or one family for both)

**Full token system (hi-fi):** Complete set covering all design decisions:
- Color: primary, secondary, accent, neutral scale, semantic (success, warning, error, info)
- Typography: font families, size scale (xs through 2xl+), weight scale, line height scale
- Spacing: base unit and scale (e.g., 4, 8, 12, 16, 24, 32, 48, 64)
- Borders: radius scale, width scale
- Shadows: elevation scale (sm, md, lg, xl)
- Breakpoints: mobile, tablet, desktop thresholds

---

## Phase 2: In-Flight Enforcement (During Build)

*Triggers when: writing UI code.*

| Check | Lo-fi | Mid-fi | Hi-fi / Production |
|-------|-------|--------|---------------------|
| Layout & hierarchy | Yes | Yes | Yes |
| Accessibility | Skip | Basics: touch targets (44px min), semantic HTML | Full: contrast (4.5:1), `focus-visible`, keyboard nav, `prefers-reduced-motion`, screen reader labels |
| Mobile | Skip | Safe areas, touch targets | Full: platform conventions, thumb zones, gesture patterns |
| Typography | Skip | Hierarchy consistency | Full: hierarchy + correctness (smart quotes, em dashes, JSX entity gotchas) |
| Token consistency | Skip | Flag ad-hoc values if design system exists | Flag all hard-coded color/spacing not in token system |
| Swap test | Skip | Skip | Gut check per component |

### Enforcement Details

**Layout & hierarchy (all fidelities):**
- Visual hierarchy communicates importance — the most important action is the most prominent element.
- Group related items. Separate unrelated items. Proximity is meaning.
- Consistent alignment grid. Mixed alignment without reason is noise.

**Accessibility basics (mid-fi):**
- All interactive elements have 44x44px minimum touch targets.
- Semantic HTML: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<section>` with headings.
- Images have `alt` text (empty `alt=""` for decorative images).

**Full accessibility (hi-fi):**
- Color contrast meets 4.5:1 for body text, 3:1 for large text and UI components.
- All interactive elements have visible `focus-visible` outlines.
- Full keyboard navigation — every action reachable without a mouse.
- `prefers-reduced-motion: reduce` disables non-essential animation.
- Screen reader: `aria-label` on icon-only buttons, `aria-live` on dynamic content, `role` attributes where semantic HTML isn't sufficient.

**Mobile (hi-fi):**
- Safe area insets respected (`env(safe-area-inset-*)` on web, `SafeAreaView` in React Native).
- Primary actions within thumb zone (bottom 40% of screen).
- Swipe/gesture interactions have visible affordances.
- Bottom sheets and modals respect platform conventions (iOS: drag indicator, Android: scrim dismiss).

**Typography (hi-fi):**
- Heading hierarchy is sequential (no skipping from `h1` to `h4`).
- Body text 16px minimum on mobile (prevents iOS zoom).
- Line height 1.4-1.6 for body text, 1.1-1.3 for headings.
- Smart quotes (`\u2018` `\u2019` `\u201C` `\u201D`), em dashes (`\u2014`), and ellipsis (`\u2026`) — not straight quotes, double hyphens, or three dots.
- In JSX: use Unicode characters directly or HTML entities (`&mdash;`, `&ldquo;`). Escaped sequences in JSX can produce unexpected output.

**Token consistency (hi-fi):**
- Every color, spacing value, font size, border radius, and shadow should trace back to a defined token.
- Ad-hoc values (`#3b82f6`, `padding: 13px`, `gap: 7px`) are flagged unless explicitly justified.

For detailed rules on any check, load the relevant reference file from `references/`.

---

## Phase 3: Post-Build Critique (After Build)

*Triggers when: UI work is complete, before calling it done.*

### Dual-Pass Model

The critique runs two independent passes, then merges into one ranked findings report. Load `references/critique.md` for the full protocol.

**Pass A — Design-director review (LLM judgment):**
Score Nielsen's 10 usability heuristics (0–4 each), check the cognitive-load checklist (≤4 nav items, ≤4 fields per form group, 1 primary + 1–2 secondary buttons per view, ≤4 key dashboard metrics), and do an emotional-journey read. The prior four lenses — **Composition**, **Craft**, **Accessibility**, **Content** — are preserved as sub-lenses of Pass A; their full questions live in `references/critique.md`.

| Sub-lens | Lo-fi | Mid-fi | Hi-fi / Production |
|----------|-------|--------|---------------------|
| Composition — rhythm, proportion, focal point, whitespace | Yes | Yes | Yes |
| Craft — spacing grid, typography hierarchy, depth, interaction states | Skip | Yes | Yes |
| Accessibility — full AA checklist | Skip | Structural only | Full |
| Content — realistic data, labeling, empty/error/loading states | Skip | Skip | Yes |

**Pass B — Deterministic detector:** *not included in this bundle.*

The automated detector was tuned for a different design system and has been left out. Pass A (the design-director review below) plus the persona pass carry the whole critique here. Where Pass A would normally defer to the detector on hard rules — contrast ratios, tap-target sizes, heading order — check those explicitly by hand instead of assuming they're covered.

### Persona Testing

After Pass A + B, evaluate against 5 archetypes: **Alex** (power user), **Jordan** (first-timer), **Sam** (accessibility-dependent), **Riley** (deliberate stress tester), **Casey** (distracted mobile user). Each surfaces a class of issue the heuristic pass may miss. Full persona descriptions in `references/critique.md`.

### Severity & Output

Findings use P0–P3 severity (replacing the prior Critical/Refinement/Polish labels — mapping: P0/P1 = Critical, P2 = Refinement, P3 = Polish). Each finding includes file + line when available, and a specific fix — not just "fix the contrast" but which elements, current ratio, and what change achieves compliance.

After each critique, persist the report to `<repo>/.design-craft/critique/YYYY-MM-DD-<slug>.md` for trend tracking.

For the full dual-pass protocol — heuristics scoring rubric, cognitive-load rules, persona definitions, report template, snapshot format — load `references/critique.md`.

---

## Design System Persistence

Uses the project's existing `memory/` directory. No parallel persistence mechanism.

### Creation Rules (Inferred, Never Prompted)

| Fidelity | Action |
|----------|--------|
| **Lo-fi** | No file created. Wireframes are disposable. |
| **Mid-fi** | Only create if the project spans multiple sessions or has 3+ pages/screens. Lightweight variant. |
| **Hi-fi / Production** | Create `memory/design-system.md` on first activation. Full template. |
| **User-requested** | Create at any fidelity level if explicitly asked. |

### Upgrade Path

If a project starts lo-fi and escalates to hi-fi, create the design system file at that point, seeded with decisions already made during earlier phases.

### What Gets Persisted

- Color tokens with semantic names and hex values
- Typography scale (font families, sizes, weights, line heights)
- Spacing scale
- Border radius tokens
- Shadow/elevation tokens
- Component-level decisions (e.g., "cards use 1px border, not shadow, because...")
- Intent answers from Phase 1

For templates, load `references/design-system-template.md`.

---

## Skill Interactions

### With a project brand guide

Brand guidelines take precedence over domain exploration. The Mosaic tokens (Poppins, `#0066FF` / `#0041A2`, `#1E2024` ink, `#6B7280` muted floor) are defined in the project's `CLAUDE.md` — adopt them directly. Phase 1 domain exploration is replaced by brand alignment verification.

---

## Specialists — Defer, Don't Duplicate

`design-craft` owns the design core: intent, anti-slop, accessibility, typography, color, layout, generic motion, and critique. Three orthogonal concerns live in dedicated specialist skills — route to them rather than reimplementing their logic here.

- **`figma-to-code`** — pixel-faithful reproduction of an existing Figma design. When the task is implementing a file from Figma, skip Phase 1 (intent/exploration) entirely — the design file is the source of truth, not design-craft's judgment. Phase 2 enforcement (accessibility, semantic markup, token consistency) still applies. Phase 3 critique measures fidelity to the source, not independent composition.

- **`responsive-craft`** — responsive depth beyond basic layout: breakpoint escalation strategy, sticky/scroll-coordination patterns, the multi-breakpoint live preview, and the 10 responsive gotchas (viewport units, safe-area insets, container queries, etc.). design-craft's `layout.md` covers spacing and rhythm; anything that's specifically about adaptive behavior across breakpoints defers here.

- **`framer-motion-design`** — React + Framer Motion API specifics: variants, `AnimatePresence`, `layout`/`layoutId` animations, gesture props, and timing tables. design-craft's `motion.md` covers generic CSS motion principles; actual Framer Motion implementation work defers here.

---

## Reference Loading

Reference files are loaded on-demand when entering a phase that needs detailed rules. Do NOT load all references at activation — they exist to keep this file concise while providing depth when needed.

Available references (in `references/`):
- `accessibility.md` — WCAG 2.1 AA detailed rules, contrast, focus, touch targets, color, screen reader
- `mobile.md` — React Native, safe areas, platform conventions, thumb zones, responsive
- `typography.md` — hierarchy, scales, correctness (quotes, dashes), JSX gotchas
- `critique.md` — post-build critique protocol (design-director heuristics + personas), severity ratings, fidelity scoping
- `design-system-template.md` — full + lightweight templates, creation/upgrade rules

---

## What This Skill Is NOT

- Not a component library or code generator
- Not a brand guideline (use the project's own brand/visual guidelines)
- Not a CSS framework preference enforcer
- Not a substitute for design review by a human designer
- Not a Figma-to-code tool (use `figma-to-code`)

---

## Sources & Attribution

| Source | What Was Used | License |
|--------|---------------|---------|
| [Dammyjay93/interface-design](https://github.com/Dammyjay93/interface-design) | Intent workflow, anti-default mandate, swap test, domain exploration, per-component checkpoint, persistent design memory, post-build critique protocol | MIT |
| [bencium/bencium-marketplace](https://github.com/bencium/bencium-marketplace) | Typography rules (Butterick-based), design audit process, WCAG enforcement patterns, anti-AI-slop awareness | MIT |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Accessibility checklist structure, touch target guidelines, industry-aware anti-patterns, token system architecture | MIT |
