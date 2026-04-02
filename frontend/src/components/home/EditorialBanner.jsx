import { useRef, useState, useEffect } from "react";
import { getImg } from "../../config";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const THEME = {
  bg: "#111111",  // Obsidian black for TechMart luxury
  bgDark: "#0a0a0a", // Deeper black for image container
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.08)",
};

const EASE = [0.19, 1, 0.22, 1];

export default function EditorialBanner() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const p = Array.isArray(res.data) ? res.data : [];
        // Look specifically for the Samsung Galaxy Z Fold, or fallback to another premium device
        const f = p.find(x => x.name.toLowerCase().includes("fold")) || 
                  p.find(x => x.name.toLowerCase().includes("z fold")) || 
                  p.find(x => x.name.toLowerCase().match(/watch|headphone|ultra|pro/)) || 
                  p[0];
        if (f) setProduct(f);
      })
      .catch(console.error);
  }, []);

  const handleNavigate = () => {
    if (product) navigate(`/product/${product._id}`);
    else navigate("/featured");
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Massive container sweeps
  const cardScale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.9, 1, 1, 0.9]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [100, 0, 0, -100]);

  // Internal visual parallax
  const numberY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Stagger wrapper for header text
  const headerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } }
  };
  const lineVariants = {
    hidden: { y: "110%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 1.2, ease: EASE } }
  };

  return (
    <section ref={containerRef} className="px-4 py-6 md:py-8 lg:py-10 bg-[#faf9f8] overflow-hidden">
      <motion.div
        className="w-full max-w-[1500px] mx-auto overflow-hidden rounded-sm shadow-2xl"
        style={{ 
          background: THEME.bg,
          scale: cardScale, 
          opacity: cardOpacity, 
          y: cardY,
          willChange: "transform, opacity"
        }}
      >
        {/* TOP HEADER SECTION */}
        <div className="relative px-6 md:px-12 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end overflow-hidden">
          
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col relative z-10"
          >
            <div className="overflow-hidden pb-1">
              <motion.h1 
                variants={lineVariants}
                className="m-0 font-['Outfit',sans-serif] tracking-tighter whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.1, color: THEME.textPrimary, fontWeight: 500 }}
              >
                TechMart Exclusives.
              </motion.h1>
            </div>
          </motion.div>
          
          {/* Right Content: Number + CTA */}
          <div className="flex flex-col items-start md:items-end gap-6 relative z-10 w-full md:w-auto mt-6 md:mt-0">
            <motion.span 
              className="absolute right-[-4vw] top-[-100px] md:right-0 md:top-[-130px] font-['Outfit',sans-serif] tracking-tighter select-none pointer-events-none"
              style={{ fontSize: "clamp(100px, 12vw, 160px)", lineHeight: 0.8, color: "rgba(255,255,255,0.03)", fontWeight: 500, y: numberY }}
            >
              03
            </motion.span>
            
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
              onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
              className="font-['Outfit',sans-serif] text-[13px] md:text-[14px] tracking-[0.2em] uppercase cursor-pointer transition-all border border-white/20 hover:border-white hover:bg-white hover:text-black py-4 px-8 rounded-full flex items-center gap-3 group bg-transparent text-white relative z-20"
            >
              <span className="transition-opacity">Discover Now</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </motion.button>
          </div>
        </div>

        {/* THIN HORIZONTAL DIVIDER */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: EASE }}
          className="w-full h-[1px] origin-left" 
          style={{ background: THEME.border }} 
        />

        {/* BOTTOM GRID STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[450px]">
          
          {/* COLUMN 1: Context & Navigation */}
          <div className="p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 relative bg-white/[0.01]">
            <div className="flex flex-col gap-2 relative z-10">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
                className="font-['Outfit',sans-serif] text-[11px] tracking-[0.2em] uppercase text-white/50" 
              >
                Curated Selection
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
                className="font-['Outfit',sans-serif] text-[20px] font-medium text-white/90" 
              >
                Vol. IV
              </motion.span>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              className="mt-20 lg:mt-0 relative z-10"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                className="font-['Outfit',sans-serif] text-[12px] tracking-[0.2em] uppercase cursor-pointer text-left transition-all pb-2 w-fit group flex items-center gap-3 text-white/80 hover:text-white"
                style={{ borderBottom: `1px solid ${THEME.border}` }}
              >
                <span className="transition-opacity">Discover Series</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform text-white/40"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </motion.div>
            
            {/* Aesthetic Tech Lines in BG */}
            <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[1px] h-4 bg-white" style={{ height: `${Math.random() * 20 + 5}px` }}></div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Product Identifiers & Details */}
          <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between relative">
            <div className="flex-1 flex flex-col">
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
                className="font-['Outfit',sans-serif] text-[10px] tracking-[0.25em] uppercase mb-6 flex items-center justify-between text-white/50" 
              >
                <span>{product?.brand || "Exclusive"}</span>
                <span className="border border-white/10 px-2 py-1 object-contain rounded-full bg-white/5">{product?.category || "Artifact"}</span>
              </motion.p>
              
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
                className="font-['Outfit',sans-serif] text-[32px] md:text-[38px] font-medium leading-[1.05] tracking-tight mb-6 text-white" 
              >
                {product?.name || "Engineering Masterpiece"}
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
                className="font-['Outfit',sans-serif] text-[14px] md:text-[15px] font-light leading-[1.8] mt-auto text-white/60" 
              >
                {product?.description?.substring(0, 160) || 
                 "Prioritizing uncompromising structural integrity, phenomenal core performance, and an absolute minimalist direction for modern aesthetics."}
                {product?.description?.length > 160 ? "..." : ""}
              </motion.p>
            </div>
            
            {/* Minimal Stock Status */}
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
              className="mt-8 flex items-center gap-3 pt-6 border-t border-white/5"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50 absolute animate-ping"></div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-['Outfit'] text-white/40 font-medium">Verified Active</span>
            </motion.div>
          </div>

          {/* COLUMN 3: Abstract Specifications */}
          <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between bg-white/[0.01]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              className="w-full"
            >
              <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
                <span className="font-['Outfit',sans-serif] text-[11px] tracking-[0.2em] uppercase text-white/50">
                  Hardware Index
                </span>
                <span className="font-['Outfit',sans-serif] text-[9px] tracking-widest text-white/20">
                  SYS.INF
                </span>
              </div>
              
              <div className="flex flex-col gap-6">
                {[
                  { label: "Core Element", val: "Aero-Grade Material" },
                  { label: "Architecture", val: "Quantum Precision" },
                  { label: "Performance", val: "High-Fidelity Output" },
                  { label: "Integration", val: "Seamless Ecosystem" }
                ].map((spec, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: 0.7 + (idx * 0.1), duration: 0.8, ease: EASE }}
                    className="flex flex-col gap-1 group cursor-default"
                  >
                    <span className="font-['Outfit',sans-serif] text-[9px] tracking-[0.15em] uppercase text-white/30 group-hover:text-white/50 transition-colors">
                      {spec.label}
                    </span>
                    <span className="font-['Outfit',sans-serif] text-[15px] font-medium tracking-wide text-white/90">
                      {spec.val}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }}
              className="mt-8 pt-6 border-t border-white/5 flex gap-4 w-full"
            >
               <div className="flex-1">
                 <div className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Rating</div>
                 <div className="text-[13px] text-white/80 font-medium font-['Outfit']">4.9/5 RVS</div>
               </div>
               <div className="w-[1px] bg-white/5"></div>
               <div className="flex-1 pl-4">
                 <div className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Warranty</div>
                 <div className="text-[13px] text-white/80 font-medium font-['Outfit']">2 YRS PRO</div>
               </div>
            </motion.div>
          </div>

          {/* COLUMN 4: Image Visuals with extreme parallax */}
          <div className="relative p-8 flex items-center justify-center overflow-hidden min-h-[350px] lg:min-h-full group" style={{ background: THEME.bgDark }}>
            {/* Dynamic aesthetic glow behind image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.15, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.5, ease: EASE }}
              className="absolute inset-0 bg-white blur-[90px] rounded-full z-0 w-3/4 h-3/4 m-auto mix-blend-screen" 
            />
            
            {/* Scanline CRT Effect for extra Tech-Luxe feel */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-30 group-hover:opacity-40 transition-opacity" />

            <motion.div style={{ y: imageY, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} className="relative z-10">
              {product?.images?.[0] ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9, filter: "brightness(0.5) blur(4px)" }}
                  whileInView={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
                  src={getImg(product.images[0])} 
                  className="w-full max-w-[340px] lg:scale-[1.15] object-contain drop-shadow-2xl hover:scale-[1.25] transition-transform duration-700 ease-out" 
                  alt={product?.name || "Product"}
                />
              ) : (
                <span className="font-['Outfit',sans-serif] tracking-tighter opacity-5 text-[120px] font-medium text-white italic">TM.</span>
              )}
            </motion.div>

            {/* Price Overlay */}
            {product?.price && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8, ease: EASE }}
                className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 flex flex-col items-end backdrop-blur-md bg-black/20 p-4 border border-white/10 rounded-sm"
              >
                <span className="font-['Outfit',sans-serif] text-[9px] tracking-[0.2em] uppercase text-white/50 mb-1">
                  Valuation
                </span>
                <span className="font-['Outfit',sans-serif] text-[22px] tracking-tight text-white font-medium">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </motion.div>
            )}
          </div>

        </div>

      </motion.div>
    </section>
  );
}