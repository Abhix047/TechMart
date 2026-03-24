import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import { getImg } from "../../config";

/*
  index.css mein add karo:
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
*/

const DURATION = 15000;
const NAVBAR_H = 88;

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [textReady, setTextReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const navigate = useNavigate();
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  /* ── Parallax on scroll ───────────────────────────── */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -120]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.97]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.75]);

  /* ── Data fetch ───────────────────────────────────── */
  useEffect(() => {
    API.get("/banners")
      .then((res) => setBanners(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Progress bar RAF ─────────────────────────────── */
  const startProgress = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - startRef.current) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── Navigation ──────────────────────────────────── */
  const goNext = useCallback(() => {
    setTextReady(false);
    setDirection(1);
    setCurrent((p) => (p + 1) % banners.length);
  }, [banners.length]);

  const goPrev = useCallback(() => {
    setTextReady(false);
    setDirection(-1);
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goTo = useCallback((idx) => {
    setTextReady(false);
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  /* ── Auto-advance (NO pause on hover) ───────────────
     Video/image keeps playing — only slideshow timer runs
  ── */
  useEffect(() => {
    if (!banners.length) return;
    setProgress(0);
    startProgress();
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(goNext, DURATION);
    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [current, banners.length, goNext, startProgress]);

  /* ── Text reveal delay ───────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setTextReady(true), 100);
    return () => clearTimeout(t);
  }, [current]);

  /* ── Slide transition variants ───────────────────── */
  const imgVariants = {
    enter: (d) => ({ opacity: 0, scale: 1.04, x: d > 0 ? "1.5%" : "-1.5%" }),
    center: {
      opacity: 1, scale: 1, x: "0%",
      transition: { duration: 1.05, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (d) => ({
      opacity: 0, scale: 0.99, x: d > 0 ? "-1%" : "1%",
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  /* ── Card click → products page ─────────────────── */
  const handleCardClick = (e) => {
    // Don't navigate if clicking on arrow buttons
    if (e.target.closest("[data-control]")) return;
    navigate("/products");
  };

  /* ── Loading skeleton ────────────────────────────── */
  if (loading) {
    return (
      <div style={{ marginTop: NAVBAR_H, padding: "0 clamp(14px, 2vw, 28px) clamp(14px, 2vw, 28px)" }}>
        <div className="w-full flex items-center justify-center h-[45vh] md:h-[clamp(400px,66vh,800px)]" style={{
          background: "#efefed",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            border: "1.5px solid rgba(0,0,0,0.1)",
            borderTopColor: "rgba(0,0,0,0.4)",
            animation: "spin 0.75s linear infinite",
          }} />
        </div>
      </div>
    );
  }

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <section
      style={{
        marginTop: isMobile ? 84 : NAVBAR_H,
        padding: isMobile ? "0 12px 24px" : "0 clamp(14px, 2vw, 28px) 40px",
        background: "white",
        position: "relative",
      }}
    >
      {/* ── Parallax wrapper ── */}
      <motion.div
        style={{
          y: heroY,
          scale: heroScale,
          opacity: heroOpacity,
          transformOrigin: "top center",
          willChange: "transform",
        }}
      >
        {/* ══════════════════════════════════════
            HERO CARD
            — NO borderRadius (sharp corners)
            — cursor pointer (click → /products)
            — NO hover pause (video keeps going)
        ══════════════════════════════════════ */}
        <div
          className="relative overflow-hidden group w-full h-[25vh] md:h-[clamp(400px,88vh,920px)] rounded-[20px] md:rounded-none"
          onClick={handleCardClick}
          style={{
            background: "#111",
            cursor: "pointer",
            boxShadow: "0 8px 48px rgba(0,0,0,0.16)",
          }}
        >

          {/* ── SLIDE MEDIA ── */}
          <AnimatePresence mode="sync" custom={direction}>
            <motion.div
              key={banner._id ?? current}
              custom={direction}
              variants={imgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -100) goNext();
                else if (swipe > 100) goPrev();
              }}
            >
              {banner.type === "video" ? (
                <video
                  src={getImg(banner.media)}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={getImg(banner.media)}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── GRADIENTS ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 38%, transparent 65%)",
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.22) 0%, transparent 55%)",
          }} />

          {/* ── TOP LEFT: counter ── */}
          <div className="absolute z-20" style={{ top: 20, left: 24 }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 300,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.35)",
            }}>
              {String(current + 1).padStart(2, "0")}
              <span style={{ margin: "0 6px", opacity: 0.3 }}>/</span>
              {String(banners.length).padStart(2, "0")}
            </span>
          </div>

          {/* ── TOP RIGHT: "Explore" CTA hint ── */}
          <div
            className="absolute z-20 flex items-center gap-1.5"
            style={{ top: 18, right: 22 }}
          >
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
            }}>
              Explore
            </span>
            <ArrowUpRight size={11} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.32)" }} />
          </div>

          {/* ── LEFT NAVIGATION ARROW ── */}
          <motion.button
            data-control="true"
            whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.16)" }}
            whileTap={{ scale: 0.88 }}
            onClick={goPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer border-none md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity duration-300 z-30"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
            }}
          >
            <ChevronLeft size={15} strokeWidth={1.6} style={{ color: "rgba(255,255,255,0.80)" }} />
          </motion.button>

          {/* ── RIGHT NAVIGATION ARROW ── */}
          <motion.button
            data-control="true"
            whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.16)" }}
            whileTap={{ scale: 0.88 }}
            onClick={goNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer border-none md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity duration-300 z-30"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
            }}
          >
            <ChevronRight size={15} strokeWidth={1.6} style={{ color: "rgba(255,255,255,0.80)" }} />
          </motion.button>

          {/* ══════════════════════════════════════
              BOTTOM CONTENT
          ══════════════════════════════════════ */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-end justify-between"
            style={{
              padding: "0 clamp(16px, 2.8vw, 36px) clamp(20px, 3.2vh, 36px)",
              gap: 16,
            }}
          >

            {/* ── LEFT: Text block ── */}
            <div style={{ flex: "1 1 auto", maxWidth: "100%", paddingRight: 8 }}>
              <AnimatePresence mode="wait">
                {textReady && (
                  <motion.div key={banner._id + "-text"}>

                    {/* Subtitle — small spaced caps */}
                    {banner.subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38, delay: 0.03 }}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 9.5,
                          fontWeight: 400,
                          letterSpacing: "0.28em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.42)",
                          margin: "0 0 8px 0",
                        }}
                      >
                        {banner.subtitle}
                      </motion.p>
                    )}

                    {/* Main title — Cormorant, elegant & refined */}
                    {banner.title && (
                      <motion.h1
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          fontFamily: "'Cormorant', serif",
                          fontSize: "clamp(20px, 2.8vw, 42px)",
                          fontWeight: 300,
                          fontStyle: "italic",
                          color: "white",
                          lineHeight: 1.18,
                          letterSpacing: "0.01em",
                          margin: 0,
                          textShadow: "0 1px 20px rgba(0,0,0,0.2)",
                        }}
                      >
                        {banner.title}
                      </motion.h1>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Controls ── */}
            <div
              data-control="true"
              className="flex flex-col items-end gap-3.5 shrink-0"
              onClick={(e) => e.stopPropagation()} /* prevent card click */
            >

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    data-control="true"
                    onClick={() => goTo(idx)}
                    className="relative overflow-hidden cursor-pointer border-none p-0"
                    style={{
                      height: 1.5,
                      width: idx === current ? 34 : 10,
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: 1,
                      transition: "width 0.38s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    {idx === current && (
                      <motion.div
                        key={current + "-fill"}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        style={{
                          position: "absolute", top: 0, left: 0,
                          height: "100%", background: "white", borderRadius: 1,
                        }}
                      />
                    )}
                  </button>
                ))}
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9.5, fontWeight: 300,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.26)",
                  minWidth: 18, textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {`${Math.ceil(((100 - progress) / 100) * (DURATION / 1000))}s`}
                </span>
              </div>

              {/* Arrows were moved to the sides */}

            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default Hero;