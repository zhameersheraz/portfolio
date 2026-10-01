import { ArrowUpRight } from "lucide-react";
import { COMPETITIONS } from "@/lib/config";
import { Reveal } from "@/components/reveal";
import { AwardPhoto } from "@/components/award-photo";

export function Competitions() {
  return (
    <section id="competitions" className="container-wide section-pad">
      <Reveal className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-mono text-muted-foreground">
          <span className="text-accent">01</span>
          <span>·</span>
          <span className="uppercase tracking-[0.16em]">Competitions</span>
        </div>
        <h2 className="text-section mt-2 text-3xl font-bold text-foreground md:text-4xl">
          Two championships
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
          Placed first in both, and finished top of the individual scoreboard in
          each. Team SCC CCS Red Lions.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {COMPETITIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/30"
            >
              <AwardPhoto src={c.image} alt={`${c.event} team photo`} />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-display-sm text-[0.95rem] leading-snug text-foreground">
                    {c.event}
                  </h3>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>

                <p className="mt-1.5 text-xs text-muted-foreground">{c.org}</p>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Placement
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-foreground">
                      {c.placement}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Individual
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-accent">
                      {c.role}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {c.date}
                </p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
