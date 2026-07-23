---
name: save-note
description: Record a decision, gotcha, or piece of project context into the Mosaic repo so it survives into future sessions. Use when the user settles a question, discovers something surprising, or says "remember this."
---

# Save Note

Claude starts every session with no memory of the last one. Anything worth keeping has to be written into the repo.

This skill decides **where** it goes, so notes don't pile up in one place nobody reads.

## Where things go

| What it is | Where it belongs |
|---|---|
| A rule that should shape **every** future session (a convention, a "never do X here") | `CLAUDE.md` — loads automatically every time |
| Something learned while doing today's work (a decision, a gotcha, where you left off) | `docs/handoffs/YYYY-MM-DD.md` |
| A longer explanation of how one part of the site works | `docs/` as its own file, then link it from `CLAUDE.md` |
| Instructions for church staff (not developers) | `docs/onboarding/` |

**The important distinction:** `CLAUDE.md` is read automatically at the start of every session, so it must stay short and only hold things that are always true. Handoff notes are read on request, so they can be as long as they need to be.

## Steps

1. **Work out which of the four it is.** If it's a rule that would change how Claude behaves next time → `CLAUDE.md`. If it's "what happened today" → handoff. When genuinely torn, ask the user.

2. **Check whether it's already written down.** Search before adding:
   ```bash
   grep -ril "<a few keywords>" CLAUDE.md docs/
   ```
   If it exists, **update that spot** rather than adding a second copy. Two versions of a rule is worse than none — the next session won't know which one is current.

3. **Write it as a rule, not a story.** Lead with what to do, then why.

   Weak: *"We tried isomorphic-dompurify and it broke the build so we switched."*

   Strong: *"Use `sanitize-html` for cleaning HTML, never `isomorphic-dompurify` — it depends on jsdom, which breaks the Next.js 16 build."*

4. **Date anything that could go stale.** Account names, URLs, and versions change. `(as of 2026-07-22)` tells a future reader whether to trust it.

5. **Say where you put it.** One line: *"Added to `CLAUDE.md` under Conventions."*

## Keeping CLAUDE.md honest

`CLAUDE.md` is the one file that shapes every session, so stale content there is worse than stale content anywhere else — it actively misleads.

- When something is replaced, **don't just add the new value.** Remove or explicitly mark the old one.
- After anything moves (an account, a URL, a service), add a **Superseded references** row mapping old → new, so the old value can't be mistaken for current.
- If `CLAUDE.md` and a doc in `docs/` disagree, the more recently edited one usually wins — but say so out loud rather than picking silently.

## Anti-patterns

- Don't record things the code already says. "The Nav component is in `components/Nav.tsx`" is findable in two seconds; it doesn't need a note.
- Don't record one-off conversation details. "Dave preferred the blue button today" isn't a rule unless it's meant to apply going forward.
- Don't let `CLAUDE.md` grow without bound. If it's getting long, move the detail into `docs/` and leave a one-line pointer.
