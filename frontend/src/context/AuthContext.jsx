import { createContext, useContext, useEffect, useState } from "react";
import API, { saveToken, clearToken, getToken } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeSessionUser = (payload) => {
    if (!payload) return null;
    if (payload.authenticated === false) return null;
    if (payload.user) return payload.user;
    if (payload._id || payload.email || payload.name || payload.role) return payload;
    return null;
  };

  // ── Fetch current session from backend ──────────────────────────────────
  const fetchUser = async (_force = false) => {
    try {
      const res = await API.get("/auth/session");
      const sessionUser = normalizeSessionUser(res.data);
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      if (error?.response?.status === 404) {
        try {
          const fallbackRes = await API.get("/auth/profile");
          const fallbackUser = normalizeSessionUser(fallbackRes.data);
          setUser(fallbackUser);
          return fallbackUser;
        } catch {
          setUser(null);
          return null;
        }
      }
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── On mount: if token exists in localStorage, fetch session ────────────
  useEffect(() => {
    // Only call session if we have a token OR cookies might work
    fetchUser();
  }, []);

  // ── Login: save token from response + fetch fresh session ───────────────
  const login = async (loginResponse) => {
    setLoading(true);
    // loginResponse contains the token returned from POST /auth/login
    if (loginResponse?.token) {
      saveToken(loginResponse.token);
    }
    // Now fetch session which will use the Bearer token via interceptor
    return fetchUser(true);
  };

  // ── Logout: clear token + call backend to clear cookie too ──────────────
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      clearToken();
      setUser(null);
      setLoading(false);
      toast.success("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
