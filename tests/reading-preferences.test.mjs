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

test('the opened chooser presents palettes and typefaces as compact visual samples', async () => {
  const preferences = await readSource('src/components/ReadingPreferences.astro');

  assert.match(preferences, /<p class="reading-preferences__title">Reading preferences<\/p>/);
  assert.match(preferences, /<fieldset class="preference-group">/);
  assert.match(preferences, /<legend>Palette<\/legend>/);
  assert.match(preferences, /class="preference-option__swatch"/);
  assert.match(preferences, /class="preference-option__sample"/);
  assert.match(preferences, /\.preference-option\[aria-pressed='true'\]::after/);
  assert.match(preferences, /width: min\(23rem, calc\(100vw - 2rem\)\)/);
  assert.doesNotMatch(
    preferences,
    /\.reading-preferences\[open\] \.reading-preferences__close-icon/,
  );
});
