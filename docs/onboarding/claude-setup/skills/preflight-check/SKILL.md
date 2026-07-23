---
name: preflight-check
description: Run a full environment preflight check — git, GitHub CLI, Vercel, shell paths, MCP tools. Auto-fix what's possible, flag what needs manual intervention.
user_invocable: true
---

# Environment Preflight Check

Run all checks below, report results in a table, attempt auto-fixes for failures, and save the report.

## Checks

### 1. Git Identity
```bash
git config user.name
git config user.email
```
- Verify both are set and non-empty
- If missing: ask the user for their name and the email on their GitHub account, then set `git config --global user.name "..."` and `git config --global user.email "..."`

### 2. GitHub CLI Auth
```bash
gh auth status
```
- Verify authenticated and shows correct account
- If failing: flag that user needs to run `gh auth login` manually (interactive — can't be automated)

### 3. Vercel CLI
```bash
vercel whoami
```
- Verify logged in and shows correct account/scope
- If failing: flag that user needs to run `vercel login` manually

### 4. Shell Path Expansion
```bash
echo "$HOME"
ls "$HOME/.claude/settings.json"
ls ~/Code/claude/
```
- Verify `~` and `$HOME` resolve correctly
- Verify key paths exist

### 5. MCP Tool Connectivity
- List all available MCP tools
- Specifically check for:
  - **Craft** tools (mcp__craft__*) — try `mcp__craft__connection_info` if available
  - **Figma** tools (mcp__figma__*) — try `mcp__figma__whoami` if available
- For any MCP server that's not responding: note it as failed, do NOT debug — just flag it

### 6. Linear CLI
```bash
$HOME/.cargo/bin/linear-cli --version
$HOME/.cargo/bin/linear-cli teams list
```
- Verify binary exists and auth works
- If auth fails: have the user re-run `gh auth login` and pick GitHub.com → HTTPS → browser

### 7. Node/Bun Runtime
```bash
node --version
bun --version
```
- Verify both are available on PATH

## Output Format

Print a status table:

```
## Preflight Results — YYYY-MM-DD HH:MM

| Check | Status | Details |
|-------|--------|---------|
| Git identity | PASS/FAIL | user.name, user.email |
| GitHub CLI | PASS/FAIL | account name |
| Vercel CLI | PASS/FAIL | account/scope |
| Shell paths | PASS/FAIL | ~ and $HOME resolution |
| MCP: Craft | PASS/FAIL | connected/not available |
| MCP: Figma | PASS/FAIL | connected/not available |
| Linear CLI | PASS/FAIL | version, auth status |
| Node | PASS/FAIL | version |
| Bun | PASS/FAIL | version |
```

## After Checks

1. Save the full report to `./preflight-status.md` in the current working directory
2. If all checks pass: announce "Preflight complete — all systems go" and proceed
3. If any checks fail:
   - List exactly what failed and what the user needs to do
   - Ask: "Acknowledge these gaps to proceed, or fix them first?"
   - Do NOT proceed with other work until user acknowledges

## Important

- Run checks quickly — don't over-investigate failures
- Auto-fix only safe, non-destructive things (like setting git config)
- Never store or display credentials/tokens in the report
- MCP failures are common — just note them, don't debug
