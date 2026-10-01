"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient point field for the hero.
 *
 * A lattice of dots that breathes on a slow sine wave and drifts toward the
 * pointer, the way the reference sites let a point cloud carry the background.
 * Canvas rather than a video file: a few kilobytes instead of a few megabytes,
 * it stays sharp on any display, and it never autoplays a 4 MB asset.
 *
 * Static fallback when reduced motion is requested or canvas is unavailable.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canvas: HTMLCanvasElement = el;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let px = 0.5;
    let py = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;

    const COLS = 46;
    const ROWS = 26;

    type P = { ox: number; oy: number; ph: number };
    let pts: P[] = [];

    function layout() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pts = [];
      const gx = w / (COLS - 1);
      const gy = h / (ROWS - 1);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          pts.push({ ox: c * gx, oy: r * gy, ph: (c * 0.42 + r * 0.63) % 6.283 });
        }
      }
      draw(reduced ? 0.6 : 0);
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.42,
        0,
        w * 0.5,
        h * 0.42,
        Math.max(w, h) * 0.6,
      );
      glow.addColorStop(0, "rgba(232, 160, 48, 0.05)");
      glow.addColorStop(1, "rgba(232, 160, 48, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const amp = reduced ? 0 : Math.min(16, h * 0.028);
      const lx = px * w;
      const ly = py * h;
      const pull = reduced ? 0 : 1;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const wave = Math.sin(t * 0.00055 + p.ph) * amp;
        // Pointer influence falls off with distance, so the field leans where
        // the cursor is instead of following it rigidly.
        const dx = p.ox - lx;
        const dy = p.oy - ly;
        const d2 = dx * dx + dy * dy;
        const fall = Math.max(0, 1 - d2 / (260 * 260));
        const x = p.ox + wave * 0.7 - dx * fall * 0.035 * pull;
        const y = p.oy + wave + dy * fall * 0.028 * pull;

        const edge =
          Math.min(p.ox, w - p.ox) / (w * 0.5) * Math.min(p.oy, h - p.oy) / (h * 0.5);
        const a = Math.max(0, Math.min(1, edge)) * 0.3 + fall * 0.22 * pull;

        ctx.fillStyle = `rgba(226, 168, 62, ${a.toFixed(3)})`;
        const s = fall * pull > 0.35 ? 1.9 : 1.3;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }

    function loop(t: number) {
      px += (targetX - px) * 0.045;
      py += (targetY - py) * 0.045;
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    }
    function onLeave() {
      targetX = 0.5;
      targetY = 0.5;
    }

    layout();

    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
