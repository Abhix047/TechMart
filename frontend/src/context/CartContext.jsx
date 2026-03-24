import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const AUTH_SESSION_HINT = "auth_session_hint";

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    const sessionHint = localStorage.getItem(AUTH_SESSION_HINT);

    if (!user && !token && !sessionHint) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await API.get("/cart");
      // Calculate total quantity of items. 
      // If you just want the number of unique products, use data.length.
      // We will use data.length to be consistent with how Cart.jsx says "X items"
      setCartCount(data.length); 
    } catch (error) {
      if (error?.response?.status === 401) {
        setCartCount(0);
        return;
      }
      console.log("Failed to fetch cart count", error);
    }
  };

  // Fetch when user authenticates or mounts
  useEffect(() => {
    fetchCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
