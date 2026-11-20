"use client";

import { useEffect, useRef } from "react";

/**
 * Glitch layer over the hero portrait.
 *
 * The reference treatment is a photograph that comes apart: the right side of
 * the portrait breaks into coloured blocks, thin horizontal tears run through
 * the image, and everything carries a chromatic split like a misregistered
 * print.
 *
 * Three parts, all on one canvas:
 *
 * 1. Block field. Rectangles in the dissolve zone, drifting outward from the
 *    portrait and flickering. They are opaque, not additive, so they read the
 *    same on a light or a dark page.
 *
 * 2. Slice tears. A horizontal band of the photograph, copied out and dropped
 *    a few pixels to one side, with its red, green and blue channels
 *    separated. The channel separation is done by multiplying three copies of
 *    the photograph, one per channel, and drawing them with "lighter" on a
 *    dark page or "multiply" on a light one. That is the actual mechanism of
 *    print misregistration, so it reads as a fault in the image rather than as
 *    decoration.
 *
 * 3. The split only appears on the tears, not over the whole portrait. A
 *    permanently doubled portrait would look broken; a doubled band looks
 *    like a transmission dropping out.
 *
 * The photograph is sampled once into an offscreen canvas at load and never
 * re-read, the block field is small, and the whole layer is skipped when the
 * tab is hidden or the portrait has scrolled away. Under
 * prefers-reduced-motion nothing here runs and the static photograph is the
 * finished design.
 */

const SAMPLE_W = 520;

/**
 * Palette.
 *
 * Three tones, not five, and the mix is weighted towards paper. The reference
 * uses a couple of coloured blocks on an otherwise black image; a full
 * rainbow across the portrait turns the effect into confetti and stops it
 * reading as a signal breaking up. Paper carries the shape, the accent
 * carries the spark, and the cool tone is there so the eye has something
 * colder to catch.
 *
 * Two sets, because the same block that reads as light on a dark page reads
 * as nothing on a light one. On paper the tones go to ink, burnt amber and a
 * deep blue instead.
 */
const DARK_PALETTE = [
  "rgba(232, 236, 244",  // paper
  "rgba(255, 170, 70",   // amber, the brand colour
  "rgba(110, 200, 240",  // cool
] as const;

const LIGHT_PALETTE = [
  "rgba(28, 32, 40",     // ink
  "rgba(196, 116, 18",   // burnt amber
  "rgba(42, 92, 190",    // deep blue
] as const;

const PALETTE_WEIGHT = [0.56, 0.26, 0.18];

type Block = {
  x: number;      // 0..1 across the sample width
  y: number;      // 0..1 down the sample height
  w: number;      // fraction of width
  h: number;      // fraction of height
  vx: number;     // drift per tick
  vy: number;
  tone: number;   // index into the palette, resolved at draw time
  alpha: number;
  due: number;    // next flicker
  born: number;
};

type Tear = {
  y: number;      // 0..1
  h: number;      // 0..1
  shift: number;  // px
  until: number;
};

export function GlitchDissolve({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let alive = true;
    let visible = document.visibilityState === "visible";
    let onScreen = false;
    let nextTear = 0;
    let lastDraw = 0;

    const src2 = document.createElement("canvas");
    const sctx = src2.getContext("2d", { willReadFrequently: true });
    // One copy per channel, pre-multiplied to that channel, so a tear is three
    // drawImage calls instead of three per-pixel passes every frame.
    const chans: HTMLCanvasElement[] = [];

    let blocks: Block[] = [];
    let tears: Tear[] = [];
    let sampleH = 0;
    let cols = 0;
    let rows = 0;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!alive) return;
      resize();
      build();
    };
    img.src = src;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Where the portrait comes apart. Peaks past the cheek, thins at the edge. */
    const zone = (t: number) => {
      if (t < 0.44) return 0;
      if (t < 0.56) return ((t - 0.44) / 0.12) * 0.55;
      if (t < 0.82) return 0.55 + ((t - 0.56) / 0.26) * 0.45;
      return Math.max(0, 1 - ((t - 0.82) / 0.18) * 0.8);
    };

    const build = () => {
      sampleH = Math.round((img.naturalHeight / img.naturalWidth) * SAMPLE_W);
      src2.width = SAMPLE_W;
      src2.height = sampleH;
      if (!sctx) return;
      sctx.drawImage(img, 0, 0, SAMPLE_W, sampleH);

      // Channel-separated copies of the photograph.
      //
      // These have to be built per pixel rather than by multiplying a tinted
      // rectangle over the image. A fillRect would paint over the cutout's
      // transparent background and every tear would come out as a solid bar
      // across the full width. Writing the channels by hand keeps the alpha,
      // so a tear only shows where the photograph is.
      //
      // The photograph is greyscale, so a straight channel split would be
      // three identical greys and the separation would be invisible. Each
      // copy is therefore pushed towards a hue, which is what gives the tear
      // its red and cyan edges.
      const srcData = sctx.getImageData(0, 0, SAMPLE_W, sampleH);
      const CHANNELS = [
        [1.0, 0.12, 0.2],   // red
        [0.1, 1.0, 0.75],   // cyan
        [0.15, 0.45, 1.0],  // blue
      ];
      for (const [kr, kg, kb] of CHANNELS) {
        const c = document.createElement("canvas");
        c.width = SAMPLE_W;
        c.height = sampleH;
        const cc = c.getContext("2d");
        if (!cc) continue;
        const out = cc.createImageData(SAMPLE_W, sampleH);
        const d = srcData.data;
        const o = out.data;
        for (let i = 0; i < d.length; i += 4) {
          const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
          o[i] = Math.min(255, lum * kr);
          o[i + 1] = Math.min(255, lum * kg);
          o[i + 2] = Math.min(255, lum * kb);
          o[i + 3] = d[i + 3];
        }
        cc.putImageData(out, 0, 0);
        chans.push(c);
      }

      // Block field. Density follows the same envelope as the live layer, so
      // the blocks and the portrait dissolve agree with each other.
      blocks = [];
      cols = 46;
      rows = Math.max(12, Math.round((sampleH / SAMPLE_W) * 46));
      const now = performance.now();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const t = c / cols;
          const w = zone(t);
          if (w <= 0) continue;
          if (Math.random() > w * 0.18) continue;

          // Weighted palette pick.
          let roll = Math.random();
          let pick = 0;
          for (let i = 0; i < PALETTE_WEIGHT.length; i++) {
            roll -= PALETTE_WEIGHT[i];
            if (roll <= 0) { pick = i; break; }
            pick = i;
          }
          const wide = Math.random() < 0.28;
          blocks.push({
            x: t + (Math.random() - 0.5) * 0.03,
            y: r / rows + (Math.random() - 0.5) * 0.02,
            w: wide ? 0.035 + Math.random() * 0.12 : 0.006 + Math.random() * 0.022,
            h: wide ? 0.0016 + Math.random() * 0.004 : 0.004 + Math.random() * 0.018,
            vx: 0.0006 + Math.random() * 0.0032,
            vy: (Math.random() - 0.5) * 0.0016,
            tone: pick,
            alpha: 0.25 + Math.random() * 0.45,
            due: now + Math.random() * 900,
            born: now,
          });
        }
      }
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = (now: number) => {
      if (now - lastDraw < 55) return;
      lastDraw = now;

      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2) return;
      const k = rect.width / SAMPLE_W;

      ctx.clearRect(0, 0, rect.width, rect.height);

      const dark = isDark();
      const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;

      // --- Block field -----------------------------------------------------
      for (const b of blocks) {
        if (now < b.due) {
          // Still draw it, just settled.
        } else {
          b.due = now + 120 + Math.random() * 1600;
          b.alpha = 0.18 + Math.random() * 0.42;
          b.x += b.vx;
          b.y += b.vy;
          if (b.x > 1.02) { b.x = 0.42; b.y = Math.random(); }
          if (b.y < -0.05) b.y = 1.02;
          if (b.y > 1.05) b.y = -0.03;
        }

        const px = b.x * rect.width;
        const py = b.y * rect.height;
        const pw = b.w * rect.width;
        const ph = b.h * rect.height;

        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = `${palette[b.tone]},${b.alpha})`;
        ctx.fillRect(px, py, pw, ph);
      }
      ctx.globalAlpha = 1;

      // --- Slice tears -----------------------------------------------------
      if (now > nextTear) {
        nextTear = now + 900 + Math.random() * 2400;
        tears.push({
          y: Math.random() * 0.92,
          h: 0.004 + Math.random() * 0.022,
          shift: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 26),
          until: now + 90 + Math.random() * 180,
        });
      }
      tears = tears.filter((t) => t.until > now);

      if (tears.length && chans.length === 3) {
        // On a dark page the separated channels are added, which is the neon
        // look of a signal splitting. On paper they replace the band, which is
        // what a print with the plates out of register actually does. Same
        // geometry, both correct for their ground.
        //
        // Kept at half strength. The channel separation is the part of the
        // reference worth copying, and it reads at low intensity; at full
        // strength the tears turn into colour stripes.
        ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
        ctx.globalAlpha = dark ? 0.42 : 0.6;
        for (const t of tears) {
          const sy = t.y * sampleH;
          const sh = t.h * sampleH;
          const dx = t.shift * k;
          for (let i = 0; i < 3; i++) {
            const off = (i - 1) * dx;
            ctx.drawImage(
              chans[i],
              0, sy, SAMPLE_W, sh,
              off, t.y * rect.height, rect.width, t.h * rect.height,
            );
          }
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };

    const loop = (t: number) => {
      if (visible && onScreen && blocks.length) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    const io = new IntersectionObserver(
      (es) => { onScreen = es.some((e) => e.isIntersecting); },
      { rootMargin: "80px" },
    );
    io.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => {
      resize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    ro.observe(canvas);

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
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}