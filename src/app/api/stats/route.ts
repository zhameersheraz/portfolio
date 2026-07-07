import { NextResponse } from "next/server";
import { getRepos, getUser } from "@/lib/github";
import { STATS } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 1800;

export async function GET() {
  const [user, repos] = await Promise.all([
    getUser(STATS.githubHandle),
    getRepos(STATS.githubHandle),
  ]);

  const totalStars = repos?.reduce((sum, r) => sum + r.stargazers_count, 0) ?? 0;
  const totalForks = repos?.reduce((sum, r) => sum + r.forks_count, 0) ?? 0;
  const languages = new Map<string, number>();
  for (const r of repos ?? []) {
    if (!r.language) continue;
    languages.set(r.language, (languages.get(r.language) ?? 0) + 1);
  }
  const topLanguages = Array.from(languages.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json(
    {
      handle: STATS.githubHandle,
      name: user?.name ?? null,
      bio: user?.bio ?? null,
      avatar: user?.avatar_url ?? null,
      url: user?.html_url ?? `https://github.com/${STATS.githubHandle}`,
      followers: user?.followers ?? 0,
      following: user?.following ?? 0,
      public_repos: user?.public_repos ?? repos?.length ?? 0,
      total_stars: totalStars,
      total_forks: totalForks,
      top_languages: topLanguages,
      fetched_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}