import Image from "next/image";
import {
  Terminal,
  ShieldCheck,
  Code2,
  Hammer,
  MapPin,
  GraduationCap,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { CERTS } from "@/lib/config";
import { Reveal } from "@/components/reveal";

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: "Security-first", body: "Hands-on with CTFs, network defense, and reading other people's writeups so I can write better ones." },
  { icon: Code2, title: "Building in public", body: "Small repos that document what I learn. Scriptable, documented, and easy to come back to." },
  { icon: Hammer, title: "Free and open tooling", body: "Kali, VS Code, git, Nmap, Wireshark, Python. Everything here was built and deployed on free or open-source tools. No paid toolchain needed." },
  { icon: Terminal, title: "Linux + Kali", body: "Most of my work happens in a terminal. Comfortable with bash, git, networking basics, and the standard tooling." },
];

/**
 * How the work is actually delivered.
 *
 * A hiring manager and a business owner both want to know how the work
 * happens, not just what came out of it. These are the parts that are true
 * of every engagement so far, and they are the same whether the client is a
 * restaurant owner or a hardware vendor.
 */
const HOW = [
  {
    step: "01",
    title: "Find the cost first",
    body: "Before writing anything, I want the number the problem already costs you. A wrong order at P18 a time is a fixable problem. A vague feeling that things are slow is not.",
  },
  {
    step: "02",
    title: "Ship the smallest thing that works",
    body: "A working tool beats a plan. Every project here is deployed and usable, not a prototype in a folder waiting for a weekend that never comes.",
  },
  {
    step: "03",
    title: "No lock in",
    body: "Everything is open source, runs on free tiers, and can be moved off my infrastructure whenever you want. No accounts, no per-seat fees, no data leaving your device.",
  },
  {
    step: "04",
    title: "Plain language, no jargon",
    body: "You get the cost, the trade-off and what I would do next, in the language you already use. Not a security report nobody reads past page one.",
  },
];

export function About() {
  return (
    <section id="about" className="container-wide section-pad">
      <SectionHeader index="01" label="About" title="Who I am" description="A short version, in case the long version scrolls past you." />
      <div className="panel relative mt-10 grid gap-8 p-7 md:grid-cols-[auto_1fr] md:gap-12 md:p-10 bracket-corner">
        <div className="relative mx-auto flex flex-col items-center md:mx-0 md:items-start">
          {/* No blurred glow behind this and no ring on it. Both were drawing
              the very edge he was complaining about: the glow dropped the
              card to 238 and the 1px ring at foreground/10 sat at 230, against
              a 255 card. Measured across the circle's left edge, outside read
              238 and inside read 255. A soft shadow alone defines the shape
              once the photo's own background matches the card. */}
          <div className="relative h-48 w-48 overflow-hidden rounded-full shadow-[0_20px_45px_-22px_rgba(30,25,18,0.30)] md:h-56 md:w-56">
            <Image src="/me-about.jpg" alt="Zhameer Sheraz U. Tampugao" fill priority unoptimized sizes="(min-width: 768px) 14rem, 12rem" className="object-cover" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 text-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Philippines</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3 w-3" /> CS undergrad</span>
          </div>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p className="text-pretty">Hi, I&apos;m <span className="text-foreground">Zhameer</span>. Most of my day goes to three things: class, a terminal, and whatever I just figured out.</p>
          <p className="text-pretty">My hobby-with-delusions-of-utility is running through CTF challenges. Writeups end up on GitHub because future-me forgets everything, and someone else might be stuck on the same box.</p>
          <p className="text-pretty">Outside of security I tinker with Python and JS, try to keep a static site or two alive, and slowly work through networking fundamentals. I&apos;m not hiring myself out as a pentester yet. I&apos;m still earning the right to call myself one.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="panel panel-hover p-6">
            <Icon className="h-5 w-5 text-foreground" />
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-2 text-mono text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-accent" />
          <span className="text-accent">02</span>
          <span>·</span>
          <span className="uppercase tracking-[0.14em]">How I work</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">The same four steps every time</h3>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Whether the client is a restaurant owner or a hardware vendor, this is the shape of the work.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {HOW.map((h) => (
            <div key={h.step} className="panel panel-hover p-6">
              <span className="font-mono text-xs text-accent">{h.step}</span>
              <h4 className="mt-3 text-sm font-semibold">{h.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-2 text-mono text-muted-foreground">
          <Award className="h-3.5 w-3.5 text-accent" />
          <span className="text-accent">03</span>
          <span>·</span>
          <span className="uppercase tracking-[0.14em]">Certifications</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">Courses, roles and competitions</h3>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Course completions, role certifications and a competition certificate. Every card links to its verification page.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CERTS.map((cert) => (
            <a
              key={cert.id}
              href={cert.link ?? cert.image}
              target="_blank"
              rel="noreferrer"
              className="panel panel-hover block overflow-hidden"
            >
              <div
                className="relative w-full overflow-hidden bg-foreground/5"
                style={{ aspectRatio: cert.aspect ?? 4 / 3 }}
              >
                <Image
                  src={cert.image}
                  alt={`${cert.title} - ${cert.issuer}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized={cert.image.startsWith("http") || cert.image.endsWith(".svg")}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-tight">{cert.title}</h4>
                  {/* Every cert already links to its issuer's verification
                      page. The anchor alone gave no hint of it, so the card
                      now says so rather than relying on the cursor. */}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-hidden
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{cert.issuer}</span>
                  <span className="text-mono">{cert.issued}</span>
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-foreground">
                  Verify ↗
                </p>
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
    <Reveal className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-mono text-muted-foreground">
        <span className="text-accent">{index}</span><span>·</span><span className="uppercase tracking-[0.14em]">{label}</span>
      </div>
      <h2 className="text-section mt-2 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">{description}</p>}
    </Reveal>
  );
}
