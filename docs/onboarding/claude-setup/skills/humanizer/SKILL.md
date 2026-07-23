---
name: humanizer
description: "Removes signs of AI-generated writing from text. Use when asked to humanize text, remove AI voice, make writing sound less corporate/robotic, or when text reads as AI-generated. Based on Wikipedia's Signs of AI Writing guide (24 patterns)."
source: https://github.com/blader/humanizer
license: MIT
---

# Humanizer Skill

Remove signs of AI-generated writing by fixing these 24 patterns. Apply ALL that are present.

## CONTENT PATTERNS

**1. Significance inflation** — Remove grandiose framing
- BAD: "marking a pivotal moment in the evolution of..."
- GOOD: Specific facts about what actually happened

**2. Notability name-dropping** — Replace with actual citations
- BAD: "cited in NYT, BBC, FT, and The Hindu"
- GOOD: "In a 2024 NYT interview, she argued..."

**3. Superficial -ing analyses** — Remove or expand with sources
- BAD: "symbolizing... reflecting... showcasing..."
- GOOD: Remove unless you can back it up with specifics

**4. Promotional language** — Deflate adjectives
- BAD: "nestled within the breathtaking region"
- GOOD: "is a town in the Gonder region"

**5. Vague attributions** — Be specific or cut
- BAD: "Experts believe it plays a crucial role"
- GOOD: "according to a 2019 survey by..."

**6. Formulaic challenges** — Replace with specifics
- BAD: "Despite challenges... continues to thrive"
- GOOD: Specific facts about actual challenges

## LANGUAGE PATTERNS

**7. AI vocabulary** — Eliminate these words: Additionally, testament, landscape, showcasing, groundbreaking, transformative, pivotal, crucial, vital, robust, seamless, cutting-edge, revolutionary, innovative, foster, leverage, synergy, paradigm, holistic, streamline, empower
- Replace with plain language or cut entirely

**8. Copula avoidance** — Use direct verbs
- BAD: "serves as... features... boasts"
- GOOD: "is... has"

**9. Negative parallelisms** — State directly
- BAD: "It's not just X, it's Y"
- GOOD: Just say Y

**10. Rule of three** — Use natural number of items
- BAD: "innovation, inspiration, and insights"
- GOOD: Use however many items actually belong

**11. Synonym cycling** — Repeat the clearest word
- BAD: "protagonist... main character... central figure... hero"
- GOOD: Pick one and stick with it

**12. False ranges** — List topics directly
- BAD: "from the Big Bang to dark matter"
- GOOD: List the topics

## STYLE PATTERNS

**13. Em dash overuse** — Replace with commas or periods
- BAD: "institutions—not the people—yet this continues—"
- GOOD: Use commas or restructure

**14. Boldface overuse** — Remove bolding from inline terms unless truly critical
- BAD: "**OKRs**, **KPIs**, **BMC**"
- GOOD: "OKRs, KPIs, BMC"

**15. Inline-header lists** — Convert to prose
- BAD: "**Performance:** Performance improved significantly."
- GOOD: "Performance improved significantly."

**16. Title Case Headings** — Sentence case only
- BAD: "Strategic Negotiations And Partnerships"
- GOOD: "Strategic negotiations and partnerships"

**17. Emojis** — Remove all emojis from professional/document content

**18. Curly quotes** — Use straight quotes in code/technical contexts

## COMMUNICATION PATTERNS

**19. Chatbot artifacts** — Delete entirely
- Cut: "I hope this helps!", "Let me know if you have questions!", "Feel free to reach out", "Happy to help"

**20. Cutoff disclaimers** — Cut or find sources
- Cut: "While details are limited based on available information..."

**21. Sycophantic tone** — Respond directly
- Cut: "Great question!", "You're absolutely right!", "Absolutely!"

## FILLER AND HEDGING

**22. Filler phrases** — Replace with direct language
- "In order to" → "To"
- "Due to the fact that" → "Because"
- "At this point in time" → "Now"
- "In the event that" → "If"
- "It is important to note that" → Cut or just say the thing
- "It is worth mentioning that" → Cut
- "As previously mentioned" → Cut

**23. Excessive hedging** — Simplify
- "could potentially possibly" → "may"
- "might potentially" → "might"
- Double hedges → single hedge

**24. Generic conclusions** — Replace with specific facts or plans
- BAD: "The future looks bright. Exciting times lie ahead."
- GOOD: Specific next steps, facts, or just end

## HOW TO APPLY

1. Read the full text
2. Identify all 24 pattern violations
3. Fix them in order of severity — content first, then language, then style
4. Preserve the author's meaning and any genuine specifics
5. Do NOT add new content or change facts
6. Shorter is usually better after humanizing

## TONE TARGET

After humanizing, the text should read like a smart person wrote it in their own voice — direct, specific, no filler, no inflation. The before/after test: does it sound like something a specific human would actually say, or like averaged corporate language?
