import { useEffect, useState } from "react";
import { getImg } from "../config";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  Package, Calendar, CreditCard, Truck,
  ArrowRight, Clock, MapPin, CheckCircle,
  CircleDashed, XCircle, ShoppingBag, ShieldCheck, ChevronDown,
  FileText, ExternalLink, RefreshCcw, Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateInvoice } from "../utils/invoiceHelper";

const ease = [0.22, 1, 0.36, 1];

const getOrderStatus = (order) => {
  if (order.isCancelled) return "cancelled";
  if (order.isDelivered)  return "delivered";
  if (order.isShipped)    return "shipped";
  if (order.isPaid)       return "processing";
  return "pending";
};

const STATUS_MAP = {
  delivered:  { label: "Delivered",  dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100", step: 3 },
  shipped:    { label: "In Transit", dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-100",    step: 2 },
  processing: { label: "Processing", dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-100",   step: 1 },
  pending:    { label: "Confirmed",  dot: "bg-black/40",    text: "text-black/60",    bg: "bg-black/5",    border: "border-black/5",     step: 0 },
  cancelled:  { label: "Cancelled",  dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50",     border: "border-red-100",     step: 0 },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    API.get("/orders/myorders")
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(order => {
    const status = getOrderStatus(order);
    if (activeTab === "all") return true;
    if (activeTab === "not-shipped") return status === "processing" || status === "pending";
    if (activeTab === "cancelled") return status === "cancelled";
    return true;
  });

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
      className="min-h-screen bg-[#f7f5f2] pt-32 sm:pt-40 pb-24 px-4 sm:px-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[1000px] mx-auto">

        {/* ══ HEADER ══ */}
        <div className="mb-10">
          <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(40px,5vw,54px)] font-[400] text-[#0f0f0f] leading-tight mb-8">
            Your <em className="italic font-[300]">Orders</em>
          </h1>

          {/* TABS & FILTERS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-black/[0.06] pb-1">
            <div className="flex items-center gap-8">
              {[
                { id: "all", label: "Orders" },
                { id: "not-shipped", label: "Not Yet Shipped" },
                { id: "cancelled", label: "Cancelled Orders" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-4 text-[13px] font-semibold transition-colors duration-200 ${
                    activeTab === tab.id ? "text-[#0f0f0f]" : "text-black/35 hover:text-black/60"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f0f0f]"
                      transition={{ duration: 0.3, ease }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto mb-2 sm:mb-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-xl shadow-sm text-[12px] font-medium text-black/60 cursor-pointer hover:bg-black/[0.02] transition-all">
                Past 1 Year <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* ══ EMPTY STATE ══ */}
        {filteredOrders.length === 0 && (
          <motion.div
            className="bg-white border border-black/[0.05] rounded-[2.5rem] p-16 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-[#f7f5f2] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={24} className="text-black/15" strokeWidth={1.2} />
            </div>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[400] text-[#0f0f0f] mb-3">
              No matching orders found
            </h2>
            <p className="text-[13px] text-black/35 mb-8">
              We couldn't find any orders in this category.
            </p>
            <button onClick={() => setActiveTab("all")} className="text-[12px] font-bold uppercase tracking-widest text-[#0f0f0f] border-b border-black/20 pb-1 hover:border-black transition-all">
              View all orders
            </button>
          </motion.div>
        )}

        {/* ══ ORDERS LIST ══ */}
        <div className="flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const status  = getOrderStatus(order);
              const sConfig = STATUS_MAP[status];

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease }}
                  className="bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* CARD HEADER (GRAY BAR) */}
                  <div className="bg-[#f6f6f6] px-6 py-4 border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-y-4">
                    <div className="flex flex-wrap items-center gap-x-10 gap-y-4 flex-1">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-1">Order Date</p>
                        <p className="text-[13px] font-bold text-[#0f0f0f]">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-1">Total Amount</p>
                        <p className="text-[13px] font-bold text-[#0f0f0f]">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-1">Ship To</p>
                        <p className="text-[13px] font-bold text-[#0f0f0f] flex items-center gap-1.5 cursor-pointer hover:text-black/60 transition-colors">
                          {order.shippingAddress?.city || "Customer"} <ChevronDown size={12} className="text-black/30" />
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-[11px] font-bold text-black/40 uppercase tracking-tight">Order: <span className="text-black/80 tracking-normal">#{order._id.slice(-10).toUpperCase()}</span></p>
                      <div className="flex items-center gap-2">
                        {status === "delivered" ? (
                          <button 
                            onClick={() => generateInvoice(order)}
                            className="px-4 py-1.5 bg-white border border-black/[0.1] rounded-lg text-[11px] font-bold text-black/60 hover:bg-black/[0.04] transition-all flex items-center gap-1.5"
                          >
                            <Download size={12} />
                            Download Invoice
                          </button>
                        ) : (
                          <Link 
                            to={`/order-detail/${order._id}`} 
                            className="px-4 py-1.5 bg-white border border-black/[0.1] rounded-lg text-[11px] font-bold text-black/60 hover:bg-black/[0.02] transition-all"
                          >
                            View Details
                          </Link>
                        )}
                        <Link to={`/order-detail/${order._id}`} className="px-4 py-1.5 bg-[#0f0f0f] text-white rounded-lg text-[11px] font-bold hover:bg-black/80 transition-all">View Order</Link>
                      </div>
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-8">
                    {/* Status Message */}
                    <div className="mb-8 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${sConfig.dot}`} />
                      <h3 className="text-[18px] font-bold text-[#0f0f0f]">
                        {status === 'delivered' ? `Delivered ${formatDate(order.deliveredAt || order.updatedAt)}` : sConfig.label}
                      </h3>
                    </div>

                    {/* Products */}
                    <div className="flex flex-col gap-8">
                      {order.orderItems?.map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#f9f9f9] border border-black/[0.04] rounded-2xl flex-shrink-0 overflow-hidden group/img">
                            {item.image ? (
                              <img
                                src={getImg(item.image)}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply p-2 transition-transform duration-500 group-hover/img:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-black/10"><Package size={40} strokeWidth={1} /></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pt-1">
                            <Link to={`/product/${item.product}`} className="text-[15px] sm:text-[17px] font-bold text-[#0f0f0f] leading-tight hover:text-black/60 transition-colors">
                              {item.name}
                            </Link>
                            <p className="text-[12px] text-black/35 mt-2 mb-5 leading-relaxed">
                              Qty: {item.qty} · Premium Quality · Certified Authentic
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-6 mt-auto">
                              <button className="flex items-center gap-2 text-[12px] font-bold text-[#0f0f0f] bg-black/[0.04] px-4 py-2 rounded-xl hover:bg-black/[0.08] transition-all">
                                <RefreshCcw size={13} strokeWidth={2.5} />
                                Buy it again
                              </button>
                              <Link to={`/product/${item.product}`} className="flex items-center gap-2 text-[12px] font-bold text-black/40 hover:text-black transition-all">
                                <ExternalLink size={13} strokeWidth={2.5} />
                                View Product
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
}