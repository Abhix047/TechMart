import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Package, ArrowRight, ShoppingBag, Truck, Calendar } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

export default function Order() {
  const { id } = useParams();

  // Current date for estimated delivery
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-start pt-30 lg:pt-20 p-6 sm:p-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[850px] w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">

        {/* SUCCESS CARD */}
        <motion.div
          className="bg-white border border-black/[0.06] rounded-[2rem] p-10 md:p-12 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {/* Animated Checkmark */}
          <motion.div
            className="w-20 h-20 rounded-full bg-[#0f0f0f] flex items-center justify-center mb-8 shadow-xl"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Check size={36} strokeWidth={2.5} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.p
            className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-bold uppercase tracking-[0.3em] text-black/25 mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          >
            Transaction Confirmed
          </motion.p>

          <motion.h1
            className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(32px,4vw,48px)] font-[400] text-[#0f0f0f] leading-[0.95] mb-5"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          >
            Your Order is <em className="italic font-[300]">Successful</em>
          </motion.h1>

          <motion.p
            className="text-[14px] text-black/45 max-w-sm mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          >
            Thank you for choosing TechMart. We've received your request and are preparing your package for delivery.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          >
            <Link
              to="/orders"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0f0f0f] text-white px-6 py-3.5 rounded-xl font-semibold text-[13px] hover:bg-black/85 transition-all shadow-lg hover:shadow-black/20"
            >
              <Truck size={14} strokeWidth={1.5} />
              Track
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black border border-black/10 px-6 py-3.5 rounded-xl font-semibold text-[13px] hover:bg-black/[0.03] transition-all"
            >
              Back
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </motion.div>

        {/* DETAILS SIDEBAR */}
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          {/* Order ID Card */}
          <div className="bg-white border border-black/[0.06] rounded-[1.8rem] p-7 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-black/[0.03] flex items-center justify-center">
                <ShoppingBag size={12} className="text-black/40" />
              </div>
              <p className="font-semibold text-[10.5px] uppercase tracking-wider text-black/35">Identity</p>
            </div>
            <div className="bg-[#f7f5f2] rounded-xl p-4 border border-black/[0.04]">
              <p className="text-[9px] uppercase font-bold tracking-widest text-black/25 mb-1">Unique ID</p>
              <p className="font-mono text-[14px] font-bold text-[#0f0f0f] break-all tracking-tight">
                {id}
              </p>
            </div>
          </div>

          {/* Logistics Card */}
          <div className="bg-[#0f0f0f] rounded-[1.8rem] p-7 text-white shadow-xl flex-1 relative overflow-hidden">

            {/* Background Accent */}
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Calendar size={14} className="text-white/60" />
                </div>
                <p className="font-semibold text-[12px] uppercase tracking-wider text-white/40">Logistics Timeline</p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-px bg-white/10 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white mb-1">Estimated Delivery</p>
                    <p className="text-[12px] text-white/50">{formattedDelivery}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-px bg-white/10 relative" />
                  <div>
                    <p className="text-[13px] font-semibold text-white/30 mb-1">Processing Package</p>
                    <p className="text-[11px] text-white/20 italic">Preparing for dispatch</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-white/30">
                  <Package size={14} />
                  <p className="text-[11px] font-medium tracking-wide italic">Handcrafted with care</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
}