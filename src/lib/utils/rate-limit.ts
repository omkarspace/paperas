const rateLimits = new Map<string, { count: number; reset: number }>();

export async function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record || now > record.reset) {
    rateLimits.set(ip, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  rateLimits.set(ip, record);
  return { success: true, remaining: limit - record.count };
}

export function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, record] of rateLimits.entries()) {
    if (now > record.reset) {
      rateLimits.delete(ip);
    }
  }
}

setInterval(cleanupRateLimits, 60000);