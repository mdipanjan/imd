import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readStyle = (name) => readFile(new URL(`../src/styles/${name}.css`, import.meta.url), 'utf8');
const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the production stylesheet loads each token concern before component styles', async () => {
  const styles = await readStyle('global');

  assert.match(
    styles,
    /^@import '\.\/tokens\.css';\n@import '\.\/themes\.css';\n@import '\.\/typography\.css';\n@import '\.\/layout\.css';/,
  );
});

test('Paper, Mineral, and Moss expose one semantic colour contract', async () => {
  const themes = await readStyle('themes');

  assert.match(themes, /:root,[\s\S]*html\[data-palette='paper'\]/);
  assert.match(themes, /html\[data-palette='mineral'\]/);
  assert.match(themes, /html\[data-palette='moss'\]/);

  for (const token of [
    'page',
    'surface',
    'text',
    'text-muted',
    'text-faint',
    'rule',
    'rule-strong',
    'accent',
    'revision',
    'code-surface',
    'selection',
  ]) {
    assert.match(themes, new RegExp(`--color-${token}:`));
  }

  assert.doesNotMatch(themes, /prefers-color-scheme:\s*dark/);
});

test('Field, Workbench, and Ledger expose one semantic typography contract', async () => {
  const typography = await readStyle('typography');

  assert.match(typography, /:root,[\s\S]*html\[data-typeface='field'\]/);
  assert.match(typography, /html\[data-typeface='workbench'\]/);
  assert.match(typography, /html\[data-typeface='ledger'\]/);

  for (const token of ['display', 'reading', 'interface', 'code']) {
    assert.match(typography, new RegExp(`--font-${token}:`));
  }
});

test('the production document declares Paper and Field as reviewable defaults', async () => {
  const layout = await readSource('src/layouts/BaseLayout.astro');

  assert.match(layout, /<html lang=\{site\.locale\} data-palette="paper" data-typeface="field">/);
});

test('layout tokens name the reading canvas and its supporting rails', async () => {
  const layout = await readStyle('layout');

  for (const token of ['site', 'prose', 'figure', 'index-rail', 'annotation-rail']) {
    assert.match(layout, new RegExp(`--width-${token}:`));
  }

  assert.match(layout, /--page-gutter:/);
});

test('production rules consume semantic colour, type, and layout tokens', async () => {
  const styles = await readStyle('global');

  assert.match(styles, /var\(--color-page\)/);
  assert.match(styles, /var\(--font-reading\)/);
  assert.match(styles, /var\(--width-site\)/);
  assert.doesNotMatch(
    styles,
    /var\(--(?:bg|surface|text|muted|faint|line|accent|font-sans|font-mono|shell|reading)\)/,
  );
  assert.doesNotMatch(styles, /#[\da-f]{3,8}\b/i);
});
