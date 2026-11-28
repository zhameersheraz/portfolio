"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom pointer.
 *
 * Two separate things, because they answer two different questions.
 *
 * The pointer mark is four rounded corner brackets with a hairline dot in the
 * middle, sitting exactly on the cursor. It answers "where am I" and it never
 * moves away from the pointer. Crop marks rather than a crosshair, because the
 * site is already built out of corner brackets, registration marks and
 * instrument labels.
 *
 * The target frame is the other half. When the pointer is over something that
 * can be pressed, a rounded outline glides from the pointer to the edge of
 * that element and a single dash travels around its perimeter. It answers
 * "what will I click", and it shows the hit area rather than making you work
 * it out from a tiny shape change.
 *
 * The frame follows the element's real box, so a link gets a frame around the
 * link text and a card gets a frame around the whole card. Nothing lags and
 * nothing jumps: the outline is a single element whose box is transitioned,
 * so it slides and grows rather than teleporting.
 *
 * Over a text field both get out of the way and the native caret takes over.
 * Replacing the caret on a form is not a flourish, it is a bug.
 *
 * Only ever enabled on a device with a real hovering pointer. The native
 * cursor is removed with a class that JavaScript adds only after this
 * component has mounted and confirmed the pointer is fine, so there is never a
 * moment where the page has no cursor at all.
 */
type Mode = "idle" | "target" | "text";

const OUTSET = 3;

export function Cursor() {
  const pos = useRef<HTMLDivElement | null>(null);
  const frame = useRef<SVGSVGElement | null>(null);
  const pulse = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    setLive(true);

    /** Move the frame to a box, in page coordinates. */
    const place = (x: number, y: number, w: number, h: number) => {
      const el = frame.current;
      if (!el) return;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
    };

    const onMove = (e: PointerEvent) => {
      const el = pos.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      // While the pointer is not over a target, the frame collapses back onto
      // the pointer so there is never a stale outline left over.
      if (!frame.current?.classList.contains("is-target")) {
        place(e.clientX - 12, e.clientY - 12, 24, 24);
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || typeof el.closest !== "function") return;

      if (el.closest("input, textarea, select, [contenteditable='true']")) {
        setMode("text");
        frame.current?.classList.remove("is-target");
        return;
      }

      const pressable = el.closest(
        "a, button, [role='button'], summary, label, [data-pressable]",
      ) as HTMLElement | null;

      if (!pressable) {
        setMode("idle");
        frame.current?.classList.remove("is-target");
        return;
      }

      const r = pressable.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) {
        setMode("idle");
        frame.current?.classList.remove("is-target");
        return;
      }

      setMode("target");
      place(r.left - OUTSET, r.top - OUTSET, r.width + OUTSET * 2, r.height + OUTSET * 2);
      frame.current?.classList.add("is-target");
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
      frame.current?.classList.remove("is-target");
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

      {/* The target frame. Lives in page coordinates and is transitioned
          between boxes, so it slides rather than jumps. */}
      <svg ref={frame} className="cursor-frame" width={0} height={0}>
        <rect
          className="cursor-frame__rect"
          x={0}
          y={0}
          width="100%"
          height="100%"
          rx={9}
        />
      </svg>

      {/* The pointer mark. Always exactly on the cursor. */}
      <div ref={pos} className={`cursor-pos ${mode}`} style={{ opacity: 0 }}>
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
