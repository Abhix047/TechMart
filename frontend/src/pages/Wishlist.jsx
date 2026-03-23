import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (src) => (!src ? null : src.startsWith("http") ? src : `${BASE_URL}${src}`);
const ease = [0.22, 1, 0.36, 1];

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("wl-fonts")) {
  const l = document.createElement("link");
  l.id = "wl-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

export default function Wishlist() {
  const { wishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { fetchCartCount } = useCart();
  const [addingToCart, setAddingToCart] = React.useState(null);
  const [addedIds, setAddedIds] = React.useState([]);
  const [hoveredId, setHoveredId] = React.useState(null);

  const handleAddToCart = async (product) => {
    setAddingToCart(product._id);
    try {
      await API.post("/cart", { productId: product._id, quantity: 1 });
      fetchCartCount();
      setAddedIds(p => [...p, product._id]);
      setTimeout(() => {
        setAddedIds(p => p.filter(id => id !== product._id));
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setAddingToCart(null), 1000);
    }
  };

  if (wishlistLoading) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <motion.div
        className="w-7 h-7 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] pb-28"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 pt-28">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between gap-6 mb-10 pb-7 border-b border-black/[0.09]"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-3"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease }}
            >
              Your Collection
            </motion.p>
            <motion.h1
              className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(40px,6vw,60px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.13, ease }}
            >
              Wish<em className="italic font-[300]">list</em>
            </motion.h1>
            {wishlist.length > 0 && (
              <motion.p
                className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/38 mt-2.5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.2, ease }}
              >
                {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
              </motion.p>
            )}
          </div>

          {/* Item count */}
          {wishlist.length > 0 && (
            <motion.div
              className="text-right shrink-0"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease }}
            >
              <p className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(42px,5vw,56px)] font-[400] text-[#0f0f0f] leading-none">
                {wishlist.length}
              </p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mt-1">
                {wishlist.length === 1 ? "Item" : "Items"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ══ EMPTY STATE ══ */}
        {wishlist.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center bg-white border border-black/[0.07] rounded-3xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center mb-7"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Heart size={22} className="text-black/25" strokeWidth={1.5} />
            </motion.div>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] italic text-[32px] font-[400] text-[#0f0f0f] mb-3">
              Your wishlist is empty
            </h2>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mb-9 max-w-[280px] leading-relaxed">
              Save your favorite items here while you browse to easily find them later.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold rounded-2xl hover:bg-black/82 transition-colors"
              >
                Explore Products <ArrowRight size={13} />
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* ══ GRID ══ */}
        {wishlist.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {wishlist.map((item, i) => {
                const img = imgUrl(item.images?.[0]);
                const price = item.discountPrice || item.price || 0;
                const mrp = item.price || 0;
                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                const isAdding = addingToCart === item._id;
                const isAdded = addedIds.includes(item._id);
                const inStock = item.countInStock > 0;
                const hovered = hoveredId === item._id;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.28 } }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease }}
                    className="group relative bg-white border border-black/[0.07] rounded-2xl overflow-hidden flex flex-col hover:border-black/[0.15] transition-colors duration-300"
                    onMouseEnter={() => setHoveredId(item._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Discount badge */}
                    {discount > 0 && (
                      <motion.div
                        className="absolute top-3 left-3 z-10 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.06 + 0.2, ease }}
                      >
                        -{discount}%
                      </motion.div>
                    )}

                    {/* Remove button */}
                    <motion.button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(item); }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center bg-white/90 backdrop-blur-sm border border-black/[0.07] text-black/30 hover:text-red-500 hover:bg-red-50 hover:border-red-200/60 transition-all duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={13} />
                    </motion.button>

                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="block relative bg-[#f0ede8] overflow-hidden" style={{ aspectRatio: "4/5" }}>
                      {img ? (
                        <motion.img
                          src={img}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-6"
                          animate={{ scale: hovered ? 1.06 : 1 }}
                          transition={{ duration: 0.75, ease }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Heart size={28} className="text-black/12" strokeWidth={1} />
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1 flex-1 border-t border-black/[0.055]">

                      {/* Brand */}
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium text-black/30 uppercase tracking-[0.14em]">
                        {item.brand || item.category}
                      </p>

                      {/* Name */}
                      <Link to={`/product/${item._id}`}>
                        <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-medium text-[#0f0f0f] leading-snug line-clamp-2 hover:text-black/65 transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Price row */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="font-[family-name:'Cormorant_Garamond',serif] text-[20px] font-[500] text-[#0f0f0f] leading-none">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/25 line-through">
                            ₹{mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <p className={`font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}>
                        {inStock ? `${item.countInStock} in stock` : "Out of stock"}
                      </p>

                      {/* CTA */}
                      <motion.button
                        onClick={() => handleAddToCart(item)}
                        disabled={isAdding || !inStock}
                        className={`mt-3 w-full py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-300 ${!inStock
                            ? "bg-black/5 text-black/25 cursor-not-allowed"
                            : isAdded
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-[#0f0f0f] text-white hover:bg-black/82"
                          }`}
                        whileTap={inStock ? { scale: 0.97 } : {}}
                      >
                        {isAdded ? (
                          <motion.span
                            className="flex items-center gap-2"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <CheckCircle2 size={13} /> Added to Cart
                          </motion.span>
                        ) : isAdding ? (
                          <motion.span
                            className="w-4 h-4 border-[1.5px] border-white/40 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          />
                        ) : !inStock ? (
                          "Out of Stock"
                        ) : (
                          <><ShoppingBag size={13} /> Move to Cart</>
                        )}
                      </motion.button>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`}</style>
    </div>
  );
}