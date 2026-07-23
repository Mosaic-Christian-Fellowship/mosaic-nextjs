# The Setup Prompt

Copy everything inside the box below and paste it into Claude as your very first message after installing the Claude desktop app. Claude will do the rest and check its own work.

You only do this once.

---

```
I'm a volunteer on the Mosaic Christian Fellowship church website. I'm not a
developer — please explain what you're doing in plain language as you go, and
stop and ask me if you need something from me.

Please set up my Claude for this project. Work through these steps in order and
tell me the result of each one.

STEP 1 — Find the project
Confirm we're inside the mosaic-nextjs folder. You should see a CLAUDE.md file
and a docs/ folder. If we're not, ask me where I saved the project and stop
until I answer.

STEP 2 — Install the skills
Copy every folder from docs/onboarding/claude-setup/skills/ into my personal
Claude skills folder at ~/.claude/skills/ (create it if it doesn't exist).
Don't overwrite a skill I already have with the same name — tell me instead and
let me decide.
Then list which skills you installed.

STEP 3 — Install the two plugins
These aren't in the folder — they're installed from Claude's plugin marketplace.
Install:
  - superpowers   (planning, testing, and debugging discipline)
  - vercel        (knowledge of the framework this site is built on)
Tell me if either fails, and don't try to work around it.

STEP 4 — Check my setup
Run the preflight-check skill. It looks at whether git, GitHub CLI, and my
folders are set up correctly. Fix what you safely can. For anything that needs a
decision or a password, stop and tell me what you need — don't guess.

STEP 5 — Check the site runs
Try to start the site so I can look at it in my browser. If it fails because a
setting is missing (most likely the read-only Redis URL the maintainer gave me),
tell me exactly which value is missing and where it goes. Don't invent a value.

STEP 6 — Read the project in
Read CLAUDE.md and docs/onboarding/team-handbook.md so you understand how this
project works, who the site is for, and the rules the team follows.

STEP 7 — Report back
Give me a short summary:
  - which skills and plugins are installed
  - whether the site runs
  - anything still blocking me, and exactly what you need from me to fix it

Then show me how to run /start-session, and we'll stop there for today.
```

---

## What to expect

It takes a few minutes. Claude will ask you things along the way — that's normal, not a sign anything is wrong.

**It will probably stop at Step 5.** The site needs one value from the maintainer (a read-only Redis URL) that isn't in the project files, on purpose. If Claude says it's missing, that's correct behaviour. Message the maintainer, paste the value where Claude tells you, and ask it to try again.

**If a skill or plugin fails to install,** don't retry it repeatedly. Take a screenshot and send it to the maintainer.

**If Claude offers to invent or guess a missing value, say no.** A made-up connection string will fail in confusing ways later.

## After setup

From then on, every session starts the same way:

```
/start-session
```

and ends the same way:

```
/wrap-up
```

Everything between those two is just talking to Claude about what you want to change. The **Claude's toolkit** tab of the Team Handbook covers what to say and when.
