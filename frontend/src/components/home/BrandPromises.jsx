import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Zap, ArrowLeftRight, ShieldCheck, Headphones } from "lucide-react";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("bp-v3-fonts")) {
  const l = document.createElement("link");
  l.id = "bp-v3-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap";
  document.head.appendChild(l);
}

const AUTOPLAY = 3500;
const MOBILE_QUERY = "(max-width: 767px)";
// Ultra-smooth easing curve for luxury tech feel
const EASE_OUT = [0.19, 1, 0.22, 1];

const PROMISES = [
  {
    Icon: Zap,
    roman: "I",
    title: "Express Dispatch",
    tagline: "Unmatched Speed",
    desc: "Orders confirmed before 2 PM are fulfilled and shipped the very same day without exception.",
    stat: "02",
    statSuffix: " PM",
    statLbl: "Daily Cutoff",
  },
  {
    Icon: ArrowLeftRight,
    roman: "II",
    title: "Seamless Returns",
    tagline: "Zero Friction",
    desc: "Experience a completely hassle-free 7-day return window. No complicated questions asked.",
    stat: "07",
    statSuffix: " Days",
    statLbl: "Return Window",
  },
  {
    Icon: ShieldCheck,
    roman: "III",
    title: "Premium Warranty",
    tagline: "Absolute Trust",
    desc: "Every product includes a comprehensive 12-month manufacturer guarantee for complete peace of mind.",
    stat: "12",
    statSuffix: " Mos",
    statLbl: "Full Coverage",
  },
  {
    Icon: Headphones,
    roman: "IV",
    title: "Dedicated Support",
    tagline: "Always Online",
    desc: "Our concierge support team is available 24/7 to provide premium assistance at your fingertips.",
    stat: "24",
    statSuffix: "/7",
    statLbl: "Concierge",
  },
];

const ProgressBar = memo(function ProgressBar({ active }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5">
      {active && (
        <motion.div
          key="progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTOPLAY / 1000, ease: "linear" }}
          className="h-full origin-left bg-[#0a0a0a]"
        />
      )}
    </div>
  );
});

const Card = memo(function Card({ item, index, inView, isActive, isMobile, hoveredIndex, setHoveredIndex }) {
  const { Icon, roman, title, tagline, desc, stat, statSuffix, statLbl } = item;
  
  const isHovered = hoveredIndex === index;
  const isFaded = hoveredIndex !== null && hoveredIndex !== index;
  // On mobile, focus is based on auto-scroll active state. On desktop, hover.
  const isFocused = isMobile ? isActive : isHovered;

  return (
    <motion.article
      initial="hidden"
      animate={inView ? (isFocused ? "hovered" : isFaded ? "faded" : "visible") : "hidden"}
      variants={{
         hidden: { opacity: 0, y: 40, boxShadow: "0 12px 35px -10px rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0.04)" },
         visible: { opacity: 1, y: 0, scale: 1, boxShadow: "0 12px 35px -10px rgba(0,0,0,0.06)", borderColor: "rgba(0,0,0,0.04)", transition: { delay: index * 0.1, duration: 1, ease: EASE_OUT } },
         hovered: { opacity: 1, y: isMobile ? 0 : -8, scale: isMobile ? 1 : 1.02, boxShadow: "0 40px 100px -20px rgba(0,0,0,0.12), 0 20px 40px -20px rgba(0,0,0,0.06)", borderColor: "rgba(0,0,0,0.15)", transition: { duration: 0.75, ease: EASE_OUT } },
         faded: { opacity: 0.35, y: 0, scale: 1, boxShadow: "0 4px 20px -10px rgba(0,0,0,0.02)", borderColor: "rgba(0,0,0,0.04)", transition: { duration: 0.75, ease: EASE_OUT } }
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative flex flex-col overflow-hidden rounded-[8px] bg-white min-h-[340px]"
      style={{
        padding: "clamp(32px, 3vw, 44px)",
        borderStyle: "solid",
        borderWidth: 1,
        zIndex: isFocused ? 20 : 10,
      }}
    >
      {/* Huge background Roman numeral */}
      <motion.span
        animate={{
          opacity: isFocused ? 0.04 : 0.015,
          x: isFocused ? -8 : 0,
          scale: isFocused ? 1.05 : 1
        }}
        transition={{ duration: 0.85, ease: EASE_OUT }}
        className="pointer-events-none absolute -bottom-4 right-2 z-0 select-none font-['Playfair_Display',serif] font-bold italic leading-none text-black"
        style={{ fontSize: "140px", letterSpacing: "-0.06em" }}
      >
        {roman}
      </motion.span>

      {/* Top Header line */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? {
            opacity: 1,
            backgroundColor: isFocused ? "#0a0a0a" : "#f4f3f1",
            color: isFocused ? "#ffffff" : "#0a0a0a",
            scale: isFocused ? 1.05 : 1,
            rotate: isFocused ? 10 : 0,
          } : undefined}
          transition={{ duration: 0.75, delay: index * 0.1, ease: EASE_OUT }}
          className="flex h-12 w-12 items-center justify-center rounded-full"
        >
          <Icon size={20} strokeWidth={1.5} />
        </motion.div>
        
        <motion.span 
          initial={{ opacity: 0, x: 10 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.75, delay: index * 0.1 + 0.1, ease: EASE_OUT }}
          className="font-['Outfit',sans-serif] text-[10px] font-medium tracking-[0.2em] text-black/30"
        >
          0{index + 1}
        </motion.span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0, color: isFocused ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)" } : undefined}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.15, ease: EASE_OUT }}
          className="font-['Outfit',sans-serif] text-[9px] uppercase tracking-[0.3em] mb-3 whitespace-nowrap"
        >
          {tagline}
        </motion.p>

        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0, x: isFocused ? 4 : 0 } : undefined}
          transition={{ duration: 0.85, delay: index * 0.1 + 0.25, ease: EASE_OUT }}
          className="font-['Playfair_Display',serif] text-[24px] font-medium leading-[1.1] text-[#0a0a0a] m-0 mb-2 tracking-[-0.01em]"
        >
          {title}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, height: 0, y: 15 }}
          animate={{ 
            opacity: isFocused ? 1 : 0, 
            height: isFocused ? "auto" : 0,
            y: isFocused ? 0 : 15 
          }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          <p className="font-['Outfit',sans-serif] text-[13px] font-light leading-[1.7] color-black/60 m-0 pt-2 pb-6 max-w-[95%] text-black/60">
            {desc}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: isFocused ? -4 : 0 } : undefined}
          transition={{ duration: 0.85, delay: index * 0.1 + 0.45, ease: EASE_OUT }}
          className="mt-auto pt-4 flex items-baseline gap-1.5"
        >
          <span className="font-['Playfair_Display',serif] text-[42px] font-light italic leading-none text-[#0a0a0a] tracking-[-0.02em]">
            {stat}
          </span>
          <span className="font-['Outfit',sans-serif] text-[14px] font-light tracking-[0.05em] text-black/40">
            {statSuffix}
          </span>
        </motion.div>
        
        <motion.span 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1, y: isFocused ? -4 : 0 } : undefined}
          transition={{ duration: 0.85, delay: index * 0.1 + 0.5, ease: EASE_OUT }}
          className="font-['Outfit',sans-serif] text-[9px] uppercase tracking-[0.24em] text-black/30 mt-2 block font-medium whitespace-nowrap"
        >
          {statLbl}
        </motion.span>
      </div>

      {isMobile ? <ProgressBar active={isActive} /> : null}
    </motion.article>
  );
});

export default function BrandPromises() {
  const secRef = useRef(null);
  const sliderRef = useRef(null);
  const inView = useInView(secRef, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobile, setMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  const showContent = inView || mobile;

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const updateMobile = (e) => setMobile(e.matches);
    setMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    if (!inView || reduceMotion || mobile) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % PROMISES.length);
    }, AUTOPLAY);
    return () => window.clearInterval(timer);
  }, [inView, reduceMotion, mobile]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !mobile) return;

    const syncActiveCard = () => {
      const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      Array.from(slider.children).forEach((child, index) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const distance = Math.abs(childCenter - sliderCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      setActive((prev) => (prev === nearestIndex ? prev : nearestIndex));
    };

    let frameId = 0;
    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => { frameId = 0; syncActiveCard(); });
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    syncActiveCard();
    return () => {
      slider.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [mobile]);

  const scrollToCard = (index) => {
    const slider = sliderRef.current;
    if (!slider || !mobile) { setActive(index); return; }
    const card = slider.children[index];
    if (!card) return;
    const targetLeft = Math.max(card.offsetLeft - (slider.clientWidth - card.clientWidth) / 2, 0);
    setActive(index);
    slider.scrollTo({ left: targetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section ref={secRef} className="bg-[#faf9f8] px-5 py-[clamp(80px,8vw,120px)] md:px-[clamp(20px,5vw,68px)]">
      
      {/* Sleek Animated Heading */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, filter: "blur(10px)", y: 20 }}
        animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
        transition={{ duration: 1.2, ease: EASE_OUT }}
        className="mb-14 text-center"
      >
        <p className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[0.4em] text-black/40 mb-4 font-medium">
          TechMart Standard
        </p>

        <h2 className="font-['Playfair_Display',serif] text-[clamp(42px,5vw,64px)] font-light leading-[1.05] tracking-[-0.01em] text-[#0a0a0a] m-0">
          Uncompromising <em className="italic font-normal text-black/40">Quality</em>
        </h2>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden items-start grid-cols-4 gap-6 md:grid max-w-[1400px] mx-auto relative z-10">
        {PROMISES.map((item, index) => (
          <Card
            key={item.title}
            item={item}
            index={index}
            inView={showContent}
            isActive={active === index}
            isMobile={false}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
      </div>

      {/* Mobile Scroll */}
      <div
        ref={sliderRef}
        className="no-sb items-start flex gap-4 overflow-x-auto px-[5vw] md:hidden pb-4 relative z-10"
        style={{ scrollSnapType: "x mandatory", scrollPaddingInline: "5vw" }}
      >
        {PROMISES.map((item, index) => (
          <div key={item.title} className="shrink-0" style={{ width: "85vw", scrollSnapAlign: "center" }}>
            <Card
              item={item}
              index={index}
              inView={showContent}
              isActive={active === index}
              isMobile
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          </div>
        ))}
      </div>
      
      {/* Mobile Indicators */}
      <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
        {PROMISES.map((item, index) => (
          <motion.button
            key={item.title}
            aria-label={`Show ${item.title}`}
            onClick={() => scrollToCard(index)}
            animate={{
              width: index === active ? 28 : 6,
              backgroundColor: index === active ? "#0a0a0a" : "rgba(10,10,10,0.15)",
            }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="h-1.5 cursor-pointer rounded-full border-none p-0 outline-none"
          />
        ))}
      </div>
    </section>
  );
}
