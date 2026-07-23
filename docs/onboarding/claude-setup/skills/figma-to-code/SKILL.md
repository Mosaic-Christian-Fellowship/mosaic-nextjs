---
name: figma-to-code
description: Enforces pixel-faithful reproduction of Figma designs. Prevents creative liberties, substitutions, and approximations. Every value comes from the design file — never from assumption.
---

# Figma-to-Code Fidelity Skill

## Core Principle

**The Figma file is the single source of truth.** Your job is reproduction, not interpretation. When the design specifies something, match it exactly. When something is ambiguous, screenshot and cross-reference — never guess.

## Hard Rules

### 1. NEVER SUBSTITUTE ASSETS
- **Icons:** Use the actual SVG/PNG from Figma. Never hand-code an SVG "close enough" replacement. Never use icon libraries (Phosphor, Lucide, Heroicons) as stand-ins for Figma assets.
- **Images:** Use the exact image from the design. Download via Figma MCP asset URLs. Never use placeholder images, stock photos, or gradient boxes in place of real assets.
- **Logos:** Extract the actual logo assets. Never approximate with text or simplified SVGs.
- **If an asset fails to download:** Flag it explicitly. Do not silently replace it.

### 2. EXTRACT EXACT VALUES
Every visual property must come from the Figma file, not from estimation:

- **Colors:** Use the exact hex/rgba values from the design context. Never "close enough" colors. Pay attention to opacity values — `rgba(0,0,0,0.93)` is not `#111`.
- **Typography:** Match font-family, font-weight, font-size, line-height, letter-spacing exactly. If the design says Montserrat ExtraBold 52px with -0.78px tracking, that's what gets coded.
- **Spacing:** Use the exact padding, margin, and gap values from the design. Don't round 83px to 80px. Don't "normalize" spacing to a scale.
- **Border radius:** Match exactly. 24px is not 20px. 16px is not 12px.
- **Gradients:** Reproduce the full gradient definition — type (linear/radial), angle, color stops, and stop positions. A gradient border is not a solid border.
- **Shadows:** Match blur, spread, offset, and color exactly.
- **Opacity:** Match layer and element opacity values precisely.

### 3. MATCH LAYOUTS EXACTLY
- **Flex vs Grid:** Use whichever layout model the design implies, but match the visual result exactly. If 4 cards sit in a row with equal spacing, that's what gets built.
- **Alignment:** Left-aligned is not centered. Space-between is not space-around. Match the design.
- **Element order:** The visual stacking and reading order must match the design. Don't reorder sections.
- **Responsive behavior:** If the Figma file has responsive variants, match them. If it doesn't, build reasonable breakpoints but flag that they're inferred, not designed.

### 4. MATCH COMPONENT STRUCTURE
- **Nesting:** If the design shows a card with an image on the left and text on the right, build it that way. Don't stack them vertically because it's "simpler."
- **Decorative elements:** Background patterns, wavy lines, gradient overlays, radial glows — these are part of the design. Reproduce them.
- **States:** Hover states, active states, selected states — extract and implement all visible states from the Figma file.
- **Interactions:** If the design shows interactive states (selected tabs, expanded panels), implement the interaction to match the visual states exactly.

### 5. VISUAL VALIDATION IS MANDATORY
After building each major section:

1. **Screenshot the Figma design** (`get_screenshot` with the relevant node)
2. **Screenshot your build** (or visually describe it)
3. **Compare systematically:** Check colors, spacing, typography, asset placement, layout structure, background treatments
4. **Fix discrepancies** before moving to the next section
5. **Never skip this step** — even if you're confident

### 6. FIGMA MCP TOOL SELECTION (CRITICAL)
- **NEVER use `get_metadata`** — it has a known bug that returns instructional text instead of data, and frequently hangs Claude Code indefinitely (no timeout protection).
- **Use `get_screenshot`** as the primary tool — it is the most reliable of all Figma MCP tools.
- **Use `get_design_context`** on small, specific nodes only — never on full pages or deeply nested frames. It can return 350K+ tokens on complex frames, causing truncation or silent failure.
- **Preferred workflow**: `get_screenshot` first for visual reference, then `get_design_context` on individual sections/components.
- **Cloud MCP (`claude.ai Figma`)** does not require Figma desktop app open. **Local MCP (`figma-console`)** requires the file to be active and in focus.
- **If an MCP call hangs**: Do not retry indefinitely. Flag to the user that the MCP connection may be stale and suggest restarting Claude Code.

### 7. SECTION-BY-SECTION WORKFLOW
When building from a Figma file:

1. **Get the full page screenshot first** — understand the complete design before starting
2. **Identify sections visually** from the screenshot (do NOT use `get_metadata` to discover nodes)
3. **Build section by section**, top to bottom
4. **For each section:**
   a. Call `get_screenshot` on the specific node for visual reference
   b. Call `get_design_context` on the specific node (small scope only)
   c. Extract all assets (images, icons, SVGs) for that section
   d. Build the HTML/CSS matching the extracted code + screenshot
   e. Cross-check: Does my output match the screenshot?
5. **After full assembly:** Compare the complete page against the full page screenshot

### 8. ASSET MANAGEMENT
- **Download ALL assets before building.** Don't discover missing assets mid-build.
- **Name assets descriptively** based on their role (e.g., `hero-photo.png`, `trustpilot-logo.svg`, not `image-1.png`).
- **Verify downloads:** Check file sizes. 0-byte files mean the download failed (likely a redirect issue — use `curl -sL`).
- **Map assets to sections:** Before building, create a clear mapping of which asset goes where in the design.
- **Preserve aspect ratios:** Never stretch or distort images. Use `object-fit: cover` or `object-fit: contain` as appropriate, matching the Figma behavior.

### 9. BACKGROUND TREATMENTS
Backgrounds are first-class design elements, not optional decoration:
- **Background images:** Extract and use them. Wavy patterns, textures, gradient meshes — these define the visual tone.
- **Background gradients:** Reproduce the full gradient spec. Radial gradients with specific transforms are not interchangeable with linear gradients.
- **Layered backgrounds:** If the design layers multiple backgrounds (image + gradient overlay + blur), reproduce all layers.
- **Background sizing/position:** Match `background-size`, `background-position`, and `background-repeat` to the design.

### 10. WHEN DELEGATING TO AGENTS
If using Agent Teams to build sections in parallel:

- **Each agent gets the section screenshot** — not just the code extract
- **Each agent gets the full asset list** with clear mapping of which assets belong to their section
- **Each agent must cross-reference** their output against the screenshot before reporting done
- **The lead agent must do a full visual QA pass** on the assembled result, comparing each section against its Figma screenshot
- **Agents must flag deviations** rather than improvising. If an asset is missing or a spec is unclear, escalate — don't substitute.

### 11. WHAT TO DO WHEN UNCERTAIN
- **Uncertain about a color?** Screenshot the Figma node and extract from the design context JSON.
- **Uncertain about a layout?** Screenshot the specific section at higher zoom.
- **Uncertain about an interaction?** Check if the Figma file has prototype flows or component variants.
- **Asset not downloading?** Try alternative extraction methods. Flag it explicitly in the output.
- **Design context code doesn't match the screenshot?** Trust the screenshot. The MCP code output is a reference, not gospel.

## Banned Patterns

These are hard failures — never do any of these:

| Pattern | Why it's wrong |
|---|---|
| Hand-coding SVG icons instead of using Figma assets | Produces visual mismatches in stroke width, proportions, and style |
| Using icon libraries as substitutes | Different design language than what was designed |
| Replacing gradient borders with solid borders | Loses visual richness the designer intended |
| Omitting background patterns/textures | Changes the entire visual tone of a section |
| Rearranging element order within a section | Breaks the designer's visual hierarchy |
| Approximating colors ("close enough" hex) | Cumulative drift makes the whole page feel off |
| Guessing at spacing values | Inconsistencies compound across sections |
| Replacing real photos with placeholder boxes | Destroys the intended visual impact |
| Merging or splitting sections that the design keeps separate | Changes the information architecture |
| "Improving" the design (different layout, "better" spacing) | The design is the spec. Reproduce it. |

## Quality Checklist (Run Before Delivery)

Before marking a Figma-to-code task as complete, verify every item:

- [ ] Every image/icon in the Figma file appears in the build using the actual asset
- [ ] All colors match exactly (spot-check at least 5 key colors)
- [ ] Typography matches: font-family, weight, size, line-height, letter-spacing
- [ ] Layout structure matches: flex/grid direction, alignment, gap values
- [ ] Background treatments are present: patterns, gradients, overlays, blurs
- [ ] Border treatments match: radius, width, color, style (solid vs gradient)
- [ ] Interactive states work and visually match the Figma states
- [ ] No icon library substitutions anywhere
- [ ] No "creative improvements" or reinterpretations
- [ ] Full-page screenshot comparison done against Figma source
