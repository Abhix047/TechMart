import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

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

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await API.get("/auth/session");

        setUser(normalizeSessionUser(res.data));

      } catch (error) {

        if (error?.response?.status === 404) {
          try {
            const fallbackRes = await API.get("/auth/profile");
            setUser(normalizeSessionUser(fallbackRes.data));
            return;
          } catch {
            setUser(null);
            return;
          }
        }

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    fetchUser();

  }, []);

  const login = async (_userData) => {
    setLoading(true);
    try {
      const res = await API.get("/auth/session");
      const resolvedUser = normalizeSessionUser(res.data);
      setUser(resolvedUser);
      return resolvedUser;
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

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    setUser(null);

  };

  return (

    <AuthContext.Provider value={{ user, login, logout, loading }}>

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () => useContext(AuthContext);
