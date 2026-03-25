import { useEffect, useState } from "react";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, ImageIcon, Film, X, Zap, Trash2,
  Pencil, PlusCircle, ChevronRight, ToggleLeft, ToggleRight
} from "lucide-react";
import toast from "react-hot-toast";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("ab-fonts")) {
  const l = document.createElement("link");
  l.id = "ab-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

import { getImg } from "../../config";
const ease = [0.22, 1, 0.36, 1];
const lbl  = "block font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/38 mb-2";
const inp  = "w-full bg-[#f7f5f2] border border-black/[0.08] rounded-xl px-4 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[13.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/25 focus:bg-white transition-all duration-200";

/* ── Delete confirm modal ── */
function DeleteModal({ banner, onConfirm, onCancel }) {
  if (!banner) return null;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-[3px] z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }} onClick={onCancel} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
        <motion.div className="bg-white rounded-2xl p-7 w-full max-w-[360px] border border-black/[0.07]"
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.3, ease }}
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center mb-5">
            <Trash2 size={15} className="text-red-500" />
          </div>
          <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] mb-1.5 leading-snug">
            Delete this banner?
          </h2>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mb-7">
            <strong className="text-black/70">&ldquo;{banner.title}&rdquo;</strong> will be permanently removed.
          </p>
          <div className="flex gap-2.5">
            <button onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/50 border border-black/10 hover:bg-black/[0.025] transition-colors">
              Cancel
            </button>
            <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
              Delete
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Edit modal ── */
function EditModal({ banner, onSave, onCancel }) {
  const [title,      setTitle]      = useState(banner?.title || "");
  const [subHeading, setSubHeading] = useState(banner?.subHeading || "");
  const [order,      setOrder]      = useState(banner?.order || 0);
  const [file,       setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver,setDragOver]= useState(false);

  if (!banner) return null;

  const handleFile = (f) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };
  const clear = () => { setFile(null); setPreview(null); };

  const save = async () => {
    if (!title.trim()) return toast.error("Title is required.");
    setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("subHeading", subHeading);
    fd.append("order", order);
    if (file) fd.append("media", file);
    try {
      const { data } = await API.put(`/banners/${banner._id}`, fd);
      toast.success("Banner updated!");
      onSave(data);
    } catch {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-[3px] z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }} onClick={onCancel} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
        <motion.div className="bg-white rounded-2xl w-full max-w-[480px] border border-black/[0.07] overflow-hidden"
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.3, ease }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-7 py-5 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Pencil size={13} className="text-black/35" />
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
                Edit Banner
              </p>
            </div>
            <button onClick={onCancel} className="text-black/30 hover:text-black/60 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="p-7 flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className={lbl}>Banner Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Summer Sale 2026" className={inp} />
            </div>

            <div>
              <label className={lbl}>Sub Heading</label>
              <input type="text" value={subHeading} onChange={e => setSubHeading(e.target.value)}
                placeholder="e.g. Up to 50% Off" className={inp} />
            </div>

            <div>
              <label className={lbl}>Position / Order</label>
              <input type="number" value={order} onChange={e => setOrder(e.target.value)}
                placeholder="0" className={inp} />
            </div>

            {/* Media replacement */}
            <div>
              <label className={lbl}>Replace Media (optional)</label>
              <AnimatePresence mode="wait">
                {!preview ? (
                  <motion.label key="drop" htmlFor="edit-banner-file"
                    className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-8 cursor-pointer transition-all duration-200 ${
                      dragOver ? "border-[#0f0f0f]/35 bg-black/[0.03]" : "border-black/12 hover:border-black/22 hover:bg-black/[0.02]"
                    }`}
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                  >
                    <input id="edit-banner-file" type="file" accept="image/*,video/*"
                      onChange={e => handleFile(e.target.files[0])} className="hidden" />
                    <div className="w-10 h-10 rounded-xl bg-[#f0ede8] border border-black/[0.06] flex items-center justify-center">
                      <Upload size={15} className="text-black/30" strokeWidth={1.5} />
                    </div>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/40">
                      Drop or <span className="text-[#0f0f0f] underline underline-offset-2">browse</span> to replace
                    </p>
                  </motion.label>
                ) : (
                  <motion.div key="prev" className="relative rounded-2xl overflow-hidden border border-black/[0.07]"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
                  >
                    {file?.type?.startsWith("video") ? (
                      <video src={preview} className="w-full max-h-[180px] object-cover" />
                    ) : (
                      <img src={preview} alt="preview" className="w-full max-h-[180px] object-cover" />
                    )}
                    <div className="px-4 py-2.5 bg-white border-t border-black/[0.06] flex items-center justify-between">
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-[#0f0f0f] truncate max-w-[75%]">{file?.name}</p>
                      <button type="button" onClick={clear}
                        className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                        <X size={11} /> Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">
              <button type="button" onClick={onCancel}
                className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/50 border border-black/10 hover:bg-black/[0.025] transition-colors">
                Cancel
              </button>
              <motion.button type="button" onClick={save} disabled={loading} whileTap={!loading ? { scale: 0.97 } : {}}
                className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold bg-[#0f0f0f] text-white hover:bg-black/80 disabled:bg-black/15 disabled:text-black/25 transition-colors flex items-center justify-center gap-2">
                {loading
                  ? <motion.span className="w-4 h-4 border-[1.5px] border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                  : <Zap size={12} />}
                {loading ? "Saving…" : "Save Changes"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ════════════════════ MAIN ════════════════════ */
const AdminBanner = () => {
  /* ── add-form state ── */
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [type,       setType]       = useState("image");
  const [title,      setTitle]      = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [order,      setOrder]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [dragOver,setDragOver]= useState(false);

  /* ── list state ── */
  const [banners,      setBanners]      = useState([]);
  const [listLoading,  setListLoading]  = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget,   setEditTarget]   = useState(null);
  const [togglingId,   setTogglingId]   = useState(null);

  /* fetch all banners */
  useEffect(() => {
    API.get("/banners/all")
      .then(({ data }) => setBanners(data))
      .catch(() => toast.error("Failed to load banners."))
      .finally(() => setListLoading(false));
  }, []);

  /* ── add handlers ── */
  const handleFile = (f) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };
  const clear = () => { setFile(null); setPreview(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Please fill all fields.");
    setLoading(true);
    const fd = new FormData();
    fd.append("media", file);
    fd.append("type", type);
    fd.append("title", title);
    fd.append("subHeading", subHeading);
    fd.append("order", order);
    try {
      const { data } = await API.post("/banners", fd);
      toast.success("Banner published!");
      setBanners(prev => [...prev, data].sort((a,b) => a.order - b.order));
      clear(); setTitle(""); setSubHeading(""); setOrder(0);
    } catch {
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/banners/${deleteTarget._id}`);
      setBanners(prev => prev.filter(b => b._id !== deleteTarget._id));
      toast.success("Banner deleted.");
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ── toggle active ── */
  const toggleActive = async (banner) => {
    setTogglingId(banner._id);
    const fd = new FormData();
    fd.append("isActive", String(!banner.isActive));
    fd.append("title", banner.title);
    try {
      const { data } = await API.put(`/banners/${banner._id}`, fd);
      setBanners(prev => prev.map(b => b._id === data._id ? data : b));
      toast.success(data.isActive ? "Banner activated" : "Banner deactivated");
    } catch {
      toast.error("Toggle failed.");
    } finally {
      setTogglingId(null);
    }
  };

  /* ── after edit save ── */
  const handleEditSave = (updated) => {
    setBanners(prev => prev.map(b => b._id === updated._id ? updated : b).sort((a,b) => a.order - b.order));
    setEditTarget(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <DeleteModal banner={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      <EditModal   key={editTarget?._id} banner={editTarget}   onSave={handleEditSave}   onCancel={() => setEditTarget(null)} />

      <div className="max-w-[880px] mx-auto px-6 sm:px-10 pt-10">

        {/* ══ HEADER ══ */}
        <motion.div className="mb-8 pb-7 border-b border-black/[0.08]"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}>
          <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-2.5"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease }}>
            Admin · Marketing
          </motion.p>
          <motion.h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,44px)] font-[400] text-[#0f0f0f] leading-none"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease }}>
            Promotional <em className="italic font-[300]">Banners</em>
          </motion.h1>
          <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2, ease }}>
            Upload and manage banners for the home page slider.
          </motion.p>
        </motion.div>

        {/* ══ EXISTING BANNERS ══ */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease }}>

          {/* Section title */}
          <div className="flex items-center justify-between mb-4">
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold uppercase tracking-[0.2em] text-black/35">
              Existing Banners <span className="text-black/22">({banners.length})</span>
            </p>
          </div>

          {/* Loading */}
          {listLoading && (
            <div className="flex items-center justify-center py-10">
              <motion.div className="w-6 h-6 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
            </div>
          )}

          {/* Empty */}
          {!listLoading && banners.length === 0 && (
            <div className="bg-white border border-black/[0.07] rounded-2xl py-12 flex flex-col items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#f0ede8] border border-black/[0.06] flex items-center justify-center">
                <ImageIcon size={16} className="text-black/25" strokeWidth={1.5} />
              </div>
              <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[20px] text-[#0f0f0f]">No banners yet</p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/35">Add your first banner below.</p>
            </div>
          )}

          {/* Banner cards */}
          {!listLoading && banners.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {banners.map((b, i) => {
                  const mediaUrl = getImg(b.media); // Replaced local definition with getImg
                  const isVideo  = b.type === "video" || b.media?.match(/\.(mp4|webm|ogg)$/i);
                  return (
                    <motion.div key={b._id}
                      className={`bg-white border rounded-2xl overflow-hidden group transition-all duration-200 ${b.isActive ? "border-black/[0.07]" : "border-black/[0.04] opacity-60"}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: b.isActive ? 1 : 0.6, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.38, delay: i * 0.05, ease }}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-[140px] bg-[#f0ede8] overflow-hidden">
                        {isVideo ? (
                          <video src={mediaUrl} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={mediaUrl} alt={b.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                        )}
                        {/* Type pill */}
                        <span className="absolute top-2.5 left-2.5 flex items-center gap-1 font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold text-white bg-black/45 backdrop-blur-sm px-2 py-1 rounded-lg">
                          {isVideo ? <Film size={9} /> : <ImageIcon size={9} />}
                          {isVideo ? "Video" : "Image"}
                        </span>
                        {/* Active indicator */}
                        {b.isActive && (
                          <span className="absolute top-2.5 right-2.5 w-max px-2 py-1 rounded-lg bg-emerald-400/90 text-[10px] font-bold text-white shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Pos: {b.order || 0}
                          </span>
                        )}
                        {!b.isActive && (
                           <span className="absolute top-2.5 right-2.5 w-max px-2 py-1 rounded-lg bg-black/40 text-[10px] font-bold text-white/70 backdrop-blur-sm">
                             Pos: {b.order || 0}
                           </span>
                        )}
                      </div>

                      {/* Info row */}
                      <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] truncate">{b.title}</p>
                          {b.subHeading && (
                            <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/50 truncate mt-0.5">{b.subHeading}</p>
                          )}
                          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/35 mt-1">
                            {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Toggle active */}
                          <motion.button
                            onClick={() => toggleActive(b)}
                            disabled={togglingId === b._id}
                            title={b.isActive ? "Deactivate" : "Activate"}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#f7f5f2] transition-colors disabled:opacity-50"
                          >
                            {togglingId === b._id
                              ? <motion.span className="w-3.5 h-3.5 border border-black/20 border-t-black/50 rounded-full"
                                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                              : b.isActive
                                ? <ToggleRight size={18} className="text-emerald-500" />
                                : <ToggleLeft  size={18} className="text-black/30" />
                            }
                          </motion.button>

                          {/* Edit */}
                          <motion.button
                            onClick={() => setEditTarget(b)}
                            title="Edit"
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#f7f5f2] transition-colors"
                          >
                            <Pencil size={13} className="text-black/40" />
                          </motion.button>

                          {/* Delete */}
                          <motion.button
                            onClick={() => setDeleteTarget(b)}
                            title="Delete"
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} className="text-black/35 hover:text-red-500 transition-colors" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ══ ADD NEW BANNER FORM ══ */}
        <motion.div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease }}>

          {/* Card header */}
          <div className="px-7 py-5 border-b border-black/[0.06] flex items-center gap-2.5">
            <PlusCircle size={13} className="text-black/35" strokeWidth={1.5} />
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-black/38">
              Add New Banner
            </p>
          </div>

          <form onSubmit={submit} className="p-7 flex flex-col gap-6">

            {/* Title */}
            <div>
              <label className={lbl}>Banner Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Summer Sale 2026" className={inp} />
            </div>

            <div>
              <label className={lbl}>Sub Heading</label>
              <input type="text" value={subHeading} onChange={e => setSubHeading(e.target.value)}
                placeholder="e.g. Up to 50% Off" className={inp} />
            </div>

            {/* Media type toggle */}
            <div>
              <label className={lbl}>Media Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "image", icon: ImageIcon, label: "Image" },
                  { val: "video", icon: Film,       label: "Video" },
                ].map(({ val, icon: Icon, label: btnLabel }) => (
                  <motion.button key={val} type="button"
                    onClick={() => { setType(val); clear(); }}
                    className={`flex items-center justify-center gap-2.5 py-3 rounded-xl border font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium transition-all duration-200 ${
                      type === val
                        ? "border-[#0f0f0f] bg-[#0f0f0f] text-white"
                        : "border-black/10 text-black/48 hover:border-black/22 bg-[#f7f5f2]"
                    }`}
                    whileTap={{ scale: 0.97 }}>
                    <Icon size={14} strokeWidth={1.5} />
                    {btnLabel}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Drop zone / Preview */}
            <div>
              <label className={lbl}>Upload {type === "image" ? "Image" : "Video"}</label>
              <AnimatePresence mode="wait">
                {!preview ? (
                  <motion.label key="dropzone" htmlFor="banner-file"
                    className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-12 cursor-pointer transition-all duration-200 ${
                      dragOver ? "border-[#0f0f0f]/35 bg-black/[0.03]" : "border-black/12 hover:border-black/22 hover:bg-black/[0.02]"
                    }`}
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25, ease }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}>
                    <input id="banner-file" type="file"
                      accept={type === "image" ? "image/*" : "video/*"}
                      onChange={e => handleFile(e.target.files[0])} className="hidden" />
                    <div className="w-12 h-12 rounded-2xl bg-[#f0ede8] border border-black/[0.06] flex items-center justify-center">
                      {type === "image"
                        ? <ImageIcon size={18} className="text-black/30" strokeWidth={1.5} />
                        : <Film      size={18} className="text-black/30" strokeWidth={1.5} />}
                    </div>
                    <div className="text-center">
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-black/48">
                        Drop file here or <span className="text-[#0f0f0f] underline underline-offset-2">browse</span>
                      </p>
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/28 mt-1">
                        {type === "image" ? "PNG, JPG, WebP recommended" : "MP4, WebM recommended"}
                      </p>
                    </div>
                  </motion.label>
                ) : (
                  <motion.div key="preview"
                    className="relative rounded-2xl overflow-hidden border border-black/[0.07] group bg-[#f0ede8]"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3, ease }}>
                    {type === "image"
                      ? <img  src={preview} alt="Preview"  className="w-full max-h-[300px] object-cover" />
                      : <video src={preview}               className="w-full max-h-[300px] object-cover" controls />}
                    <div className="px-4 py-3 bg-white border-t border-black/[0.06] flex items-center justify-between">
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#0f0f0f] truncate max-w-[80%]">{file?.name}</p>
                      <motion.button type="button" onClick={clear} whileTap={{ scale: 0.93 }}
                        className="flex items-center gap-1 font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-red-500 hover:text-red-600 transition-colors">
                        <X size={12} /> Remove
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold py-3.5 rounded-2xl hover:bg-black/80 disabled:bg-black/12 disabled:text-black/25 transition-all duration-200"
              whileTap={!loading ? { scale: 0.985 } : {}}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              {loading
                ? <motion.span className="w-4 h-4 border-[1.5px] border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                : <Zap size={13} />}
              {loading ? "Publishing…" : "Publish Banner"}
            </motion.button>

          </form>
        </motion.div>
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default AdminBanner;