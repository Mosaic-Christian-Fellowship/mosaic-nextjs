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

## Getting onto GitHub (do this first)

**GitHub** is the shared filing cabinet that holds all the website's files. Before anything else, you need a free GitHub account and an invite to the church's space.

1. **Create a free GitHub account** — if you don't already have one, go to **https://github.com/signup** and follow the prompts (an email, a password, and a username). It's free, and takes a couple of minutes.
2. **Send the maintainer your GitHub username** (or the email you signed up with). They'll invite you to the church's space on GitHub, called the **Mosaic-Christian-Fellowship** organization.
3. **Accept the invite.** Look for the invitation email from GitHub — or open **https://github.com/Mosaic-Christian-Fellowship** — and click **Accept**. That's it: you can now see and work on the website's files.

Once you've accepted the invite, continue with the two apps below.

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
Open the link above, download it, and install it. Sign in with the **GitHub account you set up above** — the one you accepted the church invite with. (Didn't get the invite yet? Ask the maintainer.)

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

**Step 5 — Tell the maintainer when it's ready to go live.**
This is how the maintainer knows to publish your work — there's a simple "still working" vs. "ready" signal:

- **Still tinkering?** On the Pull Request page, click the small arrow next to the green button and choose **Create draft pull request.** A *draft* quietly tells the maintainer "not done yet — please don't publish." You can keep making changes to it for as long as you like.
- **Happy and ready to publish?** Click **Ready for review** at the top of the Pull Request page, then click **Reviewers** and choose the maintainer. **Requesting the maintainer's review is your signal that it's ready to go live.**

A minute or two after you push, a **preview link** also appears on the Pull Request — a private, working copy of your exact change. The maintainer clicks it to see how it looks *before* publishing. (You never publish anything yourself — the maintainer does that after a quick look.)

## What you'll **never** have to do

- Type commands in a black "terminal" window (Claude handles that).
- Publish to the live website (the maintainer does that after reviewing).
- Manage passwords or keys beyond the one value you were given.

## When something goes wrong

- **"The site won't start."** Ask Claude: *"the site won't start, can you help?"*
- **"I'm lost in GitHub Desktop."** Take a screenshot and send it to the maintainer.
- **"I think I messed something up."** You almost certainly didn't break anything real. Message the maintainer — it's easy to undo.

**Thank you again for serving. We're glad you're here.**

@@@TAB:Claude's toolkit@@@

# Claude's Toolkit — What It Knows, and When to Ask

Claude comes with a set of **skills** — bundles of instructions that teach it how we do things on this project specifically. Think of them as specialist colleagues Claude can call in: one who's fussy about how things look, one who's careful with words, one who stops small jobs from turning into big ones.

**The good news: you mostly don't have to do anything.** Skills load themselves when they're relevant. If you ask Claude to "make the events page look better on my phone," the responsive-design skill wakes up on its own. You don't need to memorize this page.

Two things you **do** type yourself:

- **Commands** start with a slash, like `/wrap-up`. You type them on their own line and press enter.
- **Plain requests** are just normal sentences. Most of your work is this.

Read this tab once so you know what's in the box. Then come back to the **Recipes** section at the bottom when you're not sure how to start something.

---

## Making the site look right

These handle anything visual — layout, spacing, colors, how things look on a phone.

| Skill | What it does | You'd use it when… |
|---|---|---|
| **design-craft** | The fussy-eye colleague. Checks spacing, type sizes, color contrast, and whether a page reads as one finished thing instead of assembled parts. Also checks the site is usable by people with low vision or who navigate by keyboard. | "Does this section look right?" · "Review the About page design." |
| **responsive-craft** | Makes pages work at every screen size — phone, tablet, laptop. Builds it in from the start rather than patching it on later. | "This looks broken on my phone." · "Add a new section" (it'll handle phone sizing automatically). |
| **figma-to-code** | When you're copying a design exactly, this stops Claude from improvising. Every measurement comes from the real design file, not from a guess. | Only when you've been handed a specific design to match. |
| **image-optimization** | Shrinks photos so pages load fast, without them looking worse. | "I added a photo and the page got slow." |

> **A note on photos:** a lot of this site is still waiting on real photography. If you see a plain gray or colored block where a picture should be, that's a placeholder, not a bug.

## Writing the words

| Skill | What it does | You'd use it when… |
|---|---|---|
| **humanizer** | Strips out the tells that make writing sound like a robot wrote it — the stiff phrasing, the empty filler. | "This paragraph sounds like AI wrote it." |
| **warm-voice** | The other half of the pair. Adds warmth back in, so it reads like a real person from Mosaic talking. | Any copy a visitor will actually read — headlines, welcome text, ministry descriptions. |

Use them together, in that order: humanizer takes the bad out, warm-voice puts the good in. Just ask Claude to "clean this up and make it sound like us" and it'll run both.

## Keeping your change small and safe

| Skill | What it does | You'd use it when… |
|---|---|---|
| **scope-lock** | **The most important one on this page.** Stops Claude from turning "change this one heading" into a rewrite of forty files. It keeps the job to exactly what you asked. | Any time you want **one specific thing** changed and nothing else. Say: "scope-lock this — only change the headline." |
| **project-hygiene** | Tidies up leftover files and stray notes so the project stays clean. | Rarely. The maintainer usually runs this. |
| **preflight-check** | Checks that everything on your computer is set up correctly — the right tools installed, the right folders in place. | Your very first session, or when something stops working for no obvious reason. |

**Why scope-lock matters so much:** Claude is eager and capable, which is mostly wonderful and occasionally a problem. Ask for a small fix and it may notice five other things it could improve — and do them. That makes your work harder for the maintainer to review, and harder for you to undo. Naming scope-lock keeps everyone's life simple.

## Starting and ending your session

These three are the discipline that makes the next session easy. They're commands — you type them.

| Command | What it does | When |
|---|---|---|
| `/start-session` | Shows you where things stand and what you were doing last time. | First thing, every time you sit down. |
| `/save-memory` | Tells Claude to remember something you just decided, so it still knows next week. | Any time you settle a question you don't want to re-explain. |
| `/wrap-up` | The end-of-session check. Catches work you forgot to hand in, or a Pull Request you never opened. Writes a note to your future self about where you left off. | Last thing, before you close the app. |

> If you only adopt one habit from this whole handbook, make it `/wrap-up`. Almost every "wait, where did my work go?" moment is a session that ended without it.

## Planning something bigger

For anything that'll take more than a sitting, Claude has a set of skills (called **superpowers**) that work the way a good contractor does: talk it through, write it down, then build it.

| Skill | What it does |
|---|---|
| **brainstorming** | Talks the idea through with you **before** any building starts. Asks what you actually want. |
| **writing-plans** | Turns that conversation into a written, step-by-step plan you can read and approve. |
| **subagent-driven-development** | Works through the approved plan one step at a time. |
| **test-driven-development** | Writes a check that proves the thing works **before** building it. Sounds backwards; prevents a lot of grief. |
| **systematic-debugging** | When something's broken, finds the actual cause instead of guessing. |
| **verification-before-completion** | Makes Claude actually confirm something works before telling you it's done. |

You don't call these by name. Just say **"let's plan this out first"** for anything non-trivial, and Claude will walk you through it. There are real examples of this on the project already, in `docs/superpowers/`.

## Under the hood

You'll never call these directly, but they're why Claude doesn't get the technical details wrong on this project.

| Skill | What it covers |
|---|---|
| **vercel:nextjs** | The specific web framework this site is built on. Its rules changed recently, and this keeps Claude current. |
| **vercel:next-cache-components** | How the site remembers things between visitors so pages load fast. |
| **vercel:deploy** / **vercel:env** | Publishing and secret keys. **Maintainer only** — you'll never need these. |

---

# Recipes

Real situations, and how to start each one. These mirror how the site has actually been built so far.

### "I want to change one specific thing."

> **"scope-lock this — on the homepage, change the headline to 'Welcome Home' and don't touch anything else."**

Naming scope-lock up front is the whole trick. Small, reviewable, easy to undo.

### "This section doesn't look right, but I can't say why."

> **"Review the Get Involved section with design-craft. What's off?"**

You'll get a specific list — spacing, contrast, type size — instead of a vague opinion. Then pick which ones you want fixed. You don't have to accept all of them.

### "It's broken on my phone."

> **"The events page is a mess on mobile. Fix the layout for phone screens."**

Ask Claude to show you what it looks like at phone size before **and** after, so you can see the difference yourself.

### "The words sound stiff."

> **"Rewrite this welcome paragraph so it sounds like a real person from Mosaic. Run humanizer and warm-voice on it."**

Give it context if you can — who's reading it, and what you want them to feel. "This is the first thing a nervous first-time visitor reads" gets you much better copy than "make it warmer."

### "I have a list of small fixes from the team."

Do them **all on one branch, as one Pull Request** — not five separate ones. It's far less work for the maintainer to review.

> **"I have six small fixes. Let's do them all on one branch, one commit each, then open a single Pull Request."**

### "I want to add something real — a new page, a new section."

Don't dive in. Plan it first.

> **"I want to add a page for our youth ministry. Let's plan this out before building anything."**

Claude will ask questions, write a plan, and wait for you to approve it. Ten minutes of planning saves an afternoon of undoing.

### "Something's broken and I don't know why."

> **"The site won't start. Help me find out why — don't guess, work it out step by step."**

The "don't guess" part matters. Left alone, Claude will sometimes try three fixes in a row without knowing which one worked.

### "Claude says it's done. Is it?"

Check it yourself, in the browser. Always.

> **"Show me. Take a screenshot of the section you changed."**

This is the single most valuable habit in the whole handbook. Claude will occasionally report a change it didn't quite make — updating a label instead of the actual thing. Trust what you can see, not what you're told.

### "I'm done for the day."

> `/wrap-up`

It'll tell you if anything's unfinished, unpushed, or un-handed-in. Then close the app with a clear conscience.

---

## The three habits that matter most

Everything above is optional. These three aren't.

1. **Say scope-lock when you want one thing changed.** Keeps your work small and reviewable.
2. **Look at it in the browser before you believe it's done.** Screenshot, click around, see it with your own eyes.
3. **Run `/wrap-up` before you close the app.** It's thirty seconds and it prevents the most common way work gets lost.

Everything else you'll pick up as you go. And if you're ever unsure which skill applies — just describe what you want in plain English. Claude will figure out which one to reach for. That's the whole point of them.
