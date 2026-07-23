# Design System Template

Reference file for the `design-craft` skill. Provides templates for the persistent design system file (`memory/design-system.md`) and rules for when to create or upgrade it.

## Creation Rules

When to create a `memory/design-system.md` file in a project. These are inferred by fidelity — never prompt the user.

| Fidelity | Create? | Template |
|----------|---------|----------|
| **Lo-fi** | No. Wireframes are disposable. | — |
| **Mid-fi** | Only if project spans multiple sessions OR has 3+ pages/screens | Lightweight |
| **Hi-fi / Production** | Yes, on first skill activation | Full |
| **User-requested** | Yes, at any fidelity | Whichever matches current fidelity |

## Full Template (Hi-fi / Production)

```markdown
# Design System — [Project Name]

## Direction
- **Intent:** [who is the user, what must they accomplish, what should it feel like]
- **Fidelity:** [current level — hi-fi / production]
- **References:** [named products, styles, or aesthetics this draws from]
- **Anti-defaults:** [3 common choices consciously rejected and their replacements]

## Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-foreground` | | Primary text |
| `--color-foreground-secondary` | | Secondary text |
| `--color-foreground-muted` | | Captions, metadata |
| `--color-background` | | Page/app background |
| `--color-background-subtle` | | Cards, elevated surfaces |
| `--color-brand` | | Primary accent, CTAs |
| `--color-brand-subtle` | | Hover states, tags, badges |
| `--color-border` | | Default borders |
| `--color-border-subtle` | | Subtle dividers |
| `--color-destructive` | | Errors, delete actions |
| `--color-success` | | Confirmations, valid states |
| `--color-warning` | | Cautions, pending states |

### Typography
- **Heading family:** [font name]
- **Body family:** [font name]
- **Mono family:** [font name, if applicable]
- **Base size:** [e.g., 16px]
- **Scale ratio:** [e.g., 1.25 major third]
- **Scale:** [list computed sizes: muted/body/secondary/primary/display]

### Spacing
- **Base unit:** [e.g., 4px]
- **Scale:** [e.g., 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64]

### Radii
- **Scale:** [e.g., 2px / 4px / 8px / 12px / full]

### Shadows / Depth
- **Elevation levels:** [e.g., sm: 0 1px 2px rgba(0,0,0,0.05), md: 0 4px 6px rgba(0,0,0,0.07)]

## Component Patterns
[Document recurring patterns as they emerge]
- **Cards:** [border vs shadow, padding, radius]
- **Buttons:** [variants, sizing, states]
- **Inputs:** [border style, focus treatment, error style]
- **Navigation:** [pattern, active indicator]

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| | | |
```

## Lightweight Template (Mid-fi)

```markdown
# Design System — [Project Name]

## Direction
- **Intent:** [who, what, feeling]
- **References:** [named products or styles]

## Key Tokens
- **Colors:** [primary, secondary, accent, background — just the essentials]
- **Typography:** [heading family, body family, base size]
- **Spacing base:** [e.g., 8px]
```

## Upgrade Path

When a project escalates from lo-fi or mid-fi to hi-fi:

1. Create the full template at `memory/design-system.md`
2. Seed it with any design decisions already made in the session (colors chosen, fonts selected, spacing established)
3. Add an entry to `memory/MEMORY.md`:
   ```markdown
   | design-system.md | reference | Design tokens, direction, and decisions for [Project Name] |
   ```
4. If a lightweight file already exists, migrate its content into the full template and replace it

## What Gets Persisted

Save to the design system file:
- Token values (colors, spacing, typography, radii, shadows)
- Component-level patterns as they emerge (card style, button variants, input treatment)
- Design direction and intent answers
- Explicit decisions with rationale and dates

Do NOT save:
- Layout specifics (those live in code)
- Content decisions (those live in content files)
- One-off overrides (those are inline in components)
