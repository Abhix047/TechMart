import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Instagram, Twitter, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Data ──────────────────────────────────── */
const NAV = [
  { label: "All Products",    path: "/products"  },
  { label: "New Arrivals",    path: "/products"  },
  { label: "Featured",        path: "/featured"  },
  { label: "Deals & Offers",  path: "/products"  },
  { label: "Track Order",     path: "/orders"    },
  { label: "Easy Returns",    path: "/connect-us"},
  { label: "About TechMart",  path: "/about"     },
  { label: "Contact Us",      path: "/connect-us"},
];

const POLICIES = ["Privacy Policy", "Terms of Service", "Cookies"];

/* ─── Grain SVG ─────────────────────────────── */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Animated nav link ─────────────────────── */
const FLink = ({ label, path, delay }) => {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <motion.div
      className="flex items-center gap-1 cursor-pointer overflow-hidden"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={() => navigate(path)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Line that draws in on hover */}
      <motion.span
        className="block h-px flex-shrink-0"
        animate={{ width: h ? 14 : 0, opacity: h ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: "rgba(255,255,255,0.4)" }}
      />
      <motion.span
        animate={{ x: h ? 2 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 300,
          color: h ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)",
          transition: "color 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
const Footer = () => {
  const navigate  = useNavigate();
  const ref       = useRef(null);
  const isInView  = useInView(ref, { once: true, margin: "-40px" });
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#111111" }}
    >

      {/* ── Grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.032]"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px" }}
      />

      {/* ── Subtle center glow — like screenshot ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── Top thin accent line ── */}
      <motion.div
        className="absolute top-0 left-0 h-px"
        initial={{ width: "0%" }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)" }}
      />

      {/* ══════════════════════════════════════
          SECTION 1 — Top split row
          Left: big tagline  |  Right: email CTA
      ══════════════════════════════════════ */}
      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >

        {/* Left — tagline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between"
          style={{
            padding: "clamp(40px,6vh,72px) clamp(24px,5vw,72px)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <span
              className="block mb-6"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              Est. 2024 · TechMart
            </span>

            <h2
              className="m-0 leading-[1.04]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px,4.2vw,60px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.02em",
              }}
            >
              Curated tech<br />
              <span style={{ fontWeight: 700, fontStyle: "normal" }}>
                for modern living.
              </span>
            </h2>
          </div>

          {/* Social row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-4 mt-10"
          >
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Twitter,   label: "Twitter"   },
              { Icon: Youtube,   label: "YouTube"   },
            ].map(({ Icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{
                  width: 38, height: 38,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title={label}
              >
                <Icon size={14} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.55)" }} />
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
          style={{ padding: "clamp(40px,6vh,72px) clamp(24px,5vw,72px)" }}
        >
          <span
            className="block mb-5"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              fontWeight: 400,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Newsletter
          </span>

          <p
            className="mb-8 leading-[1.78]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 360,
            }}
          >
            New arrivals, exclusive deals, curated picks —
            delivered to your inbox. No noise.
          </p>

          {/* Input */}
          <form onSubmit={submit} className="mb-3">
            <div
              className="flex items-center overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-none outline-none px-5 py-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.85)",
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                whileTap={{ scale: 0.94 }}
                className="shrink-0 flex items-center justify-center border-none cursor-pointer"
                style={{
                  width: 54, height: 54,
                  background: "rgba(255,255,255,0.1)",
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                  transition: "background 0.2s",
                }}
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{ color: "#a8d5a2", fontSize: 18 }}>✓</motion.span>
                  ) : (
                    <motion.div key="arr" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                      <ArrowRight size={16} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.7)" }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </form>

          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: "rgba(255,255,255,0.18)", letterSpacing: "0.03em" }}>
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — Navigation links grid
      ══════════════════════════════════════ */}
      <div
        className="relative z-10 px-5 sm:px-10 lg:px-16 xl:px-[72px] py-12 md:py-16"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6">
          {[
            { heading: "Shop",    items: NAV.slice(0, 4) },
            { heading: "Support", items: NAV.slice(4, 6) },
            { heading: "Company", items: NAV.slice(6, 8) },
            { heading: "Explore", items: [
                { label: "Products",  path: "/products"  },
                { label: "Featured",  path: "/featured"  },
                { label: "About",     path: "/about"     },
                { label: "Discover",  path: "/discover"  },
              ],
            },
          ].map(({ heading, items }, gi) => (
            <div key={heading}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: gi * 0.07 + 0.15, duration: 0.45 }}
                className="mb-5"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                }}
              >
                {heading}
              </motion.p>
              <div className="flex flex-col gap-3">
                {items.map((it, ii) => (
                  <FLink
                    key={it.label}
                    label={it.label}
                    path={it.path}
                    delay={gi * 0.07 + ii * 0.045 + 0.22}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 3 — Bottom bar
      ══════════════════════════════════════ */}
      <div
        className="relative z-10 px-5 sm:px-10 lg:px-16 xl:px-[72px] py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
          © 2025 TechMart. All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          {POLICIES.map((t) => (
            <span
              key={t}
              className="cursor-pointer"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.03em", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.18)")}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;