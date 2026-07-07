/**
 * Tiny GitHub API client with ISR-friendly caching.
 * Uses GITHUB_TOKEN if set (60 → 5000 req/hr); unauth is fine for low traffic.
 */

const API = "https://api.github.com";

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

export type RepoInfo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  archived: boolean;
  fork: boolean;
};

export type UserInfo = {
  login: string;
  name: string | null;
  bio: string | null;
  html_url: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
};

async function ghFetch<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers,
      next: { revalidate },
    });
    if (!res.ok) {
      console.warn(`[github] ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[github] ${path} failed:`, err);
    return null;
  }
}

export function getRepo(owner: string, repo: string) {
  return ghFetch<RepoInfo>(`/repos/${owner}/${repo}`, 1800);
}

export function getUser(username: string) {
  return ghFetch<UserInfo>(`/users/${username}`, 3600);
}

export function getRepos(username: string) {
  return ghFetch<RepoInfo[]>(`/users/${username}/repos?per_page=100&sort=updated`, 1800);
}

/**
 * Approximate repo size. GitHub exposes `size` in KB.
 * Converts to commits-ish proxy by combining size + recent activity.
 */
export async function getRepoStats(owner: string, repo: string) {
  const info = await getRepo(owner, repo);
  if (!info) return null;
  return {
    stars: info.stargazers_count,
    forks: info.forks_count,
    size_kb: info.size,
    language: info.language,
    updated_at: info.updated_at,
    pushed_at: info.pushed_at,
    topics: info.topics ?? [],
    description: info.description,
  };
}