# Typography Reference — Brand & Product Registers

On-demand typography guidance covering font selection, scale, loading, and Mosaic-specific tuning. Ported from the impeccable project (Apache-2.0).

---

## Two Registers

Typography decisions split cleanly by surface type. Pick the right register before making any choices.

| Register | Surface | Feel |
|----------|---------|------|
| **Brand** | Landing pages, marketing, hero sections | Expressive, distinctive, fluid |
| **Product** | App UI, dashboards, admin tools | Legible, systematic, calm |

---

## Brand Register — Font Selection Procedure

Do this before touching any font catalog. Shortcuts here produce fonts everyone else is using.

1. **Extract three concrete brand-voice words.** Not "modern" or "clean" — go specific: "warm and mechanical and opinionated", "playful but authoritative", "clinical with humanity". These constrain the search.

2. **Reject anything on the reflex-reject list** before browsing. These fonts saturate brand surfaces because they're the default AI and design-tool picks:

   > **Reflex-reject list**: Fraunces, Newsreader, Lora, Crimson, Playfair Display, Cormorant, Syne, Space Grotesk, Inter, DM Sans, Outfit, Plus Jakarta Sans, Instrument Sans, Instrument Serif

3. **Browse real foundries** while holding the brand-voice words in mind. Good catalogs: Pangram Pangram, Future Fonts, ABC Dinamo, Klim Type Foundry, Displaay. Visualize the brand as a physical object — what texture, material, weight?

4. **Cross-check aesthetic drift.** "Elegant" doesn't automatically mean a serif. "Technical" doesn't automatically mean monospace. Verify the chosen font serves the brand voice, not a genre reflex.

### Brand Type Scale

Use `clamp()` for fluid sizing. Minimum ratio between scale steps is **1.25**.

```css
:root {
  --text-caption:    clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-secondary:  clamp(0.875rem, 0.8rem  + 0.375vw, 1rem);
  --text-body:       clamp(1rem,     0.95rem + 0.5vw,   1.125rem);
  --text-subheading: clamp(1.25rem,  1.1rem  + 0.75vw,  1.5rem);
  --text-heading:    clamp(2rem,     1.5rem  + 2.5vw,   4rem);
}
```

> Minimum ratio check: each step must be ≥1.25× the step below it at any viewport width.

---

## Product Register

One-family approach is almost always right. The interface should disappear into the task.

- **System fonts are legitimate.** `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` is fast, legible, and requires zero loading decisions.
- **Fixed `rem` scale** — not fluid. Product users are zooming, not admiring typographic rhythm.
- **Scale ratio: 1.125–1.2.** Tighter than brand; density is a feature.
- **Five sizes cover 95% of needs:**

  | Token | Size | Role |
  |-------|------|------|
  | `--text-caption`    | 0.75rem  | Labels, timestamps, metadata |
  | `--text-secondary`  | 0.875rem | Helper text, captions, table data |
  | `--text-body`       | 1rem     | Primary reading text |
  | `--text-subheading` | 1.125rem | Section titles, card headers |
  | `--text-heading`    | 1.25rem  | Page/modal headings |

  Add a display size only if the product has marketing-adjacent hero moments.

---

## Universal Rules

These apply regardless of register.

### Measure and Leading

- `max-width: 65ch` on all text containers. Running 80+ characters fatigues the reader.
- **Headings**: `line-height: 1.1–1.2`
- **Body text**: `line-height: 1.5–1.7`
- **Body minimum**: 16px / 1rem. Never set body text below this.

### Web Font Loading

```css
@font-face {
  font-family: "BrandFont";
  src: url("font.woff2") format("woff2");
  font-display: swap;               /* prevents invisible text */
  size-adjust: 105%;                /* metric-matched fallback to reduce layout shift */
}
```

- Load only the weights you actually use (400, 600 cover most needs; 300 + 800 are usually vanity).
- Subset if the typeface supports it — the Latin subset is often 60–70% smaller.

### Widow Prevention

Apply to all headlines and short copy (≤6 lines):

```css
h1, h2, h3, .hero-headline, .card-title { text-wrap: balance; }
p, li, blockquote { text-wrap: pretty; }
```

Never use `&nbsp;` or manual `<br>` to fix widows — they break at narrow viewports.

---

## Mosaic Tuning

**The Mosaic church site uses Poppins throughout.**

Poppins is a deliberate brand choice: geometric, friendly, and legible at small sizes on a phone, which is how most visitors arrive. It is not a reflexive default — don't swap it for a "safer" pairing.

Headlines use `clamp()` for fluid sizing and **must** carry `text-wrap: balance` so no headline ends with a single orphaned word. Body copy longer than six lines uses `text-wrap: pretty`.

`#0066FF` is used for typographic emphasis — section overlines and links — never as body text color.
