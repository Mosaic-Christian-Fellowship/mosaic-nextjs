---
name: warm-voice
description: Strip AI telltale signs AND inject warm, conversational human voice. Two-pass rewrite for shareable docs, memos, and any text intended to be read by colleagues, stakeholders, or external audiences. Use when text needs to feel like a smart colleague wrote it, not a model. Pairs with the `humanizer` skill — humanizer is the subtractive pass; this is the additive one.
---

# Warm Voice

A two-pass rewrite that removes AI telltale signs (Pass 1) and then injects warm, conversational human voice (Pass 2). The result reads like a smart colleague explaining something in a meeting — direct, opinionated, easy to read, with the texture of a real person writing.

The `humanizer` skill is purely subtractive. It removes AI patterns and stops there, often leaving text correct but cold and clinical. `warm-voice` does the same removal, then adds the voice back in.

## When to use

- Memos, proposals, decision docs being shared with the team
- Slack messages, emails, and Notion/Confluence pages read by humans
- Public-facing copy — websites, marketing pages, prototype intros
- Any document where the reader's *reaction to the voice* matters

## When not to use

- Technical documentation requiring strict precision
- Legal language, contracts, formal compliance docs
- Code comments, API reference, status updates, file paths
- Brief functional notes where personality would feel forced

## PASS 1 — Strip AI telltale signs

Apply the same removal pass as the `humanizer` skill. The shortlist:

- **AI vocabulary**. Cut entirely or replace with plain language: leverage, robust, seamless, transformative, pivotal, crucial, foster, synergy, paradigm, holistic, streamline, empower, testament, landscape, showcasing, groundbreaking, cutting-edge, revolutionary, innovative.
- **Filler phrases**. "In order to" → "to." "Due to the fact that" → "because." "It is important to note that" → cut. "It is worth mentioning that" → cut. "As previously mentioned" → cut.
- **Em-dash overuse**. Reduce em-dashes substantially. Keep 1–2 per page where they aid rhythm. Replace the rest with commas, periods, or restructured sentences.
- **Inline-header bullet lists**. The `**Bold lead:** explanation` pattern is a classic AI tell. Convert to prose paragraphs OR plain bullets without bold lead-ins.
- **Negative parallelisms**. "It's not just X, it's Y" → just say Y.
- **Forced tricolons**. "Low-risk, learnable, reversible" — three items by default is an AI signature. Use the natural number of items, even if that's two or four.
- **Sycophantic openers and chatbot artifacts**. Cut "Great question!", "I hope this helps!", "Feel free to reach out", "Happy to help."
- **Generic conclusions**. "The future looks bright. Exciting times lie ahead." → cut or replace with specific facts/next steps.

For the full reference, see the `humanizer` skill — all 24 patterns apply here as Pass 1.

## PASS 2 — Inject warm voice

This is what `humanizer` doesn't do. After the removal pass, add voice deliberately.

### Use contractions as the default

Contractions are the single biggest "feels human" marker. AI text avoids them by default; warm voice uses them as default.

- "It is" → "it's"
- "We are" → "we're"
- "Do not" → "don't"
- "I would" → "I'd"
- "That is" → "that's"

Don't force contractions where the unconstructed form is clearly better (e.g., emphasis: "I do not agree"). But default-on instead of default-off.

### Allow natural asides and parentheticals

A well-placed aside is one of the strongest signals of a real human. Use sparingly — they're seasoning, not the dish.

- "...and honestly, that's where most of the friction lives."
- "(this is the part I'd love your read on)"
- "...which, fine, isn't perfect either, but..."
- "I'd argue — and you're welcome to disagree — that..."

Limit to one or two per section. Over-asiding reads as performative.

### Vary sentence length deliberately

AI text trends to medium-length sentences. Human writing has more variance. Mix:

- Short punchy sentences. (3–7 words)
- Medium sentences carrying the main argument. (12–20 words)
- The occasional longer sentence that lets you build a thought, run with it, and land somewhere unexpected — particularly when the idea genuinely needs the room to breathe. (25+ words)

### Use "we" and "you" instead of passive voice

- "It should be considered that..." → "I think we should..."
- "Users will benefit from..." → "You'll get..."
- "It can be observed that..." → "You'll notice..."
- "It is recommended that teams..." → "We recommend teams..."

### Mark opinions as opinions (sparingly, with per-writer calibration)

Phrases like "I think," "my read is," "I'd argue," "for what it's worth," or "honestly" let the reader know an opinion is an opinion. The most AI-feeling writing presents opinions as facts.

But "sparingly" is the key word. Two specific calibrations:

- **"Honestly" — cap at 1 per document, max.** Only keep it if the alternative ("Really," "Look," or dropping the word entirely) is clearly worse. Default to omitting. Some writers don't naturally use this word at all — when calibrating to a specific person's voice, check whether they actually say "honestly" in their writing before adding it. (For Dave specifically: default to 0 — he doesn't use this word naturally.)
- **Other opinion markers** ("I think," "I'd argue," "for what it's worth") — one or two per document is the upper bound. More than that and they read as a verbal tic.

When in doubt, cut. Subtraction stays human; over-marking reads as performative.

### "I" vs "we" — match the document's purpose

Both first-person voices feel human, but they're not interchangeable. The right choice depends on what the document is doing — and the trigger is usually the verb.

**Default to "we" for:**
- Status updates, recaps, retrospectives, shared accomplishments
- Descriptive content about team activities, decisions, plans
- Documents that represent the org's collective position
- Verbs of collective action: ship, build, decide, made, did, plan

**Use "I" for:**
- Recommendations, proposals, opinion pieces
- Asking for feedback or pushback
- Stating a personal stance the writer wants to be accountable for
- The writer's emotional/intellectual reaction to something
- Verbs of personal stance: propose, argue, recommend, think, would rather, believe, suggest

**Mixed is normal in proposals.** A recommendation doc often has:
- "I'm proposing we shift the workflow." (writer's stance + team's action)
- "I think we should pilot this on three prototypes." (writer's opinion + team's plan)
- "We've all had the experience of..." (team-shared experience used to support a personal argument)

**The mistake to avoid:** forcing "we" everywhere in a recommendation doc to feel "inclusive." It reads as the royal we and undermines the writer's accountability for their stance. If the writer is putting their name on a position, claim it with "I" — then describe what "we" do once the recommendation lands.

Examples by document type:

> Status update (default "we"):
> BAD: "I shipped the redesign last week."
> GOOD: "We shipped the redesign last week."

> Recommendation doc (mix, with "I" for the stance):
> BAD: "We recommend we shift to prototype-first design." (over-we, sounds bureaucratic)
> GOOD: "I'm proposing we shift to prototype-first design."

> Personal stance inside a team doc:
> BAD: "We feel this is the right move." (royal we — not credible)
> GOOD: "I think this is the right move." (claimed, accountable)

When unsure, ask: is this describing what the team did/will do (we), or is this the writer putting their name on a position (I)?

### Permission to be slightly informal where it fits

These are seasoning words. Use sparingly:

- "kind of"
- "honestly"
- "the thing is"
- "fair point"
- "weirdly"
- "for what it's worth"
- "to be clear"
- "which, fine"

### Acknowledge the reader

Phrases that show you know someone is reading this:

- "If you've worked with..."
- "You probably already know..."
- "We've all had the experience of..."
- "Anyone who's been in [X] knows..."

## VOICE TARGET

After both passes, the text should read like:

> A smart colleague explaining something in a meeting — professional but approachable, direct without being cold, opinionated without being preachy. They use contractions, allow themselves the occasional aside, and mark their opinions as opinions. They aren't trying to sound impressive. They're trying to be understood.

**Mosaic brand reference (when applicable):** warm and genuine, never performative or salesy. Assume the reader may be nervous about walking in. No manufactured urgency, no church jargon, no pressure. Specific and practical beats inspirational.

## THREE-STATE BEFORE/AFTER EXAMPLES

The clearest way to see what `warm-voice` does is the three-state comparison: AI-default, dry humanizer pass, warm voice. Same content, three voices.

### Example 1 — Argument paragraph

**AI-default:**
> Reviewing in Figma creates a fundamental disconnect — stakeholders are commenting on a static representation rather than the actual product surface, which leads to translation loss, late-stage rework, and ultimately, fewer iterations of the highest-quality outcome.

**Dry humanizer:**
> Reviewing in Figma creates a disconnect. Stakeholders comment on a static representation, not the actual product surface. The result is translation loss and late-stage rework.

**Warm voice:**
> Here's the issue. When we review in Figma, stakeholders are commenting on a picture of the product, not the product. That gap is where most of our late-stage rework lives — those "wait, that's not how it looked in Figma" moments we've all had.

### Example 2 — Inline-header bullet list

**AI-default:**
> - **Speed:** Decisions get made faster.
> - **Quality:** Output quality improves.
> - **Cost:** We spend less.

**Dry humanizer:**
> Decisions get made faster. Output quality improves. We spend less.

**Warm voice:**
> Decisions land faster, the work gets better, and we spend less doing it. Honestly, the cost savings surprised me — I expected the speed and quality wins, but the savings ended up bigger than I'd guessed.

### Example 3 — Generic conclusion

**AI-default:**
> The future looks bright. Exciting times lie ahead as we embrace this transformative shift.

**Dry humanizer:**
> The shift is happening. We can keep pace.

**Warm voice:**
> I think this is the move. Worst case, we run the pilot and learn the design didn't fit. Best case, we get the team's first taste of what shipping at this speed actually feels like.

### Example 4 — Em-dash + tricolon

**AI-default:**
> The plan is low-risk, learnable, and reversible — we pilot, we learn, we scale — and we adjust as we go.

**Dry humanizer:**
> The plan is small and reversible. Pilot, learn, scale, adjust.

**Warm voice:**
> The plan is small and reversible. We pilot first, see what breaks, and adjust before scaling. If it falls apart in the pilot, we've spent a few weeks learning something useful.

## How to apply

1. Read the full text.
2. **Pass 1 (subtract):** Run through the AI-tell list. Remove patterns. Don't worry about the result reading dry — that's expected.
3. **Pass 2 (add):** Inject voice. Apply contractions, vary rhythm, allow asides where they earn their place, acknowledge the reader, mark opinions as opinions.
4. **Read aloud.** If you can't hear a real person saying the words, it failed. Common failures:
   - Voice markers feel inserted, not natural ("Honestly," at the start of every paragraph)
   - Too many asides — they should be rare and earned
   - Trying too hard — sliding into corporate-cool ("let's be real, folks")
5. **When in doubt, cut a voice marker rather than add one.** Subtraction stays human; over-addition reads as performative.

## Tone target check

After rewriting, ask: does this sound like a *specific person* I know talking, or like averaged corporate copy? If it's the latter, you've over-corrected — either toward dry-humanizer (Pass 2 didn't go far enough) or toward forced-warm (Pass 2 went too far).
