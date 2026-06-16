@@@TAB:How it all works@@@

# Welcome to the Mosaic Website Team

First off — **thank you.** You're giving your time to help build something for the church, and that matters. This guide explains how the website works in plain language. You do **not** need to know how to code. You'll describe what you want, and a helper called Claude does the building.

> **Before you start — please read this.** We're in the middle of moving the website onto Mosaic's **own church accounts.** Your access, your step-by-step setup, and the one secret value you'll need **will be sent to you once that move is finished.** Until then, feel free to read this handbook to get familiar — but please **hold off on the setup steps** until the maintainer gives you the green light. Thanks for your patience!

Read this tab once to get your bearings, then move to the **"First-time setup"** tab when you've been given the go-ahead.

## The big picture

Think of the website like a building the whole team can work on:

- There's the **real, public building** that visitors see (the live website).
- And there's **your own private copy** that lives on your computer, where you can paint the walls, move furniture, and try ideas — **without anyone seeing it** until you're happy.

**Nothing you do on your copy reaches the public website until a maintainer reviews it and publishes it.** So you can experiment freely. You truly cannot break the real site.

## See what's live right now

The current live website is here: [mosaic-nextjs.vercel.app](https://mosaic-nextjs.vercel.app)

Open it any time to see exactly what visitors see today. When you're working on your own copy, that live site is the "before" you're improving on.

> Note: this web address will change once we move everything onto Mosaic's own church accounts. We'll update this page when that happens.

## The pieces (and what they do)

| Piece | Think of it as… | What it does |
|-------|-----------------|--------------|
| **GitHub** | The shared filing cabinet | Holds every version of the website's files, and where you hand in your work. |
| **GitHub Desktop** | The drawer you open | A simple app (all buttons, no typing) to grab the files and hand in your work. |
| **Your computer** | Your private workshop | Where your copy of the site runs while you work on it. |
| **Claude** | Your building helper | You tell it what you want in plain English; it makes the change and shows you. |
| **Your web browser** | The viewing window | Where you see your copy of the site as you work (`localhost:3000`). |
| **Redis** | The site's short-term memory | Holds the latest events, sermons, and groups so pages load fast. |
| **Planning Center** | The church's record book | The real source of events, groups, and people. The site reads from it. |
| **Sanity** | The easy text-and-photo editor | Lets staff change words and pictures without code (separate from your work). |
| **Vercel** | The printing press | Publishes the real, public website. Only the maintainer uses this. |

You'll personally only ever touch **three things**: GitHub Desktop, Claude, and your browser. The rest runs quietly in the background.

## Who does what

- **You (volunteer):** start a fresh workspace, make changes with Claude, check them in your browser, and hand them in.
- **The maintainer:** reviews what you handed in, and — if it looks good — publishes it to the live site.

## The golden rules

1. **You can't break the live site.** Your work stays on your computer until it's reviewed and published.
2. **One idea at a time.** Each new idea gets its own fresh "workspace" (called a branch). It keeps things tidy and easy to undo.
3. **Getting stuck is normal.** Everyone does. Just message the maintainer — that's what the team is for.


@@@TAB:First-time setup@@@

# First-Time Setup

You only do this part **once.** Take it one step at a time, and remember — wait until the maintainer has given you the go-ahead (see the heads-up on the first page). If anything is confusing, message the maintainer. That's expected, not a bother.

## What you'll install

You'll install **two free apps.** Here's what each one looks like so you know what to expect.

**1. GitHub Desktop** — the simple app for grabbing the website files and handing in your work.
Download it here: **https://desktop.github.com/download/**

> *[Drop in the screenshot here — file: `images/github-desktop-ui.png`. This is what GitHub Desktop looks like: your changes on the left, a preview of what changed on the right, and a button to hand in your work.]*

**2. Claude (the Claude Code desktop app)** — your building helper. You chat with it in plain English and it makes the changes.
Download it here: **https://code.claude.com/docs/en/desktop-quickstart** (pick macOS or Windows on that page).

> *[Drop in the screenshot here — file: `images/claude-code-desktop-ui.png`. This is the Claude app with the **"Code"** tab open — that's the one you'll use. You type what you want in the box at the bottom.]*

## The steps

**Step 1 — Install GitHub Desktop.**
Open the link above, download it, and install it. Sign in with the GitHub account you were invited with. (Didn't get an invite? Ask the maintainer.)

**Step 2 — Download the website to your computer.**
In GitHub Desktop: **File → Clone repository →** choose **mosaic-nextjs →** click **Clone.** This copies all the website files into your private workshop.

**Step 3 — Install the Claude app.**
Open the Claude link above, download the version for your computer (macOS or Windows), and install it. Sign in, then click the **Code** tab at the top.

**Step 4 — Open the project and let Claude set everything up.**
In the Claude app's **Code** tab, choose **Local**, then **Select folder** and pick the `mosaic-nextjs` folder you downloaded in Step 2. Then type: **"Please run the setup script."** It installs the behind-the-scenes tools and gets your copy ready. This can take a few minutes the first time — that's normal.

**Step 5 — Add your one secret value.**
The maintainer will send you **one value** (a "Redis URL"). When Claude asks for it — or just say **"help me fill in my .env.local"** — paste it in. That single value lets your copy show the real, up-to-date site content.

**You're all set!** From now on you only need the **"Your everyday workflow"** tab.


@@@TAB:Your everyday workflow@@@

# Your Everyday Workflow

This is the loop you'll repeat every time you work on the site. It's the same five moves each time, and none of them need the command line.

**Step 1 — Start a fresh workspace.**
In GitHub Desktop, click **Current Branch → New Branch.** Give it a short name for your idea, like `new-events-section`. Click **Create Branch.** (This keeps your experiment separate and safe.)

**Step 2 — See the site, and start changing it.**
In the Claude app (Code tab), just talk to it. For example:
- *"Start the site so I can see it."* → then open **localhost:3000** in your browser.
- *"Change the homepage headline to say Welcome Home."*
- *"Add a card for our youth retreat under Get Involved."*

Claude makes the change, and your browser updates so you can see it right away.

**Step 3 — Look it over.**
Check your browser until you're happy. Don't like it? Just tell Claude what to adjust. Repeat as much as you want — this is the fun part.

**Step 4 — Hand in your work.**
Switch to **GitHub Desktop.** You'll see a list of what changed (this is your chance to glance over it). Then:
1. Type a short summary in the box (e.g. "Added youth retreat card").
2. Click **Commit to [your branch].**
3. Click **Push origin** (top of the window).
4. Click **Create Pull Request** — this opens your web browser.

**Step 5 — Ask for a review.**
On the Pull Request page that opens, click **Reviewers** and choose the maintainer. That's it — you've handed in your work! The maintainer will look it over and, when it's ready, publish it to the live site.

## What you'll **never** have to do

- Type commands in a black "terminal" window (Claude handles that).
- Publish to the live website (the maintainer does that after reviewing).
- Manage passwords or keys beyond the one value you were given.

## When something goes wrong

- **"The site won't start."** Ask Claude: *"the site won't start, can you help?"*
- **"I'm lost in GitHub Desktop."** Take a screenshot and send it to the maintainer.
- **"I think I messed something up."** You almost certainly didn't break anything real. Message the maintainer — it's easy to undo.

**Thank you again for serving. We're glad you're here.**
