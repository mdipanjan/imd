import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('interactive figures share one visual scene base while retaining local layouts', async () => {
  const global = await source('src/styles/global.css');
  const figureStyles = await source('src/styles/figures.css');

  assert.match(global, /@import '\.\/figures\.css'/);
  assert.match(figureStyles, /\.technical-figure-scene \{/);
  assert.match(figureStyles, /--ink: #ede9df/);
  assert.match(figureStyles, /background: #202727/);

  for (const name of ['MemoryAccount', 'AppendLog', 'OffsetIndex', 'StorageStory']) {
    const figure = await source(`src/components/figures/${name}.astro`);
    assert.match(figure, /class="scene technical-figure-scene"/);
    assert.doesNotMatch(figure, /--ink: #ede9df|--memory-ink: #ede9df/);
  }
});
