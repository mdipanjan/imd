# Hybrid Journal Design Decision

**Status:** Accepted

**Decision date:** 3 September 2026

**Reference implementation:** `H — Hybrid Journal` in the visual-directions prototype

## Intent

The site is a personal technical journal: a place to publish evolving understanding, experiments,
revisions, and long-form interactive explanations.

It should feel editorial and personal rather than like a startup landing page, documentation portal,
or generic AI-generated portfolio. Reading remains the primary experience; interface elements should
support the writing without competing with it.

## Accepted Direction

The production design combines two validated prototype ideas:

- **Outer experience from A:** a spacious landing/index page organized around current
  investigations, changed beliefs, featured writing, and a chronological archive.
- **Inner experience from B:** a focused article canvas with a fixed left index, a central reading
  column, and contextual annotations on the right.

This combination is named **Hybrid Journal**. Variant H is the visual reference, not production code.
The production implementation must be rebuilt from the decisions below and the prototype removed
after parity is verified.

## Locked Design Choices

### Information architecture

- The landing page explains what Dipanjan is learning now before presenting the archive.
- Long-form posts use a persistent left index on wide screens.
- Revision notes, definitions, and related context may occupy a right annotation rail.
- Ordinary prose stays within a comfortable reading measure.
- Figures, code examples, and interactive explanations may break wider than prose.
- On narrow screens, supporting rails move into the article flow; prose remains primary.

### Visual character

- Quiet, editorial, and lightly technical.
- Restrained heading sizes and weights; no oversized marketing typography.
- Fine rules and spatial grouping instead of card-heavy layouts.
- Monospace is used for metadata and interface labels, not as a blanket terminal aesthetic.
- No decorative animation, gradients, or ornamental effects without a content purpose.
- Interactions must remain understandable without requiring visual spectacle.

### Reader controls

- Palette and reading typeface are reader preferences available from one subtle settings control.
- The controls stay hidden until requested and must be keyboard accessible.
- Reading content remains available when JavaScript is unavailable.
- The eventual production preference mechanism should persist locally; prototype URL parameters are
  not the production source of truth.

### Article vocabulary

The initial reusable article primitives are:

- prose and section headings
- figures with captions and optional source text
- syntax-highlighted code examples
- margin definitions revealed from an inline reference
- revision notes and editorial callouts
- interactive explanations with a consistent frame

An interactive explanation owns its subject-specific behavior. The shared frame owns presentation,
captioning, accessibility, and wide-layout behavior.

## Theme System Boundary

Production components consume semantic design tokens. They must not know palette names or duplicate
raw design values.

The token system will have three levels:

1. **Foundation tokens** — raw color, type, spacing, size, and motion scales.
2. **Semantic tokens** — roles such as page, surface, text, rule, accent, prose width, and reading font.
3. **Component tokens** — introduced only when a proven component cannot be expressed clearly with
   semantic tokens.

Use tokens for repeatable design decisions. Do not turn every one-off measurement into a token or
build speculative component abstractions.

## Palettes and Defaults

### Palette choices

- Paper
- Mineral
- Moss

All three remain supported studies. **Paper is the initial production default.** These are reading
palettes, not partial dark modes.

### Typeface choices

- Field
- Workbench
- Ledger

Manual was rejected. **Field is the initial production default.** Whether the final fonts are
self-hosted remains open until the typography is compared consistently across platforms.

## Explicitly Deferred

- A dedicated dark palette
- Additional article primitives without a real post that needs them
- Theme synchronization across devices
- A general-purpose component library
- Framework-heavy client-side interactivity
- Decorative page transitions

## Promotion Rules

- Build the design system in small, reviewable phases.
- Complete and review one phase before committing and beginning the next.
- Use one real post as the first end-to-end production slice.
- Preserve static rendering and progressive enhancement.
- Remove losing prototype variants, prototype controls, and the prototype route only after production
  parity is confirmed.

## Superseded Direction

This decision replaces the earlier technical-editorial theme based on an orange accent, sans-serif
body copy, automatic dark mode, and a single narrow reading layout.
