import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Zap, Shield, Heart, Package } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

/* ── Real Unsplash photos (free to use) ── */
const PHOTOS = {
  hero:       "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=85&auto=format&fit=crop",
  mission:    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=85&auto=format&fit=crop",
  workspace:  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=85&auto=format&fit=crop",
  products:   "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=900&q=85&auto=format&fit=crop",
};

/* ── Fade-in section wrapper ── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px -60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}


const STATS = [
  { num: "10K+", label: "Happy Customers" },
  { num: "500+", label: "Premium Products" },
  { num: "48h",  label: "Avg. Delivery"   },
  { num: "4.9★", label: "Customer Rating" },
];

const VALUES = [
  { icon: Zap,     title: "Curated, Not Cluttered", body: "Every product earns its place through rigorous real-world testing. We carry fewer things so you find better ones." },
  { icon: Shield,  title: "Transparent Pricing",    body: "No fake markdowns, no hidden fees. The price you see is the fairest we can offer — because trust is everything." },
  { icon: Heart,   title: "Obsessive Service",      body: "Our support team are product experts, not scripts. When something goes wrong, we make it right — fast." },
  { icon: Package, title: "Faster Delivery",        body: "48-hour delivery to your door. We obsess over packaging and handling so your tech arrives in perfect condition." },
];

export default function About() {
  return (
    <div
      className="min-h-screen bg-[#f7f5f2] text-[#0f0f0f]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ══════════════════════════════════════════
          SECTION 1 — FULL BLEED HERO
          Photo background, editorial text overlay
      ══════════════════════════════════════════ */}
      <div className="relative min-h-[92vh] flex items-end overflow-hidden">
        {/* Background photo */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={PHOTOS.hero}
            alt="Tech workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f0f0f]/60" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-20 pt-40">
          <motion.p
            className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38 mb-5"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
          >
            Our Story · Est. 2020
          </motion.p>

          <motion.h1
            className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(52px,8vw,100px)] font-[300] text-white leading-[1] mb-8 max-w-[900px]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease }}
          >
            Where Technology<br />
            Meets <em className="italic font-[300]">Craft</em>
          </motion.h1>

          {/* Stats strip */}
          <motion.div
            className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/15"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.52, ease }}
          >
            {STATS.map((s, i) => (
              <div key={i}>
                <p className="font-[family-name:'Cormorant_Garamond',serif] text-[32px] font-[400] text-white leading-none">
                  {s.num}
                </p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium uppercase tracking-[0.18em] text-white/38 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute right-10 bottom-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="w-px h-14 bg-white/25" />
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[9px] tracking-[0.2em] uppercase text-white/35 rotate-90 origin-center mt-2">
            Scroll
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — MISSION (asymmetric 2-col)
          Big photo left, text right
      ══════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-center">

          {/* Photo */}
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src={PHOTOS.mission}
                alt="Our mission"
                className="w-full h-full object-cover"
              />
              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 border border-black/[0.06]">
                <p className="font-[family-name:'Cormorant_Garamond',serif] text-[32px] font-[500] text-[#0f0f0f] leading-none">
                  500+
                </p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.14em] text-black/38 mt-1">
                  Products Curated
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn delay={0.12}>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-4">
              Our Mission
            </p>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(36px,4vw,52px)] font-[400] text-[#0f0f0f] leading-[1.07] mb-7">
              Technology should feel{" "}
              <em className="italic font-[300] text-black/45">extraordinary</em>
            </h2>
            <div className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-light text-black/55 leading-[1.9] space-y-4">
              <p>
                Tech Mart was built on a simple belief — that buying technology should be as delightful as using it. We're not just a store. We're curators of experiences, gatekeepers of quality, and advocates for people who demand the best.
              </p>
              <p>
                Every product on our platform is hand-selected by our team of experts who live and breathe what they sell. No compromises, no clutter — only what truly deserves your attention and your money.
              </p>
              <p>
                From the moment you browse to the day your package arrives, every touchpoint is crafted with intention. That's the Tech Mart promise.
              </p>
            </div>
            <Link to="/products">
              <motion.div
                className="inline-flex items-center gap-2 mt-10 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold text-[#0f0f0f] group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Explore our collection
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </motion.div>
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 — VALUES (full-width dark band)
      ══════════════════════════════════════════ */}
      <div className="bg-[#0f0f0f] py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          <FadeIn>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-white/28 mb-4">
              What We Stand For
            </p>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(34px,4vw,48px)] font-[400] text-white leading-none mb-14">
              Our <em className="italic font-[300]">Principles</em>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 h-full hover:bg-white/[0.07] transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-5">
                    <Icon size={16} className="text-white/55" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-medium text-white mb-3 leading-snug">
                    {title}
                  </h3>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-light text-white/42 leading-[1.85]">
                    {body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 4 — SPLIT PHOTO COLLAGE
          2 photos side by side with text
      ══════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-stretch">

          {/* Left col — stacked 2 photos */}
          <div className="flex flex-col gap-6">
            <FadeIn className="flex-1">
              <div className="rounded-2xl overflow-hidden h-full min-h-[240px]">
                <img
                  src={PHOTOS.workspace}
                  alt="Our workspace"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="flex-1">
              <div className="rounded-2xl overflow-hidden h-full min-h-[240px]">
                <img
                  src={PHOTOS.products}
                  alt="Our products"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
          </div>

          {/* Right col — text + big number */}
          <FadeIn delay={0.15} className="flex flex-col justify-center pl-0 lg:pl-8">
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-4">
              The Difference
            </p>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(36px,4vw,52px)] font-[400] text-[#0f0f0f] leading-[1.07] mb-6">
              Obsessed with<br />
              <em className="italic font-[300] text-black/45">every detail</em>
            </h2>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-light text-black/52 leading-[1.9] mb-8">
              From the moment a product enters our consideration list to the second it lands on your doorstep, it passes through dozens of quality checkpoints. Our warehouse team wraps each order by hand. Our logistics partners are chosen for care, not just speed.
            </p>

            {/* Milestone numbers */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { num: "2026", label: "By Abhishek Kumar" },
                { num: "99%",  label: "On-time delivery rate" },
                { num: "4.9",  label: "Average review score" },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-black/[0.07] rounded-2xl px-5 py-4">
                  <p className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[500] text-[#0f0f0f] leading-none">
                    {m.num}
                  </p>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/36 uppercase tracking-[0.12em] mt-1.5">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 6 — CTA (full-bleed photo)
      ══════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: "440px" }}>
        <img
          src={PHOTOS.products}
          alt="Products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f0f0f]/72" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full min-h-[440px] px-6 py-20">
          <FadeIn>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.26em] text-white/32 mb-5">
              Ready to Experience the Difference?
            </p>
            <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(40px,6vw,72px)] font-[300] text-white leading-none mb-10 max-w-[800px] mx-auto">
              Discover products worth <em className="italic">owning</em>
            </h2>
            <Link to="/products">
              <motion.button
                className="inline-flex items-center gap-2.5 bg-white text-[#0f0f0f] font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold px-8 py-4 rounded-2xl hover:bg-white/88 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Collection <ArrowUpRight size={14} />
              </motion.button>
            </Link>
          </FadeIn>
        </div>
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`}</style>
    </div>
  );
}