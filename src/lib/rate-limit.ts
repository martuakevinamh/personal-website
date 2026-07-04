/**
 * Simple in-memory rate limiter.
 * Resets on server restart (sufficient for a portfolio site).
 * For production multi-instance apps, use Redis instead.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

/**
 * Check if the given key (e.g. IP address) has exceeded the rate limit.
 *
 * @param key       Identifier — typically the client IP
 * @param limit     Max allowed requests per window
 * @param windowMs  Time window in milliseconds
 * @returns         { allowed: boolean, remaining: number, resetIn: number (ms) }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key);

  // Clean up expired entry
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetIn: entry.resetAt - now };
}
