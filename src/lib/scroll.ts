/**
 * Nav scroll behaviour.
 *
 * `scroll-behavior: smooth` in globals.css does not cover this. It only
 * applies to in-page anchors and scrolls within the same document. A nav link
 * is a client-side route change, and the new route mounts at scroll 0 in a
 * single frame, so it snapped to the top.
 *
 * Two approaches were tried and measured in a real browser:
 *
 *   1. Navigate first, then animate the NEW page up from the old offset, in a
 *      useLayoutEffect. Failed. rAF sampling showed the new page painting once
 *      at scroll 0 before the effect's scrollTo landed, so the visitor saw a
 *      flash of the new page at the top, then a drop back down, then the
 *      animation. Two visible jumps instead of none.
 *
 *   2. Animate on the OLD page, then navigate. This is the one that works,
 *      because the scroll finishes at 0 and the next route renders at 0, so
 *      the swap is invisible. The first attempt at this felt like "a delay
 *      then a jump", and the cause was the curve, not the approach:
 *      easeInOutCubic starts at zero velocity, so the first ~100ms showed
 *      nothing moving, which read as lag.
 *
 *      Fixed by using easeOutQuad: the page starts rising the instant the link
 *      is clicked and decelerates into the top. Same timing, no dead pause.
 */

// Only used for document scrolls, so the browser's own smooth behaviour would
// double up with the rAF curve below.
function withInstantScroll<T>(fn: () => T): T {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  try {
    return fn();
  } finally {
    root.style.scrollBehavior = prev;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// easeOutQuad: full speed at the start, decelerating into the destination.
// This is the whole fix. easeInOutCubic begins at zero velocity, which is what
// made the previous version feel like a delay followed by a jump.
function ease(p: number): number {
  return 1 - (1 - p) * (1 - p);
}

/**
 * Rises to the top and resolves when it lands. Resolves immediately when
 * already at the top or when the visitor asked for reduced motion, so it never
 * introduces a delay it does not need to.
 */
export function scrollTopThen(duration = 400): Promise<void> {
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
      withInstantScroll(() => window.scrollTo(0, start * (1 - ease(p))));
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        resolve();
      }
    };

    // First frame is scheduled immediately, so movement starts on the very
    // next paint after the click rather than after a ramp-up.
    requestAnimationFrame(step);
  });
}
