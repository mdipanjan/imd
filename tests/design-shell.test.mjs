import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the header preserves the approved quiet Hybrid Journal composition', async () => {
  const header = await readSource('src/components/Header.astro');
  const layout = await readSource('src/layouts/BaseLayout.astro');
  const styles = await readSource('src/styles/global.css');

  assert.match(header, /An editable record of what I understand/);
  assert.match(header, /Dipanjan’s working notes/);
  assert.match(header, /Latest note/);
  assert.match(header, /Revisions/);
  assert.match(header, /ReadingPreferences/);
  assert.match(header, /aria-current/);
  assert.doesNotMatch(header, /site-brand__mark/);
  assert.match(layout, /variant=\{type === 'article' \? 'article' : 'journal'\}/);
  assert.match(styles, /\.site-header__inner \{[\s\S]*padding-inline: var\(--space-5\)/);
});

test('the home page composes the Hybrid Journal landing sections', async () => {
  const home = await readSource('src/pages/index.astro');

  assert.match(home, /HomeIntroduction/);
  assert.match(home, /CurrentFocus/);
  assert.match(home, /FeaturedPost/);
  assert.match(home, /PostIndex/);
});

test('the footer closes the journal with compact navigation and quiet metadata', async () => {
  const footer = await readSource('src/components/Footer.astro');
  const styles = await readSource('src/styles/global.css');

  assert.match(footer, /aria-label="Footer"/);
  assert.match(footer, /href="\/archive\/"/);
  assert.match(footer, /href="\/about\/"/);
  assert.match(footer, /href="#top"/);
  assert.match(styles, /\.site-footer__closing/);
  assert.match(styles, /\.site-footer__meta \{[^}]*border-top:/);
  assert.doesNotMatch(styles, /\.site-footer__meta \{[^}]*text-transform: uppercase/);
});

test('the production shell consumes the Hybrid Journal token contract', async () => {
  const styles = await readSource('src/styles/global.css');

  assert.match(styles, /var\(--font-reading\)/);
  assert.match(styles, /var\(--font-interface\)/);
  assert.match(styles, /var\(--color-page\)/);
  assert.match(styles, /var\(--color-rule\)/);
});
