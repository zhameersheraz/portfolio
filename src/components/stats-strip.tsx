import { Github, Award, Shield, Trophy } from "lucide-react";
import { Reveal } from "@/components/reveal";

const STATS = [
  { icon: Trophy, value: "2x", label: "Championships" },
  { icon: Github, value: "27", label: "Public repos" },
  { icon: Award, value: "14", label: "Certifications" },
  { icon: Shield, value: "60+", label: "CTF challenges" },
];

export function StatsStrip() {
  return (
    <section className="band-ink">
      <div className="container-wide py-20 md:py-24">
        <div className="flex items-center gap-3">
          <span className="eyebrow text-accent">S/01</span>
          <span className="eyebrow">Where things stand</span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <Reveal key={label} delay={i * 90}>
              <Icon className="h-4 w-4 shrink-0 text-accent md:h-5 md:w-5" aria-hidden />
              <div className="mt-3 font-mono text-3xl leading-none tracking-tight md:text-4xl">
                {value}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
                {label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
