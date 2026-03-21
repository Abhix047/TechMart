import { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Label } from "./utils";

/* ══════════════════════════════════════════════════
   COLLECTIONS DATA
══════════════════════════════════════════════════ */
const COLLECTIONS = [
  {
    key: "audio",
    title: "Audio & Sound",
    sub: "Premium Collection",
    tag: "01",
    path: "/products?category=Audio",
    photo: "https://i.pinimg.com/736x/c6/33/1b/c6331b53803351e18e55e8825448a085.jpg",
  },
  {
    key: "workspace",
    title: "Workspace Setup",
    sub: "Productivity Refined",
    tag: "02",
    path: "/products?category=workspace",
    photo: "https://i.pinimg.com/736x/47/a9/02/47a902c4e91973d4fe6e188ff7a90ed4.jpg",
  },
  {
    key: "mobile",
    title: "Mobile Essentials",
    sub: "New Season",
    tag: "03",
    path: "/products?category=Smartphones",
    photo: "https://i.pinimg.com/736x/55/71/05/5571051a06f4f2ec8109dcea5eb74902.jpg",
  },
  {
    key: "gaming",
    title: "Gaming Gear",
    sub: "Next Level",
    tag: "04",
    path: "/products?category=Gaming",
    photo: "https://i.pinimg.com/736x/24/7d/62/247d629d93d532ae6f17f2a573396f1c.jpg",
  },
  {
    key: "display",
    title: "Displays & TV",
    sub: "Visual Mastery",
    tag: "05",
    path: "/products?category=Laptops",
    photo: "https://i.pinimg.com/1200x/1e/07/df/1e07df67b477213b775883f903d4d022.jpg",
  },
  {
    key: "accessories",
    title: "Smart Accessories",
    sub: "Essential Upgrades",
    tag: "06",
    path: "/products?category=accessories",
    photo: "https://i.pinimg.com/1200x/00/22/a9/0022a9eb283ba672c92cdc2db32de556.jpg",
  },
];

/* ══════════════════════════════════════════════════
   CUSTOM MAGNETIC CURSOR
   — follows mouse inside the grid section
══════════════════════════════════════════════════ */
const MagCursor = ({ hoveredCard }) => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <AnimatePresence>
      {hoveredCard && (
        <motion.div
          className="fixed top-0 left-0 z-[999] pointer-events-none flex items-center justify-center"
          style={{
            x: springX, y: springY,
            translateX: "-50%", translateY: "-50%",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="w-20 h-20 rounded-full flex flex-col items-center justify-center gap-0.5"
            style={{ background: "#1a1108" }}
          >
            <ArrowUpRight size={16} strokeWidth={1.5} className="text-white" />
            <span
              className="text-white/70 leading-none"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              View
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════
   COLLECTION CARD
   Animation: curtain wipe reveal on entry,
   hover: ink flood from bottom + text slide up
══════════════════════════════════════════════════ */
const CollectionCard = ({ collection, index, size, onHover }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hov, setHov] = useState(false);

  const isTall = size === "tall";

  const handleEnter = () => { setHov(true); onHover(collection.key); };
  const handleLeave = () => { setHov(false); onHover(null); };

  return (
    <motion.article
      ref={ref}
      className="flex flex-col cursor-none select-none"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => navigate(collection.path)}
      style={{ willChange: "transform" }}
    >
      {/* ════════════════
          IMAGE WRAPPER
      ════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: isTall ? "3/4.1" : "4/4.6" }}
      >

        {/* ── Entry curtain wipe — cream panel slides up to reveal photo ── */}
        <motion.div
          className="absolute inset-0 z-10 origin-bottom"
          initial={{ scaleY: 1 }}
          animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
          transition={{
            duration: 0.9,
            delay: index * 0.1,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{ background: "#faf8f4", transformOrigin: "top" }}
        />

        {/* ── Photo ── */}
        <motion.img
          src={collection.photo}
          alt={collection.title}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.12 }}
          animate={inView ? { scale: hov ? 1.08 : 1.0 } : { scale: 1.12 }}
          transition={{
            scale: hov
              ? { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
              : { duration: 1.1, delay: index * 0.1 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
        />

        {/* ── Always-present bottom vignette ── */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hov ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          style={{ background: "linear-gradient(to top, rgba(10,8,5,0.38) 0%, transparent 55%)" }}
        />

        {/* ── Hover: ink flood from bottom ── */}
        <motion.div
          className="absolute inset-0 origin-bottom"
          animate={{ scaleY: hov ? 1 : 0, opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(to top, rgba(10,8,5,0.72) 0%, rgba(10,8,5,0.18) 60%, transparent 100%)",
            transformOrigin: "bottom",
          }}
        />

        {/* ── Number tag — top left ── */}
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {collection.tag}
          </span>
        </motion.div>

        {/* ── Hover content: subtitle + title + arrow ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 flex flex-col gap-2">

          {/* Sub label — slides up on hover */}
          <motion.span
            animate={hov
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 12, filter: "blur(3px)" }
            }
            transition={{ duration: 0.35, delay: hov ? 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              fontWeight: 400,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {collection.sub}
          </motion.span>

          {/* Main title — slides up with slight delay */}
          <div className="overflow-hidden">
            <motion.h3
              className="m-0 leading-[1.05]"
              animate={hov
                ? { y: 0, opacity: 1 }
                : { y: "102%", opacity: 1 }
              }
              transition={{ duration: 0.48, delay: hov ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(20px, 2.2vw, 30px)",
                fontWeight: 500,
                color: "white",
                letterSpacing: "-0.01em",
              }}
            >
              {collection.title}
            </motion.h3>
          </div>

          {/* Arrow line — draws in on hover */}
          <motion.div
            className="flex items-center gap-2 overflow-hidden"
            animate={hov
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 8 }
            }
            transition={{ duration: 0.32, delay: hov ? 0.22 : 0 }}
          >
            <motion.span
              className="block h-px bg-white/40"
              animate={{ width: hov ? 24 : 0 }}
              transition={{ duration: 0.35, delay: hov ? 0.28 : 0 }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Shop Now
            </span>
          </motion.div>

        </div>

      </div>

      {/* ════════════════
          LABEL BELOW
      ════════════════ */}
      <div className="overflow-hidden pt-4 pb-0.5">
        <motion.div
          className="flex items-center justify-between"
          initial={{ y: 16, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            animate={{ color: hov ? "#1a1108" : "rgba(26,17,8,0.5)", x: hov ? 3 : 0 }}
            transition={{ duration: 0.22 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {collection.title}
          </motion.p>
          <motion.span
            animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 10,
              color: "rgba(26,17,8,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            {collection.tag}
          </motion.span>
        </motion.div>

        {/* Underline draws in on hover */}
        <motion.span
          className="block h-px mt-2"
          animate={{ width: hov ? "100%" : "0%", background: "#1a1108" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.article>
  );
};

/* ══════════════════════════════════════════════════
   MAIN — CollectionsGrid
══════════════════════════════════════════════════ */
const CollectionsGrid = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hovKey, setHovKey] = useState(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.25], [28, 0]);
  const headerO = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <>
      {/* Custom cursor */}
      <MagCursor hoveredCard={hovKey} />

      <section
        ref={sectionRef}
        className="px-5 sm:px-10 lg:px-16 xl:px-[72px] pb-16 md:pb-24"
      >

        {/* ── Header ── */}
        <motion.div
          style={{ y: headerY, opacity: headerO }}
          className="mb-10 md:mb-16 flex items-end justify-between"
        >
          <div>
            <Label>Shop by Category</Label>
            <h2
              className="text-[#1a1108] leading-[1.05] mt-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px,3.5vw,48px)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Our Collections
            </h2>
          </div>
          <motion.button
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden sm:flex items-center gap-2 bg-transparent border-none cursor-pointer group"
          >
            <span
              className="group-hover:text-[#1a1108] transition-colors duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(26,17,8,0.38)",
              }}
            >
              View All
            </span>
            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="text-[#1a1108]/30 group-hover:text-[#1a1108]/70 transition-colors"
            />
          </motion.button>
        </motion.div>

        {/* ══ Desktop — staggered 3-col masonry ══ */}
        <div className="hidden lg:grid grid-cols-3 gap-5 xl:gap-7 items-start">
          {/* Left — pt-14 */}
          <div className="flex flex-col gap-5 pt-14">
            {[0, 3].map((i) => (
              <CollectionCard
                key={COLLECTIONS[i].key}
                collection={COLLECTIONS[i]}
                index={i}
                size="normal"
                onHover={setHovKey}
              />
            ))}
          </div>
          {/* Center — tall, no offset */}
          <div className="flex flex-col gap-5">
            {[2, 5].map((i) => (
              <CollectionCard
                key={COLLECTIONS[i].key}
                collection={COLLECTIONS[i]}
                index={i}
                size="tall"
                onHover={setHovKey}
              />
            ))}
          </div>
          {/* Right — pb-14 */}
          <div className="flex flex-col gap-5 pb-14">
            {[1, 4].map((i) => (
              <CollectionCard
                key={COLLECTIONS[i].key}
                collection={COLLECTIONS[i]}
                index={i}
                size="normal"
                onHover={setHovKey}
              />
            ))}
          </div>
        </div>

        {/* ══ Tablet — 2-col ══ */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-5">
          {COLLECTIONS.map((c, i) => (
            <CollectionCard key={c.key} collection={c} index={i} size="normal" onHover={setHovKey} />
          ))}
        </div>

        {/* ══ Mobile — 1-col ══ */}
        <div className="sm:hidden flex flex-col gap-6">
          {COLLECTIONS.map((c, i) => (
            <CollectionCard key={c.key} collection={c} index={i} size="normal" onHover={setHovKey} />
          ))}
        </div>

        {/* ── Shop All ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center mt-16"
        >
          <motion.button
            onClick={() => navigate("/products")}
            className="group relative flex items-center gap-3 border-none cursor-pointer overflow-hidden"
            style={{ background: "transparent", padding: 0 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className="relative flex items-center gap-3 overflow-hidden px-10 py-4"
              style={{ border: "1px solid rgba(26,17,8,0.16)" }}
            >
              {/* Fill sweep */}
              <motion.div
                className="absolute inset-0 bg-[#1a1108]"
                initial={{ x: "-101%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
              <span
                className="relative z-10 group-hover:text-white transition-colors duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10.5,
                  fontWeight: 500,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "#1a1108",
                }}
              >
                Shop All Categories
              </span>
              <motion.div
                className="relative z-10 group-hover:text-white transition-colors duration-200"
                whileHover={{ x: 3, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight size={13} strokeWidth={1.8} className="text-[#1a1108] group-hover:text-white transition-colors duration-200" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

      </section>
    </>
  );
};

export default CollectionsGrid;