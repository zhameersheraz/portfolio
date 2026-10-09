import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SITE } from "@/lib/config";

const STACK = [
  { name: "GitHub", href: "https://github.com/zhameersheraz" },
  { name: "Kali Linux", href: "https://www.kali.org/" },
  { name: "Python", href: "https://www.python.org/" },
];

// Four L-shaped corner marks. Purely decorative, so they are aria-hidden.
function Brackets() {
  const base =
    "pointer-events-none absolute h-5 w-5 border-foreground/25 transition-colors dark:border-foreground/20";
  return (
    <>
      <span aria-hidden className={`${base} left-0 top-0 border-l border-t`} />
      <span aria-hidden className={`${base} right-0 top-0 border-r border-t`} />
      <span aria-hidden className={`${base} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden className={`${base} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="container-wide pt-28 md:pt-40 lg:pb-4">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-16">
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
                    17
                  </span>{" "}
                  certifications
                </dd>
              </div>
            </dl>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-l border-border pl-4">
              {STACK.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="text-accent" aria-hidden>
                      &gt;
                    </span>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Portrait. Baked with the right edge dissolved into characters,
              see scripts/ascii_art.py. Sized to run off the bottom of the
              section the way the reference does, rather than sitting boxed
              inside the column. */}
          <div className="relative min-w-0">
            <div className="relative mx-auto w-full max-w-[24rem] lg:mx-0 lg:max-w-none lg:w-[135%] lg:-ml-[20%]">
              <Brackets />
              <Image
                src="/me-dissolve.png"
                alt="Zhameer Sheraz U. Tampugao"
                width={759}
                height={735}
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="w-full select-none"
              />
            </div>

            {/* Below the image, not on top of it: the portrait now runs past
                the right edge of its column and the ASCII region swallows the
                bottom-right corner. */}
            <p className="mt-2 hidden text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:block">
              { "{ building. breaking. learning. }" }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}