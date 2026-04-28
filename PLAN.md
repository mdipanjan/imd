# thoughts — Personal Blog Plan

## Goal

Build a small, long-lived personal blog inspired by:

- Armin Ronacher's blog: `lucumr.pocoo.org`
- Mario Zechner's site: `mariozechner.at`

The site should prioritize writing, readability, ownership, RSS, and low maintenance over framework complexity.

## Product Direction

`thoughts` should feel like a developer's personal notebook/public archive:

- homepage with recent posts
- individual post pages
- archive page
- about page
- RSS feed
- simple light/dark theme
- fast static output
- no tracking, no cookies, no database

## Recommended Stack

Use a modern static-site setup instead of building a custom generator first.

```txt
Astro
Markdown / MDX posts
Custom CSS
RSS plugin
Shiki or Expressive Code for syntax highlighting
Cloudflare Pages or GitHub Pages for hosting
```

Why Astro:

- static-first
- excellent Markdown/MDX support
- easy RSS generation
- no client-side JS by default
- simpler than Next.js for a blog
- easier to maintain than a custom generator

## Non-Goals

Avoid these in v1:

- comments
- login/auth
- CMS admin panel
- database
- analytics
- newsletter integration
- complex design system
- React-heavy interactivity
- custom static generator

## Site Structure

Target routes:

```txt
/                 recent posts + short intro
/archive/         all posts grouped by year
/about/           personal bio/contact
/posts/:slug/     individual post
/rss.xml          RSS feed
/404/             not found page
```

Possible later routes:

```txt
/projects/        selected projects
/notes/           shorter informal notes
/tags/:tag/       tag pages
```

## Repository Structure

```txt
thoughts/
  PLAN.md
  package.json
  astro.config.mjs
  src/
    content/
      posts/
        2026-04-28-first-post.md
    layouts/
      BaseLayout.astro
      PostLayout.astro
    pages/
      index.astro
      archive.astro
      about.md
      rss.xml.js
      404.astro
    styles/
      global.css
    components/
      Header.astro
      Footer.astro
      ThemeToggle.astro
      PostList.astro
  public/
    favicon.svg
```

## Post Format

Use Markdown frontmatter:

```md
---
title: 'Post Title'
description: 'Short summary for listings and feeds'
date: 2026-04-28
tags: [software, life]
draft: false
---

Post body...
```

Required fields for v1:

- `title`
- `description`
- `date`
- `draft`

Optional:

- `tags`
- `updated`

## Design Direction

Keep it closer to Mario/Armin than to a startup landing page.

### Layout

- centered column
- max width around `640px`–`760px`
- readable typography
- simple header navigation
- footer with RSS/contact links
- post list with date + title + summary

### Visual Style

- mostly text
- subtle color accent
- no cards unless needed
- no gradients-heavy hero
- no animation in v1
- light/dark theme using CSS variables

Example navigation:

```txt
thoughts    blog  archive  about  rss
```

## CSS Principles

Use one global CSS file first:

```txt
src/styles/global.css
```

Avoid Tailwind initially unless the project grows. Handwritten CSS keeps the site personal, portable, and easy to understand.

CSS features:

- CSS variables for colors
- `prefers-color-scheme` default
- optional manual theme toggle later
- good code block styling
- mobile-first spacing

## Content Collections

Use Astro content collections for type-safe posts:

```txt
src/content/config.ts
src/content/posts/*.md
```

This gives validation for frontmatter and clean querying for archive/RSS pages.

## Deployment Options

Preferred:

```txt
Cloudflare Pages
```

Alternative:

```txt
GitHub Pages
```

Cloudflare Pages is preferred because it is simple, fast, and works well with static Astro output.

## Build Commands

Expected commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Package scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  }
}
```

## Implementation Milestones

### Milestone 1 — Skeleton

- initialize Astro project
- add global layout
- add typography and base CSS
- create homepage
- create about page

### Milestone 2 — Blog Content

- configure content collections
- add first sample post
- render recent posts on homepage
- create post detail layout
- create archive page

### Milestone 3 — Feeds and Metadata

- add RSS feed
- add canonical URLs
- add Open Graph/Twitter metadata
- add favicon
- add 404 page

### Milestone 4 — Polish

- code highlighting
- dark/light theme
- responsive spacing pass
- accessibility pass
- deploy to Cloudflare Pages or GitHub Pages

## Quality Checklist

Before v1 is done:

- `npm run build` passes
- pages work without JavaScript
- RSS validates
- Lighthouse performance should be near 100
- mobile layout is readable
- no cookies/tracking
- post URLs are stable
- content is easy to write by adding one Markdown file

## Future Ideas

Only after v1:

- tags page
- projects page
- notes/micro-posts
- htmx-style enhanced navigation
- custom static generator experiment
- search page generated from static JSON
- social preview image generation

## Decision Log

- Start with Astro instead of a custom generator to reduce maintenance.
- Use Markdown/MDX as the content source.
- Use custom CSS instead of a UI framework.
- Keep the site static and privacy-preserving.
- Add custom tooling only after the writing workflow is proven.
