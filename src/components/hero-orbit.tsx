"use client";

/**
 * The hero's floating layer.
 *
 * The reference design hangs small angled cards around the portrait, each one
 * carrying a single idea, with a soft halo behind the whole thing. That
 * composition does the job a feature list would otherwise do: it says what
 * the person works on without a paragraph of it.
 *
 * Everything here is absolutely positioned inside the portrait wrapper and
 * hidden below lg. The hero was tuned at a 941px viewport and the lower
 * breakpoints are crowded already, so the floating layer only appears where
 * there is room for it.
 *
 * Rotation and float live on separate elements on purpose. A single transform
 * cannot both rotate and translate, and the animation would win, so the
 * outer box owns the tilt and the inner one owns the drift.
 */

const ORBIT = [
  {
    label: "Security",
    line: "Firmware, hardware, cloud",
    className: "left-[1%] top-[7%]",
    tilt: "-rotate-[7deg]",
    delay: "0s",
    dur: "7.5s",
  },
  {
    label: "Reversing",
    line: "radare2, binaries, CFGs",
    className: "right-[7%] top-[33%]",
    tilt: "rotate-[5deg]",
    delay: "-2.2s",
    dur: "8.5s",
  },
  {
    label: "Building",
    line: "Full-stack, edge ML",
    className: "left-[7%] bottom-[15%]",
    tilt: "-rotate-[4deg]",
    delay: "-4.4s",
    dur: "9.5s",
  },
] as const;

export function HeroOrbit() {
  return (
    <>
      {/* Halo. A very low opacity blur of the foreground colour, which on the
          warm paper background reads as light falling on the page rather than
          as a grey shape sitting on it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        <div className="absolute left-1/2 top-[38%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.05] blur-3xl" />
        <div className="absolute left-[38%] top-[18%] h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.035] blur-2xl" />
      </div>

      {ORBIT.map((card) => (
        <div
          key={card.label}
          aria-hidden
          className={`pointer-events-none absolute hidden lg:block ${card.className} ${card.tilt}`}
        >
          <div
            className="animate-float-slow motion-reduce:animate-none"
            style={{ animationDelay: card.delay, animationDuration: card.dur }}
          >
            <div className="rounded-2xl border border-border/80 bg-card/85 px-4 py-3 shadow-[0_24px_48px_-28px_hsl(var(--shadow)/0.55)] backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                {card.label}
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                {card.line}
              </p>
            </div>
          </div>
        </div>
      ))}

      <Badge />
    </>
  );
}

/**
 * The rotating ring. Circular type around a small mark, the way the
 * reference sets its badge in the top corner.
 */
function Badge() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[4%] top-[2%] hidden h-[5.5rem] w-[5.5rem] lg:block"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow motion-reduce:animate-none">
        <defs>
          <path
            id="hero-badge-circle"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--border))" strokeWidth="0.75" />
        <text
          fill="hsl(var(--muted-foreground))"
          fontSize="8.2"
          letterSpacing="2.6"
          fontFamily="var(--font-jetbrains), monospace"
        >
          <textPath href="#hero-badge-circle" startOffset="0%">
            SYSTEMS · SECURITY · REVERSING · BUILDING ·
          </textPath>
        </text>
        <path
          d="M50 42 L54.2 50 L50 58 L45.8 50 Z"
          fill="hsl(var(--foreground))"
        />
      </svg>
    </div>
  );
}
