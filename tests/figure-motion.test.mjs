import assert from 'node:assert/strict';
import test from 'node:test';
import { createMotionPlayer } from '../src/components/figures/figure-motion.mjs';

test('shared figure motion respects reduced motion and cancels completed animation', async () => {
  const calls = [];
  const element = {
    animate(_frames, options) {
      calls.push(options);
      return { finished: Promise.resolve(), cancel: () => calls.push('cancelled') };
    },
  };
  const reduced = { matches: true };
  const play = createMotionPlayer(reduced);

  assert.equal(await play(element, [{ opacity: 0 }, { opacity: 1 }], 500), true);
  assert.equal(calls[0].duration, 0);
  assert.equal(calls[1], 'cancelled');
  assert.equal(await play(element, [{ opacity: 0 }, { opacity: 1 }], 500, false), true);
  assert.equal(calls[2].duration, 500);
});

test('interrupted motion returns false and still cleans up', async () => {
  let cancelled = false;
  const element = {
    animate() {
      return {
        finished: Promise.reject(new Error('interrupted')),
        cancel: () => {
          cancelled = true;
        },
      };
    },
  };

  assert.equal(await createMotionPlayer({ matches: false })(element, [], 200), false);
  assert.equal(cancelled, true);
});
