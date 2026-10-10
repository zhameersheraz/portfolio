import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SITE } from "@/lib/config";
import { BinaryRain } from "@/components/binary-rain";
import { Reveal } from "@/components/reveal";

const STACK = [
  { name: "GitHub", href: "https://github.com/zhameersheraz" },
  { name: "Kali Linux", href: "https://www.kali.org/" },
  { name: "Python", href: "https://www.python.org/" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="container-wide pt-28 md:pt-32 lg:pt-40 lg:pb-4">
        {/* Two columns from md, not lg. Between 768 and 1023 the layout used to
            be single column, which left the right half of the screen empty and
            pushed the portrait to about 769px down, below the fold on any normal
            laptop window. The name drops back to 2rem across that band because a
            two-column 768px viewport leaves the text about 360px, and
            "SHERAZ TAMPUGAO" at the sm size needs roughly 400px. Hence the size
            going down at md and up again at lg. */}
        <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] md:gap-10 lg:gap-16">
          {/* Voice. Each block carries a small delay so the page assembles
              itself on load instead of arriving all at once. The portrait is
              deliberately not wrapped: it is the priority image and the LCP
              element, and fading it in would delay the thing the visitor came
              for in order to decorate it. */}
          <div className="min-w-0">
            <Reveal immediate>
              <p className="eyebrow text-foreground">[ HELLO, I&apos;M ]</p>
            </Reveal>

            {/* The name is the headline now, so it is the H1. The tagline
                keeps the voice and stays the loudest line under it, which is
                why it holds a display size rather than body size. */}
            {/* Sans, not the JetBrains Mono the rest of the display type
                uses. The reference sets the name in a geometric sans and keeps
                mono for the labels, and the mixed texture is the point: a
                monospace name at 64px reads as a terminal readout, and the
                outline lands lumpy because the stems are already heavy.
                Caps because at display size the name reads as a masthead, and
                because it pairs with the [ HELLO, I'M ] mono label above it.
                Uppercase is done in CSS so the DOM and screen readers still get
                the real name. */}
            <Reveal immediate delay={70}>
              <h1 className="font-masthead mt-7 text-[2rem] font-semibold uppercase leading-[1.1] tracking-[0.05em] sm:text-[2.5rem] md:text-[2rem] lg:text-[2.8rem]">
                <span className="block">Zhameer</span>
                <span className="text-outline block font-medium">Sheraz Tampugao</span>
              </h1>
            </Reveal>

            <Reveal immediate delay={140}>
              <p className="text-display mt-7 text-[1.15rem] leading-snug sm:text-[1.25rem] lg:w-[106%] lg:text-[1.25rem]">
                {SITE.tagline}
              </p>
            </Reveal>

            <Reveal immediate delay={200}>
              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                Computer Science undergraduate in Pagadian City. I break things
                on Kali, write up how I did it, and turn the useful parts into
                small Python tools.
              </p>
            </Reveal>

            <Reveal immediate delay={260}>
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
            </Reveal>

            <Reveal immediate delay={320}>
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
            </Reveal>

            <Reveal immediate delay={380}>
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
            </Reveal>

            {/* Moved out of the eyebrow when that slot became [ HELLO, I'M ].
                It is the one line on the page that asks for work, so it stays
                lit rather than being folded into the surrounding meta. */}
            <Reveal immediate delay={430}>
              <p className="mt-6 flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span className="eyebrow">Available for collab and freelance security work</span>
              </p>
            </Reveal>
          </div>

          {/* Portrait. Cropped from the mockup, so the corner brackets and the
              { building. breaking. learning. } marker are already in the
              pixels. Do not draw them again here or you get two sets.
              The leftover nav text on the left was painted out first.

              The binary field sits on top of the photograph, not under it. It
              samples the same file, so it stays aligned at every width and at
              every responsive breakpoint without a second asset to keep in
              step. */}
          <div className="relative min-w-0">
            <div className="relative mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none md:w-full lg:w-[120%] lg:-ml-[2%]">
              <Image
                src="/me-hero.png"
                alt="Zhameer Sheraz U. Tampugao"
                width={1280}
                height={1203}
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="w-full select-none"
              />
              <BinaryRain src="/me-hero.png" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}