import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

/* ── Fonts (same as NewArrivals) ── */
if (typeof document !== "undefined" && !document.getElementById("na-lux-fonts")) {
  const l = document.createElement("link");
  l.id = "na-lux-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Tenor+Sans&display=swap";
  document.head.appendChild(l);
}

/* ── CharReveal — same as NewArrivals heading ── */
function CharReveal({ text, italic, delay = 0, inView, className = "" }) {
  return (
    <span
      aria-label={text}
      className={`inline-flex font-[family-name:'Cormorant_Garamond',serif] font-light leading-none ${
        italic ? "italic" : "tracking-tight"
      } ${className}`}
    >
      {text.split("").map((ch, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block whitespace-pre"
            initial={{ y: "115%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.62,
              delay: delay + i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const Newsletter = () => {
  const [email, setEmail]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: "0px 0px -60px 0px" });

  const handleSubmit = async () => {
    if (!email || !email.includes("@") || loading || submitted) return;
    setLoading(true);
    /* Replace with your actual API call */
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <section
      ref={sectionRef}
      className="px-5 sm:px-10 lg:px-16 xl:px-[72px] py-20 md:py-28 bg-white overflow-hidden"
    >
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">

        {/* Eyebrow */}
        <motion.p
          className="font-[family-name:'Tenor_Sans',sans-serif] text-[9px] tracking-[0.34em] uppercase text-black/30 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Stay in the Loop
        </motion.p>

        {/* Heading — char reveal, italic second word */}
        <h2
          aria-label="New drops, weekly."
          className="flex justify-center flex-wrap gap-[0.22em] items-baseline mb-4 text-[clamp(30px,4.5vw,52px)]"
        >
          <CharReveal text="New"     italic={false} delay={0.04} inView={inView} className="text-[#0a0a0a]" />
          <CharReveal text="drops,"  italic={true}  delay={0.18} inView={inView} className="text-[#0a0a0a]" />
          <CharReveal text="weekly." italic={true}  delay={0.38} inView={inView} className="text-[#0a0a0a]" />
        </h2>

        {/* Subtitle */}
        <div className="overflow-hidden mb-10">
          <motion.p
            className="font-[family-name:'Cormorant_Garamond',serif] font-light italic text-[clamp(14px,1.4vw,17px)] text-black/38 leading-relaxed tracking-[0.01em] max-w-[360px] m-0"
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Be first to know about new arrivals, exclusive deals and curated
            tech picks — directly in your inbox.
          </motion.p>
        </div>

        {/* Input row */}
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                className="flex items-center justify-center gap-3 py-3.5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="w-5 h-5 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Check size={11} className="text-white" strokeWidth={2.5} />
                </motion.span>
                <span className="font-[family-name:'Tenor_Sans',sans-serif] text-[11px] tracking-[0.18em] uppercase text-black/55">
                  You're on the list
                </span>
              </motion.div>
            ) : (
              /* ── Input + button ── */
              <motion.div
                key="form"
                className="flex w-full relative"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animated bottom border only — luxury feel */}
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={handleKey}
                    placeholder="your@email.com"
                    className="w-full px-0 py-3 border-0 border-b border-black/15 font-[family-name:'Tenor_Sans',sans-serif] text-[12px] tracking-[0.04em] text-[#0a0a0a] bg-transparent outline-none placeholder:text-black/25 rounded-none"
                  />
                  {/* Focus underline wipe */}
                  <motion.span
                    className="absolute bottom-0 left-0 h-px bg-[#0a0a0a] pointer-events-none"
                    animate={{ width: focused ? "100%" : "0%" }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 pl-5 pb-3 pt-3 bg-transparent border-0 border-b border-black/15 cursor-pointer shrink-0 relative overflow-hidden"
                  whileTap={{ scale: 0.96 }}
                >
                  {/* Button fill on hover */}
                  <motion.span
                    className="absolute inset-0 bg-[#0a0a0a] pointer-events-none"
                    initial={{ scaleX: 0, originX: 1 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span
                        key="loader"
                        className="relative z-10 w-3.5 h-3.5 border border-black/30 border-t-black/80 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                      />
                    ) : (
                      <motion.span
                        key="label"
                        className="relative z-10 flex items-center gap-2 group-hover:text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="font-[family-name:'Tenor_Sans',sans-serif] text-[10px] tracking-[0.22em] uppercase text-[#0a0a0a]"
                          whileHover={{ color: "#ffffff" }}
                          transition={{ duration: 0.35 }}
                        >
                          Subscribe
                        </motion.span>
                        <motion.span
                          whileHover={{ x: 3, color: "#ffffff" }}
                          transition={{ duration: 0.25 }}
                          className="inline-flex"
                        >
                          <ArrowRight size={11} />
                        </motion.span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Fine print */}
        <motion.p
          className="font-[family-name:'Tenor_Sans',sans-serif] text-[9px] tracking-[0.12em] text-black/25 mt-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          No spam. Unsubscribe anytime.
        </motion.p>

        {/* Bottom rule — animated wipe */}
        <motion.div
          className="w-9 h-px bg-black/12 mt-8 origin-center"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  );
};

export default Newsletter;