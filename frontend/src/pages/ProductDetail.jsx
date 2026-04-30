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
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 xl:gap-20 items-start relative">

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
            className="flex flex-col gap-0 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="bg-[#fdfdfc] rounded-[20px] p-5 sm:p-6 shadow-[0_2px_30px_rgba(0,0,0,0.02)] border border-black/[0.04]">
              {/* Brand */}
              {p.brand && (
                <p className="font-[family-name:'Outfit',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.2em] text-black/40 mb-1.5">
                  {p.brand}
                </p>
              )}
              {/* Title */}
              <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(24px,2.8vw,36px)] font-semibold text-[#111010] leading-[1.05] mb-2.5">
                {p.name}
              </h1>

              {/* Reviews & Stock */}
              <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`text-[12px] ${s <= Math.round(p.rating || 0) ? "text-[#111010]" : "text-black/10"}`}>★</span>
                    ))}
                  </div>
                  <span className="font-[family-name:'Outfit',sans-serif] text-[10px] text-black/50">
                    {p.numReviews || 0} Reviews
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="font-[family-name:'Outfit',sans-serif] text-[9px] text-black/40 uppercase tracking-widest">Availability:</span>
                  <span className={`font-[family-name:'Outfit',sans-serif] text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${inStock ? "bg-[#111010] text-[#f7e3c1]" : "bg-red-50 text-red-500"}`}>
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                {mrpPrice > sellPrice && (
                  <span className="font-[family-name:'Outfit',sans-serif] text-[12.5px] text-black/30 line-through block mb-1">
                    ₹{(mrpPrice).toLocaleString("en-IN")}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <motion.div
                    key={sellPrice}
                    className="font-[family-name:'Outfit',sans-serif] text-[clamp(32px,3vw,42px)] font-semibold text-[#111010] leading-none"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  >
                    ₹{(sellPrice).toLocaleString("en-IN")}
                  </motion.div>
                </div>
              </div>

              {/* Short Description */}
              <p className="font-[family-name:'Outfit',sans-serif] text-[12px] text-black/50 leading-[1.6] mb-4 line-clamp-3">
                {p.description || "Premium quality product designed for excellence."}
              </p>

              {/* SKU */}
              <p className="font-[family-name:'Outfit',sans-serif] text-[10.5px] text-black/40 mb-5 uppercase tracking-widest">
                <strong className="text-[#111010] font-semibold">SKU:</strong> {p._id.slice(-8).toUpperCase()}
              </p>

              <div className="h-px bg-black/5 mb-5" />

              {/* Selectors Row (Color/Storage + Qty) */}
              <div className="flex flex-wrap items-end gap-4 mb-5">
                {/* Color Selector */}
                {p.colors?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="font-[family-name:'Outfit',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.15em] text-[#111010]">Color</span>
                    <div className="flex items-center gap-1.5">
                      {p.colors.map((c) => {
                        const colorString = typeof c === "string" ? c : c.name;
                        const colorHex = typeof c === "string" ? c.toLowerCase().replace(/\s+/g, "") : c.hex;
                        const isSelected = (typeof selectedColor === "string" ? selectedColor : selectedColor?.name) === colorString;
                        return (
                          <button
                            key={colorString}
                            onClick={() => setSelectedColor(c)}
                            style={{ backgroundColor: colorHex }}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${isSelected ? "border-[#111010] shadow-md scale-110" : "border-black/10 hover:scale-105"}`}
                            title={colorString}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Storage Selector (if applicable) */}
                {p.storageOptions?.length > 0 && (
                  <div className="flex flex-col gap-2">
                     <span className="font-[family-name:'Outfit',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.15em] text-[#111010]">Size</span>
                     <div className="flex items-center gap-1.5">
                       <select 
                         className="h-9 px-3 rounded-full border border-black/10 bg-white font-[family-name:'Outfit',sans-serif] text-[11px] text-[#111010] outline-none hover:border-black/30 transition-colors cursor-pointer"
                         value={selectedStorage?.size || ""}
                         onChange={(e) => setSelectedStorage(p.storageOptions.find(o => o.size === e.target.value))}
                       >
                         {p.storageOptions.map(opt => (
                           <option key={opt.size} value={opt.size}>{opt.size} {opt.priceAdd ? `(+₹${opt.priceAdd})` : ''}</option>
                         ))}
                       </select>
                     </div>
                  </div>
                )}

                {/* Qty Selector */}
                <div className="flex flex-col gap-2 ml-auto sm:ml-0">
                  <span className="font-[family-name:'Outfit',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.15em] text-transparent select-none hidden sm:block">Qty</span>
                  <div className="flex items-center border border-black/10 rounded-full overflow-hidden bg-white h-9 w-[95px]">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 h-full flex items-center justify-center text-black/40 hover:text-[#111010] hover:bg-black/5 transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="w-7 text-center font-[family-name:'Outfit',sans-serif] text-[11.5px] font-semibold text-[#111010]">
                      {qty}
                    </span>
                    <button onClick={() => setQty(Math.min(p.countInStock, qty + 1))} className="flex-1 h-full flex items-center justify-center text-black/40 hover:text-[#111010] hover:bg-black/5 transition-colors">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {/* Big Add to Cart */}
                <motion.button
                  disabled={!inStock || isProcessing}
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[160px] h-11 rounded-full font-[family-name:'Outfit',sans-serif] text-[11px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-300 ${!inStock ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : (added
                    ? "bg-emerald-500 text-white shadow-[0_6px_15px_rgba(16,185,129,0.2)]"
                    : "bg-[#111010] text-white shadow-[0_4px_15px_rgba(17,16,16,0.15)] hover:bg-[#222] hover:-translate-y-0.5"
                    )}`}
                  whileTap={inStock ? { scale: 0.98 } : {}}
                >
                  {isProcessing ? (
                    <motion.span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                  ) : added ? (
                    <><CheckCircle2 size={14} /> Added</>
                  ) : (
                    <><ShoppingBag size={14} /> Add to Cart</>
                  )}
                </motion.button>

                {/* Wishlist */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-black/10 bg-white hover:border-[#111010] transition-colors"
                  title="Wishlist"
                >
                  <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-[#111010]"} />
                </button>
              </div>

              {/* Buy Now Button */}
              {inStock && (
                 <motion.button
                   disabled={isProcessing}
                   onClick={handleBuyNow}
                   className="w-full h-10 rounded-full border border-black/15 text-[#111010] font-[family-name:'Outfit',sans-serif] text-[10.5px] font-bold uppercase tracking-[0.15em] flex items-center justify-center hover:bg-black/5 transition-all duration-300"
                   whileTap={{ scale: 0.98 }}
                 >
                   Buy It Now
                 </motion.button>
              )}

            </div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2 mt-6">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: RotateCcw, label: "Easy Returns" },
                { icon: Shield, label: "2 Yr Warranty" },
                { icon: Lock, label: "Secure Pay" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-4 px-2 bg-[#fcfcfb] rounded-[16px] border border-black/[0.03]">
                  <Icon size={18} className="text-black/40 shrink-0" />
                  <span className="font-[family-name:'Outfit',sans-serif] text-[10px] font-medium text-black/50 text-center leading-tight uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Accordions (Overview/Specs) */}
            <motion.div variants={itemVariants} className="mt-6 bg-[#fcfcfb] rounded-[24px] p-6 border border-black/[0.03]">
              {p.specifications?.length > 0 && (
                <Accordion title="Specifications" defaultOpen>
                  <div className="border border-black/8 rounded-xl overflow-hidden mt-2">
                    {p.specifications.map((spec, i) => {
                      const key = spec.title || spec.key || spec.name || spec.label || "Feature";
                      const val = spec.value || spec.val || "N/A";
                      return (
                        <div key={i} className={`flex text-[12.5px] border-b border-black/6 last:border-none ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]"}`}>
                          <div className="w-[40%] px-5 py-3 font-[family-name:'Outfit',sans-serif] font-medium text-black/40 border-r border-black/6">{key}</div>
                          <div className="w-[60%] px-5 py-3 font-[family-name:'Outfit',sans-serif] font-medium text-[#111010]">{val}</div>
                        </div>
                      );
                    })}
                  </div>
                </Accordion>
              )}
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