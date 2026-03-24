import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { RotateCcw, Shield, Truck, Zap } from "lucide-react";

const GOLD = "#c9a96e";
const GOLD_LT = "#edd9a3";
const GOLD_DIM = "rgba(201,169,110,0.18)";
const DARK = "#1c1710";
const MUTED_D = "rgba(28,23,16,0.42)";
const RULE_D = "rgba(28,23,16,0.09)";
const AUTOPLAY = 2000;
const MOBILE_QUERY = "(max-width: 767px)";
const EASE_OUT = [0.16, 1, 0.3, 1];

const PROMISES = [
  {
    Icon: Truck,
    roman: "I",
    title: "Complimentary Delivery",
    tagline: "White-glove service",
    desc: "Every order above Rs.999 arrives via premium tracked courier, handled with care.",
    stat: "999",
    statSuffix: "+",
    statLbl: "min. order",
    statPrefix: "Rs.",
  },
  {
    Icon: RotateCcw,
    roman: "II",
    title: "Effortless Returns",
    tagline: "No questions asked",
    desc: "A full seven days to reconsider. Our concierge return process is seamless.",
    stat: "07",
    statSuffix: " days",
    statLbl: "return window",
  },
  {
    Icon: Shield,
    roman: "III",
    title: "Complete Warranty",
    tagline: "Peace of mind",
    desc: "Every product ships with a comprehensive twelve-month manufacturer warranty.",
    stat: "12",
    statSuffix: " mo",
    statLbl: "coverage",
  },
  {
    Icon: Zap,
    roman: "IV",
    title: "Same-Day Dispatch",
    tagline: "Swift fulfilment",
    desc: "Orders confirmed before 2 PM are dispatched the same day, without exception.",
    stat: "02",
    statSuffix: " PM",
    statLbl: "cutoff",
  },
];

const CARD_TRANSITION = { duration: 0.85, ease: EASE_OUT };
const SHORT_TRANSITION = { duration: 0.45 };
const GLOW_TRANSITION = { duration: 0.6, ease: "easeInOut" };
const LINE_TRANSITION = { duration: 0.75, ease: EASE_OUT };

const ProgressBar = memo(function ProgressBar({ active, reduceMotion }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/5">
      {active && (
        <motion.div
          key="progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: AUTOPLAY / 1000, ease: "linear" }
          }
          className="h-full origin-left"
          style={{ background: `linear-gradient(to right, ${GOLD_DIM}, ${GOLD})` }}
        />
      )}
    </div>
  );
});

const Card = memo(function Card({
  item,
  index,
  inView,
  isActive,
  isMobile,
  reduceMotion,
}) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || isActive;
  const { Icon, roman, title, tagline, desc, stat, statSuffix, statLbl, statPrefix } = item;
  const entranceTransition = reduceMotion
    ? { duration: 0 }
    : { ...CARD_TRANSITION, delay: index * 0.1 };
  const lineTransition = reduceMotion
    ? { duration: 0 }
    : { ...LINE_TRANSITION, delay: index * 0.1 + 0.25 };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={entranceTransition}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex cursor-default flex-col overflow-hidden rounded-[3px]"
      style={{
        padding: isMobile ? "28px 24px 32px" : "clamp(24px,2.5vw,36px) clamp(20px,2vw,32px)",
        background: lit
          ? "linear-gradient(150deg, #1e1a13 0%, #0e0c09 100%)"
          : "#ffffff",
        transition: reduceMotion ? "none" : "background 0.55s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: lit
          ? "0 20px 48px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(201,169,110,0.22)"
          : "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(28,23,16,0.09)",
      }}
    >
      <motion.div
        animate={{ opacity: lit ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : GLOW_TRANSITION}
        className="pointer-events-none absolute right-0 top-0 z-[1]"
        style={{
          width: 140,
          height: 140,
          background:
            "radial-gradient(circle at top right, rgba(201,169,110,0.10) 0%, transparent 70%)",
        }}
      />

      <motion.span
        animate={{
          opacity: lit ? 0.055 : 0.035,
          y: lit ? 0 : 8,
          color: lit ? "#ffffff" : "#1c1710",
        }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.75, ease: EASE_OUT }}
        className="pointer-events-none absolute bottom-[-12px] right-[-2px] z-0 select-none font-bold italic leading-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(88px, 10vw, 120px)",
          letterSpacing: "-0.06em",
        }}
      >
        {roman}
      </motion.span>

      <div className="relative z-[2] mb-5 flex items-center justify-between">
        <motion.div
          animate={{
            borderColor: lit ? "rgba(201,169,110,0.30)" : RULE_D,
            background: lit ? "rgba(201,169,110,0.07)" : "rgba(28,23,16,0.03)",
          }}
          transition={reduceMotion ? { duration: 0 } : SHORT_TRANSITION}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ border: `1px solid ${RULE_D}` }}
        >
          <motion.div
            animate={{ rotate: lit ? 360 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.65, ease: EASE_OUT }}
          >
            <Icon
              size={15}
              strokeWidth={1.3}
              style={{ color: lit ? GOLD : MUTED_D, transition: reduceMotion ? "none" : "color 0.4s" }}
            />
          </motion.div>
        </motion.div>

        <motion.span
          animate={{ color: lit ? "rgba(201,169,110,0.55)" : "rgba(28,23,16,0.18)" }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
          className="text-[10px] font-light tracking-[0.28em]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </div>

      <div className="relative z-[2] mb-4 flex items-center gap-2">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={lineTransition}
          className="block h-px flex-1 origin-left"
          style={{
            background: lit
              ? "linear-gradient(to right, transparent, rgba(201,169,110,0.28))"
              : "linear-gradient(to right, transparent, rgba(28,23,16,0.10))",
            transition: reduceMotion ? "none" : "background 0.45s",
          }}
        />
        <motion.span
          animate={{ opacity: lit ? 0.75 : 0.22, color: lit ? GOLD : DARK }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
          style={{ fontSize: 7, lineHeight: 1, color: DARK }}
        >
          *
        </motion.span>
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={lineTransition}
          className="block h-px flex-1 origin-right"
          style={{
            background: lit
              ? "linear-gradient(to left, transparent, rgba(201,169,110,0.28))"
              : "linear-gradient(to left, transparent, rgba(28,23,16,0.10))",
            transition: reduceMotion ? "none" : "background 0.45s",
          }}
        />
      </div>

      <div className="relative z-[2] flex flex-1 flex-col">
        <motion.p
          animate={{ color: lit ? GOLD : MUTED_D }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
          className="m-0 mb-2 text-[9px] font-light uppercase tracking-[0.30em]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {tagline}
        </motion.p>

        <motion.h3
          animate={{ color: lit ? GOLD_LT : DARK }}
          transition={reduceMotion ? { duration: 0 } : SHORT_TRANSITION}
          className="m-0 font-medium leading-[1.15]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(19px, 1.9vw, 24px)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </motion.h3>

        <motion.p
          animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : 10 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.6, delay: lit ? 0.18 : 0, ease: EASE_OUT }
          }
          className="mt-3 max-w-[26ch] overflow-hidden font-light leading-[1.7]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13.5,
            color: "rgba(240,233,220,0.52)",
            margin: "10px 0 0",
          }}
        >
          {desc}
        </motion.p>

        <motion.div
          animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : 14 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.6, delay: lit ? 0.3 : 0, ease: EASE_OUT }
          }
          className="mt-auto flex items-end gap-2 pt-5"
        >
          <span
            className="font-semibold italic leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(30px, 3vw, 42px)",
              color: GOLD,
              letterSpacing: "-0.02em",
            }}
          >
            {statPrefix ? (
              <span className="mr-1 not-italic opacity-70" style={{ fontSize: "0.46em" }}>
                {statPrefix}
              </span>
            ) : null}
            {stat}
            <span className="ml-0.5 not-italic opacity-70" style={{ fontSize: "0.46em" }}>
              {statSuffix}
            </span>
          </span>
          <span
            className="pb-1 text-[9px] font-light uppercase tracking-[0.24em]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "rgba(201,169,110,0.40)",
            }}
          >
            {statLbl}
          </span>
        </motion.div>

        <motion.div
          animate={{ scaleX: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.5, delay: lit ? 0.1 : 0, ease: EASE_OUT }
          }
          className="mt-4 h-px origin-left"
          style={{ background: `linear-gradient(to right, ${GOLD}, transparent)` }}
        />
      </div>

      {isMobile ? <ProgressBar active={isActive} reduceMotion={reduceMotion} /> : null}
    </motion.article>
  );
});

export default function BrandPromises() {
  const secRef = useRef(null);
  const sliderRef = useRef(null);
  const inView = useInView(secRef, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const updateMobile = (event) => setMobile(event.matches);

    setMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateMobile);
      return () => mediaQuery.removeEventListener("change", updateMobile);
    }

    mediaQuery.addListener(updateMobile);
    return () => mediaQuery.removeListener(updateMobile);
  }, []);

  useEffect(() => {
    if (!inView || reduceMotion) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % PROMISES.length);
    }, AUTOPLAY);

    return () => window.clearInterval(timer);
  }, [inView, reduceMotion]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !mobile) {
      return undefined;
    }

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
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncActiveCard();
      });
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    syncActiveCard();

    return () => {
      slider.removeEventListener("scroll", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [mobile]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !mobile) {
      return undefined;
    }

    const card = slider.children[active];
    if (!card) {
      return undefined;
    }

    const targetLeft = Math.max(card.offsetLeft - (slider.clientWidth - card.clientWidth) / 2, 0);
    if (Math.abs(slider.scrollLeft - targetLeft) < 4) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      slider.scrollTo({
        left: targetLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [active, mobile, reduceMotion]);

  return (
    <section
      ref={secRef}
      className="bg-white px-5 pb-[clamp(36px,4vw,60px)] pt-0 md:px-[clamp(20px,5vw,68px)]"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.8 }}
        className="mb-8 text-center md:mb-12"
      >
        <div className="mb-3 flex items-center justify-center gap-3">
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.18 }}
            className="block h-px w-9 origin-right"
            style={{ background: GOLD, opacity: 0.45 }}
          />
          <span
            className="text-[9.5px] font-light uppercase tracking-[0.36em]"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
          >
            Our Commitment
          </span>
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.18 }}
            className="block h-px w-9 origin-left"
            style={{ background: GOLD, opacity: 0.45 }}
          />
        </div>

        <h2
          className="m-0 font-normal leading-[1.02] tracking-[-0.025em]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 4.5vw, 58px)",
            color: DARK,
          }}
        >
          Why Choose <em className="font-bold italic">TechMart</em>
        </h2>
      </motion.div>

      <div className="hidden grid-cols-4 gap-3 md:grid">
        {PROMISES.map((item, index) => (
          <Card
            key={item.title}
            item={item}
            index={index}
            inView={inView}
            isActive={active === index}
            isMobile={false}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      <div
        ref={sliderRef}
        className="no-sb flex gap-3 overflow-x-auto md:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {PROMISES.map((item, index) => (
          <div
            key={item.title}
            className="shrink-0"
            style={{ width: "82vw", scrollSnapAlign: "center" }}
          >
            <Card
              item={item}
              index={index}
              inView={inView}
              isActive={active === index}
              isMobile
              reduceMotion={reduceMotion}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {PROMISES.map((item, index) => (
          <motion.button
            key={item.title}
            type="button"
            aria-label={`Show ${item.title}`}
            onClick={() => setActive(index)}
            animate={{
              width: index === active ? 24 : 5,
              background: index === active ? GOLD : "rgba(28,23,16,0.14)",
              opacity: index === active ? 1 : 0.5,
            }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: EASE_OUT }}
            className="h-[4px] cursor-pointer rounded-full border-none p-0 outline-none"
          />
        ))}
      </div>
    </section>
  );
}
