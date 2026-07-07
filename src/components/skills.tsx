import { SKILLS } from "@/lib/config";
import { SectionHeader } from "@/components/about";

export function Skills() {
  return (
    <section id="skills" className="container-wide py-24">
      <SectionHeader
        index="02"
        label="Skills"
        title="What I work with"
        description="Tools and topics I touch often enough to have opinions about."
      />

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {SKILLS.map((group) => (
          <div
            key={group.category}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{group.category}</h3>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {group.items.length}
              </span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}