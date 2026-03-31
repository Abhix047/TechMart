import { useRef, useState, useEffect } from "react";
import { getImg, BASE_URL } from "../../config";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

/* ─────────────────────────────────────────────────
   LIGHT THEME TOKENS
───────────────────────────────────────────────── */
const T = {
  bg: "#faf8f4",          // warm off-white
  bgDeep: "#f2ede4",          // slightly darker warm cream
  ink: "#1a1108",          // warm near-black
  inkMid: "rgba(26,17,8,0.45)",
  inkSoft: "rgba(26,17,8,0.28)",
  inkFaint: "rgba(26,17,8,0.08)",
  accent: "#1a1108",          // CTA button = ink
  border: "rgba(26,17,8,0.08)",
  borderMid: "rgba(26,17,8,0.13)",
};

/* ─── Animated number counter ── */
const Counter = ({ to, suffix = "", inView }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = to / 42;
    const t = setInterval(() => {
      v += step;
      if (v >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(v));
    }, 26);
    return () => clearInterval(t);
  }, [inView, to]);
  return <>{val.toLocaleString()}{suffix}</>;
};

/* ─── Stat ── */
const Stat = ({ value, suffix, label, delay, inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col gap-1.5"
  >
    <span
      className="leading-none"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(26px, 2.8vw, 40px)",
        fontWeight: 500,
        color: T.ink,
        letterSpacing: "-0.02em",
      }}
    >
      <Counter to={value} suffix={suffix} inView={inView} />
    </span>
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9,
        fontWeight: 400,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: T.inkSoft,
      }}
    >
      {label}
    </span>
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
const EditorialBanner = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const products = Array.isArray(res.data) ? res.data : [];
        const s26 = products.find(p => p.name.toLowerCase().includes("s26 ultra"));
        if (s26) setProduct(s26);
      })
      .catch(console.error);
  }, []);

  const handleNavigate = () => {
    if (product) {
      navigate(`/product/${product._id}`);
    } else {
      navigate("/featured");
    }
  };

  /* Dual-direction parallax */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  /* Cursor spotlight */
  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setCursor({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  /* Animation variants */
  const wrapV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
  };
  const lineReveal = {
    hidden: { y: "110%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(3px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={ref} className="px-4 sm:px-8 lg:px-14 xl:px-16 py-12 md:py-16">

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMouseMove}
        onClick={handleNavigate}
        className="relative overflow-hidden cursor-pointer"
        style={{
          background: T.bg,
          border: `1px solid ${T.borderMid}`,
          boxShadow: hovered
            ? `0 32px 80px rgba(26,17,8,0.12), 0 0 0 1px ${T.borderMid}`
            : `0 8px 40px rgba(26,17,8,0.07)`,
          transition: "box-shadow 0.5s ease",
        }}
      >

        {/* ── Cursor warm spotlight ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: hovered
              ? `radial-gradient(480px circle at ${cursor.x}% ${cursor.y}%, rgba(26,17,8,0.025) 0%, transparent 70%)`
              : "none",
          }}
          transition={{ duration: 0.12 }}
        />

        {/* ── Subtle grid pattern ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,17,8,1) 1px,transparent 1px),linear-gradient(90deg,rgba(26,17,8,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* ════════════════════════════════════════════
            SPLIT: LEFT text  |  RIGHT visual panel
        ════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row">

          {/* ── LEFT PANEL ── */}
          <motion.div
            className="relative z-10 flex flex-col flex-1"
            style={{
              padding: "clamp(44px,6.5vh,80px) clamp(24px,5vw,68px)",
              borderRight: `1px solid ${T.border}`,
              y: leftY,
            }}
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="flex items-center gap-3 mb-10"
            >
              <span className="block w-6 h-px" style={{ background: T.borderMid }} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9,
                  fontWeight: 400,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: T.inkSoft,
                }}
              >
                Editor's Selection
              </span>
            </motion.div>

            {/* Headline — theatrical line reveal */}
            <motion.div
              variants={wrapV}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="mb-8"
            >
              <div className="overflow-hidden mb-0.5">
                <motion.h2
                  variants={lineReveal}
                  className="m-0 leading-[0.94] truncate"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: product ? "clamp(34px, 4vw, 56px)" : "clamp(44px, 5.2vw, 76px)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: T.inkMid,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {product ? product.brand : "Technology,"}
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={lineReveal}
                  className="m-0 leading-[0.94] line-clamp-2 pr-6"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: product ? "clamp(34px, 4vw, 56px)" : "clamp(44px, 5.2vw, 76px)",
                    fontWeight: 600,
                    fontStyle: "normal",
                    color: T.ink,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {product ? product.name : "refined."}
                </motion.h2>
              </div>
            </motion.div>

            {/* Body */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="mb-10 leading-[1.85] line-clamp-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 300,
                color: T.inkMid,
                maxWidth: 360,
              }}
            >
              {product?.description || "Handpicked gear for those who demand more — precision-crafted peripherals and audio engineered for the modern workspace."}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-0 border-none cursor-pointer overflow-hidden"
                style={{ background: "transparent", padding: 0 }}
              >
                <div
                  className="relative flex items-center gap-3 overflow-hidden"
                  style={{ padding: "13px 28px", background: T.ink }}
                >
                  {/* Hover sweep */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: "-101%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: "#2d2015" }}
                  />
                  <span
                    className="relative z-10 whitespace-nowrap"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 500,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "white",
                    }}
                  >
                    {product ? "View Details" : "Explore Featured"}
                  </span>
                  <motion.div
                    className="relative z-10"
                    whileHover={{ x: 3, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight size={13} strokeWidth={1.8} className="text-white" />
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>

          </motion.div>

          {/* ── RIGHT PANEL ── */}
          <motion.div
            className="relative lg:w-[42%] flex flex-col justify-between overflow-hidden"
            style={{
              padding: "clamp(36px,5vh,64px) clamp(28px,4vw,56px)",
              background: T.bgDeep,
              borderLeft: `1px solid ${T.border}`,
              y: rightY,
            }}
          >

            {/* Top row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="flex items-center justify-between mb-6"
            >
              {/* "Live" badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  background: "white",
                  border: `1px solid ${T.border}`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#4a8c44" }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 8.5,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: T.inkSoft,
                  }}
                >
                  Now Available
                </span>
              </div>

              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 11,
                  fontWeight: 300,
                  color: T.inkFaint,
                  letterSpacing: "0.12em",
                }}
              >
                SS 2025
              </span>
            </motion.div>

            {/* Ghost letterform or Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.38, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex items-center justify-center py-6 select-none"
            >
              {product?.images?.length > 0 ? (
                <img
                  src={getImg(product.images[0])}
                  alt={product.name}
                  className="w-full max-w-[500px] lg:scale-110 object-contain drop-shadow-2xl mix-blend-multiply transition-transform"
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(88px, 13vw, 160px)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "transparent",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.88,
                    WebkitTextStroke: `1px ${T.inkFaint}`,
                  }}
                >
                  TM
                </span>
              )}
            </motion.div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 mt-auto"
              style={{
                borderTop: `1px solid ${T.border}`,
                paddingTop: 22,
                gap: "clamp(10px, 2.5vw, 28px)",
              }}
            >
              <Stat value={50} suffix="k+" label="Customers" delay={0.48} inView={isInView} />
              <Stat value={1200} suffix="+" label="Products" delay={0.6} inView={isInView} />
              <Stat value={4} suffix=".9★" label="Rating" delay={0.72} inView={isInView} />
            </div>

          </motion.div>
        </div>

        {/* ── Bottom ticker ── */}
        <div
          className="overflow-hidden"
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: "11px 0",
            background: T.bgDeep,
          }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            {[0, 1].map((r) => (
              <div key={r} className="flex items-center">
                {["Premium Peripherals", "Curated Audio", "Workspace Essentials", "Editor's Picks", "Free Delivery on ₹999+", "2 Year Warranty"].map((t, i) => (
                  <span key={i} className="flex items-center">
                    <span
                      className="px-8"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 9.5,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: T.inkSoft,
                      }}
                    >
                      {t}
                    </span>
                    <span style={{ color: T.inkFaint, fontSize: 7 }}>◆</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Top-right corner arrow ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="absolute top-4 right-4 flex items-center justify-center"
          style={{
            width: 32, height: 32,
            border: `1px solid ${T.border}`,
            background: "white",
          }}
        >
          <ArrowUpRight size={13} strokeWidth={1.5} style={{ color: T.inkSoft }} />
        </motion.div>

      </motion.div>
    </section>
  );
};

export default EditorialBanner;n