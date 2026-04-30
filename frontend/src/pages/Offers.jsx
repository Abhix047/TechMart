import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Loader2, ArrowUpRight, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { getImg } from "../config";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'Outfit', sans-serif" };
const syne = { fontFamily: "'Syne', sans-serif" };

export default function Offers() {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await API.get("/products");
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
    <div className="min-h-screen bg-[#faf8f4] text-[#111010]">
      {/* ── HIGH-END HERO SECTION ── */}
      <div className="relative w-full bg-[#111010] text-[#faf8f4] pt-[140px] pb-24 overflow-hidden rounded-b-[40px]">
        {/* Subtle animated background gradients */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[20%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_60%)] pointer-events-none blur-3xl"
        />
        
        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center text-center z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-8"
          >
            <Sparkles size={14} className="text-[#f7e3c1]" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#f7e3c1]" style={sans}>The Archive Sale</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(48px,8vw,90px)] leading-[0.95] mb-6 tracking-tight"
            style={serif}
          >
            Exceptional Pieces, <br/>
            <span className="italic font-light text-white/70">Exceptional Value.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[500px] text-[15px] font-light text-white/50 leading-relaxed"
            style={sans}
          >
            A curated selection of our finest technology, available for a limited time at unprecedented prices. Elevate your setup today.
          </motion.p>
        </div>
      </div>

      {/* ── OFFERS CONTENT ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Filtering/Sorting Bar (Visual only for aesthetics) */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-[#111010]/10">
          <p className="text-[12px] uppercase tracking-widest font-semibold text-[#111010]/60" style={sans}>
            {loading ? "Loading..." : `${discountedProducts.length} Exclusive Items`}
          </p>
          <div className="flex items-center gap-4 text-[12px] font-medium text-[#111010]/60 uppercase tracking-widest" style={sans}>
            <span>Sort by:</span>
            <span className="text-[#111010] cursor-pointer">Discount %</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#111010] mb-6" size={32} />
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#111010]/50" style={sans}>Curating Offers...</p>
          </div>
        ) : discountedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white/50 rounded-[30px] border border-[#111010]/5 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6">
              <Tag size={28} className="text-stone-300" />
            </div>
            <h3 className="text-3xl mb-3 text-[#111010]" style={serif}>The Vault is Closed</h3>
            <p className="text-[14px] text-stone-500 max-w-[300px] mb-8" style={sans}>We currently don't have any active promotions. Sign up for our newsletter to get early access next time.</p>
            <Link to="/products" className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#111010] text-[#faf8f4] overflow-hidden rounded-full">
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1] rounded-full" />
              <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2" style={sans}>
                Explore Collection <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
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

const ProductCardItem = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const src = getImg(product.images?.[0]);
  const pct = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col bg-white p-3 rounded-[28px] border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-stone-300/80 transition-all duration-500 ease-[0.22,1,0.36,1]"
    >
      <Link to={`/product/${product._id}`} className="no-underline block h-full flex flex-col">
        
        {/* Top Actions: Discount & Wishlist */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-20 pointer-events-none">
          <div className="bg-[#111010] text-[#faf8f4] px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-md bg-opacity-90">
            <span className="text-[8px] uppercase font-bold tracking-[0.2em] block leading-none text-white/60 mb-1" style={sans}>Sale</span>
            <span className="text-[11px] font-semibold block leading-none text-[#f7e3c1]" style={sans}>-{pct}%</span>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }} 
            className="pointer-events-auto w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-stone-200/50 hover:bg-white hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            <Heart size={15} strokeWidth={isWishlisted ? 0 : 1.5} className={`transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#111010]"}`} />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative w-full aspect-[4/4.5] overflow-hidden rounded-[20px] bg-[#fdfdfc] mb-5 flex items-center justify-center">
          {src ? (
             <motion.img 
                src={src} 
                alt={product.name} 
                className="w-[85%] h-[85%] object-contain mix-blend-multiply drop-shadow-2xl" 
                animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -8 : 0 }} 
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} 
             />
          ) : <div className="absolute inset-0 bg-stone-100" />}
        </div>

        {/* Product Info - Editorial Style */}
        <div className="flex flex-col flex-1 px-3 pb-3 relative">
          <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-[0.25em] mb-2" style={sans}>{product.brand || product.category}</p>
          <h3 className="text-[18px] text-[#111010] leading-tight mb-5 line-clamp-2" style={serif}>{product.name}</h3>
          
          <div className="mt-auto pt-4 border-t border-stone-100 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-400 line-through mb-1" style={sans}>₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-[16px] font-semibold text-[#111010]" style={sans}>₹{product.discountPrice.toLocaleString("en-IN")}</span>
            </div>
            
            {/* View Details Animated Button */}
            <div className="relative h-[34px] bg-stone-100 border border-stone-200/50 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-[0.22,1,0.36,1] w-[34px] group-hover:w-[95px] group-hover:bg-[#111010] group-hover:border-[#111010]">
               <ArrowUpRight size={15} className="absolute text-[#111010] transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:translate-x-12" />
               <span className="absolute text-[10px] font-semibold text-white uppercase tracking-[0.15em] whitespace-nowrap -translate-x-12 transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:translate-x-0" style={sans}>Details</span>
            </div>
          </div>
        </div>

      </Link>
    </motion.div>
  );
};
