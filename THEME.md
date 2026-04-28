# Theme Decision

## Name

Warm paper minimalism.

## Intent

A quiet, readable personal blog theme inspired by old developer blogs and personal notebooks.

The site should feel like a place for writing, not a product landing page.

## Choices

- Off-white paper background in light mode
- Near-black ink text
- Muted rust accent for links
- Dark mode via `prefers-color-scheme`
- Narrow reading column around `42rem`
- Serif system font stack
- No cards, shadows, gradients, or heavy animation
- No JavaScript required for reading

## Palette

Light:

```txt
background  #fbf7ef
text        #1f1b16
muted       #766c61
line        #e5dacb
accent      #9f4f2f
code bg     #f0e8dc
```

Dark:

```txt
background  #171411
text        #eee4d6
muted       #a99c8e
line        #342d26
accent      #e09568
code bg     #241f1a
```

## Typography

Use system serif fonts:

```css
ui-serif, Georgia, Cambria, "Times New Roman", Times, serif
```

Rationale: fast, readable, durable, and personal.
