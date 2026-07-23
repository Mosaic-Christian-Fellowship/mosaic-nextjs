# Claude Setup — Mosaic Website Team

Everything you need to get Claude working the way the rest of the team works. Written for volunteers who aren't developers.

**Start here:** open [`SETUP-PROMPT.md`](./SETUP-PROMPT.md), copy the prompt, paste it into Claude. It installs everything and checks its own work.

The rest of this file explains what's in the box, in case you're curious or something goes wrong.

## What's in here

```
claude-setup/
├── SETUP-PROMPT.md    ← paste this into Claude
├── README.md          ← you are here
└── skills/            ← 12 skills, copied into ~/.claude/skills/
```

## The skills

A "skill" is a set of instructions that teaches Claude how we do something on this project. Most load themselves when they're relevant — you don't have to remember them. The **Claude's toolkit** tab of the Team Handbook has the full plain-language guide.

### Making the site look right

| Skill | What it does |
|---|---|
| `design-craft` | Checks spacing, type, contrast, and whether a page reads as one finished thing. Also checks it's usable by people with low vision or keyboard navigation. |
| `responsive-craft` | Makes pages work at every screen size. Phone first, then wider. |
| `figma-to-code` | For copying a specific design exactly. Stops Claude improvising measurements. |
| `image-optimization` | Shrinks photos so pages load fast without looking worse. |

### Writing the words

| Skill | What it does |
|---|---|
| `humanizer` | Strips out the phrasing that makes writing sound machine-written. |
| `warm-voice` | Adds warmth back in, so it reads like a real person from Mosaic. |

Use them together — `humanizer` takes the bad out, `warm-voice` puts the good in.

### Keeping your work safe

| Skill | What it does |
|---|---|
| `scope-lock` | **The most important one.** Keeps a small change small. Stops "fix this heading" becoming a rewrite of forty files. |
| `project-hygiene` | Tidies stray files. Mostly the maintainer's tool. |
| `preflight-check` | Checks your computer is set up correctly. Run it on day one, or when something breaks for no clear reason. |

### Session habits

| Command | What it does |
|---|---|
| `/start-session` | Where you left off — your branch, unfinished work, open pull requests, last note. |
| `/wrap-up` | End-of-session check. Catches work you forgot to hand in, then writes a note for next time. |
| `/save-note` | Records a decision so future sessions know about it. |

These three are written specifically for this project — they read and write files inside this repository. They're not the same as similarly-named skills you may find elsewhere.

## Two plugins, installed separately

These don't ship as folders — Claude installs them from its plugin marketplace, and the setup prompt handles it:

- **`superpowers`** — planning, testing, and debugging discipline. Where "let's plan this out first" comes from.
- **`vercel`** — knowledge of Next.js 16, the framework this site is built on. Its rules changed recently enough that Claude gets them wrong without this.

## Manual install

Only if the setup prompt fails and the maintainer asks you to.

```bash
mkdir -p ~/.claude/skills
cp -R docs/onboarding/claude-setup/skills/* ~/.claude/skills/
```

Restart Claude. Test with `/start-session` — it should run and show your branch.

## What's deliberately not here

- **Deploy and publishing tools.** Volunteers never publish. The maintainer does, after reviewing your pull request.
- **API keys and integration secrets.** You need exactly one value locally — a read-only Redis URL from the maintainer. Everything else runs on the server.
- **The maintainer's personal setup.** Vault notes, sound notifications, account switchers, and other tooling specific to one person's machine — none of it would work for you and none of it is needed.

## If something goes wrong

1. Run `preflight-check` and read what it says.
2. Ask Claude directly: *"this isn't working, can you help me work out why?"*
3. Still stuck — screenshot it and message the maintainer. That's expected, not a bother.

Don't retry a failing install more than a couple of times. It rarely fixes itself and the maintainer can usually spot the problem instantly.
