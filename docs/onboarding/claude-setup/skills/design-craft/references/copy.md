# Copy Reference — UI Microcopy and Voice

Writing guidance for labels, CTAs, empty states, errors, and in-product copy. Derived from the design-craft detector's copy rules and the Mosaic voice principles below.

---

## Scope

This file covers **UI microcopy** — the words inside the product: button labels, field placeholders, empty state messages, error text, confirmation dialogs, tooltips, nav items.

For long-form documents, memos, and external-facing copy, use the `warm-voice` or `humanizer` skills instead. For brand-register marketing headlines, the rules here still apply but with more latitude for personality.

---

## Anti-Tells (Detector Rules)

Each pattern below is flagged by the `design-craft` detector. Every entry includes the failure mode and a fix.

### Marketing Buzzwords in UI Copy

Words that sound important but say nothing. They pad labels and obscure what the feature actually does.

**Flagged words:** streamline, empower, supercharge, world-class, enterprise-grade, next-generation, cutting-edge, seamless, leverage, robust, holistic, synergy, actionable insights, unlock, revolutionize, game-changer.

| Instead of... | Write... |
|---------------|----------|
| "Streamline your workflow" | "Do it in one step" |
| "Empower your team" | "Give your team access" |
| "Seamless integration" | "Connects in 2 minutes" |
| "Leverage your data" | "Use your data to..." |
| "Enterprise-grade security" | "SOC 2 Type II certified" |

**Rule:** Name the concrete thing. If you can't say what "streamline" means in this specific context, the copy isn't ready.

### Em-Dash Overuse

Em dashes are a strong rhetorical tool — used more than twice in body copy, they stop being structural and start being a tic.

- **Threshold:** More than 2 em dashes in a single block of body copy triggers the `em-dash-overuse` rule.
- **Fix:** Vary punctuation. Replace em dashes with commas, colons, periods, or parentheses. Each has a different rhythm — use the one that matches the sentence.

```
Before: "Our tool handles setup—configuration—and deployment—all in one place."
After:  "Our tool handles setup, configuration, and deployment — all in one place."
```

### Aphoristic Manufactured-Contrast Cadence

The "Not a feature. A platform." construction sounds bold the first time. Used three or more times in a screen or page, it becomes a pattern the reader stops processing.

**Flagged pattern:** Short declarative sentence. Negation or inversion. Repetition ≥3 times.

```
❌ "Not software. A system."
   "Not a chatbot. A teammate."
   "Not a tool. A transformation."

✓  "It's a system, not just software — built to scale with your team."
```

**Rule:** Use this cadence at most once per screen. Make it earn its place.

### Theater Framing

Copy that frames a routine action as a grand moment. Overconfident confirmation messages, performative loading text, mission-statement tooltips.

```
❌ "Preparing your journey..."  (for a page load)
   "You're all set to conquer your goals!"  (for a form submit)
   "The future of your business starts here."  (for a settings save)

✓  "Loading your dashboard"
   "Profile saved"
   "Settings updated"
```

---

## Constructive Rules

### Labels: Verb + Noun

Buttons describe what happens when you click them, not a vague invitation.

| Avoid | Use |
|-------|-----|
| Submit | Save changes |
| OK | Got it |
| Cancel | Keep editing |
| Confirm | Delete account |
| Upload | Add photo |
| Process | Send invoice |

**Destructive actions** should name the thing being destroyed: "Delete project", not "Delete". The specificity makes users pause.

### Consistency Within a Product

Same action, same label. Everywhere.

- Don't mix "Remove" and "Delete" for the same operation.
- Don't mix "Save" and "Update" in parallel flows.
- Don't mix "Cancel" (abandons action) and "Close" (dismisses overlay) — they're different.

### Error Messages: What + Why + How

Three parts, in order:

1. **What happened.** "We couldn't send your message."
2. **Why (if you know it).** "Your session timed out."
3. **What to do.** "Refresh the page and try again, or contact support if it keeps happening."

Never: "Something went wrong." That's a failure of the copy, not just the feature.

### Empty States: Education + Action

An empty state is not a void — it's a first-time user's first impression of a feature.

- Tell them what goes here.
- Tell them how to get started.
- Give them one clear action.

```
❌ [blank list with no text]

✓  "No invoices yet
    Your sent invoices will appear here.
    [Create invoice]"
```

### Placeholders Are Not Labels

Placeholder text disappears when the user types, leaving them with no context. Always pair a field with a visible label above it. Placeholder text can provide an example value, not the field's purpose.

```
❌ <input placeholder="Email address">

✓  <label>Email address</label>
   <input placeholder="you@example.com">
```

---

## Mosaic Voice

Copy for the Mosaic church site is written for someone who may be **nervous about walking in**.

- **Warm, never performative.** The church's differentiator is genuine welcome. Copy that sounds staged undercuts the whole thing.
- **No pressure, ever.** No urgency, no guilt, no "don't miss out." A visitor deciding slowly is a good outcome.
- **Name the hard things plainly.** Doubt, church hurt, not knowing what to wear, not knowing anyone. Saying them out loud is what makes a nervous person feel seen.
- **Plain words over church words.** Assume no prior church background. If a term needs explaining, explain it or drop it.
- **Specific beats inspirational.** "Kids' programming runs at 9:30 and 11:30" helps more than "we love families."

**Voice calibration by context:**

| Context | Tone |
|---------|------|
| Hero / first impression | Warm, direct — say who this is for |
| Planning a visit | Practical, reassuring — parking, timing, what to expect |
| FAQs | Honest, unhurried — answer the anxious question actually being asked |
| Forms | Light, low-commitment — make it clear nothing happens to them afterward |
| Giving | Matter-of-fact, no pressure |

Conversational, but not jokey. Approachable without being careless — this is a church, and some readers are arriving at a hard moment.
