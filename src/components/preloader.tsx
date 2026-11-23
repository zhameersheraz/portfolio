"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Intro overlay.
 *
 * The overlay is part of the server HTML. It used to mount on hydration
 * instead, which meant the browser painted the page first and the loader
 * second, so opening the site showed the site, then the loader, then the
 * site again. The head script in the document decides whether the intro
 * plays, before the first paint, and the component only animates what is
 * already on screen.
 *
 * The page underneath is rendering while this sits on top of it, so nothing
 * here is on the critical path for the hero image or the LCP. The counter
 * tracks real load signals rather than a fixed timer, so a slow connection
 * shows a slow count and a warm cache finishes quickly.
 *
 * A hard ceiling means it can never trap the page. An intro that can get
 * stuck is worse than no intro.
 */

const KEY = "zham:intro-seen";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MIN_MS = 900;
const HARD_MS = 6000;

type Phase = "playing" | "leaving" | "gone";

const SEGMENTS = 28;

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [pct, setPct] = useState(0);
  const progress = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The head script already decided. If it said skip, the overlay is hidden
    // by CSS and all that is left is to take it out of the document.
    const skipped = document.documentElement.classList.contains("intro-skip");
    if (skipped || reduce) {
      setPhase("gone");
      return;
    }

    const started = performance.now();

    let target = 0.12;
    const bump = (to: number) => {
      target = Math.max(target, to);
    };

    const onReady = () => bump(0.34);
    const onFonts = () => bump(0.58);
    const onLoad = () => bump(0.92);

    // The load event may already have fired by the time this effect runs.
    // React hydrates after the document has loaded often enough that
    // listening for "load" alone leaves the counter stuck below the exit
    // threshold and the overlay never goes away.
    if (document.readyState === "complete") {
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
      setPct(Math.round(progress.current * 100));

      const elapsed = performance.now() - started;
      const ready = target >= 0.92 || elapsed >= HARD_MS;
      if (ready && elapsed >= MIN_MS) {
        setPct(100);
        window.removeEventListener("load", onLoad);
        document.removeEventListener("DOMContentLoaded", onReady);
        setPhase("leaving");
        window.setTimeout(() => setPhase("gone"), 650);
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
  const lit = Math.round((pct / 100) * SEGMENTS);

  return (
    <div
      aria-hidden={leaving ? true : undefined}
      role="status"
      aria-live="polite"
      className={[
        "intro fixed inset-0 z-[100] overflow-hidden bg-background",
        "transition-opacity duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        leaving ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100",
      ].join(" ")}
    >
      {/* Scanlines. Two pixels on, two off. At this opacity it reads as a
          screen rather than as stripes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, hsl(var(--foreground) / 0.045) 0px, hsl(var(--foreground) / 0.045) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* The soft halo. Same idea as the one behind the portrait. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />

      {/* Instrument corners. Four brackets, the kind of thing printed on a
          camera viewfinder. */}
      {(
        [
          "left-4 top-4 border-l border-t",
          "right-4 top-4 border-r border-t",
          "bottom-4 left-4 border-b border-l",
          "bottom-4 right-4 border-b border-r",
        ] as const
      ).map((c) => (
        <span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute h-7 w-7 border-border/70 ${c}`}
        />
      ))}

      <div
        className={[
          "relative flex h-full flex-col items-center justify-center px-6",
          "transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          leaving ? "scale-[1.05] opacity-0" : "scale-100 opacity-100",
        ].join(" ")}
      >
        {/* Wordmark with the channel separation. Two text-shadows in red and
            cyan is the whole trick: the glyphs look like they are printing
            with the channels out of register. */}
        <span
          className="font-masthead text-[1.15rem] font-semibold uppercase tracking-[0.42em] text-foreground animate-glitch-jitter"
          style={{
            textShadow:
              "-2px 0 hsl(340 90% 60% / 0.85), 2px 0 hsl(190 95% 55% / 0.85)",
          }}
        >
          zham
        </span>

        {/* Counter, inside a bracket frame. */}
        <div className="relative mt-10 flex h-24 w-36 items-center justify-center border border-border/80">
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-foreground/70" aria-hidden />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-foreground/70" aria-hidden />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-foreground/70" aria-hidden />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-foreground/70" aria-hidden />
          <span className="font-display text-[2.75rem] font-medium leading-none tracking-[-0.04em] text-foreground tabular-nums">
            {String(pct).padStart(3, "0")}
          </span>
        </div>

        {/* Segmented progress. Discrete blocks read as a machine counting down
            rather than as a browser progress bar. */}
        <div className="mt-9 flex w-full max-w-sm items-center gap-[3px]" aria-hidden>
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <span
              key={i}
              className="h-3 flex-1 transition-colors duration-150"
              style={{
                backgroundColor:
                  i < lit ? "hsl(var(--foreground))" : "hsl(var(--border))",
                opacity: i < lit ? 0.9 : 0.55,
              }}
            />
          ))}
        </div>

        <div className="mt-4 flex w-full max-w-sm items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {leaving ? "Ready" : "Loading"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Portfolio
          </span>
        </div>
      </div>

      {/* One horizontal tear that sweeps across on a loop. A single moving
          fault line is enough to say "signal" without turning the screen into
          a noise generator. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-[2px] animate-glitch-sweep bg-accent/50"
        style={{ top: "38%" }}
      />
    </div>
  );
}