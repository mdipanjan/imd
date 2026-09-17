import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('About introduces the author through published work and Zero without revealing the method', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');

  assert.match(about, /How to Build an LSM Tree/);
  assert.match(about, /Zero/);
  assert.match(about, /how we verify code at scale/);
  assert.doesNotMatch(about, /deterministic simulation testing/);
  assert.doesNotMatch(about, /Quill/);
  assert.match(about, /href="\/rss\.xml"/);
});

test('About explains why Dipanjan uses visual figures to understand systems', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');

  assert.match(about, /Feynman’s visual way of thinking resonated with me/);
  assert.match(about, /I understand systems best when I can\s+picture them/);
  assert.match(about, /diagrams and interactive figures in these notes/);
  assert.doesNotMatch(about, /I hope they help you/);
  assert.doesNotMatch(about, /I use code and interactive figures when they help/);
});

test('About does not repeat the site owner’s name in its introduction', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');

  assert.match(about, /eyebrow="Behind the notes"/);
  assert.match(
    about,
    /lede="I’m a software engineer interested in how systems work beneath the API\."/,
  );
});

test('About uses the shared interior shell in its prose layout, without an index rail', async () => {
  const about = await readFile(new URL('../src/pages/about.astro', import.meta.url), 'utf8');
  const layout = await readFile(
    new URL('../src/layouts/InteriorPageLayout.astro', import.meta.url),
    'utf8',
  );
  const introduction = await readFile(
    new URL('../src/components/journal/PageIntroduction.astro', import.meta.url),
    'utf8',
  );

  assert.match(about, /<InteriorPageLayout/);
  assert.doesNotMatch(about, /\brail=\{/);
  assert.match(layout, /const prose = !rail/);
  assert.match(introduction, /page-introduction--prose/);
});

test('About prose keeps its introduction and body in one centered reading column', async () => {
  const layout = await readFile(
    new URL('../src/layouts/InteriorPageLayout.astro', import.meta.url),
    'utf8',
  );
  const introduction = await readFile(
    new URL('../src/components/journal/PageIntroduction.astro', import.meta.url),
    'utf8',
  );

  assert.match(introduction, /\.page-introduction--prose\s*\{[^}]*margin-inline:\s*auto/s);
  assert.match(
    layout,
    /\.interior-page__body--prose \.interior-page__content\s*\{[^}]*margin-inline:\s*auto/s,
  );
});
