import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SITE } from "@/lib/config";

const STACK = [
  { name: "GitHub", href: "https://github.com/zhameersheraz" },
  { name: "Kali Linux", href: "https://www.kali.org/" },
  { name: "Python", href: "https://www.python.org/" },
];

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

          {/* Portrait. Cropped from the mockup, so the corner brackets and the
              { building. breaking. learning. } marker are already in the
              pixels. Do not draw them again here or you get two sets.
              The leftover nav text on the left was painted out first. */}
          <div className="relative min-w-0">
            <div className="relative mx-auto w-full max-w-[24rem] lg:mx-0 lg:max-w-none lg:w-[135%] lg:-ml-[20%]">
              <Image
                src="/me-hero.png"
                alt="Zhameer Sheraz U. Tampugao"
                width={1280}
                height={1203}
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="w-full select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}