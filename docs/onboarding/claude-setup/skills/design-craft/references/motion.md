# Motion Reference — Duration, Easing, and CSS Animation

Generic CSS motion guidance for purposeful, performant animation. Framework-agnostic. Ported from the impeccable project (Apache-2.0).

---

## The Principle

Animation earns its presence by communicating something — state change, relationship, feedback. Motion that exists purely for decoration depletes the motion budget and trains users to ignore it. Ask before every animation: *what does this teach the user?*

---

## Duration Rules

The 100/300/500 rule covers almost every interface moment:

| Range | Use | Examples |
|-------|-----|---------|
| **100–150ms** | Instant feedback — feels immediate | Button press, toggle, checkbox, hover state |
| **200–300ms** | State changes — clearly transitioning but not slow | Dropdown open, tooltip appear, tab switch |
| **300–500ms** | Layout changes — the interface is moving | Modal enter, panel slide, page section reveal |
| **500–800ms** | Entrance — first impression, hero moments | Page load hero, onboarding screens, empty state |

**Exit duration = ~75% of enter duration.** Exits should be faster than entrances — users are moving on.

```css
/* Quick reference tokens */
--duration-instant: 120ms;
--duration-state:   250ms;
--duration-layout:  350ms;
--duration-enter:   600ms;
--duration-exit:    calc(var(--duration-enter) * 0.75);
```

---

## Easing Tokens

These three cover the majority of UI animation needs. All decelerate into the final state — the natural physics of an element settling.

```css
:root {
  /* Noticeable but controlled — most state changes */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

  /* Snappy entrance with soft landing — panels, modals */
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

  /* Fast departure, very soft landing — hero entrances */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
}
```

**`ease-in` is rarely right for UI.** Elements that accelerate out feel like they're running away — use ease-in only for exits, and only when you want a sharp departure.

**`linear` is for loading/progress states** where consistent velocity communicates something (progress bars, spinners).

---

## What to Animate

Animate properties that the GPU composites without triggering layout recalculation:

| Animate (GPU-composited) | Avoid (triggers layout) |
|--------------------------|------------------------|
| `transform` (translate, scale, rotate) | `width`, `height` |
| `opacity` | `margin`, `padding` |
| `filter` (blur, brightness) | `top`, `left`, `right`, `bottom` |
| `clip-path` | `font-size` |

**Why this matters:** Animating `width` or `height` forces the browser to recalculate layout on every frame — it will drop below 60fps on mid-range devices. `transform: scaleX()` produces the same visual result without the cost.

---

## What Not to Do

### No Bounce or Elastic Easing

Bounce and elastic easings (`cubic-bezier` values that overshoot 1 or go below 0 before settling) are dated and undermine trust in professional interfaces. The `design-craft` detector flags these as `bounce-easing`.

```css
/* Flagged by detector */
transition: transform 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55);

/* Use instead */
transition: transform var(--duration-layout) var(--ease-out-quint);
```

### No Animating Layout Properties

The `design-craft` detector flags `layout-transition` patterns — animating `width`, `height`, `margin`, or `padding` directly.

```css
/* Flagged */
transition: height 300ms ease;

/* Use instead: animate max-height with overflow:hidden, or use transform */
transition: max-height 300ms var(--ease-out-quart), opacity 300ms ease;
```

### No Stagger Longer Than 500ms Total

Staggered list entrances are fine. But the total stagger duration should not exceed 500ms — users are waiting for all items to be interactive, and a 1-second stagger on a 10-item list is a usability problem.

```css
/* Cap individual stagger delay */
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
/* max: (n-1) × delay ≤ 500ms total */
```

---

## Reduced Motion — Non-Negotiable

`prefers-reduced-motion` is a mandatory accessibility requirement, not an enhancement. Some users have vestibular disorders where motion causes nausea or disorientation.

**Pattern — blanket suppression (simplest, always-correct baseline):**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Pattern — provide a meaningful no-motion alternative** (preferred for hero moments):

```css
.hero-entrance {
  animation: slideInUp var(--duration-enter) var(--ease-out-expo);
}

@media (prefers-reduced-motion: reduce) {
  .hero-entrance {
    animation: fadeIn 200ms ease;  /* content appears, just without motion */
  }
}
```

The blanket suppression is the safety net. The per-element alternative is the thoughtful approach.

---

## CSS Transition vs. Keyframe Animation

| Approach | When to Use |
|----------|-------------|
| `transition` | State changes triggered by a class or attribute toggle (hover, open, active, selected) |
| `@keyframes` + `animation` | Entrance/exit sequences; multi-step motion; looping motion (spinners, skeletons) |

```css
/* Transition: state change */
.button {
  background: var(--color-action);
  transition: background var(--duration-instant) var(--ease-out-quart),
              transform  var(--duration-instant) var(--ease-out-quart);
}
.button:hover  { background: var(--color-hover); }
.button:active { transform: scale(0.97); }

/* Keyframe: entrance */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Pointer: Framer Motion

For React + Framer Motion API specifics — `variants`, `AnimatePresence`, `layout`/`layoutId` props, gesture callbacks — defer to the `framer-motion-design` skill. This file covers generic CSS motion; the Framer Motion skill handles the declarative React layer on top.
