---
title: 'First Thought'
description: 'A longer example post to prove the writing and scrolling rhythm.'
date: 2026-04-28
tags: [meta, writing]
annotations:
  - anchor: reading-measure
    label: Why this width?
    body: A comfortable line usually holds roughly forty to seventy characters. The exact number matters less than avoiding constant eye travel.
draft: false
toc: true
---

This is the first small post on this site. It is intentionally simple, but now it is long enough to test how the page feels when it scrolls.

The goal is not to build a complicated website. The goal is to make publishing feel almost boring:

1. create a Markdown file
2. write clearly
3. commit and deploy

If the system stays simple, it can last for years.

## Why this exists

A personal blog should not need much ceremony. It should be closer to a notebook than to a product. When there is too much structure, too many components, or too many design decisions, writing starts to feel like operating software instead of thinking in public.

The best blogs usually have a tiny surface area. They give you a title, a date, a body, and a way to keep reading. Everything else is optional.

That is the spirit of this site.

## The shape of the page

The page is <button class="annotation-trigger" type="button" data-annotation-trigger="reading-measure" aria-controls="annotation-reading-measure" aria-expanded="false">narrow on purpose<sup>01</sup></button>. A long line is hard to read. A short line feels more deliberate. Around forty to seventy characters per line is usually comfortable for essays, notes, and technical writing.

The vertical rhythm matters too. Paragraphs need enough space to breathe, but not so much that the text feels disconnected. Headings should create landmarks. Code blocks should stand apart without turning into heavy UI widgets.

This page is meant to test all of that.

## A note on taste

Taste often comes from subtraction. The first draft of a website usually has too much: too many colors, too many font sizes, too many sections, too many clever touches. The quieter version is often better.

For this blog, the rule is simple:

> If an element does not help someone read or find writing, it probably does not belong in version one.

That does not mean the site should be boring. It means the site should let small decisions carry the personality: the background color, the type, the link color, the spacing, the title.

## Example code

A post should also handle technical writing without needing a special layout.

```ts
type Post = {
  title: string;
  description: string;
  date: Date;
  tags: string[];
};

function isPublished(post: Post) {
  return post.date <= new Date();
}
```

Inline code like `pnpm dev` should be visible but not loud.

## What should stay boring

The publishing workflow should stay boring. Boring is good here. Boring means fewer excuses.

A good writing workflow looks like this:

1. open the posts folder
2. create a Markdown file
3. write the post
4. run the site locally
5. publish

No dashboards. No database. No plugin drama. No fragile admin panel.

## What can become interesting later

After the writing habit exists, the site can grow. It might get tags, project pages, social preview images, or tiny navigation enhancements. But none of those should come before the core loop works.

The core loop is:

```txt
thought → markdown → page → feed
```

That is enough for the beginning.

## Long-form feeling

The important test is whether this still feels comfortable after several screens of text. Does the header get out of the way? Does the footer feel natural at the end? Are links visible? Does the dark mode still feel warm? Does the line length make reading easy?

If the answer is yes, the theme is doing its job.

A personal blog is a long-term object. It should age well. The design should not depend too much on what is fashionable this year. It should still make sense when you open a post many years from now.

## Another small section

There is also a psychological side to minimal design. When the page is quiet, publishing feels lower pressure. You do not feel like every post needs to be a polished announcement. You can publish a note, a draft of an idea, a tiny observation, or a longer essay.

That range matters. The site should be able to hold both a two-paragraph thought and a detailed technical article.

## Ending

This is enough text to create a real scroll. The next step is to run the site locally and feel it in the browser.

If the scroll feels calm, readable, and unforced, then the foundation is right.
