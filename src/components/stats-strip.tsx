import { Github, Award, Shield, Trophy } from "lucide-react";

const STATS = [
  { icon: Trophy, value: "1st", label: "Provincial champion" },
  { icon: Github, value: "27", label: "Public repos" },
  { icon: Award, value: "14", label: "Certifications" },
  { icon: Shield, value: "60+", label: "CTF challenges" },
];

export function StatsStrip() {
  return (
    <section className="container-wide py-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col gap-1.5 bg-background p-4 md:flex-row md:items-center md:gap-3 md:p-5"
          >
            <Icon
              className="h-4 w-4 shrink-0 text-accent md:h-5 md:w-5"
              aria-hidden
            />
            <div>
              <div className="text-display-sm text-2xl text-foreground md:text-3xl">
                {value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
