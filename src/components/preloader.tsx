"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Intro overlay.
 *
 * The page underneath is already rendering while this sits on top of it, so
 * nothing here is on the critical path for the hero image or the LCP. The
 * counter tracks real load signals rather than a fixed timer, so a slow
 * connection shows a slow count and a warm cache finishes quickly.
 *
 * Plays once per session. A visitor who navigates back to the home page
 * should not sit through it again, so sessionStorage remembers the first
 * visit and the component returns nothing on later mounts.
 */

const KEY = "zham:intro-seen";
const MIN_MS = 900;
// Hard ceiling. If the load event never arrives, the overlay still gets out of
// the way. An intro that can trap the page is worse than no intro at all.
const HARD_MS = 6000;

type Phase = "playing" | "leaving" | "gone";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("gone");
  const [pct, setPct] = useState(0);
  const progress = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* private mode, storage unavailable */
    }
    if (seen || reduce) return;

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }

    setPhase("playing");
    const started = performance.now();

    // Three real milestones. Each one nudges the target forward; the counter
    // eases toward it rather than jumping, so it reads as continuous motion.
    let target = 0.12;
    const bump = (to: number) => {
      target = Math.max(target, to);
    };

    const onReady = () => bump(0.34);
    const onFonts = () => bump(0.58);
    const onLoad = () => bump(0.92);

    // The load event may already have fired by the time this effect runs. React
    // hydrates after the document has loaded often enough that listening for
    // "load" alone leaves the counter stuck below the exit threshold and the
    // overlay never goes away. Check readyState instead of assuming.
    const alreadyLoaded = document.readyState === "complete";
    if (alreadyLoaded) {
      bump(0.92);
    } else {
      document.addEventListener("DOMContentLoaded", onReady);
      window.addEventListener("load", onLoad);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(onFonts).catch(() => {});
    } else {
      bump(0.58);
    }

    let raf = 0;
    const tick = () => {
      progress.current += (target - progress.current) * 0.09;
      const shown = Math.round(progress.current * 100);
      setPct(shown);

      const elapsed = performance.now() - started;
      const ready = target >= 0.92 || elapsed >= HARD_MS;
      if (ready && elapsed >= MIN_MS) {
        setPct(100);
        window.removeEventListener("load", onLoad);
        document.removeEventListener("DOMContentLoaded", onReady);
        setPhase("leaving");
        window.setTimeout(() => setPhase("gone"), 700);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("DOMContentLoaded", onReady);
    };
  }, []);

  if (phase === "gone") return null;

  const leaving = phase === "leaving";

  return (
    <div
      aria-hidden={leaving ? true : undefined}
      role="status"
      aria-live="polite"
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-background transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        leaving
          ? "pointer-events-none opacity-0"
          : "pointer-events-auto opacity-100",
      ].join(" ")}
    >
      {/* The soft halo behind the mark. The reference design sits its content
          inside a diffuse glow, and on a warm paper background a blur of the
          foreground colour reads as light rather than as a grey box. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.045] blur-3xl"
      />

      <div
        className={[
          "relative flex flex-col items-center",
          "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          leaving ? "scale-[1.06] opacity-0" : "scale-100 opacity-100",
        ].join(" ")}
      >
        {/* Wordmark. The navbar uses the handle for the same reason this
            does: the full name is the H1 further down the page. */}
        <span className="font-masthead text-[1.05rem] font-semibold tracking-[0.34em] text-foreground">
          zham
        </span>

        {/* Counter. Mono at display size, because a number is the one thing
            on this screen that should look like an instrument. */}
        <div className="mt-8 font-display text-[3.25rem] font-medium leading-none tracking-[-0.04em] text-foreground tabular-nums sm:text-[4rem]">
          {String(pct).padStart(3, "0")}
        </div>

        {/* Progress rule. One hairline, filling left to right. */}
        <div className="mt-7 h-px w-56 overflow-hidden bg-border sm:w-72">
          <div
            className="h-full bg-foreground transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 flex w-56 items-baseline justify-between sm:w-72">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {leaving ? "Ready" : "Loading"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Portfolio
          </span>
        </div>
      </div>
    </div>
  );
}