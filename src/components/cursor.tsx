"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom pointer.
 *
 * A reticle rather than an arrow, because the site is instrument-like
 * everywhere else: the terminal labels, the corner brackets on the loading
 * screen, the registration marks on the about card. An arrow would be the one
 * piece of chrome from a different design.
 *
 * Two parts that behave differently on purpose:
 *
 * - The crosshair and the centre dot sit exactly under the pointer. Anything
 *   that lags is the pointer, and a lagging pointer feels broken.
 * - The ring trails behind, eased on its own frame. That gap between where
 *   the pointer is and where the ring is what gives it the instrument feel.
 *
 * Over something interactive the crosshair arms retract and the centre dot
 * opens into a filled circle, so the state change is a shape change rather
 * than a colour change.
 *
 * Over a text field the whole thing gets out of the way and the native text
 * caret comes back. Replacing the caret on a form is not a nice touch, it is
 * a bug.
 *
 * Only ever enabled on a device with a real hovering pointer. The native
 * cursor is removed with a class that is added only once this component is
 * mounted and has confirmed the pointer is fine, so there is never a moment
 * where the page has no cursor at all.
 */
type Variant = "idle" | "active" | "text";

export function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const [variant, setVariant] = useState<Variant>("idle");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    setLive(true);

    let tx = 0;
    let ty = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      const d = dot.current;
      const r = ring.current;
      if (!d || !r) return;
      if (!seen) {
        tx = e.clientX; ty = e.clientY;
        rx = e.clientX; ry = e.clientY;
        seen = true;
      }
      tx = e.clientX; ty = e.clientY;
      d.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
    };

    // The ring eases toward the pointer on its own frame, so the trail is
    // continuous instead of stepping at pointer event rate.
    const loop = () => {
      const r = ring.current;
      if (r && seen) {
        rx += (tx - rx) * 0.16;
        ry += (ty - ry) * 0.16;
        r.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || typeof el.closest !== "function") return;
      if (el.closest("input, textarea, select, [contenteditable='true']")) {
        setVariant("text");
        return;
      }
      if (el.closest("a, button, [role='button'], summary, label")) {
        setVariant("active");
        return;
      }
      setVariant("idle");
    };

    const onLeave = () => {
      seen = false;
      const d = dot.current;
      const r = ring.current;
      if (d) d.style.opacity = "0";
      if (r) r.style.opacity = "0";
    };

    const onEnter = () => {
      const d = dot.current;
      const r = ring.current;
      if (d) d.style.opacity = "1";
      if (r) r.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!live) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* The ring. Trails the pointer. */}
      <div
        ref={ring}
        className={`cursor-ring ${variant}`}
        style={{ opacity: 0 }}
      />
      {/* The crosshair and the centre dot. Exactly under the pointer. */}
      <div ref={dot} className={`cursor-dot ${variant}`} style={{ opacity: 0 }}>
        <span className="cursor-dot__core" />
        <span className="cursor-dot__arm cursor-dot__arm--h" />
        <span className="cursor-dot__arm cursor-dot__arm--v" />
      </div>
    </div>
  );
}
