import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getImg } from "../../config";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Outfit', sans-serif" };

const PremiumBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-[#faf9f8]" />
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-100/40 blur-[100px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-stone-200/50 blur-[100px]" />
    <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />
  </div>
);

const Card = ({ product, isCenter }) => {
  const img = product?.images?.[0] ? getImg(product.images[0]) : null;
  const name = product?.name || "—";
  const brand = product?.brand || product?.category || "TechMart";
  const price = product?.price || 0;

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group w-full h-full rounded-[24px] p-2 sm:p-2.5 flex flex-col relative transition-all duration-700 bg-[#ffffff] border ${isCenter ? 'border-stone-200/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]' : 'border-stone-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)]'}`}
    >
      
      {/* Top Image Container with Studio Lighting */}
      <div className="relative w-full h-[65%] sm:h-[68%] bg-gradient-to-tr from-[#f0f0f0] via-[#ffffff] to-[#f8f8f8] rounded-[18px] flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:from-[#eaeaea] group-hover:to-[#f0f0f0]">
        
        {/* Studio Ring Light Reflection */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-90 pointer-events-none" />
        <div className="absolute inset-0 border border-black/[0.04] rounded-[18px] pointer-events-none" />

        {/* Floating Brand Tag */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/70 backdrop-blur-md rounded border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] z-10">
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-[#111010]" style={sans}>
            {brand}
          </span>
        </div>

        {/* Heart Icon */}
        <button className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-[#111010] group/heart transition-all z-10 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white/60 hover:border-[#111010]">
          <Heart size={14} className="text-[#111010] group-hover/heart:text-white transition-colors" strokeWidth={1.8} />
        </button>
        
        {img ? (
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={img} 
            alt={name} 
            className="w-[80%] h-[80%] object-contain mix-blend-multiply drop-shadow-[0_15px_25px_rgba(0,0,0,0.06)] transition-transform duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)]" 
            loading="lazy" 
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-stone-200 shadow-inner" />
        )}
      </div>

      {/* Bottom Info Section */}
      <div className="flex-1 px-2 sm:px-3 pt-4 pb-2 flex flex-col justify-between">
        <h3 className="text-[#111010] text-[15px] sm:text-[17px] font-medium leading-tight line-clamp-2 tracking-tight" style={sans}>{name}</h3>
        
        <div className="flex justify-between items-end mt-1">
          <span className="text-[#111010] text-[20px] sm:text-[22px] font-bold tracking-tight leading-none" style={sans}>
            ₹{price.toLocaleString("en-IN")}
          </span>
          
          {/* High-end Outline-to-Fill Action Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-transparent border border-[#111010]/20 text-[#111010] hover:bg-[#111010] hover:border-[#111010] hover:text-white transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-[-100%] w-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover/btn:left-[200%] transition-all duration-700 ease-in-out" />
            <ShoppingBag size={16} strokeWidth={1.8} className="relative z-10 transition-colors" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    API.get("/products")
      .then(r => {
        let raw = Array.isArray(r.data) ? r.data : r.data?.products || [];
        raw = raw.slice(0, 8);
        if (raw.length === 2) raw = [...raw, ...raw, ...raw];
        if (raw.length === 1) raw = [...raw, ...raw, ...raw, ...raw];
        if (raw.length === 3) raw = [...raw, ...raw];
        if (raw.length === 4) raw = [...raw, ...raw];
        setItems(raw);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = items.length;

  useEffect(() => {
    if (total <= 1 || loading) return;
    const id = setInterval(() => setIndex(i => (i + 1) % total), 5000);
    return () => clearInterval(id);
  }, [total, loading]);

  const getPosition = (i) => {
    if (total === 0) return 0;
    let dist = i - index;
    if (dist > total / 2) dist -= total;
    if (dist < -total / 2) dist += total;
    return dist;
  };

  const handlePrev = () => setIndex(i => (i - 1 + total) % total);
  const handleNext = () => setIndex(i => (i + 1) % total);

  return (
    <section id="featured-products" className="relative py-5 md:py-10 w-full overflow-hidden bg-[#faf9f8] flex flex-col items-center">
      <PremiumBackground />

      {/* Header Area */}
      <div className="relative z-20 flex flex-col items-center text-center px-3 mb-10 md:mb-16 w-full max-w-4xl mx-auto shrink-0 mt-6">
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
          className="text-[#aa8429] text-[9px] sm:text-[10px] font-bold tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-[#aa8429]/50" />
          The Collection
          <div className="w-6 h-[1px] bg-[#aa8429]/50" />
        </motion.span>
        
        {/* Title */}
        <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#111010] mb-4 tracking-tighter leading-[1.1]" style={sans}>
          Curated <span className="font-bold italic text-stone-400" style={serif}>Excellence.</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-stone-500 text-[13px] md:text-[15px] font-light max-w-xl leading-relaxed mx-auto">
          Experience our definitive selection of state-of-the-art technology. Engineered for visionaries.
        </motion.p>
      </div>

      {/* 3D Carousel Area */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto h-[342px] sm:h-[414px] flex justify-center items-center shrink-0 mb-4" style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
        
        {/* Navigation Arrows */}
        {!loading && items.length > 1 && (
          <>
            <button onClick={handlePrev} 
              className="absolute left-2 sm:left-6 lg:-left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white flex items-center justify-center text-stone-700 hover:bg-white hover:text-black hover:scale-110 transition-all cursor-pointer">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button onClick={handleNext} 
              className="absolute right-2 sm:right-6 lg:-right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white flex items-center justify-center text-stone-700 hover:bg-white hover:text-black hover:scale-110 transition-all cursor-pointer">
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </>
        )}

        {loading ? (
          <div className="w-10 h-10 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
        ) : items.length > 0 ? (
          items.map((product, i) => {
            const dist = getPosition(i);
            
            let x = "0%";
            let z = 0;
            let rotateY = 0;
            let scale = 1;
            let zIndex = 10;
            let overlayOpacity = 0;
            let rootOpacity = Math.abs(dist) > 2 ? 0 : 1;
            let blurAmount = 0;

            if (dist === 0) {
              x = "0%"; z = 0; rotateY = 0; scale = 1; zIndex = 30; overlayOpacity = 0; blurAmount = 0;
            } else if (dist === -1) {
              x = "-75%"; z = -80; rotateY = 15; scale = 0.85; zIndex = 20; overlayOpacity = 0.2; blurAmount = 0;
            } else if (dist === 1) {
              x = "75%"; z = -80; rotateY = -15; scale = 0.85; zIndex = 20; overlayOpacity = 0.2; blurAmount = 0;
            } else if (dist === -2) {
              x = "-140%"; z = -160; rotateY = 25; scale = 0.7; zIndex = 10; overlayOpacity = 0.4; blurAmount = 4;
            } else if (dist === 2) {
              x = "140%"; z = -160; rotateY = -25; scale = 0.7; zIndex = 10; overlayOpacity = 0.4; blurAmount = 4;
            }

            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            if (isMobile) {
               if (dist === -1) x = "-60%";
               if (dist === 1) x = "60%";
               if (dist === -2) x = "-110%";
               if (dist === 2) x = "110%";
            }

            return (
              <motion.div
                key={product._id + i}
                animate={{ x, z, rotateY, scale, opacity: rootOpacity, filter: `blur(${blurAmount}px)` }}
                initial={false}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[234px] sm:w-[288px] lg:w-[306px] h-[306px] sm:h-[378px] lg:h-[396px] cursor-pointer"
                style={{ zIndex, transformStyle: "preserve-3d" }}
                onClick={() => {
                  if (dist === 0) navigate(`/product/${product._id}`);
                  else setIndex(i);
                }}
              >
                <Card product={product} isCenter={dist === 0} />
                
                {/* Depth Overlay Fog */}
                <motion.div 
                  className="absolute inset-0 bg-[#faf9f8] rounded-[24px] pointer-events-none"
                  animate={{ opacity: overlayOpacity }}
                  initial={false}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: "translateZ(100px)" }}
                />
              </motion.div>
            );
          })
        ) : (
          <p className="text-stone-400 font-sans text-sm">No products found.</p>
        )}
      </div>
      
    </section>
  );
}