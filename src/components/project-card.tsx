"use client";

import { useEffect, useState } from "react";
import { Star, GitFork, Eye, ArrowUpRight } from "lucide-react";
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
  project: import("@/lib/config").ProjectEntry;
  index: number;
}) {
  const stats = useRepoStats(project.repo);
  const views = useViews(project.slug);

  return (
    <article className="panel panel-hover group relative flex flex-col overflow-hidden">
      {"art" in project && project.art ? (
        // The thumbnail. A 16 by 10 crop of the screenshot, sized so eight of
        // them sit on one screen. The hairline matters: two of the
        // screenshots have a white background of their own, and without a
        // rule they ran straight into the card and read as no image at all.
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/70 bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.art as string}
            alt=""
            width={1600}
            height={1000}
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* The live demo badge sits on the image so the card body stays
              free for the title and the one line of description. */}
          {"demo" in project && project.demo ? (
            <a
              href={project.demo as string}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground backdrop-blur-sm transition-colors hover:bg-background"
            >
              {"demoLabel" in project && project.demoLabel
                ? (project.demoLabel as string)
                : "Play"}
              <ArrowUpRight className="h-2.5 w-2.5" aria-hidden />
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {String(index + 1).padStart(2, "0")} · {project.language}
          </span>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            ↗
          </a>
        </div>

        <h3 className="text-display-sm mt-2 text-[0.95rem] font-medium leading-snug">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            {project.title}
          </a>
        </h3>

        {/* Two lines, then stop. The full summary lives in the repo README,
            which is where anyone who wants the detail will go anyway. */}
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
          {project.summary}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-3 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3" />
            {formatNumber(stats?.stars ?? 0)}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {formatNumber(stats?.forks ?? 0)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 transition-opacity",
              views ? "opacity-100" : "opacity-0",
            )}
          >
            <Eye className="h-3 w-3" />
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
      </div>
    </article>
  );
}

export function Projects({ bare = false }: { bare?: boolean }) {
  const visible = PROJECTS.filter(
    (p) => p.featured && !(p as { hidden?: boolean }).hidden,
  );

  return (
    <section
      id="projects"
      className={bare ? "pb-8" : "container-wide pt-24 pb-16 md:pt-32 md:pb-20"}
    >
      {!bare && (
        <SectionHeader
          index="04"
          label="Projects"
          title="Real work, in public"
          description="The repos that are actually mine. Open-source tools, notes, and small builds. Live stats pulled from the GitHub API."
        />
      )}

      {/* A folder grid. Two columns of tall cards made every project the size
          of a paragraph, and eight of them in a row is a wall. Four columns
          of small tiles reads the other way round: you can see the whole body
          of work at once and pick one. */}
      <div
        className={
          bare
            ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            : "mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {visible.map((project, i) => (
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