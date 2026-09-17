import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { POSTS_PER_PAGE, postHref, selectPosts } from '../src/lib/posts.mjs';

const post = (id, day, draft = false) => ({
  id,
  data: { date: new Date(`2026-09-${day}T00:00:00Z`), draft },
});

test('published posts exclude drafts and sort newest first with stable same-day ordering', () => {
  const posts = [
    post('older', '09'),
    post('z-new', '12'),
    post('draft', '13', true),
    post('a-new', '12'),
  ];

  assert.deepEqual(
    selectPosts(posts).map(({ id }) => id),
    ['a-new', 'z-new', 'older'],
  );
  assert.deepEqual(
    selectPosts(posts, { includeDrafts: true }).map(({ id }) => id),
    ['draft', 'a-new', 'z-new', 'older'],
  );
  assert.deepEqual(
    posts.map(({ id }) => id),
    ['older', 'z-new', 'draft', 'a-new'],
  );
});

test('every post surface shares the canonical post path and page size', async () => {
  assert.equal(postHref({ id: 'an-entry' }), '/posts/an-entry/');
  assert.equal(POSTS_PER_PAGE, 8);

  const paths = [
    'src/pages/index.astro',
    'src/pages/archive.astro',
    'src/pages/page/[page].astro',
    'src/pages/posts/[...slug].astro',
    'src/pages/rss.xml.js',
    'src/components/Header.astro',
  ];
  for (const path of paths) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(source, /selectPosts/);
  }
});

test('the RSS handler uses published posts, canonical links, and the site description', async () => {
  const source = await readFile(new URL('../src/pages/rss.xml.js', import.meta.url), 'utf8');

  assert.match(source, /selectPosts\(await getCollection\('posts'\)\)/);
  assert.match(source, /link: postHref\(post\)/);
  assert.match(source, /description: site\.description/);
});

test('site URL and description have one source for pages, RSS, and sitemap', async () => {
  const site = await readFile(new URL('../src/lib/site.ts', import.meta.url), 'utf8');
  const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

  assert.match(site, /How software works, and the tools I’m building to make it better/);
  assert.match(config, /site: site\.url/);
  assert.match(home, /<HomeLayout description=\{site\.description\}/);
});
