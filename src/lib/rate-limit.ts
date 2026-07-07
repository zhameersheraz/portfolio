/**
 * In-memory token-bucket rate limiter.
 * Good enough for a portfolio contact form. Swap with Redis/Upstash for prod.
 */

type Bucket = { tokens: number; lastRefill: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  maxTokens = 5,
  refillPerMinute = 5,
): { ok: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? {
    tokens: maxTokens,
    lastRefill: now,
  };

  const elapsedMin = (now - bucket.lastRefill) / 60_000;
  const refill = elapsedMin * refillPerMinute;
  bucket.tokens = Math.min(maxTokens, bucket.tokens + refill);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    const retryAfterMs = ((1 - bucket.tokens) / refillPerMinute) * 60_000;
    return { ok: false, remaining: 0, retryAfterMs };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.floor(bucket.tokens), retryAfterMs: 0 };
}

export function clientKey(req: Request, prefix: string): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || "unknown";
  return `${prefix}:${ip}`;
}