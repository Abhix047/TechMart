import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await API.get("/auth/session");

        setUser(res.data?.authenticated ? res.data.user : null);

      } catch (error) {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    fetchUser();

  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const res = await API.get("/auth/session");
      const sessionUser = res.data?.authenticated ? res.data.user : null;
      setUser(sessionUser);
      return sessionUser;
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
