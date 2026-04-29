# How to Get Your YouTube API Key

This guide walks you through getting a YouTube API key so the new Mosaic website can pull in our latest videos automatically. No coding required — just clicking through some Google menus. Should take about **10 minutes**.

You'll need to be signed in with a **Google account that has access to the Mosaic YouTube channel** (or any Google account is fine for creating the key — it doesn't have to be the channel owner's, the key works the same).

---

## What you're doing, in plain English

Google has a free tool called the YouTube Data API. It lets websites read public information about a YouTube channel — like the latest video, view counts, descriptions. To use it, Google asks you to create a free "key" (basically a password) that identifies who's making the requests.

There's no charge. The free tier covers far more than the Mosaic website will ever use.

---

## Step-by-step

### 1. Open the Google Cloud Console

Go to **https://console.cloud.google.com/**

If this is your first time, Google may ask you to:
- Pick a country
- Agree to the Terms of Service

Just check the box and click **Agree and Continue**. (Google may also ask if you want to start a "free trial" — you do **not** need to do that. Just close any popup about it.)

---

### 2. Create a new project

At the very top of the page, just to the right of the words "Google Cloud," there's a dropdown that probably says **"Select a project"** or shows the name of an existing project.

1. Click that dropdown.
2. In the popup that opens, click **"NEW PROJECT"** (top-right of the popup).
3. Project name: type **`Mosaic Website`** (or anything you'll remember).
4. Leave the "Organization" and "Location" fields alone.
5. Click **CREATE**.

Wait about 10 seconds. A notification will pop up in the top-right saying the project is ready. Click **"SELECT PROJECT"** in that notification (or use the dropdown at the top to switch into the new project).

> **How to tell you're in the right project:** the dropdown at the top should now say **"Mosaic Website"**.

---

### 3. Turn on the YouTube Data API

1. In the search bar at the top of the page, type **`YouTube Data API v3`** and press Enter.
2. In the search results, click the one that says **"YouTube Data API v3"** with a red YouTube icon.
3. On the page that opens, click the big blue **ENABLE** button.

This takes about 5–10 seconds. When it's done, you'll land on a new page (the API's dashboard). That's fine.

---

### 4. Create the API key

1. Look at the menu on the **left side** of the page. Click **"Credentials"**. (If you don't see a left menu, click the three-line "hamburger" icon at the very top-left to open it, then look under "APIs & Services" → "Credentials.")
2. At the top of the Credentials page, click **"+ CREATE CREDENTIALS"**.
3. From the dropdown, choose **"API key"**.

A popup will appear with **your API key** — a long string of letters and numbers, something like `AIzaSyD...`.

**This is the value we need.** Click the **copy icon** next to it to copy it to your clipboard. Then click **CLOSE** on the popup.

---

### 5. Restrict the key (recommended, takes 30 seconds)

This step is optional but smart — it makes sure the key can only be used for YouTube, not other Google services, in case it ever leaks.

1. On the Credentials page, you should now see your new key listed under "API Keys." Click its name (probably "API key 1") to open its settings.
2. Under **"API restrictions"**, click **"Restrict key"**.
3. In the dropdown that appears, check the box for **"YouTube Data API v3"**.
4. Scroll to the bottom and click **SAVE**.

Done.

---

### 6. Send the key to Dave

Email or message the API key to Dave. The key looks like a random string of about 39 characters starting with `AIza`.

**Don't post it publicly** (no Slack channels, no public docs, no GitHub) — treat it like a password. A direct email or text is fine.

---

## What happens after you send it

Dave will plug the key into the website's settings on Vercel (the hosting service). The website will then automatically pull the latest sermon, livestream status, and recent videos from our YouTube channel — no manual updates needed.

If anything breaks or the key needs to change later, you can come back to the same Google Cloud Console page (https://console.cloud.google.com/) and either regenerate or replace it.

---

## Common questions

**"It's asking me to enable billing or add a credit card."**
You shouldn't need to. The YouTube Data API has a generous free tier. If you hit a screen demanding billing info, you may have accidentally clicked into a different product — back out and try again. Make sure you're enabling **"YouTube Data API v3"** specifically (not "YouTube Analytics API" or anything else).

**"I can't find the project I just created."**
Use the project dropdown at the top of the page (next to "Google Cloud") and look in the list. New projects sometimes take a minute to show up.

**"I lost the key — can I see it again?"**
Yes. Go back to **APIs & Services → Credentials** in the left menu, click the key's name, and you'll see the key value. You can also click "SHOW KEY" if it's hidden.

**"Should I delete the key when we're done?"**
No — the website needs it to keep working. If we ever need to rotate it (replace with a new one), we'll let you know.

---

## Need help?

If anything doesn't match what's on your screen — Google updates this console regularly and labels can shift — just take a screenshot of where you're stuck and send it over. We'll figure it out together.
