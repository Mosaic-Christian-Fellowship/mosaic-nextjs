# Accessibility Reference — WCAG 2.1 AA

Actionable rules for WCAG 2.1 AA compliance. Use this as enforcement criteria when auditing or building UI components.

---

## Contrast

- **Normal text** (under 18px, or under 14px bold): minimum **4.5:1** contrast ratio against background.
- **Large text** (18px+ regular, or 14px+ bold): minimum **3:1** contrast ratio.
- **UI components and graphical objects** (borders, icons, form controls): minimum **3:1** against adjacent colors.
- **How to check**: Browser DevTools accessibility panel (Chrome > Inspect > Elements > color swatch), `contrast-ratio` npm package, or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
- **Common failures**:
  - Light gray text (`#999`) on white background (ratio ~2.8:1 — fails).
  - Placeholder text that fails contrast — placeholders are not a substitute for labels, but if visible they still need 4.5:1.
  - Disabled states: the element itself is exempt from 1.4.3, but if a disabled control is adjacent to enabled content, the boundary between them should maintain 3:1 so users can perceive the control exists.

---

## Touch Targets

- **Minimum size**: 44x44px (WCAG 2.5.8 Target Size). The clickable/tappable area, not necessarily the visual element.
- **Recommended for mobile-primary**: 48x48px (aligns with Material Design and Apple HIG).
- **Visual element can be smaller** — use `padding` to extend the interactive area to meet minimums. Example: a 24px icon button with 12px padding on each side = 48px tap target.
- **Spacing between adjacent targets**: at least **8px** gap to prevent mis-taps.
- **Common failures**:
  - Icon-only buttons rendered at 16-24px with no padding.
  - Inline text links on mobile with no extra tap area.
  - Close buttons (X) in corners with insufficient target size.
  - Adjacent action buttons in toolbars touching edge-to-edge.

---

## Focus

- **Visible focus indicator on ALL interactive elements** — never apply `outline: none` or `outline: 0` without providing a visible replacement (e.g., box-shadow, border, background change).
- **Focus indicator contrast**: the focus style must have at least **3:1** contrast against the adjacent background color. A 2px solid outline in a high-contrast color is the safest pattern.
- **Use `focus-visible`** instead of `focus` to avoid showing focus rings on mouse clicks while preserving them for keyboard users:
  ```css
  :focus-visible {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }
  ```
- **Tab order must match visual layout** — avoid `tabindex` values greater than 0. Use `tabindex="0"` to make non-interactive elements focusable only when necessary. Use `tabindex="-1"` for programmatic focus (e.g., error messages, modals).
- **No focus traps** — users must be able to tab in and out of any component. Exception: **modal dialogs** must trap focus while open, with an explicit escape mechanism (Escape key and/or visible close button).
- **Skip link**: the first focusable element on the page should be a "Skip to main content" link targeting `<main>`. Visually hidden until focused:
  ```css
  .skip-link {
    position: absolute;
    left: -9999px;
  }
  .skip-link:focus {
    left: 0;
    top: 0;
    z-index: 9999;
  }
  ```

---

## Keyboard Navigation

- **All functionality must be operable via keyboard alone** — no mouse-only interactions.
- **Standard key bindings** (do not invent custom ones):
  - **Tab / Shift+Tab**: move between focusable elements.
  - **Enter / Space**: activate buttons and links.
  - **Arrow keys**: navigate within grouped controls (tabs, radio groups, menus, listboxes, carousels).
  - **Escape**: dismiss overlays, dropdowns, modals, tooltips.
  - **Home / End**: jump to first/last item in a list or menu.
  - **Page Up / Page Down**: scroll by viewport in long lists.
- **No keyboard shortcuts that conflict with screen reader commands** — screen readers use many key combinations. Custom shortcuts must be user-configurable or use modifier keys (Ctrl/Cmd + key).
- **Roving tabindex pattern** for composite widgets: only one item in a group is in the tab order (`tabindex="0"`), arrow keys move focus within the group, and the rest have `tabindex="-1"`.

---

## Landmarks

- **Use semantic HTML elements** as landmarks — they provide built-in ARIA roles:
  - `<header>` (role: banner — only when top-level, not nested in `<article>` or `<section>`)
  - `<nav>` (role: navigation)
  - `<main>` (role: main)
  - `<aside>` (role: complementary)
  - `<footer>` (role: contentinfo — only when top-level)
  - `<section>` with `aria-label` or `aria-labelledby` (role: region)
- **One `<main>` per page** — never multiple.
- **Label landmarks when multiples exist**: if the page has two `<nav>` elements, differentiate them:
  ```html
  <nav aria-label="Primary">...</nav>
  <nav aria-label="Footer">...</nav>
  ```
- **Use `<section>` with a label** for distinct content regions that don't fit other landmarks. Without a label, `<section>` has no landmark role.
- **Do not use ARIA roles when semantic HTML suffices** — `<nav>` is always better than `<div role="navigation">`.

---

## Motion

- **Respect `prefers-reduced-motion`** — wrap all animations and transitions:
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
- **No auto-playing content** that cannot be paused, stopped, or hidden. This includes carousels, video, and animated banners.
- **Avoid parallax scrolling** — it causes motion sickness for vestibular disorder users. If used, provide an alternative view or honor `prefers-reduced-motion`.
- **Flashing content**: never exceed **3 flashes per second**. This is a hard WCAG requirement (2.3.1) to prevent seizures. When in doubt, do not flash.
- **Transitions should be purposeful** — use them to communicate state changes, not as decoration. Crossfades and opacity transitions are the safest fallback when reducing motion.

---

## Color Independence

- **Never use color as the sole indicator** of state, meaning, category, or required action.
- **Pair color with at least one additional cue**:
  - Icons (checkmark for success, X for error)
  - Text labels ("Required", "Error", "Active")
  - Patterns or textures (in charts/graphs)
  - Underlines (links should be underlined or otherwise distinguishable from surrounding text)
  - Border styles (solid vs dashed)
- **Grayscale test**: view the interface in grayscale mode — all information, states, and actions should still be fully conveyed.
- **Common failures**:
  - Red/green status indicators (online/offline, pass/fail) without accompanying icons or text.
  - Form validation that only changes the input border to red — add an error icon and error text.
  - Chart/graph legends relying solely on color — add patterns, labels, or distinct shapes.
  - Links within body text that are only distinguished by color (no underline or other visual cue).

---

## Screen Reader

- **Image `alt` text**: describe the **function or meaning**, not the visual appearance.
  - Informative: `alt="Bar chart showing Q3 revenue up 12%"`
  - Actionable: `alt="Submit form"` (not `alt="green button"`)
  - Decorative: `alt=""` (empty string — not omitted entirely, which causes screen readers to read the file name)
- **`aria-label`**: use only when semantic HTML cannot convey the purpose. Prefer visible text or `aria-labelledby` referencing existing text.
- **Live regions for dynamic content**:
  - `aria-live="polite"` — for non-urgent updates (toast notifications, form validation messages, search result counts). Announced after the current speech finishes.
  - `aria-live="assertive"` — only for critical, time-sensitive alerts (session timeout, data loss warning). Interrupts current speech.
- **Hidden text for screen readers only** — use an `sr-only` class (visually hidden, still in the accessibility tree):
  ```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  ```
- **Never apply `aria-hidden="true"` to focusable elements** — this creates a disconnect where keyboard users can reach something screen readers cannot see.
- **Form inputs must have labels** — every `<input>`, `<select>`, and `<textarea>` needs an associated `<label>` (via `for`/`id` pairing) or `aria-label`. Placeholder text is not a label.
- **Error messages must be programmatically associated** with their fields using `aria-describedby`:
  ```html
  <input id="email" aria-describedby="email-error" />
  <span id="email-error" role="alert">Please enter a valid email</span>
  ```

---

## Quick Audit Checklist

Run through these 10 checks to catch the most common accessibility issues:

1. **Tab through the entire page** — can you reach and operate every interactive element (links, buttons, form fields, menus) using only the keyboard?
2. **Check contrast on all text** — does body text meet 4.5:1 and large text meet 3:1? Check headings, body, captions, and placeholder text.
3. **Try with a screen reader** (VoiceOver on macOS: Cmd+F5) — does the reading order make sense? Are all controls announced with their roles and states?
4. **Resize to 200% zoom** — does content reflow into a single column without horizontal scrolling? Is anything clipped or overlapping?
5. **Check all images** — do informative images have descriptive `alt` text? Are decorative images marked with `alt=""`?
6. **Verify color independence** — is color ever the sole indicator of state or meaning? Apply a grayscale filter to confirm.
7. **Test with `prefers-reduced-motion`** — enable "Reduce motion" in OS settings. Do all animations stop or switch to crossfade?
8. **Check touch targets on mobile** — are all tappable elements at least 44x44px? Is there at least 8px between adjacent targets?
9. **Verify form labels** — does every input have a visible `<label>` (not just a placeholder)? Are required fields indicated with more than just color?
10. **Test error messages** — are they associated with their fields via `aria-describedby`? Are they announced by screen readers when they appear?
