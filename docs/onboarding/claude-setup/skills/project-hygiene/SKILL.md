---
name: project-hygiene
description: Audit and enforce project file organization — archive stale docs, clean junk files, verify gitignore, and maintain a tidy codebase. Run periodically or before major milestones.
user_invocable: true
---

# Project Hygiene

Audit the current project's file organization and fix issues. Run this periodically (after feature sprints, before demos, or when the repo feels cluttered).

## Workspace Mode

If run from a workspace root (a directory containing multiple project subdirectories), iterate over all project subdirectories and run a lightweight sweep on each:

1. **For each subdirectory that contains a `package.json` or `.git/`:**
   - `git status` — flag uncommitted changes
   - `git branch -a` — flag stale/merged branches
   - `git stash list` — flag forgotten stashes
   - Check for untracked junk (`.DS_Store`, `.playwright-mcp/`, `*.log`)
2. **Report a summary table:**
   ```
   | Project              | Uncommitted | Stale Branches | Junk Files |
   |----------------------|-------------|----------------|------------|
   | biz-doc-center-p2    | clean       | none           | none       |
   | example-project      | 2 files     | feat/old-exp   | .DS_Store  |
   | Homepage2026         | clean       | none           | 3 logs     |
   ```
3. **Then ask:** "Run full hygiene on any of these?"

Do NOT run the full 8-point audit on every project automatically — that's too slow. The workspace sweep is a quick triage; the full audit runs only on the projects Dave selects.

### Parallelization

When running the full audit across multiple projects, use **direct parallel Bash calls from the main session** — do NOT dispatch background agents. Background agents get stuck on Bash permission prompts and can't complete git/build operations. Instead, batch independent `git` and `find` commands as parallel Bash tool calls in a single message.

## Audit Checklist

### 1. Stale Plan Documents
- Scan `docs/plans/` for implementation plans where all tasks are complete
- Cross-reference with git log — if every task in the plan has a corresponding commit, the plan is stale
- **Action**: Move to `docs/plans/archive/`. Keep design docs (vision, decisions) in place — only archive implementation recipes
- **Rule**: Design docs (design vision, architecture decisions) stay. Implementation plans (step-by-step task lists) get archived once done

### 2. Untracked Junk Files
- Run `git status` and check for untracked directories/files that shouldn't be committed
- Common culprits: `.playwright-mcp/`, `*.log`, `.DS_Store`, temp files, IDE configs
- **Action**: Add to `.gitignore` if missing. Delete if truly junk

### 3. Uncommitted Changes
- Check for modified files that should have been committed (narration tweaks, config changes, etc.)
- **Action**: Commit with descriptive message or discard if unintentional

### 4. Empty Directories
- Scan for empty directories left behind by worktrees, deleted files, or failed operations
- **Action**: Remove (`rmdir`) unless they serve as placeholders (e.g., `archive/`)

### 5. Oversized Components
- Check if any single component file exceeds 500 lines
- If so, flag it as a refactoring candidate with suggested extraction points
- **Action**: Report only — don't refactor unless explicitly asked

### 6. Duplicate Content
- Check for content duplicated between:
  - `docs/plans/` and project `memory/MEMORY.md`
  - Multiple plan docs covering the same feature
  - `.md` files with identical `.pdf` exports (verify they're in sync)
- **Action**: Flag duplicates. Recommend single source of truth

### 7. Git Branch Cleanup
- List branches with `git branch -a`
- Flag branches that have been merged to main or have no new commits vs main
- **Action**: Report stale branches. Delete only if explicitly approved

### 8. Build Verification
- Run `npm run build` (or project-appropriate build command)
- Verify no errors introduced by cleanup
- **Action**: Fix any issues before committing cleanup changes

## Organization Rules

These are the canonical rules for Dave's project structure:

```
project-root/
├── docs/
│   ├── PROTOTYPE-GUIDE.md       # Stakeholder-facing guide (always current)
│   ├── PROTOTYPE-GUIDE.pdf      # Auto-generated from .md
│   ├── plans/                   # Active design docs only
│   │   ├── YYYY-MM-DD-feature-design.md    # Design vision, decisions
│   │   └── archive/             # Completed implementation plans
│   └── research/                # UXR findings, screenshots, sources
│       ├── consolidated-findings.md
│       ├── sources.md
│       └── screenshots/
├── src/
│   ├── components/              # React components (one per file, <500 lines ideal)
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand store(s)
│   ├── types/                   # TypeScript interfaces
│   └── data/                    # Mock data, demo scenarios, seed data
├── api/                         # Serverless functions (Vercel)
├── public/                      # Static assets (favicon, gate.js)
└── [config files]               # package.json, tsconfig, vite.config, etc.
```

### Naming conventions
- **Plan docs**: `YYYY-MM-DD-feature-name-{design|implementation}.md`
- **Components**: PascalCase, one component per file
- **Hooks**: `use` prefix, camelCase
- **Types**: Centralized in `src/types/index.ts`
- **Data files**: camelCase, descriptive (`mockData.ts`, `demoScenes.ts`)

### What stays vs. what gets archived
| Keep in `docs/plans/` | Archive to `docs/plans/archive/` |
|---|---|
| Design docs (vision, decisions, architecture) | Implementation plans (task lists, code recipes) |
| Active/in-progress plans | Fully completed plans (all tasks done) |
| Sharing/security design decisions | Step-by-step build instructions |

### What goes in `.gitignore`
```
node_modules/
dist/
.env*
.vercel/
.playwright-mcp/
.DS_Store
*.log
```

## Output

After running the audit, report:

```markdown
# Project Hygiene Report — [date]

## Changes Made
- [x] Archived N stale plan docs to docs/plans/archive/
- [x] Added X entries to .gitignore
- [x] Committed N uncommitted files
- [x] Removed N empty directories
- [x] Deleted stale branch: feat/old-branch

## Flagged for Review
- [ ] DocumentDetail.tsx is 845 lines (refactor candidate)
- [ ] Branch feat/folder-navigation is merged but not deleted

## Build Status
✅ Clean build (no errors)
```

Commit all cleanup changes in a single `chore:` commit.
