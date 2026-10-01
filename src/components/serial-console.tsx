"use client";

import { useEffect, useRef, useState } from "react";

type Line = {
  mark: "ok" | "warn" | "fail" | "info";
  label: string;
  value: string;
  note?: string;
};

/**
 * A serial console readout in the shape esp32sec actually prints.
 * This is the artifact he builds, so it earns the hero slot that a
 * stock wireframe blob used to occupy.
 */
const SCRIPT: Line[] = [
  { mark: "info", label: "port", value: "/dev/ttyUSB0", note: "115200 8N1" },
  { mark: "ok", label: "chip", value: "esp32-d0wd-v1", note: "rev 3" },
  { mark: "ok", label: "secure boot", value: "locked", note: "efuse" },
  { mark: "fail", label: "flash encryption", value: "disabled", note: "efuse" },
  { mark: "warn", label: "partition table", value: "3 entries", note: "0x8000" },
  { mark: "warn", label: "boot reason", value: "SPI_FAST_FLASH", note: "0x1f" },
  { mark: "info", label: "firmware", value: "v1.7.3", note: "0x1a2c00" },
];

const MARK: Record<Line["mark"], { glyph: string; className: string }> = {
  ok: { glyph: "✓", className: "text-accent" },
  warn: { glyph: "!", className: "text-accent/80" },
  fail: { glyph: "×", className: "text-destructive" },
  info: { glyph: "·", className: "text-muted-foreground" },
};

const STAGGER_MS = 260;

export function SerialConsole() {
  const [shown, setShown] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setShown(SCRIPT.length);
      return;
    }
    if (shown >= SCRIPT.length) return;
    timer.current = setTimeout(() => setShown((n) => n + 1), STAGGER_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [shown, reduced]);

  const done = shown >= SCRIPT.length;

  return (
    <div className="noise overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-tight text-muted-foreground">
          esp32sec · flash-crypto
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span
            className={`h-2 w-2 rounded-full transition-colors duration-500 ${
              done ? "bg-accent" : "bg-border"
            }`}
          />
        </span>
      </div>

      <div className="px-4 py-4 font-mono text-[12px] leading-relaxed">
        <p className="mb-3 text-muted-foreground">
          <span className="text-accent">zham@kali</span>
          <span className="text-muted-foreground/60">:</span>
          <span className="text-foreground/80">~/esp32sec</span>
          <span className="text-muted-foreground/60">$</span>{" "}
          <span className="text-foreground">python flash_crypto.py</span>
        </p>

        <ul>
          {SCRIPT.slice(0, shown).map((line, i) => {
            const m = MARK[line.mark];
            return (
              <li
                key={line.label}
                className="console-line flex items-baseline gap-2 animate-fade-in"
                style={{ animationDelay: reduced ? "0ms" : `${i * 40}ms` }}
              >
                <span className={`w-3 shrink-0 ${m.className}`}>{m.glyph}</span>
                <span className="w-28 shrink-0 text-muted-foreground sm:w-[9.5rem]">
                  {line.label}
                </span>
                <span className="min-w-0 text-foreground">{line.value}</span>
                {line.note ? (
                  <span className="hidden shrink-0 text-muted-foreground/70 sm:inline">
                    {line.note}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="mt-3 border-t border-border pt-3 text-muted-foreground">
          {done ? "2 findings · 0 critical" : ""}
          <span
            className={`console-cursor ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent ${
              done ? "" : "animate-blink"
            }`}
            aria-hidden
          />
        </p>
      </div>
    </div>
  );
}
