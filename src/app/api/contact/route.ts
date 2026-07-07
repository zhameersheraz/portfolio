import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  // 1) Rate limit (5 per minute per IP)
  const limit = rateLimit(clientKey(req, "contact"), 5, 5);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(limit.retryAfterMs / 1000).toString(),
        },
      },
    );
  }

  // 2) Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // 3) Honeypot check
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true, id: "bot-rejected" });
  }

  // 4) Send email
  const result = await sendContactEmail({
    name: data.name,
    email: data.email,
    subject: data.subject || undefined,
    message: data.message,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Email send failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}