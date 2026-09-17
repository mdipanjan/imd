/**
 * The animation resolves only when its authored motion finishes. A cancelled
 * animation leaves the figure on its current step, and is always cleaned up.
 * @param {{ matches: boolean }} reducedMotion
 */
export function createMotionPlayer(reducedMotion) {
  /**
   * @param {HTMLElement} element
   * @param {Keyframe[]} frames
   * @param {number} duration
   * @param {boolean} [motion]
   */
  return async function play(element, frames, duration, motion = true) {
    const animation = element.animate(frames, {
      duration: motion && reducedMotion.matches ? 0 : duration,
      easing: 'cubic-bezier(.4,0,.2,1)',
      fill: 'forwards',
    });
    try {
      await animation.finished;
      return true;
    } catch {
      return false;
    } finally {
      animation.cancel();
    }
  };
}
