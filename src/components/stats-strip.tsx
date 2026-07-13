import { Github, FileText, Shield } from "lucide-react";
const STATS = [
  { icon: Github, value: "12+", label: "Public repos" },
  { icon: FileText, value: "30+", label: "Writeups" },
  { icon: Shield, value: "60+", label: "CTF challenges" },
];
export function StatsStrip() {
  return (
    <section className="container-wide py-10">
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-card/30 p-4 md:gap-6 md:p-6">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center md:flex-row md:gap-3 md:text-left">
            <Icon className="h-5 w-5 text-accent md:h-6 md:w-6" />
            <div>
              <div className="font-display text-2xl font-bold tracking-tight md:text-3xl">{value}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
