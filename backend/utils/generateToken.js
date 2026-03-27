import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "jwt";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

const normalizeHostname = (value = "") => {
  if (!value) return "";

  try {
    const candidate = value.includes("://") ? value : `http://${value}`;
    return new URL(candidate).hostname.toLowerCase();
  } catch {
    return value.split(":")[0].toLowerCase();
  }
};

const isLocalHostname = (hostname = "") =>
  LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith(".localhost");

const getRequestHost = (req) =>
  req?.get("x-forwarded-host") || req?.get("host") || "";

const getOriginHost = (req) => req?.get("origin") || "";

export const buildAuthCookieOptions = (req) => {
  const requestHostname = normalizeHostname(getRequestHost(req));
  const originHostname = normalizeHostname(getOriginHost(req));
  
  // Real Local development (on localhost)
  const isActuallyLocal = isLocalHostname(requestHostname) && (isLocalHostname(originHostname) || !originHostname);
  
  // Cross-site request (frontend on vercel, backend on render)
  const isCrossOrigin = Boolean(originHostname) && originHostname !== requestHostname;

  const options = {
    httpOnly: true,
    // On Render/Vercel (Production/Live), we MUST use Secure and SameSite: None 
    // to allow cookies to work across domains.
    secure: !isActuallyLocal, 
    sameSite: isActuallyLocal ? "lax" : "none",
    path: "/",
  };

  const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim();
  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  return options;
};

const generateToken = (req, res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie(AUTH_COOKIE_NAME, token, {
    ...buildAuthCookieOptions(req),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
