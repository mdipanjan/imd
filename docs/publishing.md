# Publishing a post

Create a `.md` or `.mdx` file in `src/content/posts/`. Its filename becomes the URL slug under `/posts/`. Use MDX when the article needs an Astro figure component.

```yaml
---
title: 'A clear title'
description: 'A short, standalone summary for previews and RSS.'
date: 2026-09-17
tags: [systems]
draft: true
toc: true
---
```

The required fields are `title`, `description`, and `date`. Optional fields are `updated`, `tags`, `draft`, `toc`, `cover`, and `annotations`; their definitions live in `src/content.config.ts`. Set `draft: true` while writing. Drafts have local preview routes, but are omitted from production pages and RSS. Remove it or set it to `false` to publish.

Published posts automatically appear in the newest-first Home, Archive, paginated list, latest-note navigation, and RSS feed. All of those surfaces use `src/lib/posts.mjs` for visibility, ordering, and paths. The RSS feed includes each article's title, description, date, and canonical link—not the interactive MDX body.

For an interactive article, import a figure near the top of the MDX body and place it between paragraphs. The storage-engine figures use shared playback controls (`figure-playback.mjs`), motion (`figure-motion.mjs`), layout reservation (`figure-space.mjs`), and scene styling (`src/styles/figures.css`). Keep each new figure's explanation and state specific to its topic. `StorageStory.astro` is the data-driven option: add a named story in `storage-stories.mjs`, then render `<StorageStory story="your-story-name" />` in MDX.

Run `pnpm build` before publishing. It checks Astro, runs the focused behavior tests, checks lint and formatting, and generates the static pages. Use `pnpm test` to run the tests alone.
