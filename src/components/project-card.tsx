"use client";

import { useEffect, useState } from "react";
import { Star, GitFork, Eye } from "lucide-react";
import { SectionHeader } from "@/components/about";
import { PROJECTS } from "@/lib/config";
import { formatNumber, cn } from "@/lib/utils";

type RepoStats = {
  stars: number;
  forks: number;
  pushed_at: string;
  language: string | null;
  views?: number;
};

function useRepoStats(fullName: string) {
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/github?repo=${encodeURIComponent(fullName)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setStats({
            stars: data.stars,
            forks: data.forks,
            pushed_at: data.pushed_at,
            language: data.language,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [fullName]);

  return stats;
}

function useViews(slug: string) {
  const [views, setViews] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.views === "number") {
          setViews(data.views);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return views;
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const stats = useRepoStats(project.repo);
  const views = useViews(project.slug);

  return (
    <article className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-mono text-muted-foreground">·</span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {project.language}
          </span>
        </div>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ↗ GitHub
        </a>
      </div>

      <h3 className="text-display mt-4 text-lg font-semibold tracking-tight">
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          {project.title}
        </a>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        {project.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.categories.slice(0, 4).map((c) => (
          <li
            key={c}
            className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70"
          >
            {c}
          </li>
        ))}
        {project.categories.length > 4 && (
          <li className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            +{project.categories.length - 4} more
          </li>
        )}
      </ul>

      <div className="mt-6 flex items-center gap-4 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5" />
          {formatNumber(stats?.stars ?? 0)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitFork className="h-3.5 w-3.5" />
          {formatNumber(stats?.forks ?? 0)}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 transition-opacity",
            views ? "opacity-100" : "opacity-0",
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          {formatNumber(views ?? 0)}
        </span>
        <span className="ml-auto">
          {stats?.pushed_at
            ? new Date(stats.pushed_at).toLocaleDateString("en", {
                month: "short",
                year: "numeric",
              })
            : "recent"}
        </span>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="container-wide py-24">
      <SectionHeader
        index="03"
        label="Projects"
        title="Real work, in public"
        description="The repos that are actually mine. Writeups, notes, and small builds. Live stats pulled from the GitHub API."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {PROJECTS.filter((p) => p.featured).map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        More on{" "}
        <a
          href="https://github.com/zhameersheraz"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-foreground"
        >
          github.com/zhameersheraz
        </a>
        .
      </p>
    </section>
  );
}