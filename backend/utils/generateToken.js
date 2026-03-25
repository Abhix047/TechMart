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
  const isLocalRequest =
    process.env.NODE_ENV === "development" ||
    isLocalHostname(requestHostname) ||
    isLocalHostname(originHostname);
  const isCrossOriginRequest =
    Boolean(originHostname) &&
    Boolean(requestHostname) &&
    originHostname !== requestHostname;

  const options = {
    httpOnly: true,
    secure: !isLocalRequest,
    sameSite: isLocalRequest ? "lax" : isCrossOriginRequest ? "none" : "lax",
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
