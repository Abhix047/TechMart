const cspDirectives = [
  "default-src 'self' *",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: res.cloudinary.com *.cloudinary.com",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "connect-src 'self' *",
  "font-src 'self' https://fonts.gstatic.com",
].join("; ");

export const securityHeaders = (req, res, next) => {
  res.setHeader("Content-Security-Policy", cspDirectives);
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("X-XSS-Protection", "0");
  next();
};
