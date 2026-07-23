---
name: wrap-up
description: End-of-session check for the Mosaic website — surfaces uncommitted changes, unpushed branches, and work that was never handed in as a pull request, then writes a short handoff note. Use before closing Claude, or when the user says they're done for the day.
---

# Wrap Up

The safety net at the end of a session. Almost every "wait, where did my work go?" moment is a session that ended without this.

Run through the checks in order. Fix what you can, ask about what you can't, then write the note.

## 1 — Uncommitted changes

```bash
git status --short
```

If anything is listed, the user has work that exists **only on their computer**. It is not backed up and the maintainer cannot see it.

Show them what changed in plain language ("you changed the events page and added one image"), then ask:

> "Do you want to hand this in, or leave it in progress for next time?"

- **Hand in** → stage, commit with a short plain-English message, push, and continue to step 2.
- **Leave it** → that's fine, but say clearly: *"This stays on your computer only. It's safe, but nobody else can see it and it isn't backed up."*

Never commit without asking. Never use `git checkout .`, `git reset --hard`, or `git clean` — those throw away work permanently.

## 2 — Unpushed commits

```bash
git log --oneline @{u}.. 2>/dev/null || echo "no upstream"
```

If there are commits that aren't pushed — or no upstream at all — the branch exists only locally. Offer to push:

```bash
git push -u origin "$(git branch --show-current)"
```

Explain it as: *"This copies your work up to GitHub so it's backed up and the maintainer can see it."*

## 3 — Pushed but never handed in

This is the trap that matters most. A branch can be fully pushed and still invisible to the maintainer because no pull request was ever opened.

```bash
BRANCH=$(git branch --show-current)
gh pr list --head "$BRANCH" --state all --json number,state,isDraft
```

- **No PR at all** → offer to create one. Ask whether they're still tinkering (draft) or ready for the maintainer to publish (ready for review).
- **Draft PR** → remind them a draft means *"don't publish yet."* Ask whether it should be marked ready.
- **Open, ready** → confirm the maintainer is requested as a reviewer. That request is the signal to publish.

## 4 — Other branches left behind

```bash
git branch --format='%(refname:short)' | grep -v "^main$"
```

For each, check whether it has a PR. List any that don't as *"work from earlier that was never handed in"* — don't act on them, just surface them so the user can decide.

## 5 — Write the handoff note

Always write this, even for a short session. It's what makes the next session easy.

Path: `docs/handoffs/YYYY-MM-DD.md`. Append a new session block if the file exists.

```markdown
# Handoff — YYYY-MM-DD

## Summary
[1–3 sentences: what changed and why]

## What's done
- [Finished and handed in — include PR number]

## What's in progress
- [Started but not finished, and where it stands]

## Next steps
1. [The exact first thing to do next time]

## Open questions
- [Anything waiting on the maintainer or the church]
```

Keep it plain. This is a note to a person, not a changelog.

## 6 — Final summary

Close with a short recap:

```
✅ Wrapped up

Handed in:     PR #24 — "Added youth retreat card" (ready for review)
Still local:   nothing
Note saved:    docs/handoffs/2026-07-22.md

Next time:     Add the second event card and check it on mobile.
```

If anything is still only on their computer, say so explicitly. That's the whole point of this skill.

## Anti-patterns

- **Never** run destructive git commands. Not `reset --hard`, not `clean -fd`, not `checkout .`, not force-push. If the tree seems tangled, stop and tell the user to message the maintainer.
- Don't deploy or publish. Volunteers never deploy — the maintainer does, after reviewing the pull request.
- Don't skip the handoff note because "nothing much happened." The note is cheapest when the session was small.
