# Color Reference — Strategy, Palette, and Anti-Tells

Color guidance for both brand and product surfaces. Ported from the impeccable project (Apache-2.0), tuned for the Mosaic church site.

---

## Strategy Ladder

Pick a strategy before picking a color. The ladder runs from restraint to commitment — each rung requires more intentionality to pull off.

| Strategy | Description | When It Works |
|----------|-------------|---------------|
| **Restrained** | One neutral base + one accent, used sparingly | Product UI, data tools, conservative B2B |
| **Committed** | Dominant color fills 60%+ of a surface; 1–2 supporting colors | Brand pages with a clear POV |
| **Full palette** | 4–6 colors in active use, each with a defined role | Rich marketing, editorial, expressive brands |
| **Drenched** | Color saturates the entire experience including backgrounds | High-confidence brand work only; very easy to do badly |

**Rule before choosing any strategy:** Name a real reference brand or visual precedent. "Bold" or "vibrant" is not a strategy — "Stripe-era Mailchimp" or "early Vercel" is. Unnamed ambition defaults to beige.

**The 60% rule:** Whatever your dominant color is, it should cover roughly 60% of the surface. The remaining 40% splits between a secondary (30%) and accent (10%). Violating this creates visual competition, not richness.

---

## Color Space

**Default to OKLCH.** It is perceptually uniform — equal numeric steps produce equal perceived change. HSL and hex are easier to type but produce unpredictable contrast and lightness shifts.

```css
:root {
  /* OKLCH: lightness (0–1) / chroma (0–0.4+) / hue (0–360) */
  --color-brand:   oklch(0.62 0.19 152);   /* example green */
  --color-surface: oklch(0.11 0.02 220);   /* example dark */
}
```

Use HSL or hex only when handing tokens to designers or when the target environment doesn't support OKLCH (check caniuse; OKLCH has 93%+ global support as of 2025).

---

## Product Register — Semantic Vocabulary

Product UI uses Restrained by default. The accent does real work (primary actions, active selection, loading indicators) — it is not decoration.

Define these semantic tokens before any component work:

| Token | Role |
|-------|------|
| `--color-action`    | Primary button, link, CTA — the accent |
| `--color-hover`     | Subtle background shift on hover (≤10% lightness change) |
| `--color-focus`     | Focus ring — must meet 3:1 against adjacent background |
| `--color-active`    | Pressed/active state — slightly darker than action |
| `--color-disabled`  | 40–50% opacity of the element's default color |
| `--color-selected`  | Active nav item, selected table row |
| `--color-loading`   | Skeleton/shimmer base color |
| `--color-error`     | Destructive states, validation failure |
| `--color-warning`   | Cautionary states — yellow/amber family |
| `--color-success`   | Confirmation, completion |
| `--color-info`      | Neutral informational states |

All state colors must be defined at project start. Do not add states ad-hoc mid-build — the inconsistency compounds.

---

## Anti-Tells

These patterns appear on the `design-craft` detector. Each one signals a specific failure mode.

### Purple/Violet as Heading Color or Gradient

The `#8b5cf6` / `#a855f7` family (and any purple-to-indigo gradient) is the AI-generated design default. It reads as "no designer touched this."

- **Anti-tell:** Purple headings, hero gradients shifting from purple to blue or purple to pink.
- **Fix:** If the brand needs purple, pick a specific purple with a clear reference (Cadbury, Hallmark, BAFTA). Random gradient purples signal no intentional color strategy.

### Cream/Beige Background Drift

Softening a white background to cream or beige without a color strategy reason — usually added to "feel warm" with no deliberate logic.

- **Anti-tell:** `#f5f0eb`, `#faf7f2`, `#fffbf5` as page background with no other warm tones in the palette.
- **Fix:** Commit to a warm tone intentionally and carry it through the full palette, or stay neutral.

### Gray Text on Chromatic Backgrounds

Applying standard gray body text (`#6b7280`, `#9ca3af`) directly onto colored or dark backgrounds produces broken contrast and visual muddiness.

- **Anti-tell:** Tailwind's `text-gray-500` or `text-gray-400` on any colored surface.
- **Fix:** Derive text colors from the background using relative lightness. On a dark chromatic background, use a tinted white. On a colored card, tint the text toward the background hue.

---

## Mosaic Worked Example

The Mosaic church site uses a light background + single blue accent strategy, with dark section heroes for contrast.

```css
:root {
  --mosaic-background: #ffffff;      /* light, open, welcoming */
  --mosaic-ink:        #1E2024;      /* near-black body text and dark heroes */
  --mosaic-blue:       #0066FF;      /* primary action + overline accent */
  --mosaic-blue-deep:  #0041A2;      /* hover / pressed states */
  --mosaic-muted:      #6B7280;      /* muted text — the lightest gray permitted */
  --mosaic-eyebrow:    #7AA9FF;      /* accent on dark heroes only */
}
```

Key decisions:
- `#0066FF` carries primary actions and section overlines. It is never a large background fill.
- On dark `#1E2024` heroes the accent shifts to `#7AA9FF` — `#0066FF` on near-black fails contrast.
- `#6B7280` is the **floor** for muted text on white. Anything lighter fails WCAG AA and has already had to be fixed once site-wide.
- Placeholder image slots render as a neutral gray block. A previous hot-pink placeholder convention was retired — colored placeholders read as broken to visitors.
