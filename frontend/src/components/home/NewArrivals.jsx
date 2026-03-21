import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("na-lux-fonts")) {
  const l = document.createElement("link");
  l.id = "na-lux-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Tenor+Sans&display=swap";
  document.head.appendChild(l);
}

/* ── Fetch ── */
async function fetchLatestProducts() {
  const res  = await API.get("/products");
  const json = res.data;
  const raw  = Array.isArray(json) ? json : (json.data ?? json.products ?? json.items ?? []);
  return raw
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)
    .map((p) => {
      let img = null;
      if (p.images?.length > 0) {
        img = p.images[0].startsWith("http") ? p.images[0] : `${BASE_URL}${p.images[0]}`;
      } else if (p.image || p.imageUrl) {
        const f = p.image || p.imageUrl;
        img = f.startsWith("http") ? f : `${BASE_URL}${f}`;
      }
      return {
        id:       p.id       ?? p._id,
        name:     p.name     ?? p.title ?? "—",
        category: p.category ?? p.categoryName ?? p.brand ?? p.type ?? "—",
        price:    Number(p.price ?? p.sellingPrice ?? 0),
        image:    img,
      };
    });
}

const SWATCHES = ["bg-[#d8d3cc]", "bg-[#cdd4db]", "bg-[#d2d6d0]"];

/* ── CharReveal ── */
function CharReveal({ text, italic, delay = 0, inView, className = "" }) {
  return (
    <span
      aria-label={text}
      className={`inline-flex font-[family-name:'Cormorant_Garamond',serif] font-light leading-none ${
        italic ? "italic tracking-wide" : "tracking-tight"
      } ${className}`}
    >
      {text.split("").map((ch, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block whitespace-pre"
            initial={{ y: "115%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: delay + i * 0.032, ease: [0.22, 1, 0.36, 1] }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── ProductCard ── */
function ProductCard({ item, index, inView, onClick }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const animDelay = index * 0.18;

  return (
    <div
      className="flex-1 min-w-0 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Smooth Elegant Entry */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 55, filter: "blur(4px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 55, filter: "blur(4px)" }}
        transition={{
          duration: 0.9,
          delay: animDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Image */}
        <div className={`relative overflow-hidden aspect-[3/4] ${SWATCHES[index % 3]}`}>

          {/* Index number */}
          <motion.span
            className="absolute top-3.5 left-4 z-10 select-none font-[family-name:'Tenor_Sans',sans-serif] text-[10px] tracking-[0.12em] text-white/70"
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Photo */}
          {item.image ? (
            <motion.img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply"
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <motion.div
              className="absolute inset-0 w-full h-full mix-blend-multiply"
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {/* Top scrim */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-transparent" />

          {/* Dark overlay on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none bg-black"
            initial={false}
            animate={{ opacity: hovered ? 0.38 : 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />

          {/* Price + arrow */}
          <motion.div
            className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4 pt-10"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-[family-name:'Tenor_Sans',sans-serif] text-[12px] tracking-[0.05em] text-white">
              ₹{item.price.toLocaleString("en-IN")}
            </span>
            <motion.span
              className="inline-flex"
              animate={{ rotate: hovered ? 0 : -22 }}
              transition={{ duration: 0.28 }}
            >
              <ArrowUpRight size={14} className="text-white/90" />
            </motion.span>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          className="pt-4 pl-0.5"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: animDelay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-[family-name:'Tenor_Sans',sans-serif] text-[9px] tracking-[0.28em] uppercase text-black/30 mb-1.5">
            {item.category}
          </p>

          <div className="overflow-hidden">
            <motion.p
              className="font-[family-name:'Cormorant_Garamond',serif] font-light text-[clamp(18px,1.9vw,22px)] text-[#0a0a0a] leading-snug tracking-[0.01em] m-0"
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.6, delay: animDelay + 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.name}
            </motion.p>
          </div>

          {/* Underline wipe */}
          <motion.div
            className="h-px bg-black/[0.13] mt-2 origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonGrid() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="flex-1 min-w-0"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        >
          <div className="aspect-[3/4] bg-[#eceae7]" />
          <div className="h-1.5 w-[30%] bg-[#eceae7] mt-4 mb-2.5" />
          <div className="h-4 w-[70%] bg-[#eceae7]" />
        </motion.div>
      ))}
    </>
  );
}

/* ── Main ── */
const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [status, setStatus]     = useState("loading");

  const sectionRef   = useRef(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "0px 0px -80px 0px" });
  const cardsInView  = useInView(sectionRef, { once: true, margin: "0px 0px -40px 0px" });

  useEffect(() => {
    fetchLatestProducts()
      .then((d) => { setProducts(d); setStatus(d.length ? "ok" : "empty"); })
      .catch(() => { setProducts([]); setStatus("error"); });
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-20 px-5 sm:px-10 lg:px-16 xl:px-[72px] overflow-hidden">

      {/* Header */}
      <div className="text-center mb-14">

        {/* Eyebrow */}
        <motion.p
          className="font-[family-name:'Tenor_Sans',sans-serif] text-[9px] tracking-[0.34em] uppercase text-black/30 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Just Landed
        </motion.p>

        {/* Heading */}
        <h2
          aria-label="New Arrivals"
          className="flex justify-center gap-[0.24em] items-baseline flex-wrap mb-5 text-[clamp(36px,5vw,58px)]"
        >
          <CharReveal text="New"      italic={false} delay={0.04} inView={headerInView} className="text-[#0a0a0a]" />
          <CharReveal text="Arrivals" italic={true}  delay={0.22} inView={headerInView} className="text-[#0a0a0a]" />
        </h2>

        {/* Subtitle */}
        <div className="overflow-hidden">
          <motion.p
            className="font-[family-name:'Cormorant_Garamond',serif] font-light italic text-[clamp(15px,1.5vw,18px)] text-black/40 tracking-[0.01em] leading-relaxed m-0"
            initial={{ y: "100%", opacity: 0 }}
            animate={headerInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            The latest additions to our curated collection.
          </motion.p>
        </div>

        {/* Center rule */}
        <motion.div
          className="w-9 h-px bg-black/15 mx-auto mt-5 origin-center"
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Cards */}
      <div className="flex gap-3.5 md:gap-5 lg:gap-6 items-start">
        <AnimatePresence mode="wait">
          {status === "loading"
            ? <SkeletonGrid key="sk" />
            : products.map((item, i) => (
                <ProductCard
                  key={item.id ?? i}
                  item={item}
                  index={i}
                  inView={cardsInView}
                  onClick={() => navigate(`/products/${item.id}`)}
                />
              ))}
        </AnimatePresence>
      </div>

      {/* View All */}
      <motion.div
        className="flex justify-center mt-11"
        initial={{ opacity: 0, y: 10 }}
        animate={cardsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 bg-transparent border border-black/[0.18] px-7 py-2.5 font-[family-name:'Tenor_Sans',sans-serif] text-[9.5px] tracking-[0.26em] uppercase text-black/45 cursor-pointer"
          whileHover={{ borderColor: "rgba(10,10,10,0.42)", color: "rgba(10,10,10,0.88)", scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.22 }}
        >
          View All
          <ArrowUpRight size={11} className="opacity-55" />
        </motion.button>
      </motion.div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default NewArrivals;