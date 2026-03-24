import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();
const AUTH_SESSION_HINT = "auth_session_hint";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (force = false) => {
    const token = localStorage.getItem("token");
    const sessionHint = localStorage.getItem(AUTH_SESSION_HINT);

    if (!force && !token && !sessionHint) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {

      const res = await API.get("/auth/profile");

      setUser(res.data);
      localStorage.setItem(AUTH_SESSION_HINT, "1");

    } catch (error) {

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem(AUTH_SESSION_HINT);
      }
      setUser(null);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
    localStorage.setItem(AUTH_SESSION_HINT, "1");
    const { token, ...safeUser } = userData || {};
    setUser(safeUser);
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem(AUTH_SESSION_HINT);
      setUser(null);
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
