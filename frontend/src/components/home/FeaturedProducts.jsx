import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Label } from "./utils";
import { getImg } from "../../config";

/*
  Add to index.css:
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
*/

const BG_COLORS = ["#f2f0ec","#eaecf0","#edf0ea","#f0eaea","#eaeaf0","#f0f0ea"];
const PER_PAGE = 4;

/* ─── Magnetic hook ─────────────────────────────── */
function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }, [strength, x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return { ref, sx, sy, onMove, onLeave };
}

/* ─── Tilt card hook ────────────────────────────── */
function useTilt(max = 8) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const srX = useSpring(rotX, { stiffness: 150, damping: 18 });
  const srY = useSpring(rotY, { stiffness: 150, damping: 18 });

  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    rotY.set(nx * max);
    rotX.set(-ny * max * 0.6);
  }, [max, rotX, rotY]);

  const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, [rotX, rotY]);
  return { ref, srX, srY, onMove, onLeave };
}

/* ─── Image shimmer placeholder ─────────────────── */
const Shimmer = () => (
  <motion.div
    style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(105deg, transparent 30%, rgba(0,0,0,0.03) 50%, transparent 70%)",
      backgroundSize: "200% 100%",
    }}
    animate={{ backgroundPositionX: ["200%", "-200%"] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
  />
);

/* ═══════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════ */
const ProductCard = ({ product, index, onClick, inView }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const tilt = useTilt(6);

  const name     = product?.name || "—";
  const category = product?.category || product?.brand || "";
  const price    = product?.price || 0;
  const badge    = product?.badge || (product?.isNew ? "New" : product?.isSale ? "Sale" : null);
  const image    = product?.images?.length > 0 ? getImg(product.images[0]) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.09,
      }}
      className="cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ perspective: 900 }}
    >
      {/* ── IMAGE BOX with 3D tilt ── */}
      <motion.div
        ref={tilt.ref}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        style={{
          rotateX: tilt.srX,
          rotateY: tilt.srY,
          transformStyle: "preserve-3d",
          marginBottom: 16,
          position: "relative",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "4/5",
            background: image ? "#f7f8f9" : BG_COLORS[index % BG_COLORS.length],
          }}
        >
          {/* Shimmer while loading */}
          {image && !imgLoaded && <Shimmer />}

          {image ? (
            <motion.img
              src={image}
              alt={name}
              draggable={false}
              className="w-full h-full object-contain p-5 mix-blend-multiply"
              style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.5s" }}
              onLoad={() => setImgLoaded(true)}
              animate={{ scale: hovered ? 0.9 : 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={28} strokeWidth={0.8} style={{ color: "rgba(0,0,0,0.1)" }} />
            </div>
          )}

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.09 + 0.35 }}
              className="absolute top-4 left-4 z-10 px-3 py-1"
              style={{ background: badge === "Sale" ? "#1a3a1a" : "#0a0a0a" }}
            >
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 8.5, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "white",
              }}>{badge}</span>
            </motion.div>
          )}

          {/* Hover CTA — slides up from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: hovered ? "0%" : "100%" }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3.5"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9.5, fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "#0a0a0a",
            }}>Quick View</span>
            <motion.div
              animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={13} strokeWidth={1.5} style={{ color: "#0a0a0a" }} />
            </motion.div>
          </motion.div>

          {/* Subtle corner accent */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute", bottom: 0, right: 0,
              width: 0, height: 0,
              borderLeft: "20px solid transparent",
              borderBottom: "20px solid rgba(0,0,0,0.06)",
              pointerEvents: "none",
            }}
          />

          {/* Hover tint */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "rgba(0,0,0,0.02)" }}
          />
        </div>

        {/* 3D depth shadow */}
        <motion.div
          animate={{
            opacity: hovered ? 0.18 : 0.07,
            scaleX: hovered ? 0.82 : 0.72,
            y: hovered ? 8 : 4,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: -12, left: "10%", right: "10%",
            height: 24,
            background: "#0a0a0a",
            borderRadius: "50%",
            filter: "blur(10px)",
          }}
        />
      </motion.div>

      {/* ── TEXT ── */}
      <div className="px-0.5">
        {category && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.09 + 0.25 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, letterSpacing: "0.26em",
              textTransform: "uppercase", color: "rgba(0,0,0,0.3)",
              marginBottom: 5,
            }}
          >{category}</motion.p>
        )}

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 17, fontWeight: 500,
          letterSpacing: "0.01em", color: "#0a0a0a",
          lineHeight: 1.2, marginBottom: 8,
        }}>{name}</p>

        <div className="flex items-center justify-between">
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 400,
            color: "rgba(0,0,0,0.5)",
          }}>₹{price.toLocaleString("en-IN")}</p>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
            transition={{ duration: 0.22 }}
          >
            <ArrowRight size={12} strokeWidth={1.5} style={{ color: "rgba(0,0,0,0.35)" }} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

/* ═══════════════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════════════ */
const Skeleton = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.07 }}
  >
    <div className="mb-4 relative overflow-hidden" style={{ aspectRatio: "4/5", background: "#f0f0ee" }}>
      <Shimmer />
    </div>
    <div style={{ height: 8, background: "rgba(0,0,0,0.04)", width: "25%", marginBottom: 10 }} />
    <div style={{ height: 14, background: "rgba(0,0,0,0.06)", width: "80%", marginBottom: 8 }} />
    <div style={{ height: 10, background: "rgba(0,0,0,0.04)", width: "33%" }} />
  </motion.div>
);

/* ─── Animated "View All" button ─────────────────── */
const ViewAllBtn = ({ onClick }) => {
  const mag = useMagnetic(0.4);
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      ref={mag.ref}
      style={{ x: mag.sx, y: mag.sy, display: "inline-flex", alignItems: "center", gap: 6 }}
      onMouseMove={mag.onMove}
      onMouseLeave={() => { mag.onLeave(); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      onClick={onClick}
      className="hidden sm:inline-flex bg-transparent border-none cursor-pointer py-1 items-center"
    >
      <motion.span
        animate={{ color: hov ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.38)" }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >View All</motion.span>
      <motion.div
        animate={{ x: hov ? 3 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <ArrowRight size={13} strokeWidth={1.5} style={{ color: hov ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.32)" }} />
      </motion.div>
    </motion.button>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN — FeaturedProducts
═══════════════════════════════════════════════════ */
const FeaturedProducts = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  /* fetch */
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products) ? res.data.products : [];
        setProducts(data);
      })
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const pageItems  = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const goToPage = useCallback((p) => {
    setPage(Math.max(0, Math.min(p, totalPages - 1)));
  }, [totalPages]);

  /* auto-advance */
  useEffect(() => {
    if (totalPages <= 1 || loading) return;
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000);
    return () => clearInterval(id);
  }, [totalPages, loading]);

  /* ── Nav arrow hooks ── */
  const magL = useMagnetic(0.45);
  const magR = useMagnetic(0.45);

  /* ── Headline split ── */
  const headline = "Featured Products";

  return (
    <motion.section
      id="featured-products"
      ref={sectionRef}
      className="py-16 md:py-20 overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* ── Subtle background texture ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.018) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.012) 0%, transparent 50%)",
      }} />

      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-12 md:mb-16 px-5 sm:px-10 lg:px-16 xl:px-[72px]">

        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.15 }}
              style={{
                display: "block", width: 28, height: 1,
                background: "rgba(0,0,0,0.3)",
                transformOrigin: "left",
              }}
            />
            <Label>Curated Selection</Label>
          </motion.div>

          {/* Headline — word by word */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px,3.8vw,52px)",
            fontWeight: 500, letterSpacing: "-0.01em",
            color: "#0a0a0a", lineHeight: 1.05, margin: 0,
            display: "flex", flexWrap: "wrap", gap: "0 0.25em",
          }}>
            {headline.split(" ").map((word, wi) => (
              <motion.span
                key={wi}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 + wi * 0.07,
                }}
                style={{ display: "inline-block" }}
              >{word}</motion.span>
            ))}
          </h2>
        </div>

        <ViewAllBtn onClick={() => navigate("/products")} />
      </div>

      {/* ── ERROR ── */}
      {error && (
        <p className="text-center py-20 px-5" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, color: "rgba(0,0,0,0.32)",
        }}>{error}</p>
      )}

      {/* ══════════════════════════════════════════
          DESKTOP — paginated grid
      ══════════════════════════════════════════ */}
      {!error && (
        <div className="hidden lg:block relative group px-5 sm:px-10 lg:px-16 xl:px-[72px]">

          {/* LEFT arrow */}
          {!loading && totalPages > 1 && page > 0 && (
            <motion.button
              ref={magL.ref}
              onMouseMove={magL.onMove}
              onMouseLeave={magL.onLeave}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToPage(page - 1)}
              className="absolute left-0 xl:left-4 top-[42%] -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                x: magL.sx,
                y: magL.sy,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} style={{ color: "#0a0a0a" }} />
            </motion.button>
          )}

          {/* RIGHT arrow */}
          {!loading && totalPages > 1 && page < totalPages - 1 && (
            <motion.button
              ref={magR.ref}
              onMouseMove={magR.onMove}
              onMouseLeave={magR.onLeave}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToPage(page + 1)}
              className="absolute right-0 xl:right-4 top-[42%] -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                x: magR.sx,
                y: magR.sy,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              <ChevronRight size={18} strokeWidth={1.5} style={{ color: "#0a0a0a" }} />
            </motion.button>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ opacity: 0, x: direction => direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.07}
              onDragEnd={(_, { offset }) => {
                if (offset.x < -60) goToPage(page + 1);
                else if (offset.x > 60) goToPage(page - 1);
              }}
              className="grid gap-7 cursor-grab active:cursor-grabbing"
              style={{ gridTemplateColumns: "repeat(4, 1fr)", userSelect: "none" }}
            >
              {loading
                ? Array.from({ length: PER_PAGE }).map((_, i) => <Skeleton key={i} index={i} />)
                : pageItems.map((p, i) => (
                  <ProductCard
                    key={p._id || i}
                    product={p}
                    index={i}
                    inView={inView}
                    onClick={() => navigate(`/product/${p._id}`)}
                  />
                ))
              }
            </motion.div>
          </AnimatePresence>

          {/* ── Progress dots / lines ── */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 mt-14"
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => goToPage(i)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.85 }}
                  className="border-none bg-transparent cursor-pointer p-1.5"
                >
                  <motion.span
                    animate={{
                      width: i === page ? 30 : 6,
                      background: i === page ? "#0a0a0a" : "rgba(0,0,0,0.15)",
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: 2, borderRadius: 1, display: "block" }}
                  />
                </motion.button>
              ))}

              {/* page label */}
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9, letterSpacing: "0.18em",
                color: "rgba(0,0,0,0.25)",
                marginLeft: 8,
                fontVariantNumeric: "tabular-nums",
              }}>
                {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          MOBILE — horizontal snap scroll
      ══════════════════════════════════════════ */}
      {!error && (
        <div className="lg:hidden relative">
          {/* Side arrows */}
          <div className="absolute top-[38%] -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none z-20">
            {["left", "right"].map((dir) => (
              <motion.button
                key={dir}
                whileTap={{ scale: 0.9 }}
                className="pointer-events-auto flex items-center justify-center bg-white border border-black/10 rounded-full active:scale-95"
                style={{
                  width: 34, height: 34,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}
                onClick={() => {
                  const el = document.getElementById("fp-slider");
                  if (el) el.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
                }}
              >
                {dir === "left"
                  ? <ChevronLeft size={15} strokeWidth={1.6} style={{ color: "#0a0a0a" }} />
                  : <ChevronRight size={15} strokeWidth={1.6} style={{ color: "#0a0a0a" }} />
                }
              </motion.button>
            ))}
          </div>

          <div
            id="fp-slider"
            className="flex gap-4 pb-2 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shrink-0 w-52"><Skeleton index={i} /></div>
              ))
              : products.map((p, i) => (
                <div key={p._id || i} className="shrink-0" style={{ width: "clamp(170px,50vw,220px)", scrollSnapAlign: "start" }}>
                  <ProductCard
                    product={p}
                    index={i}
                    inView={inView}
                    onClick={() => navigate(`/product/${p._id}`)}
                  />
                </div>
              ))
            }
          </div>

          {!loading && products.length === 0 && (
            <p className="px-5 pt-6 text-center" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, color: "rgba(0,0,0,0.4)",
            }}>
              Featured products are not available right now.
            </p>
          )}

          {/* Mobile CTA */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-8 px-5"
            >
              <motion.button
                whileHover={{ backgroundColor: "#0a0a0a", color: "white" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/products")}
                className="flex items-center gap-2.5 border border-black/12 bg-transparent cursor-pointer px-8 py-3.5 w-full justify-center"
                style={{ transition: "background 0.25s, color 0.25s" }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}>View All Products</span>
                <ArrowRight size={12} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

    </motion.section>
  );
};

export default FeaturedProducts;