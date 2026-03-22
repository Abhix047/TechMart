const stores = new Map();

const cleanupExpiredEntries = (bucket, now, windowMs) => {
  for (const [key, entry] of bucket.entries()) {
    if (entry.resetAt <= now) {
      bucket.delete(key);
    }
  }
};

export const createRateLimiter = ({
  windowMs,
  max,
  message,
  keyGenerator = (req) => req.ip,
}) => {
  const bucket = new Map();
  stores.set(Symbol("rate-limit"), bucket);

  return (req, res, next) => {
    const now = Date.now();
    cleanupExpiredEntries(bucket, now, windowMs);

    const key = keyGenerator(req) || "anonymous";
    const current = bucket.get(key);

    if (!current || current.resetAt <= now) {
      bucket.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({ message });
    }

    current.count += 1;
    return next();
  };
};

export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again later.",
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again later.",
  keyGenerator: (req) => `${req.ip}:${req.body?.email?.toLowerCase?.() || "anonymous"}`,
});
