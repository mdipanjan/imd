import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the header exposes the new editorial brand lockup', async () => {
  const header = await readSource('src/components/Header.astro');

  assert.match(header, /site-brand__mark/);
  assert.match(header, /aria-current/);
});

test('the home page uses the technical editorial composition', async () => {
  const home = await readSource('src/pages/index.astro');

  assert.match(home, /home-hero/);
  assert.match(home, /section-heading/);
});

test('the production shell consumes the Hybrid Journal token contract', async () => {
  const styles = await readSource('src/styles/global.css');

  assert.match(styles, /var\(--font-reading\)/);
  assert.match(styles, /var\(--font-interface\)/);
  assert.match(styles, /var\(--color-accent-soft\)/);
});
