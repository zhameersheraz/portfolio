/**
 * View counter. File-based persistence so it survives restarts.
 * For production swap with Redis/Upstash KV. The interface stays the same.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const STORAGE_DIR = path.join(process.cwd(), ".storage");
const VIEWS_FILE = path.join(STORAGE_DIR, "views.json");

type ViewsData = Record<string, number>;

async function ensureStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(VIEWS_FILE);
    } catch {
      await fs.writeFile(VIEWS_FILE, JSON.stringify({}), "utf8");
    }
  } catch (err) {
    // .storage is gitignored and ignored in serverless. Fail silently.
    console.warn("[views] storage init failed:", err);
  }
}

async function readViews(): Promise<ViewsData> {
  await ensureStorage();
  try {
    const raw = await fs.readFile(VIEWS_FILE, "utf8");
    return JSON.parse(raw) as ViewsData;
  } catch {
    return {};
  }
}

async function writeViews(data: ViewsData) {
  await ensureStorage();
  try {
    await fs.writeFile(VIEWS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("[views] write failed:", err);
  }
}

/**
 * In-memory fallback when filesystem isn't writable
 * (e.g., edge runtime, serverless without .storage access).
 */
const memoryStore = new Map<string, number>();

export async function incrementView(key: string): Promise<number> {
  const data = await readViews().catch(() => null);
  if (data) {
    data[key] = (data[key] ?? 0) + 1;
    await writeViews(data);
    return data[key];
  }
  const next = (memoryStore.get(key) ?? 0) + 1;
  memoryStore.set(key, next);
  return next;
}

export async function getViews(key: string): Promise<number> {
  const data = await readViews().catch(() => null);
  if (data) return data[key] ?? 0;
  return memoryStore.get(key) ?? 0;
}

export async function getAllViews(): Promise<ViewsData> {
  return (await readViews()) ?? Object.fromEntries(memoryStore.entries());
}