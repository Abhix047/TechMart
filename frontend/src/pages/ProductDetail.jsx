import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import AuthModal from "../controller/AuthModal.jsx";
import ReviewSection from "../components/review/ReviewSection.jsx";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform
} from "framer-motion";
import {
  CheckCircle2, X, ChevronRight, Heart,
  ShoppingBag, Zap, Shield, Truck, RotateCcw,
  ArrowRight
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("pd-fonts")) {
  const l = document.createElement("link");
  l.id = "pd-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const getImg = (img) => (!img ? "" : img.startsWith("http") ? img : `${BASE_URL}${img}`);

/* ─────────────────────────────────────────────
   Stagger container variants — children animate
   in sequence with no manual delay on each
───────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Toast ── */
function Toast({ message }) {
  return (
    <AnimatePresence>
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed bottom-8 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium ${message.type === "success"
              ? "bg-white text-emerald-700 border-emerald-100 shadow-emerald-100/50"
              : "bg-white text-red-600 border-red-100 shadow-red-100/50"
            }`}
        >
          {message.type === "success"
            ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            : <X size={16} className="text-red-500 shrink-0" />}
          {message.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Thumbnail button ── */
function Thumb({ img, active, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#f5f3f0] ${active ? "border-[#0f0f0f] shadow-md" : "border-transparent hover:border-black/18"
        }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.94 }}
    >
      <img src={getImg(img)} alt="" className="w-full h-full object-contain mix-blend-multiply p-2" />
    </motion.button>
  );
}

/* ── Related card ── */
function RelatedCard({ item, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px -20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-[210px] max-w-[210px] shrink-0 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-[#f5f3f0] rounded-xl aspect-square mb-3">
        {item.images?.[0] && (
          <motion.img
            src={getImg(item.images[0])} alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: hovered ? 0.18 : 0 }}
          transition={{ duration: 0.35 }}
        />
      </div>
      <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium text-black/32 uppercase tracking-[0.12em] mb-1">
        {item.brand || item.category}
      </p>
      <h4 className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] leading-snug line-clamp-2 mb-1.5">
        {item.name}
      </h4>
      <span className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f]">
        ₹{(item.discountPrice || item.price).toLocaleString("en-IN")}
      </span>
    </motion.div>
  );
}

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const buyBoxRef = useRef(null);
  const buyBoxInView = useInView(buyBoxRef, { margin: "-100px 0px 0px 0px" });
  const { fetchCartCount } = useCart();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState({ type: "", text: "" });
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product._id) : false;

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 3000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data?.colors?.length > 0) setSelectedColor(data.colors[0]);
        if (data?.storageOptions?.length > 0) setSelectedStorage(data.storageOptions[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    const loadRelated = async () => {
      try {
        const { data } = await API.get("/products");
        if (data) setRelatedProducts(data.filter(p => p._id !== id).slice(0, 10));
      } catch (e) { console.error(e); }
    };
    load(); loadRelated();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { showToast("error", "Please login first."); setIsAuthModalOpen(true); return; }
    setIsProcessing(true);
    try {
      await API.post("/cart", { productId: product._id, quantity: qty });
      setAdded(true);
      showToast("success", "Added to cart!");
      fetchCartCount();
      setTimeout(() => setAdded(false), 2200);
    } catch { showToast("error", "Failed to add to cart."); }
    finally { setIsProcessing(false); }
  };

  const handleBuyNow = async () => {
    if (!user) { showToast("error", "Please login first."); setIsAuthModalOpen(true); return; }
    setIsProcessing(true);
    try {
      await API.post("/cart", { productId: product._id, quantity: qty });
      fetchCartCount();
      navigate("/checkout");
    } catch { showToast("error", "Failed to process."); setIsProcessing(false); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        className="w-7 h-7 border-2 border-black/8 border-t-black/50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  /* ── Not found ── */
  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5">
      <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[28px] text-black/28">
        Product not found.
      </p>
      <button
        onClick={() => navigate("/")}
        className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold px-6 py-2.5 bg-[#0f0f0f] text-white rounded-full hover:bg-black/80 transition-colors"
      >
        Return to Shop
      </button>
    </div>
  );

  const p = product;
  const variantAdd = selectedStorage?.priceAdd || 0;
  const sellPrice = (p.discountPrice || p.price || 0) + variantAdd;
  const mrpPrice = (p.price || 0) + variantAdd;
  const inStock = p.countInStock > 0;
  const discount = mrpPrice > sellPrice
    ? Math.round(((mrpPrice - sellPrice) / mrpPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white text-[#0f0f0f] pb-24">

      <Toast message={toast} />

      {/* ── Breadcrumb ── */}
      <motion.div
        className="border-b border-black/6 sticky top-[56px] z-30 bg-white/96 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-3.5 flex items-center gap-1.5">
          <button onClick={() => navigate("/")} className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/35 hover:text-black/65 transition-colors">Home</button>
          <ChevronRight size={11} className="text-black/18" />
          {p.category && (
            <>
              <button onClick={() => navigate(`/products?category=${p.category}`)} className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/35 hover:text-black/65 transition-colors">{p.category}</button>
              <ChevronRight size={11} className="text-black/18" />
            </>
          )}
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-[#0f0f0f] truncate max-w-[200px] sm:max-w-none">{p.name}</span>
        </div>
      </motion.div>

      {/* ── Main grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_340px] gap-10 xl:gap-14 items-start">

          {/* ══════════════════
              LEFT: Gallery
              Bigger image — 5:6 ratio
          ══════════════════ */}
          <div className="lg:sticky lg:top-[106px] flex flex-col gap-3">

            {/* Main image — larger 5:6 aspect */}
            <motion.div
              className="relative overflow-hidden bg-[#f5f3f0] rounded-2xl"
              style={{ aspectRatio: "5/6" }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              {/* Discount badge */}
              {discount > 0 && (
                <motion.span
                  className="absolute top-4 left-4 z-10 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold px-3 py-1.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  -{discount}%
                </motion.span>
              )}

              {/* Wishlist */}
              <motion.button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white border border-black/8 flex items-center justify-center shadow-sm"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              >
                <motion.div
                  animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black/32"} />
                </motion.div>
              </motion.button>

              {/* Image — smooth cross-fade + hover zoom */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={getImg(p.images?.[activeImg])}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-8"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    scale: imgHovered ? 1.06 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    opacity: { duration: 0.3, ease: "easeInOut" },
                    scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            {p.images?.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
                {p.images.map((img, i) => (
                  <Thumb key={i} img={img} active={activeImg === i} index={i} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}

            {/* Trust badges */}
            <motion.div
              className="grid grid-cols-2 gap-2 mt-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: RotateCcw, label: "Easy Returns" },
                { icon: Shield, label: "2 Year Warranty" },
                { icon: Zap, label: "Fast Shipping" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-[#f8f7f5] rounded-xl px-3 py-2.5">
                  <Icon size={12} className="text-black/35 shrink-0" />
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/45">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══════════════════
              MIDDLE: Info
              Staggered entry
          ══════════════════ */}
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Brand + Name + Rating */}
            <motion.div variants={itemVariants}>
              {p.brand && (
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35 mb-2">
                  {p.brand}
                </p>
              )}
              <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(26px,3.5vw,40px)] font-semibold text-[#0f0f0f] leading-[1.1] mb-4">
                {p.name}{selectedStorage?.size ? ` · ${selectedStorage.size}` : ""}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#0f0f0f] text-white px-3 py-1.5 rounded-lg">
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold">{p.rating || "—"}</span>
                  <span className="text-amber-400 text-[11px]">★</span>
                </div>
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/38 cursor-pointer hover:text-black/65 transition-colors">
                  {p.numReviews || 0} reviews
                </span>
                <span className={`font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="h-px bg-black/6" />

            {/* Variants */}
            {(p.colors?.length > 0 || p.storageOptions?.length > 0) && (
              <motion.div variants={itemVariants} className="flex flex-col gap-5">
                {/* Colors */}
                {p.colors?.length > 0 && (
                  <div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.14em] text-black/38 mb-3">
                      Color — <span className="text-[#0f0f0f] normal-case tracking-normal font-medium">{typeof selectedColor === 'string' ? selectedColor : selectedColor?.name}</span>
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {p.colors.map((c) => {
                        const colorString = typeof c === 'string' ? c : c.name;
                        const isSelected = selectedColor === colorString || selectedColor?.name === colorString;
                        // Attempt to map to CSS color names
                        const bgValue = typeof c === 'string' ? c.toLowerCase().replace(/\s+/g, '') : c.hex;

                        return (
                          <motion.button
                            key={colorString}
                            onClick={() => setSelectedColor(colorString)}
                            style={{ backgroundColor: bgValue }}
                            className={`w-9 h-9 rounded-full border-2 transition-all ${isSelected ? "border-[#0f0f0f] shadow-md scale-110" : "border-black/10 hover:scale-105"} ${bgValue === 'white' ? 'border-gray-200' : ''}`}
                            title={colorString}
                            whileTap={{ scale: 0.92 }}
                          >
                            <span className="sr-only">{colorString}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Storage */}
                {p.storageOptions?.length > 0 && (
                  <div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.14em] text-black/38 mb-3">
                      Storage
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.storageOptions.map((opt) => (
                        <motion.button
                          key={opt.size}
                          onClick={() => setSelectedStorage(opt)}
                          className={`px-4 py-2 border rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium transition-all ${selectedStorage?.size === opt.size
                              ? "border-[#0f0f0f] bg-[#0f0f0f] text-white"
                              : "border-black/10 text-black/52 hover:border-black/28"
                            }`}
                          whileTap={{ scale: 0.96 }}
                        >
                          {opt.size}
                          {opt.ram && <span className="ml-1.5 text-[10px] opacity-55">({opt.ram})</span>}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="h-px bg-black/6" />

            {/* Tabs */}
            <motion.div variants={itemVariants}>
              <div className="flex gap-6 border-b border-black/8 mb-5">
                {["description", "specs"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-3 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.13em] transition-colors ${activeTab === tab ? "text-[#0f0f0f]" : "text-black/32 hover:text-black/58"
                      }`}
                  >
                    {tab === "specs" ? "Specifications" : "Overview"}
                    {activeTab === tab && (
                      <motion.span
                        layoutId="tab-line"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f0f0f] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "description" ? (
                  <motion.p
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-light text-black/52 leading-[1.9] whitespace-pre-line min-h-[180px]"
                  >
                    {p.description || "Product description unavailable."}
                  </motion.p>
                ) : (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-black/8 rounded-2xl overflow-hidden min-h-[180px]"
                  >
                    {p.specifications?.length > 0 ? (
                      p.specifications.map((spec, i) => {
                        const key = spec.title || spec.key || spec.name || spec.label || "Feature";
                        const val = spec.value || spec.val || "N/A";
                        return (
                          <div key={i} className={`flex text-[12.5px] border-b border-black/6 last:border-none ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]"}`}>
                            <div className="w-[40%] px-5 py-3.5 font-[family-name:'DM_Sans',sans-serif] font-medium text-black/38 border-r border-black/6">{key}</div>
                            <div className="w-[60%] px-5 py-3.5 font-[family-name:'DM_Sans',sans-serif] font-medium text-[#0f0f0f]">{val}</div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="p-6 font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/32">Specifications not available.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* ══════════════════
              RIGHT: Buy Box
          ══════════════════ */}
          <motion.div
            ref={buyBoxRef}
            className="lg:sticky lg:top-[106px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">

              {/* Price */}
              <div className="mb-5">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1.5">
                  Price
                </p>
                <motion.div
                  key={sellPrice * qty}
                  className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,42px)] font-semibold text-[#0f0f0f] leading-none mb-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  ₹{(sellPrice * qty).toLocaleString("en-IN")}
                </motion.div>
                {mrpPrice > sellPrice && (
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/25 line-through">
                      ₹{(mrpPrice * qty).toLocaleString("en-IN")}
                    </span>
                    <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                      Save {discount}%
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-black/6 mb-4" />

              {/* Stock */}
              <div className="flex items-center gap-2 mb-4">
                <motion.span
                  className={`w-2 h-2 rounded-full shrink-0 ${inStock ? "bg-emerald-500" : "bg-red-400"}`}
                  animate={inStock ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className={`font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}>
                  {inStock ? `${p.countInStock} units available` : "Out of stock"}
                </span>
              </div>

              {/* Qty */}
              {inStock && (
                <div className="mb-5">
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-2.5">Quantity</p>
                  <div className="flex items-center border border-black/10 rounded-xl w-max overflow-hidden bg-[#fafaf9]">
                    <motion.button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-11 h-11 flex items-center justify-center text-[18px] text-black/38 hover:text-black/68 hover:bg-black/5 transition-colors border-r border-black/8"
                      whileTap={{ scale: 0.9 }}
                    >−</motion.button>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={qty}
                        className="w-11 text-center font-[family-name:'DM_Sans',sans-serif] text-[14px] font-semibold text-[#0f0f0f]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        {qty}
                      </motion.span>
                    </AnimatePresence>
                    <motion.button
                      onClick={() => setQty(Math.min(p.countInStock, qty + 1))}
                      className="w-11 h-11 flex items-center justify-center text-[18px] text-black/38 hover:text-black/68 hover:bg-black/5 transition-colors border-l border-black/8"
                      whileTap={{ scale: 0.9 }}
                    >+</motion.button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2.5 mb-5">
                {/* Add to Cart */}
                <motion.button
                  disabled={!inStock || isProcessing}
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.13em] flex items-center justify-center gap-2 transition-colors duration-300 ${!inStock || isProcessing
                      ? "bg-black/5 text-black/22 cursor-not-allowed"
                      : added
                        ? "bg-emerald-500 text-white"
                        : "bg-[#f0eeeb] text-[#0f0f0f] hover:bg-[#e8e5e0]"
                    }`}
                  whileTap={inStock ? { scale: 0.98 } : {}}
                  animate={added ? { scale: [1, 1.02, 1] } : {}}
                  transition={added ? { duration: 0.3 } : {}}
                >
                  {isProcessing ? (
                    <motion.span
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    />
                  ) : added ? (
                    <motion.span
                      className="flex items-center gap-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <CheckCircle2 size={15} /> Added to Cart
                    </motion.span>
                  ) : (
                    <><ShoppingBag size={15} /> Add to Cart</>
                  )}
                </motion.button>

                {/* Buy Now */}
                <motion.button
                  disabled={!inStock || isProcessing}
                  onClick={handleBuyNow}
                  className={`w-full py-3.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.13em] flex items-center justify-center gap-2 transition-colors duration-200 ${inStock && !isProcessing
                      ? "bg-[#0f0f0f] text-white hover:bg-black/82"
                      : "bg-black/5 text-black/22 cursor-not-allowed"
                    }`}
                  whileTap={inStock ? { scale: 0.98 } : {}}
                >
                  <Zap size={14} />
                  {isProcessing ? "Processing…" : "Buy Now"}
                </motion.button>
              </div>

              {/* Secure note */}
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/25 text-center leading-relaxed border-t border-black/6 pt-4">
                Secure checkout · Free shipping · Sold by{" "}
                <span className="font-semibold text-black/45">Tech Mart</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mt-20 border-t border-black/6 pt-14">
          <motion.div
            className="flex items-end justify-between mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-2">
                Explore More
              </p>
              <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(24px,3vw,34px)] font-semibold text-[#0f0f0f] leading-tight">
                You Might Also <em className="font-[500] italic">Like</em>
              </h2>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/35 hover:text-black/65 transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={13} />
            </button>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {relatedProducts.map((item, i) => (
              <RelatedCard
                key={item._id}
                item={item}
                index={i}
                onClick={() => navigate(`/product/${item._id}`)}
              />
            ))}
          </div>
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mt-20 border-t border-black/6 pt-14">
            <ReviewSection productId={id} />
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}