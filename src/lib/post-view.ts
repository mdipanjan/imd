import type { CollectionEntry } from 'astro:content';

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
  tags: string[];
  annotations: PostAnnotation[];
};

export type PostLink = Pick<PostView, 'href' | 'title'>;

export const toPostView = (post: CollectionEntry<'posts'>): PostView => ({
  href: `/posts/${post.id}/`,
  title: post.data.title,
  description: post.data.description,
  date: post.data.date,
  updated: post.data.updated,
  tags: post.data.tags,
  annotations: post.data.annotations,
});

export const toPostLink = (post?: CollectionEntry<'posts'>): PostLink | undefined =>
  post ? { href: `/posts/${post.id}/`, title: post.data.title } : undefined;
