import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Star, Zap, ShieldCheck, Truck } from "lucide-react";

/* ── Floating product card with 3D tilt ── */
const ProductCard = ({ image, name, price, badge, delay, style }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-12, 12]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const resetMouse = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="product-card"
    >
      {badge && <span className="card-badge">{badge}</span>}
      <div className="card-img-wrap">
        <div className="card-img-placeholder">
          <span className="card-emoji">{image}</span>
        </div>
      </div>
      <div className="card-info">
        <p className="card-name">{name}</p>
        <div className="card-bottom">
          <span className="card-price">{price}</span>
          <div className="card-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Hero ── */
const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Animated counter
  useEffect(() => {
    let start = 0;
    const end = 24800;
    const step = Math.ceil(end / 80);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 18);
    return () => clearInterval(timer);
  }, []);

  const bgX = (mousePos.x - 0.5) * 40;
  const bgY = (mousePos.y - 0.5) * 40;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-root {
          min-height: 100vh;
          background: #06060c;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Animated mesh background ── */
        .hero-mesh {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .mesh-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
          transition: transform 0.8s ease;
        }
        .orb-1 { width: 700px; height: 700px; background: #6366f1; top: -200px; left: -100px; }
        .orb-2 { width: 500px; height: 500px; background: #8b5cf6; top: 100px; right: -100px; }
        .orb-3 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; left: 30%; opacity: 0.1; }

        /* Grid lines */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Layout ── */
        .hero-inner {
          position: relative;
          z-index: 10;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 140px 40px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 100vh;
        }

        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 120px 24px 60px;
            gap: 40px;
          }
          .hero-right { display: none; }
        }

        /* ── LEFT COPY ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 28px;
        }
        .hero-eyebrow span {
          font-size: 12px;
          font-weight: 500;
          color: #a5b4fc;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .eyebrow-dot {
          width: 6px; height: 6px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 8px #6366f1;
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 8vw, 110px);
          line-height: 0.95;
          letter-spacing: 0.01em;
          color: #fff;
          margin-bottom: 24px;
        }
        .hero-h1 .accent {
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 16px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 40px;
        }
        .hero-sub strong { color: rgba(255,255,255,0.75); font-weight: 500; }

        /* ── CTA Buttons ── */
        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 52px;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.25s ease;
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(99,102,241,0.5);
        }
        .btn-primary:active { transform: scale(0.97); }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 500;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        /* ── Stats ── */
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.08);
        }

        /* ── Perks strip ── */
        .hero-perks {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .perk {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .perk svg { color: #6366f1; flex-shrink: 0; }

        /* ── RIGHT: floating cards ── */
        .hero-right {
          position: relative;
          height: 560px;
        }

        .product-card {
          position: absolute;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 16px;
          backdrop-filter: blur(20px);
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          width: 180px;
        }
        .product-card:hover {
          border-color: rgba(99,102,241,0.35);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15);
        }

        .card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .card-img-wrap {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .card-emoji { font-size: 52px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4)); }

        .card-name {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .card-bottom { display: flex; align-items: center; justify-content: space-between; }
        .card-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: #fff;
          letter-spacing: 0.03em;
        }
        .card-stars { display: flex; gap: 1px; }

        /* Floating animation */
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
        @keyframes float2 { 0%,100%{transform:translateY(-8px)} 50%{transform:translateY(8px)} }
        @keyframes float3 { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(12px)} }

        .float-1 { animation: float1 6s ease-in-out infinite; }
        .float-2 { animation: float2 7s ease-in-out infinite; }
        .float-3 { animation: float3 5s ease-in-out infinite; }

        /* ── Glow ring decoration ── */
        .glow-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(99,102,241,0.15);
          pointer-events: none;
        }
        .ring-1 { width: 320px; height: 320px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .ring-2 { width: 480px; height: 480px; top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: 0.5; }

        /* Marquee strip */
        .marquee-wrap {
          position: relative;
          z-index: 10;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          padding: 14px 0;
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-track {
          display: inline-flex;
          gap: 0;
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 32px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .marquee-dot { width: 4px; height: 4px; background: #6366f1; border-radius: 50%; flex-shrink: 0; }
      `}</style>

      <div className="hero-root">
        {/* Background */}
        <div className="hero-mesh">
          <div className="mesh-orb orb-1" style={{ transform: `translate(${bgX * 0.3}px, ${bgY * 0.3}px)` }} />
          <div className="mesh-orb orb-2" style={{ transform: `translate(${-bgX * 0.2}px, ${bgY * 0.2}px)` }} />
          <div className="mesh-orb orb-3" style={{ transform: `translate(${bgX * 0.15}px, ${-bgY * 0.15}px)` }} />
        </div>
        <div className="hero-grid" />

        {/* Main content */}
        <div className="hero-inner">
          {/* LEFT */}
          <div>
            {/* Eyebrow */}
            <motion.div
              className="hero-eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="eyebrow-dot" />
              <span>New Arrivals — 2025 Collection</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="hero-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Next-Gen<br />
              <span className="accent">Tech</span><br />
              Delivered.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Explore <strong>premium gadgets</strong>, laptops, phones & accessories — curated for those who demand the best. Fast shipping, genuine products.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="/products" className="btn-primary">
                Shop Now <ArrowRight size={16} />
              </a>
              <a href="/collections" className="btn-secondary">
                View Collections
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              <div className="stat">
                <span className="stat-num">{count.toLocaleString()}+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">180+</span>
                <span className="stat-label">Brands</span>
              </div>
            </motion.div>

            {/* Perks */}
            <motion.div
              className="hero-perks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.8 }}
            >
              <div className="perk"><Truck size={14} /><span>Free delivery over ₹999</span></div>
              <div className="perk"><ShieldCheck size={14} /><span>1-year warranty</span></div>
              <div className="perk"><Zap size={14} /><span>Same-day dispatch</span></div>
            </motion.div>
          </div>

          {/* RIGHT — Product cards */}
          <div className="hero-right">
            <div className="glow-ring ring-1" />
            <div className="glow-ring ring-2" />

            <div className="float-1" style={{ position: "absolute", top: "20px", left: "60px" }}>
              <ProductCard
                image="💻"
                name="MacBook Pro M4"
                price="₹1,99,900"
                badge="Hot"
                delay={0.5}
                style={{}}
              />
            </div>

            <div className="float-2" style={{ position: "absolute", top: "60px", right: "20px" }}>
              <ProductCard
                image="📱"
                name="iPhone 16 Pro"
                price="₹1,34,900"
                badge="New"
                delay={0.65}
                style={{}}
              />
            </div>

            <div className="float-3" style={{ position: "absolute", bottom: "80px", left: "20px" }}>
              <ProductCard
                image="🎧"
                name="Sony WH-1000XM5"
                price="₹29,990"
                delay={0.8}
                style={{}}
              />
            </div>

            <div className="float-1" style={{ position: "absolute", bottom: "40px", right: "60px", animationDelay: "2s" }}>
              <ProductCard
                image="⌚"
                name="Apple Watch Ultra 2"
                price="₹89,900"
                badge="Sale"
                delay={0.95}
                style={{}}
              />
            </div>

            {/* Center glow pulse */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: "200px", height: "200px",
                background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Marquee strip */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[
              "Apple", "Samsung", "Sony", "OnePlus", "Dell", "HP", "Lenovo",
              "Bose", "JBL", "Logitech", "Asus", "Razer", "Nothing", "boAt",
              "Apple", "Samsung", "Sony", "OnePlus", "Dell", "HP", "Lenovo",
              "Bose", "JBL", "Logitech", "Asus", "Razer", "Nothing", "boAt",
            ].map((brand, i) => (
              <span key={i} className="marquee-item">
                <span className="marquee-dot" />
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;