import { SKILLS } from "@/lib/config";
import { SectionHeader } from "@/components/about";
import { SKILL_ICONS } from "@/components/skill-icons";

export function Skills() {
  return (
    <section id="skills" className="container-wide section-pad">
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
            className="panel panel-hover p-7 md:p-8"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{group.category}</h3>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {group.items.length}
              </span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => {
                const Icon = SKILL_ICONS[item];
                return (
                  <li
                    key={item}
                    className="group/chip flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground/80 transition-colors hover:border-foreground/25 hover:text-foreground"
                  >
                    {Icon ? (
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover/chip:text-accent" />
                    ) : null}
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}