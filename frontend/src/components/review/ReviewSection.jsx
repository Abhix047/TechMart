import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import API from "../../services/api";
import ReviewCard from "./ReviewCard";

const ease = [0.22, 1, 0.36, 1];

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${productId}`);
        setReviews(data.reviews || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  /* derived stats */
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const dist = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: reviews.length
      ? Math.round((reviews.filter(r => r.rating === s).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Section header ── */}
      <motion.div
        className="flex items-end justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.22em] text-black/28 mb-2">
            Reviews
          </p>
          <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(22px,3vw,32px)] font-[500] text-[#0f0f0f] leading-none">
            Customer <em className="italic font-[400]">Feedback</em>
          </h2>
        </div>

        {avg && (
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="font-[family-name:'Cormorant_Garamond',serif] text-[40px] font-[400] text-[#0f0f0f] leading-none">
              {avg}
            </span>
            <div className="flex flex-col gap-1 pb-0.5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={11}
                    style={s <= Math.round(Number(avg))
                      ? { color: "#c09a35", fill: "#c09a35" }
                      : { color: "rgba(0,0,0,0.1)", fill: "rgba(0,0,0,0.08)" }
                    }
                  />
                ))}
              </div>
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/36">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Rating distribution bar ── */}
      {reviews.length > 0 && (
        <motion.div
          className="bg-white border border-black/[0.07] rounded-2xl p-5 mb-7 flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
        >
          {dist.map(({ star, count, pct }, i) => (
            <div key={star} className="flex items-center gap-3">
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-black/45 w-3 text-right shrink-0">
                {star}
              </span>
              <Star size={10} style={{ color: "#c09a35", fill: "#c09a35" }} className="shrink-0" />
              <div className="flex-1 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0f0f0f] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease }}
                />
              </div>
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/32 w-7 text-right shrink-0">
                {count}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <motion.div
            className="w-6 h-6 border-[1.5px] border-black/10 border-t-black/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && reviews.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center bg-white border border-black/[0.07] rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center mb-5">
            <MessageSquare size={16} className="text-black/22" strokeWidth={1.5} />
          </div>
          <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[20px] font-[400] text-[#0f0f0f] mb-1.5">
            No reviews yet
          </p>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/38 leading-relaxed">
            Be the first to share your experience.
          </p>
        </motion.div>
      )}

      {/* ── Reviews grid ── */}
      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <ReviewCard key={r._id} review={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;