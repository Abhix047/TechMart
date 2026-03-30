import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft, Package, MapPin, CreditCard, CheckCircle2,
  Truck, Star, Receipt, X, Calendar, Hash, ShoppingBag,
  Shield, RotateCcw, Zap
} from "lucide-react";
import API from "../services/api";
import ReviewForm from "../components/review/ReviewForm";
import toast from "react-hot-toast";

import { getImg, BASE_URL } from "../config";
const ease = [0.22, 1, 0.36, 1];

const STEPS = [
  { key: "placed", label: "Order Placed", sub: "We received your order", Icon: Receipt },
  { key: "confirmed", label: "Confirmed", sub: "Payment verified", Icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", sub: "On the way to you", Icon: Truck },
  { key: "delivered", label: "Delivered", sub: "Enjoy your purchase", Icon: Package },
];

/* ── Stagger children ── */
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const listItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [reviewedIds, setReviewedIds] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await API.put(`/orders/${id}/cancel`);
      setOrder(prev => ({ ...prev, isCancelled: true }));
      setCancelModal(false);
      toast.success("Order cancelled successfully");
    } catch {
      toast.error("Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  if (!order) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-[1.5px] border-black/12 border-t-black/60 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  const currentStep = order.isDelivered ? 3 : order.isShipped ? 2 : order.isConfirmed ? 1 : 0;

  const statusConfig = {
    3: { label: "Delivered", textCls: "text-emerald-400", dotCls: "bg-emerald-400", ringCls: "ring-emerald-400/20" },
    2: { label: "Shipped", textCls: "text-sky-400", dotCls: "bg-sky-400", ringCls: "ring-sky-400/20" },
    1: { label: "Confirmed", textCls: "text-amber-400", dotCls: "bg-amber-400", ringCls: "ring-amber-400/20" },
    0: { label: "Processing", textCls: "text-orange-400", dotCls: "bg-orange-400", ringCls: "ring-orange-400/20" },
  };
  const status = order.isCancelled
    ? { label: "Cancelled", textCls: "text-red-400", dotCls: "bg-red-400", ringCls: "ring-red-400/20" }
    : statusConfig[currentStep];

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] pb-32"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ══ CANCEL MODAL ══ */}
      <AnimatePresence>
        {cancelModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/35 backdrop-blur-[4px] z-[100]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setCancelModal(false)}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
              <motion.div
                className="bg-white rounded-3xl p-8 w-full max-w-[400px] border border-black/[0.08]"
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
                  <X size={18} className="text-red-500" />
                </div>
                <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[26px] font-[500] text-[#0f0f0f] mb-3 leading-snug">
                  Cancel this order?
                </h2>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] text-black/55 leading-relaxed mb-8">
                  This cannot be undone. Your payment will be refunded within 5–7 business days to your original payment method.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCancelModal(false)}
                    className="flex-1 py-3.5 rounded-2xl font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-black/60 border border-black/12 hover:bg-black/[0.03] transition-colors"
                  >
                    Keep Order
                  </button>
                  <motion.button
                    onClick={handleCancel}
                    disabled={cancelling}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3.5 rounded-2xl font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {cancelling
                      ? <motion.span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                      : "Yes, Cancel"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1180px] mx-auto px-5 sm:px-10 pt-28">

        {/* ── Back ── */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/40 hover:text-black/75 transition-colors mb-8 group"
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease }}
          whileTap={{ x: -3 }}
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Orders
        </motion.button>

        {/* ══════════════════════════════════════════
            HERO BANNER — dark, premium
        ══════════════════════════════════════════ */}
        <motion.div
          className="relative bg-[#0f0f0f] rounded-3xl overflow-hidden mb-4"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05, ease }}
        >
          {/* Subtle texture lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,1) 39px, rgba(255,255,255,1) 40px)",
            }}
          />

          <div className="relative px-8 sm:px-12 py-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">

            {/* Left */}
            <div>
              <motion.p
                className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35 mb-3"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease }}
              >
                Order Receipt
              </motion.p>
              <motion.h1
                className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(34px,5vw,52px)] font-[400] text-white leading-none tracking-tight mb-3"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                #{order._id?.slice(-8).toUpperCase()}
              </motion.h1>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.28, ease }}
              >
                <Calendar size={11} className="text-white/35" />
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-white/45">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              </motion.div>
            </div>

            {/* Right — stats */}
            <motion.div
              className="flex items-center gap-5 sm:gap-8 flex-wrap"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease }}
            >
              {/* Items count */}
              <div>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28 mb-2">Items</p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[22px] font-[500] text-white leading-none">
                  {order.orderItems.length}
                </p>
              </div>

              <div className="w-px h-12 bg-white/10" />

              {/* Total */}
              <div>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28 mb-2">Order Total</p>
                <p className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(24px,3vw,34px)] font-[400] text-white leading-none">
                  ₹{order.totalPrice?.toLocaleString("en-IN")}
                </p>
              </div>

              {order.expectedDeliveryDate && (
                <>
                  <div className="w-px h-12 bg-white/10" />
                  <div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28 mb-2">Expected Delivery</p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-semibold text-emerald-400 leading-none">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </>
              )}

              <div className="w-px h-12 bg-white/10" />

              {/* Status */}
              <div>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28 mb-2">Status</p>
                <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.07] border border-white/10 ring-4 ${status.ringCls}`}>
                  <motion.span
                    className={`w-2 h-2 rounded-full shrink-0 ${status.dotCls}`}
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className={`font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold ${status.textCls}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            PROGRESS TRACKER — detailed with sub-labels
        ══════════════════════════════════════════ */}
        <motion.div
          className="bg-white border border-black/[0.07] rounded-3xl px-10 py-8 mb-4"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease }}
        >
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold uppercase tracking-[0.2em] text-black/35 mb-7">
            Shipment Progress
          </p>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
            <div className="flex items-start justify-between relative min-w-[600px] sm:min-w-0">
              {/* Rail */}
              <div className="absolute top-[18px] left-[10%] right-[10%] h-px bg-black/[0.08]" />
              {/* Animated fill */}
              <motion.div
                className="absolute top-[18px] left-[10%] h-px bg-[#0f0f0f] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStep === 0 ? 0.01 : currentStep / (STEPS.length - 1) }}
                transition={{ duration: 1.2, delay: 0.6, ease }}
                style={{ right: "10%", transformOrigin: "left" }}
              />

              {STEPS.map((step, i) => {
                const done = i <= currentStep;
                const current = i === currentStep;
                return (
                  <motion.div
                    key={step.key}
                    className="flex flex-col items-center gap-3 z-10 flex-1 px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease }}
                  >
                    <motion.div
                      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center border-2 transition-all duration-500 ${done ? "bg-[#0f0f0f] border-[#0f0f0f]" : "bg-white border-black/12"
                        } ${current && !order.isCancelled ? "shadow-[0_0_0_6px_rgba(0,0,0,0.07)]" : ""}`}
                      whileHover={{ scale: 1.08 }}
                    >
                      <step.Icon size={13} className={done ? "text-white" : "text-black/25"} />
                    </motion.div>
                    <div className="text-center">
                      <p className={`font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold ${done ? "text-[#0f0f0f]" : "text-black/30"}`}>
                        {step.label}
                      </p>
                      <p className={`font-[family-name:'DM_Sans',sans-serif] text-[11px] mt-0.5 ${done ? "text-black/45" : "text-black/22"}`}>
                        {step.sub}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            3-COL GRID — Items | Payment | Address
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* ── ORDER ITEMS ── */}
          <motion.div
            className="bg-white border border-black/[0.07] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.20, ease }}
          >
            <div className="px-6 py-5 border-b border-black/[0.06] flex items-center gap-2.5">
              <ShoppingBag size={13} className="text-black/40" />
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
                {order.orderItems.length} Item{order.orderItems.length !== 1 ? "s" : ""} Ordered
              </p>
            </div>

            <motion.div
              className="p-4 flex flex-col gap-2"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {order.orderItems.map((item) => (
                <motion.div
                  key={item._id || item.product}
                  variants={listItem}
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[#f7f5f2] border border-black/[0.05] hover:bg-[#f0ede8] transition-colors duration-200 group cursor-default"
                >
                  <div className="w-[50px] h-[50px] rounded-xl bg-[#eae6df] border border-black/[0.07] shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={getImg(item.image)} alt={item.name} // Removed local getImg in favor of centralized one
                        className="w-full h-full object-contain mix-blend-multiply p-1.5" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={17} className="text-black/25" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] truncate leading-snug">
                      {item.name}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/40 mt-0.5 flex flex-wrap items-center gap-x-2">
                      Qty · {item.qty}
                      {item.selectedColor && (
                        <span className="flex items-center gap-1 border-l border-black/10 pl-2">
                          <div className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor.hex }} />
                          {item.selectedColor.name}
                        </span>
                      )}
                      {item.selectedStorage && (
                        <span className="border-l border-black/10 pl-2">
                          {item.selectedStorage.size}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-[family-name:'Cormorant_Garamond',serif] text-[18px] font-[500] text-[#0f0f0f] leading-none">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 mt-1">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── PAYMENT ── */}
          <motion.div
            className="bg-white border border-black/[0.07] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26, ease }}
          >
            <div className="px-6 py-5 border-b border-black/[0.06] flex items-center gap-2.5">
              <CreditCard size={13} className="text-black/40" />
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
                Payment Summary
              </p>
            </div>

            <div className="px-6 py-2">
              {[
                { label: "Subtotal", value: `₹${Number(order.itemsPrice ?? order.totalPrice).toLocaleString("en-IN")}`, sub: null },
                { label: "Shipping", value: Number(order.shippingPrice ?? 0) === 0 ? "Free" : `₹${Number(order.shippingPrice).toLocaleString("en-IN")}`, sub: null },
                { label: "Tax", value: `₹${Number(order.taxPrice ?? 0).toLocaleString("en-IN")}`, sub: null },
                { label: "Payment Method", value: order.paymentMethod || "Online", sub: null },
                {
                  label: "Payment Status",
                  value: order.isPaid ? "Paid" : "Pending",
                  sub: order.isPaid && order.paidAt
                    ? new Date(order.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : null,
                  isPaid: order.isPaid,
                },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-start py-3 border-b border-black/[0.05]">
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/45">{r.label}</span>
                  <div className="text-right">
                    <span className={`font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium ${r.isPaid === true ? "text-emerald-600 flex items-center gap-1.5" :
                        r.isPaid === false ? "text-amber-600" : "text-[#0f0f0f]"
                      }`}>
                      {r.isPaid === true && <CheckCircle2 size={12} />}
                      {r.value}
                    </span>
                    {r.sub && (
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 mt-0.5">{r.sub}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between items-baseline py-5">
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f]">
                  Total Paid
                </span>
                <span className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[500] text-[#0f0f0f] leading-none">
                  ₹{order.totalPrice?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── ADDRESS + CANCEL + TRUST ── */}
          <div className="flex flex-col gap-4">

            {/* Address */}
            {order.shippingAddress && (
              <motion.div
                className="bg-white border border-black/[0.07] rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32, ease }}
              >
                <div className="px-6 py-5 border-b border-black/[0.06] flex items-center gap-2.5">
                  <MapPin size={13} className="text-black/40" />
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
                    Delivery Address
                  </p>
                </div>
                <div className="p-5">
                  <div className="bg-[#f7f5f2] border border-black/[0.05] rounded-2xl p-4">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-medium text-[#0f0f0f] mb-1.5">
                      {order.shippingAddress.address}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/50 leading-relaxed">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/50">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Trust badges */}
            <motion.div
              className="bg-white border border-black/[0.07] rounded-3xl p-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.36, ease }}
            >
              <div className="grid grid-cols-3 gap-2">
                {[
                  { Icon: Shield, label: "Secure\nPayment" },
                  { Icon: RotateCcw, label: "Easy\nReturns" },
                  { Icon: Zap, label: "Fast\nSupport" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 bg-[#f7f5f2] rounded-2xl px-2 py-3 text-center border border-black/[0.05]">
                    <Icon size={13} className="text-black/35" />
                    <span className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-medium text-black/45 leading-snug whitespace-pre-line">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cancel */}
            {!order.isCancelled && !order.isShipped && !order.isDelivered && (
              <motion.button
                onClick={() => setCancelModal(true)}
                className="w-full py-3.5 rounded-2xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-red-500 border border-red-200/60 bg-white hover:bg-red-50/50 hover:border-red-300 transition-all duration-200"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.40, ease }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
              >
                Cancel Order
              </motion.button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            REVIEWS — full width, last
        ══════════════════════════════════════════ */}
        {order.isDelivered ? (
          <motion.div
            className="bg-white border border-black/[0.07] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.40, ease }}
          >
            <div className="px-8 py-5 border-b border-black/[0.06] flex items-center gap-2.5">
              <Star size={13} className="text-black/40" />
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
                Rate Your Items
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {order.orderItems.map((item, idx) => (
                <motion.div
                  key={item._id || item.product}
                  className="rounded-2xl p-4 bg-[#f7f5f2] border border-black/[0.05] flex flex-col gap-3.5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.44 + idx * 0.07, ease }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#eae6df] border border-black/[0.06] shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={getImg(item.image)} alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-black/25" />
                        </div>
                      )}
                    </div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] truncate flex-1 leading-snug">
                      {item.name}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {reviewedIds.includes(item.product) ? (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="flex items-center gap-2 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/60 rounded-xl px-3 py-2.5"
                      >
                        <CheckCircle2 size={13} /> Submitted — thank you!
                      </motion.div>
                    ) : (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <ReviewForm
                          productId={item.product?._id || item.product}
                          onSuccess={() => setReviewedIds(p => [...p, item.product])}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center gap-5 bg-white border border-black/[0.07] rounded-3xl px-8 py-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.40, ease }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center shrink-0">
              <Star size={16} className="text-black/25" />
            </div>
            <div>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-medium text-[#0f0f0f] mb-0.5">
                Reviews unlock after delivery
              </p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/45 leading-relaxed">
                Once your order arrives, you'll be able to rate each item and share your experience.
              </p>
            </div>
          </motion.div>
        )}

      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`}</style>
    </div>
  );
}