import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, X, ArrowRight, Eye, EyeOff, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("auth-fonts")) {
  const l = document.createElement("link");
  l.id = "auth-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

/* ── Word-by-word clip reveal ── */
function WordReveal({ words }) {
  return (
    <div className="flex flex-wrap gap-[0.2em]">
      {words.map(({ text, italic, faded, delay }, wi) =>
        text.split(" ").map((word, i) => (
          <span key={`${wi}-${i}`} className="overflow-hidden inline-block">
            <motion.span
              className={[
                "inline-block font-[family-name:'Cormorant_Garamond',serif] font-light leading-[1.15]",
                "text-[clamp(36px,4vw,46px)]",
                italic ? "italic font-[400]" : "",
                faded ? "text-white/52" : "text-white",
              ].join(" ")}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.78, delay: delay + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
        ))
      )}
    </div>
  );
}

/* ── Input ── */
function InputField({ icon: Icon, type, name, placeholder, value, onChange, showToggle, onToggle, showPass }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex transition-colors duration-200 ${focused ? "text-[#0a0a0a]" : "text-black/30"}`}>
        <Icon size={14} strokeWidth={1.7} />
      </span>
      <input
        type={showToggle ? (showPass ? "text" : "password") : type}
        name={name} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} required
        className={[
          "w-full pl-10 py-3 rounded-xl outline-none transition-all duration-200",
          "font-[family-name:'DM_Sans',sans-serif] text-[13px] text-[#0a0a0a] placeholder:text-black/28",
          showToggle ? "pr-10" : "pr-4",
          focused
            ? "bg-white border-[1.5px] border-[#0a0a0a] shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"
            : "bg-[#f7f6f4] border-[1.5px] border-black/[0.11]",
        ].join(" ")}
      />
      {showToggle && (
        <button type="button" onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/28 hover:text-black/60 transition-colors flex p-0 bg-transparent border-none cursor-pointer"
        >
          {showPass ? <EyeOff size={13} strokeWidth={1.7} /> : <Eye size={13} strokeWidth={1.7} />}
        </button>
      )}
    </div>
  );
}

/* ════════════════════ MAIN ════════════════════ */
const Login = ({ onSwitch, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange  = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit  = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      if (res.data) {
        const sessionUser = await login(res.data);
        if (!sessionUser) {
          throw new Error("Login session could not be established");
        }
        toast.success("Login successful!");
        onClose();
        // Admin users ko admin dashboard pe redirect karo
        if (sessionUser.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      className="w-full flex overflow-hidden rounded-[18px] border border-black/[0.09]"
      style={{ maxWidth: 720, boxShadow: "0 32px 80px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08)" }}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >

      {/* ── LEFT: Dark panel ── */}
      <div className="hidden md:flex flex-col justify-between bg-[#0a0a0a] relative overflow-hidden p-9 shrink-0 w-[300px]">

        {/* Animated circles */}
        {[
          { cls: "w-[260px] h-[260px] -top-20 -right-20", d: 0 },
          { cls: "w-[180px] h-[180px] -bottom-16 -left-16", d: 1.5 },
          { cls: "w-[90px]  h-[90px]  top-[44%] right-4",  d: 0.8 },
        ].map(({ cls, d }, i) => (
          <motion.div key={i}
            className={`absolute ${cls} rounded-full border-[0.7px] border-white/[0.06] pointer-events-none`}
            animate={{ scale: [1, 1.06, 0.95, 1], opacity: [0.5, 0.9, 0.4, 0.5] }}
            transition={{ duration: 7 + i * 2, delay: d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Dot cluster */}
        <div className="absolute right-6 top-[45%] flex flex-col gap-[7px]">
          {[0.45, 0.2, 0.35, 0.15].map((op, i) => (
            <motion.div key={i}
              className="w-[3px] h-[3px] rounded-full"
              style={{ background: `rgba(255,255,255,${op})` }}
              animate={{ opacity: [op, op + 0.3, op * 0.4, op] }}
              transition={{ duration: 2.5 + i * 0.4, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Logo */}
        <motion.div className="flex items-center gap-2.5"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-7 h-7 rounded-lg border border-white/[0.14] flex items-center justify-center">
            <div className="w-2.5 h-2.5 border-[1.5px] border-white/55 rounded-[2px] rotate-45" />
          </div>
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium uppercase tracking-[0.28em] text-white/38">
            TechMart
          </span>
        </motion.div>

        {/* Text content */}
        <div className="flex-1 flex flex-col justify-center py-7">
          {/* Heading */}
          <div className="flex flex-col gap-1.5 mb-6">
            <WordReveal words={[
              { text: "Premium", italic: false, faded: false, delay: 0.15 },
              { text: "tech,",   italic: true,  faded: true,  delay: 0.27 },
              { text: "curated", italic: false, faded: false, delay: 0.40 },
              { text: "for you.",italic: true,  faded: true,  delay: 0.53 },
            ]} />
          </div>

          {/* Rule */}
          <motion.div
            className="h-px bg-white/[0.18] mb-5 origin-left"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Subtext */}
          <motion.p
            className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-light text-white/38 leading-[1.75] mb-5"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.86, ease: [0.22, 1, 0.36, 1] }}
          >
            Sign in to access your orders,<br />wishlist and exclusive deals.
          </motion.p>

          {/* Features */}
          {[
            { Icon: Truck,       text: "Free delivery on ₹999+", d: 0.96 },
            { Icon: ShieldCheck, text: "2 year warranty",         d: 1.06 },
            { Icon: RotateCcw,   text: "Easy 30-day returns",     d: 1.16 },
          ].map(({ Icon, text, d }) => (
            <motion.div key={text} className="flex items-center gap-2.5 mb-2.5"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon size={11} strokeWidth={1.8} className="text-white/32 shrink-0" />
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-white/38">{text}</span>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.p
          className="font-[family-name:'DM_Sans',sans-serif] text-[9px] text-white/[0.16]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          © 2025 TechMart. All rights reserved.
        </motion.p>
      </div>

      {/* ── RIGHT: White form ── */}
      <div className="flex-1 bg-white flex flex-col relative">

        {/* Close */}
        <motion.button onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#f2f0ed] border border-black/[0.08] flex items-center justify-center cursor-pointer text-black/40 hover:text-black/70 transition-colors"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        >
          <X size={12} strokeWidth={2.2} />
        </motion.button>

        <div className="flex-1 px-8 pt-9 pb-5">

          {/* Header */}
          <motion.div className="mb-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.28em] text-black/38 mb-1.5">
              Welcome back
            </p>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] font-semibold text-[#0a0a0a] leading-none m-0 text-[clamp(28px,3.5vw,36px)]">
              Sign <em className="italic font-[500]">In</em>
            </h2>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/46 mt-2">
              Enter your credentials to continue.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

            {/* Email */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
              <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 mb-1.5">
                Email address
              </label>
              <InputField icon={Mail} type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Password
                </label>
                <button type="button" className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/44 hover:text-black/75 transition-colors bg-transparent border-none cursor-pointer p-0">
                  Forgot password?
                </button>
              </div>
              <InputField icon={Lock} type="password" name="password" placeholder="Your password" value={form.password} onChange={handleChange} showToggle onToggle={() => setShowPass(v => !v)} showPass={showPass} />
            </motion.div>

            {/* Remember me */}
            <motion.label className="flex items-center gap-2.5 cursor-pointer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.27 }}
            >
              <input type="checkbox" className="w-3.5 h-3.5 cursor-pointer accent-[#0a0a0a]" />
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/50 select-none">
                Remember me
              </span>
            </motion.label>

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              className={`w-full py-3.5 mt-1 rounded-xl border-none font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${loading ? "bg-black/[0.06] text-black/25 cursor-not-allowed" : "bg-[#0a0a0a] text-white hover:bg-black/80 cursor-pointer"}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <motion.span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full inline-block"
                    animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <motion.span className="inline-flex"
                    animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                    <ArrowRight size={14} strokeWidth={2} />
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/[0.08]" />
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium uppercase tracking-[0.22em] text-black/28">or</span>
            <div className="flex-1 h-px bg-black/[0.08]" />
          </div>

          {/* Switch */}
          <p className="text-center font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/46">
            New to TechMart?{" "}
            <button onClick={onSwitch} className="font-semibold text-[#0a0a0a] bg-transparent border-none cursor-pointer underline underline-offset-[3px] hover:text-black/55 transition-colors p-0">
              Create an account
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 py-2.5 border-t border-black/[0.06]">
          <Lock size={9} strokeWidth={2} className="text-black/22" />
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] text-black/24">
            SSL encrypted · 100% secure
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
