import React from "react";
import { Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

import { getImg } from "../../config";
const ease = [0.22, 1, 0.36, 1];

const ReviewCard = ({ review, index = 0 }) => {
  const [helpful, setHelpful] = React.useState(false);

  const rating  = review?.rating || 5;
  const name    = review?.name || "Anonymous";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  /* star color */
  const starColor = rating >= 4 ? "#c09a35" : rating === 3 ? "#d97706" : "#ef4444";

  return (
    <motion.div
      className="group relative bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col h-full overflow-hidden hover:border-black/[0.15] transition-colors duration-300"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease }}
    >
      {/* ── Decorative ghost rating ── */}
      <div
        className="absolute top-4 right-5 font-[family-name:'Cormorant_Garamond',serif] text-[72px] font-[300] text-black/[0.04] leading-none select-none pointer-events-none"
        aria-hidden
      >
        {rating}
      </div>

      {/* ── 1. HEADER ── */}
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {review?.avatar ? (
              <img
                src={review.avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#f0ede8] border border-black/[0.07] flex items-center justify-center font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-black/50">
                {initials}
              </div>
            )}
            {/* Verified dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle2 size={9} className="text-white" strokeWidth={3} />
            </div>
          </div>

          <div>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f] leading-snug">
              {name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] font-semibold text-emerald-600 uppercase tracking-[0.12em]">
                Verified
              </span>
              {review?.createdAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-black/15" />
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/36">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f7f5f2] border border-black/[0.06] shrink-0">
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold text-[#0f0f0f]">
            {rating}
          </span>
          <Star size={10} style={{ color: starColor, fill: starColor }} />
        </div>
      </div>

      {/* ── 2. STARS ── */}
      <div className="flex items-center gap-0.5 mb-3 relative z-10">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            size={13}
            style={s <= rating
              ? { color: starColor, fill: starColor }
              : { color: "rgba(0,0,0,0.1)", fill: "rgba(0,0,0,0.08)" }
            }
          />
        ))}
      </div>

      {/* ── 3. TITLE ── */}
      {review?.title && (
        <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[15px] font-[500] text-[#0f0f0f] mb-2 relative z-10 leading-snug">
          "{review.title}"
        </p>
      )}

      {/* ── 4. COMMENT ── */}
      <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-light text-black/58 leading-[1.85] flex-1 relative z-10 mb-5">
        {review?.comment}
      </p>

      {/* ── 5. FOOTER: image + helpful ── */}
      <div className="pt-4 border-t border-black/[0.06] flex items-end justify-between gap-3 relative z-10">

        {/* Attached image */}
        {review?.image ? (
          <div>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-1.5">
              Photo
            </p>
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-black/[0.07] bg-[#f0ede8]">
              <img
                src={getImg(review.image)}
                alt="Review photo"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 mix-blend-multiply"
              />
            </div>
          </div>
        ) : <div />}

        {/* Helpful */}
        <motion.button
          onClick={() => setHelpful(v => !v)}
          whileTap={{ scale: 0.93 }}
          className={`flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium px-3 py-1.5 rounded-xl border transition-all duration-200 ${
            helpful
              ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
              : "text-black/38 bg-[#f7f5f2] border-black/[0.06] hover:text-black/65 hover:border-black/12"
          }`}
        >
          <ThumbsUp size={12} strokeWidth={1.8} className={helpful ? "fill-emerald-500 text-emerald-500" : ""} />
          {helpful ? "Helpful!" : "Helpful"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReviewCard;