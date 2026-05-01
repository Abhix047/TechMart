import { useState, useEffect } from "react";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Tag, Percent, 
  Calendar, Info, AlertCircle, CheckCircle2, 
  X, Loader2, IndianRupee
} from "lucide-react";
import toast from "react-hot-toast";

const ease = [0.22, 1, 0.36, 1];

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: "",
    minAmount: 0,
    expiryDate: "",
    usageLimit: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get("/coupons");
      setCoupons(data);
    } catch (err) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/coupons", {
        ...formData,
        usageLimit: formData.usageLimit || null,
        discountAmount: Number(formData.discountAmount),
        minAmount: Number(formData.minAmount),
      });
      toast.success("Coupon created successfully");
      setShowModal(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountAmount: "",
        minAmount: 0,
        expiryDate: "",
        usageLimit: "",
      });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await API.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

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
    <div className="max-w-[1200px] mx-auto px-6 sm:px-10 pt-20 lg:pt-10 pb-32">
      
      {/* HEADER */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-10 border-b border-black/[0.08]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="max-w-2xl">
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-3">
            Management · Rewards
          </p>
          <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(36px,5vw,54px)] font-[400] text-[#0f0f0f] leading-[0.95]">
            Discount <em className="italic font-[300]">Coupons</em>
          </h1>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] text-black/45 mt-4 leading-relaxed">
            Create, track and manage promotional codes to drive sales and customer loyalty.
          </p>
        </div>

        <motion.button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold px-6 py-3.5 rounded-xl hover:bg-black/85 transition-all shadow-sm shrink-0"
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={15} /> Create Coupon
        </motion.button>
      </motion.div>

      {/* COUPONS LIST */}
      {coupons.length === 0 ? (
        <motion.div 
          className="bg-white border border-black/[0.05] rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="w-16 h-16 bg-[#f7f5f2] rounded-2xl flex items-center justify-center mb-6">
            <Percent size={28} className="text-black/15" strokeWidth={1.2} />
          </div>
          <h3 className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] text-[#0f0f0f] mb-3">No Active Coupons</h3>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] text-black/35 max-w-sm mb-8 leading-relaxed">
            Create your first discount code to start offering promotions to your customers.
          </p>
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-8 py-3.5 rounded-xl hover:bg-black/85 transition-all"
            whileTap={{ scale: 0.97 }}
          >
            Create Your First Coupon
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {coupons.map((coupon, i) => (
              <motion.div
                key={coupon._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] group hover:border-black/20 transition-all duration-300 flex flex-col h-full"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#f7f5f2] border border-black/[0.05] flex items-center justify-center">
                      <Tag size={16} className="text-black/40" />
                    </div>
                    <div className="flex items-center gap-2">
                      {new Date(coupon.expiryDate) < new Date() ? (
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">Expired</span>
                      ) : coupon.isActive ? (
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Active</span>
                      ) : (
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-bold uppercase tracking-wider text-black/30 bg-black/5 px-2 py-0.5 rounded border border-black/5">Inactive</span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[20px] font-bold text-[#0f0f0f] tracking-tight mb-1">
                    {coupon.code}
                  </h3>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mb-5">
                    {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-black/[0.04]">
                    <div className="flex items-center gap-2.5 text-black/45">
                      <IndianRupee size={13} strokeWidth={1.5} />
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px]">Min. Order: ₹{coupon.minAmount}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-black/45">
                      <Calendar size={13} strokeWidth={1.5} />
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px]">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-black/45">
                      <Info size={13} strokeWidth={1.5} />
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px]">Used: {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '(Unlimited)'}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#faf9f7] border-t border-black/[0.04] flex justify-end">
                  <button 
                    onClick={() => handleDelete(coupon._id)}
                    className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[200]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.4, ease }}
              >
              <div className="px-8 py-6 border-b border-black/[0.06] flex items-center justify-between bg-[#faf9f7]">
                <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[24px] font-[500] text-[#0f0f0f]">
                  New <em className="italic font-[300]">Coupon</em>
                </h2>
                <button onClick={() => setShowModal(false)} className="text-black/25 hover:text-black transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-bold uppercase tracking-wider text-black/35 mb-2">Coupon Code</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. FESTIVE20"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full bg-[#f7f5f2] border-none rounded-xl px-4 py-3 font-[family-name:'DM_Sans',sans-serif] text-[14px] text-[#0f0f0f] outline-none focus:ring-1 focus:ring-black/10 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-bold uppercase tracking-wider text-black/35 mb-2">Type</label>
                    <select 
                      value={formData.discountType}
                      onChange={e => setFormData({...formData, discountType: e.target.value})}
                      className="w-full bg-[#f7f5f2] border-none rounded-xl px-4 py-3 font-[family-name:'DM_Sans',sans-serif] text-[14px] text-[#0f0f0f] outline-none focus:ring-1 focus:ring-black/10 transition-all appearance-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-bold uppercase tracking-wider text-black/35 mb-2">Discount Value</label>
                    <input 
                      required
                      type="number" 
                      value={formData.discountAmount}
                      onChange={e => setFormData({...formData, discountAmount: e.target.value})}
                      className="w-full bg-[#f7f5f2] border-none rounded-xl px-4 py-3 font-[family-name:'DM_Sans',sans-serif] text-[14px] text-[#0f0f0f] outline-none focus:ring-1 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-bold uppercase tracking-wider text-black/35 mb-2">Min. Order (₹)</label>
                    <input 
                      type="number" 
                      value={formData.minAmount}
                      onChange={e => setFormData({...formData, minAmount: e.target.value})}
                      className="w-full bg-[#f7f5f2] border-none rounded-xl px-4 py-3 font-[family-name:'DM_Sans',sans-serif] text-[14px] text-[#0f0f0f] outline-none focus:ring-1 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-bold uppercase tracking-wider text-black/35 mb-2">Usage Limit</label>
                    <input 
                      type="number" 
                      placeholder="Unlimited if empty"
                      value={formData.usageLimit}
                      onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full bg-[#f7f5f2] border-none rounded-xl px-4 py-3 font-[family-name:'DM_Sans',sans-serif] text-[14px] text-[#0f0f0f] outline-none focus:ring-1 focus:ring-black/10 transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-bold uppercase tracking-wider text-black/35 mb-2">Expiry Date</label>
                    <input 
                      required
                      type="date" 
                      value={formData.expiryDate}
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full bg-[#f7f5f2] border-none rounded-xl px-4 py-3 font-[family-name:'DM_Sans',sans-serif] text-[14px] text-[#0f0f0f] outline-none focus:ring-1 focus:ring-black/10 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-black/5 text-black/60 font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold py-4 rounded-xl hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold py-4 rounded-xl hover:bg-black/85 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Create Coupon"}
                  </button>
                </div>
              </form>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default AdminCoupons;
