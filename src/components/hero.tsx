import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SITE } from "@/lib/config";
import { ThreatGlobe } from "@/components/threat-globe";

const STACK = [
  { name: "GitHub", href: "https://github.com/zhameersheraz" },
  { name: "Kali Linux", href: "https://www.kali.org/" },
  { name: "Python", href: "https://www.python.org/" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="container-wide pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-20">
          {/* Voice */}
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden
              />
              <span>Available for collab and freelance security work</span>
            </p>

            {/* No text-balance here: balanced wrapping fights a monospace
                face and produces a ragged five-line rag. Natural wrap reads
                cleaner. */}
            <h1 className="text-display mt-7 text-[2.4rem] font-bold sm:text-[3rem] lg:text-[3.75rem]">
              {SITE.tagline}
            </h1>

            <p className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Computer Science undergraduate in Pagadian City. I break things
              on Kali, write up how I did it, and turn the useful parts into
              small Python tools.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="group inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                See projects
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Get in touch
              </Link>
            </div>

            <dl className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                <dd className="text-sm text-muted-foreground">
                  {SITE.location}
                </dd>
              </div>
              <div>
                <dd className="text-sm text-muted-foreground">
                  <span className="text-display-sm text-base text-foreground">
                    27
                  </span>{" "}
                  public repos
                </dd>
              </div>
              <div>
                <dd className="text-sm text-muted-foreground">
                  <span className="text-display-sm text-base text-foreground">
                    16
                  </span>{" "}
                  certifications
                </dd>
              </div>
            </dl>
          </div>

          {/* Signature */}
          <div className="min-w-0">
            <div className="panel overflow-hidden">
              <ThreatGlobe />
              <div className="border-t border-border p-6">
                <p className="font-mono text-[11px] tracking-tight text-muted-foreground">
                  threat surface · live routes
                </p>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  Drag it. Every node is a host, every arc is a route someone is watching.
                </p>
              </div>
            </div>

            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {STACK.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 items-center rounded-md border border-border px-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
