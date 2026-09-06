import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const relativeLuminance = (hex) => {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrast = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
};

test('small faint labels meet WCAG AA contrast in every palette', async () => {
  const themes = await readFile(new URL('../src/styles/themes.css', import.meta.url), 'utf8');

  for (const palette of ['paper', 'mineral', 'moss']) {
    const faint = themes.match(new RegExp(`--palette-${palette}-faint: (#[0-9a-f]{6})`))?.[1];
    const surface = themes.match(new RegExp(`--palette-${palette}-surface: (#[0-9a-f]{6})`))?.[1];

    assert.ok(faint && surface, `${palette} palette exposes faint and surface colors`);
    assert.ok(
      contrast(faint, surface) >= 4.5,
      `${palette} faint text contrast is ${contrast(faint, surface).toFixed(2)}:1`,
    );
  }
});
