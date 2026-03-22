import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Loader2, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard"; // Not ProductCard.jsx page, but wait, the ProductCard page export const ProductsPage... wait, the ProductCard is actually ProductsPage! 

export default function Offers() {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await API.get("/products");
        // Keep only products that have an active discount
        const offers = data.filter(p => p.discountPrice > 0 && p.discountPrice < p.price);
        setDiscountedProducts(offers);
      } catch (e) {
        console.error("Failed to load offers:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-[120px] pb-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center p-3 bg-red-50 text-red-500 rounded-full mb-4"
          >
            <Tag size={24} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(40px,5vw,64px)] font-semibold text-[#0f0f0f] leading-tight mb-4"
          >
            Exclusive Offers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:'DM_Sans',sans-serif] text-[15px] text-black/40 max-w-xl mx-auto"
          >
            Discover our latest promotional events and grab your favorite products at significantly lowered prices.
          </motion.p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
            <p className="font-[family-name:'DM_Sans',sans-serif] text-sm text-black/40">Loading offers...</p>
          </div>
        ) : discountedProducts.length === 0 ? (
          <div className="text-center bg-white border border-black/5 rounded-3xl p-16 shadow-sm max-w-2xl mx-auto">
            <Tag size={48} className="mx-auto text-black/10 mb-5" />
            <h3 className="font-[family-name:'Cormorant_Garamond',serif] text-3xl font-semibold text-[#0f0f0f] mb-2">No Active Offers</h3>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-sm text-black/40 mb-8">We currently don't have any ongoing promotions. Check back later!</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-black/80 transition-colors">
              Explore All Products <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12">
            <AnimatePresence>
              {discountedProducts.map((product, i) => (
                <ProductCardItem key={product._id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}

// Reuse the ProductCard item UI isolated for the Offers layout
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (src) => !src ? null : src.startsWith("http") ? src : `${BASE_URL}${src}`;

const ProductCardItem = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const src = imgUrl(product.images?.[0]);
  const pct = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden bg-[#f5f3f0] rounded-xl mb-4 aspect-square">
          {src ? (
             <motion.img src={src} alt={product.name} className="absolute inset-0 w-full h-full object-cover" animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} />
          ) : <div className="absolute inset-0 bg-[#ece9e4]" />}
          <motion.div className="absolute inset-0 bg-black pointer-events-none" animate={{ opacity: hovered ? 0.15 : 0 }} transition={{ duration: 0.35 }} />
          
          <button onClick={(e) => { e.preventDefault(); toggleWishlist(product); }} className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105">
            <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black/40"} />
          </button>
          
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white font-[family-name:'DM_Sans',sans-serif] text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded shadow-sm">
            <Tag size={10} /> -{pct}%
          </span>
        </div>
        <div>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-medium text-black/40 uppercase tracking-[0.12em] mb-1.5">{product.brand || product.category}</p>
          <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-medium text-[#0f0f0f] leading-snug mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[15px] font-semibold text-red-600">₹{product.discountPrice.toLocaleString("en-IN")}</span>
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/30 line-through">₹{product.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
