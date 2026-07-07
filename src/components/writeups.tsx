import { ArrowUpRight, Flag, FileText, FolderTree } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/about";
import { PROJECTS, STATS } from "@/lib/config";

function countWriteupDirs(repo: string) {
  const proj = PROJECTS.find((p) => p.repo === repo);
  return proj?.categories.length ?? 0;
}

export function Writeups() {
  const writeups = PROJECTS.filter((p) =>
    p.tags.some((t) => t === "Writeups"),
  );

  const totalCategories = writeups.reduce(
    (sum, p) => sum + p.categories.length,
    0,
  );

  return (
    <section id="writeups" className="container-wide py-24">
      <SectionHeader
        index="04"
        label="Writeups"
        title="CTF writeups I&apos;ve published"
        description="Step-by-step writeups for challenges I've solved. Grouped by category, hosted on GitHub."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {writeups.map((w, i) => {
          const dirCount = countWriteupDirs(w.repo);
          return (
            <a
              key={w.slug}
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-foreground" />
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <h3 className="text-display mt-4 text-lg font-semibold tracking-tight">
                {w.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {w.summary}
              </p>

              <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <FolderTree className="h-3.5 w-3.5" />
                  {dirCount} categories
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  writeups
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card px-6 py-5">
        <div>
          <p className="text-mono text-muted-foreground">across platforms</p>
          <p className="mt-1 text-display text-2xl font-semibold tracking-tight">
            {STATS.ctfPlatforms.join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <div>
            <span className="block text-2xl font-semibold text-foreground">
              {writeups.length}
            </span>
            <span>repos</span>
          </div>
          <div>
            <span className="block text-2xl font-semibold text-foreground">
              {totalCategories}
            </span>
            <span>categories</span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="/writeups" className="link-underline text-foreground">
          See all writeup categories →
        </Link>
      </p>
    </section>
  );
}