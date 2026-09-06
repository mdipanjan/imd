import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('small laptops release the annotation rail before the reading measure becomes cramped', async () => {
  const layout = await readSource('src/layouts/ArticleLayout.astro');
  const annotations = await readSource('src/components/article/AnnotationRail.astro');

  assert.match(layout, /@media \(max-width: 1180px\)/);
  assert.match(
    layout,
    /@media \(max-width: 1180px\)[\s\S]*grid-template-columns:\s*12rem minmax\(0, 1fr\)/,
  );
  assert.match(annotations, /@media \(max-width: 1180px\)[\s\S]*position: fixed/);
});

test('tablets replace the fixed index rail with an in-flow contents disclosure', async () => {
  const layout = await readSource('src/layouts/ArticleLayout.astro');
  const index = await readSource('src/components/article/ArticleIndexRail.astro');

  assert.match(layout, /variant="rail"/);
  assert.match(layout, /variant="disclosure"/);
  assert.match(index, /variant\?: 'rail' \| 'disclosure'/);
  assert.match(index, /<details[^>]*class="article-index-disclosure"/);
  assert.match(
    index,
    /@media \(max-width: 900px\)[\s\S]*\.article-index-rail\s*\{[\s\S]*display: none/,
  );
  assert.match(
    index,
    /@media \(max-width: 900px\)[\s\S]*\.article-index-disclosure\s*\{[\s\S]*display: block/,
  );
  assert.doesNotMatch(index, /date: Date/);
  assert.doesNotMatch(index, /context: string/);
});

test('the home composition changes before its featured columns become narrow', async () => {
  const home = await readSource('src/pages/index.astro');
  const introduction = await readSource('src/components/home/HomeIntroduction.astro');
  const focus = await readSource('src/components/home/CurrentFocus.astro');
  const featured = await readSource('src/components/home/FeaturedPost.astro');

  for (const source of [home, introduction, focus, featured]) {
    assert.match(source, /@media \(max-width: 900px\)/);
  }
});

test('compact navigation keeps every primary destination available', async () => {
  const header = await readSource('src/components/Header.astro');
  const styles = await readSource('src/styles/global.css');

  assert.match(header, /class="site-nav-menu"/);
  assert.match(header, /aria-label="Compact navigation"/);
  assert.match(styles, /@media \(max-width: 620px\)[\s\S]*\.site-nav-menu/);
  assert.doesNotMatch(styles, /\.site-nav a:not\(:first-child\)/);
});

test('a single published post does not render an empty recent-notes section', async () => {
  const home = await readSource('src/pages/index.astro');

  assert.match(home, /postViews\.length > 1 &&/);
});

test('compact controls retain touch targets and visible keyboard focus', async () => {
  const preferences = await readSource('src/components/ReadingPreferences.astro');
  const styles = await readSource('src/styles/global.css');

  assert.match(preferences, /min-width: 2\.75rem/);
  assert.match(preferences, /min-height: 2\.75rem/);
  assert.match(styles, /:where\(button, summary\):focus-visible[\s\S]*outline: 2px solid/);
});

test('article anchors remain legible navigation targets', async () => {
  const layout = await readSource('src/layouts/ArticleLayout.astro');

  assert.match(layout, /article-prose :is\(h2, h3\)[\s\S]*scroll-margin-top/);
});
