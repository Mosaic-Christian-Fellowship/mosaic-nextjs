# Critique Reference

Post-build review protocol: an LLM-powered design-director review plus a persona pass, synthesized into a single ranked findings report.

## When to Use

After UI work is complete, before calling it done. Also useful for reviewing existing UI that feels "off" but you can't articulate why.

---

## Two-Pass Model

Run the design-director review and the persona pass **independently**, then synthesize into one report. They are complementary — one catches judgment failures, the other catches what a real visitor would trip over.

---

## Pass A — Design-Director Review (LLM Judgment)

### Usability Heuristics (Nielsen's 10)

Score each 0–4:

| # | Heuristic | 0 | 1 | 2 | 3 | 4 |
|---|-----------|---|---|---|---|---|
| H1 | **Visibility of system status** — users always know what the system is doing | No feedback anywhere | Sparse, inconsistent | Key states covered | Most states covered | All states, real-time |
| H2 | **Match between system and real world** — language and concepts users recognize | Jargon-heavy | Some jargon | Mixed | Mostly natural | Fully natural, familiar metaphors |
| H3 | **User control and freedom** — easy undo/back/cancel | No escape hatches | Rare or buried | Some paths have exits | Most have exits | All actions recoverable |
| H4 | **Consistency and standards** — same words/patterns for same things | Inconsistent throughout | Frequent breaks | Occasional breaks | Mostly consistent | Fully consistent within platform norms |
| H5 | **Error prevention** — design prevents mistakes before they happen | No guards | A few guards | Key paths guarded | Most paths guarded | Proactive confirmation, constraints |
| H6 | **Recognition over recall** — options visible, not memorized | All hidden | Mostly hidden | Partially visible | Mostly visible | Everything needed is visible |
| H7 | **Flexibility and efficiency** — shortcuts for experts, safe defaults for novices | No accommodation | Expert-only or novice-only | Basic split | Good split | Adaptive, learns or exposes shortcuts |
| H8 | **Aesthetic and minimalist design** — no irrelevant information | Cluttered | Noisy | Passable | Clean | Only what's necessary |
| H9 | **Help users recognize, diagnose, recover from errors** — plain-language errors with next steps | Generic/missing | Vague | Partial | Most errors useful | All errors: what/why/what next |
| H10 | **Help and documentation** — findable, task-focused help when needed | No help | Hard to find | Findable but thin | Good | Contextual, task-focused |

**Scoring:** flag any heuristic scoring ≤ 1 as P1 (serious); score 2 as P2 (refinement); score 3+ as passing. Include the score and one-line rationale per heuristic in the findings.

---

### Cognitive Load Checklist (Miller's Law, revised)

Working memory holds ~4 items well. Apply to UI:

- **Navigation:** ≤ 4 top-level items. More than 4 without grouping or progressive disclosure = P1.
- **Form groups:** ≤ 4 fields per visible group. Long forms must be chunked. Violation = P2.
- **Buttons per view:** 1 primary + 1–2 secondary at most. Multiple competing primaries = P1.
- **Dashboard metrics above the fold:** ≤ 4 key numbers. More without clear hierarchy = P2.
- **Modal/overlay content:** can the user parse the purpose in ≤ 3 seconds? If not = P2.

---

### Emotional Journey Read

Read the screen as a first-time user arriving with a clear goal. Ask:

1. **What does the page make me feel in the first 3 seconds?** Name the specific emotion — not "good UX" but "calm confidence" or "overwhelmed" or "skeptical."
2. **Does that emotion serve the product's intent?** (See `PRODUCT.md` brand personality if present.)
3. **Where does the journey break?** Identify the moment the emotional experience deteriorates — if it does.
4. **Mosaic-specific:** Would someone nervous about walking into a church for the first time feel welcomed or sold to? The goal is genuine welcome, never a pitch.

---

### Pass A Sub-Lenses (ported from the prior 4-lens model — all coverage preserved)

These map directly into Pass A and are always part of it:

#### Composition (all fidelities)

- Is there a clear focal point? Can you point to it instantly?
- Does whitespace create rhythm, or is it leftover space between elements?
- Are proportions intentional — does the hero deserve 60% of viewport, or is it just big?
- Does the layout guide the eye in a logical sequence (F-pattern for text-heavy, Z-pattern for landing pages)?
- Is the visual weight balanced?

#### Craft (mid-fi and above)

- Spacing follows the consistent grid (4px / 8px base or project-defined).
- Typography hierarchy is clear — heading, subheading, body, caption identifiable without reading.
- Depth (shadows, borders, background shifts) is consistent in intensity and direction.
- All interactive elements have hover, active, focus, and disabled states.
- Transitions: 150–300ms micro-interactions, 300–500ms layout changes.
- Border usage consistent across similar elements.

#### Accessibility (hi-fi; structural only at mid-fi)

Run through: contrast (4.5:1 body, 3:1 large text / UI components), focus-visible, keyboard nav, screen reader labels, `prefers-reduced-motion`, touch targets (44×44px min), semantic landmarks, form labels (not just placeholders), color not used as sole indicator.

Full rules: `references/accessibility.md`.

#### Content (hi-fi)

- Real or realistic data — no "Lorem ipsum" or "test@test.com" at production fidelity.
- Empty states: designed, not blank.
- Error states: specific and actionable ("Could not save. Check your connection and try again." — not "Something went wrong.").
- Loading states: skeleton screens over spinners when layout is predictable.
- Edge cases: very long names, zero results, single item vs. many, first-time vs. power user.
- Microcopy: specific verbs ("Save draft" not "Submit"), destructive actions with consequences ("Delete project — this cannot be undone").

---

## Pass B — Deterministic Detector

**Not included in this bundle.** The automated detector was tuned for a different design system, so it has been left out rather than shipped with misleading suppressions.

This makes Pass A and the persona pass the whole review. Compensate by checking the hard, measurable rules explicitly rather than trusting judgment alone:

- **Contrast** — every text/background pair against WCAG AA (4.5:1 body, 3:1 large text). `#6B7280` is the lightest permitted muted gray on white.
- **Tap targets** — interactive elements at least 44×44px.
- **Heading order** — no skipped levels; one `h1` per page.
- **Focus states** — every interactive element has a visible `:focus-visible` ring.
- **Reduced motion** — animation guarded by `prefers-reduced-motion`.

Report these as ordinary findings alongside Pass A's.

## Persona Testing

After gathering Pass A + B findings, evaluate the design against 5 archetypes. Each persona asks a distinct question that may surface issues the other passes missed.

| Persona | Who they are | Key question |
|---------|-------------|--------------|
| **Alex** (power user) | Has used the product daily for 6 months; wants speed and density | Are there shortcuts, density options, or keyboard paths? Does anything patronize or slow Alex down? |
| **Jordan** (first-timer) | Just arrived; no prior context; goal-oriented but unfamiliar with the product | Can Jordan orient within 5 seconds? Is the first action obvious? Is terminology self-explanatory? |
| **Sam** (accessibility-dependent) | Navigates keyboard-only; uses a screen reader; may have low vision | Does the tab order make sense? Are all interactive elements labeled? Are focus states visible? Does color alone convey anything critical? |
| **Riley** (deliberate stress tester) | Enters 500-character strings, submits empty forms, clicks everything twice, uses back/forward freely | Does anything break, leak state, or fail without a clear error message? Is every error recoverable? |
| **Casey** (distracted mobile user) | On iPhone, one-handed, bad connection, may be interrupted mid-task | Are touch targets reachable with one thumb? Does the page work at low bandwidth? Does partial completion survive a screen lock? |

For each persona, identify the highest-severity issue they would encounter. If a persona would hit a P0/P1 issue, flag it explicitly in the findings.

---

## Synthesis & Output Format

Merge the design-director findings and persona notes into one ranked report. Map severity as follows:

| New | Old (prior 4-lens model) | Meaning |
|-----|--------------------------|---------|
| **P0** | Critical (severe) | Broken or blocking — accessibility violations, broken layouts, missing required states. Fix before any review. |
| **P1** | Critical | Serious — heuristic score ≤ 1, cognitive overload, persona blocker. Should fix before ship. |
| **P2** | Refinement | Should fix — spacing inconsistency, typography hierarchy break, weak states. Fix before ship if time allows; required before production. |
| **P3** | Polish | Nice to have — micro-interaction timing, whitespace optimization, microcopy improvements. Address in a polish pass. |

**Report template:**

```
## Design Critique — [Component / Page / Feature]

**Date:** YYYY-MM-DD
**Fidelity:** [lo-fi / mid-fi / hi-fi]
**Passes run:** design-director | personas

### Heuristics Scorecard

| # | Heuristic | Score (0–4) | Note |
|---|-----------|-------------|------|
| H1 | Visibility of system status | N | … |
…

**Heuristics average:** N.N / 4

### Findings

| # | Sev | Source | Finding | Fix |
|---|-----|--------|---------|-----|
| 1 | P0 | accessibility | file.tsx:42 — description | … |
| 2 | P1 | Pass A / Jordan | First-time user has no orientation cue | … |
…

### Persona Notes

- **Alex** — [highest severity hit]
- **Jordan** — [highest severity hit]
- **Sam** — [highest severity hit]
- **Riley** — [highest severity hit]
- **Casey** — [highest severity hit]

### Summary

- P0 (broken/blocking): N
- P1 (serious): N
- P2 (refinement): N
- P3 (polish): N

**Ship-readiness:** [Ready / Fix P0s first / Fix P0s + P1s first]
```

---

## Snapshot Persistence

After each critique, persist the report to:

```
<repo>/.design-craft/critique/YYYY-MM-DD-<slug>.md
```

Create the directory if it doesn't exist. Add `.design-craft/` to `.gitignore` if not already there (snapshots are working artifacts, not committed history). This lets you track quality trends across sessions.

---

## The Screenshot Test

Would you show this in a portfolio? If you hesitate, investigate why. The hesitation usually points to the real issue — not a vague "it's not great" but a specific "the spacing feels off" or "the hierarchy is unclear." Name the hesitation and it becomes a finding.
