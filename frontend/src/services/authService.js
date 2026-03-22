import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await API.get("/auth/me");

        setUser(res.data);

      } catch (error) {

        setUser(null);

      }

    };

    if (token) {
      fetchUser();
    }

  }, [token]);

  const login = (data) => {

    localStorage.setItem("token", data.token);

    setUser(data.user);

  };

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

  };

  return (

    <AuthContext.Provider value={{ user, login, logout }}>

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () => useContext(AuthContext);