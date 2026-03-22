import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const QUOTES = [
  {
    text: "The go-to destination for premium tech accessories that actually last.",
    source: "TechRadar",
    category: "Technology",
  },
  {
    text: "Curated gear for people who take their setup seriously. No clutter, just quality.",
    source: "Wired India",
    category: "Design",
  },
  {
    text: "Finally, a store that understands the difference between specs and experience.",
    source: "Digit",
    category: "Reviews",
  },
];

/* ── Quote mark SVG ── */
const QuoteMark = () => (
  <svg
    width="52" height="40" viewBox="0 0 80 60"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className="opacity-[0.07]"
  >
    <path
      d="M0 60V36C0 16.8 11.2 5.2 33.6 0L38 8C26.4 11.2 20 17.6 19.2 27.2H32V60H0ZM48 60V36C48 16.8 59.2 5.2 81.6 0L86 8C74.4 11.2 68 17.6 67.2 27.2H80V60H48Z"
      fill="#2a2010"
    />
  </svg>
);

/* ── Grain noise SVG as data URI (can't express in Tailwind) ── */
const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const PressQuote = () => {
  const [idx, setIdx]       = useState(0);
  const [direction, setDir] = useState(1);
  const sectionRef          = useRef(null);
  const timerRef            = useRef(null);
  const isInView            = useInView(sectionRef, { once: true, margin: "-80px" });

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx((p) => (p + 1) % QUOTES.length);
    }, 5500);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setDir(i > idx ? 1 : -1);
    setIdx(i);
    resetTimer();
  };

  const q = QUOTES[idx];

  /* ── Animation variants ── */
  const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const lineV = {
    hidden: { scaleX: 0, opacity: 0 },
    show:   { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const labelV = {
    hidden: { opacity: 0, letterSpacing: "0.5em" },
    show:   { opacity: 1, letterSpacing: "0.34em", transition: { duration: 0.8, ease: "easeOut" } },
  };

  const quoteMarkV = {
    hidden: { opacity: 0, scale: 0.7, rotate: -10 },
    show:   { opacity: 1,  scale: 1,  rotate: 0,   transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  };

  const dotsV = {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7, ease: "easeOut" } },
  };

  const slideV = {
    enter:  (d) => ({ opacity: 0, y: d > 0 ? 22 : -22, filter: "blur(4px)" }),
    center: { opacity: 1, y: 0, filter: "blur(0px)",    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit:   (d) => ({ opacity: 0, y: d > 0 ? -16 : 16, filter: "blur(3px)", transition: { duration: 0.35, ease: "easeIn" } }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-9 md:py-14 px-6 sm:px-16 lg:px-24 xl:px-32"
      style={{ background: "linear-gradient(160deg,#f7f4ee 0%,#f0ece3 40%,#ede8df 100%)" }}
    >

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.028]"
        style={{ backgroundImage: GRAIN_BG, backgroundRepeat: "repeat", backgroundSize: "180px" }}
      />

      {/* Glow circles */}
      <div className="absolute -top-20 -right-20 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(200,185,155,0.18) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-16 -left-16 w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(180,165,135,0.14) 0%,transparent 70%)" }} />

      {/* ── MAIN ── */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
      >

        {/* "As seen in" */}
        <div className="flex items-center justify-center gap-5 mb-8 w-full">
          <motion.span
            variants={lineV}
            className="block h-px origin-left w-8 sm:w-14 lg:w-16 bg-[#2a2010]/20"
          />
          <motion.span
            variants={labelV}
            className="font-dm text-[9px] font-medium uppercase whitespace-nowrap text-[#2a2010]/38"
          >
            As seen in
          </motion.span>
          <motion.span
            variants={lineV}
            className="block h-px origin-right w-8 sm:w-14 lg:w-16 bg-[#2a2010]/20"
          />
        </div>

        {/* Quote mark */}
        <motion.div variants={quoteMarkV} className="mb-4 select-none">
          <QuoteMark />
        </motion.div>

        {/* Animated quote */}
        <div className="relative min-h-[120px] flex items-center justify-center w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={idx}
              custom={direction}
              variants={slideV}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute flex flex-col items-center gap-5 w-full px-2"
            >
              {/* Quote text */}
              <blockquote
                className="font-cormorant italic text-[#2a2010] leading-[1.4] max-w-[72ch] m-0"
                style={{ fontSize: "clamp(17px, 2vw, 28px)", letterSpacing: "0.01em" }}
              >
                "{q.text}"
              </blockquote>

              {/* Source + category */}
              <div className="flex flex-col items-center gap-2">
                <span className="block w-7 h-px bg-[#2a2010]/25" />
                <div className="flex items-center gap-3">
                  <cite className="font-dm not-italic text-[10.5px] font-semibold tracking-[0.32em] uppercase text-[#2a2010]">
                    {q.source}
                  </cite>
                  <span className="font-dm text-[9px] tracking-[0.2em] uppercase text-[#2a2010]/35">
                    — {q.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <motion.div variants={dotsV} className="flex items-center gap-2.5 mt-8">
          {QUOTES.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              className="border-none bg-transparent cursor-pointer p-1"
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.85 }}
            >
              <motion.span
                className="block"
                animate={{
                  width: i === idx ? 32 : 6,
                  background: i === idx ? "#2a2010" : "rgba(42,32,16,0.2)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 2, borderRadius: 1, display: "block" }}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Progress bar */}
        <div className="relative mt-3 overflow-hidden w-12 h-px bg-[#2a2010]/10">
          <motion.div
            key={idx + "-progress"}
            className="absolute inset-y-0 left-0 bg-[#2a2010]/45"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>

      </motion.div>
    </section>
  );
};

export default PressQuote;