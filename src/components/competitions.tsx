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
          each. Tap a photo to open the post.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {COMPETITIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 110}>
            <div className="panel h-full overflow-hidden">
              {/* Photos sit side by side inside one card. Each keeps its own
                  link so the two provincial posts stay separately citable. */}
              <div
                className={`grid gap-1.5 ${c.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {c.photos.map((p) => (
                  <a
                    key={p.src}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/ph relative block overflow-hidden bg-secondary"
                    aria-label={`Open the post for ${c.event}`}
                  >
                    <AwardPhoto src={p.src} alt={`${c.event} team photo`} />
                    <span className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover/ph:bg-foreground/10" />
                  </a>
                ))}
              </div>

              <div className="p-7 md:p-8">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-display-sm text-lg leading-snug text-foreground">
                    {c.event}
                  </h3>
                  <ArrowUpRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{c.org}</p>

                <dl className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Placement
                    </dt>
                    <dd className="mt-1.5 font-mono text-sm text-foreground">
                      {c.placement}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Individual
                    </dt>
                    <dd className="mt-1.5 font-mono text-sm text-accent">
                      {c.role}
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {c.date}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
