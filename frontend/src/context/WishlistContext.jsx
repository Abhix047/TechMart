import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]); // Clear if logged out
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const { data } = await API.get("/users/wishlist");
      setWishlist(data); // Depends if API returns populated or just array
    } catch (error) {
      if (error?.response?.status === 401) {
        setWishlist([]);
        return;
      }
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    // Optimistic UI update
    const productId = product._id || product;
    const isWishlisted = wishlist.find((i) => (i._id || i) === productId);

    setWishlist((prev) =>
      isWishlisted
        ? prev.filter((i) => (i._id || i) !== productId)
        : [...prev, product] // Temporarily push the full product for UI speed
    );

    try {
      const { data } = await API.post(`/users/wishlist/${productId}`);
      // Usually API returns an array of pure IDs here. 
      // We can re-fetch to ensure populate is correct, or just sync.
      fetchWishlist();
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Failed to update wishlist");
      // Revert optimistic update
      fetchWishlist();
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, fetchWishlist, toggleWishlist, isInWishlist, wishlistCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
