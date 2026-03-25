import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/session");
      const sessionUser = res.data?.authenticated ? res.data.user : null;
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    setLoading(true);
    return fetchUser();
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
