# Contributing to the Mosaic Website

Thanks for helping build Mosaic's website! This page is the short, practical guide
to making a change. If you've never written code before, that's okay — the workflow
below is designed so you describe what you want in plain English and let Claude do
the typing.

> **The friendly, picture-by-picture version of this guide lives in the
> Team Handbook (Google Doc).** This file is the quick reference for the same flow.

---

## The tools you'll use

| Tool | What it's for | Typing required? |
|------|---------------|------------------|
| **GitHub Desktop** | Save your work and submit it for review | No — it's all buttons |
| **Claude Code (desktop app)** | Explore ideas and make the actual changes | No — you just chat |
| **Your web browser** | See the site running on your computer | No |

No terminal/command line needed for everyday work.

---

## One-time setup

1. **Get onto GitHub, then install [GitHub Desktop](https://desktop.github.com/).** First, create a free account at [github.com/signup](https://github.com/signup) (if you don't have one), send the maintainer your username, and accept the email invite to the **Mosaic-Christian-Fellowship** organization. Then install GitHub Desktop and sign in with that account.
2. In GitHub Desktop: **File → Clone repository → mosaic-nextjs → Clone.** This downloads the project to your computer.
3. Install the **Claude Code desktop app** and open the `mosaic-nextjs` folder you just cloned.
4. Ask Claude: **"Please run the setup script."** It installs everything and creates your settings file.
5. Paste in the one value you were given (the Redis URL) when asked — or ask Claude to help you fill in `.env.local`.

That's it. You're ready.

---

## Making a change (the everyday loop)

1. **Start a fresh workspace.** In GitHub Desktop, click **Current Branch → New Branch** and name it after your idea (e.g. `new-events-section`). This keeps your experiment separate from the live site.
2. **Explore + change with Claude.** In the Claude Code app, just talk:
   - *"Start the site so I can see it."*
   - *"Change the homepage headline to say ___."*
   - *"Add a card for our youth retreat under Get Involved."*
   Claude makes the change and the site updates live in your browser.
3. **Review it yourself.** Look at <http://localhost:3000> until you're happy. Not right? Keep asking Claude to adjust.
4. **Save + submit.** Back in GitHub Desktop you'll see a list of what changed. Type a one-line summary, then **Commit → Push → Create Pull Request.**
5. **Signal when it's ready to publish.** While you're still tinkering, open it as a **draft** pull request — that tells the maintainer "don't publish yet." When it's ready to go live, click **Ready for review** and request the maintainer as reviewer — *that request is your "please publish" signal.* A preview link also appears on the Pull Request so the maintainer can check your exact change before publishing. They review, merge, and deploy.

**You never deploy to the live site yourself** — the maintainer does that after reviewing your Pull Request. Nothing you do locally can affect the real website until it's reviewed and merged. Experiment freely.

---

## Good habits

- **One idea per branch / Pull Request.** Easier to review, easier to undo.
- **Look at the changes before committing.** GitHub Desktop shows you exactly what changed — a built-in "check your own work" step.
- **Stuck? Ask.** Message the maintainer. Getting stuck is normal and expected — that's what the team is for.

---

## For the maintainer (technical notes)

- **Stack:** Next.js 16 (App Router) + React 19 + Tailwind v4 + Sanity v3 + ioredis. Package manager: **bun**.
- **Local dev:** `bun dev` → <http://localhost:3000>. Tests: `bun run test`. Lint: `bun run lint`.
- **Data model:** the frontend reads from `/api/*` → Redis. The PCO/YouTube/Spotify → Redis sync runs only via the Vercel cron (`/api/cron/sync`, every 2h) or the manual admin route. So contributors need only `mosaic_REDIS_URL` locally; the integration keys stay owner-side.
- **Secrets:** Vercel is the source of truth. `vercel env pull` to refresh a local `.env.local` (owner only — contributors are not on the Vercel team). See `.env.example` for the full list.
- **Deploys:** owner-run. `vercel deploy --prod` after merging an approved PR. Contributors never touch Vercel.
- **Account ownership:** migrating to church-owned accounts — see the Account Migration Tracker (Google Doc).
