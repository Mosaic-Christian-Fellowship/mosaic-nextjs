# Layout Reference — Space, Grid, and Structure

Spatial and structural decisions that determine whether a design reads clearly or fights itself. Ported from the impeccable project (Apache-2.0).

---

## Spacing Scale

Base unit is **4px**. All spacing values are multiples of 4.

| Token | Value | Use |
|-------|-------|-----|
| `--space-1`  | 4px  | Icon-to-label gap, inline padding extras |
| `--space-2`  | 8px  | Related items — label + input, icon + text |
| `--space-3`  | 12px | Tight grouping within a component |
| `--space-4`  | 16px | Default internal padding (cards, form fields) |
| `--space-6`  | 24px | Between components in the same section |
| `--space-8`  | 32px | Section subdivisions |
| `--space-12` | 48px | Between distinct sections |
| `--space-16` | 64px | Major vertical rhythm |
| `--space-24` | 96px | Top-of-page / between hero and first section |

**Never use arbitrary values.** If you reach for 13px, go to 12 or 16 and adjust surrounding context to compensate.

### Grouping Rhythm

- **Related items:** 8–12px gap. Label + value. Icon + button label. Form field + validation message.
- **Sibling components:** 16–24px gap. Cards in a row. Nav items. List entries.
- **Section breaks:** 48–96px gap. This is where the squint test lives.

---

## The Squint Test

Step back (or squint) until the content blurs. The visual weight hierarchy should still be readable at low resolution:

- **One obvious primary area** draws the eye first.
- **2–3 secondary areas** form the next layer.
- **Supporting/muted content** recedes naturally.

If everything competes at the same weight, the hierarchy is broken. Add space, reduce weight, or reduce color intensity on supporting content until the three-layer reading order is clear.

---

## Tool Selection

Use the right layout tool — mixing tools indiscriminately produces fragile, unreadable CSS.

| Layout Need | Right Tool |
|-------------|-----------|
| Single axis (row OR column) | Flexbox |
| Two axes simultaneously (row AND column) | CSS Grid |
| Component adapting to container width | Container queries |
| Page-level structural shifts (nav, sidebar) | Viewport media queries |
| Fluid spacing that scales with viewport | `clamp()` |

**`gap` over margins** — always. Margin collapse is unpredictable; gap is explicit and symmetric.

### Flexbox

```css
/* Row with consistent spacing */
.row { display: flex; gap: var(--space-4); align-items: center; }

/* Column stack */
.stack { display: flex; flex-direction: column; gap: var(--space-6); }
```

### CSS Grid

Use named template areas at breakpoints — readable at a glance, easy to reassign.

```css
.layout {
  display: grid;
  grid-template-areas:
    "nav"
    "main"
    "aside";
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 240px 1fr 280px;
    grid-template-areas: "nav main aside";
  }
}
```

### Container Queries

Use for any component that lives (or could live) in 2+ parent contexts — cards, list items, nav atoms, sidebars.

```css
.card-wrapper { container-type: inline-size; }

.card { /* default: narrow */ }

@container (min-width: 400px) {
  .card { /* wide variant */ }
}
```

---

## Fluid Spacing on Brand Surfaces

On brand/marketing surfaces, spacing should breathe and scale with the viewport — not snap at hard breakpoints.

```css
.hero {
  padding-block: clamp(var(--space-12), 8vw, 120px);
  padding-inline: clamp(var(--space-4), 5vw, var(--space-24));
}

.section {
  margin-block-end: clamp(var(--space-12), 10vw, 160px);
}
```

Product surfaces use fixed spacing — density is a feature, not a failure.

---

## Breaking Monotony

A grid of identical cards at identical sizes produces a flat, unengaging layout. Vary along at least one axis:

- **Size variation:** One card spanning 2 columns, the rest spanning 1.
- **Color variation:** One card with an accent background, the rest neutral.
- **Content-type variation:** Mix a stat card, a text card, and a visual card in the same grid.
- **Density variation:** One section tight and data-rich, the next spacious and editorial.

Do not apply all four at once — the result is chaos. Pick one dimension of variation and apply it with restraint.

---

## Common Failures

- **Nested cards.** A card inside a card creates visual confusion about what level of information the user is at. Flatten or use a different structural element (e.g., a table row or a sectioned detail panel).
- **Arbitrary spacing outside the scale.** If the spacing looks off, the answer is almost never a custom value — it's adjusting adjacent elements until a scale value works.
- **Using viewport breakpoints on components.** A card that breaks at `768px` viewport width may not break correctly when it's inside a sidebar at `1200px` viewport. Use container queries.
- **Margin collapse surprises.** Block margins collapse between siblings. Use `gap` inside flex/grid containers; use `padding` instead of `margin-block-start` on the first child inside a container.

---

## Pointer: Responsive Depth

For breakpoint escalation strategy, sticky/scroll layout gotchas, and live multi-breakpoint preview, defer to the `responsive-craft` skill. This file covers spatial structure; `responsive-craft` covers how that structure evolves across viewport sizes.
