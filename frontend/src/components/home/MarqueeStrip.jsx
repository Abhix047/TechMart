import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Sparkles, Users } from "lucide-react";

const ITEMS = [
    { icon: Truck, text: "Free Delivery on ₹999+" },
    { icon: ShieldCheck, text: "2 Year Warranty" },
    { icon: RotateCcw, text: "30-Day Returns" },
    { icon: Sparkles, text: "New Arrivals Weekly" },
    { icon: Users, text: "Trusted by 50,000+ Customers" },
];

/* Reverse for second strip */
const ITEMS_REV = [...ITEMS].reverse();

/* ── Single strip ── */
const Strip = ({ items, direction = 1, paused, speed = 28 }) => (
    <div className="overflow-hidden flex items-center">
        <motion.div
            animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{
                duration: speed,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
            }}
            style={{ animationPlayState: paused ? "paused" : "running" }}
            className="flex whitespace-nowrap"
        >
            {[0, 1].map((r) => (
                <div key={r} className="flex items-center">
                    {items.map(({ icon: Icon, text }, j) => (
                        <span key={j} className="flex items-center">
                            {/* Item */}
                            <span className="flex items-center gap-2.5 px-8 group">
                                <span
                                    className="flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    style={{ opacity: 0.35 }}
                                >
                                    <Icon
                                        size={11}
                                        strokeWidth={1.5}
                                        style={{ color: "white" }}
                                    />
                                </span>
                                <span
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 9.5,
                                        fontWeight: 300,
                                        letterSpacing: "0.28em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.38)",
                                    }}
                                >
                                    {text}
                                </span>
                            </span>

                            {/* Separator */}
                            <span
                                className="block w-px mx-1 shrink-0"
                                style={{ height: 10, background: "rgba(255,255,255,0.08)" }}
                            />
                        </span>
                    ))}
                </div>
            ))}
        </motion.div>
    </div>
);

/* ══════════════════════════════════════
   MARQUEE STRIP — luxury dual-row
══════════════════════════════════════ */
const MarqueeStrip = () => {
    const [paused, setPaused] = useState(false);

    return (
        <div
            className="relative overflow-hidden select-none"
            style={{ background: "#0e0c0a" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >

            {/* ── Top hairline ── */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent 100%)",
                }}
            />

            {/* ── Strip 1 — left ── */}
            <div
                className="py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
                <Strip items={ITEMS} direction={1} paused={paused} speed={30} />
            </div>

            {/* ── Strip 2 — right (reverse direction, slightly slower) ── */}
            <div className="py-3">
                <Strip items={ITEMS_REV} direction={-1} paused={paused} speed={36} />
            </div>

            {/* ── Bottom hairline ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
                }}
            />

            {/* ── Left + right edge fade masks ── */}
            <div
                className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
                style={{
                    background: "linear-gradient(to right, #0e0c0a 0%, transparent 100%)",
                }}
            />
            <div
                className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
                style={{
                    background: "linear-gradient(to left, #0e0c0a 0%, transparent 100%)",
                }}
            />

            {/* ── Center divider dot ── */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none z-10">
                <span
                    className="block"
                    style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}
                />
            </div>

        </div>
    );
};

export default MarqueeStrip;