# PCO Events — Field Audit

A complete inventory of what PCO's Calendar API returns for an Event Instance, what we're capturing in `events:all` (KV), and what we're dropping. Use this to decide what's worth adding before client review.

**Source:** Live audit of `/calendar/v2/event_instances?include=event,tags,event_times,resource_bookings` against the production PCO PAT, 2026-04-29.

---

## EventInstance attributes (per-occurrence)

| PCO field | Sample value | Currently captured? | Recommendation |
|---|---|---|---|
| `id` | `"178930303"` | ✅ as `id` | Keep — used as primary key |
| `name` | `"Praise Team Practice"` | ✅ as `name` | Keep — falls back to event.name if instance is unnamed |
| `starts_at` | `"2026-05-02T14:00:00Z"` | ✅ as `startsAt` | Keep |
| `ends_at` | `"2026-05-02T16:00:00Z"` | ✅ as `endsAt` | Keep |
| `all_day_event` | `false` | ✅ as `allDay` | Keep |
| `location` | `"Mosaic Christian Fellowship - 119 Rockland Avenue, Northvale, NJ 07647"` | ✅ as `location` | Keep |
| `church_center_url` | `"https://njmosaic.churchcenter.com/calendar/event/178930303"` | ✅ **NEW** as `churchCenterUrl` | **Added** — canonical detail page URL |
| `compact_recurrence_description` | `"Every Saturday"` | ✅ **NEW** as `recurrenceDescription` | **Added** — short cadence string for UI |
| `recurrence` | `"Weekly"` | ❌ dropped | Skip — `compact_recurrence_description` covers the use case |
| `recurrence_description` | `"Every Saturday from 10:00am to 12:00pm beginning 02/01/2025"` | ❌ dropped | Skip — verbose; the compact version reads better |
| `published_starts_at` / `published_ends_at` | (same as starts_at / ends_at on this event) | ❌ dropped | Skip unless we encounter an event where they differ — current data shows them identical |
| `created_at` / `updated_at` | (timestamps) | ❌ dropped | Skip — internal metadata, no UI use |

---

## Event attributes (parent template, fetched via `?include=event`)

| PCO field | Sample value | Currently captured? | Recommendation |
|---|---|---|---|
| `name` | `"Praise Team Practice"` | ✅ (fallback only) | Keep |
| `description` | `"<div>\n  Sanctuay\n</div>\n"` (HTML) | ✅ as `description` | Keep — but **note**: comes back as HTML; we're rendering it as plain text today (which strips tags but preserves whitespace oddly). Worth a sanitize pass before render. |
| `summary` | `"Sanctuary"` | ✅ as `summary` | Keep — usually a one-liner, ideal for cards |
| `image_url` | `null` (none of the 12 events have one) | ✅ as `imageUrl` | Keep — **but the data is empty**. See "Image upload practice" below. |
| `featured` | `false` | ✅ as `featured` | Keep — **but unused in UI**. Could drive bento curation (see "Open question 1"). |
| `visible_in_church_center` | `true` | ✅ used as filter at sync time | Keep — already filters out internal-only events at sync (`lib/sync/events.ts:56`). KV never sees `false` here. |
| `registration_url` | `null` (none of the 12 events have one) | ✅ **NEW** as `registrationUrl` | **Added** — drives a "Register" CTA on detail page when present. Also fixes the `hasRegistration` bug (was hardcoded `false`, now derived from `registrationUrl !== null`). |
| `approval_status` | `"A"` | ❌ dropped | Skip — admin-only |
| `percent_approved` / `percent_rejected` | `100` / `0` | ❌ dropped | Skip — admin-only |
| `created_at` / `updated_at` | (timestamps) | ❌ dropped | Skip — internal metadata |
| Event `links.html` | `"https://calendar.planningcenteronline.com/events/15533751"` | ❌ dropped | Skip — admin URL (not visitor-facing) |

---

## Includes we don't fetch

PCO's `event_instances` endpoint can also include these via `?include=...`:

| Include | What it provides | Worth fetching? |
|---|---|---|
| `tags` | Categorization labels assigned in PCO admin (e.g., "Worship", "Family") | **Yes, eventually** — once the church starts tagging events. Today, no events have tags, so adding the include is wasted bandwidth. Revisit when tagging adoption picks up. |
| `event_times` | Sub-times within an event instance (e.g., a retreat with multiple sessions) | Skip for now — Mosaic events are single-session. Revisit if multi-session retreats appear. |
| `resource_bookings` | Rooms/equipment booked for the event | Skip — admin/operational data, not visitor-facing |

---

## Open questions for review

### 1. Use `featured` to curate the homepage bento?

Current behavior: homepage bento shows the 3 *soonest* events. With curated images, the soonest 3 might not be the most visually compelling.

**Option A** — Show 3 soonest (today's behavior). Simple, always fresh.
**Option B** — Show 3 soonest where `featured: true`. Church admins flag "hero" events in PCO; bento curation becomes a content decision in PCO admin, not code.
**Option C** — Show 3 soonest with `imageUrl !== null`. Auto-promotes events that have cover art.

My recommendation: **B**, paired with a process recommendation that "featured" + "cover image upload" become standard for any event the church wants on the homepage.

### 2. Detail page link target — our `/events/[id]` or PCO's `church_center_url`?

PCO's Church Center URL has registration baked in. Our `/events/[id]` keeps users on our domain and gives us narrative control.

My recommendation: **link tile to our `/events/[id]`**, then on that page surface a "Register on Church Center" CTA for `hasRegistration` events. Best of both.

### 3. Description sanitization

Today the description field arrives as HTML. We render it through React, which escapes it — so visitors see literal `<div>` tags. The audit data shows minor offenders like `<div>\n  Sanctuay\n</div>\n` (note the typo, that's PCO data we can't fix).

Two safe options:
- Strip HTML and render plain text (loses any intentional formatting)
- Sanitize HTML with a library like DOMPurify, then render the cleaned markup

My recommendation: strip-and-render plain text on cards (where formatting doesn't matter), DOMPurify-sanitized markup on the detail page for richer rendering. Never render PCO HTML raw — even though `visible_in_church_center` filters out admin events, the sanitization step is cheap insurance against future content surprises.

---

## Image upload practice

**Current state:** 0 of 12 events have `image_url` populated.

**Recommendation:** Make cover image upload a standard part of creating any public event in PCO Calendar admin. The website pulls these directly via the existing 2h cron — no manual website update needed.

I'll add a one-pager guide for staff covering the upload steps once we agree on the approach. (If this is the same person who got the YouTube guide, I can roll it into a single "PCO event admin checklist" instead.)

---

## What changes in code

Sync layer (`lib/sync/events.ts`) now captures all three new fields. Existing KV data lacks them — the next cron run (or a manual trigger via `GET /api/cron/sync` with the `CRON_SECRET` bearer) will refresh KV with the enriched shape.
