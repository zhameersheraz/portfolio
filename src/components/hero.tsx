"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";

const ThreeScene = dynamic(
  () =>
    import("@/components/three/three-scene").then((m) => m.ThreeScene),
  { ssr: false },
);

const ROLES = [
  "Computer Science student",
  "Self-taught security learner",
  "Pentesting apprentice",
  "Writeup collector",
];

const PLATFORMS = [
  { name: "picoCTF", href: "https://picoctf.org/", src: "/picoctf.svg" },
  { name: "TryHackMe", href: "https://tryhackme.com/", src: "/tryhackme.svg" },
  {
    name: "CyberTalents",
    href: "https://cybertalents.com/",
    src: "/cybertalents.svg",
  },
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">(
    "typing",
  );

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          55,
        );
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1400);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 200);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          28,
        );
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setPhase("typing");
        return;
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, roleIndex]);

  return (
    <section className="relative isolate overflow-hidden">
      <ThreeScene />
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />

      <div className="container-wide pt-28 pb-20 md:pt-40 md:pb-28">
        <div className="flex items-center gap-2 text-mono text-muted-foreground">
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span>Available for collab & freelance security work</span>
        </div>

        <h1 className="text-display mt-6 max-w-4xl text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          {SITE.tagline}
        </h1>

        <div className="mt-6 flex items-center gap-2 text-base text-muted-foreground md:text-lg">
          <span className="text-foreground/70">I&apos;m a</span>
          <span className="font-mono text-foreground">
            {text}
            <span className="ml-0.5 inline-block h-5 w-[2px] -mb-0.5 animate-blink bg-foreground" />
          </span>
        </div>

        <p className="mt-6 max-w-2xl text-base text-muted-foreground text-pretty md:text-lg">
          I do CTFs on picoCTF, TryHackMe, and CyberTalents. I write up what I
          learn so I can find it again later. Slowly working toward being useful
          with a Kali box and a Python script.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            See projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Get in touch
          </Link>
          <a
            href="https://github.com/zhameersheraz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="font-mono">@zhameersheraz</span>
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {SITE.location}
          </span>
          <span>·</span>
          <span>27 public repos</span>
          <span>·</span>
          <span className="hidden sm:inline">Active on</span>
          <ul className="flex flex-wrap items-center gap-3">
            {PLATFORMS.map((p) => (
              <li key={p.name}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.name}
                  title={p.name}
                  className="group inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:text-foreground"
                >
                  <Image
                    src={p.src}
                    alt={p.name}
                    width={16}
                    height={16}
                    className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100 dark:invert"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}