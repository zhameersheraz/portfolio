"use client";

import { useEffect, useRef } from "react";

/**
 * Live ASCII/binary dissolve over the hero portrait.
 *
 * The dissolve baked into me-hero.png is a still image, so it cannot move. This
 * draws a second, live glyph field on top of it. Two decisions make the two
 * layers read as one effect instead of as a smear:
 *
 * 1. Every glyph is filled with the average colour sampled from its own cell of
 *    the photograph. A glyph sitting on his hair comes out dark, one sitting on
 *    the backdrop comes out light, so the field reads as texture in the picture
 *    rather than as an overlay stuck on top of it.
 * 2. The density envelope mirrors the baked dissolve: nothing before roughly
 *    40% of the width, heaviest through the middle-right, thinning out toward
 *    the right edge. The live field reinforces the dense core and extends the
 *    fringe, which is where it can actually be seen changing.
 *
 * Deliberately not Matrix-style vertical rain. The rest of the site is quiet, so
 * a full column of falling digits would fight everything around it. The motion
 * here is a stagger: rows re-roll on a delay that walks downward, so the change
 * travels down the picture instead of down the screen.
 *
 * Cost control, all of it measured rather than assumed:
 * - sampled once into a small grid, never re-read from the image
 * - only cells whose timer has expired are touched, so a tick is a partial
 *   redraw rather than a full repaint
 * - paused outright when the tab is hidden or the portrait is scrolled away
 * - skipped completely for prefers-reduced-motion, where the static photograph
 *   above it is already the finished design
 */

const SAMPLE_W = 480;      // width the photograph is sampled down to
const CELL = 7;            // sample grid pitch, px
const TICK_MS = 90;        // how often a cell is allowed to change
const ROW_STAGGER = 5;     // ms added per row, so the change walks downward
const MIN_ALPHA = 0.4;
const MAX_ALPHA = 0.92;

// Mostly binary with a little punctuation, so it reads as data rather than as
// a wall of the same character.
const GLYPHS = [
  "0", "1", "0", "1", "0", "1", "1", "0",
  "/", "\\", "|", "+", "<", ">", ".", ":",
];

/**
 * Density across the width, 0..1.
 *
 * Measured against the baked dissolve rather than guessed. The first pass
 * started at 40% of the width, which put live glyphs on his chin and collar,
 * where the photograph has baked art of its own and the live layer only reads
 * as dirt. The baked dissolve does not begin until past his cheek, so neither
 * does this.
 */
function envelope(t: number): number {
  if (t < 0.52) return 0;
  if (t < 0.62) return ((t - 0.52) / 0.1) * 0.7;
  if (t < 0.76) return 0.7 + ((t - 0.62) / 0.14) * 0.3;
  return Math.max(0, 1 - ((t - 0.76) / 0.24) * 0.85);
}

/**
 * Density down the height, 0..1.
 *
 * The portrait ends in a fade to the page colour, and the
 * { building. breaking. learning. } marker sits inside it. That gradient is
 * high contrast, so a contrast-driven field covers it densely and buries the
 * marker under large glyphs. Taper the field out before it reaches the fade.
 */
function rowEnvelope(t: number): number {
  if (t < 0.05) return 0.3;      // soften the very top edge
  if (t < 0.7) return 1;
  if (t < 0.86) return 1 - ((t - 0.7) / 0.16);
  return 0;
}

type Cell = {
  x: number;
  y: number;
  col: string;   // sampled colour of this cell, never changes
  ch: string;    // the glyph drawn, re-rolled
  alpha: number;
  due: number;
};

export function BinaryRain({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // The still photograph already reads as finished. Anything that does not
    // run here just leaves it alone.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let cells: Cell[] = [];
    let cols = 0;
    let rows = 0;
    let alive = true;
    // Read the real state up front. Initialising this to false and waiting for
    // a visibilitychange event means the loop never draws at all until you
    // switch tabs away and back, which is exactly what it did.
    let visible = document.visibilityState === "visible";
    let onScreen = false;
    let tickAcc = 0;

    const img = new Image();
    img.decoding = "async";
    // Handler first, then src. Assigning src before onload races a warm cache,
    // where the load can complete before the handler is attached.
    img.onload = () => {
      if (!alive) return;
      resize();
      build();
      ctx.font = `500 ${fontPx()}px ui-monospace, "JetBrains Mono", monospace`;
      ctx.textBaseline = "alphabetic";
    };
    // Same-origin asset, so no crossOrigin needed and the pixel read is allowed.
    img.src = src;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Sample the photograph once into a coarse coloured grid. */
    const build = () => {
      const h = Math.round((img.naturalHeight / img.naturalWidth) * SAMPLE_W);
      const off = document.createElement("canvas");
      off.width = SAMPLE_W;
      off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, SAMPLE_W, h);
      const data = octx.getImageData(0, 0, SAMPLE_W, h).data;

      cols = Math.floor(SAMPLE_W / CELL);
      rows = Math.floor(h / CELL);
      cells = [];
      const now = performance.now();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sx = c * CELL + (CELL >> 1);
          const sy = r * CELL + (CELL >> 1);
          const i = (sy * SAMPLE_W + sx) * 4;

          const w = envelope(c / cols) * rowEnvelope(r / rows);
          if (w <= 0) continue;

          // Local contrast decides how likely a glyph is. Flat regions of the
          // photograph get almost none, which is what stops the field looking
          // like a sheet of graph paper.
          const l = (dx: number, dy: number): number => {
            const px = Math.min(SAMPLE_W - 1, Math.max(0, sx + dx));
            const py = Math.min(h - 1, Math.max(0, sy + dy));
            const k = (py * SAMPLE_W + px) * 4;
            return (data[k] + data[k + 1] + data[k + 2]) / 3;
          };
          const lap = Math.abs(4 * l(0, 0) - l(-1, 0) - l(1, 0) - l(0, -1) - l(0, 1));
          const p = Math.min(1, (w * (0.35 + lap / 90)) * 0.95);

          if (Math.random() > p) continue;

          cells.push({
            x: sx,
            y: sy,
            col: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
            ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
            alpha: (MIN_ALPHA + Math.random() * (MAX_ALPHA - MIN_ALPHA)) * (0.55 + 0.45 * w),
            // Staggered down the picture so a change travels downward.
            due: now + r * ROW_STAGGER + Math.random() * TICK_MS * 3,
          });
        }
      }
    };

    const fontPx = () => {
      const rect = canvas.getBoundingClientRect();
      // Keep glyph pitch constant on screen regardless of the container width.
      const k = rect.width / SAMPLE_W;
      return Math.max(7, Math.round(CELL * k * 1.55));
    };

    const draw = (now: number) => {
      // Throttle by returning, not by scheduling. This used to queue its own
      // requestAnimationFrame while loop() queued another, which forked into
      // two independent chains sharing one handle and could never be cancelled.
      if (now < tickAcc) return;
      tickAcc = now + TICK_MS;

      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2) return;
      const k = rect.width / SAMPLE_W;
      const fs = fontPx();

      for (const cell of cells) {
        if (cell.due > now) continue;
        cell.due = now + TICK_MS * (2 + Math.random() * 5);
        cell.ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];

        const px = cell.x * k;
        const py = cell.y * k;
        const w = CELL * k * 1.5;

        // Only the cells that changed get repainted.
        ctx.clearRect(px - w / 2, py - fs, w, fs * 1.6);
        ctx.globalAlpha = cell.alpha;
        ctx.fillStyle = cell.col;
        ctx.fillText(cell.ch, px - w / 2, py);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      if (visible && onScreen && cells.length) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    const io = new IntersectionObserver(
      (es) => {
        onScreen = es.some((e) => e.isIntersecting);
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => {
      resize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    ro.observe(canvas);

    img.onload = () => {
      if (!alive) return;
      resize();
      build();
      ctx.font = `500 ${fontPx()}px ui-monospace, "JetBrains Mono", monospace`;
      ctx.textBaseline = "alphabetic";
    };

    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}