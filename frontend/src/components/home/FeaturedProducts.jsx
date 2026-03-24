import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate, useMotionValue } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Label } from "./utils";

import { getImg } from "../../config";

const BG_COLORS = [
  "#f2f0ec", "#eaecf0", "#edf0ea",
  "#f0eaea", "#eaeaf0", "#f0f0ea",
];

const PER_PAGE = 4;

/* ═══════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════ */
const ProductCard = ({ product, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const name     = product?.name     || "—";
  const category = product?.category || product?.brand || "";
  const price    = product?.price    || 0;
  const badge    = product?.badge    || (product?.isNew ? "New" : product?.isSale ? "Sale" : null);
  // Replaced local getImg with centralized one
  const image    = product?.images?.length > 0
    ? getImg(product.images[0])
    : null;

  return (
    /* Each card animates in with stagger delay — controlled by parent variants */
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.97 },
        show:   { opacity: 1, y: 0,  scale: 1     },
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      className="cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* ── IMAGE BOX ── */}
      <div
        className="relative overflow-hidden mb-4"
        style={{
          aspectRatio: "4/5",
          background: image ? "#f7f8f9" : BG_COLORS[index % BG_COLORS.length],
        }}
      >
        {image ? (
          <motion.img
            src={image}
            alt={name}
            draggable={false}
            className="w-full h-full object-contain p-5 mix-blend-multiply"
            animate={{ scale: hovered ? 0.91 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={28} strokeWidth={0.8} style={{ color: "rgba(0,0,0,0.1)" }} />
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div
            className="absolute top-4 left-4 z-10 px-3 py-1"
            style={{ background: badge === "Sale" ? "#1a3a1a" : "#0a0a0a" }}
          >
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 8.5, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "white",
            }}>
              {badge}
            </span>
          </div>
        )}

        {/* Hover CTA bar — slides up */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: hovered ? "0%" : "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3.5"
          style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)" }}
        >
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, fontWeight: 500,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#0a0a0a",
          }}>
            Quick View
          </span>
          <ArrowRight size={13} strokeWidth={1.5} style={{ color: "#0a0a0a" }} />
        </motion.div>

        {/* Hover tint */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: "rgba(0,0,0,0.025)" }}
        />
      </div>

      {/* ── TEXT ── */}
      <div className="px-0.5">
        {category && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9, letterSpacing: "0.24em",
            textTransform: "uppercase", color: "rgba(0,0,0,0.32)",
            marginBottom: 5,
          }}>
            {category}
          </p>
        )}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 17, fontWeight: 500,
          letterSpacing: "0.01em", color: "#0a0a0a",
          lineHeight: 1.2, marginBottom: 7,
        }}>
          {name}
        </p>
        <div className="flex items-center justify-between">
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 400,
            color: "rgba(0,0,0,0.55)",
          }}>
            ₹{price.toLocaleString("en-IN")}
          </p>
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -5 }}
            transition={{ duration: 0.22 }}
          >
            <ArrowRight size={12} strokeWidth={1.5} style={{ color: "rgba(0,0,0,0.38)" }} />
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
    className="animate-pulse"
    variants={{
      hidden: { opacity: 0, y: 24 },
      show:   { opacity: 1, y: 0  },
    }}
    transition={{ duration: 0.5, delay: index * 0.07 }}
  >
    <div className="mb-4 bg-black/[0.05]" style={{ aspectRatio: "4/5" }} />
    <div className="h-2 bg-black/[0.04] w-1/4 mb-2.5" />
    <div className="h-4 bg-black/[0.06] w-4/5 mb-2" />
    <div className="h-3 bg-black/[0.04] w-1/3" />
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   MAIN — FeaturedProducts
═══════════════════════════════════════════════════ */
const FeaturedProducts = () => {
  const navigate     = useNavigate();
  const containerRef = useRef(null);
  const x            = useMotionValue(0);

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [page, setPage]         = useState(0);
  const [containerW, setContainerW] = useState(0);

  /* ── useInView — triggers once when section enters viewport ── */
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  /* measure container */
  useEffect(() => {
    const measure = () => {
      if (containerRef.current)
        setContainerW(containerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* fetch products */
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
          ? res.data.products : [];
        setProducts(data);
      })
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));

  /* ── Go to page ── */
  const goToPage = (p) => {
    const t = Math.max(0, Math.min(p, totalPages - 1));
    setPage(t);
    animate(x, -t * containerW, {
      type: "spring", stiffness: 260, damping: 32, mass: 0.9,
    });
  };

  /* ── Trackpad / horizontal wheel ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let accum = 0, timer = null;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.4) return;
      e.preventDefault();
      accum += e.deltaX;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (accum > 60)       goToPage(page + 1);
        else if (accum < -60) goToPage(page - 1);
        accum = 0;
      }, 60);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [page, totalPages, containerW]);

  /* ── Auto slide ── */
  useEffect(() => {
    if (totalPages <= 1 || loading) return;
    const id = setInterval(() => {
      setPage((prev) => {
        const next = (prev + 1) % totalPages;
        animate(x, -next * containerW, {
          type: "spring", stiffness: 260, damping: 32, mass: 0.9,
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [totalPages, containerW, loading]);

  /* ── Drag end snap ── */
  const onDragEnd = (_, info) => {
    const threshold = containerW * 0.18;
    if      (info.offset.x < -threshold) goToPage(page + 1);
    else if (info.offset.x >  threshold) goToPage(page - 1);
    else                                  goToPage(page);
  };

  const pageItems = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  /* ──────────────────────────────────────────────────
     SECTION ENTRY VARIANTS
     headline → cards stagger → dots
  ────────────────────────────────────────────────── */
  const sectionVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.06 } },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
    show:   {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const gridVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };

  const dotsVariants = {
    hidden: { opacity: 0, y: 10 },
    show:   {
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: 0.55, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="featured-products"
      ref={containerRef}
      className="py-16 md:py-7 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >

      {/* ── HEADER ── */}
      <motion.div
        variants={headlineVariants}
        className="flex items-end justify-between mb-10 md:mb-14 px-5 sm:px-10 lg:px-16 xl:px-[72px]"
      >
        <div>
          <Label>Curated Selection</Label>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 3.8vw, 52px)",
            fontWeight: 500, letterSpacing: "-0.01em",
            color: "#0a0a0a", lineHeight: 1.05, marginTop: 8,
          }}>
            Featured Products
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/products")}
            className="hidden sm:flex items-center gap-1.5 bg-transparent border-none cursor-pointer group py-1"
          >
            <span
              className="group-hover:text-black/80 transition-colors duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.42)",
              }}
            >
              View All
            </span>
            <ArrowRight
              size={13} strokeWidth={1.5}
              style={{ color: "rgba(0,0,0,0.32)" }}
              className="group-hover:text-black/65 transition-colors"
            />
          </button>
        </div>
      </motion.div>

      {/* ── ERROR ── */}
      {error && (
        <p className="text-center py-20 px-5" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, color: "rgba(0,0,0,0.32)",
        }}>
          {error}
        </p>
      )}

      {/* ══════════════════════════════════════════
          DESKTOP — paginated drag slider
      ══════════════════════════════════════════ */}
      {!error && (
        <div className="hidden lg:block relative group px-5 sm:px-10 lg:px-16 xl:px-[72px] touch-pan-y">
          {/* Navigation Arrows (Visible on hover) */}
          {!loading && totalPages > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                className={`absolute left-0 sm:left-4 lg:left-8 xl:left-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-black/5 flex items-center justify-center cursor-pointer bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-all duration-300 ${page === 0 ? "hidden" : "block"}`}
              >
                <ChevronLeft size={20} strokeWidth={1.5} style={{ color: "#0a0a0a" }} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages - 1}
                className={`absolute right-0 sm:right-4 lg:right-8 xl:right-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-black/5 flex items-center justify-center cursor-pointer bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-all duration-300 ${page >= totalPages - 1 ? "hidden" : "block"}`}
              >
                <ChevronRight size={20} strokeWidth={1.5} style={{ color: "#0a0a0a" }} />
              </motion.button>
            </>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, x: -30, transition: { duration: 0.28 } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.07}
              onDragEnd={onDragEnd}
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
                      onClick={() => navigate(`/product/${p._id}`)}
                    />
                  ))
              }
            </motion.div>
          </AnimatePresence>

          {/* Page dots */}
          {!loading && totalPages > 1 && (
            <motion.div
              variants={dotsVariants}
              className="flex items-center justify-center gap-2 mt-12"
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => goToPage(i)}
                  className="border-none bg-transparent cursor-pointer p-1"
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.85 }}
                >
                  <motion.span
                    className="block"
                    animate={{
                      width: i === page ? 28 : 6,
                      background: i === page ? "#0a0a0a" : "rgba(0,0,0,0.16)",
                    }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: 2, borderRadius: 1, display: "block" }}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          MOBILE — drag scroll
      ══════════════════════════════════════════ */}
      {!error && (
        <div className="lg:hidden relative">
          {/* Navigation Arrows */}
          <div className="absolute top-[40%] -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none z-20 opacity-90">
            <button onClick={() => document.getElementById('fp-slider')?.scrollBy({ left: -260, behavior: 'smooth' })} className="pointer-events-auto w-[36px] h-[36px] flex items-center justify-center bg-white border border-black/10 rounded-full shadow-md backdrop-blur-md active:scale-95 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
            <button onClick={() => document.getElementById('fp-slider')?.scrollBy({ left: 260, behavior: 'smooth' })} className="pointer-events-auto w-[36px] h-[36px] flex items-center justify-center bg-white border border-black/10 rounded-full shadow-md backdrop-blur-md active:scale-95 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>
          <motion.div
            id="fp-slider"
            variants={gridVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="flex gap-4 pb-2 px-5 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="shrink-0 w-52">
                    <Skeleton index={i} />
                  </div>
                ))
              : products.map((p, i) => (
                  <motion.div
                    key={p._id || i}
                    className="shrink-0"
                    style={{ width: "clamp(175px, 50vw, 230px)", scrollSnapAlign: "start" }}
                  >
                    <ProductCard
                      product={p}
                      index={i}
                      onClick={() => navigate(`/product/${p._id}`)}
                    />
                  </motion.div>
                ))
            }
          </motion.div>

          {!loading && (
            <motion.div
              variants={dotsVariants}
              className="flex justify-center mt-8 px-5"
            >
              <motion.button
                whileHover={{ backgroundColor: "#0a0a0a", color: "white" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/products")}
                className="flex items-center gap-2 border border-black/12 bg-transparent cursor-pointer px-7 py-3 w-full justify-center transition-colors duration-200"
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "inherit",
                }}>
                  View All Products
                </span>
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
