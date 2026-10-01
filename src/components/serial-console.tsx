"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Line = {
  mark: "ok" | "warn" | "fail" | "info";
  label: string;
  value: string;
  note?: string;
};

/**
 * A serial console that writes itself, character by character, the way
 * esp32sec actually prints. This is the page's one orchestrated moment.
 * Everything else on the site stays still.
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

const PROMPT = "zham@kali:~/esp32sec$ python flash_crypto.py";

const MARK: Record<Line["mark"], { glyph: string; className: string }> = {
  ok: { glyph: "✓", className: "text-accent" },
  warn: { glyph: "!", className: "text-accent/80" },
  fail: { glyph: "×", className: "text-destructive" },
  info: { glyph: "·", className: "text-muted-foreground" },
};

const CHAR_MS = 16;
const LINE_PAUSE_MS = 90;

export function SerialConsole() {
  const [chars, setChars] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flatten the script into one stream so it types as a single continuous
  // feed, exactly like a real run. A \n advances to the next line.
  const stream = useMemo(
    () => SCRIPT.map((l) => `${l.mark}|${l.label}|${l.value}|${l.note ?? ""}\n`).join(""),
    [],
  );

  const total = PROMPT.length + stream.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setChars(total);
      return;
    }
    if (chars >= total) return;
    const delay = stream[chars] === "\n" ? LINE_PAUSE_MS : CHAR_MS;
    timer.current = setTimeout(() => setChars((c) => c + 1), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [chars, reduced, stream, total]);

  // Slice the typed stream back into complete lines.
  const typedPrompt = PROMPT.slice(0, Math.min(chars, PROMPT.length));
  const bodyTyped = chars <= PROMPT.length ? "" : stream.slice(0, chars - PROMPT.length);

  const done = chars >= total;
  const partial = bodyTyped.split("\n").pop() ?? "";
  const [pmark, plabel, pvalue, pnote] = partial.split("|");

  const complete = bodyTyped.split("\n").slice(0, -1).filter(Boolean);

  return (
    <div className="noise overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_hsl(var(--shadow)/0.05),0_18px_40px_-22px_hsl(var(--shadow)/0.28)]">
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
          <span className="text-foreground">{typedPrompt.slice(PROMPT.indexOf("python"))}</span>
          {chars < PROMPT.length && (
            <span className="console-caret ml-px inline-block h-4 w-[7px] translate-y-0.5 bg-accent animate-blink" />
          )}
        </p>

        <ul className="min-h-[9.5rem]">
          {complete.map((raw, i) => {
            const [mark, label, value, note] = raw.split("|");
            const m = MARK[mark as Line["mark"]];
            return (
              <li key={`${label}-${i}`} className="flex items-baseline gap-2">
                <span className={`w-3 shrink-0 ${m.className}`}>{m.glyph}</span>
                <span className="w-28 shrink-0 text-muted-foreground sm:w-[9.5rem]">
                  {label}
                </span>
                <span className="min-w-0 text-foreground">{value}</span>
                {note ? (
                  <span className="hidden shrink-0 text-muted-foreground/70 sm:inline">
                    {note}
                  </span>
                ) : null}
              </li>
            );
          })}

          {/* The line currently being written. */}
          {partial && !done && (
            <li className="flex items-baseline gap-2">
              <span className={`w-3 shrink-0 ${MARK[pmark as Line["mark"]]?.className ?? ""}`}>
                {MARK[pmark as Line["mark"]]?.glyph ?? " "}
              </span>
              <span className="w-28 shrink-0 text-muted-foreground sm:w-[9.5rem]">
                {plabel}
              </span>
              <span className="text-foreground">
                {pvalue}
                <span className="console-caret ml-px inline-block h-4 w-[7px] translate-y-0.5 bg-accent animate-blink" />
              </span>
              {pnote ? (
                <span className="hidden shrink-0 text-muted-foreground/70 sm:inline">
                  {pnote}
                </span>
              ) : null}
            </li>
          )}
        </ul>

        <p className="mt-3 border-t border-border pt-3 text-muted-foreground">
          {done ? "2 findings · 0 critical" : ""}
          {done && (
            <span className="console-caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent" />
          )}
        </p>
      </div>
    </div>
  );
}
