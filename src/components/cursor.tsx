"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom pointer.
 *
 * Four rounded corner brackets with a hairline dot in the middle, sitting
 * exactly on the cursor. Crop marks rather than a crosshair, because the
 * site is already built out of corner brackets, registration marks and
 * instrument labels.
 *
 * Over something that can be pressed the whole frame turns. It spins slowly
 * and continuously, which is the only part of it that moves. The brackets
 * never leave the pointer and nothing lags behind, so where the pointer is
 * and what it is over are never in doubt.
 *
 * The corners are rounded rather than sharp. Sharp right angles read as a
 * drawing of a pointer; rounded ones read as a piece of the interface.
 *
 * Over a text field the whole thing gets out of the way and the native text
 * caret comes back. Replacing the caret on a form is not a flourish, it is a
 * bug.
 *
 * Only ever enabled on a device with a real hovering pointer. The native
 * cursor is removed with a class that JavaScript adds only after this
 * component has mounted and confirmed the pointer is fine, so there is never a
 * moment where the page has no cursor at all.
 */
type Variant = "idle" | "active" | "text";

export function Cursor() {
  const pos = useRef<HTMLDivElement | null>(null);
  const pulse = useRef<HTMLDivElement | null>(null);
  const [variant, setVariant] = useState<Variant>("idle");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    setLive(true);

    const onMove = (e: PointerEvent) => {
      const el = pos.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || typeof el.closest !== "function") return;
      if (el.closest("input, textarea, select, [contenteditable='true']")) {
        setVariant("text");
        return;
      }
      setVariant(
        el.closest("a, button, [role='button'], summary, label") ? "active" : "idle",
      );
    };

    const onDown = (e: PointerEvent) => {
      const p = pulse.current;
      if (!p) return;
      p.style.left = `${e.clientX}px`;
      p.style.top = `${e.clientY}px`;
      // Remove the class, force a reflow, put it back. Without the reflow the
      // browser sees no change and does not restart the animation.
      p.classList.remove("cursor-pulse--go");
      void p.offsetWidth;
      p.classList.add("cursor-pulse--go");
    };

    const onLeave = () => {
      const el = pos.current;
      if (el) el.style.opacity = "0";
    };

    const onEnter = () => {
      const el = pos.current;
      if (el) el.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!live) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* The press ring. One shot, then gone. */}
      <div ref={pulse} className="cursor-pulse" />

      {/* The pointer mark. Always exactly on the cursor. */}
      <div ref={pos} className={`cursor-pos ${variant}`} style={{ opacity: 0 }}>
        <div className="cursor-marks">
          <span className="cursor-mark cursor-mark--tl" />
          <span className="cursor-mark cursor-mark--tr" />
          <span className="cursor-mark cursor-mark--bl" />
          <span className="cursor-mark cursor-mark--br" />
          <span className="cursor-core" />
        </div>
      </div>
    </div>
  );
}
