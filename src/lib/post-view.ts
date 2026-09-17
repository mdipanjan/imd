import type { CollectionEntry } from 'astro:content';
import { postHref } from './posts.mjs';

export type PostAnnotation = {
  anchor: string;
  label: string;
  body: string;
};

export type PostView = {
  href: string;
  title: string;
  description: string;
  date: Date;
  updated?: Date;
  cover?: { src: string; alt: string; width: number; height: number };
  draft: boolean;
  tags: string[];
  annotations: PostAnnotation[];
};

export type PostLink = Pick<PostView, 'href' | 'title'>;

export const toPostView = (post: CollectionEntry<'posts'>): PostView => ({
  href: postHref(post),
  title: post.data.title,
  description: post.data.description,
  date: post.data.date,
  updated: post.data.updated,
  cover: post.data.cover,
  draft: post.data.draft,
  tags: post.data.tags,
  annotations: post.data.annotations,
});

export const toPostLink = (post?: CollectionEntry<'posts'>): PostLink | undefined =>
  post ? { href: postHref(post), title: post.data.title } : undefined;
