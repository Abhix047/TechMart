const LOCALHOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const LOCAL_API_FALLBACK = "http://localhost:5000";

const isLocalHostname = (hostname = "") =>
  LOCALHOSTS.has(hostname) || hostname.endsWith(".localhost");

const trimTrailingSlashes = (value = "") => value.replace(/\/+$/, "");

const resolveApiUrl = () => {
  const configuredUrl = trimTrailingSlashes(import.meta.env.VITE_API_URL || "");

  if (typeof window === "undefined") {
    return configuredUrl;
  }

  const runtimeOrigin = trimTrailingSlashes(window.location.origin);
  const runtimeHostname = window.location.hostname;

  if (configuredUrl) {
    try {
      const parsedConfiguredUrl = new URL(configuredUrl);

      // Prevent remote builds from accidentally targeting localhost because a
      // local `.env` value was baked into the bundle.
      if (!isLocalHostname(runtimeHostname) && isLocalHostname(parsedConfiguredUrl.hostname)) {
        return runtimeOrigin;
      }
    } catch {
      return configuredUrl;
    }

    return configuredUrl;
  }

  return isLocalHostname(runtimeHostname) ? LOCAL_API_FALLBACK : runtimeOrigin;
};

export const API_URL = resolveApiUrl();
export const BASE_URL = API_URL;

export const getImg = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  // Ensure we don't have double slashes if BASE_URL ends with / or img starts with /
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
};
