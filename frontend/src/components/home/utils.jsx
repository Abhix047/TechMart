import { useRef } from "react";
import { useInView } from "framer-motion";

/* ─── Fade-up reveal hook ─────────────────────────── */
export const useFadeUp = (delay = 0) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return {
    ref,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0px)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    },
  };
};

/* ─── Section label ──────────────────────────────── */
export const Label = ({ children }) => (
  <span className="font-dm text-[9.5px] font-normal uppercase tracking-[0.3em] text-black/35">
    {children}
  </span>
);

/* ─── Thin divider ───────────────────────────────── */
export const Divider = ({ className = "" }) => (
  <div className={`h-px w-full bg-black/[0.07] ${className}`} />
);