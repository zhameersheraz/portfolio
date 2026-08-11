import Image from "next/image";
import {
  Terminal,
  ShieldCheck,
  Code2,
  BookOpen,
  MapPin,
  GraduationCap,
  Award,
} from "lucide-react";
import { CERTS } from "@/lib/config";

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: "Security-first", body: "Hands-on with CTFs, network defense, and reading other people's writeups so I can write better ones." },
  { icon: Code2, title: "Building in public", body: "Small repos that document what I learn. Scriptable, documented, and easy to come back to." },
  { icon: BookOpen, title: "Still a student", body: "CS undergrad in the Philippines. Learning fundamentals properly before chasing fancier exploits." },
  { icon: Terminal, title: "Linux + Kali", body: "Most of my work happens in a terminal. Comfortable with bash, git, networking basics, and the standard tooling." },
];

export function About() {
  return (
    <section id="about" className="container-wide py-24">
      <SectionHeader index="01" label="About" title="Who I am" description="A short version, in case the long version scrolls past you." />
      <div className="relative mt-10 grid gap-8 rounded-lg border border-border/60 bg-card p-6 shadow-sm shadow-foreground/5 dark:bg-card/40 md:grid-cols-[auto_1fr] md:gap-10 md:p-8 bracket-corner">
        <div className="relative mx-auto flex flex-col items-center md:mx-0 md:items-start">
          <div aria-hidden className="absolute -inset-3 rounded-full bg-gradient-to-br from-foreground/20 via-transparent to-foreground/5 blur-xl dark:from-accent/40 dark:via-transparent dark:to-foreground/20" />
          <div className="relative h-48 w-48 overflow-hidden rounded-full ring-1 ring-foreground/10 shadow-lg shadow-foreground/5 md:h-56 md:w-56">
            <Image src="/me.png" alt="Zhameer Sheraz U. Tampugao" fill priority sizes="(min-width: 768px) 14rem, 12rem" className="object-cover object-[center_15%] saturate-[0.85] contrast-[1.05] brightness-[0.97]" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 text-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Philippines</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3 w-3" /> CS undergrad</span>
          </div>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p className="text-pretty">Hi, I&apos;m <span className="text-foreground">Zhameer</span>. I split most days between class, a terminal, and a notebook where I write up whatever I just figured out so I stop forgetting it.</p>
          <p className="text-pretty">My hobby-with-delusions-of-utility is running through CTF challenges on <span className="text-foreground">picoCTF</span>, <span className="text-foreground">TryHackMe</span>, and <span className="text-foreground">CyberTalents</span>. Writeups end up on GitHub because future-me forgets everything, and someone else might be stuck on the same box.</p>
          <p className="text-pretty">Outside of security I tinker with Python and JS, try to keep a static site or two alive, and slowly work through networking fundamentals. I&apos;m not hiring myself out as a pentester yet. I&apos;m still earning the right to call myself one.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30">
            <Icon className="h-5 w-5 text-foreground" />
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-2 text-mono text-muted-foreground">
          <Award className="h-3.5 w-3.5 text-accent" />
          <span className="text-accent">02</span>
          <span>·</span>
          <span>Certifications</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">Course completions and role certifications</h3>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Course completions and role certifications from Cisco, IBM, HackerRank, and freeCodeCamp.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CERTS.map((cert) => (
            <a
              key={cert.id}
              href={cert.link ?? cert.image}
              target="_blank"
              rel="noreferrer"
              className={`group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-foreground/30 hover:shadow-md hover:shadow-foreground/5${cert.featured ? " sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div
                className="relative w-full overflow-hidden bg-foreground/5"
                style={{ aspectRatio: cert.aspect ?? 4 / 3 }}
              >
                <Image
                  src={cert.image}
                  alt={`${cert.title} — ${cert.issuer}`}
                  fill
                  sizes={cert.featured ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized={cert.image.startsWith("http") || cert.image.endsWith(".svg")}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-tight">{cert.title}</h4>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{cert.issuer}</span>
                  <span className="text-mono">{cert.issued}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ index, label, title, description }: { index: string; label: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-mono text-muted-foreground">
        <span className="text-accent">{index}</span><span>·</span><span>{label}</span>
      </div>
      <h2 className="text-display text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty md:text-base">{description}</p>}
    </div>
  );
}
