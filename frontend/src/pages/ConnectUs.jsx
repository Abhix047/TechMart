import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, CheckCircle2, Cpu,
  Twitter, Instagram, Youtube, Github, ArrowRight, MessageSquare
} from "lucide-react";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    @keyframes gridPulse { 0%,100%{opacity:0.04} 50%{opacity:0.07} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .grid-pulse { animation: gridPulse 4s ease-in-out infinite; }
    .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
  `}</style>
);

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@techstore.in",
    sub: "Reply within 24 hours",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Sat, 9 AM – 6 PM",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Sector 17, Chandigarh",
    sub: "Punjab, India – 160017",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

const socials = [
  { icon: Twitter,   label: "Twitter",   href: "#", color: "hover:text-sky-500",    hoverBg: "hover:bg-sky-50",    border: "hover:border-sky-200" },
  { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-500",   hoverBg: "hover:bg-pink-50",   border: "hover:border-pink-200" },
  { icon: Youtube,   label: "YouTube",   href: "#", color: "hover:text-red-500",    hoverBg: "hover:bg-red-50",    border: "hover:border-red-200" },
  { icon: Github,    label: "GitHub",    href: "#", color: "hover:text-slate-800",  hoverBg: "hover:bg-slate-100", border: "hover:border-slate-300" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export default function ConnectUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }, 3500);
  };

  const inputCls = (name) => [
    "w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 text-slate-800 placeholder-slate-300 font-medium",
    focused === name
      ? "border-indigo-400 bg-white shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
      : "border-slate-200 hover:border-slate-300",
  ].join(" ");

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <FontImport />

      {/* ── Tech Background ── */}
      <div className="absolute inset-0 bg-[#f4f6fb]" />
      <svg className="absolute inset-0 w-full h-full grid-pulse pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cu-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cu-grid)" />
      </svg>
      <svg className="absolute inset-0 w-full h-full opacity-[0.055] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cu-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="1.5" fill="#6366f1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cu-dots)" />
      </svg>
      <div className="absolute -top-40 -right-40 w-[600px] h-[500px] rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[400px] rounded-full bg-violet-100/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 border border-indigo-200 bg-white text-indigo-500 text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-5 shadow-sm">
            <Cpu size={11} strokeWidth={2.5} />
            Get in Touch
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
            Connect{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500">
                With Us
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-40" />
            </span>
          </h2>
          <p className="text-slate-400 text-sm font-medium max-w-md mx-auto">
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_480px] gap-8 items-start">

          {/* ════ LEFT — Contact Info + Social ════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-4"
          >

            {/* Contact cards */}
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.label}
                  variants={itemVariants}
                  className={`group flex items-center gap-5 bg-white border ${info.border} rounded-2xl p-5
                    hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-xl ${info.bg} border ${info.border} flex items-center justify-center flex-shrink-0
                    group-hover:scale-105 transition-transform duration-200`}>
                    <Icon size={20} className={info.color} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">{info.label}</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{info.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{info.sub}</p>
                  </div>
                  <ArrowRight size={14} className={`${info.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0`} />
                </motion.div>
              );
            })}

            {/* Social links */}
            <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare size={15} className="text-indigo-400" strokeWidth={2} />
                <p className="text-sm font-bold text-slate-700">Follow & Connect</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex flex-col items-center gap-2 py-3.5 px-2 bg-slate-50 border border-slate-100 rounded-xl
                        text-slate-400 ${s.color} ${s.hoverBg} ${s.border}
                        hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group`}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Response time badge */}
            <motion.div variants={itemVariants}
              className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <p className="text-xs font-semibold text-indigo-600">
                Typically we respond within <span className="font-extrabold">2–4 hours</span> on business days.
              </p>
            </motion.div>
          </motion.div>

          {/* ════ RIGHT — Contact Form ════ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Form header */}
              <div className="px-7 py-6 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Send size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Send a Message</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">We'll get back to you shortly.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-7 space-y-4">

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 tracking-widest uppercase">Full Name *</label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange}
                      onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                      required className={inputCls("name")} placeholder="Arjun Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 tracking-widest uppercase">Email *</label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                      required className={inputCls("email")} placeholder="you@email.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 tracking-widest uppercase">Subject *</label>
                  <input
                    type="text" name="subject" value={form.subject} onChange={handleChange}
                    onFocus={() => setFocused("subject")} onBlur={() => setFocused("")}
                    required className={inputCls("subject")} placeholder="Order issue, product query, feedback…"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 tracking-widest uppercase">Message *</label>
                  <textarea
                    name="message" rows="5" value={form.message} onChange={handleChange}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
                    required className={`${inputCls("message")} resize-none`}
                    placeholder="Tell us how we can help you…"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending || sent}
                  className={[
                    "w-full py-3.5 rounded-xl font-bold text-[14px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 mt-2",
                    sent
                      ? "bg-emerald-500 text-white cursor-default"
                      : sending
                      ? "bg-indigo-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 active:translate-y-0",
                  ].join(" ")}
                >
                  {sent ? (
                    <>
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                      Message Sent!
                    </>
                  ) : sending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} strokeWidth={2.5} />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400 tracking-wide">
                  We respect your privacy · No spam, ever.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}