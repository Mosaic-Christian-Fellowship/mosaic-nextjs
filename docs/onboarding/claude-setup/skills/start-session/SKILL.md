---
name: start-session
description: Show where things stand on the Mosaic website before starting work — current branch, uncommitted changes, open pull requests, and the last handoff note. Use at the beginning of every working session, or when the user asks "where did I leave off?"
---

# Start Session

A one-screen answer to "where did I leave off, and what should I do next?"

Run this at the start of every session. It takes a few seconds and prevents the most common mistake — starting new work on top of unfinished work.

## Steps

Run all four checks, then render one compact view. If a check fails, print `(unavailable)` for that section and keep going.

### 1 — Where am I?

```bash
git branch --show-current
git status --short
```

Capture: current branch name, and the count of changed files.

### 2 — Is my branch behind?

```bash
git fetch --quiet origin main
git log --oneline HEAD..origin/main | wc -l
```

Capture: how many commits `main` has that this branch doesn't.

### 3 — Open pull requests

```bash
gh pr list --state open --json number,title,isDraft,headRefName --limit 10
```

Capture: number, title, and whether each is a draft. Mark the one matching the current branch.

### 4 — Last handoff note

```bash
ls -1 docs/handoffs/*.md 2>/dev/null | sort | tail -1
```

Read its `## Summary` section (or the first non-empty line after the title if there's no Summary).

## Render

```
=== Mosaic — Start Session ===

📍 You are on: new-events-section  (3 files changed, not yet handed in)
   main has moved on 2 commits since you branched.

📬 Your open pull requests
   #24  Add youth retreat card        DRAFT  ← this branch
   #23  Fix events page on mobile     ready for review

📝 Last note — 2026-07-22
   Added the toolkit tab to the handbook. Next: seed hero content in Sanity.

→ Where to start: <one sentence>
```

## Choosing the closing pointer

Pick whichever signal is loudest, in this order:

1. **Uncommitted changes on a branch with an open PR** → "You have unfinished work on this branch — finish it or hand it in before starting something new."
2. **Uncommitted changes, no PR** → "You have work in progress here. Keep going, or hand it in."
3. **Clean tree, branch behind main** → "Clean slate. Start a fresh branch from the latest `main` before your next change."
4. **Clean tree, on `main`** → "Ready for something new — make a branch first."

## Explaining it to a non-technical user

Never print raw git output. Translate:

- "3 files changed" → "3 files changed, not yet handed in"
- "behind origin/main by 2" → "other people have published 2 changes since you started"
- "draft PR" → "marked *still working* — the maintainer won't publish it yet"

## Anti-patterns

- Don't list more than 10 open PRs — summarize the rest as a count.
- Don't dump the whole handoff note. One or two sentences. The user can open the file.
- Don't offer to fix anything yet. This skill reports; it doesn't act.
