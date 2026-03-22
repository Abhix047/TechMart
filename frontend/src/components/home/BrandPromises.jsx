import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, RotateCcw, Truck, Zap } from "lucide-react";

const PROMISES = [
  {
    Icon: Truck,
    num: "01",
    title: "Free Delivery",
    desc: "On all orders above ₹999, delivered to your doorstep with care.",
    stat: "₹999+",
    statLbl: "Min. Order",
  },
  {
    Icon: RotateCcw,
    num: "02",
    title: "Easy Returns",
    desc: "Changed your mind? Return hassle-free within 7 days, no questions asked.",
    stat: "7",
    statLbl: "Day Window",
  },
  {
    Icon: Shield,
    num: "03",
    title: "1 Year Warranty",
    desc: "Every product is backed by a comprehensive 1-year manufacturer warranty.",
    stat: "1 Yr",
    statLbl: "Coverage",
  },
  {
    Icon: Zap,
    num: "04",
    title: "Fast Dispatch",
    desc: "Orders placed before 2 PM are dispatched the same day, every day.",
    stat: "2hr",
    statLbl: "Express",
  },
];

/*
  Premium hover color:
  Warm parchment gold — #c9a96e background
  feels luxurious, editorial, not garish
*/
const HOV_BG = "#0f1923";   // deep midnight
const HOV_DARK = "#1a2d3d";   // slightly lighter for gradient depth

/* ─── Single card ─────────────────────────────── */
const PromiseCard = ({ item, index, isInView }) => {
  const [hov, setHov] = useState(false);
  const { Icon, num, title, desc, stat, statLbl } = item;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex flex-col overflow-hidden"
      style={{
        padding: "clamp(28px,3.2vw,42px) clamp(22px,2.8vw,36px)",
        borderTop: "1px solid rgba(26,17,8,0.1)",
        cursor: "pointer",
        minHeight: "clamp(220px,24vw,300px)",
      }}
    >

      {/* ── Hover background — warm gold flood from bottom ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ scaleY: hov ? 1 : 0 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(135deg, ${HOV_DARK} 0%, ${HOV_BG} 100%)`,
          transformOrigin: "bottom",
        }}
      />

      {/* ── Subtle grain on hover ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hov ? 0.06 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />

      {/* ── "Hover to explore" hint — visible only when NOT hovering ── */}
      <motion.div
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5"
        animate={{ opacity: hov ? 0 : 0.35, x: hov ? 4 : 0 }}
        transition={{ duration: 0.28 }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 8.5,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(26,17,8,0.5)",
          }}
        >
          Hover
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="rgba(26,17,8,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* ── Top-right "Explore" arrow — appears on hover ── */}
      <motion.div
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5"
        animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "4px 10px",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 8.5,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Explore
        </span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* ── TOP ROW: number + icon ── */}
      <div className="relative z-10 flex items-start justify-between mb-auto">

        {/* Ghost number */}
        <motion.span
          animate={{
            color: hov ? "rgba(255,255,255,0.18)" : "rgba(26,17,8,0.07)",
          }}
          transition={{ duration: 0.38 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(44px,5.5vw,72px)",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            userSelect: "none",
          }}
        >
          {num}
        </motion.span>

        {/* Icon */}
        <motion.div
          animate={{
            background: hov ? "rgba(255,255,255,0.18)" : "rgba(26,17,8,0.05)",
            borderColor: hov ? "rgba(255,255,255,0.25)" : "rgba(26,17,8,0.1)",
          }}
          transition={{ duration: 0.38 }}
          className="flex items-center justify-center shrink-0 mt-1"
          style={{ width: 44, height: 44, border: "1px solid rgba(26,17,8,0.1)" }}
        >
          <motion.div
            animate={{ rotate: hov ? 12 : 0, scale: hov ? 1.12 : 1 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon
              size={18}
              strokeWidth={1.4}
              style={{
                color: hov ? "rgba(255,255,255,0.9)" : "#1a1108",
                transition: "color 0.35s",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── DIVIDER LINE — always visible, color changes ── */}
      <div className="relative z-10 my-5 overflow-hidden h-px">
        <motion.span
          className="block h-full absolute left-0 top-0"
          animate={{
            width: isInView ? "100%" : "0%",
            background: hov ? "rgba(255,255,255,0.3)" : "rgba(26,17,8,0.1)",
          }}
          transition={{
            width: { duration: 0.7, delay: index * 0.11 + 0.28, ease: [0.22, 1, 0.36, 1] },
            background: { duration: 0.38 },
          }}
        />
      </div>

      {/* ── TITLE — always visible ── */}
      <motion.h3
        animate={{ color: hov ? "white" : "#1a1108" }}
        transition={{ duration: 0.35 }}
        className="relative z-10 m-0 leading-[1.1]"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(18px,1.9vw,26px)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </motion.h3>

      {/* ── DESC — hidden by default, slides up on hover ── */}
      <motion.p
        animate={{
          opacity: hov ? 1 : 0,
          y: hov ? 0 : 12,
          filter: hov ? "blur(0px)" : "blur(2px)",
        }}
        transition={{ duration: 0.38, delay: hov ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 m-0 mt-3 leading-[1.75]"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12.5,
          fontWeight: 300,
          color: "rgba(255,255,255,0.72)",
          maxWidth: "30ch",
        }}
      >
        {desc}
      </motion.p>

      {/* ── STAT — hidden by default, appears on hover ── */}
      <motion.div
        animate={{
          opacity: hov ? 1 : 0,
          y: hov ? 0 : 14,
        }}
        transition={{ duration: 0.35, delay: hov ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-baseline gap-2 mt-5"
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px,2.8vw,36px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "white",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {stat}
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {statLbl}
        </span>
      </motion.div>

    </motion.div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
const BrandPromises = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="px-5 sm:px-10 lg:px-16 xl:px-[72px] py-14 md:py-20"
    >

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9.5,
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(26,17,8,0.32)",
            }}
          >
            Our Promise
          </span>
          <h2
            className="m-0 mt-2 leading-[1.05]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px,3vw,42px)",
              fontWeight: 500,
              color: "#1a1108",
              letterSpacing: "-0.01em",
            }}
          >
            Why TechMart
          </h2>
        </div>

        {/* Ghost decorative number */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(52px,7vw,88px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "rgba(26,17,8,0.04)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            userSelect: "none",
          }}
        >
          04
        </motion.span>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map((item, i) => (
          <PromiseCard key={i} item={item} index={i} isInView={isInView} />
        ))}
      </div>

      {/* Bottom border draw */}
      <div className="relative overflow-hidden h-px">
        <motion.span
          className="block h-full absolute left-0 top-0 bg-[#1a1108]/10"
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

    </section>
  );
};

export default BrandPromises;