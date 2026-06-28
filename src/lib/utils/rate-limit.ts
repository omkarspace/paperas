import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_ENABLED = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = UPSTASH_ENABLED
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const limiters = new Map<string, Ratelimit>();

function getLimiter(key: string, limit: number, windowSec: number): Ratelimit {
  const comboKey = `${key}:${limit}:${windowSec}`;
  if (!limiters.has(comboKey)) {
    limiters.set(
      comboKey,
      new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(limit, `${windowSec}s`),
        analytics: true,
      })
    );
  }
  return limiters.get(comboKey)!;
}

// In-memory fallback for local dev when Upstash is not configured
const memLimits = new Map<string, { count: number; reset: number }>();

function memoryRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = memLimits.get(ip);
  if (!record || now > record.reset) {
    memLimits.set(ip, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }
  record.count++;
  memLimits.set(ip, record);
  return { success: true, remaining: limit - record.count };
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

/**
 * Rate limiter with Upstash Redis (production) or in-memory fallback (dev).
 * @param key - Identifier (IP address or user ID)
 * @param limit - Max requests per window
 * @param windowMs - Window duration in milliseconds
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  if (UPSTASH_ENABLED && redis) {
    const windowSec = Math.ceil(windowMs / 1000);
    const limiter = getLimiter("global", limit, windowSec);
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining };
  }

  return memoryRateLimit(key, limit, windowMs);
}
