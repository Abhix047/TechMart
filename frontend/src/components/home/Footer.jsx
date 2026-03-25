  import { useRef, useState } from "react";
  import { motion, useInView, AnimatePresence } from "framer-motion";
  import { Instagram, Twitter, Youtube, Linkedin, ArrowRight } from "lucide-react";
  import { useNavigate } from "react-router-dom";

  const NAV_COLS = [
    {
      heading: "Shop",
      items: [
        { label: "All Products",   path: "/products"   },
        { label: "New Arrivals",   path: "/products"   },
        { label: "Featured",       path: "/featured"   },
        { label: "Deals & Offers", path: "/products"   },
      ],
    },
    {
      heading: "Support",
      items: [
        { label: "Track Order",   path: "/orders"     },
        { label: "Easy Returns",  path: "/connect-us" },
      ],
    },
    {
      heading: "Company",
      items: [
        { label: "Our Mission",    path: "/about"      },
        { label: "About TechMart", path: "/about"      },
        { label: "Contact Us",     path: "/connect-us" },
      ],
    },
  ];

  const POLICIES = ["Privacy Policy", "Terms of Service", "Cookies"];

  /* ─── B&W City Illustration ─────────────────── */
  const CityIllustration = () => (
    <svg
      viewBox="0 0 1200 480"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0, display: "block" }}
      preserveAspectRatio="xMidYMin slice"
    >
      <defs>
        <linearGradient id="skyBW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="55%"  stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="bldDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="bldMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3e3e3e" />
          <stop offset="100%" stopColor="#181818" />
        </linearGradient>
        <linearGradient id="bldFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#606060" />
          <stop offset="100%" stopColor="#2c2c2c" />
        </linearGradient>
        <linearGradient id="groundBW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1200" height="480" fill="url(#skyBW)" />

      {/* Moon halo + disc */}
      <circle cx="600" cy="92" r="80" fill="url(#moonHalo)" />
      <circle cx="600" cy="92" r="50" fill="white" opacity="0.92" />
      <circle cx="585" cy="80" r="7"  fill="none" stroke="#ddd" strokeWidth="0.8" opacity="0.35" />
      <circle cx="614" cy="104" r="4" fill="none" stroke="#ddd" strokeWidth="0.6" opacity="0.25" />

      {/* Stars */}
      {[[72,25],[148,14],[235,38],[318,10],[415,32],[510,18],[695,26],[788,10],[874,40],[965,20],[1058,14],[1142,30],[1025,52],[128,58],[372,50],[648,44],[822,56],[1102,48]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?1.8:1.1} fill="white" opacity={0.35+0.4*(i%3)/2} />
      ))}

      {/* Far background buildings */}
      {[[0,265,44,215],[30,235,36,245],[58,215,48,265],[98,248,40,232],[128,225,52,255],[1156,260,44,220],[1118,228,45,252],[1074,208,52,272],[1027,244,40,236],[986,218,48,262]].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} fill="url(#bldFar)" />
      ))}

      {/* Left main tower */}
      <rect x="0" y="112" width="92" height="368" fill="url(#bldDark)" />
      <rect x="40" y="70" width="5" height="46" fill="#333" />
      <circle cx="42" cy="68" r="4" fill="white" opacity="0.88" />
      {[0,1,2,3,4,5,6,7,8].map(r=>[0,1,2].map(c=>(
        <rect key={`lt${r}${c}`} x={8+c*26} y={118+r*26} width="16" height="18"
          fill={(r+c)%3!==1?"rgba(255,255,255,0.78)":"rgba(255,255,255,0.06)"} rx="1"/>
      )))}

      {/* Left second building */}
      <rect x="102" y="152" width="70" height="328" fill="url(#bldMid)" />
      {[0,1,2,3,4,5,6,7].map(r=>[0,1].map(c=>(
        <rect key={`sl${r}${c}`} x={110+c*32} y={160+r*28} width="20" height="20"
          fill={(r+c)%2===0?"rgba(255,255,255,0.65)":"rgba(255,255,255,0.05)"} rx="1"/>
      )))}

      {/* Right main tower */}
      <rect x="1108" y="98" width="92" height="382" fill="url(#bldDark)" />
      <rect x="1148" y="58" width="5" height="44" fill="#333" />
      <circle cx="1150" cy="56" r="4" fill="white" opacity="0.88" />
      {[0,1,2,3,4,5,6,7,8].map(r=>[0,1,2].map(c=>(
        <rect key={`rt${r}${c}`} x={1116+c*26} y={105+r*26} width="16" height="18"
          fill={(r*c+r)%3!==0?"rgba(255,255,255,0.72)":"rgba(255,255,255,0.05)"} rx="1"/>
      )))}

      {/* Right second building */}
      <rect x="1026" y="148" width="75" height="332" fill="url(#bldMid)" />
      {[0,1,2,3,4,5,6,7].map(r=>[0,1].map(c=>(
        <rect key={`sr${r}${c}`} x={1034+c*34} y={156+r*28} width="22" height="20"
          fill={(r+c+1)%2===0?"rgba(255,255,255,0.60)":"rgba(255,255,255,0.04)"} rx="1"/>
      )))}

      {/* Center spire */}
      <rect x="562" y="62" width="76" height="418" fill="url(#bldDark)" />
      <rect x="576" y="44" width="48" height="22" fill="#1e1e1e" />
      <rect x="586" y="26" width="28" height="22" fill="#222" />
      <rect x="597" y="8"  width="8"  height="22" fill="#2a2a2a" />
      <circle cx="601" cy="6" r="5" fill="white" opacity="0.96" />
      {[0,1,2,3,4,5,6,7,8,9,10].map(r=>[0,1].map(c=>(
        <rect key={`cw${r}${c}`} x={570+c*30} y={70+r*30} width="20" height="22"
          fill={(r+c)%2===0?"rgba(255,255,255,0.82)":"rgba(255,255,255,0.06)"} rx="1"/>
      )))}

      {/* Mid-left buildings */}
      {[[185,208,70,272],[248,178,62,302],[302,228,78,252],[374,192,64,288],[430,220,56,260],[484,202,72,278]].map(([x,y,w,h],i)=>(
        <rect key={`ml${i}`} x={x} y={y} width={w} height={h} fill={i%2===0?"url(#bldDark)":"url(#bldMid)"} />
      ))}

      {/* Mid-right buildings */}
      {[[650,200,70,280],[722,188,74,292],[798,222,60,258],[860,190,68,290],[930,208,64,272],[996,222,52,258]].map(([x,y,w,h],i)=>(
        <rect key={`mr${i}`} x={x} y={y} width={w} height={h} fill={i%2===0?"url(#bldDark)":"url(#bldMid)"} />
      ))}

      {/* Ground */}
      <rect x="0" y="402" width="1200" height="78" fill="url(#groundBW)" />
      <line x1="0" y1="402" x2="1200" y2="402" stroke="white" strokeWidth="1.2" opacity="0.1" />
      {[0,80,160,240,320,400,480,560,640,720,800,880,960,1040,1120].map((x,i)=>(
        <rect key={i} x={x+16} y="412" width="42" height="2" fill="white" opacity="0.07" rx="1" />
      ))}

      {/* Floating particles */}
      {[[220,172,2],[380,142,1.5],[470,192,1.8],[730,158,2],[848,132,1.5],[952,174,2]].map(([x,y,r],i)=>(
        <circle key={i} cx={x} cy={y} r={r} fill="white" opacity="0.45" />
      ))}
    </svg>
  );

  /* ─── Nav Link ───────────────────────────────── */
  const FLink = ({ label, path, delay }) => {
    const navigate = useNavigate();
    const [h, setH] = useState(false);
    return (
      <motion.div
        className="flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        onClick={() => navigate(path)}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          animate={{ width: h ? 12 : 0, opacity: h ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "block", height: 1, background: "rgba(255,255,255,0.55)", flexShrink: 0 }}
        />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 300,
          color: h ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)",
          transition: "color 0.2s", whiteSpace: "nowrap",
        }}>
          {label}
        </span>
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════
    FOOTER
  ══════════════════════════════════════════════ */
  const Footer = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const submit = (e) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSent(true); setEmail("");
      setTimeout(() => setSent(false), 3000);
    };

    return (
      <footer ref={ref} style={{
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        zIndex: 50
      }}>

        {/* ══ HERO — white top merging into black ══ */}
        <div style={{
          position: "relative",
          height: "clamp(340px,42vw,500px)",
          overflow: "hidden",
          /* Page (white) → illustration → black footer below */
          background: "#ffffff",
        }}>
          <CityIllustration />

          {/* Gradient overlay: white at very top (merges with page), transparent in mid, black at bottom */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 80%, #000000 100%)",
          }} />

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "clamp(28px,5vw,52px)",
              left: "clamp(24px,5vw,72px)",
            }}
          >
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px,3.8vw,54px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              margin: 0,
            }}>
              Power your world<br />
              <span style={{ fontWeight: 700, fontStyle: "normal" }}>
                with smarter tech.
              </span>
            </h2>
            <p style={{
              marginTop: 10, fontSize: 13, fontWeight: 300,
              color: "rgba(255,255,255,0.38)", letterSpacing: "0.05em",
            }}>
              Small upgrade. Big difference.
            </p>
          </motion.div>
        </div>

        {/* ══ NAV + NEWSLETTER ══ */}
        <div style={{
          background: "#000000",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            padding: "clamp(32px,5vh,56px) clamp(24px,5vw,72px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "32px 24px",
            alignItems: "start",
          }}>

            {NAV_COLS.map(({ heading, items }, gi) => (
              <div key={heading}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: gi * 0.07 + 0.1 }}
                  style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: "0.3em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 20,
                  }}
                >
                  {heading}
                </motion.p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((it, ii) => (
                    <FLink key={it.label} label={it.label} path={it.path} delay={gi * 0.07 + ii * 0.04 + 0.2} />
                  ))}
                </div>
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <motion.p
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.35 }}
                style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.3em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 20,
                }}
              >
                Newsletter
              </motion.p>
              <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.32)", lineHeight: 1.7, marginBottom: 16 }}>
                Deals, drops & picks — straight to your inbox.
              </p>
              <form onSubmit={submit}>
                <div style={{
                  display: "flex", border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.03)",
                }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      padding: "11px 14px", fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13, color: "rgba(255,255,255,0.78)", minWidth: 0,
                    }}
                  />
                  <motion.button type="submit"
                    whileHover={{ background: "rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.94 }}
                    style={{
                      width: 46, height: 46, background: "rgba(255,255,255,0.07)",
                      border: "none", borderLeft: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {sent
                        ? <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            style={{ color: "#aaaaaa", fontSize: 16 }}>✓</motion.span>
                        : <motion.div key="arr">
                            <ArrowRight size={14} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.65)" }} />
                          </motion.div>
                      }
                    </AnimatePresence>
                  </motion.button>
                </div>
              </form>
              <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.14)", marginTop: 8, letterSpacing: "0.03em" }}>
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Contact CTA */}
            <div>
              <motion.p
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.45 }}
                style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.3em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 20,
                }}
              >
                Connect
              </motion.p>
              <motion.button
                whileHover={{ background: "#ffffff", color: "#000000" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/connect-us")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.4)",
                  padding: "12px 22px",
                  color: "rgba(255,255,255,0.82)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.14em",
                  textTransform: "uppercase", cursor: "pointer",
                  transition: "background 0.2s, color 0.2s", whiteSpace: "nowrap",
                }}
              >
                Contact Us
              </motion.button>
            </div>

          </div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div style={{ background: "#000000" }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            padding: "18px clamp(24px,5vw,72px)",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>

            {/* Logo */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="1" y="1" width="24" height="24" rx="3"
                    stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" />
                  <text x="13" y="18" textAnchor="middle"
                    style={{ fontSize: 11, fontWeight: 700, fontFamily: "DM Sans,sans-serif", fill: "rgba(255,255,255,0.82)" }}>
                    TM
                  </text>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.80)", letterSpacing: "0.06em" }}>
                  TechMart
                </span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.16)", letterSpacing: "0.04em" }}>
                Copyright © 2025
              </span>
            </div>

            {/* Divider */}
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)", margin: "0 20px", minWidth: 30 }} />

            {/* Policies */}
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {POLICIES.map(t => (
                <span key={t}
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", cursor: "pointer", letterSpacing: "0.03em", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.target.style.color = "rgba(255,255,255,0.55)")}
                  onMouseLeave={e => (e.target.style.color = "rgba(255,255,255,0.18)")}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {[
                { Icon: Twitter,   label: "Twitter"   },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube,   label: "YouTube"   },
                { Icon: Linkedin,  label: "LinkedIn"  },
              ].map(({ Icon, label }) => (
                <motion.button key={label}
                  whileHover={{ scale: 1.18, color: "rgba(255,255,255,0.9)" }}
                  whileTap={{ scale: 0.9 }} title={label}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    color: "rgba(255,255,255,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "color 0.2s",
                  }}
                >
                  <Icon size={16} strokeWidth={1.6} />
                </motion.button>
              ))}
            </div>

          </div>
        </div>

      </footer>
    );
  };

  export default Footer;