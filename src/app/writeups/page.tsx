import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Folder, FileText } from "lucide-react";
import { SectionHeader } from "@/components/about";
import { PROJECTS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Writeups",
  description: "Every CTF writeup repo, with all categories I have covered.",
};

export default function WriteupsPage() {
  const writeups = PROJECTS.filter((p) =>
    p.tags.some((t) => t === "Writeups"),
  );

  return (
    <div className="container-wide pt-28 pb-24">
      <SectionHeader
        index="01"
        label="Writeups"
        title="All writeup repositories"
        description="Every CTF platform I have written for, with the categories I have solved in each one. Click any card to open the repo on GitHub."
      />

      <div className="mt-12 space-y-10">
        {writeups.map((w) => (
          <article
            key={w.slug}
            className="rounded-lg border border-border bg-card p-6 md:p-8"
          >
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {w.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
                  {w.summary}
                </p>
              </div>
              <a
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground/30"
              >
                Open on GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </header>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5" />
                {w.categories.length} categories
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                {w.language}
              </span>
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {w.categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`${w.href}/tree/main/${c.replace(/\s+/g, "_")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-foreground/30"
                  >
                    <span className="text-foreground/90">{c}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}