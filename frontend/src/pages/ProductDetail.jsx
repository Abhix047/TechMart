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
} from "framer-motion";
import {
  CheckCircle2, X, ChevronRight, Heart,
  ShoppingBag, Zap, Shield, Truck, RotateCcw, Minus, Plus, Lock,
} from "lucide-react";
import { getImg } from "../config";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("pd-fonts")) {
  const l = document.createElement("link");
  l.id = "pd-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
            ? "bg-white text-emerald-700 border-emerald-100"
            : "bg-white text-red-600 border-red-100"
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

/* ── Thumbnail ── */
function Thumb({ img, active, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-[68px] h-[68px] shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#f5f3f0] ${active ? "border-[#0f0f0f] shadow-sm" : "border-transparent hover:border-black/20"
        }`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.93 }}
    >
      <img src={getImg(img)} alt="" className="w-full h-full object-contain mix-blend-multiply p-1.5" />
    </motion.button>
  );
}

/* ── Accordion ── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-black/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f] tracking-wide"
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xl text-black/40 font-light"
        >+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/52 leading-[1.8]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Related Card ── */
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
      className="min-w-[190px] max-w-[190px] shrink-0 cursor-pointer"
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
          animate={{ opacity: hovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium text-black/30 uppercase tracking-[0.12em] mb-1">
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
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { fetchCartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  useEffect(() => {
    if (selectedColor?.image && product?.images) {
      const idx = product.images.findIndex(img => img === selectedColor.image);
      if (idx !== -1) setActiveImg(idx);
    }
  }, [selectedColor, product?.images]);

  const handleAddToCart = async () => {
    setIsProcessing(true);
    try {
      const activeUser = await refreshUser(true);
      if (!activeUser) { showToast("error", "Please login first."); setIsAuthModalOpen(true); return; }
      await API.post("/cart", {
        productId: product._id, quantity: qty,
        selectedColor: selectedColor ? { name: selectedColor.name, hex: selectedColor.hex } : undefined,
        selectedStorage: selectedStorage ? { size: selectedStorage.size, priceAdd: selectedStorage.priceAdd } : undefined,
      });
      setAdded(true);
      showToast("success", "Added to cart!");
      fetchCartCount();
      setTimeout(() => setAdded(false), 2200);
    } catch (error) {
      if (error?.response?.status === 401) { showToast("error", "Please login first."); setIsAuthModalOpen(true); }
      else showToast("error", "Failed to add to cart.");
    } finally { setIsProcessing(false); }
  };

  const handleBuyNow = async () => {
    setIsProcessing(true);
    try {
      const activeUser = await refreshUser(true);
      if (!activeUser) { showToast("error", "Please login first."); setIsAuthModalOpen(true); return; }
      
      // Directly navigate to checkout passing the single item in the state
      navigate("/checkout", {
        state: {
          buyNowItem: {
            product: product,
            quantity: qty,
            selectedColor: selectedColor ? { name: selectedColor.name, hex: selectedColor.hex } : undefined,
            selectedStorage: selectedStorage ? { size: selectedStorage.size, priceAdd: selectedStorage.priceAdd } : undefined,
          }
        }
      });
    } catch (error) {
      if (error?.response?.status === 401) { showToast("error", "Please login first."); setIsAuthModalOpen(true); }
      else showToast("error", "Failed to process.");
    } finally { setIsProcessing(false); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <motion.div
        className="w-7 h-7 border-2 border-black/8 border-t-black/50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  /* ── Not found ── */
  if (!product) return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center gap-5">
      <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[28px] text-black/28">Product not found.</p>
      <button onClick={() => navigate("/")} className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold px-6 py-2.5 bg-[#0f0f0f] text-white rounded-full hover:bg-black/80 transition-colors">
        Return to Shop
      </button>
    </div>
  );

  const p = product;
  const variantAdd = selectedStorage?.priceAdd || 0;
  const sellPrice = (p.discountPrice || p.price || 0) + variantAdd;
  const mrpPrice = (p.price || 0) + variantAdd;
  const inStock = p.countInStock > 0;
  const discount = mrpPrice > sellPrice ? Math.round(((mrpPrice - sellPrice) / mrpPrice) * 100) : 0;

  // Parse description bullets (split by newline or period for display)
  const descLines = p.description
    ? p.description.split(/\n/).filter(l => l.trim().length > 0)
    : [];

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#0f0f0f] pb-24">
      <Toast message={toast} />

      {/* ── Breadcrumb ── */}
      <motion.div
        className="border-b border-black/6 sticky top-[56px] z-30 bg-[#f7f5f2]/90 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      >
        <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-16 py-3 flex items-center gap-1.5">
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

      {/* ══════════════════════════════════
          MAIN: 2-column layout
          LEFT = Gallery  |  RIGHT = Info + Buy
      ══════════════════════════════════ */}
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-16 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-20 items-start relative">

          {/* ═══════════ LEFT: Gallery ═══════════ */}
          <div className="lg:sticky lg:top-[120px] self-start flex gap-4 z-20 w-full max-w-[520px] xl:max-w-[580px] mx-auto">

            {/* Vertical Thumbnails */}
            {p.images?.length > 1 && (
              <div className="flex flex-col gap-2.5 pt-1">
                {p.images.map((img, i) => (
                  <Thumb key={i} img={img} active={activeImg === i} index={i} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}

            {/* Main Image */}
            <motion.div
              className="relative flex-1 overflow-hidden bg-[#eeeae4] rounded-2xl"
              style={{ aspectRatio: "1/1" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-black/8 flex items-center justify-center shadow-sm"
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <motion.div animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.35 }}>
                  <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black/32"} />
                </motion.div>
              </motion.button>

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={getImg(p.images?.[activeImg])}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-10"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: imgHovered ? 1.05 : 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    opacity: { duration: 0.3, ease: "easeInOut" },
                    scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  }}
                />
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ═══════════ RIGHT: Info + Buy ═══════════ */}
          <motion.div
            className="flex flex-col gap-0"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* ── Brand + Title + Stars ── */}
            <motion.div variants={itemVariants} className="mb-5">
              {p.brand && (
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.22em] text-black/32 mb-2">
                  {p.brand}
                </p>
              )}
              <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(28px,3.8vw,44px)] font-semibold text-[#0f0f0f] leading-[1.05] mb-4">
                {p.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`text-[14px] ${s <= Math.round(p.rating || 0) ? "text-amber-400" : "text-black/15"}`}>★</span>
                  ))}
                </div>
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/40 underline underline-offset-2 cursor-pointer hover:text-black/65 transition-colors">
                  {p.numReviews || 0} customer reviews
                </span>
                <span className={`font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </motion.div>

            {/* ── Description as bullet points ── */}


            {/* ── Variants: Color ── */}
            {p.colors?.length > 0 && (
              <motion.div variants={itemVariants} className="mb-5">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.16em] text-black/38 mb-3">
                  Color — <span className="text-[#0f0f0f] normal-case tracking-normal font-medium">
                    {typeof selectedColor === "string" ? selectedColor : selectedColor?.name}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {p.colors.map((c) => {
                    const colorString = typeof c === "string" ? c : c.name;
                    const colorHex = typeof c === "string" ? c.toLowerCase().replace(/\s+/g, "") : c.hex;
                    const isSelected = (typeof selectedColor === "string" ? selectedColor : selectedColor?.name) === colorString;
                    return (
                      <motion.button
                        key={colorString}
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: colorHex }}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${isSelected ? "border-[#0f0f0f] shadow-md scale-110" : "border-black/10 hover:scale-105"}`}
                        title={colorString}
                        whileTap={{ scale: 0.92 }}
                      >
                        <span className="sr-only">{colorString}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Variants: Storage/Bundle selector ── */}
            {p.storageOptions?.length > 0 && (
              <motion.div variants={itemVariants} className="mb-6">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.16em] text-black/38 mb-3">
                  Choose Your Plan
                </p>
                <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                  {p.storageOptions.map((opt) => {
                    const isSelected = selectedStorage?.size === opt.size;
                    return (
                      <motion.button
                        key={opt.size}
                        onClick={() => setSelectedStorage(opt)}
                        className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? "border-[#0f0f0f] bg-white shadow-sm"
                          : "border-black/8 bg-white/60 hover:border-black/20"
                          }`}
                        whileTap={{ scale: 0.97 }}
                      >
                        {/* Radio dot */}
                        <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-[#0f0f0f]" : "border-black/20"}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f]" />}
                          </div>
                        </div>
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-black/38 uppercase tracking-wide">
                          {opt.size}
                        </span>
                        {opt.ram && (
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] text-black/28">{opt.ram}</span>
                        )}
                        {opt.priceAdd !== undefined && (
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold text-[#0f0f0f]">
                            {opt.priceAdd === 0 ? "Base" : `+₹${opt.priceAdd.toLocaleString("en-IN")}`}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Price + Qty + CTA ── */}
            <motion.div variants={itemVariants} className="border border-black/8 rounded-2xl bg-white p-5 mb-6 shadow-[0_2px_20px_rgba(0,0,0,0.05)]">

              {/* Price row */}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-1">
                    Price
                  </p>
                  <motion.div
                    key={sellPrice * qty}
                    className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(32px,4vw,44px)] font-semibold text-[#0f0f0f] leading-none"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    ₹{(sellPrice * qty).toLocaleString("en-IN")}
                  </motion.div>
                  {mrpPrice > sellPrice && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/25 line-through">
                        ₹{(mrpPrice * qty).toLocaleString("en-IN")}
                      </span>
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                        Save {discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-1.5 mb-1">
                  <motion.span
                    className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-400"}`}
                    animate={inStock ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className={`font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}>
                    {inStock ? `${p.countInStock} left` : "Out of stock"}
                  </span>
                </div>
              </div>

              <div className="h-px bg-black/6 mb-4" />

              {/* Qty + CTA row */}
              {inStock && (
                <div className="flex items-center gap-3 mb-3">
                  {/* Qty */}
                  <div className="flex items-center border border-black/10 rounded-xl overflow-hidden bg-[#fafaf9] shrink-0">
                    <motion.button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black/70 hover:bg-black/5 transition-colors border-r border-black/8"
                      whileTap={{ scale: 0.88 }}
                    >
                      <Minus size={13} />
                    </motion.button>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={qty}
                        className="w-10 text-center font-[family-name:'DM_Sans',sans-serif] text-[14px] font-semibold text-[#0f0f0f]"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {qty}
                      </motion.span>
                    </AnimatePresence>
                    <motion.button
                      onClick={() => setQty(Math.min(p.countInStock, qty + 1))}
                      className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black/70 hover:bg-black/5 transition-colors border-l border-black/8"
                      whileTap={{ scale: 0.88 }}
                    >
                      <Plus size={13} />
                    </motion.button>
                  </div>

                  {/* Add to Cart */}
                  <motion.button
                    disabled={isProcessing}
                    onClick={handleAddToCart}
                    className={`flex-1 h-10 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-300 ${added
                      ? "bg-emerald-500 text-white"
                      : "bg-[#f0ede8] text-[#0f0f0f] hover:bg-[#e6e2db]"
                      }`}
                    whileTap={{ scale: 0.98 }}
                    animate={added ? { scale: [1, 1.02, 1] } : {}}
                  >
                    {isProcessing ? (
                      <motion.span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                    ) : added ? (
                      <motion.span className="flex items-center gap-2"
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <CheckCircle2 size={14} /> Added
                      </motion.span>
                    ) : (
                      <><ShoppingBag size={14} /> Add to Cart</>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Buy Now — full width */}
              <motion.button
                disabled={!inStock || isProcessing}
                onClick={handleBuyNow}
                className={`w-full py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-colors duration-200 ${inStock && !isProcessing
                  ? "bg-[#0f0f0f] text-white hover:bg-black/82"
                  : "bg-black/5 text-black/22 cursor-not-allowed"
                  }`}
                whileTap={inStock ? { scale: 0.98 } : {}}
              >
                <Zap size={13} />
                {isProcessing ? "Processing…" : "Checkout Now"}
              </motion.button>

              {/* Secure note */}
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] text-black/22 text-center mt-3 leading-relaxed">
                Secure checkout · Free shipping · Easy returns
              </p>
            </motion.div>

            {/* ── Trust badges: horizontal row ── */}
            <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2 mb-6">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: RotateCcw, label: "Easy Returns" },
                { icon: Shield, label: "2 Yr Warranty" },
                { icon: Zap, label: "Fast Shipping" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 bg-white border border-black/6 rounded-xl py-3 px-2">
                  <Icon size={14} className="text-black/32 shrink-0" />
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium text-black/40 text-center leading-tight">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* ── Specs tab ── */}
            {p.specifications?.length > 0 && (
              <motion.div variants={itemVariants} className="mb-4">
                <div className="flex gap-5 border-b border-black/8 mb-4">
                  {["description", "specs"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative pb-3 font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-semibold uppercase tracking-[0.13em] transition-colors ${activeTab === tab ? "text-[#0f0f0f]" : "text-black/30 hover:text-black/55"
                        }`}
                    >
                      {tab === "specs" ? "Specifications" : "Overview"}
                      {activeTab === tab && (
                        <motion.span
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f0f0f] rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "description" ? (
                    <motion.div key="desc"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-light text-black/52 leading-[1.9] whitespace-pre-line"
                    >
                      {p.description || "Product description unavailable."}
                    </motion.div>
                  ) : (
                    <motion.div key="specs"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border border-black/8 rounded-2xl overflow-hidden"
                    >
                      {p.specifications.map((spec, i) => {
                        const key = spec.title || spec.key || spec.name || spec.label || "Feature";
                        const val = spec.value || spec.val || "N/A";
                        return (
                          <div key={i} className={`flex text-[12.5px] border-b border-black/6 last:border-none ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]"}`}>
                            <div className="w-[40%] px-5 py-3 font-[family-name:'DM_Sans',sans-serif] font-medium text-black/38 border-r border-black/6">{key}</div>
                            <div className="w-[60%] px-5 py-3 font-[family-name:'DM_Sans',sans-serif] font-medium text-[#0f0f0f]">{val}</div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── Accordions ── */}
            <motion.div variants={itemVariants}>
              <Accordion title="Related Recipes" defaultOpen>
                Discover the advantages of natural supplements. Explore combinations that work best with this product for enhanced results and overall well-being.
              </Accordion>
              <Accordion title="Quality Standards">
                This product is manufactured in a certified facility ensuring highest quality. Every batch is tested for purity, stability, and potency before dispatch.
              </Accordion>
              <Accordion title="Shipping & Returns">
                Free shipping on orders above ₹999. Easy 7-day return policy — no questions asked. Express delivery available at checkout.
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-16 mt-20 border-t border-black/6 pt-12">
          <motion.div
            className="flex items-end justify-between mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-2">Explore More</p>
              <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(22px,3vw,32px)] font-semibold text-[#0f0f0f] leading-tight">
                You Might Also <em className="font-[500] italic">Like</em>
              </h2>
            </div>
            <button onClick={() => navigate("/products")} className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/35 hover:text-black/65 transition-colors flex items-center gap-1">
              View All <ChevronRight size={13} />
            </button>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {relatedProducts.map((item, i) => (
              <RelatedCard key={item._id} item={item} index={i} onClick={() => navigate(`/product/${item._id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Reviews ── */}
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-16 mt-16 border-t border-black/6 pt-12 pb-10">
        <ReviewSection productId={id} />
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}