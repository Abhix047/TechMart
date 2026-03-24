import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import {
  CheckCircle2, X, Shield, Truck, RotateCcw, Lock, ChevronRight
} from "lucide-react";

import { getImg, BASE_URL } from "../config";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("co-fonts")) {
  const l = document.createElement("link");
  l.id = "co-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

// Removed local getImg in favor of centralized one

/* ── stagger variants ── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Reusable field wrapper ── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="font-[family-name:'DM_Sans',sans-serif] block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35 mb-1.5">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-red-500 mt-1.5 flex items-center gap-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <X size={10} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section card header ── */
function SectionHeader({ step, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 border-b border-black/5">
      <span className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold flex items-center justify-center shrink-0">
        {step}
      </span>
      <div>
        <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[20px] font-semibold text-[#0f0f0f]">
          {title}
        </h2>
        <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/30 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */
export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage]         = useState({ type: "", text: "" });
  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors]           = useState({});
  const { fetchCartCount }            = useCart();

  const [address, setAddress] = useState({
    name: "", phone: "", city: "", state: "", pincode: "", address: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/cart");
        setCart(data);
      } catch { showMessage("error", "Failed to load cart."); }
      setLoading(false);
    })();
  }, []);

  const subtotal      = cart.reduce((s, i) => s + (i.product.discountPrice || i.product.price) * i.quantity, 0);
  const shippingPrice = 50;
  const totalPrice    = subtotal + shippingPrice;

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const validateForm = () => {
    const e = {};
    if (!address.name.trim()) e.name = "Full name is required";
    else if (!/^[a-zA-Z\s]{3,}$/.test(address.name)) e.name = "Only letters allowed (min 3 chars)";
    if (!address.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(address.phone)) e.phone = "Valid 10-digit Indian number required";
    if (!address.pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^[1-9][0-9]{5}$/.test(address.pincode)) e.pincode = "Valid 6-digit pincode required";
    if (!address.city.trim()) e.city = "City is required";
    else if (!/^[a-zA-Z\s]+$/.test(address.city)) e.city = "Only letters allowed";
    if (!address.state.trim()) e.state = "State is required";
    else if (!/^[a-zA-Z\s]+$/.test(address.state)) e.state = "Only letters allowed";
    if (!address.address.trim()) e.address = "Address is required";
    else if (address.address.trim().length < 10) e.address = "Minimum 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showMessage("error", "Your cart is empty!");
    if (!validateForm()) { showMessage("error", "Please fix the errors below."); return; }
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      const orderItems = cart.map((item) => ({
        name:    item.product.name,
        qty:     item.quantity,
        image:   item.product.images[0],
        price:   item.product.discountPrice || item.product.price,
        product: item.product._id,
      }));
      const { data } = await API.post("/orders", {
        orderItems,
        shippingAddress: {
          address: address.address,
          city: address.city,
          postalCode: address.pincode,
          country: "India",
        },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        totalPrice,
      });
      fetchCartCount();
      showMessage("success", "Order placed! Redirecting…");
      setTimeout(() => navigate(`/order/${data._id}`), 1500);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to place order.");
      setIsSubmitting(false);
    }
  };

  /* Input class helper */
  const inputCls = (name) => [
    "w-full bg-white border rounded-xl px-4 py-3",
    "font-[family-name:'DM_Sans',sans-serif] text-[13px] text-[#0f0f0f]",
    "placeholder:text-black/22 outline-none transition-all duration-200",
    errors[name]
      ? "border-red-400 bg-red-50/40 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
      : focusedField === name
      ? "border-[#0f0f0f] shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
      : "border-black/10 hover:border-black/22",
  ].join(" ");

  /* Loading */
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
    <div className="min-h-screen bg-[#fafaf9] pb-[calc(80px+env(safe-area-inset-bottom))] pt-24 sm:pt-20">

      {/* Toast */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-8 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium ${
              message.type === "success"
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

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16">

        {/* ── Header ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-4">
            <button onClick={() => navigate("/cart")} className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/32 hover:text-black/60 transition-colors">
              Cart
            </button>
            <ChevronRight size={11} className="text-black/18" />
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-[#0f0f0f]">Checkout</span>
          </div>

          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.3em] text-black/28 mb-2">
            Final Step
          </p>
          <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(32px,5vw,50px)] font-semibold text-[#0f0f0f] leading-none">
            Complete Your <em className="italic font-[500]">Order</em>
          </h1>
        </motion.div>

        <form onSubmit={placeOrder} noValidate>
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ══════════════════════════
                LEFT — Form
            ══════════════════════════ */}
            <motion.div
              className="flex flex-col gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >

              {/* ── Shipping Card ── */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-black/6 rounded-2xl overflow-hidden shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
              >
                <SectionHeader step="1" title="Shipping Information" subtitle="Where should we deliver?" />

                <div className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2">

                  <div className="sm:col-span-2">
                    <Field label="Full Name *" error={errors.name}>
                      <input
                        type="text" name="name" value={address.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        className={inputCls("name")} placeholder="e.g. Arjun Sharma"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Phone Number *" error={errors.phone}>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/30 select-none pointer-events-none">
                          +91
                        </span>
                        <input
                          type="tel" name="phone" value={address.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField("")}
                          className={`${inputCls("phone")} pl-12`}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </Field>
                  </div>

                  <div>
                    <Field label="Pincode *" error={errors.pincode}>
                      <input
                        type="text" name="pincode" value={address.pincode}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("pincode")}
                        onBlur={() => setFocusedField("")}
                        className={inputCls("pincode")} placeholder="110001"
                        maxLength={6}
                      />
                    </Field>
                  </div>

                  <div>
                    <Field label="City *" error={errors.city}>
                      <input
                        type="text" name="city" value={address.city}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("city")}
                        onBlur={() => setFocusedField("")}
                        className={inputCls("city")} placeholder="New Delhi"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="State *" error={errors.state}>
                      <input
                        type="text" name="state" value={address.state}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("state")}
                        onBlur={() => setFocusedField("")}
                        className={inputCls("state")} placeholder="Delhi"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Full Address *" error={errors.address}>
                      <textarea
                        name="address" rows={3} value={address.address}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("address")}
                        onBlur={() => setFocusedField("")}
                        className={`${inputCls("address")} resize-none`}
                        placeholder="House/Flat No., Building, Street, Landmark…"
                      />
                    </Field>
                  </div>
                </div>
              </motion.div>

              {/* ── Payment Card ── */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-black/6 rounded-2xl overflow-hidden shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
              >
                <SectionHeader step="2" title="Payment Method" subtitle="How would you like to pay?" />

                <div className="p-6 flex flex-col gap-3">
                  {[
                    {
                      value: "COD",
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/40">
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 3H8L2 7h20l-6-4z" />
                          <circle cx="12" cy="14" r="2" />
                        </svg>
                      ),
                      title: "Cash on Delivery",
                      desc: "Pay when your order arrives",
                    },
                    {
                      value: "Online",
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/40">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                          <line x1="6" y1="15" x2="10" y2="15" />
                        </svg>
                      ),
                      title: "Online Payment",
                      desc: "Card · UPI · Net Banking",
                    },
                  ].map((opt) => (
                    <motion.label
                      key={opt.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        paymentMethod === opt.value
                          ? "border-[#0f0f0f] bg-[#fafaf9]"
                          : "border-black/8 hover:border-black/18 bg-white"
                      }`}
                      whileTap={{ scale: 0.995 }}
                    >
                      <input
                        type="radio" name="payment" value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />

                      {/* Radio dot */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        paymentMethod === opt.value ? "border-[#0f0f0f]" : "border-black/18"
                      }`}>
                        <AnimatePresence>
                          {paymentMethod === opt.value && (
                            <motion.div
                              className="w-2.5 h-2.5 rounded-full bg-[#0f0f0f]"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Icon box */}
                      <div className="w-10 h-10 rounded-xl bg-[#f5f3f0] border border-black/5 flex items-center justify-center shrink-0">
                        {opt.icon}
                      </div>

                      <div className="flex-1">
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f]">{opt.title}</p>
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 mt-0.5">{opt.desc}</p>
                      </div>

                      <AnimatePresence>
                        {paymentMethod === opt.value && (
                          <motion.span
                            className="font-[family-name:'DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.18em] bg-[#0f0f0f] text-white px-2.5 py-1 rounded-full shrink-0"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            Selected
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* ══════════════════════════
                RIGHT — Order summary
            ══════════════════════════ */}
            <motion.div
              className="lg:sticky lg:top-[72px] flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white border border-black/6 rounded-2xl overflow-hidden shadow-[0_1px_12px_rgba(0,0,0,0.04)]">

                {/* Summary header */}
                <div className="px-6 py-5 border-b border-black/5">
                  <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-semibold text-[#0f0f0f]">
                    Order Summary
                  </h2>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/28 mt-1">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} in your bag
                  </p>
                </div>

                {/* Items list */}
                <div className="divide-y divide-black/[0.04] max-h-52 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f5f3f0] shrink-0 p-1.5">
                        <img
                          src={getImg(item.product.images?.[0])}
                          alt={item.product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#0f0f0f] truncate leading-snug">
                          {item.product.name}
                        </p>
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/30 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f] shrink-0">
                        ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price rows */}
                <div className="px-6 py-5 border-t border-black/5 flex flex-col gap-3">
                  {[
                    { label: "Subtotal",  value: `₹${subtotal.toLocaleString("en-IN")}`      },
                    { label: "Shipping",  value: `₹${shippingPrice}`                         },
                    { label: "Payment",   value: paymentMethod === "COD" ? "Cash on Delivery" : "Online" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/38">{label}</span>
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-[#0f0f0f]">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Total block */}
                <div className="mx-5 mb-5 bg-[#0f0f0f] rounded-xl px-5 py-4 flex items-center justify-between">
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                    Total
                  </span>
                  <motion.span
                    key={totalPrice}
                    className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(24px,3vw,30px)] font-semibold text-white leading-none"
                    initial={{ opacity: 0.6, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </motion.span>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className={`w-full py-4 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold flex items-center justify-center gap-2.5 transition-colors duration-200 ${
                      isSubmitting || cart.length === 0
                        ? "bg-black/5 text-black/22 cursor-not-allowed"
                        : "bg-[#0f0f0f] text-white hover:bg-black/82"
                    }`}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.span
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                        />
                        Processing…
                      </>
                    ) : (
                      <>
                        <Lock size={14} strokeWidth={2} />
                        Place Order · ₹{totalPrice.toLocaleString("en-IN")}
                      </>
                    )}
                  </motion.button>

                  <p className="font-[family-name:'DM_Sans',sans-serif] text-center text-[10px] text-black/20 mt-3 tracking-wide leading-relaxed">
                    By placing your order you agree to our Terms & Privacy Policy
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
                    <Icon size={14} className="text-black/25" strokeWidth={1.5} />
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] text-black/30 text-center leading-tight whitespace-pre-line">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </form>
      </div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}