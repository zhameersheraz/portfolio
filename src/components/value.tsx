import { ArrowUpRight } from "lucide-react";
import { VALUE } from "@/lib/config";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/about";

/**
 * What the problems are worth.
 *
 * A technical portfolio answers "what can you build". A recruiter or a shop
 * owner is asking a different question: "what does this save me, and who do
 * I pay". So each card leads with the cost of the problem in the customer's
 * own currency, then says what was built against it.
 *
 * The figures are published and each one links to its source, because the
 * number is the argument and an unsourced number is just a louder claim.
 *
 * The last card is not a problem but an offer. Without it the section lists
 * good intentions and stops. With it, the page ends on what can be done next.
 */
export function Value() {
  return (
    <section id="value" className="container-wide pt-24 md:pt-32">
      <Reveal className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-mono text-muted-foreground">
          <span className="text-accent">01</span>
          <span>·</span>
          <span className="uppercase tracking-[0.16em]">What it is worth</span>
        </div>
        <h2 className="text-section mt-2 text-3xl font-bold text-foreground md:text-4xl">
          Problems with a price tag
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
          Every project below started from a number, not an idea. These are the
          economics of the problem, what I built against it, and who ends up
          holding the bill.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {VALUE.map((v, i) => (
          <Reveal key={v.id} delay={i * 90}>
            <article className="panel flex h-full flex-col p-7">
              {/* The number, large. Everything else on the card is sized
                  down from here, so the eye lands on the cost first. */}
              <p className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.05em] text-foreground">
                {v.stat}
              </p>
              {/* Two lines are reserved whether or not the note needs them, so
                  the card titles below line up across the row. One of the
                  notes wraps and the rest do not. */}
              <p className="mt-2 min-h-[36px] text-[13px] leading-snug text-muted-foreground">
                {v.statNote}
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-display-sm text-base font-medium leading-snug text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {v.problem}
                </p>
              </div>

              <div className="mt-5">
                <p className="eyebrow">What I built</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80 text-pretty">
                  {v.build}
                </p>
              </div>

              <div className="mt-5">
                <p className="eyebrow">Who pays</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {v.who}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-wider">
                  <a
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-foreground transition-opacity hover:opacity-70"
                  >
                    Code <ArrowUpRight className="h-3 w-3" aria-hidden />
                  </a>
                  {v.demo ? (
                    <a
                      href={v.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Live <ArrowUpRight className="h-3 w-3" aria-hidden />
                    </a>
                  ) : null}
                  <a
                    href={v.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-muted-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {v.source.label}
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        {/* The offer. The section would otherwise end on a list of problems
            with nothing said about what to do about them. */}
        <Reveal delay={VALUE.length * 90}>
          <article className="panel flex h-full flex-col p-7">
            <p className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.05em] text-foreground">
              0
            </p>
            <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
              of these have a paying customer yet
            </p>

            <div className="mt-6 border-t border-border pt-5">
              <h3 className="text-display-sm text-base font-medium leading-snug text-foreground">
                What I take on
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                <li className="flex gap-2.5">
                  <span className="text-accent" aria-hidden>
                    ›
                  </span>
                  <span>
                    A firmware or device security review for a small hardware
                    vendor
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent" aria-hidden>
                    ›
                  </span>
                  <span>
                    An on device model that runs without a server, for a team
                    that needs it offline
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent" aria-hidden>
                    ›
                  </span>
                  <span>
                    A kitchen or operations dashboard that removes a manual
                    step
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                If one of these is costing you money, that is the conversation.
              </p>
              <a
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-background transition-opacity hover:opacity-90"
              >
                Start here
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
