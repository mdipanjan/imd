import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the production header exposes working palette and typeface preferences', async () => {
  const header = await readSource('src/components/Header.astro');

  assert.match(header, /import ReadingPreferences/);
  assert.match(header, /<ReadingPreferences \/>/);
});

test('reading preferences update semantic document attributes and persist them', async () => {
  const preferences = await readSource('src/components/ReadingPreferences.astro');
  const layout = await readSource('src/layouts/BaseLayout.astro');

  assert.match(preferences, /<details class="reading-preferences">/);
  assert.match(preferences, /value: 'paper'/);
  assert.match(preferences, /data-palette-option=\{value\}/);
  assert.match(preferences, /value: 'field'/);
  assert.match(preferences, /data-typeface-option=\{value\}/);
  assert.match(preferences, /dataset\.palette/);
  assert.match(preferences, /dataset\.typeface/);
  assert.match(preferences, /localStorage\.setItem/);
  assert.match(layout, /localStorage\.getItem/);
});
