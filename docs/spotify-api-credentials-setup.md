# How to Get Your Spotify API Credentials

This guide walks you through getting Spotify API credentials so the new Mosaic website can pull in our latest podcast episodes automatically. No coding required — just clicking through some Spotify menus. Should take about **10 minutes**.

You'll need to be signed in with a **Spotify account** — ideally the one that hosts the Mosaic podcast, but any Spotify account will work for read-only access. (No paid plan required either; a free Spotify account is fine.)

---

## What you're doing, in plain English

Spotify has a free tool called the Web API. It lets websites read public information about a podcast — like the latest episodes, descriptions, durations, and cover art. To use it, Spotify asks you to register a small "app" on their developer site so they know who's making requests.

There's no charge. Unlike YouTube, Spotify gives you **two values** instead of one — a **Client ID** and a **Client Secret**. Together they act like a username + password for the website.

---

## Step-by-step

### 1. Open the Spotify Developer Dashboard

Go to **https://developer.spotify.com/dashboard**

Click **Log in** in the top-right and sign in with the Spotify account you'd like to use. The first time you visit, Spotify may ask you to:

- Accept the **Developer Terms of Service**
- Confirm your email address (a one-time check)

Click through any prompts. You don't need to add a payment method — there isn't one.

---

### 2. Create a new app

You should land on a page that says **"Dashboard"** at the top.

1. Click the green **"Create app"** button (top-right of the dashboard).
2. Fill out the form:
   - **App name:** type **`Mosaic Website`**
   - **App description:** **`Pulls latest podcast episodes for the Mosaic Christian Fellowship website.`**
   - **Website:** **`https://mosaicnj.org`** (or the new site URL once it's live — this just helps Spotify identify the app, doesn't have to be perfect)
   - **Redirect URI:** **`http://127.0.0.1:3000`** — this field is required by Spotify but our website won't actually use it. Type the value above and click **"Add"** so it lands in the list below the field. **Important:** use the numeric `127.0.0.1`, not `localhost` — Spotify stopped accepting `localhost` in 2025. They mean the same thing, but only the numeric one passes their check.
   - **Which API/SDKs are you planning to use?** Tick **"Web API"** only. Leave the other boxes unchecked.
3. Tick the box that says you understand and agree to Spotify's Developer Terms.
4. Click **Save**.

Spotify will create the app and drop you on its overview page.

> **How to tell you're in the right place:** the page header should now say **"Mosaic Website"** at the top.

---

### 3. Copy the Client ID

On the app's overview page, look for the **"Client ID"** value — a long string of about 32 letters and numbers, just under the app name.

Click the copy icon next to it (or select the text and copy). Paste it somewhere safe for now (a notes app, draft email, etc.) and label it clearly:

```
Client ID: <paste here>
```

---

### 4. Copy the Client Secret

Just below the Client ID, you should see **"View client secret"** as a small link. Click it.

A second long string will appear — this is the **Client Secret**. Click the copy icon next to it.

Paste this one underneath the Client ID with a clear label too:

```
Client Secret: <paste here>
```

> **Important:** The Client Secret is more sensitive than the Client ID. Treat it like a password.

---

### 5. Send both values to Dave

Email or message **both values** to Dave, clearly labeled. For example:

```
Spotify credentials for the Mosaic site:

Client ID:     abc123def456...
Client Secret: 789xyz012qrs...
```

**Don't post these publicly** (no Slack channels, no public docs, no GitHub) — the Client Secret especially should stay private. A direct email or text to Dave is fine.

---

## What happens after you send them

Dave will plug both values into the website's settings on Vercel (the hosting service). The website will then automatically pull the latest episodes from our Spotify podcast — episode titles, dates, durations, and direct play links — no manual updates needed.

If anything breaks or the credentials need to change later, you can come back to **https://developer.spotify.com/dashboard**, click into the **"Mosaic Website"** app, and either rotate the Client Secret or replace the whole app.

---

## Common questions

**"Spotify won't let me add `http://localhost:3000` as a Redirect URI."**
Use **`http://127.0.0.1:3000`** instead. Spotify tightened their redirect-URI rules in 2025 and now rejects `localhost`. The numeric version (`127.0.0.1`) is the same thing — your computer reading the address as a number instead of a name — but it's the only form Spotify accepts.

**"It's asking me to verify my email or add my phone number."**
Spotify sometimes prompts this for new developer accounts. It's a one-time security check — go ahead and do it. There's no charge or credit card.

**"I don't see a Create app button."**
Make sure you're signed in. The button only appears after Spotify has accepted the Developer Terms — sign out and back in if it's still missing.

**"I lost the Client Secret — can I see it again?"**
Yes. Go back to **https://developer.spotify.com/dashboard**, click the **Mosaic Website** app, then click **"View client secret"** again. If for any reason it's been hidden, there's a **"Rotate client secret"** option that generates a fresh one — but if you do that, send Dave the new value so the site doesn't break.

**"Should I use the church's Spotify account or my personal one?"**
Either works for read-only podcast data — the credentials don't grant any access to a specific account's listening data, just the public Web API. Using the church's account is slightly cleaner for ownership purposes (whoever owns that account can revoke the credentials later if needed), but a personal account is fine.

**"Should I delete the app when we're done?"**
No — the website needs it to keep working. If the credentials ever need to be rotated, we'll let you know.

---

## Need help?

If anything doesn't match what's on your screen — Spotify updates this dashboard regularly and labels can shift — just take a screenshot of where you're stuck and send it over. We'll figure it out together.
