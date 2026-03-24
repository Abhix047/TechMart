export const API_URL = import.meta.env.VITE_API_URL || "";
export const BASE_URL = API_URL;

export const getImg = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  // Ensure we don't have double slashes if BASE_URL ends with / or img starts with /
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
};
