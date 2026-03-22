import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  Package, Calendar, CreditCard, Truck,
  ArrowRight, Clock, MapPin, CheckCircle,
  CircleDashed, XCircle, ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("mo-fonts")) {
  const l = document.createElement("link");
  l.id = "mo-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

const getOrderStatus = (order) => {
  if (order.isCancelled) return "cancelled";
  if (order.isDelivered)  return "delivered";
  if (order.isShipped)    return "shipped";
  if (order.isPaid)       return "processing";
  return "pending";
};

const STATUS_MAP = {
  delivered:  { label: "Delivered",  dot: "bg-emerald-500", text: "text-emerald-700", step: 3 },
  shipped:    { label: "Shipped",    dot: "bg-blue-500",    text: "text-blue-700",    step: 2 },
  processing: { label: "Processing", dot: "bg-amber-500",   text: "text-amber-700",   step: 1 },
  pending:    { label: "Pending",    dot: "bg-black/25",    text: "text-black/45",    step: 0 },
  cancelled:  { label: "Cancelled",  dot: "bg-red-500",     text: "text-red-600",     step: 0 },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/* ── Mini 4-step progress track ── */
function MiniProgress({ step, cancelled }) {
  return (
    <div className="flex items-center gap-0 px-6 pb-4 pt-1">
      {[0, 1, 2, 3].map((i) => {
        const filled = !cancelled && i <= step;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${
              filled ? "bg-[#0f0f0f]" : "bg-black/10"
            }`} />
            {i < 3 && (
              <div className={`flex-1 h-px transition-colors duration-500 ${
                !cancelled && i < step ? "bg-[#0f0f0f]" : "bg-black/10"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/myorders")
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] pt-28 pb-24 px-5 sm:px-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[960px] mx-auto">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between gap-6 mb-8 pb-7 border-b border-black/[0.09]"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-3"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease }}
            >
              My Account
            </motion.p>
            <motion.h1
              className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(40px,6vw,60px)] font-[400] text-[#0f0f0f] leading-[1]"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14, ease }}
            >
              Your <em className="italic font-[300]">Orders</em>
            </motion.h1>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/38 mt-2.5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.22, ease }}
            >
              Track, manage and review your purchases
            </motion.p>
          </div>

          {/* Order count */}
          {orders.length > 0 && (
            <motion.div
              className="text-right shrink-0"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease }}
            >
              <p className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(42px,5vw,56px)] font-[400] text-[#0f0f0f] leading-none">
                {orders.length}
              </p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mt-1">
                {orders.length === 1 ? "Order" : "Orders"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ══ EMPTY STATE ══ */}
        {orders.length === 0 && (
          <motion.div
            className="bg-white border border-black/[0.07] rounded-3xl p-14 text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <div className="w-16 h-16 bg-[#f7f5f2] border border-black/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-7">
              <ShoppingBag size={22} className="text-black/28" strokeWidth={1.5} />
            </div>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[32px] font-[400] text-[#0f0f0f] mb-3">
              No orders yet
            </h2>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mb-9 max-w-[260px] mx-auto leading-relaxed">
              You haven't placed any orders yet. Discover our curated collection.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#0f0f0f] text-white px-7 py-3.5 rounded-2xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold hover:bg-black/80 transition-colors"
            >
              Explore Products <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* ══ ORDERS LIST ══ */}
        <AnimatePresence>
          <div className="flex flex-col gap-3">
            {orders.map((order, index) => {
              const status  = getOrderStatus(order);
              const sConfig = STATUS_MAP[status];

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.52, delay: index * 0.08, ease }}
                  className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden hover:border-black/[0.15] transition-colors duration-300 group"
                >

                  {/* ── TOP ROW: index · id+date · status · price ── */}
                  <div className="grid grid-cols-[28px_1fr_auto_auto] sm:grid-cols-[32px_1fr_auto_auto] items-center gap-4 sm:gap-6 px-6 py-5 border-b border-black/[0.055]">

                    {/* Index number */}
                    <span className="font-[family-name:'Cormorant_Garamond',serif] text-[14px] font-[500] text-black/22 leading-none select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* ID + date */}
                    <div className="min-w-0">
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold uppercase tracking-[0.12em] text-black/38 mb-0.5">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/38">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Status pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      <motion.span
                        className={`w-[7px] h-[7px] rounded-full shrink-0 ${sConfig.dot}`}
                        animate={status !== "cancelled" ? { opacity: [1, 0.35, 1], scale: [1, 0.65, 1] } : {}}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className={`font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold ${sConfig.text}`}>
                        {sConfig.label}
                      </span>
                    </div>

                    {/* Price */}
                    <span className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] leading-none shrink-0">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* ── BODY: items + meta chips ── */}
                  <div className="px-6 py-4 flex items-start justify-between gap-5">

                    {/* Items */}
                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                      {order.orderItems?.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-[38px] h-[38px] rounded-xl bg-[#f0ede8] border border-black/[0.06] shrink-0 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply p-1"
                              />
                            ) : (
                              <Package size={14} className="text-black/22" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] truncate leading-snug">
                              {item.name}
                            </p>
                          </div>
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 shrink-0 ml-2">
                            ×{item.qty}
                          </span>
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/35 pl-[50px]">
                          +{order.orderItems.length - 3} more item{order.orderItems.length - 3 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-col gap-2 items-end shrink-0">
                      <div className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/42 bg-[#f7f5f2] border border-black/[0.06] rounded-full px-3 py-1.5">
                        <CreditCard size={11} className="text-black/30" strokeWidth={1.5} />
                        {order.paymentMethod || "Online"}
                      </div>

                      {order.deliveredAt ? (
                        <div className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-3 py-1.5">
                          <Truck size={11} strokeWidth={1.8} />
                          Delivered {formatDate(order.deliveredAt)}
                        </div>
                      ) : order.isShipped ? (
                        <div className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full px-3 py-1.5">
                          <Truck size={11} strokeWidth={1.8} />
                          In Transit
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/38 bg-[#f7f5f2] border border-black/[0.06] rounded-full px-3 py-1.5">
                          <Clock size={11} className="text-black/28" strokeWidth={1.5} />
                          {order.isPaid ? "Preparing" : "Awaiting payment"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── MINI PROGRESS ── */}
                  <MiniProgress step={sConfig.step} cancelled={status === "cancelled"} />

                  {/* ── FOOTER: address + view link ── */}
                  <div className="flex items-center justify-between px-6 py-3.5 bg-[#faf9f7] border-t border-black/[0.055]">
                    <div className="flex items-center gap-2 min-w-0">
                      {order.shippingAddress ? (
                        <>
                          <MapPin size={11} className="text-black/28 shrink-0" strokeWidth={1.8} />
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/42 truncate max-w-[280px]">
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                          </span>
                        </>
                      ) : (
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/28">
                          No address on file
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/order-detail/${order._id}`}
                      className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold text-[#0f0f0f] hover:text-black/55 transition-colors group/link shrink-0 ml-4"
                    >
                      View Details
                      <ArrowRight
                        size={12}
                        className="group-hover/link:translate-x-0.5 transition-transform duration-200"
                      />
                    </Link>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`}</style>
    </div>
  );
}