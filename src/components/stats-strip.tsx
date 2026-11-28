import { Github, Award, Shield, Trophy } from "lucide-react";
import { Reveal } from "@/components/reveal";

const STATS = [
  { icon: Trophy, value: "2x", label: "Championships" },
  { icon: Github, value: "30", label: "Public repos" },
  { icon: Award, value: "19", label: "Certifications" },
  { icon: Shield, value: "1,600+", label: "CTF challenges solved" },
];

/**
 * Four stat cards rather than an inverted band. A hardcoded near-black band
 * broke in light mode; cards inherit the theme and read correctly in both.
 */
export function StatsStrip() {
  return (
    <section id="stats" className="container-wide pt-24 pb-6 md:pt-32 md:pb-8">
      <Reveal className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-mono text-muted-foreground">
          <span className="text-accent">S/01</span>
          <span>·</span>
          <span className="uppercase tracking-[0.16em]">Where things stand</span>
        </div>
        <h2 className="text-section mt-2 text-3xl font-bold text-foreground md:text-4xl">
          Numbers, briefly
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }, i) => (
          <Reveal key={label} delay={i * 90}>
            <div className="panel flex h-full flex-col gap-4 p-7">
              <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <div className="font-display text-4xl leading-none tracking-tight text-foreground">
                  {value}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {label}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* The number on its own is a participation count. This line says what
          the count is actually made of, and why it matters to someone paying
          for the work rather than to someone reading a resume. */}
      <Reveal className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">
          <span className="text-foreground">1,229 of those have a public
          writeup.</span> Each one records what the vulnerability actually was,
          the path in, and the proof it worked. That is the same method that
          goes into a firmware review, an audit, or any product that has to
          survive somebody trying to break it.
        </p>
      </Reveal>
    </section>
  );
}
