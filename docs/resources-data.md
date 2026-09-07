# Resources data

`/messages/resources` reads one checked-in file, `data/resources.json`. Nothing on that
page comes from Redis, Sanity, or an API at request time.

## Why a file

The reading list changes once or twice a year and every entry is a recommendation the
church is putting its name to. A pull request is the right amount of friction: someone
reviews the change before it is live. Sermons and events are the opposite — they change
weekly and nobody should have to open a PR for them, so they stay in Redis.

## Shape

```
{
  "sections": [
    {
      "slug": "general",                 // also the anchor id and jump-link target
      "title": "General Resources",
      "groups": [                        // a group title is the reader's question
        { "title": "How Do I Read the Bible?",
          "books": [
            { "slug": "...", "title": "...", "author": "...",
              "description": "...",      // 20-35 words, written for this site
              "cover": { "src": "/resources/covers/<slug>.jpg", "width": 0, "height": 0 }
            }
          ] }
      ],
      "organizations": [...],            // justice-mercy only
      "films": [...], "talks": [...]     // race-reconciliation only
    }
  ]
}
```

`cover` is `null` when there is no art we can use. `BookCard` sets the title in the
cover's place rather than showing an empty box.

## Editing

- **Wording, ordering, adding or removing a book** — edit `data/resources.json` directly.
- **Adding a book with a cover** — put a JPEG at `public/resources/covers/<slug>.jpg`,
  around 600px wide, and set `cover.width`/`cover.height` to its real pixel size. Those
  two numbers are what stop the page jumping around as images load.
- **Adding an organisation** — the logo filename is derived from the name: lowercased, a
  leading "The" dropped, everything else hyphenated. "The Bowery Mission" →
  `bowery-mission.svg`.

## Where the data came from

The books, groups and section titles were taken from the old site's five Resources pages
in August 2026. Cover art and book metadata were harvested from Open Library, Google
Books and Amazon's cover endpoint by scripts kept in the project workspace
(`assets/resources/`), not in this repo.

**If you re-run a cover harvest, check the images, not just their dimensions.** Google
Books answers with a grey "image not available" card rather than a 404 when it has no
art. That card is a valid JPEG at a plausible size, so a harvest that only validates
width and height accepts it. A pass in September 2026 overwrote 44 of 72 covers with that
card and it was only caught by looking at a contact sheet. The current harvest also tests
image content — a standard-deviation floor plus a perceptual match against the two known
placeholder cards — and writes to a staging directory for review rather than over the
live files.

All 72 books have cover art. Four of them came from publisher sources rather than the
generic ones, because the ISBN in the book metadata pointed at the wrong product — a
workbook, an audiobook, or nothing at all. When a cover looks like the wrong edition,
open the publisher's product page for the print ISBN and take its `og:image`; Tyndale
also serves hi-res art directly at
`files.tyndale.com/thpdata/images--covers/HiResJPG/<hyphenated-isbn13>.jpg`.

## Known gaps

- The talks in the race section link to `njmosaic.org` sermon pages on the old site.
  Those resolve today and will need revisiting at the domain cutover.
- The section intros on the page are drafts written from the book lists. They are not
  copy the church has approved.
