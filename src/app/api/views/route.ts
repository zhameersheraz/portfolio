import { NextResponse } from "next/server";
import { incrementView, getViews } from "@/lib/views";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug || !/^[a-z0-9-]{1,64}$/i.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const views = await getViews(slug);
  return NextResponse.json({ slug, views });
}

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "views"), 30, 30);
  if (!limit.ok) {
    return NextResponse.json({ error: "Slow down" }, { status: 429 });
  }

  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug || !/^[a-z0-9-]{1,64}$/i.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const views = await incrementView(slug);
  return NextResponse.json({ slug, views });
}