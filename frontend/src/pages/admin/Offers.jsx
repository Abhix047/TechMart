import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Tag, X,
  CheckCircle2, Percent, Package, Search, Zap, ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";

import { getImg } from "../../config";
const ease = [0.22, 1, 0.36, 1];
const lbl  = "block font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/38 mb-2";
const inp  = "w-full bg-[#f7f5f2] border border-black/[0.08] rounded-xl px-4 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[13.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/25 focus:bg-white transition-all duration-200";

export default function Offers() {
  const [offers,           setOffers]           = useState([]);
  const [products,         setProducts]         = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [modalOpen,        setModalOpen]        = useState(false);
  const [editingOffer,     setEditingOffer]      = useState(null);
  const [deleteTarget,     setDeleteTarget]     = useState(null);
  const [isSaving,         setIsSaving]         = useState(false);
  const [searchProduct,    setSearchProduct]    = useState("");

  /* form state */
  const [name,               setName]               = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isActive,           setIsActive]           = useState(true);
  const [selectedProducts,   setSelectedProducts]   = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [o, p] = await Promise.all([API.get("/offers"), API.get("/products")]);
      setOffers(o.data); setProducts(p.data);
    } catch { toast.error("Failed to load data."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setName(offer.name);
      setDiscountPercentage(offer.discountPercentage);
      setIsActive(offer.isActive);
      setSelectedProducts(offer.products?.map(p => p._id) || []);
    } else {
      setEditingOffer(null);
      setName(""); setDiscountPercentage(""); setIsActive(true); setSelectedProducts([]);
    }
    setSearchProduct("");
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingOffer(null); };

  const toggleProduct = (id) =>
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !discountPercentage) return toast.error("Name and discount are required.");
    setIsSaving(true);
    try {
      const payload = { name, discountPercentage: Number(discountPercentage), isActive, products: selectedProducts };
      if (editingOffer) {
        await API.put(`/offers/${editingOffer._id}`, payload);
        toast.success("Offer updated!");
      } else {
        await API.post("/offers", payload);
        toast.success("Offer created!");
      }
      closeModal(); fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save offer.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/offers/${deleteTarget._id}`);
      toast.success("Offer deleted."); fetchData();
    } catch { toast.error("Failed to delete offer."); }
    finally { setDeleteTarget(null); }
  };

  const filteredProducts = products.filter(p =>
    [p.name, p.category].some(v => v?.toLowerCase().includes(searchProduct.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══ DELETE MODAL ══ */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/25 backdrop-blur-[3px] z-[100]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setDeleteTarget(null)}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
              <motion.div
                className="bg-white rounded-2xl p-7 w-full max-w-[380px] border border-black/[0.07]"
                initial={{ opacity: 0, scale: 0.93, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                  <Trash2 size={15} className="text-red-500" />
                </div>
                <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] mb-2">Delete offer?</h2>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] mb-1">{deleteTarget.name}</p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mb-7">Product prices will be restored.</p>
                <div className="flex gap-2.5">
                  <button onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/50 border border-black/10 hover:bg-black/[0.025] transition-colors">
                    Cancel
                  </button>
                  <motion.button onClick={confirmDelete} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ══ CREATE/EDIT MODAL ══ */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/25 backdrop-blur-[3px] z-[100]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeModal}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div
                className="bg-white rounded-2xl w-full max-w-[620px] border border-black/[0.07] flex flex-col max-h-[88vh] overflow-hidden"
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.32, ease }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.06]">
                  <div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-1">
                      {editingOffer ? "Edit Offer" : "New Offer"}
                    </p>
                    <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] leading-none">
                      {editingOffer ? "Update details" : "Create a new offer"}
                    </h2>
                  </div>
                  <motion.button onClick={closeModal} whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center text-black/35 hover:text-black/65 transition-colors">
                    <X size={15} />
                  </motion.button>
                </div>

                {/* Modal body */}
                <div className="flex-1 overflow-y-auto px-7 py-6">
                  <form id="offerForm" onSubmit={handleSave} className="flex flex-col gap-5">

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Offer Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                          placeholder="e.g. Summer Clearance" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Discount (%)</label>
                        <div className="relative">
                          <Percent size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" strokeWidth={1.5} />
                          <input type="number" min="0" max="100" value={discountPercentage}
                            onChange={e => setDiscountPercentage(e.target.value)}
                            placeholder="20" className={`${inp} pl-9`} />
                        </div>
                      </div>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsActive(v => !v)}>
                      <div className={`w-10 h-[22px] rounded-full p-0.5 transition-colors duration-250 cursor-pointer ${isActive ? "bg-[#0f0f0f]" : "bg-black/10"}`}>
                        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-250 ${isActive ? "translate-x-[18px]" : "translate-x-0"}`} />
                      </div>
                      <div>
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f]">
                          {isActive ? "Offer is Active" : "Offer is Inactive"}
                        </p>
                        <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/36">
                          Discounts apply to customers immediately when active.
                        </p>
                      </div>
                    </div>

                    {/* Product picker */}
                    <div>
                      <label className={lbl}>
                        Products ({selectedProducts.length} selected)
                      </label>
                      <div className="border border-black/[0.07] rounded-2xl overflow-hidden bg-white">
                        {/* Search */}
                        <div className="px-3 pt-3 pb-2 border-b border-black/[0.055]">
                          <div className="relative">
                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" strokeWidth={1.5} />
                            <input type="text" placeholder="Search products…"
                              value={searchProduct} onChange={e => setSearchProduct(e.target.value)}
                              className="w-full bg-[#f7f5f2] border border-black/[0.07] rounded-xl pl-8 pr-3 py-2 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/20 transition-colors" />
                          </div>
                        </div>

                        {/* Product list */}
                        <div className="max-h-[200px] overflow-y-auto p-2 flex flex-col gap-0.5">
                          {filteredProducts.map(p => {
                            const sel = selectedProducts.includes(p._id);
                            // Removed local getImg in favor of centralized one
                            const img = getImg(p.images?.[0]);
                            return (
                              <label key={p._id}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 ${sel ? "bg-[#0f0f0f]" : "hover:bg-[#f7f5f2]"}`}
                              >
                                <div className={`w-[15px] h-[15px] rounded-[4px] border flex items-center justify-center shrink-0 transition-all ${sel ? "bg-white border-white" : "border-black/18"}`}>
                                  {sel && (
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                      <path d="M1 4L3 6L7 2" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <input type="checkbox" className="hidden" checked={sel} onChange={() => toggleProduct(p._id)} />
                                <div className="w-8 h-8 rounded-lg bg-[#f0ede8] border border-black/[0.06] flex-shrink-0 overflow-hidden">
                                  {img ? <img src={img} className="w-full h-full object-contain mix-blend-multiply p-0.5" alt="" /> : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium truncate ${sel ? "text-white" : "text-[#0f0f0f]"}`}>{p.name}</p>
                                  <p className={`font-[family-name:'DM_Sans',sans-serif] text-[10.5px] uppercase tracking-[0.1em] ${sel ? "text-white/50" : "text-black/32"}`}>{p.category}</p>
                                </div>
                                <span className={`font-[family-name:'Cormorant_Garamond',serif] text-[15px] font-[500] shrink-0 ${sel ? "text-white/75" : "text-black/45"}`}>
                                  ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                                </span>
                              </label>
                            );
                          })}
                          {filteredProducts.length === 0 && (
                            <p className="px-3 py-5 text-center font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/30">
                              No products match your search.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                  </form>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-black/[0.06] bg-[#faf9f7]">
                  <button onClick={closeModal}
                    className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/48 border border-black/10 bg-white hover:bg-black/[0.025] rounded-2xl px-5 py-2.5 transition-colors">
                    Cancel
                  </button>
                  <motion.button form="offerForm" type="submit" disabled={isSaving} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-6 py-2.5 rounded-2xl hover:bg-black/80 disabled:bg-black/20 disabled:text-black/30 transition-colors">
                    {isSaving ? (
                      <motion.span className="w-4 h-4 border-[1.5px] border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                    ) : <Zap size={13} />}
                    {isSaving ? "Saving…" : editingOffer ? "Update Offer" : "Create Offer"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 pt-10">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between mb-8 pb-7 border-b border-black/[0.08]"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <div>
            <motion.p
 className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-2.5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease }}>
              Admin · Marketing
            </motion.p>
            <motion.h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,44px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}>
              Promotional <em className="italic font-[300]">Offers</em>
            </motion.h1>
            <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease }}>
              {loading ? "Loading…" : `${offers.length} offer${offers.length !== 1 ? "s" : ""} active`}
            </motion.p>
          </div>

          <motion.button onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-5 py-2.5 rounded-2xl hover:bg-black/80 transition-colors"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={13} /> New Offer
          </motion.button>
        </motion.div>

        {/* ══ LOADING ══ */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div className="w-7 h-7 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
          </div>
        )}

        {/* ══ OFFERS GRID ══ */}
        {!loading && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {offers.map((offer, i) => (
                <motion.div
                  key={offer._id}
                  className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden hover:border-black/[0.15] transition-colors duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease }}
                >
                  {/* Card top */}
                  <div className="px-5 pt-5 pb-4 flex items-start justify-between border-b border-black/[0.055]">
                    {/* Status */}
                    <div className={`flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold rounded-full px-2.5 py-1.5 ${
                      offer.isActive
                        ? "text-emerald-700 bg-emerald-50 border border-emerald-200/60"
                        : "text-black/38 bg-[#f7f5f2] border border-black/[0.07]"
                    }`}>
                      {offer.isActive && (
                        <motion.span className="w-[5px] h-[5px] rounded-full bg-emerald-500 shrink-0"
                          animate={{ opacity: [1, 0.35, 1], scale: [1, 0.65, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
                      )}
                      {offer.isActive ? "Active" : "Inactive"}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <motion.button onClick={() => openModal(offer)} whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 flex items-center justify-center text-black/30 hover:text-[#0f0f0f] hover:bg-[#f7f5f2] border border-black/[0.07] rounded-xl transition-all duration-200">
                        <Edit2 size={12} strokeWidth={1.5} />
                      </motion.button>
                      <motion.button onClick={() => setDeleteTarget(offer)} whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 flex items-center justify-center text-black/30 hover:text-red-500 hover:bg-red-50 border border-black/[0.07] hover:border-red-200/60 rounded-xl transition-all duration-200">
                        <Trash2 size={12} strokeWidth={1.5} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4 flex-1">
                    <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[14.5px] font-semibold text-[#0f0f0f] mb-3 line-clamp-1">
                      {offer.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:'Cormorant_Garamond',serif] text-[42px] font-[400] text-[#0f0f0f] leading-none">
                        {offer.discountPercentage}
                      </span>
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[16px] font-medium text-black/40 mb-1">
                        % off
                      </span>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="px-5 py-3.5 bg-[#faf9f7] border-t border-black/[0.055] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/42">
                      <Package size={12} strokeWidth={1.5} className="text-black/28" />
                      {offer.products?.length || 0} product{(offer.products?.length || 0) !== 1 ? "s" : ""}
                    </div>
                    <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold text-black/22 font-mono uppercase tracking-[0.1em]">
                      {offer._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ══ EMPTY STATE ══ */}
        {!loading && offers.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center bg-white border border-black/[0.07] rounded-3xl"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center mb-5">
              <Tag size={18} className="text-black/22" strokeWidth={1.5} />
            </div>
            <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[24px] font-[400] text-[#0f0f0f] mb-1.5">
              No offers yet
            </p>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/38 mb-8 leading-relaxed max-w-[240px]">
              Create your first promotional offer to start discounting products.
            </p>
            <motion.button onClick={() => openModal()}
              className="flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-6 py-3 rounded-2xl hover:bg-black/80 transition-colors"
              whileTap={{ scale: 0.97 }}>
              <Plus size={13} /> Create First Offer
            </motion.button>
          </motion.div>
        )}
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; } ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:8px}`}</style>
    </div>
  );
}