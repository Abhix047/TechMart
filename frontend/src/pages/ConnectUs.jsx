import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, CheckCircle2,
  Twitter, Instagram, Youtube, Github, ArrowUpRight
} from "lucide-react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("cu-fonts")) {
  const l = document.createElement("link");
  l.id = "cu-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

const CONTACT_INFO = [
  { icon: Mail,   label: "Email",   value: "support@techmart.in",  sub: "Reply within 24 hours"    },
  { icon: Phone,  label: "Phone",   value: "+91 98765 43210",      sub: "Mon–Sat, 9 AM – 6 PM"     },
  { icon: MapPin, label: "Address", value: "Sector 17, Chandigarh", sub: "Punjab, India – 160017"  },
];

const SOCIALS = [
  { icon: Twitter,   label: "Twitter",   href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube,   label: "YouTube",   href: "#" },
  { icon: Github,    label: "GitHub",    href: "#" },
];

/* ── Input component ── */
function Field({ label, name, type = "text", value, onChange, placeholder, textarea, required }) {
  const [focused, setFocused] = useState(false);
  const cls = `w-full bg-[#f7f5f2] border rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[13.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none transition-all duration-200 px-4 py-2.5 ${
    focused ? "border-black/25 bg-white" : "border-black/[0.08] hover:border-black/15"
  } ${textarea ? "resize-none min-h-[120px]" : ""}`;

  return (
    <div>
      <label className="block font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/38 mb-2">
        {label}{required && " *"}
      </label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} rows={5} className={cls} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} className={cls} />
      )}
    </div>
  );
}

/* ── Section fade wrapper ── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px -60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease }}>
      {children}
    </motion.div>
  );
}

export default function ConnectUs() {
  const [form,    setForm]    = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false); setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-28">

        {/* ══ HEADER ══ */}
        <FadeIn className="mb-16">
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.26em] text-black/28 mb-4 text-center">
            Get in Touch
          </p>
          <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(44px,7vw,80px)] font-[300] text-[#0f0f0f] leading-none text-center">
            Let's <em className="italic font-[300]">Talk</em>
          </h1>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-light text-black/42 text-center mt-4 max-w-[440px] mx-auto leading-relaxed">
            Have a question, feedback, or need support? We'd love to hear from you.
          </p>
        </FadeIn>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-6 items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-4">

            {/* Contact info cards */}
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="group flex items-center gap-5 bg-white border border-black/[0.07] rounded-2xl px-6 py-5 hover:border-black/[0.15] transition-colors duration-300 cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center shrink-0 group-hover:bg-[#f0ede8] transition-colors duration-200">
                    <Icon size={16} className="text-black/40" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-1">
                      {label}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-medium text-[#0f0f0f] truncate">
                      {value}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/36 mt-0.5">
                      {sub}
                    </p>
                  </div>
                  <ArrowUpRight size={13} className="text-black/20 group-hover:text-black/45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                </div>
              </FadeIn>
            ))}

            {/* Social links */}
            <FadeIn delay={0.35}>
              <div className="bg-white border border-black/[0.07] rounded-2xl px-6 py-5">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-4">
                  Follow Us
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                      className="group flex flex-col items-center gap-2 py-3.5 bg-[#f7f5f2] border border-black/[0.06] rounded-xl hover:bg-[#f0ede8] hover:border-black/[0.12] transition-all duration-200">
                      <Icon size={16} className="text-black/35 group-hover:text-[#0f0f0f] transition-colors duration-200" strokeWidth={1.5} />
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.14em] text-black/32 group-hover:text-black/55 transition-colors">
                        {label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Response time */}
            <FadeIn delay={0.42}>
              <div className="flex items-center gap-3 bg-white border border-black/[0.07] rounded-2xl px-6 py-4">
                <motion.span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                  animate={{ opacity: [1, 0.35, 1], scale: [1, 0.65, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#0f0f0f]">
                  Typically respond within{" "}
                  <span className="font-semibold">2–4 hours</span>{" "}
                  <span className="text-black/40 font-light">on business days.</span>
                </p>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — form ── */}
          <FadeIn delay={0.15}>
            <div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden">

              {/* Form header */}
              <div className="px-7 py-5 border-b border-black/[0.06]">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1.5">
                  Send a Message
                </p>
                <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[24px] font-[500] text-[#0f0f0f] leading-none">
                  We'd love to <em className="italic font-[400]">hear from you</em>
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-4">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" value={form.name} onChange={handleChange}
                    placeholder="Arjun Sharma" required />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com" required />
                </div>

                <Field label="Subject" name="subject" value={form.subject} onChange={handleChange}
                  placeholder="Order issue, product query, feedback…" required />

                <Field label="Message" name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us how we can help you…" textarea required />

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={sending || sent}
                  className={`w-full py-3.5 rounded-2xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    sent
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : sending
                      ? "bg-black/[0.06] text-black/30 cursor-not-allowed"
                      : "bg-[#0f0f0f] text-white hover:bg-black/80"
                  }`}
                  whileTap={!sending && !sent ? { scale: 0.985 } : {}}
                >
                  {sent ? (
                    <motion.span className="flex items-center gap-2"
                      initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <CheckCircle2 size={14} /> Message Sent — Thank You!
                    </motion.span>
                  ) : sending ? (
                    <>
                      <motion.span className="w-4 h-4 border-[1.5px] border-black/15 border-t-black/50 rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                      Sending…
                    </>
                  ) : (
                    <><Send size={13} strokeWidth={1.5} /> Send Message</>
                  )}
                </motion.button>

                <p className="font-[family-name:'DM_Sans',sans-serif] text-center text-[11px] text-black/28">
                  We respect your privacy · No spam, ever.
                </p>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
}