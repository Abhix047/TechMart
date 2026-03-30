import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api.js";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Trash2, Edit, Package, Plus, Search,
  Tag, FolderOpen, X, ToggleLeft, ToggleRight, ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";

import { getImg } from "../../config";
const ease = [0.22, 1, 0.36, 1];

/* ── Delete confirm modal ── */
function DeleteModal({ product, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/25 backdrop-blur-[3px] z-[100]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onCancel}
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
              <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] mb-2 leading-snug">
                Delete this product?
              </h2>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/45 leading-relaxed mb-2">
                <span className="font-medium text-[#0f0f0f]">{product.name}</span>
              </p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 leading-relaxed mb-7">
                This action cannot be undone.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/50 border border-black/10 hover:bg-black/[0.025] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={onConfirm}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Product row ── */
function ProductRow({ product, index, onDelete, onToggleActive, togglingId }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px -40px" });
  const p      = product;
  // Removed local getImg in favor of centralized one
  const img    = p.images?.[0] ? getImg(p.images[0]) : null;
  const price      = p.discountPrice || p.price;
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;
  const discount    = hasDiscount
    ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
  const inStock = p.countInStock > 0;

  return (
    <motion.div
      ref={ref}
      className="group bg-white border border-black/[0.07] rounded-2xl overflow-hidden hover:border-black/[0.15] transition-colors duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 8) * 0.055, ease }}
    >
      <div className="flex flex-col md:flex-row gap-0 items-stretch">

        {/* ── Image ── */}
        <div className="w-full md:w-[110px] md:shrink-0 bg-[#f0ede8] overflow-hidden md:rounded-none">
          <div className="aspect-square md:w-[110px] md:h-full flex items-center justify-center relative">
            {img ? (
              <motion.img
                src={img} alt={p.name}
                className="w-full h-full object-contain mix-blend-multiply p-3"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6, ease }}
              />
            ) : (
              <Package size={24} className="text-black/18" strokeWidth={1} />
            )}
            {discount > 0 && (
              <span className="absolute top-2 left-2 font-[family-name:'DM_Sans',sans-serif] text-[9px] font-semibold text-white bg-[#0f0f0f] px-1.5 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* ── Main details ── */}
        <div className="flex-1 min-w-0 px-5 py-4 flex flex-col justify-between gap-3 border-l border-black/[0.055]">
          <div>
            {/* Name + ID */}
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-semibold text-[#0f0f0f] leading-snug">
                {p.name}
              </h3>
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.12em] text-black/28 bg-black/[0.04] border border-black/[0.06] px-2 py-0.5 rounded-full font-mono">
                {p._id.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Description */}
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-light text-black/45 leading-relaxed line-clamp-2 mb-3 max-w-2xl">
              {p.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/45 bg-[#f7f5f2] border border-black/[0.06] px-2.5 py-1 rounded-full">
                <Tag size={10} strokeWidth={1.5} className="text-black/28" /> {p.brand}
              </span>
              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/45 bg-[#f7f5f2] border border-black/[0.06] px-2.5 py-1 rounded-full">
                <FolderOpen size={10} strokeWidth={1.5} className="text-black/28" /> {p.category}
              </span>
            </div>
          </div>
        </div>

        {/* ── Price ── */}
        <div className="md:w-[130px] shrink-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end px-5 md:px-6 py-3 md:py-4 border-t md:border-t-0 border-l-0 md:border-l border-black/[0.055]">
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.16em] text-black/25 md:mb-2 hidden md:block">
            Price
          </span>
          <div className="flex md:flex-col items-baseline md:items-end gap-2 md:gap-0.5">
            <span className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] leading-none">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/28 line-through">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* ── Status + Actions ── */}
        <div className="md:w-[150px] shrink-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-stretch gap-3 px-5 md:px-5 py-3 md:py-4 border-t md:border-t-0 border-l-0 md:border-l border-black/[0.055]">
          {/* Stock badge */}
          <div className={`inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold rounded-full px-2.5 py-1.5 ${
            inStock
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200/60"
              : "text-red-600 bg-red-50 border border-red-200/60"
          }`}>
            <motion.span
              className={`w-[5px] h-[5px] rounded-full shrink-0 ${inStock ? "bg-emerald-500" : "bg-red-400"}`}
              animate={inStock ? { opacity: [1, 0.35, 1], scale: [1, 0.65, 1] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {inStock ? `${p.countInStock} in stock` : "Out of stock"}
          </div>

          {/* Active/Inactive Toggle */}
          <motion.button
            onClick={() => onToggleActive(p)}
            disabled={togglingId === p._id}
            title={p.isActive ? "Deactivate product" : "Activate product"}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
              p.isActive
                ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                : "bg-black/5 border-black/5 text-black/40 hover:bg-black/10"
            }`}
          >
            {togglingId === p._id ? (
              <motion.span
                className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            ) : p.isActive ? (
              <ToggleRight size={18} strokeWidth={1.5} />
            ) : (
              <ToggleLeft size={18} strokeWidth={1.5} />
            )}
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold">
              {p.isActive ? "Active" : "Inactive"}
            </span>
          </motion.button>

          {/* Edit + Delete */}
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/product/${p._id}/edit`}
              className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-black/50 bg-[#f7f5f2] border border-black/[0.07] hover:text-[#0f0f0f] hover:border-black/15 hover:bg-[#f0ede8] rounded-xl px-3 py-1.5 transition-all duration-200"
            >
              <Edit size={12} strokeWidth={1.5} /> Edit
            </Link>
            <motion.button
              onClick={() => onDelete(p)}
              className="w-8 h-8 flex items-center justify-center text-black/30 hover:text-red-500 hover:bg-red-50 border border-black/[0.07] hover:border-red-200/60 rounded-xl transition-all duration-200"
              whileTap={{ scale: 0.9 }}
              title="Delete"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════ MAIN ════════════════════ */
const ManageProducts = () => {
  const [products,   setProducts]   = useState([]);
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId,   setTogglingId]   = useState(null);

  useEffect(() => {
    // Admin needs to see ALL products to manage status
    API.get("/products/all")
      .then(({ data }) => setProducts(data))
      .catch(() => {
        // Fallback if /all doesn't exist yet
        API.get("/products").then(({ data }) => setProducts(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/products/${deleteTarget._id}`);
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleActiveStatus = async (product) => {
    setTogglingId(product._id);
    try {
      const { data } = await API.put(`/products/${product._id}`, {
        isActive: !product.isActive
      });
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
      toast.success(`Product ${data.isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = products.filter(p =>
    [p.name, p.brand, p.category].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] pb-20"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Delete modal */}
      <DeleteModal
        product={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 pt-10">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between mb-8 pb-7 border-b border-black/[0.08] flex-wrap gap-5"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <div>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-2.5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease }}
            >
              Admin · Inventory
            </motion.p>
            <motion.h1
              className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,44px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}
            >
              Manage <em className="italic font-[300]">Products</em>
            </motion.h1>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease }}
            >
              {loading ? "Loading…" : `${filtered.length} of ${products.length} products`}
            </motion.p>
          </div>

          {/* Search + Add */}
          <motion.div
            className="flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease }}
          >
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-56 bg-white border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/22 transition-colors duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/28 hover:text-black/55 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <Link
              to="/admin/add-product"
              className="flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-5 py-2.5 rounded-2xl hover:bg-black/80 transition-colors whitespace-nowrap"
            >
              <Plus size={13} /> New Product
            </Link>
          </motion.div>
        </motion.div>

        {/* ══ LOADING ══ */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-7 h-7 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* ══ PRODUCT LIST ══ */}
        {!loading && (
          <AnimatePresence>
            {filtered.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filtered.map((p, i) => (
                  <ProductRow
                    key={p._id}
                    product={p}
                    index={i}
                    onDelete={setDeleteTarget}
                    onToggleActive={toggleActiveStatus}
                    togglingId={togglingId}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-center bg-white border border-black/[0.07] rounded-3xl"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center mb-5">
                  <Package size={18} className="text-black/22" strokeWidth={1.5} />
                </div>
                <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[24px] font-[400] text-[#0f0f0f] mb-1.5">
                  No products found
                </p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/38 mb-8 max-w-[260px] leading-relaxed">
                  {search ? "Try a different search term." : "Add your first product to get started."}
                </p>
                <Link
                  to="/admin/add-product"
                  className="flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-6 py-3 rounded-2xl hover:bg-black/80 transition-colors"
                >
                  <Plus size={13} /> Add New Product
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default ManageProducts;