import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('post presentation components depend on reusable view models', async () => {
  const paths = [
    'src/components/home/FeaturedPost.astro',
    'src/components/home/PostIndex.astro',
    'src/components/PostNavigation.astro',
    'src/layouts/ArticleLayout.astro',
  ];

  for (const path of paths) {
    const source = await readSource(path);
    assert.doesNotMatch(source, /CollectionEntry/);
    assert.doesNotMatch(source, /post\.data/);
  }

  const models = await readSource('src/lib/post-view.ts');
  assert.match(models, /export type PostView/);
  assert.match(models, /export type PostLink/);
  assert.match(models, /export const toPostView/);
});

test('article metadata is rendered by a reusable semantic component', async () => {
  const header = await readSource('src/components/article/ArticleHeader.astro');
  const metadata = await readSource('src/components/MetadataList.astro');

  assert.match(header, /<MetadataList items=\{metadataItems\} \/>/);
  assert.match(metadata, /<dl class="metadata-list">/);
  assert.match(metadata, /datetime/);
});

test('shared date and taxonomy formatters keep labels consistent', async () => {
  const formatting = await readSource('src/lib/format.ts');
  const featured = await readSource('src/components/home/FeaturedPost.astro');
  const index = await readSource('src/components/home/PostIndex.astro');

  assert.match(formatting, /export const formatLongDate/);
  assert.match(formatting, /export const formatShortDate/);
  assert.match(formatting, /export const formatTaxonomy/);
  assert.match(featured, /formatTaxonomy/);
  assert.match(index, /formatShortDate/);
});
