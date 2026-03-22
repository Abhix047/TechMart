import { useEffect, useState } from "react";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, CheckCircle2, Clock,
  CreditCard, Search, ExternalLink, X,
  ChevronRight, XCircle
} from "lucide-react";
import toast from "react-hot-toast";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("ao-fonts")) {
  const l = document.createElement("link");
  l.id = "ao-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

/* ── Confirm action modal ── */
function ConfirmModal({ action, onConfirm, onCancel }) {
  if (!action) return null;
  const MAP = {
    confirm: { title: "Confirm order?",  sub: "This will mark the order as confirmed.",   color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200/60"  },
    ship:    { title: "Mark as shipped?", sub: "This will mark the order as shipped.",     color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200/60"   },
    deliver: { title: "Mark as delivered?", sub: "This will mark the order as delivered.", color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200/60"},
  };
  const cfg = MAP[action.type] || MAP.confirm;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/25 backdrop-blur-[3px] z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }} onClick={onCancel} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
        <motion.div className="bg-white rounded-2xl p-7 w-full max-w-[360px] border border-black/[0.07]"
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.3, ease }}
        >
          <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center mb-5`}>
            <CheckCircle2 size={15} className={cfg.color} />
          </div>
          <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] mb-1.5 leading-snug">
            {cfg.title}
          </h2>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mb-7">{cfg.sub}</p>
          <div className="flex gap-2.5">
            <button onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/50 border border-black/10 hover:bg-black/[0.025] transition-colors">
              Cancel
            </button>
            <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold bg-[#0f0f0f] text-white hover:bg-black/80 transition-colors">
              Confirm
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Status badge ── */
function StatusBadge({ order }) {
  if (order.isCancelled) return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-full">
      <XCircle size={10} /> Cancelled
    </span>
  );
  if (order.isDelivered) return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
      <motion.span className="w-[5px] h-[5px] rounded-full bg-emerald-500 shrink-0"
        animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
      Delivered
    </span>
  );
  if (order.isShipped) return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full">
      <Truck size={10} /> Shipped
    </span>
  );
  if (order.isConfirmed) return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
      <CheckCircle2 size={10} /> Confirmed
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-full">
      <Clock size={10} /> Processing
    </span>
  );
}

/* ── Action buttons row ── */
function ActionButtons({ order, onAction }) {
  if (order.isCancelled) return (
    <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/28">—</span>
  );
  if (order.isDelivered) return (
    <motion.a href={`/admin/orders/${order._id}`}
      className="flex items-center gap-1 font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-black/38 hover:text-[#0f0f0f] transition-colors"
      whileTap={{ scale: 0.95 }}>
      View <ExternalLink size={11} strokeWidth={1.5} />
    </motion.a>
  );
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      {!order.isConfirmed && (
        <motion.button onClick={() => onAction({ type: "confirm", id: order._id })}
          className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1.5 rounded-xl hover:bg-amber-100 transition-colors"
          whileTap={{ scale: 0.95 }}>
          Confirm
        </motion.button>
      )}
      {order.isConfirmed && !order.isShipped && (
        <motion.button onClick={() => onAction({ type: "ship", id: order._id })}
          className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
          whileTap={{ scale: 0.95 }}>
          Ship
        </motion.button>
      )}
      {order.isShipped && !order.isDelivered && (
        <motion.button onClick={() => onAction({ type: "deliver", id: order._id })}
          className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-white bg-[#0f0f0f] border border-black px-2.5 py-1.5 rounded-xl hover:bg-black/80 transition-colors"
          whileTap={{ scale: 0.95 }}>
          Deliver
        </motion.button>
      )}
    </div>
  );
}

/* ════════════════════ MAIN ════════════════════ */
const AdminOrders = () => {
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [pendingAction, setPending]   = useState(null);
  const [payLoading,  setPayLoading]  = useState(null); // order id being toggled

  useEffect(() => {
    API.get("/orders")
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = (action) => setPending(action);

  /* ── Toggle paid/unpaid ── */
  const togglePay = async (order) => {
    if (payLoading) return;
    setPayLoading(order._id);
    try {
      const { data } = await API.put(`/orders/${order._id}/pay`);
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, isPaid: data.isPaid, paidAt: data.paidAt } : o));
      toast.success(data.isPaid ? "Marked as Paid ✓" : "Marked as Unpaid");
    } catch {
      toast.error("Payment update failed.");
    } finally {
      setPayLoading(null);
    }
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    const { type, id } = pendingAction;
    const endpoints = { confirm: "confirm", ship: "ship", deliver: "deliver" };
    try {
      await API.put(`/orders/${id}/${endpoints[type]}`);
      setOrders(prev => prev.map(o => {
        if (o._id !== id) return o;
        if (type === "confirm") return { ...o, isConfirmed: true };
        if (type === "ship")    return { ...o, isShipped: true, isConfirmed: true };
        if (type === "deliver") return { ...o, isDelivered: true, isShipped: true, isConfirmed: true };
        return o;
      }));
      toast.success(`Order ${type}ed successfully`);
    } catch {
      toast.error("Update failed.");
    } finally {
      setPending(null);
    }
  };

  const filtered = orders.filter(o =>
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <ConfirmModal
        action={pendingAction}
        onConfirm={executeAction}
        onCancel={() => setPending(null)}
      />

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 pt-10">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between mb-8 pb-7 border-b border-black/[0.08] flex-wrap gap-5"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <div>
            <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-2.5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease }}>
              Admin · Fulfilment
            </motion.p>
            <motion.h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,44px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}>
              Manage <em className="italic font-[300]">Orders</em>
            </motion.h1>
            <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease }}>
              {loading ? "Loading…" : `${filtered.length} of ${orders.length} orders`}
            </motion.p>
          </div>

          {/* Search */}
          <motion.div className="relative"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease }}>
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" strokeWidth={1.5} />
            <input type="text" placeholder="Search by ID or name…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-60 bg-white border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/22 transition-colors" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/28 hover:text-black/55 transition-colors">
                <X size={12} />
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* ══ LOADING ══ */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div className="w-7 h-7 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
          </div>
        )}

        {/* ══ TABLE ══ */}
        {!loading && (
          <motion.div
            className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease }}
          >
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    {["Order", "Customer", "Amount", "Payment", "Shipment", "Actions"].map((h, i) => (
                      <th key={h}
                        className={`px-5 py-3.5 font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30 ${i === 5 ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {filtered.length > 0 ? filtered.map((order, i) => (
                      <motion.tr
                        key={order._id}
                        className="border-b border-black/[0.045] last:border-none hover:bg-[#f9f8f6] transition-colors duration-200"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.38, delay: 0.24 + i * 0.05, ease }}
                      >
                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-semibold text-black/50 font-mono tracking-wide bg-[#f7f5f2] border border-black/[0.06] px-2 py-0.5 rounded-lg">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/28 mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#f0ede8] border border-black/[0.06] flex items-center justify-center shrink-0">
                              <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold text-black/45">
                                {(order.user?.name || "G")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] leading-snug">
                                {order.user?.name || "Guest"}
                              </p>
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/30 truncate max-w-[130px]">
                                {order.user?.email || ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="font-[family-name:'Cormorant_Garamond',serif] text-[19px] font-[500] text-[#0f0f0f] leading-none">
                            ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          <motion.button
                            onClick={() => togglePay(order)}
                            disabled={!!payLoading}
                            whileTap={{ scale: 0.95 }}
                            title={order.isPaid ? "Click to mark as Unpaid" : "Click to mark as Paid"}
                            className="cursor-pointer disabled:opacity-60"
                          >
                            {payLoading === order._id ? (
                              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-black/35 bg-black/5 border border-black/10 px-2.5 py-1 rounded-full">
                                <motion.span className="w-3 h-3 border border-black/20 border-t-black/50 rounded-full"
                                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                              </span>
                            ) : order.isPaid ? (
                              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors">
                                <CheckCircle2 size={10} /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors">
                                <CreditCard size={10} strokeWidth={1.5} /> Unpaid
                              </span>
                            )}
                          </motion.button>
                        </td>

                        {/* Shipment */}
                        <td className="px-5 py-4">
                          <StatusBadge order={order} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <ActionButtons order={order} onAction={handleAction} />
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center">
                              <Package size={16} className="text-black/22" strokeWidth={1.5} />
                            </div>
                            <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[20px] font-[400] text-[#0f0f0f]">
                              No orders found
                            </p>
                            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/35">
                              {search ? "Try a different search term." : "Orders will appear here once placed."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default AdminOrders;