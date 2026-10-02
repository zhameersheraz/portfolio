/**
 * Deliberate scroll-to-top for navigation.
 *
 * `scroll-behavior: smooth` in globals.css does not help here. It only covers
 * in-page anchors and programmatic scrolls on the same document. Clicking a
 * nav link is a Next.js client-side route change, and the new route mounts at
 * scroll position 0 in one frame, so it snapped to the top every time.
 *
 * rAF + an ease curve is used instead of the browser's built-in smooth scroll
 * because the default is quick and linear-feeling. This is a touch slower on
 * purpose so the movement reads as intentional.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED).matches;
}

// easeInOutCubic: slow start, quick middle, gentle settle.
function ease(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/**
 * Scrolls the window to the top and resolves when it lands.
 * Resolves immediately if already at the top or if the visitor asked for
 * reduced motion, so this never adds a delay it does not need to.
 */
export function scrollToTop(duration = 520): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const start = window.scrollY;
  if (start <= 0 || prefersReducedMotion()) {
    window.scrollTo(0, 0);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const t0 = performance.now();

    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start * (1 - ease(p)));
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}
