import { useRef, useState, useEffect } from "react";
import { motion, useInView, useAnimationFrame } from "framer-motion";
import { Shield, RotateCcw, Truck, Zap, ArrowUpRight } from "lucide-react";

/*
  Aesthetic direction: Editorial magazine meets brutalist grid.
  - Oversized numbered section anchors on a ruled grid
  - Cards use a "split-reveal" — number floods up as a giant background
    character while content slides in from the left
  - Hover: the entire card "prints" — ink-stamp ripple from center
  - Marquee strip at top with promise tickers
  - Color: warm cream (#faf8f4) base with deep espresso (#1a1108) ink
  - Accent: muted verdigris (#4a7c6f) for the stat numbers — aged brass feel
*/

const BRAND   = "#1a1108";
const CREAM   = "#faf8f4";
const VERDI   = "#4a7c6f";    // verdigris accent
const RULE    = "rgba(26,17,8,0.09)";
const MUTED   = "rgba(26,17,8,0.36)";

const PROMISES = [
  {
    Icon: Truck,
    index: "I",
    title: "Free Delivery",
    tagline: "No hidden charges",
    desc: "On all orders above ₹999. Every package delivered with care, tracked in real-time to your doorstep.",
    stat: "₹999",
    statSuffix: "+",
    statLbl: "min. order",
    accent: "#4a7c6f",
  },
  {
    Icon: RotateCcw,
    index: "II",
    title: "Easy Returns",
    tagline: "No questions asked",
    desc: "Changed your mind? Our 7-day hassle-free return window means zero regret on every purchase.",
    stat: "7",
    statSuffix: " days",
    statLbl: "return window",
    accent: "#7c5c4a",
  },
  {
    Icon: Shield,
    index: "III",
    title: "1 Year Warranty",
    tagline: "Full coverage",
    desc: "Every product ships with a comprehensive 12-month manufacturer warranty. Peace of mind, guaranteed.",
    stat: "12",
    statSuffix: " mo",
    statLbl: "coverage",
    accent: "#4a5c7c",
  },
  {
    Icon: Zap,
    index: "IV",
    title: "Fast Dispatch",
    tagline: "Same-day shipping",
    desc: "Orders placed before 2 PM ship the same day. We move fast so your tech arrives faster.",
    stat: "2",
    statSuffix: " PM",
    statLbl: "cutoff time",
    accent: "#7c6e4a",
  },
];

const TICKER_ITEMS = [
  "Free delivery ₹999+", "·", "7-day returns", "·", "1 year warranty", "·",
  "Same-day dispatch", "·", "Secure payments", "·", "Pan-India delivery", "·",
  "Free delivery ₹999+", "·", "7-day returns", "·", "1 year warranty", "·",
  "Same-day dispatch", "·",
];

/* ── Marquee ticker ── */
const Ticker = () => {
  const x = useRef(0);
  const ref = useRef(null);

  useAnimationFrame((_, delta) => {
    if (!ref.current) return;
    x.current -= delta * 0.045;
    const w = ref.current.scrollWidth / 2;
    if (Math.abs(x.current) >= w) x.current = 0;
    ref.current.style.transform = `translateX(${x.current}px)`;
  });

  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div style={{
      borderTop: `1px solid ${RULE}`,
      borderBottom: `1px solid ${RULE}`,
      overflow: "hidden",
      background: CREAM,
      height: 36,
      display: "flex",
      alignItems: "center",
    }}>
      <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 0, whiteSpace: "nowrap", willChange: "transform" }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            fontWeight: item === "·" ? 700 : 400,
            letterSpacing: item === "·" ? "0.1em" : "0.22em",
            textTransform: "uppercase",
            color: item === "·" ? "rgba(26,17,8,0.20)" : MUTED,
            padding: item === "·" ? "0 18px" : "0 0",
            display: "inline-block",
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
};

/* ── Individual promise card ── */
const PromiseCard = ({ item, index, isInView }) => {
  const [hov, setHov] = useState(false);
  const [ripple, setRipple] = useState(null);
  const cardRef = useRef(null);
  const { Icon, index: romanNum, title, tagline, desc, stat, statSuffix, statLbl, accent } = item;

  const handleMouseEnter = (e) => {
    setHov(true);
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 700);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.13, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        borderRight: index < 3 ? `1px solid ${RULE}` : "none",
        background: hov ? BRAND : CREAM,
        transition: "background 0.55s cubic-bezier(0.16,1,0.3,1)",
        padding: "clamp(24px, 3vw, 44px) clamp(20px, 2.4vw, 36px)",
        display: "flex",
        flexDirection: "column",
        minHeight: "clamp(240px, 26vw, 340px)",
      }}
    >
      {/* Ink-stamp ripple on hover enter */}
      {ripple && (
        <motion.div
          initial={{ scale: 0, opacity: 0.15 }}
          animate={{ scale: 28, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            left: ripple.x - 10,
            top: ripple.y - 10,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Giant Roman numeral — floods in from below on hover */}
      <motion.span
        animate={{
          y: hov ? "0%" : "30%",
          opacity: hov ? 0.06 : 0.04,
          color: hov ? "#ffffff" : BRAND,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          bottom: -16,
          right: -8,
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(80px, 9vw, 128px)",
          fontWeight: 700,
          fontStyle: "italic",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {romanNum}
      </motion.span>

      {/* Top row: index pill + icon */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "auto" }}>

        {/* Index pill */}
        <motion.div
          animate={{
            background: hov ? "rgba(255,255,255,0.12)" : "rgba(26,17,8,0.06)",
            borderColor: hov ? "rgba(255,255,255,0.18)" : "rgba(26,17,8,0.10)",
          }}
          transition={{ duration: 0.45 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px 5px 8px",
            border: "1px solid rgba(26,17,8,0.10)",
          }}
        >
          <motion.div
            animate={{ rotate: hov ? 360 : 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Icon
              size={14}
              strokeWidth={1.6}
              style={{ color: hov ? "rgba(255,255,255,0.85)" : accent, transition: "color 0.4s", flexShrink: 0 }}
            />
          </motion.div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: hov ? "rgba(255,255,255,0.55)" : MUTED,
            transition: "color 0.4s",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Arrow */}
        <motion.div
          animate={{
            opacity: hov ? 1 : 0,
            x: hov ? 0 : -6,
            y: hov ? 0 : 6,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowUpRight size={16} strokeWidth={1.4} style={{ color: "rgba(255,255,255,0.40)" }} />
        </motion.div>
      </div>

      {/* Rule line that draws in */}
      <div style={{ position: "relative", zIndex: 2, height: 1, margin: "20px 0 18px", overflow: "hidden" }}>
        <motion.span
          style={{ display: "block", height: "100%", position: "absolute", left: 0, top: 0 }}
          animate={{
            width: isInView ? "100%" : "0%",
            background: hov ? "rgba(255,255,255,0.18)" : "rgba(26,17,8,0.10)",
          }}
          transition={{
            width: { duration: 0.75, delay: index * 0.13 + 0.25, ease: [0.16, 1, 0.3, 1] },
            background: { duration: 0.45 },
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Tagline — always visible, small */}
        <motion.p
          animate={{ color: hov ? "rgba(255,255,255,0.38)" : MUTED }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9.5,
            fontWeight: 400,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            margin: "0 0 7px",
          }}
        >
          {tagline}
        </motion.p>

        {/* Title — split animation: slides left→right chars */}
        <motion.h3
          animate={{ color: hov ? "#ffffff" : BRAND }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(18px, 1.85vw, 26px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {title}
        </motion.h3>

        {/* Desc + stat — revealed on hover, with stagger */}
        <motion.div
          animate={{
            opacity: hov ? 1 : 0,
            y: hov ? 0 : 16,
          }}
          transition={{ duration: 0.4, delay: hov ? 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5,
            fontWeight: 300,
            lineHeight: 1.72,
            color: "rgba(255,255,255,0.65)",
            margin: "13px 0 0",
            maxWidth: "28ch",
          }}>
            {desc}
          </p>
        </motion.div>

        {/* Stat block */}
        <motion.div
          animate={{
            opacity: hov ? 1 : 0,
            y: hov ? 0 : 20,
          }}
          transition={{ duration: 0.4, delay: hov ? 0.16 : 0, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 20 }}
        >
          {/* Big stat */}
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 3.2vw, 44px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#ffffff",
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}>
            {stat}
            <span style={{ fontSize: "0.5em", fontStyle: "normal", marginLeft: 2, opacity: 0.75 }}>{statSuffix}</span>
          </span>

          {/* Stat label */}
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.38)",
            paddingBottom: 5,
          }}>
            {statLbl}
          </span>
        </motion.div>
      </div>
    </motion.article>
  );
};

/* ══════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════ */
const BrandPromises = () => {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      style={{ background: CREAM, paddingBottom: 0 }}
    >
      {/* ── Marquee ticker strip ── */}
      <Ticker />

      {/* ── Section header ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "clamp(40px,5vw,72px) clamp(20px,5vw,72px) clamp(28px,3vw,48px)",
        borderBottom: `1px solid ${RULE}`,
        gap: 24,
      }}>
        {/* Left: overline + heading */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            {/* Drawn rule */}
            <motion.span
              initial={{ width: 0 }}
              animate={isInView ? { width: 32 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "block", height: 1, background: MUTED }}
            />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9.5,
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: MUTED,
            }}>Our Commitment</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 3.5vw, 52px)",
            fontWeight: 500,
            color: BRAND,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            margin: 0,
          }}>
            Why choose
            <br />
            <em style={{ fontWeight: 700 }}>TechMart</em>
          </h2>
        </motion.div>

        {/* Right: editorial description + "04 promises" counter */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5,
            fontWeight: 300,
            color: MUTED,
            lineHeight: 1.7,
            maxWidth: "26ch",
            textAlign: "right",
            margin: 0,
            display: "none",  // hide on mobile, only shows on wider screens via lg
          }}
            className="hidden lg:block"
          >
            Every order backed by our four-pillar guarantee — from dispatch to doorstep.
          </p>

          {/* Counter badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            border: `1px solid ${RULE}`,
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 700,
              fontStyle: "italic",
              color: "rgba(26,17,8,0.08)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>04</span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 8.5,
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: MUTED,
            }}>Promises</span>
          </div>
        </motion.div>
      </div>

      {/* ── Desktop: 4-col ruled grid ── */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          borderBottom: `1px solid ${RULE}`,
        }}
      >
        {PROMISES.map((item, i) => (
          <PromiseCard key={i} item={item} index={i} isInView={isInView} />
        ))}
      </div>

      {/* ── Mobile Slider ── */}
      <div className="md:hidden relative" style={{ borderBottom: `1px solid ${RULE}` }}>
        {/* Navigation Arrows */}
        <div className="absolute top-[45%] -translate-y-[45%] left-3 right-3 flex justify-between pointer-events-none z-20 opacity-80">
          <button onClick={() => document.getElementById('bp-slider')?.scrollBy({ left: -320, behavior: 'smooth' })} className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/95 rounded-full border border-black/10 backdrop-blur-sm shadow-md active:scale-95 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1108" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button onClick={() => document.getElementById('bp-slider')?.scrollBy({ left: 320, behavior: 'smooth' })} className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/95 rounded-full border border-black/10 backdrop-blur-sm shadow-md active:scale-95 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1108" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>
        <div id="bp-slider" className="flex overflow-x-auto snap-x snap-mandatory pb-0 scroll-smooth" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          <style>{`#bp-slider::-webkit-scrollbar { display: none; }`}</style>
          {PROMISES.map((item, i) => (
            <div key={i} className="shrink-0 w-[88vw] snap-center">
              <div style={{ borderRight: `1px solid ${RULE}` }}>
                <PromiseCard item={item} index={i} isInView={isInView} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom footer row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(20px,5vw,72px)",
          borderTop: `1px solid ${RULE}`,
        }}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(26,17,8,0.22)",
        }}>
          TechMart — Delivered with care since 2026
        </span>

        {/* Animated dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[0, 1, 2, 3].map(i => (
            <motion.span
              key={i}
              animate={{ opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              style={{ width: 4, height: 4, borderRadius: "50%", background: BRAND, display: "block" }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BrandPromises;