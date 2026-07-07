import { Terminal, ShieldCheck, Code2, BookOpen } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Security-first",
    body: "Hands-on with CTFs, network defense, and reading other people's writeups so I can write better ones.",
  },
  {
    icon: Code2,
    title: "Building in public",
    body: "Small repos that document what I learn — scriptable, documented, and easy to come back to.",
  },
  {
    icon: BookOpen,
    title: "Still a student",
    body: "CS undergrad in the Philippines. Learning fundamentals properly before chasing fancier exploits.",
  },
  {
    icon: Terminal,
    title: "Linux + Kali",
    body: "Most of my work happens in a terminal. Comfortable with bash, git, networking basics, and the standard tooling.",
  },
];

export function About() {
  return (
    <section id="about" className="container-wide py-24">
      <SectionHeader
        index="01"
        label="About"
        title="Who I am"
        description="A short version, in case the long version scrolls past you."
      />

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p className="text-pretty">
            I&apos;m <span className="text-foreground">{`Zhameer`}</span>, a
            Computer Science student based in the Philippines. Most days I split
            my time between class, a terminal, and a notebook where I write up
            whatever I just figured out.
          </p>
          <p className="text-pretty">
            My main hobby-with-delusions-of-utility is running through CTF
            challenges on{" "}
            <span className="text-foreground">picoCTF</span>,{" "}
            <span className="text-foreground">TryHackMe</span>, and{" "}
            <span className="text-foreground">CyberTalents</span>. I publish the
            writeups on GitHub because (a) future-me forgets everything, and (b)
            someone else might be stuck on the same box.
          </p>
          <p className="text-pretty">
            Outside of security I tinker with Python and JS, try to keep a
            static site or two alive, and slowly work through networking
            fundamentals. I&apos;m not hiring myself out as a pentester yet —{" "}
            <span className="text-foreground">
              I&apos;m still earning the right to call myself one.
            </span>
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <Icon className="h-5 w-5 text-foreground" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-mono text-muted-foreground">
        <span className="text-accent">{index}</span>
        <span>·</span>
        <span>{label}</span>
      </div>
      <h2 className="text-display text-3xl font-bold tracking-tight md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}