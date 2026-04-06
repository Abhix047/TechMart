import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Instagram, Twitter, Youtube, Linkedin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── font tokens ── */
const dm = { fontFamily: "'DM Sans', sans-serif" };
const mono = { fontFamily: "'DM Mono', monospace" };

/* ── data ── */
const NAV_COLS = [
  {
    heading: "Shop",
    items: [
      { label: "All Products", path: "/products" },
      { label: "New Arrivals", path: "/products" },
      { label: "Featured", path: "/featured" },
      { label: "Deals & Offers", path: "/products" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Track Order", path: "/orders" },
      { label: "Easy Returns", path: "/connect-us" },
      { label: "FAQ", path: "/connect-us" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "Our Mission", path: "/about" },
      { label: "About Us", path: "/about" },
      { label: "Contact Us", path: "/connect-us" },
    ],
  },
];

const SOCIALS = [
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Youtube, label: "YouTube" },
  { Icon: Linkedin, label: "LinkedIn" },
];

const POLICIES = ["Privacy Policy", "Terms of Service", "Cookies"];

/* ── eases ── */
const EASE = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════
   Nav link with animated underline dash
═══════════════════════════════════════════ */
const FLink = ({ label, path, delay, size = "lg" }) => {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);

  /* "lg" = big nav links like the reference image */
  const isLg = size === "lg";

  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer group w-fit"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(path)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: EASE }}
    >
      {/* animated leading dash */}
      <motion.span
        animate={{ width: hov ? 18 : 0, opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="block h-px bg-white/50 shrink-0"
      />
      <span
        className="transition-colors duration-200 leading-none"
        style={{
          ...dm,
          fontSize: isLg ? "clamp(22px, 3vw, 34px)" : 13,
          fontWeight: isLg ? 300 : 300,
          letterSpacing: isLg ? "-0.01em" : "0.01em",
          color: hov ? "rgba(255,255,255,0.92)" : isLg ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.38)",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   Giant word-by-word reveal for TECHMART
═══════════════════════════════════════════ */
const GiantWord = ({ text, inView }) => (
  <div
    className="overflow-hidden leading-none select-none"
    style={{
      fontSize: "clamp(80px, 17vw, 220px)",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      color: "white",
      fontFamily: "'Playfair Display', serif",
      fontStyle: "italic",
    }}
  >
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          ease: EASE,
          delay: 0.05 + i * 0.025,
        }}
        style={{ display: "inline-block" }}
      >
        {char}
      </motion.span>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   Section label (tiny caps)
═══════════════════════════════════════════ */
const Label = ({ children, delay, inView }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={inView ? { opacity: 1 } : {}}
    transition={{ delay, duration: 0.4 }}
    className="text-[9px] tracking-[0.3em] uppercase mb-5"
    style={{ ...dm, color: "rgba(255,255,255,0.22)", fontWeight: 600 }}
  >
    {children}
  </motion.p>
);

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
export default function Footer() {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const botRef = useRef(null);
  const topInView = useInView(topRef, { once: true, margin: "-60px" });
  const botInView = useInView(botRef, { once: true, margin: "-40px" });

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer style={{ ...dm, background: "#0f0f0f", position: "relative", zIndex: 50 }}>

      {/* ══ TOP SECTION — newsletter + nav ══ */}
      <div
        ref={topRef}
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-[80px] items-start"
          style={{
            maxWidth: 1280,
            padding: "clamp(48px,7vh,80px) clamp(24px,5vw,72px)",
          }}
        >
          {/* LEFT — newsletter + contact info */}
          <div className="w-full max-w-[560px]">
            {/* headline */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={topInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                fontSize: "clamp(22px, 3vw, 38px)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                margin: "0 0 32px",
              }}
            >
              Subscribe to our Newsletter!
            </motion.h3>

            {/* email form — underline style matching reference */}
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 12 }}
              animate={topInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
              className="flex items-center gap-4 mb-10 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.18)" }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter address"
                className="flex-1 bg-transparent border-none outline-none"
                style={{
                  ...dm,
                  fontSize: 15,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.72)",
                  minWidth: 0,
                  caretColor: "white",
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.9 }}
                className="border-none bg-transparent cursor-pointer p-0 shrink-0 flex"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <AnimatePresence mode="wait">
                  {sent
                    ? <motion.span key="ok"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>
                      ✓
                    </motion.span>
                    : <motion.div key="arr" initial={{ x: -4 }} animate={{ x: 0 }}>
                      <ArrowRight size={18} strokeWidth={1.4} />
                    </motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </motion.form>

            {/* contact info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={topInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-start"
            >
              {[
                {
                  label: "Head Office",
                  value: "Connaught Place,\nNew Delhi 110001",
                },
                {
                  label: "Email Us",
                  value: "hello@techmart.in",
                },
                {
                  label: "Call Us",
                  value: "+91 98765 43210",
                },
              ].map(({ label, value }, i) => (
                <div key={label}>
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ ...mono, color: "rgba(255,255,255,0.22)" }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      ...dm,
                      fontSize: 13,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.62)",
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — nav columns + social */}
          <div className="flex flex-wrap lg:flex-nowrap gap-10 lg:gap-14 items-start pt-1">
            {/* big nav links (like FIND — Search, Agents, Join…) */}
            <div className="flex flex-col gap-1.5">
              {NAV_COLS.flatMap(col =>
                col.items.map((item, ii) => (
                  <FLink
                    key={item.label}
                    label={item.label}
                    path={item.path}
                    delay={0.1 + ii * 0.05}
                    size="lg"
                  />
                ))
              ).slice(0, 6)}
            </div>

            {/* social links — right column */}
            <div className="flex flex-col gap-3 pt-1">
              {SOCIALS.map(({ Icon, label }, i) => {
                const [hov, setHov] = useState(false);
                return (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE }}
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    className="bg-transparent border-none cursor-pointer p-0 text-left"
                    style={{
                      ...dm,
                      fontSize: 13,
                      fontWeight: 300,
                      color: hov ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.32)",
                      transition: "color 0.2s",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══ GIANT BRAND NAME ══ */}
      <div
        ref={botRef}
        className="overflow-hidden"
        style={{
          padding: "clamp(32px,5vh,56px) clamp(16px,3vw,40px) 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <GiantWord text="techmart" inView={botInView} />
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div
        style={{
          maxWidth: "100%",
          padding: "18px clamp(24px,5vw,72px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={botInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          {/* policies */}
          <div className="flex flex-wrap gap-5">
            {POLICIES.map(t => (
              <span
                key={t}
                className="cursor-pointer transition-colors duration-150"
                style={{
                  ...dm,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={e => (e.target.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={e => (e.target.style.color = "rgba(255,255,255,0.2)")}
              >
                {t}
              </span>
            ))}
          </div>

          {/* center — brand */}
          <span style={{ ...dm, fontSize: 11, color: "rgba(255,255,255,0.16)", letterSpacing: "0.08em" }}>
            TechMart
          </span>

          {/* copyright */}
          <span style={{ ...dm, fontSize: 11, color: "rgba(255,255,255,0.16)", letterSpacing: "0.03em" }}>
            Copyright © 2025
          </span>
        </motion.div>
      </div>

    </footer>
  );
}