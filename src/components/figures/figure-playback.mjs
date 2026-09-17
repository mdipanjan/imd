export function createPlayback({
  steps,
  reset,
  changed,
  animations = () => [],
  now = () => performance.now(),
  schedule = setTimeout,
  cancel = clearTimeout,
  hold = 1400,
}) {
  let position = 0,
    busy = false,
    automatic = false,
    paused = true,
    pending = null;
  const timers = new Set();
  let frozen = [];
  const ended = () => position === steps.length && !busy;
  const notify = () => changed({ playing: !paused && (automatic || busy), ended: ended() });
  function arm(timer) {
    timer.started = now();
    timer.id = schedule(() => {
      timers.delete(timer);
      timer.action();
    }, timer.remaining);
  }
  function later(action, duration) {
    const timer = { action, remaining: duration, started: 0, id: null };
    timers.add(timer);
    if (!paused) arm(timer);
    return timer;
  }
  function resume() {
    if (!paused) return;
    paused = false;
    for (const timer of timers) arm(timer);
    frozen.forEach((animation) => animation.play());
    frozen = [];
  }
  function pause() {
    if (paused) return;
    paused = true;
    for (const timer of timers) {
      cancel(timer.id);
      timer.remaining = Math.max(0, timer.remaining - (now() - timer.started));
    }
    frozen = animations().filter((animation) => animation.playState === 'running');
    frozen.forEach((animation) => animation.pause());
    notify();
  }
  async function advance() {
    if (busy || ended()) return;
    busy = true;
    notify();
    await steps[position]();
    position++;
    busy = false;
    if (ended()) automatic = false;
    if (automatic)
      pending = later(() => {
        pending = null;
        void advance();
      }, hold);
    notify();
  }
  function toggle() {
    if (!paused && (automatic || busy)) return pause();
    if (ended()) {
      reset();
      position = 0;
    }
    automatic = true;
    resume();
    if (!busy && !pending) void advance();
    notify();
  }
  notify();
  return { later, toggle, pause };
}

export function bindPlayback(figure, steps, reset) {
  const play = figure.querySelector('[data-play]');
  const playback = createPlayback({
    steps,
    reset,
    animations: () => figure.getAnimations({ subtree: true }),
    changed: ({ playing, ended }) => {
      play.textContent = playing ? 'Pause' : ended ? 'Replay' : 'Play';
      play.setAttribute('aria-pressed', String(playing));
    },
  });
  play.addEventListener('click', playback.toggle);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) playback.pause();
  });
  figure.querySelector('[data-controls]').hidden = false;
  return playback;
}
