import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    tag: "PATENTED DESIGN",
    heading: "Form & Function",
    quote:
      "Our patented drinkware range, including infuser water bottles and travel water bottles, has been made to elevate your drinking experience. Enjoy the perfect balance of style and functionality with the best water bottles and tea flasks.",
    source: "TechRadar",
    category: "Technology",
    image: "https://i.pinimg.com/1200x/89/e5/23/89e523709c0f51c0028f388ac06b2f07.jpg",
    imageAlt: "Premium tech setup with laptop",
  },
  {
    tag: "PRESS REVIEW",
    heading: "Built to Last",
    quote:
      "Curated gear for people who take their setup seriously. No clutter, just quality. The attention to material and finish sets this apart from anything else on the market.",
    source: "Wired India",
    category: "Design",
    image: "https://i.pinimg.com/1200x/9e/8b/3f/9e8b3fbbbfb13bb27b8f69b1fd394d6c.jpg",
    imageAlt: "Modern tech accessories flat lay",
  },
  {
    tag: "EDITOR'S PICK",
    heading: "Beyond Specs",
    quote:
      "Finally, a store that understands the difference between specs and experience. Every product feels considered — from the packaging to the product itself. This is what premium truly means.",
    source: "Digit",
    category: "Reviews",
    image: "https://i.pinimg.com/1200x/d1/da/01/d1da0130295bacc4e171f51d5cc2a16b.jpg",
    imageAlt: "Tech workspace setup",
  },
];

const INTERVAL = 3000;

export default function PressQuoteSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1=forward, -1=back
  const fillRef = useRef(null);
  const remainingRef = useRef(INTERVAL);
  const startTimeRef = useRef(0);

  const goTo = (next, dir = 1) => {
    if (animating || next === current) return;
    setDirection(dir);
    setPrev(current);
    setAnimating(true);
    setCurrent(next);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 700);
  };

  const goNext = () => goTo((current + 1) % SLIDES.length, 1);
  const goPrev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);

  // Reset timer exactly when the slide changes
  useEffect(() => {
    remainingRef.current = INTERVAL;
    if (fillRef.current) fillRef.current.style.width = "0%";
  }, [current]);

  // Unified synced progress & auto-advance natively driving the DOM line
  useEffect(() => {
    if (animating) return;
    
    startTimeRef.current = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsedThisRun = now - startTimeRef.current;
      const totalElapsed = (INTERVAL - remainingRef.current) + elapsedThisRun;

      if (totalElapsed >= INTERVAL) {
        if (fillRef.current) fillRef.current.style.width = "100%";
        remainingRef.current = INTERVAL; // reset
        
        // Force advance slide
        setDirection(1);
        setPrev(current);
        setAnimating(true);
        setCurrent((current + 1) % SLIDES.length);
        setTimeout(() => { setPrev(null); setAnimating(false); }, 700);
      } else {
        if (fillRef.current) {
          fillRef.current.style.width = `${(totalElapsed / INTERVAL) * 100}%`;
        }
        frameId = requestAnimationFrame(tick);
      }
    };
    
    frameId = requestAnimationFrame(tick);
    
    return () => {
      cancelAnimationFrame(frameId);
      const elapsedThisRun = performance.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsedThisRun);
    };
  }, [current, animating]);

  const s = SLIDES[current];
  const p = prev !== null ? SLIDES[prev] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

        .pqs-wrap {
          font-family: 'Jost', sans-serif;
          background: #faf9f7;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        /* ── Slide container ── */
        .pqs-track {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 480px;
          position: relative;
        }

        /* ── Left text panel ── */
        .pqs-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(40px, 6vw, 80px) clamp(32px, 5vw, 72px);
          position: relative;
          z-index: 2;
          background: #faf9f7;
        }

        .pqs-tag {
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #8a7355;
          font-weight: 500;
          margin-bottom: 14px;
        }

        .pqs-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: clamp(28px, 3.5vw, 46px);
          line-height: 1.1;
          color: #1a1a2e;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }

        .pqs-divider {
          width: 40px;
          height: 1.5px;
          background: #8a7355;
          margin-bottom: 24px;
          transform-origin: left;
        }

        .pqs-body {
          font-size: clamp(14px, 1.4vw, 16px);
          line-height: 1.75;
          color: #4a4a5a;
          font-weight: 300;
          max-width: 440px;
          margin-bottom: 32px;
        }

        .pqs-source {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pqs-source-name {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #1a1a2e;
        }
        .pqs-source-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #ccc;
        }
        .pqs-source-cat {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #aaa;
          font-weight: 400;
        }

        /* ── Right photo panel ── */
        .pqs-right {
          position: relative;
          overflow: hidden;
          min-height: 420px;
        }

        .pqs-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* ── Slide-in/out animations ── */

        /* CURRENT slide enters */
        .slide-enter-left .pqs-left  { animation: slideTextIn  0.68s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-enter-left .pqs-right { animation: slideImgIn   0.72s cubic-bezier(0.16,1,0.3,1) 0.04s both; }
        .slide-enter-right .pqs-left  { animation: slideTextInR  0.68s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-enter-right .pqs-right { animation: slideImgInR   0.72s cubic-bezier(0.16,1,0.3,1) 0.04s both; }

        /* PREV slide exits */
        .slide-exit-left .pqs-left  { animation: slideTextOut  0.55s cubic-bezier(0.4,0,1,1) both; }
        .slide-exit-left .pqs-right { animation: slideImgOut   0.55s cubic-bezier(0.4,0,1,1) 0.02s both; }
        .slide-exit-right .pqs-left  { animation: slideTextOutR  0.55s cubic-bezier(0.4,0,1,1) both; }
        .slide-exit-right .pqs-right { animation: slideImgOutR   0.55s cubic-bezier(0.4,0,1,1) 0.02s both; }

        /* Forward direction */
        @keyframes slideTextIn  { from { opacity:0; transform: translateX(48px); filter:blur(6px); } to { opacity:1; transform: translateX(0); filter:blur(0); } }
        @keyframes slideImgIn   { from { opacity:0; transform: translateX(60px) scale(1.04); } to { opacity:1; transform: translateX(0) scale(1); } }
        @keyframes slideTextOut { from { opacity:1; transform: translateX(0); filter:blur(0); } to { opacity:0; transform: translateX(-48px); filter:blur(6px); } }
        @keyframes slideImgOut  { from { opacity:1; transform: translateX(0) scale(1); } to { opacity:0; transform: translateX(-60px) scale(0.97); } }

        /* Backward direction */
        @keyframes slideTextInR  { from { opacity:0; transform: translateX(-48px); filter:blur(6px); } to { opacity:1; transform: translateX(0); filter:blur(0); } }
        @keyframes slideImgInR   { from { opacity:0; transform: translateX(-60px) scale(1.04); } to { opacity:1; transform: translateX(0) scale(1); } }
        @keyframes slideTextOutR { from { opacity:1; transform: translateX(0); filter:blur(0); } to { opacity:0; transform: translateX(48px); filter:blur(6px); } }
        @keyframes slideImgOutR  { from { opacity:1; transform: translateX(0) scale(1); } to { opacity:0; transform: translateX(60px) scale(0.97); } }

        /* Stagger children inside left panel */
        .slide-enter-left .pqs-tag     { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
        .slide-enter-left .pqs-heading { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.14s both; }
        .slide-enter-left .pqs-divider { animation: growLine 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .slide-enter-left .pqs-body    { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .slide-enter-left .pqs-source  { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

        .slide-enter-right .pqs-tag     { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
        .slide-enter-right .pqs-heading { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.14s both; }
        .slide-enter-right .pqs-divider { animation: growLine 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .slide-enter-right .pqs-body    { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .slide-enter-right .pqs-source  { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); filter:blur(4px); } to { opacity:1; transform:translateY(0); filter:blur(0); } }
        @keyframes growLine { from { transform: scaleX(0); opacity:0; } to { transform: scaleX(1); opacity:1; } }

        /* ── Bottom controls ── */
        .pqs-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px clamp(32px, 5vw, 72px);
          border-top: 1px solid rgba(0,0,0,0.06);
          background: #faf9f7;
        }

        .pqs-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pqs-dot {
          cursor: pointer;
          border: none;
          background: none;
          padding: 6px;
          display: flex;
          align-items: center;
        }
        .pqs-dot-inner {
          height: 2px;
          border-radius: 2px;
          background: #ccc;
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.3s;
        }
        .pqs-dot.active .pqs-dot-inner {
          background: #1a1a2e;
        }

        /* Progress bar on active dot */
        .pqs-dot.active .pqs-dot-inner {
          position: relative;
          overflow: hidden;
          background: #ddd;
        }
        .pqs-dot.active .pqs-dot-fill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          background: #1a1a2e;
          border-radius: 2px;
        }

        .pqs-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(10px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1a2e;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 20;
        }
        .pqs-arrow:hover {
          background: #1a1a2e;
          border-color: #1a1a2e;
          color: #fff;
          transform: translateY(-50%) scale(1.1);
        }
        .pqs-arrow-prev {
          left: clamp(10px, 2vw, 30px);
        }
        .pqs-arrow-next {
          right: clamp(10px, 2vw, 30px);
        }

        .pqs-count {
          font-size: 12px;
          letter-spacing: 0.12em;
          color: #aaa;
          font-weight: 400;
          font-family: 'Jost', sans-serif;
        }

        /* Overlay shimmer on image transition */
        .pqs-img-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          pointer-events: none;
          z-index: 2;
          animation: imgShimmer 0.8s cubic-bezier(0.4,0,0.6,1) both;
        }
        @keyframes imgShimmer {
          from { transform: translateX(-100%); opacity: 1; }
          to   { transform: translateX(200%);  opacity: 0; }
        }

        /* Vertical separator */
        .pqs-sep {
          position: absolute;
          left: 50%;
          top: 10%;
          bottom: 10%;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.08) 70%, transparent);
          pointer-events: none;
          z-index: 3;
        }

        @media (max-width: 768px) {
          .pqs-track { grid-template-columns: 1fr; }
          .pqs-right { min-height: 260px; }
          .pqs-sep   { display: none; }
        }
      `}</style>

      <div
        className="pqs-wrap"
      >
        <div style={{ position: "relative" }}>
          {/* Vertical separator */}
          <div className="pqs-sep" />

          {/* Arrows */}
          <button className="pqs-arrow pqs-arrow-prev" onClick={goPrev} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M9 2L4 7l5 5" />
            </svg>
          </button>
          <button className="pqs-arrow pqs-arrow-next" onClick={goNext} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 2l5 5-5 5" />
            </svg>
          </button>

          {/* ── EXITING slide (prev) ── */}
          {p && (
            <div
              key={`prev-${prev}`}
              className={`pqs-track ${direction > 0 ? "slide-exit-left" : "slide-exit-right"}`}
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            >
              <div className="pqs-left">
                <div className="pqs-tag">{p.tag}</div>
                <div className="pqs-heading">{p.heading}</div>
                <div className="pqs-divider" />
                <div className="pqs-body">{p.quote}</div>
                <div className="pqs-source">
                  <span className="pqs-source-name">{p.source}</span>
                  <span className="pqs-source-dot" />
                  <span className="pqs-source-cat">{p.category}</span>
                </div>
              </div>
              <div className="pqs-right">
                <img className="pqs-img" src={p.image} alt={p.imageAlt} />
              </div>
            </div>
          )}

          {/* ── ENTERING slide (current) ── */}
          <div
            key={`curr-${current}`}
            className={`pqs-track ${animating ? (direction > 0 ? "slide-enter-left" : "slide-enter-right") : ""}`}
            style={{ position: "relative", zIndex: 2 }}
          >
            <div className="pqs-left">
              <div className="pqs-tag">{s.tag}</div>
              <div className="pqs-heading">{s.heading}</div>
              <div className="pqs-divider" />
              <div className="pqs-body">{s.quote}</div>
              <div className="pqs-source">
                <span className="pqs-source-name">{s.source}</span>
                <span className="pqs-source-dot" />
                <span className="pqs-source-cat">{s.category}</span>
              </div>
            </div>
            <div className="pqs-right">
              <img className="pqs-img" src={s.image} alt={s.imageAlt} />
              {animating && <div className="pqs-img-shimmer" />}
            </div>
          </div>
        </div>

        {/* ── Controls bar ── */}
        <div className="pqs-controls">
          {/* Dots with progress */}
          <div className="pqs-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`pqs-dot${i === current ? " active" : ""}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Slide ${i + 1}`}
              >
                <div
                  className="pqs-dot-inner"
                  style={{ width: i === current ? "44px" : "12px", position: "relative" }}
                >
                  {i === current && (
                    <div
                      ref={fillRef}
                      className="pqs-dot-fill"
                      style={{ width: "0%" }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Counter */}
          <span className="pqs-count">
            {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </>
  );
}