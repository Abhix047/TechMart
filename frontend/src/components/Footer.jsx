import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Truck, Mail, MapPin, Phone, Github, Twitter, Instagram, Youtube } from "lucide-react";

const FooterSection = () => {
  const links = {
    Shop: ["Laptops & PCs", "Smartphones", "Audio & Headphones", "Gaming Gear", "Smart Home", "Accessories", "New Arrivals", "Best Deals"],
    Company: ["About TechMart", "Careers", "Press Room", "Sustainability", "Affiliates", "Our Blog"],
    Support: ["Help Center", "Track My Order", "Returns & Refunds", "Warranty Info", "Contact Us", "Privacy Policy"],
  };

  const socials = [
    { icon: <Twitter size={14} />, label: "Twitter" },
    { icon: <Instagram size={14} />, label: "Instagram" },
    { icon: <Youtube size={14} />, label: "YouTube" },
    { icon: <Github size={14} />, label: "GitHub" },
  ];

  const brands = [
    "Apple","Samsung","Sony","OnePlus","Dell","HP","Lenovo","Bose","JBL","Logitech","Asus","Razer","Nothing","boAt",
    "Apple","Samsung","Sony","OnePlus","Dell","HP","Lenovo","Bose","JBL","Logitech","Asus","Razer","Nothing","boAt",
  ];

  const perks = [
    { icon: <Truck size={15} />, title: "Free Delivery", sub: "On orders above ₹999" },
    { icon: <ShieldCheck size={15} />, title: "1-Year Warranty", sub: "On all products" },
    { icon: <Zap size={15} />, title: "Same-Day Dispatch", sub: "Order before 3PM" },
    { icon: <Mail size={15} />, title: "24/7 Support", sub: "Always here to help" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .grad-text {
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .grad-btn:hover { box-shadow: 0 12px 32px rgba(99,102,241,0.5); filter: brightness(1.1); }
        .footer-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .marquee-track { animation: fmarquee 22s linear infinite; }
        @keyframes fmarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .nl-blink { animation: nlblink 2s infinite; }
        @keyframes nlblink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .link-hover { transition: all 0.2s ease; }
        .link-hover:hover { color: rgba(255,255,255,0.85); padding-left: 6px; }
        .social-hover { transition: all 0.2s ease; }
        .social-hover:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.35);
          color: #a5b4fc;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.2);
        }
      `}</style>

      <footer className="font-outfit relative overflow-hidden bg-[#06060c] border-t border-white/5">

        {/* Mesh orbs */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-indigo-500 opacity-10 blur-[120px]" />
          <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full bg-violet-500 opacity-10 blur-[120px]" />
          <div className="absolute bottom-[100px] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-500 opacity-[0.06] blur-[120px]" />
        </div>

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 z-0 footer-grid-bg" />

        {/* ── Marquee ── */}
        <div className="relative z-10 overflow-hidden border-b border-white/5 bg-white/[0.02] py-3.5">
          <div className="marquee-track inline-flex whitespace-nowrap">
            {brands.map((brand, i) => (
              <span key={i} className="inline-flex items-center gap-2.5 px-8 text-[11px] font-medium uppercase tracking-[0.08em] text-white/25">
                <span className="nl-blink h-1 w-1 flex-shrink-0 rounded-full bg-indigo-500" />
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* ── Newsletter band ── */}
        <motion.div
          className="relative z-10 flex flex-wrap items-center justify-between gap-10 border-b border-white/5 px-16 py-12 max-lg:px-8 max-sm:px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            {/* Eyebrow pill */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5">
              <span className="nl-blink h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-indigo-300">Stay in the loop</span>
            </div>
            <div className="font-bebas text-4xl tracking-wide text-white leading-none mb-1.5">
              GET THE <span className="grad-text">BEST DEALS</span>
            </div>
            <p className="text-sm font-light text-white/35">Weekly drops, exclusive offers & early access — zero spam.</p>
          </div>

          <div className="flex w-full max-w-sm flex-shrink-0">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-l-xl border border-white/8 border-r-0 bg-white/[0.04] px-5 py-3.5 text-sm font-light text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button className="grad-btn inline-flex items-center gap-2 rounded-r-xl px-5 py-3.5 text-sm font-semibold text-white transition-all active:scale-95">
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* ── Main link grid ── */}
        <motion.div
          className="relative z-10 grid grid-cols-4 gap-14 border-b border-white/5 px-16 py-16 max-lg:grid-cols-2 max-lg:px-8 max-sm:grid-cols-1 max-sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Brand column */}
          <div>
            <div className="font-bebas mb-4 flex items-center gap-1 text-4xl tracking-wide text-white leading-none">
              Tech<span className="grad-text">Mart</span>
              <span className="nl-blink ml-0.5 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            </div>
            <p className="mb-7 text-[13px] font-light leading-relaxed text-white/35 max-w-[240px]">
              Your destination for next-gen technology. Curated gear, honest reviews, unbeatable prices — delivered fast across India.
            </p>

            {/* Contact */}
            <div className="mb-7 flex flex-col gap-3">
              {[
                { icon: <Mail size={13} />, text: "support@techmart.in" },
                { icon: <Phone size={13} />, text: "1800-TECH-MART" },
                { icon: <MapPin size={13} />, text: "Bengaluru, Karnataka" },
              ].map((c) => (
                <div key={c.text} className="flex items-center gap-2.5 text-[12px] font-light text-white/30">
                  <span className="text-indigo-500 flex-shrink-0">{c.icon}</span>
                  {c.text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
  {socials.map((s) => (
    <a
      key={s.label}
      href="#"
      title={s.label}
      className="social-hover flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-white/40"
    >
      {s.icon}
    </a>
  ))}
</div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items], ci) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + ci * 0.08 }}
            >
              <div className="mb-5 border-b border-indigo-500/10 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-400/80">
                {title}
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <a key={item} href="#" className="link-hover text-[13px] font-light text-white/35">
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
          </motion.div>
        {/* ── Perks strip ── */}
        <motion.div
          className="relative z-10 flex flex-wrap items-center justify-center gap-10 border-b border-white/5 bg-indigo-500/[0.03] px-16 py-7 max-lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/15 bg-indigo-500/10 text-indigo-400">
                {p.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-semibold text-white/70">{p.title}</span>
                <span className="text-[11px] font-light text-white/25">{p.sub}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Bottom bar ── */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-16 py-6 max-lg:px-8 max-sm:flex-col max-sm:px-6 max-sm:text-center">
          <p className="text-[12px] font-light text-white/20">
            © 2025 <strong className="font-medium text-white/40">TechMart</strong>. All rights reserved. Made with ♥ in India.
          </p>
          <div className="flex gap-2">
            {["SSL Secured", "PCI DSS", "ISO 27001"].map((b) => (
              <span key={b} className="font-bebas rounded text-[11px] tracking-[0.1em] text-white/20 border border-white/7 px-2.5 py-1">
                {b}
              </span>
            ))}
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map((l) => (
              <a key={l} href="#" className="text-[11px] font-light text-white/20 transition-colors hover:text-white/50">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;