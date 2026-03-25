import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeSessionUser = (payload) => {
    if (!payload) return null;
    if (payload.authenticated === false) return null;
    if (payload.user) return payload.user;
    if (payload._id || payload.email || payload.name || payload.role) return payload;
    return null;
  };

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
        } catch (fallbackError) {
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

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (userData) => {
    setLoading(true);
    const sessionUser = normalizeSessionUser(userData);

    if (sessionUser) {
      setUser(sessionUser);
      setLoading(false);
      return sessionUser;
    }

    return fetchUser(true);
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
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
