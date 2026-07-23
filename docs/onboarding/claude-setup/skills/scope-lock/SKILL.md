---
name: scope-lock
description: Lock scope for surgical edits. Prevents Claude from expanding a small change request into a broader audit or refactor.
---

# Scope Lock

When invoked, this constrains the current task to ONLY the specific change requested.

## Rules (non-negotiable)

1. Make **ONLY** the change described in the user's message
2. Do **NOT** audit surrounding code for similar patterns
3. Do **NOT** refactor, clean up, or "improve" adjacent code
4. Do **NOT** modify any files beyond what's strictly necessary
5. Do **NOT** add comments, types, or documentation to unchanged code
6. If you notice something else that could be improved, mention it AFTER completing the scoped change — do not act on it

## When to use

- Font size changes, color tweaks, text updates
- Single-line fixes or value changes
- Any request that starts with "just change", "only update", "quick fix"
- Any time Dave explicitly says "make ONLY this change"

## Completion

After the scoped change:
1. Show the diff (just the changed lines)
2. Verify build passes
3. Done — do not volunteer additional work
