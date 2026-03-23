import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, CheckCircle2, ShoppingBag,
  ArrowRight, Tag, Shield, Truck, RotateCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("cart-fonts")) {
  const l = document.createElement("link");
  l.id = "cart-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const getImg = (src) =>
  !src ? "" : src.startsWith("http") ? src : `${BASE_URL}${src}`;

/* ── stagger variants ── */
const listVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};
const rowVariants = {
  hidden:  { opacity: 0, y: 16 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: -24, scale: 0.98, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */
export default function CartPage() {
  const [cart, setCart]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [voucher, setVoucher]   = useState("");
  const [vFocused, setVFocused] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart");
      setCart(data);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (id) => {
    setRemovingId(id);
    try {
      await API.delete(`/cart/${id}`);
      setCart(prev => prev.filter(i => i._id !== id));
      toast.success("Item removed from cart");
      fetchCartCount();
    } catch (e) {
      console.log(e);
      toast.error("Failed to remove item");
    }
    setRemovingId(null);
  };

  const [updatingId, setUpdatingId] = useState(null);

  const updateQty = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    setUpdatingId(item._id);
    // Optimistic update
    setCart(prev =>
      prev.map(i => i._id === item._id ? { ...i, quantity: newQty } : i)
    );
    try {
      await API.put(`/cart/${item._id}`, { quantity: newQty });
      toast.success(delta > 0 ? "Quantity increased" : "Quantity decreased");
    } catch (e) {
      // Revert on failure
      setCart(prev =>
        prev.map(i => i._id === item._id ? { ...i, quantity: item.quantity } : i)
      );
      toast.error("Failed to update quantity");
      console.log(e);
    }
    setUpdatingId(null);
  };

  const subtotal    = cart.reduce((s, i) => s + (i.product.discountPrice || i.product.price) * i.quantity, 0);
  const deliveryFee = 0;
  const total       = cart.length > 0 ? subtotal + deliveryFee : 0;

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
      <motion.div
        className="w-7 h-7 border-2 border-black/8 border-t-black/50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-[calc(96px+env(safe-area-inset-bottom))] pt-24 sm:pt-20">

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">

        {/* ── Header ── */}
        <motion.div
          className="mb-8 sm:mb-10 flex items-end justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.3em] text-black/30 mb-2">
              My Bag
            </p>
            <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(32px,5vw,52px)] font-semibold text-[#0f0f0f] leading-none m-0">
              Shopping <em className="italic font-[500]">Cart</em>
            </h1>
          </div>
          {cart.length > 0 && (
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/35 mb-1">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </p>
          )}
        </motion.div>

        {/* ── Empty ── */}
        {cart.length === 0 ? (
          <motion.div
            className="bg-white border border-black/6 rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-16 h-16 rounded-full bg-[#f5f3f0] flex items-center justify-center mb-6">
              <ShoppingBag size={26} strokeWidth={1.5} className="text-black/22" />
            </div>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[26px] font-semibold italic text-black/40 mb-2">
              Your cart is empty.
            </h2>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/32 mb-8">
              Looks like you haven't added anything yet.
            </p>
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold px-7 py-3 rounded-full hover:bg-black/80 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Continue Shopping <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* ═══════════════════════════
                LEFT — Cart items
            ═══════════════════════════ */}
            <div>
              {/* Column headers */}
              <motion.div
                className="hidden sm:grid grid-cols-[2fr_1fr_0.8fr_36px] gap-4 px-5 pb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {["Product", "Qty", "Total", ""].map((h, i) => (
                  <p key={i} className={`font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.22em] text-black/28 ${i === 1 || i === 2 ? "text-center" : ""}`}>
                    {h}
                  </p>
                ))}
              </motion.div>

              {/* Items */}
              <div className="bg-white border border-black/6 rounded-2xl overflow-hidden shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence initial={false}>
                    {cart.map((item, idx) => {
                      const itemPrice = item.product.discountPrice || item.product.price;
                      const rowTotal  = itemPrice * item.quantity;
                      const imgSrc    = getImg(item.product.images?.[0]);

                      return (
                        <motion.div
                          key={item._id}
                          variants={rowVariants}
                          exit="exit"
                          layout
                          className={`border-b border-black/5 last:border-none ${
                            removingId === item._id ? "pointer-events-none" : ""
                          }`}
                          style={{ opacity: removingId === item._id ? 0.4 : 1 }}
                        >
                          {/* Mobile card layout */}
                          <div className="sm:hidden flex items-start gap-3.5 px-4 py-4">
                            {/* Image */}
                            <div
                              className="w-[72px] h-[72px] shrink-0 bg-[#f5f3f0] rounded-xl overflow-hidden p-1.5 cursor-pointer"
                              onClick={() => navigate(`/product/${item.product._id}`)}
                            >
                              <motion.img
                                src={getImg(item.product.images?.[0])}
                                alt={item.product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                                whileHover={{ scale: 1.07 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </div>
                            {/* Info + actions */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] leading-snug mb-0.5 cursor-pointer hover:text-black/60 transition-colors"
                                onClick={() => navigate(`/product/${item.product._id}`)}
                              >
                                {item.product.name}
                              </h3>
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/30 mb-2">
                                {item.product.brand || item.product.category || "Standard"}
                              </p>
                              <div className="flex items-center justify-between gap-2">
                                {/* Qty stepper */}
                                <div className="flex items-center border border-black/10 rounded-xl overflow-hidden bg-[#f8f7f5]">
                                  <motion.button
                                    onClick={() => updateQty(item, -1)}
                                    disabled={item.quantity <= 1 || updatingId === item._id}
                                    className="w-8 h-8 flex items-center justify-center text-[16px] text-black/35 hover:text-black/70 hover:bg-black/5 transition-colors disabled:opacity-25 border-r border-black/8"
                                    whileTap={{ scale: 0.88 }}
                                  >−</motion.button>
                                  <AnimatePresence mode="wait">
                                    <motion.span
                                      key={item.quantity}
                                      className="w-8 text-center font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f]"
                                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                      transition={{ duration: 0.16 }}
                                    >{item.quantity}</motion.span>
                                  </AnimatePresence>
                                  <motion.button
                                    onClick={() => updateQty(item, +1)}
                                    disabled={updatingId === item._id}
                                    className="w-8 h-8 flex items-center justify-center text-[16px] text-black/35 hover:text-black/70 hover:bg-black/5 transition-colors disabled:opacity-25 border-l border-black/8"
                                    whileTap={{ scale: 0.88 }}
                                  >+</motion.button>
                                </div>
                                {/* Price + delete */}
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-semibold text-[#0f0f0f]">
                                      ₹{rowTotal.toLocaleString("en-IN")}
                                    </p>
                                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] text-black/28">
                                      ₹{itemPrice.toLocaleString("en-IN")} each
                                    </p>
                                  </div>
                                  <motion.button
                                    onClick={() => removeItem(item._id)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-black/20 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                                    whileTap={{ scale: 0.88 }} title="Remove"
                                  >
                                    <Trash2 size={14} strokeWidth={2} />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desktop table row layout (sm+) */}
                          <div className={`hidden sm:grid grid-cols-[2fr_1fr_0.8fr_36px] gap-4 px-5 py-5 items-center`}>
                            {/* Product */}
                            <div
                              className="flex items-center gap-3.5 cursor-pointer group"
                              onClick={() => navigate(`/product/${item.product._id}`)}
                            >
                              <div className="w-[72px] h-[72px] shrink-0 bg-[#f5f3f0] rounded-xl overflow-hidden p-1.5">
                                <motion.img
                                  src={getImg(item.product.images?.[0])}
                                  alt={item.product.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                  whileHover={{ scale: 1.07 }}
                                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-medium text-[#0f0f0f] truncate group-hover:text-black/60 transition-colors leading-snug mb-1">
                                  {item.product.name}
                                </h3>
                                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/30">
                                  {item.product.brand || item.product.category || "Standard"}
                                </p>
                                {item.product.discountPrice > 0 && item.product.discountPrice < item.product.price && (
                                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/25 line-through mt-0.5">
                                    ₹{item.product.price.toLocaleString("en-IN")}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Qty stepper */}
                            <div className="flex justify-center">
                              <div className="flex items-center border border-black/10 rounded-xl overflow-hidden bg-[#f8f7f5]">
                                <motion.button onClick={() => updateQty(item, -1)} disabled={item.quantity <= 1 || updatingId === item._id}
                                  className="w-8 h-8 flex items-center justify-center text-[16px] text-black/35 hover:text-black/70 hover:bg-black/5 transition-colors disabled:opacity-25 border-r border-black/8"
                                  whileTap={{ scale: 0.88 }}>−</motion.button>
                                <AnimatePresence mode="wait">
                                  <motion.span key={item.quantity} className="w-8 text-center font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f]"
                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.16 }}>
                                    {item.quantity}
                                  </motion.span>
                                </AnimatePresence>
                                <motion.button onClick={() => updateQty(item, +1)} disabled={updatingId === item._id}
                                  className="w-8 h-8 flex items-center justify-center text-[16px] text-black/35 hover:text-black/70 hover:bg-black/5 transition-colors disabled:opacity-25 border-l border-black/8"
                                  whileTap={{ scale: 0.88 }}>+</motion.button>
                              </div>
                            </div>

                            {/* Total */}
                            <div className="text-center">
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-semibold text-[#0f0f0f]">
                                ₹{rowTotal.toLocaleString("en-IN")}
                              </p>
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/28 mt-0.5">
                                ₹{itemPrice.toLocaleString("en-IN")} each
                              </p>
                            </div>

                            {/* Delete */}
                            <motion.button onClick={() => removeItem(item._id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-black/20 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                              whileTap={{ scale: 0.88 }} title="Remove">
                              <Trash2 size={14} strokeWidth={2} />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Bottom row */}
              <motion.div
                className="flex items-center justify-between pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/35 hover:text-black/65 transition-colors"
                >
                  <ArrowRight size={13} className="rotate-180" />
                  Continue Shopping
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/35 hover:text-black/65 border border-black/10 hover:border-black/25 px-4 py-2 rounded-xl transition-all"
                >
                  Refresh Cart
                </button>
              </motion.div>
            </div>

            {/* ═══════════════════════════
                RIGHT — Order Summary
            ═══════════════════════════ */}
            <motion.div
              className="lg:sticky lg:top-[80px] flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white border border-black/6 rounded-2xl overflow-hidden shadow-[0_1px_12px_rgba(0,0,0,0.04)]">

                {/* Header */}
                <div className="px-6 py-5 border-b border-black/5">
                  <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-semibold text-[#0f0f0f]">
                    Order Summary
                  </h2>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/30 mt-1">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} in your bag
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-5">

                  {/* Voucher input */}
                  <div>
                    <label className="font-[family-name:'DM_Sans',sans-serif] block text-[10px] font-semibold uppercase tracking-[0.22em] text-black/30 mb-2">
                      Discount Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                        <input
                          type="text"
                          value={voucher}
                          onChange={e => setVoucher(e.target.value)}
                          onFocus={() => setVFocused(true)}
                          onBlur={() => setVFocused(false)}
                          placeholder="Enter code"
                          className="w-full border rounded-xl pl-9 pr-3 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[12px] text-[#0f0f0f] placeholder:text-black/22 outline-none transition-all bg-white"
                          style={{ borderColor: vFocused ? "#0f0f0f" : "rgba(0,0,0,0.1)" }}
                        />
                      </div>
                      <motion.button
                        className="border border-black/10 hover:border-black/28 hover:bg-[#f8f7f5] rounded-xl px-4 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/45 hover:text-black/70 transition-all whitespace-nowrap"
                        whileTap={{ scale: 0.96 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-black/5" />

                  {/* Price breakdown */}
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Subtotal",     value: `₹${subtotal.toLocaleString("en-IN")}` },
                      { label: "Discount",     value: "₹0" },
                      { label: "Delivery fee", value: deliveryFee === 0 ? "Free" : `₹${deliveryFee}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/40">{label}</span>
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#0f0f0f]">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total block */}
                  <motion.div
                    className="bg-[#0f0f0f] rounded-xl px-5 py-4 flex items-center justify-between"
                    key={total}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                      Total
                    </span>
                    <span className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-semibold text-white leading-none">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </motion.div>

                  {/* Warranty note */}
                  <div className="flex items-start gap-2.5 bg-[#f8f7f5] border border-black/5 rounded-xl p-3.5">
                    <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-black/28" strokeWidth={1.5} />
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/38 leading-relaxed">
                      90 Day warranty against manufacturer's defects.{" "}
                      <a href="#" className="underline text-black/55 hover:text-black/80 transition-colors">View Details</a>
                    </p>
                  </div>

                  {/* Checkout CTA */}
                  <motion.button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold py-4 rounded-xl flex items-center justify-center gap-2.5 hover:bg-black/82 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Checkout Now
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </motion.button>

                  <p className="font-[family-name:'DM_Sans',sans-serif] text-center text-[10px] text-black/22 tracking-wide">
                    Secure checkout · SSL encrypted
                  </p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Shield,    label: "Secure\nPayment"  },
                  { icon: Truck,     label: "Fast\nDelivery"   },
                  { icon: RotateCcw, label: "Easy\nReturns"    },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-white border border-black/6 rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                    <Icon size={15} className="text-black/28" strokeWidth={1.5} />
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] text-black/32 text-center leading-tight whitespace-pre-line">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        )}
      </div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}