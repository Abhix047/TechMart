import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart,
  IndianRupee, Users, ArrowRight,
  CheckCircle2, Clock, Truck, XCircle, TrendingUp
} from "lucide-react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("ad-fonts")) {
  const l = document.createElement("link");
  l.id = "ad-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

/* ── Animated counter ── */
function Counter({ target, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const n = typeof target === "number" ? target : 0;
    if (n === 0) return;
    let start = 0;
    const step = n / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= n) { setVal(n); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{val.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

/* ── Stat card ── */
function StatCard({ title, value, rawValue, icon: Icon, delay, accent, link }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px -40px" });

  const inner = (
    <motion.div
      ref={ref}
      className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 hover:border-black/[0.14] hover:shadow-sm transition-all duration-300 group relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease }}
    >
      {/* Accent strip */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start justify-between">
        <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold uppercase tracking-[0.2em] text-black/35">
          {title}
        </p>
        <div className="w-9 h-9 rounded-xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center shrink-0">
          <Icon size={15} className="text-black/45" strokeWidth={1.5} />
        </div>
      </div>

      <div>
        <p className="font-[family-name:'Cormorant_Garamond',serif] text-[38px] font-[500] text-[#0f0f0f] leading-none">
          {typeof rawValue === "number"
            ? <Counter target={rawValue} prefix={title === "Total Revenue" ? "₹" : ""} />
            : value}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/32">
          <TrendingUp size={11} strokeWidth={1.5} />
          <span>Updated just now</span>
        </div>
        {link && (
          <ArrowRight size={13} strokeWidth={1.5} className="text-black/20 group-hover:text-black/50 group-hover:translate-x-1 transition-all duration-200" />
        )}
      </div>
    </motion.div>
  );

  return link ? <Link to={link} className="no-underline block">{inner}</Link> : inner;
}

/* ── Status badge ── */
function StatusBadge({ order }) {
  if (order.isCancelled)
    return (
      <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-full">
        <XCircle size={11} /> Cancelled
      </span>
    );
  if (order.isDelivered)
    return (
      <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={11} /> Delivered
      </span>
    );
  if (order.isShipped)
    return (
      <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full">
        <Truck size={11} /> Shipped
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
      <Clock size={11} /> Pending
    </span>
  );
}

/* ════════════════════ MAIN ════════════════════ */
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders:   0,
    totalRevenue:  0,
    totalUsers:    0,
    recentOrders:  [],
  });

  useEffect(() => {
    API.get("/admin/dashboard")
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { title: "Total Revenue",  rawValue: stats.totalRevenue,  icon: IndianRupee,   delay: 0.08, accent: "bg-emerald-400", link: "/admin/orders"   },
    { title: "Total Orders",   rawValue: stats.totalOrders,   icon: ShoppingCart,  delay: 0.14, accent: "bg-blue-400",    link: "/admin/orders"   },
    { title: "Total Products", rawValue: stats.totalProducts, icon: Package,       delay: 0.20, accent: "bg-violet-400",  link: "/admin/products" },
    { title: "Customers",      rawValue: stats.totalUsers,    icon: Users,         delay: 0.26, accent: "bg-amber-400",   link: "/admin/users"    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <motion.div
        className="w-7 h-7 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-10 pt-20 lg:pt-10">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between mb-10 pb-7 border-b border-black/[0.08]"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <div>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-2.5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease }}
            >
              Overview
            </motion.p>
            <motion.h1
              className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(34px,4vw,48px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}
            >
              Admin <em className="italic font-[300]">Dashboard</em>
            </motion.h1>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease }}
            >
              Here's what's happening with your store today.
            </motion.p>
          </div>

          {/* Today's date */}
          <motion.div
            className="text-right hidden sm:block shrink-0"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
          >
            <p className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[400] text-[#0f0f0f] leading-none">
              {new Date().getDate()}
            </p>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.16em] text-black/30 mt-1">
              {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </p>
          </motion.div>
        </motion.div>

        {/* ══ STAT CARDS ══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* ══ RECENT ORDERS ══ */}
        <motion.div
          className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease }}
        >
          {/* Table header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.06]">
            <div>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1">
                Latest Activity
              </p>
              <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] leading-none">
                Recent Orders
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/40 hover:text-[#0f0f0f] transition-colors group"
            >
              View All
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="border-b border-black/[0.055]">
                  {["Order ID", "Customer", "Amount", "Items", "Status"].map(h => (
                    <th key={h} className="px-7 py-3.5 text-left font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order, i) => (
                      <motion.tr
                        key={order._id}
                        className="border-b border-black/[0.045] last:border-none hover:bg-[#f9f8f6] transition-colors duration-200 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.38, delay: 0.36 + i * 0.07, ease }}
                      >
                        {/* Order ID */}
                        <td className="px-7 py-4">
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold text-black/55 font-mono tracking-wide">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#f0ede8] border border-black/[0.06] flex items-center justify-center shrink-0">
                              <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold text-black/50">
                                {(order.user?.name || "G")[0].toUpperCase()}
                              </span>
                            </div>
                            <span className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f]">
                              {order.user?.name || "Guest User"}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-7 py-4">
                          <span className="font-[family-name:'Cormorant_Garamond',serif] text-[18px] font-[500] text-[#0f0f0f] leading-none">
                            ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Items count */}
                        <td className="px-7 py-4">
                          <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/42">
                            {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-7 py-4">
                          <StatusBadge order={order} />
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-7 py-16 text-center">
                        <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[20px] font-[400] text-[#0f0f0f] mb-1.5">
                          No orders yet
                        </p>
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/35">
                          Orders will appear here once placed.
                        </p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default Dashboard;