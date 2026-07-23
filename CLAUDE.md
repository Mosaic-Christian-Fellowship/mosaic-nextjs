@AGENTS.md

# Mosaic Christian Fellowship — Website

The website for Mosaic Christian Fellowship in Northvale, NJ. Built and maintained by a small team of church volunteers, most of whom are not developers. Read this file before making any change.

> **This repository is public.** Never commit secrets, API keys, connection strings, or personal contact details. Configuration comes from environment variables only. If you think something sensitive was committed, stop and tell the maintainer.

## Who this site is for

Four kinds of visitors, all asking the same underlying question — *"is there a place for me here?"*

1. **Church-shoppers** — recently moved to northern NJ, looking for a church home
2. **Young families** — need to know there's programming for their kids
3. **College students** — home from school, looking for a peer community
4. **Seekers, doubters, and people burned by a previous church** — the hardest and most important audience

The church's name is the idea: broken pieces from different lives forming something beautiful together. The site should feel warm and genuine, never slick or salesy. Mosaic's actual differentiators are discipleship, real community, and academically-grounded teaching — not event production.

**Mission:** Reach, Embrace, Disciple
**Services:** 9:30 AM · 11:30 AM (livestreamed) · 1:30 PM. Children's and education ministries run at 9:30 and 11:30 only.

## How the site is built

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Sanity v3 · Redis · deployed on Vercel
**Package manager:** `bun`. Tests: `bun run test` (Vitest).
**Live site:** https://mosaic-nextjs-zeta.vercel.app

Data flows one direction:

> Planning Center, YouTube, and Spotify → *(daily scheduled job)* → **Redis** → the site reads Redis through its own `/api/*` routes.

**Sanity** is separate. It holds text and images that church staff edit themselves (currently the homepage hero). Every Sanity field is optional and falls back to a hardcoded value, so an empty dataset renders the site unchanged. Never make a Sanity field required.

**You do not need any integration keys to work on this site.** The sync job is the only thing that talks to Planning Center, YouTube, or Spotify, and it only runs on the server. Locally you need one value — a read-only Redis URL — which the maintainer gives you. See `CONTRIBUTING.md`.

## How we work

- **Volunteers work on GitHub only.** Make a branch, change things locally, open a pull request. **The maintainer publishes.** Nobody else deploys, ever.
- **Branch per idea**, named `feat/<short-topic>` — for example `feat/youth-retreat-card`.
- **A batch of small fixes is one branch, one pull request**, with a commit per fix. Not five separate pull requests — that's five times the review work for the maintainer.
- **Draft pull request** = "still working, don't publish." **Ready for review + maintainer requested** = "ready to publish." That request is the deploy signal.
- `main` is protected. It takes a pull request and one approval.
- Every pull request gets a preview link a minute or two after you push. Use it to check your change before asking for review.

## Conventions

These are hard-won. Each one cost somebody a bad afternoon.

- **Cleaning HTML: use `sanitize-html`.** Never `isomorphic-dompurify` — it pulls in jsdom, which breaks the Next.js 16 build.
- **Global components are single source of truth.** `Nav`, `Footer`, `CTASection` and friends appear on every page. Changing one changes the whole site — that's intended. Never fork a copy for one page; if a page needs something different, add a prop.
- **Tailwind arbitrary values need literal hex.** `bg-[#1E2024]` works; `bg-[--color-ink]` does **not** — CSS custom properties don't resolve inside Tailwind v4's arbitrary-value syntax.
- **Headlines get `text-wrap: balance`.** No headline should end with a single word alone on the last line.
- **Missing images use `PlaceholderImage`** — a neutral gray "photo coming" block. The old hot-pink `#FF69B4` placeholder convention is **retired**; if you find one, it's a bug.
- **Mobile first.** Build for phones, then widen. Most visitors arrive on a phone.
- **Don't propose Framer.** The site was built in Framer once and moved off it in April 2026. The old Framer prototype is a visual reference only — never a build target.

### Visual language

Poppins for text · `#0066FF` and `#0041A2` blues · `#1E2024` for dark ink · `#6B7280` for muted text.

Contrast matters more than preference here — muted grays lighter than `#6B7280` fail accessibility contrast against white and have been fixed once already. Don't reintroduce them.

## What's still unfinished

Real photography, staff headshots, and the About page's founding story are all still placeholder. Giving is not yet wired to Church Center. If you hit a gray placeholder block or a disabled button, that's known and waiting on the church — not something to work around.

## Where to look

| Doc | What's in it |
|---|---|
| `CONTRIBUTING.md` | Getting the site running on your computer |
| `docs/onboarding/team-handbook.md` | The volunteer guide — start here if you're new |
| `docs/onboarding/claude-setup/` | Claude skills bundle + setup instructions |
| `docs/handoffs/` | Session notes — what happened, and what's next |
| `docs/audits/` | Design and accessibility reviews |
| `docs/superpowers/` | Specs and plans for larger features |

## Working with Claude on this project

- **Keep changes scoped.** When asked for one specific change, make exactly that change. Don't audit neighbouring files or improve things nobody asked about — it makes review harder and undo riskier.
- **Verify in the browser before claiming success.** Screenshot it. A change that updates a label instead of the actual element looks identical in a summary and wrong on screen.
- **Plan anything larger than a sitting** before writing code. Write the plan down, get it approved, then build.
- **Never run destructive git commands** — no `reset --hard`, no `clean -fd`, no force-push. If the repository looks tangled, stop and ask the maintainer.
- **Never deploy.** Not `vercel deploy`, not `vercel --prod`. Publishing is the maintainer's job.
