import { NextResponse } from "next/server";
import { getRepoStats, getRepos } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const repo = url.searchParams.get("repo");
  const user = url.searchParams.get("user");

  try {
    if (repo) {
      const [owner, name] = repo.split("/");
      if (!owner || !name) {
        return NextResponse.json(
          { error: "repo must be in owner/name form" },
          { status: 400 },
        );
      }
      const stats = await getRepoStats(owner, name);
      if (!stats) {
        return NextResponse.json(
          { error: "Repo not found or rate-limited" },
          { status: 404 },
        );
      }
      return NextResponse.json(stats, {
        headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
      });
    }

    if (user) {
      const repos = await getRepos(user);
      if (!repos) {
        return NextResponse.json(
          { error: "User not found or rate-limited" },
          { status: 404 },
        );
      }
      const trimmed = repos
        .filter((r) => !r.fork)
        .map((r) => ({
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          topics: r.topics ?? [],
          updated_at: r.updated_at,
        }));
      return NextResponse.json(
        { repos: trimmed },
        {
          headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" },
        },
      );
    }

    return NextResponse.json(
      { error: "Pass ?repo=owner/name or ?user=username" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}