import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ease = [0.22, 1, 0.36, 1];
const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const ReviewForm = ({ productId, onSuccess }) => {
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [image,   setImage]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setImage({ file: f, url: URL.createObjectURL(f) });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating)        return toast.error("Please select a rating.");
    if (!comment.trim()) return toast.error("Please write a review.");
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("rating", rating);
      fd.append("comment", comment);
      if (image) fd.append("image", image.file);
      const res  = await fetch(`${BASE_URL}/api/products/${productId}/reviews`, {
        method: "POST", body: fd, credentials: "include",
      });
      const data = await res.text().then(t => (t ? JSON.parse(t) : {}));
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSuccess(true);
      setRating(0); setComment(""); setImage(null);
      onSuccess?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const active = hovered || rating;

  return (
    <div className="w-full bg-[#f9f8f6] border border-black/[0.07] rounded-2xl p-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Stars ── */}
      <div className="flex items-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map(v => (
          <motion.button
            key={v}
            type="button"
            onClick={() => setRating(v)}
            onMouseEnter={() => setHovered(v)}
            onMouseLeave={() => setHovered(0)}
            className="text-[22px] leading-none bg-transparent border-none p-0"
            style={{ color: v <= active ? "#c09a35" : "rgba(0,0,0,0.12)" }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.18, ease }}
          >
            ★
          </motion.button>
        ))}
        <AnimatePresence mode="wait">
          {active > 0 && (
            <motion.span
              key={active}
              className="ml-1 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/40"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
            >
              {LABELS[active]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={submitHandler} className="flex flex-col gap-3">

        {/* ── Textarea ── */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, 400))}
          placeholder="Share your experience…"
          rows={3}
          className="w-full font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-light text-[#0f0f0f] placeholder-black/28 bg-white border border-black/[0.08] rounded-xl px-4 py-3 resize-none outline-none focus:border-black/20 focus:bg-white transition-colors leading-relaxed"
        />

        {/* ── Image upload + char count ── */}
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          {!image ? (
            <motion.button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-9 h-9 rounded-xl border border-dashed border-black/15 text-black/28 flex items-center justify-center hover:border-black/28 hover:text-black/45 hover:bg-white transition-all duration-200"
              whileTap={{ scale: 0.93 }}
            >
              <ImagePlus size={14} strokeWidth={1.5} />
            </motion.button>
          ) : (
            <div className="relative shrink-0">
              <img
                src={image.url}
                alt="preview"
                className="w-9 h-9 rounded-xl object-cover border border-black/[0.08]"
              />
              <button
                type="button"
                onClick={() => { setImage(null); fileRef.current.value = ""; }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0f0f0f] text-white rounded-full flex items-center justify-center border-none"
              >
                <X size={8} strokeWidth={2.5} />
              </button>
            </div>
          )}

          <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/28 flex-1 truncate">
            {image ? image.file.name : "Add a photo (optional)"}
          </span>

          <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/25 shrink-0">
            {comment.length}/400
          </span>
        </div>

        {/* ── Submit ── */}
        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors duration-200 ${
            loading
              ? "bg-black/6 text-black/25 cursor-not-allowed"
              : "bg-[#0f0f0f] text-white hover:bg-black/82"
          }`}
          whileTap={!loading ? { scale: 0.985 } : {}}
        >
          {loading ? (
            <motion.span
              className="w-4 h-4 border-[1.5px] border-black/15 border-t-black/50 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
          ) : "Post Review"}
        </motion.button>

        {/* ── Success ── */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="flex items-center gap-2 justify-center font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-xl py-2.5"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease }}
            >
              <CheckCircle2 size={13} />
              Review posted — thank you!
            </motion.div>
          )}
        </AnimatePresence>

      </form>
    </div>
  );
};

export default ReviewForm;