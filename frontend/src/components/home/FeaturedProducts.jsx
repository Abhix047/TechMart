import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getImg } from "../../config";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Outfit', sans-serif" };
const PER   = 4;

/* ── Magnetic hook ── */
function useMagnetic(s = 0.35) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * s);
    y.set((e.clientY - (r.top + r.height / 2)) * s);
  }, [s, x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return { ref, sx, sy, onMove, onLeave };
}

/* ── Tilt hook ── */
function useTilt(max = 7) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 20 });
  const sry = useSpring(ry, { stiffness: 160, damping: 20 });
  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    ry.set(((e.clientX - r.left) / r.width * 2 - 1) * max);
    rx.set(-(((e.clientY - r.top) / r.height * 2 - 1) * max * 0.6));
  }, [max, rx, ry]);
  const onLeave = useCallback(() => { rx.set(0); ry.set(0); }, [rx, ry]);
  return { ref, srx, sry, onMove, onLeave };
}

/* ── Shimmer ── */
const Shimmer = () => (
  <motion.div className="absolute inset-0"
    style={{ background: "linear-gradient(105deg,transparent 30%,rgba(0,0,0,0.035) 50%,transparent 70%)", backgroundSize: "200% 100%" }}
    animate={{ backgroundPositionX: ["200%", "-200%"] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
);

/* ══ PRODUCT CARD ══ */
const Card = ({ product, index, onClick, inView }) => {
  const [hov, setHov] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const tilt = useTilt(5);

  const name  = product?.name || "—";
  const brand = product?.brand || product?.category || "";
  const price = product?.price || 0;
  const disc  = product?.discountPrice;
  const badge = product?.badge || (product?.isNew ? "New" : product?.isSale ? "Sale" : null);
  const img   = product?.images?.[0] ? getImg(product.images[0]) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="cursor-pointer select-none group/card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ perspective: 1000 }}
    >
      {/* image */}
      <motion.div ref={tilt.ref} onMouseMove={tilt.onMove} onMouseLeave={tilt.onLeave}
        style={{ rotateX: tilt.srx, rotateY: tilt.sry, transformStyle: "preserve-3d", marginBottom: 18 }}
        className="relative">
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#f5f4f2" }}>
          {img && !loaded && <Shimmer />}
          {img
            ? <motion.img src={img} alt={name} draggable={false} onLoad={() => setLoaded(true)}
                className="w-full h-full object-contain p-6 mix-blend-multiply"
                style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}
                animate={{ scale: hov ? 0.88 : 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} />
            : <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-black/20" style={sans}>No Image</span>
              </div>
          }

          {/* badge */}
          {badge && (
            <motion.span initial={{ opacity: 0, y: -6 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08 + 0.3 }}
              className="absolute top-4 left-4 px-3 py-1 text-white text-[8px] tracking-[0.24em] uppercase"
              style={{ ...sans, background: badge === "Sale" ? "#1a3a1a" : "#0a0a0a" }}>
              {badge}
            </motion.span>
          )}

          {/* hover overlay — slides from bottom */}
          <motion.div
            initial={{ y: "100%" }} animate={{ y: hov ? "0%" : "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3"
            style={{ background: "rgba(255,255,255,0.97)", borderTop: "1px solid rgba(0,0,0,0.05)", backdropFilter: "blur(12px)" }}>
            <span className="text-[9px] tracking-[0.26em] uppercase text-stone-800" style={sans}>Quick View</span>
            <motion.div animate={{ x: hov ? 0 : -4, opacity: hov ? 1 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight size={12} strokeWidth={1.5} className="text-stone-700" />
            </motion.div>
          </motion.div>

          {/* tint */}
          <motion.div className="absolute inset-0 pointer-events-none bg-black"
            animate={{ opacity: hov ? 0.025 : 0 }} transition={{ duration: 0.3 }} />
        </div>

        {/* float shadow */}
        <motion.div
          animate={{ opacity: hov ? 0.2 : 0.07, scaleX: hov ? 0.78 : 0.68, y: hov ? 10 : 4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-3 left-[11%] right-[11%] h-6 bg-black rounded-full"
          style={{ filter: "blur(12px)" }} />
      </motion.div>

      {/* text */}
      <div>
        {brand && (
          <p className="text-[8.5px] tracking-[0.28em] uppercase text-black/30 mb-1.5" style={sans}>{brand}</p>
        )}
        <p className="text-[17px] font-medium text-stone-900 leading-tight mb-2.5" style={serif}>{name}</p>
        <div className="flex items-center gap-2.5">
          <p className="text-[13px] text-black/50" style={sans}>
            ₹{(disc || price).toLocaleString("en-IN")}
          </p>
          {disc > 0 && (
            <p className="text-[11px] text-black/25 line-through" style={sans}>
              ₹{price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* ── Skeleton ── */
const Skeleton = ({ index }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
    <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "3/4", background: "#f0efed" }}><Shimmer /></div>
    <div className="h-1.5 bg-black/[0.04] w-1/4 mb-2.5 rounded-full" />
    <div className="h-3.5 bg-black/[0.06] w-4/5 mb-2 rounded-full" />
    <div className="h-2.5 bg-black/[0.04] w-1/3 rounded-full" />
  </motion.div>
);

/* ── Arrow button ── */
const Arrow = ({ dir, onClick, mag }) => (
  <motion.button ref={mag.ref} onMouseMove={mag.onMove} onMouseLeave={mag.onLeave}
    whileTap={{ scale: 0.88 }} onClick={onClick}
    className="w-11 h-11 rounded-full bg-white flex items-center justify-center cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 28px rgba(0,0,0,0.09)", x: mag.sx, y: mag.sy }}>
    {dir === "left" ? <ChevronLeft size={17} strokeWidth={1.4} /> : <ChevronRight size={17} strokeWidth={1.4} />}
  </motion.button>
);

/* ══ MAIN ══ */
export default function FeaturedProducts() {
  const navigate   = useNavigate();
  const ref        = useRef(null);
  const inView     = useInView(ref, { once: true, margin: "-80px" });
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [page, setPage]       = useState(0);
  const magL = useMagnetic(0.45), magR = useMagnetic(0.45);

  useEffect(() => {
    API.get("/products")
      .then(r => setItems(Array.isArray(r.data) ? r.data : r.data?.products || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const total = Math.max(1, Math.ceil(items.length / PER));
  const slice = items.slice(page * PER, page * PER + PER);
  const go    = useCallback(p => setPage(Math.max(0, Math.min(p, total - 1))), [total]);

  useEffect(() => {
    if (total <= 1 || loading) return;
    const id = setInterval(() => setPage(p => (p + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total, loading]);

  return (
    <motion.section id="featured-products" ref={ref}
      className="py-20 md:py-28 overflow-hidden relative">

      {/* subtle noise bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(ellipse at 15% 50%,rgba(0,0,0,0.016) 0%,transparent 55%),radial-gradient(ellipse at 85% 15%,rgba(0,0,0,0.012) 0%,transparent 50%)" }} />

      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-14 md:mb-20 px-5 sm:px-10 lg:px-16 xl:px-[72px]">
        <div>
          {/* eyebrow */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-3">
            <motion.span initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="block w-7 h-px bg-black/30 origin-left" />
            <span className="text-[9px] tracking-[0.32em] uppercase text-black/35" style={sans}>Curated Selection</span>
          </motion.div>

          {/* headline */}
          <h2 className="m-0 flex flex-wrap gap-x-[0.22em]" style={{ ...serif, fontSize: "clamp(30px,4vw,54px)", fontWeight: 500, letterSpacing: "-0.01em", color: "#0a0a0a", lineHeight: 1.05 }}>
            {"Featured Products".split(" ").map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 22, filter: "blur(5px)" }}
                animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                style={{ display: "inline-block" }}>{w}</motion.span>
            ))}
          </h2>
        </div>

        {/* View All */}
        <motion.button
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.96 }} onClick={() => navigate("/products")}
          className="hidden sm:flex items-center gap-2 bg-transparent border-none cursor-pointer group/btn">
          <motion.span whileHover={{ x: 0 }} className="text-[10px] tracking-[0.2em] uppercase text-black/35 group-hover/btn:text-black/70 transition-colors duration-200" style={sans}>
            View All
          </motion.span>
          <motion.div className="group-hover/btn:translate-x-0.5 transition-transform duration-200">
            <ArrowRight size={12} strokeWidth={1.5} className="text-black/30 group-hover/btn:text-black/60 transition-colors duration-200" />
          </motion.div>
        </motion.button>
      </div>

      {error && (
        <p className="text-center py-20 text-[13px] text-black/30" style={sans}>Could not load products.</p>
      )}

      {/* ══ DESKTOP GRID ══ */}
      {!error && (
        <div className="hidden lg:block relative group px-5 sm:px-10 lg:px-16 xl:px-[72px]">
          {/* arrows */}
          {!loading && total > 1 && page > 0 && (
            <div className="absolute left-1 xl:left-5 top-[40%] -translate-y-1/2 z-20">
              <Arrow dir="left" onClick={() => go(page - 1)} mag={magL} />
            </div>
          )}
          {!loading && total > 1 && page < total - 1 && (
            <div className="absolute right-1 xl:right-5 top-[40%] -translate-y-1/2 z-20">
              <Arrow dir="right" onClick={() => go(page + 1)} mag={magR} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.06}
              onDragEnd={(_, { offset }) => { if (offset.x < -60) go(page + 1); else if (offset.x > 60) go(page - 1); }}
              className="grid gap-8 cursor-grab active:cursor-grabbing select-none"
              style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {loading
                ? Array.from({ length: PER }).map((_, i) => <Skeleton key={i} index={i} />)
                : slice.map((p, i) => <Card key={p._id || i} product={p} index={i} inView={inView} onClick={() => navigate(`/product/${p._id}`)} />)
              }
            </motion.div>
          </AnimatePresence>

          {/* pagination dots */}
          {!loading && total > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 mt-16">
              {Array.from({ length: total }).map((_, i) => (
                <motion.button key={i} onClick={() => go(i)} whileTap={{ scale: 0.8 }}
                  className="border-none bg-transparent cursor-pointer p-1.5">
                  <motion.span animate={{ width: i === page ? 28 : 5, background: i === page ? "#0a0a0a" : "rgba(0,0,0,0.14)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: 1.5, borderRadius: 1, display: "block" }} />
                </motion.button>
              ))}
              <span className="text-[9px] tracking-[0.18em] text-black/22 ml-2 tabular-nums" style={sans}>
                {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* ══ MOBILE SCROLL ══ */}
      {!error && (
        <div className="lg:hidden">
          <div id="fp-slider" className="flex gap-4 pb-2 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="shrink-0 w-52"><Skeleton index={i} /></div>)
              : items.map((p, i) => (
                <div key={p._id || i} className="shrink-0 snap-start" style={{ width: "clamp(165px,48vw,210px)" }}>
                  <Card product={p} index={i} inView={inView} onClick={() => navigate(`/product/${p._id}`)} />
                </div>
              ))
            }
          </div>

          {!loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}
              className="flex justify-center mt-8 px-5">
              <motion.button whileHover={{ backgroundColor: "#0a0a0a", color: "white" }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/products")}
                className="flex items-center gap-3 border border-black/10 bg-transparent cursor-pointer px-8 py-4 w-full justify-center transition-colors duration-250">
                <span className="text-[9.5px] tracking-[0.26em] uppercase" style={sans}>View All Products</span>
                <ArrowRight size={12} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </motion.section>
  );
}