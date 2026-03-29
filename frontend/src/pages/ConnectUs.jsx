import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, CheckCircle2,
  Twitter, Instagram, Youtube, Github, ArrowUpRight,
  MessageSquare, Clock, Search, ChevronRight, Inbox
} from "lucide-react";
import { API_URL } from "../config.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("cu-fonts")) {
  const l = document.createElement("link");
  l.id = "cu-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

const CONTACT_INFO = [
  { icon: Mail,   label: "Email",   value: "support@techmart.in",   sub: "Reply within 24 hours"   },
  { icon: Phone,  label: "Phone",   value: "+91 98765 43210",       sub: "Mon–Sat, 9 AM – 6 PM"    },
  { icon: MapPin, label: "Address", value: "Sector 17, Chandigarh", sub: "Punjab, India – 160017"  },
];

const SOCIALS = [
  { icon: Twitter,   label: "Twitter",   href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube,   label: "YouTube",   href: "#" },
  { icon: Github,    label: "GitHub",    href: "#" },
];

const STATUS_BADGE = {
  pending:  { label: "Pending",  cls: "bg-amber-50 text-amber-600 border-amber-200" },
  replied:  { label: "Replied",  cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  closed:   { label: "Closed",   cls: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

/* ── Input field component ── */
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

/* ── FadeIn wrapper ── */
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

/* ── Query Reply Card ── */
function QueryCard({ query }) {
  const [open, setOpen] = useState(false);
  const badge = STATUS_BADGE[query.status] || STATUS_BADGE.pending;

  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block text-[9px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-medium text-[#0f0f0f] truncate">
            {query.subject}
          </p>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 mt-0.5">
            {new Date(query.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <ChevronRight size={14} className={`text-black/25 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <div className="px-5 pb-5 flex flex-col gap-4 border-t border-black/[0.05]">
              {/* My message */}
              <div className="pt-4">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.18em] text-black/30 mb-2">Your Message</p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/65 leading-relaxed bg-[#f7f5f2] px-4 py-3 rounded-xl">
                  {query.message}
                </p>
              </div>

              {/* Admin reply */}
              {query.adminReply ? (
                <div>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-2">TechMart Reply</p>
                  <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-emerald-800 leading-relaxed">
                      {query.adminReply}
                    </p>
                    {query.repliedAt && (
                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-emerald-600/55 mt-1.5">
                        Replied on {new Date(query.repliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-black/35">
                  <Clock size={12} strokeWidth={1.5} />
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px]">Our team will reply soon.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function ConnectUs() {
  const { user } = useAuth();
  const [tab, setTab] = useState("send"); // "send" | "replies"
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [checkEmail, setCheckEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [myQueries, setMyQueries] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── Submit new query to backend ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send query");
      setSent(true);
      toast.success("Query submitted! We'll reply soon.");
      setTimeout(() => {
        setSent(false);
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 3500);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  /* ── Fetch queries by email ── */
  const fetchQueriesByEmail = async (email) => {
    setChecking(true);
    setMyQueries(null);
    try {
      const res = await fetch(`${API_URL}/api/queries/my?email=${encodeURIComponent(email.trim())}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMyQueries(data.queries);
    } catch (err) {
      toast.error(err.message || "Could not fetch queries");
    } finally {
      setChecking(false);
    }
  };

  /* ── Auto-fetch when tab switches to replies (logged-in user) ── */
  useEffect(() => {
    if (tab === "replies" && user?.email) {
      fetchQueriesByEmail(user.email);
    }
    if (tab !== "replies") {
      setMyQueries(null); // reset on tab change
    }
  }, [tab, user]);

  /* ── Manual email submit (for guests) ── */
  const handleCheckReplies = async (e) => {
    e.preventDefault();
    if (!checkEmail.trim()) return;
    fetchQueriesByEmail(checkEmail);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-28">

        {/* ══ HEADER ══ */}
        <FadeIn className="mb-12">
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

        {/* ══ TABS ══ */}
        <FadeIn delay={0.08} className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[
              { id: "send",    icon: Send,           label: "Send a Query"  },
              { id: "replies", icon: MessageSquare,   label: "My Replies"   },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium transition-all duration-200 ${
                  tab === id
                    ? "bg-[#0f0f0f] text-white"
                    : "bg-white border border-black/[0.08] text-black/45 hover:text-[#0f0f0f] hover:border-black/20"
                }`}
              >
                <Icon size={13} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-6 items-start">

          {/* LEFT — contact info */}
          <div className="flex flex-col gap-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="group flex items-center gap-5 bg-white border border-black/[0.07] rounded-2xl px-6 py-5 hover:border-black/[0.15] transition-colors duration-300 cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center shrink-0 group-hover:bg-[#f0ede8] transition-colors duration-200">
                    <Icon size={16} className="text-black/40" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-1">{label}</p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-medium text-[#0f0f0f] truncate">{value}</p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/36 mt-0.5">{sub}</p>
                  </div>
                  <ArrowUpRight size={13} className="text-black/20 group-hover:text-black/45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                </div>
              </FadeIn>
            ))}

            {/* Social links */}
            <FadeIn delay={0.35}>
              <div className="bg-white border border-black/[0.07] rounded-2xl px-6 py-5">
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-4">Follow Us</p>
                <div className="grid grid-cols-4 gap-3">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                      className="group flex flex-col items-center gap-2 py-3.5 bg-[#f7f5f2] border border-black/[0.06] rounded-xl hover:bg-[#f0ede8] hover:border-black/[0.12] transition-all duration-200">
                      <Icon size={16} className="text-black/35 group-hover:text-[#0f0f0f] transition-colors duration-200" strokeWidth={1.5} />
                      <span className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.14em] text-black/32 group-hover:text-black/55 transition-colors">{label}</span>
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

          {/* RIGHT — tab content */}
          <FadeIn delay={0.15}>
            <AnimatePresence mode="wait">

              {/* ── SEND QUERY FORM ── */}
              {tab === "send" && (
                <motion.div key="send"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                  className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
                >
                  <div className="px-7 py-5 border-b border-black/[0.06]">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1.5">Send a Message</p>
                    <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[24px] font-[500] text-[#0f0f0f] leading-none">
                      We'd love to <em className="italic font-[400]">hear from you</em>
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Arjun Sharma" required />
                      <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
                    </div>
                    <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Order issue, product query, feedback…" required />
                    <Field label="Message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help you…" textarea required />

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
                </motion.div>
              )}

              {/* ── MY REPLIES TAB ── */}
              {tab === "replies" && (
                <motion.div key="replies"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                  className="flex flex-col gap-4"
                >

                  {/* ── LOGGED IN: auto-show queries ── */}
                  {user ? (
                    <>
                      {/* Header */}
                      <div className="bg-white border border-black/[0.07] rounded-2xl px-7 py-5 flex items-center justify-between">
                        <div>
                          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1">My Queries</p>
                          <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] leading-none">
                            Your <em className="italic font-[400]">conversations</em>
                          </h2>
                        </div>
                        <motion.button
                          onClick={() => fetchQueriesByEmail(user.email)}
                          disabled={checking}
                          whileTap={{ scale: 0.93 }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-medium bg-[#f7f5f2] border border-black/[0.07] text-black/45 hover:text-[#0f0f0f] hover:border-black/[0.15] transition-all"
                        >
                          {checking ? (
                            <motion.span className="w-3.5 h-3.5 border-[1.5px] border-black/15 border-t-black/50 rounded-full"
                              animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                          ) : (
                            <Search size={12} strokeWidth={1.5} />
                          )}
                          Refresh
                        </motion.button>
                      </div>

                      {/* Loading skeleton */}
                      {checking && (
                        <div className="flex flex-col gap-3">
                          {[1, 2].map(i => (
                            <div key={i} className="h-[72px] bg-white border border-black/[0.07] rounded-2xl animate-pulse" />
                          ))}
                        </div>
                      )}

                      {/* Results */}
                      <AnimatePresence>
                        {!checking && myQueries !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="flex flex-col gap-3"
                          >
                            {myQueries.length === 0 ? (
                              <div className="bg-white border border-black/[0.07] rounded-2xl px-7 py-12 flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center">
                                  <Inbox size={18} className="text-black/25" strokeWidth={1.5} />
                                </div>
                                <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 text-center">
                                  You haven't sent any queries yet.
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 font-medium">
                                  {myQueries.length} quer{myQueries.length === 1 ? "y" : "ies"}
                                </p>
                                {myQueries.map(q => <QueryCard key={q._id} query={q} />)}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    /* ── GUEST: email form ── */
                    <>
                      <div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden">
                        <div className="px-7 py-5 border-b border-black/[0.06]">
                          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1.5">Track Replies</p>
                          <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[24px] font-[500] text-[#0f0f0f] leading-none">
                            Check your <em className="italic font-[400]">responses</em>
                          </h2>
                        </div>
                        <form onSubmit={handleCheckReplies} className="p-7 flex flex-col gap-4">
                          <Field
                            label="Your Email Address"
                            name="checkEmail"
                            type="email"
                            value={checkEmail}
                            onChange={e => setCheckEmail(e.target.value)}
                            placeholder="you@email.com"
                            required
                          />
                          <motion.button
                            type="submit"
                            disabled={checking}
                            className={`w-full py-3.5 rounded-2xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                              checking ? "bg-black/[0.06] text-black/30 cursor-not-allowed" : "bg-[#0f0f0f] text-white hover:bg-black/80"
                            }`}
                            whileTap={!checking ? { scale: 0.985 } : {}}
                          >
                            {checking ? (
                              <>
                                <motion.span className="w-4 h-4 border-[1.5px] border-black/15 border-t-black/50 rounded-full"
                                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                                Searching…
                              </>
                            ) : (
                              <><Search size={13} strokeWidth={1.5} /> Find My Queries</>
                            )}
                          </motion.button>
                        </form>
                      </div>

                      <AnimatePresence>
                        {myQueries !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="flex flex-col gap-3"
                          >
                            {myQueries.length === 0 ? (
                              <div className="bg-white border border-black/[0.07] rounded-2xl px-7 py-10 flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center">
                                  <Inbox size={18} className="text-black/25" strokeWidth={1.5} />
                                </div>
                                <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 text-center">
                                  No queries found for this email.
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 font-medium">
                                  {myQueries.length} quer{myQueries.length === 1 ? "y" : "ies"} found
                                </p>
                                {myQueries.map(q => <QueryCard key={q._id} query={q} />)}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
}