import { useState, useRef } from "react";
import API from "../../services/api.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Tag, Info, IndianRupee, Boxes, Settings,
  ImageIcon, Palette, Plus, Trash2, CheckCircle2,
  UploadCloud, X, Zap
} from "lucide-react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("ap-fonts")) {
  const l = document.createElement("link");
  l.id = "ap-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ease = [0.22, 1, 0.36, 1];

/* ── Shared input styles ── */
const inp = "w-full bg-[#f7f5f2] border border-black/[0.08] rounded-xl px-4 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[13.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/25 focus:bg-white transition-all duration-200";
const lbl = "block font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/38 mb-2";

/* ── Section card ── */
function Section({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      <div className="px-6 py-4 border-b border-black/[0.06] flex items-center gap-2.5">
        <Icon size={13} className="text-black/35" strokeWidth={1.5} />
        <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
          {title}
        </p>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "", brand: "", category: "", description: "",
    price: "", discountPrice: "", countInStock: "",
    images: [], colors: "",
  });
  const [specs,       setSpecs]       = useState([{ name: "", value: "" }]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing,setIsPublishing]= useState(false);
  const [dragOver,    setDragOver]    = useState(false);
  const fileRef = useRef(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (files) => {
    if (!files.length) return;
    setIsUploading(true);
    const fd = new FormData();
    for (const f of files) fd.append("images", f);
    try {
      const { data } = await API.post("/products/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm(prev => ({ ...prev, images: [...prev.images, ...data] }));
    } catch {
      toast.error("Failed to upload images.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = idx =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const addSpec    = () => setSpecs([...specs, { name: "", value: "" }]);
  const removeSpec = idx => setSpecs(specs.filter((_, i) => i !== idx));
  const handleSpec = (idx, field, val) => {
    const u = [...specs]; u[idx][field] = val; setSpecs(u);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    const payload = {
      ...form,
      price:        Number(form.price),
      discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
      countInStock: Number(form.countInStock),
      colors:       form.colors ? form.colors.split(",").map(c => c.trim()) : [],
      specifications: specs.filter(s => s.name && s.value),
    };
    try {
      await API.post("/products", payload);
      toast.success("Product published!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating product");
    } finally {
      setIsPublishing(false);
    }
  };

  const discount = form.price && form.discountPrice
    ? Math.round(((Number(form.price) - Number(form.discountPrice)) / Number(form.price)) * 100)
    : 0;

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] pb-20"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
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
              transition={{ duration: 0.45, delay: 0.06, ease }}
            >
              Admin · Products
            </motion.p>
            <motion.h1
              className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,44px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}
            >
              Add New <em className="italic font-[300]">Product</em>
            </motion.h1>
            <motion.p
              className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease }}
            >
              Configure details, pricing, media and specifications.
            </motion.p>
          </div>

          {/* Publish button — desktop */}
          <motion.button
            type="button"
            onClick={submitHandler}
            disabled={isPublishing}
            className="hidden md:flex items-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold px-6 py-3 rounded-2xl hover:bg-black/80 disabled:bg-black/20 disabled:text-black/30 transition-all duration-200"
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease }}
          >
            {isPublishing ? (
              <motion.span className="w-4 h-4 border-[1.5px] border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
            ) : <Zap size={13} />}
            {isPublishing ? "Publishing…" : "Publish Product"}
          </motion.button>
        </motion.div>

        {/* ══ GRID ══ */}
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

            {/* LEFT */}
            <div className="flex flex-col gap-5">

              {/* Basic info */}
              <Section icon={Info} title="Basic Information" delay={0.1}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={lbl}>Product Name</label>
                    <input name="name" placeholder="e.g. iPhone 15 Pro Max" onChange={handleChange} className={inp} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Brand</label>
                      <input name="brand" placeholder="e.g. Apple" onChange={handleChange} className={inp} required />
                    </div>
                    <div>
                      <label className={lbl}>Category</label>
                      <input name="category" placeholder="e.g. Smartphones" onChange={handleChange} className={inp} required />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Description</label>
                    <textarea
                      name="description"
                      placeholder="Detailed product description…"
                      onChange={handleChange}
                      rows={4}
                      className={`${inp} resize-y min-h-[110px]`}
                      required
                    />
                  </div>
                </div>
              </Section>

              {/* Specifications */}
              <Section icon={Settings} title="Specifications" delay={0.16}>
                <div className="flex flex-col gap-2.5">
                  {/* Column headers */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_32px] gap-3 mb-0.5">
                    <span className={lbl}>Property</span>
                    <span className={lbl}>Value</span>
                    <span />
                  </div>

                  <AnimatePresence>
                    {specs.map((spec, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-2.5 items-center"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease }}
                      >
                        <input
                          placeholder="e.g. Processor"
                          value={spec.name}
                          onChange={e => handleSpec(i, "name", e.target.value)}
                          className={`${inp} flex-1`}
                        />
                        <input
                          placeholder="e.g. A17 Pro"
                          value={spec.value}
                          onChange={e => handleSpec(i, "value", e.target.value)}
                          className={`${inp} flex-1`}
                        />
                        {specs.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeSpec(i)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl text-black/30 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={addSpec}
                    className="flex items-center gap-1.5 mt-2 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/45 hover:text-[#0f0f0f] hover:bg-black/[0.04] px-3 py-2 rounded-xl transition-all duration-200 w-fit"
                  >
                    <Plus size={13} /> Add Specification
                  </button>
                </div>
              </Section>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5">

              {/* Images */}
              <Section icon={ImageIcon} title="Product Images" delay={0.12}>
                {/* Drop zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer mb-4 ${
                    dragOver
                      ? "border-[#0f0f0f]/40 bg-black/[0.03]"
                      : "border-black/12 hover:border-black/22 hover:bg-black/[0.02]"
                  }`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    type="file" multiple accept="image/*"
                    onChange={e => handleImageUpload(e.target.files)}
                    ref={fileRef} className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center py-8 gap-2.5">
                    {isUploading ? (
                      <>
                        <motion.div className="w-6 h-6 border-[1.5px] border-black/15 border-t-black/50 rounded-full"
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/38">Uploading…</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={22} className="text-black/28" strokeWidth={1.5} />
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/45">
                          Drop images or click to upload
                        </span>
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/28">
                          PNG, JPG up to 10MB
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview grid */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5">
                    <AnimatePresence>
                      {form.images.map((img, i) => (
                        <motion.div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden border border-black/[0.07] bg-[#f0ede8] group"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.28, ease }}
                        >
                          <img
                            src={`${BASE_URL}${img}`}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover mix-blend-multiply p-1"
                          />
                          <motion.button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#0f0f0f]/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            whileTap={{ scale: 0.9 }}
                          >
                            <X size={11} />
                          </motion.button>
                          {i === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 font-[family-name:'DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] text-white bg-[#0f0f0f]/65 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                              Main
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </Section>

              {/* Pricing */}
              <Section icon={IndianRupee} title="Pricing" delay={0.18}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={lbl}>Regular Price (₹)</label>
                    <input name="price" type="number" placeholder="0" onChange={handleChange} className={inp} required />
                  </div>
                  <div>
                    <label className={lbl}>Discount Price (₹)</label>
                    <input name="discountPrice" type="number" placeholder="0" onChange={handleChange} className={inp} />
                  </div>

                  {/* Discount preview */}
                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div
                        className="flex items-center justify-between bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-3"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease }}
                      >
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-emerald-700">
                          Customer saves
                        </span>
                        <span className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-emerald-700">
                          {discount}% off
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Section>

              {/* Inventory & Variants */}
              <Section icon={Boxes} title="Inventory & Variants" delay={0.22}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={lbl}>Stock Quantity</label>
                    <input name="countInStock" type="number" placeholder="e.g. 50" onChange={handleChange} className={inp} required />
                  </div>
                  <div>
                    <label className={lbl}>Available Colors</label>
                    <div className="relative">
                      <Palette size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" strokeWidth={1.5} />
                      <input
                        name="colors"
                        placeholder="Black, Silver, Blue"
                        onChange={handleChange}
                        className={`${inp} pl-9`}
                      />
                    </div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/30 mt-1.5">
                      Separate multiple colors with a comma
                    </p>
                  </div>
                </div>
              </Section>

              {/* Publish — mobile */}
              <motion.button
                type="submit"
                disabled={isPublishing}
                className="md:hidden w-full flex items-center justify-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold py-3.5 rounded-2xl hover:bg-black/80 disabled:bg-black/15 disabled:text-black/25 transition-all duration-200"
                whileTap={{ scale: 0.985 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.30 }}
              >
                {isPublishing ? (
                  <motion.span className="w-4 h-4 border-[1.5px] border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                ) : <Zap size={13} />}
                {isPublishing ? "Publishing…" : "Publish Product"}
              </motion.button>
            </div>
          </div>
        </form>
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default AddProduct;