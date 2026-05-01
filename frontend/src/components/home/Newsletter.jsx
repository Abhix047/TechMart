import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Send, Mail } from "lucide-react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("na-lux-fonts")) {
  const l = document.createElement("link");
  l.id = "na-lux-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Tenor+Sans&family=Inter:wght@300;400;500&display=swap";
  document.head.appendChild(l);
}

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
              duration: 0.8,
              delay: delay + i * 0.02,
              ease: [0.16, 1, 0.3, 1],
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
  const inView     = useInView(sectionRef, { once: true, margin: "0px 0px -100px 0px" });

  const handleSubmit = async () => {
    if (!email || !email.includes("@") || loading || submitted) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <section
      ref={sectionRef}
      className="relative px-6 sm:px-12 lg:px-24 pt-16 pb-0 md:pt-24 bg-white overflow-hidden"
    >
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-black/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-black/[0.03] to-transparent" />
        
        {/* Animated Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF4D00]/[0.05] rounded-full blur-[120px]" 
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FF4D00]/20 rounded-full"
            animate={{
              y: [0, -40, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        
        {/* Floating Index */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-8 h-[1px] bg-black/10" />
          <span className="font-[family-name:'Tenor_Sans',sans-serif] text-[10px] tracking-[0.4em] uppercase text-black/40">
            Techmart Intel
          </span>
          <div className="w-8 h-[1px] bg-black/10" />
        </motion.div>

        {/* Main Editorial Heading */}
        <div className="mb-6">
          <h2 className="flex flex-col items-center">
            <CharReveal 
              text="New drops," 
              italic={false} 
              delay={0.1} 
              inView={inView} 
              className="text-[clamp(36px,5vw,72px)] font-normal text-[#0a0a0a]" 
            />
            <CharReveal 
              text="delivered weekly." 
              italic={true} 
              delay={0.3} 
              inView={inView} 
              className="text-[clamp(30px,4.5vw,64px)] font-light text-[#0a0a0a]/60 mt-[-0.1em]" 
            />
          </h2>
        </div>

        {/* Subtitle */}
        <div className="max-w-[480px] mb-12 px-4">
          <motion.p
            className="font-[family-name:'Inter',sans-serif] font-light text-[clamp(14px,1.1vw,16px)] text-black/40 leading-relaxed tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Join a curated community of tech enthusiasts. Be the first to access 
            limited drops and exclusive industry insights.
          </motion.p>
        </div>

        {/* Improved Glassmorphic Input Card */}
        <motion.div
          className="w-full max-w-[500px] relative"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative bg-[#faf9f8] border border-black/[0.05] rounded-3xl p-2 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_40px_80px_-12px_rgba(255,77,0,0.08)]">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="flex items-center justify-center gap-4 py-4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <Check size={18} className="text-white" />
                  </div>
                  <span className="font-[family-name:'Tenor_Sans',sans-serif] text-[11px] tracking-[0.2em] uppercase text-black/80 font-bold">
                    Success! You're in.
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 relative flex items-center px-4 py-3 sm:py-0">
                    <Mail size={16} className={`transition-colors duration-500 ${focused ? 'text-[#FF4D00]' : 'text-black/15'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onKeyDown={handleKey}
                      placeholder="email@example.com"
                      className="w-full pl-4 pr-2 bg-transparent border-none outline-none font-[family-name:'Inter',sans-serif] text-[15px] text-[#0a0a0a] placeholder:text-black/15"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="relative h-[56px] sm:h-auto px-10 py-4 bg-[#0a0a0a] rounded-[20px] overflow-hidden group/btn"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-[#FF4D00] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                    />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <span className="font-[family-name:'Tenor_Sans',sans-serif] text-[11px] tracking-[0.2em] uppercase text-white font-bold">
                            Subscribe
                          </span>
                          <ArrowRight size={14} className="text-white group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Refined Footer Details */}
        <motion.div
          className="mt-10 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-1 bg-[#FF4D00] rounded-full animate-ping" />
            <p className="font-[family-name:'Tenor_Sans',sans-serif] text-[10px] tracking-[0.15em] text-black/30">
              Limited slots available for May 2026
            </p>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </motion.div>
      </div>
      
      {/* Decorative Corner Text */}
      <div className="absolute bottom-12 left-12 hidden lg:block overflow-hidden">
        <motion.span 
          initial={{ y: "100%" }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="block font-[family-name:'Tenor_Sans',sans-serif] text-[9px] tracking-[0.4em] uppercase text-black/15 rotate-90 origin-left"
        >
          Techmart Editorial
        </motion.span>
      </div>
    </section>
  );
};

export default Newsletter;