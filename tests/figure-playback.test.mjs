import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createPlayback } from '../src/components/figures/figure-playback.mjs';

test('article figures offer one play/pause control without a nonresponsive Next button', async () => {
  for (const name of ['MemoryAccount', 'AppendLog', 'OffsetIndex', 'StorageStory']) {
    const figure = await readFile(
      new URL(`../src/components/figures/${name}.astro`, import.meta.url),
      'utf8',
    );
    assert.match(figure, /data-play/);
    assert.doesNotMatch(figure, /data-next|Next advances one operation/);
  }

  const playback = await readFile(
    new URL('../src/components/figures/figure-playback.mjs', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(playback, /data-next|addEventListener\('click', playback\.next\)/);
});

test('Play pauses between beats, resumes, and replays after ending', async () => {
  const events = [];
  const scheduled = new Map();
  let timerId = 0;
  const playback = createPlayback({
    steps: [() => events.push('first'), () => events.push('second')],
    reset: () => events.push('reset'),
    changed: (state) => events.push(state),
    schedule: (callback) => {
      scheduled.set(++timerId, callback);
      return timerId;
    },
    cancel: (id) => scheduled.delete(id),
  });
  const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };

  playback.toggle();
  await flush();
  assert.equal(events.includes('first'), true);
  assert.equal(scheduled.size, 1);

  playback.pause();
  assert.equal(scheduled.size, 0);
  assert.equal(events.includes('second'), false);

  playback.toggle();
  const nextBeat = [...scheduled.values()][0];
  scheduled.clear();
  nextBeat();
  await flush();
  assert.equal(events.includes('second'), true);
  assert.deepEqual(events.at(-1), { playing: false, ended: true });

  playback.toggle();
  await flush();
  assert.deepEqual(
    events.filter((event) => typeof event === 'string'),
    ['first', 'second', 'reset', 'first'],
  );
});
