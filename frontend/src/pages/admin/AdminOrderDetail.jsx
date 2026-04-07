import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Package, MapPin, CreditCard, CheckCircle2,
  Truck, Receipt, Calendar, ShoppingBag,
  Shield, Zap, User, Mail, Phone, Clock, AlertCircle
} from "lucide-react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { getImg } from "../../config";

if (typeof document !== "undefined" && !document.getElementById("aod-fonts")) {
  const l = document.createElement("link");
  l.id = "aod-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

const STEPS = [
  { key: "placed", label: "Placed", Icon: Receipt },
  { key: "confirmed", label: "Confirmed", Icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: Package },
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // 'pay', 'confirm', 'ship', 'deliver'

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      toast.error("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type) => {
    setUpdating(type);
    const endpoints = { pay: "pay", confirm: "confirm", ship: "ship", deliver: "deliver" };
    try {
      const { data } = await API.put(`/orders/${id}/${endpoints[type]}`);
      setOrder(prev => ({ ...prev, ...data }));
      toast.success(`Order ${type === 'pay' ? (data.isPaid ? 'marked as paid' : 'marked as unpaid') : type + 'ed'} successfully`);
    } catch {
      toast.error("Update failed.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDeliveryDateUpdate = async (date) => {
    if (!date) return;
    setUpdating('delivery-date');
    try {
        const { data } = await API.put(`/orders/${id}/delivery-date`, { expectedDeliveryDate: date });
        setOrder(prev => ({ ...prev, ...data }));
        toast.success("Delivery date updated");
    } catch {
        toast.error("Failed to update delivery date");
    } finally {
        setUpdating(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <motion.div className="w-8 h-8 border-[1.5px] border-black/12 border-t-black/60 rounded-full"
        animate={{ rotate: 360 }} transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center p-10 text-center">
        <AlertCircle size={40} className="text-black/20 mb-4" />
        <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-2xl">Order Not Found</h2>
        <Link to="/admin/orders" className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/40 hover:text-black">Back to Orders</Link>
    </div>
  );

  const currentStep = order.isDelivered ? 3 : order.isShipped ? 2 : order.isConfirmed ? 1 : 0;

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-32 pt-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">

        {/* ── Header / Back ── */}
        <div className="flex items-center justify-between mb-8">
            <Link to="/admin/orders" className="flex items-center gap-2 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-widest text-black/35 hover:text-black transition-colors group">
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Orders
            </Link>
            <div className="flex items-center gap-3">
                {order.isCancelled && (
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100 italic">Cancelled</span>
                )}
                {!order.isCancelled && (
                    <div className="flex items-center gap-2">
                         {!order.isConfirmed && (
                            <button onClick={() => handleUpdate('confirm')} disabled={!!updating}
                                className="px-4 py-2 rounded-xl bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 transition-colors disabled:opacity-50">
                                Confirm Order
                            </button>
                         )}
                         {order.isConfirmed && !order.isShipped && (
                            <button onClick={() => handleUpdate('ship')} disabled={!!updating}
                                className="px-4 py-2 rounded-xl bg-blue-500 text-white text-[11px] font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
                                Mark Shipped
                            </button>
                         )}
                         {order.isShipped && !order.isDelivered && (
                            <button onClick={() => handleUpdate('deliver')} disabled={!!updating}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                Mark Delivered
                            </button>
                         )}
                    </div>
                )}
            </div>
        </div>

        {/* ── Hero Status ── */}
        <motion.div className="bg-[#0f0f0f] rounded-3xl p-8 sm:p-10 mb-5 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Administrative View</p>
                    <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-4xl sm:text-5xl text-white mb-2 italic font-light">#{order._id.slice(-8).toUpperCase()}</h1>
                    <div className="flex items-center gap-4 text-white/40 text-[12px]">
                        <span className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest mb-1">Expected Delivery</p>
                        <div className="flex items-center gap-2 justify-end">
                             <input 
                                type="date" 
                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white/80 outline-none focus:border-white/25 transition-colors [color-scheme:dark]"
                                value={(() => {
                                  try {
                                    return order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : '';
                                  } catch {
                                    return '';
                                  }
                                })()}
                                onChange={(e) => handleDeliveryDateUpdate(e.target.value)}
                                disabled={updating === 'delivery-date'}
                             />
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden sm:block" />
                    <div className="text-right">
                         <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest mb-2">Fulfilment</p>
                         <div className={`px-3 py-1 rounded-full border text-[11px] font-bold flex items-center gap-2 ${
                             order.isDelivered ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                             order.isShipped ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                             order.isConfirmed ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                             "bg-orange-500/10 border-orange-500/20 text-orange-400"
                         }`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${order.isDelivered ? "bg-emerald-400" : "bg-orange-400"} animate-pulse`} />
                             {order.isDelivered ? "Delivered" : order.isShipped ? "Shipped" : order.isConfirmed ? "Confirmed" : "Processing"}
                         </div>
                    </div>
                </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        </motion.div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left Col: Items & Payment */}
            <div className="lg:col-span-2 space-y-5">
                
                {/* Items */}
                <motion.div className="bg-white rounded-3xl border border-black/[0.06] overflow-hidden"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="px-6 py-5 border-b border-black/[0.05] flex items-center justify-between">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2"><ShoppingBag size={13}/> Order Items ({order.orderItems.length})</h3>
                    </div>
                    <div className="p-2 space-y-1">
                        {order.orderItems.map((item, i) => (
                            <div key={item._id || i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f7f5f2] transition-colors group">
                                <div className="w-16 h-16 rounded-xl bg-[#f0ede8] border border-black/[0.05] overflow-hidden shrink-0">
                                    <img src={getImg(item.image)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[14px] font-semibold text-[#0f0f0f] truncate">{item.name}</h4>
                                    <p className="text-[12px] text-black/40 flex flex-wrap items-center gap-x-2">
                                        Qty: {item.qty} × ₹{item.price.toLocaleString("en-IN")}
                                        {item.selectedColor && (
                                            <span className="flex items-center gap-1 border-l border-black/10 pl-2 ml-1">
                                                <div className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor.hex }} />
                                                {item.selectedColor.name}
                                            </span>
                                        )}
                                        {item.selectedStorage && (
                                            <span className="border-l border-black/10 pl-2 ml-1">
                                                {item.selectedStorage.size}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-[family-name:'Cormorant_Garamond',serif] text-xl font-medium text-[#0f0f0f]">₹{(item.qty * item.price).toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tracking Progress */}
                {!order.isCancelled && (
                    <motion.div className="bg-white rounded-3xl border border-black/[0.06] p-8"
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <div className="flex items-start justify-between relative">
                            <div className="absolute top-[18px] left-[5%] right-[5%] h-[1px] bg-black/[0.06]" />
                            <motion.div className="absolute top-[18px] left-[5%] h-[1px] bg-black origin-left" 
                                initial={{ scaleX: 0 }} animate={{ scaleX: currentStep / 3 }} transition={{ duration: 1 }} style={{ width: '90%' }} />
                            
                            {STEPS.map((step, i) => (
                                <div key={step.key} className="relative z-10 flex flex-col items-center gap-3 flex-1 text-center">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 ${i <= currentStep ? "bg-black border-black shadow-lg" : "bg-white border-black/10"}`}>
                                        <step.Icon size={14} className={i <= currentStep ? "text-white" : "text-black/20"} />
                                    </div>
                                    <span className={`text-[11px] font-bold ${i <= currentStep ? "text-black" : "text-black/30"}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>

            {/* Right Col: Customer & Payment Details */}
            <div className="space-y-5">
                
                {/* Customer Card */}
                <motion.div className="bg-white rounded-3xl border border-black/[0.06] p-6"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-5">Customer Information</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-lg">
                            {order.user?.name?.[0].toUpperCase() || 'G'}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[15px] font-bold text-[#0f0f0f] truncate">{order.user?.name || "Guest User"}</h4>
                            <p className="text-[12px] text-black/40 truncate flex items-center gap-1.5"><Mail size={11}/> {order.user?.email || "No email provided"}</p>
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-black/[0.05]">
                        <div className="flex items-start gap-3">
                            <MapPin size={14} className="text-black/30 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1.5">Shipping Address</p>
                                <p className="text-[13px] text-black/60 leading-relaxed font-medium">
                                    {order.shippingAddress?.address}<br/>
                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br/>
                                    {order.shippingAddress?.country}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Card */}
                <motion.div className="bg-white rounded-3xl border border-black/[0.06] p-6"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/30">Payment Details</h3>
                        <button onClick={() => handleUpdate('pay')} disabled={!!updating}
                            className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg border transition-all ${
                                order.isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"
                            }`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                        </button>
                    </div>
                    
                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center py-2 border-b border-black/[0.03]">
                            <span className="text-[13px] text-black/40">Method</span>
                            <span className="text-[13px] font-medium text-[#0f0f0f] flex items-center gap-1.5"><CreditCard size={12}/> {order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-black/[0.03]">
                            <span className="text-[13px] text-black/40">Commission</span>
                            <span className="text-[13px] font-medium text-[#0f0f0f]">₹0.00</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-black/[0.03]">
                            <span className="text-[13px] text-black/40">Shipping</span>
                            <span className="text-[13px] font-medium text-emerald-600">{order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="text-[14px] font-bold text-[#0f0f0f]">Grand Total</span>
                            <span className="font-[family-name:'Cormorant_Garamond',serif] text-2xl font-bold text-[#0f0f0f]">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                        </div>
                    </div>

                    {order.isPaid && (
                        <div className="mt-5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 size={14} />
                            </div>
                            <div className="min-w-0">
                                 <p className="text-[11px] font-bold text-emerald-700">Payment Verified</p>
                                <p className="text-[10px] text-emerald-600/70 truncate">
                                  {order.paidAt && !isNaN(new Date(order.paidAt)) 
                                    ? `${new Date(order.paidAt).toLocaleDateString()} at ${new Date(order.paidAt).toLocaleTimeString()}`
                                    : "Date not recorded"
                                  }
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Trust / Admin Info */}
                <div className="p-3 bg-black/5 rounded-2xl flex items-center gap-3 text-black/30 italic">
                    <Shield size={13}/>
                    <p className="text-[11px]">This data is secure and encrypted.</p>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}
