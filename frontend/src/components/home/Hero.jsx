import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getImg } from "../../config";

/*
  index.css mein add karo:
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  Also add these global styles:
  @keyframes spin { to { transform: rotate(360deg); } }

  .hero-grain::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 10;
    mix-blend-mode: overlay;
    border-radius: inherit;
  }
*/

const DURATION = 15000;
const NAVBAR_H = 96;

/* ── Magnetic button hook ── */
function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 15, mass: 1.2 });
  const sy = useSpring(y, { stiffness: 100, damping: 15, mass: 1.2 });

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [strength, x, y]);

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, sx, sy, onMove, onLeave };
}

/* ── Split text into animated chars ── */
const SplitText = ({ text, delay = 0, className = "", style = {} }) => {
  const words = text.split(" ");
  let charIndex = 0;
  return (
    <span className={className} style={{ display: "inline", ...style }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char) => {
            const i = charIndex++;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -12, rotateX: 20 }}
                transition={{
                  duration: 0.55,
                  delay: delay + i * 0.022,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block", transformOrigin: "bottom" }}
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block" }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

/* ── Animated counter ── */
const AnimatedCounter = ({ value }) => {
  const nodeRef = useRef(null);
  const prev = useRef(value);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { node.textContent = String(Math.round(v)).padStart(2, "0"); },
    });
    prev.current = value;
    return controls.stop;
  }, [value]);
  return <span ref={nodeRef}>{String(value).padStart(2, "0")}</span>;
};

/* ─────────────────────────────────────────────────────────── */
const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [textReady, setTextReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = useNavigate();
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const heroRef = useRef(null);

  /* ── Mouse parallax ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), { stiffness: 40, damping: 25, mass: 1.5 });
  const imgY = useSpring(useTransform(mouseY, [-1, 1], [-8, 8]), { stiffness: 40, damping: 25, mass: 1.5 });

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current || isMobile) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(nx);
    mouseY.set(ny);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [isMobile, mouseX, mouseY]);

  /* ── Scroll parallax ── */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -140]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.96]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.7]);

  /* ── Data fetch ── */
  useEffect(() => {
    API.get("/banners")
      .then((res) => setBanners(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Progress RAF ── */
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

  /* ── Navigation ── */
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

  /* ── Auto-advance ── */
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

  useEffect(() => {
    const t = setTimeout(() => setTextReady(true), 120);
    return () => clearTimeout(t);
  }, [current]);

  /* ── Variants ── */
  const imgVariants = {
    enter: (d) => ({
      opacity: 0.3,
      scale: 1.05,
      clipPath: d > 0
        ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
        : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    }),
    center: {
      opacity: 1,
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (d) => ({
      opacity: 0.6,
      scale: 0.95,
      clipPath: d > 0
        ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
        : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  /* ── Magnetic arrows ── */
  const magL = useMagnetic(0.5);
  const magR = useMagnetic(0.5);

  const handleCardClick = (e) => {
    if (e.target.closest("[data-control]")) return;
    navigate("/products");
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ marginTop: NAVBAR_H, padding: "0 clamp(14px,2vw,28px) clamp(14px,2vw,28px)" }}>
        <div
          className="w-full flex items-center justify-center"
          style={{
            height: "clamp(400px,66vh,800px)",
            background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)",
            borderRadius: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shimmer */}
          <motion.div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPositionX: ["200%", "-200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ rotate: { duration: 1.2, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
            style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.08)",
              borderTopColor: "rgba(255,255,255,0.5)",
            }}
          />
        </div>
      </div>
    );
  }

  if (!banners.length) return null;

  const banner = banners[current];
  const secondsLeft = Math.ceil(((100 - progress) / 100) * (DURATION / 1000));

  return (
    <section
      style={{
        marginTop: isMobile ? 84 : NAVBAR_H,
        padding: isMobile ? "0 10px 20px" : "0 clamp(14px,2vw,28px) 40px",
        background: "transparent",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          y: heroY,
          scale: heroScale,
          opacity: heroOpacity,
          transformOrigin: "top center",
          willChange: "transform",
        }}
      >
        {/* ══════════ HERO CARD ══════════ */}
        <div
          ref={heroRef}
          className="hero-grain relative overflow-hidden group w-full"
          onClick={handleCardClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          style={{
            height: isMobile ? "56vw" : "clamp(420px,88vh,940px)",
            minHeight: isMobile ? 220 : 420,
            background: "#080808",
            cursor: "pointer",
            borderRadius: isMobile ? 16 : 4,
            boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.04) inset",
          }}
        >
          {/* ── Custom cursor spotlight ── */}
          {!isMobile && (
            <motion.div
              style={{
                position: "absolute",
                left: mousePos.x - 120,
                top: mousePos.y - 120,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 25,
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* ── MEDIA: clip-path slide transition + mouse parallax ── */}
          <AnimatePresence mode="sync" custom={direction}>
            <motion.div
              key={banner._id ?? current}
              custom={direction}
              variants={imgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -80) goNext();
                else if (swipe > 80) goPrev();
              }}
            >
              {/* Inner parallax layer */}
              <motion.div
                className="w-full h-full"
                style={{ x: imgX, y: imgY, scale: 1.06 }}
              >
                {banner.type === "video" ? (
                  <video
                    src={getImg(banner.media)}
                    autoPlay muted loop playsInline
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.88) contrast(1.05) saturate(1.1)" }}
                  />
                ) : (
                  <img
                    src={getImg(banner.media)}
                    alt={banner.title || "Banner"}
                    className="w-full h-full object-cover"
                    draggable={false}
                    style={{ filter: "brightness(0.88) contrast(1.05) saturate(1.1)" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/1400x800/0a0a0a/ffffff?text=Banner";
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ── Multi-layer gradients ── */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5,
            background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.1) 55%, transparent 75%)",
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5,
            background: "linear-gradient(100deg, rgba(0,0,0,0.35) 0%, transparent 50%)",
          }} />
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5,
            boxShadow: "inset 0 0 120px rgba(0,0,0,0.45)",
          }} />

          {/* ── TOP BAR ── */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between"
            style={{ padding: isMobile ? "16px 18px" : "22px 32px" }}>

            {/* Slide counter */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 9 : 10,
                fontWeight: 300,
                letterSpacing: "0.22em",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.85)" }}>
                <AnimatedCounter value={current + 1} />
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 2px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>
                {String(banners.length).padStart(2, "0")}
              </span>
            </motion.div>

            {/* Explore pill */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px 6px 14px",
                borderRadius: 99,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                cursor: "pointer",
              }}
            >
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9, fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}>Explore</span>
              <ArrowUpRight size={10} strokeWidth={2} style={{ color: "rgba(255,255,255,0.4)" }} />
            </motion.div>
          </div>

          {/* ── LEFT NAV ── */}
          <motion.button
            ref={magL.ref}
            data-control="true"
            onMouseMove={magL.onMove}
            onMouseLeave={magL.onLeave}
            onClick={goPrev}
            whileTap={{ scale: 0.88 }}
            style={{
              position: "absolute",
              left: isMobile ? 10 : 24,
              top: "50%",
              translateY: "-50%",
              x: magL.sx,
              y: magL.sy,
              zIndex: 30,
              width: isMobile ? 36 : 46,
              height: isMobile ? 36 : 46,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: isMobile ? 1 : undefined,
            }}
            className={!isMobile ? "opacity-0 group-hover:opacity-100" : ""}
            transition={{ opacity: { duration: 0.3 } }}
          >
            <ChevronLeft size={isMobile ? 14 : 16} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.75)" }} />
          </motion.button>

          {/* ── RIGHT NAV ── */}
          <motion.button
            ref={magR.ref}
            data-control="true"
            onMouseMove={magR.onMove}
            onMouseLeave={magR.onLeave}
            onClick={goNext}
            whileTap={{ scale: 0.88 }}
            style={{
              position: "absolute",
              right: isMobile ? 10 : 24,
              top: "50%",
              translateY: "-50%",
              x: magR.sx,
              y: magR.sy,
              zIndex: 30,
              width: isMobile ? 36 : 46,
              height: isMobile ? 36 : 46,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: isMobile ? 1 : undefined,
            }}
            className={!isMobile ? "opacity-0 group-hover:opacity-100" : ""}
            transition={{ opacity: { duration: 0.3 } }}
          >
            <ChevronRight size={isMobile ? 14 : 16} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.75)" }} />
          </motion.button>

          {/* ── BOTTOM CONTENT ── */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-end justify-between"
            style={{
              padding: isMobile
                ? "0 18px 28px"
                : "0 clamp(20px,3vw,44px) clamp(36px,8vh,80px)",
              gap: 16,
            }}
          >
            {/* Left: Text */}
            <div style={{ flex: "1 1 auto", maxWidth: "78%", perspective: 800 }}>
              <AnimatePresence mode="wait">
                {textReady && (
                  <motion.div key={banner._id + "-text"}>

                    {/* Eyebrow tag */}
                    {banner.subHeading && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: isMobile ? 8 : 14,
                          overflow: "hidden",
                        }}
                      >
                        {/* Animated dash */}
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          style={{
                            display: "block",
                            width: isMobile ? 16 : 24,
                            height: 1,
                            background: "rgba(255,255,255,0.4)",
                            transformOrigin: "left",
                          }}
                        />
                        <motion.p
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: isMobile ? 9 : 11,
                            fontWeight: 500,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.45)",
                            margin: 0,
                          }}
                        >
                          {banner.subHeading}
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Main title — char-by-char with 3D flip */}
                    {banner.title && (
                      <h1
                        style={{
                          fontFamily: "'Cormorant', serif",
                          fontSize: isMobile ? "clamp(20px,5.5vw,26px)" : "clamp(30px,4.5vw,66px)",
                          fontWeight: 400,
                          color: "white",
                          lineHeight: 1.14,
                          letterSpacing: "-0.01em",
                          margin: 0,
                          textShadow: "0 2px 40px rgba(0,0,0,0.3)",
                        }}
                      >
                        <SplitText
                          text={banner.title}
                          delay={0.12}
                        />
                      </h1>
                    )}

                    {/* CTA line */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.45 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: isMobile ? 10 : 18,
                      }}
                    >
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: isMobile ? 9.5 : 11,
                        fontWeight: 400,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                      }}>
                        Shop Collection
                      </span>
                      {/* Animated arrow */}
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowUpRight size={11} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.3)" }} />
                      </motion.span>
                    </motion.div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Progress indicators */}
            <div
              data-control="true"
              className="flex flex-col items-end gap-4 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Circular progress ring */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{ position: "relative", width: 38, height: 38 }}
                >
                  <svg width="38" height="38" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
                    <circle cx="19" cy="19" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                    <motion.circle
                      cx="19" cy="19" r="15"
                      fill="none"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 15}`}
                      strokeDashoffset={`${2 * Math.PI * 15 * (1 - progress / 100)}`}
                      style={{ transition: "stroke-dashoffset 0.1s linear" }}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 8, fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.05em",
                  }}>
                    {secondsLeft}s
                  </div>
                </motion.div>
              )}

              {/* Dot indicators — slim lines */}
              <div className="flex items-center gap-1.5">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    data-control="true"
                    onClick={() => goTo(idx)}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "none",
                      padding: 0,
                      height: 2,
                      width: idx === current ? 32 : 8,
                      background: idx === current ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.18)",
                      borderRadius: 2,
                      transition: "width 0.45s cubic-bezier(0.4,0,0.2,1), background 0.3s",
                    }}
                  >
                    {idx === current && (
                      <motion.div
                        key={current + "-bar"}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        style={{
                          position: "absolute", top: 0, left: 0,
                          height: "100%",
                          background: "white",
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── Bottom border glimmer ── */}
          <motion.div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 1, zIndex: 20,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Slide number watermark — large bg number ── */}
          {!isMobile && (
            <AnimatePresence mode="wait">
              {textReady && (
                <motion.div
                  key={current + "-num"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    right: "clamp(20px,3vw,44px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "'Cormorant', serif",
                    fontSize: "clamp(100px,14vw,180px)",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.04)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 6,
                  }}
                >
                  {String(current + 1).padStart(2, "0")}
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>
      </motion.div>
    </section>
  );
};

export default Hero;