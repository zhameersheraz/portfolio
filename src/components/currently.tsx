import { Sparkles, Github, Wrench } from "lucide-react";
const NOW = [
  { icon: Sparkles, text: "Wrapping up the picoCTF 2026 General Skills track." },
  { icon: Wrench, text: "Building a small Go tool to parse PCAPs." },
  { icon: Github, text: "Open-sourcing last month's writeups." },
];
export function Currently() {
  return (
    <section className="container-wide py-16">
      <div className="rounded-lg border border-border bg-card/40 p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Currently working on</h2>
        </div>
        <ul className="space-y-3">
          {NOW.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm md:text-base">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-pretty text-muted-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
