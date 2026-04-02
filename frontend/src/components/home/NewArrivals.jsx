import { useState, useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getImg } from "../../config";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("na-v3-fonts")) {
  const l = document.createElement("link");
  l.id = "na-v3-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400&display=swap";
  document.head.appendChild(l);
}

/* ── Fetch ── */
async function fetchLatestProducts() {
  const res = await API.get("/products");
  const json = res.data;
  const raw = Array.isArray(json) ? json : (json.data ?? json.products ?? json.items ?? []);
  return raw
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6)
    .map((p) => {
      let img = null;
      let rawImagePath = null;
      if (p.images?.length > 0) rawImagePath = p.images[0];
      else if (p.image) rawImagePath = p.image;
      else if (p.imageUrl) rawImagePath = p.imageUrl;
      if (rawImagePath) img = getImg(rawImagePath);
      return {
        id: p.id ?? p._id,
        name: p.name ?? p.title ?? "—",
        category: p.category ?? p.categoryName ?? p.brand ?? p.type ?? "—",
        price: Number(p.price ?? p.sellingPrice ?? 0),
        image: img,
      };
    });
}

/* ── Marquee hook ── */
function useMarquee(speed = 0.45, paused = false) {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useAnimationFrame((_, delta) => {
    if (paused || isInteracting || !trackRef.current) return;
    const half = trackRef.current.scrollWidth / 2;
    const next = x.get() - speed * (delta / 16.67);
    x.set(Math.abs(next) >= half ? 0 : next);
  });

  return { x, trackRef, setIsInteracting };
}

/* ── Uniform Card Sizes ── */
const CONFIGS = [
  { topPct: "10%", w: 240, h: 320 },
];

/* ── Single marquee card ── */
function MarqueeItem({ item, config, isClone, cardIndex, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // clip-path wipe-up entry — only animate the first set, not clones
      initial={isClone ? false : { clipPath: "inset(100% 0 0 0)", opacity: 0, y: 16 }}
      animate={isClone ? {} : { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: isClone ? 0 : 0.12 + cardIndex * 0.13,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="shrink-0 mr-12 cursor-pointer"
      style={{ paddingTop: config.topPct }}
    >
      {/* Image frame — white bg with animated subtle shadow and lift */}
      <motion.div
        className="relative overflow-hidden bg-white border border-black/5 rounded-sm"
        animate={{ 
          y: hovered ? -12 : 0,
          boxShadow: hovered 
            ? "0 30px 60px -15px rgba(0,0,0,0.12), 0 10px 20px -5px rgba(0,0,0,0.04)" 
            : "0 15px 40px -10px rgba(0,0,0,0.05)"
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: config.w, height: config.h }}
      >
        {/* Animated Glossy Shine Swoop */}
        <motion.div 
          initial={{ x: "-150%", skewX: -25 }}
          animate={{ x: hovered ? "250%" : "-150%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-30"
        />

        {item.image ? (
          <motion.img
            src={item.image}
            alt={item.name}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-contain p-4 block mix-blend-multiply relative z-10"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-['Outfit',sans-serif] text-[9px] tracking-[0.22em] uppercase text-black/20 relative z-10">
            {item.name}
          </div>
        )}

        {/* Subtle dark gradient overlay mostly at bottom for contrast */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-t from-black/[0.08] to-transparent pointer-events-none z-20"
        />

        {/* Modern Circular Arrow Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 15, y: 15 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5, x: hovered ? 0 : 15, y: hovered ? 0 : 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-[#0a0a0a] flex items-center justify-center shadow-lg border border-black/10 z-30 pointer-events-none"
        >
          <ArrowUpRight size={22} className="text-white" strokeWidth={1.5} />
        </motion.div>

        {/* Inset border so cards feel framed */}
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none z-40" />
      </motion.div>

      {/* Label below */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? -4 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 pl-1"
      >
        <p
          className="font-['Playfair_Display',serif] font-medium text-[14px] text-[#0a0a0a] tracking-[0.01em] mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ maxWidth: config.w }}
        >
          {item.name}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-['Outfit',sans-serif] font-medium text-[9px] tracking-[0.2em] uppercase text-black/40">
            {item.category}
          </span>
          <span className="font-['Playfair_Display',serif] italic font-medium text-[12px] text-black/60">
            ₹{item.price.toLocaleString("en-IN")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Skeleton ── */
function Skeletons() {
  return (
    <>
      {CONFIGS.map((cfg, i) => (
        <motion.div
          key={i}
          className="shrink-0 mr-12 opacity-10"
          style={{ paddingTop: cfg.topPct }}
          animate={{ opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.13 }}
        >
          <div className="bg-black/10" style={{ width: cfg.w, height: cfg.h }} />
          <div className="h-[13px] w-[62%] bg-black/10 mt-3" />
          <div className="h-[9px] w-[42%] bg-black/10 mt-2" />
        </motion.div>
      ))}
    </>
  );
}

/* ── Main ── */
const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const { x: marqueeX, trackRef, setIsInteracting } = useMarquee(0.44);
  const { x: tickerX, trackRef: tickerRef } = useMarquee(0.68);

  const scroll = (dir) => {
    setIsInteracting(true);
    const currentX = marqueeX.get();
    const targetX = currentX + (dir * 450);
    
    animate(marqueeX, targetX, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      restDelta: 0.001,
      onComplete: () => {
        // Only resume if mouse isn't already inside (optional logic)
      }
    });
  };

  useEffect(() => {
    fetchLatestProducts()
      .then((d) => { setProducts(d); setStatus(d.length ? "ok" : "empty"); })
      .catch(() => { setProducts([]); setStatus("error"); });
  }, []);

  const items = status === "ok" ? products : [];

  return (
    <section className="bg-[#faf9f8] overflow-hidden flex flex-col pt-12 md:pt-0">
      {/* ── TOP ── */}
      <div className="flex items-start min-h-[520px]">

        {/* Left fixed heading */}
        <div className="shrink-0 w-[clamp(200px,26vw,320px)] p-[clamp(48px,7vh,80px)_24px_40px_clamp(28px,5vw,64px)] z-10 relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Outfit',sans-serif] font-medium text-[9px] tracking-[0.42em] uppercase text-black/30 mb-5"
          >
            Just Landed
          </motion.p>

          <div className="overflow-hidden mb-6">
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-['Playfair_Display',serif] font-light text-[clamp(42px,5vw,72px)] leading-[1.02] tracking-[-0.01em] text-[#0a0a0a] m-0"
            >
              New
              <br />
              <em className="italic text-black/40">Arrivals</em>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="font-['Outfit',sans-serif] font-medium text-[clamp(11px,1vw,13px)] leading-[1.8] text-black/50 max-w-[200px] mb-8"
          >
            The latest additions to our curated collection of premium tech accessories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col gap-2 mb-10"
          >
            {[
              { text: "Observe the quality.", italic: false },
              { text: "Touch the details.", italic: true, bright: true },
              { text: "See what's new.", italic: false },
            ].map((item, i) => (
              <p
                key={i}
                className={`text-[11px] m-0 ${item.italic ? "font-['Playfair_Display',serif] italic font-medium" : "font-['Outfit',sans-serif] not-italic font-medium"} ${item.bright ? "text-black/80" : "text-black/40"}`}
              >
                {item.text}
              </p>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52 }}
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-transparent border border-black/15 py-3 px-6 font-['Outfit',sans-serif] font-medium text-[9px] tracking-[0.3em] uppercase text-black/60 cursor-pointer transition-colors duration-300 hover:border-black/60 hover:text-black"
          >
            View All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
          </motion.button>
        </div>

        {/* Scrolling strip with manual controls */}
        <div 
          className="flex-1 overflow-hidden relative group/na"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          {/* Navigation Arrows - Side Centered */}
          <button 
            onClick={() => scroll(1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-black/5 bg-white/40 backdrop-blur-md opacity-0 group-hover/na:opacity-100 group-hover/na:translate-x-0 -translate-x-4 transition-all duration-300 z-30 cursor-pointer text-black hover:bg-black hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll(-1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-black/5 bg-white/40 backdrop-blur-md opacity-0 group-hover/na:opacity-100 group-hover/na:translate-x-0 translate-x-4 transition-all duration-300 z-30 cursor-pointer text-black hover:bg-black hover:text-white"
          >
            <ChevronRight size={20} />
          </button>

          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -10000, right: 10000 }}
            dragElastic={0.1}
            dragTransition={{ power: 0.2, timeConstant: 300 }}
            onDragStart={() => setIsInteracting(true)}
            onDragEnd={() => {
              // No-op for now, interaction handled by mouseenter/leave
            }}
            style={{ x: marqueeX }}
            className="flex items-start cursor-grab active:cursor-grabbing will-change-transform pt-10 pb-8 px-20"
          >
            {status === "loading" ? (
              <Skeletons />
            ) : (
              // Render twice for seamless loop
              [0, 1].map((loop) =>
                items.map((item, i) => (
                  <MarqueeItem
                    key={`${loop}-${item.id ?? i}`}
                    item={item}
                    config={CONFIGS[i % CONFIGS.length]}
                    isClone={loop === 1}
                    cardIndex={i}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                ))
              )
            )}
          </motion.div>

          {/* Left edge fade - Light theme fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#faf9f8] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="overflow-hidden border-t border-black/10">
        <motion.div
          ref={tickerRef}
          style={{ x: tickerX }}
          className="flex items-baseline whitespace-nowrap will-change-transform mt-2 mb-2"
        >
          {[0, 1].map((loop) => (
            <span key={loop} className="flex items-baseline">
              {[
                { text: "New", italic: false },
                { text: "arrivals", italic: true },
                { text: "·", dot: true },
                { text: "Just", italic: false },
                { text: "landed", italic: true },
                { text: "·", dot: true },
              ].map((w, wi) =>
                w.dot ? (
                  <span
                    key={wi}
                    className="text-[clamp(20px,3vw,32px)] text-black/15 pr-2 self-center"
                  >
                    ·
                  </span>
                ) : (
                  <span
                    key={wi}
                    className={`font-['Playfair_Display',serif] font-light text-[clamp(64px,10vw,112px)] tracking-[-0.025em] leading-[0.96] ${w.italic ? "italic text-black/15 pr-2" : "not-italic text-[#0a0a0a] pr-1"}`}
                  >
                    {w.text}
                  </span>
                )
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NewArrivals;