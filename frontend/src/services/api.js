import axios from "axios";
import { API_URL } from "../config";

const TOKEN_KEY = "tm_token";

// ── Token helpers ────────────────────────────────────────────────────────────
export const saveToken  = (token) => { if (token) localStorage.setItem(TOKEN_KEY, token); };
export const getToken   = ()      => localStorage.getItem(TOKEN_KEY) || null;
export const clearToken = ()      => localStorage.removeItem(TOKEN_KEY);

// ── Axios instance ────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: API_URL.endsWith("/") ? `${API_URL}api` : `${API_URL}/api`,
  withCredentials: true,
});

// ── Request interceptor: attach Bearer token if available ────────────────────
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: on 401, clear stale token ─────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

export default API;
