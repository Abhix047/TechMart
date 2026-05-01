import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const NAV_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", path: "/products" },
      { label: "Best Sellers", path: "/products" },
      { label: "Special Editions", path: "/products" },
      { label: "Accessories", path: "/products" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Order Tracking", path: "/orders" },
      { label: "Warranty Policy", path: "/about" },
      { label: "Help Center", path: "/connect-us" },
      { label: "Shipping Info", path: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", path: "/about" },
      { label: "Careers", path: "/about" },
      { label: "Press Office", path: "/about" },
      { label: "Contact Us", path: "/connect-us" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", path: "#" },
      { label: "LinkedIn", path: "#" },
      { label: "Twitter / X", path: "#" },
      { label: "YouTube", path: "#" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Footer() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0.3, 1], [0.15, 1]);

  return (
    <footer
      ref={containerRef}
      className="relative bg-[#0a0a0a] pt-12 md:pt-20 pb-0 overflow-hidden font-sans text-white selection:bg-[#FF4D00] selection:text-white"
    >
      {/* ══ TRANSITION TOP DESIGN ══ */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] fill-white"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".05"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.94,9.41,102.17,19.61,39.28,12.83,78.56,19.61,116.48,21.06,37.64,1.44,71.21-8.46,105.3-20.15,24.68-8.47,48.48-18.39,72.33-26.22,28.53-9.39,57.11-13.69,86.23-11.67,70.71,4.91,135.25,47.24,192.41,75.09V0Z" opacity=".1"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10"
      >
        {/* ══ TOP LOGO ══ */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-12 flex items-center justify-between border-b border-white/[0.03] pb-8">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="w-16 h-16 bg-[#141414] rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:border-[#FF4D00]/30 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-8 h-8 flex items-center justify-center">
                 <div className="w-full h-full border-2 border-white/20 rounded-lg rotate-45 group-hover:rotate-90 group-hover:border-[#FF4D00]/50 transition-all duration-700" />
                 <div className="absolute w-2 h-2 bg-[#FF4D00] rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-tight text-white leading-tight">TechMart</span>
              <span className="text-[10px] text-[#FF4D00] uppercase tracking-[0.4em] font-bold">Evolution / 2026</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Base of Operations</span>
              <span className="text-[14px] text-white/80 font-medium">Mohali, Punjab, India</span>
            </div>
          </div>
        </motion.div>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-8 mb-8 md:mb-12">
          {NAV_GROUPS.map((group) => (
            <motion.div 
              key={group.title} 
              variants={itemVariants} 
              className={`flex flex-col gap-8 ${
                (group.title === "Shop" || group.title === "Company") ? "hidden md:flex" : "flex"
              }`}
            >
              <h4 className="text-[12px] font-bold text-white/20 uppercase tracking-[0.2em]">{group.title}</h4>
              <ul className="flex flex-col gap-5">
                {group.links.map((link, idx) => (
                  <motion.li key={link.label} variants={linkVariants} custom={idx}>
                    <Link to={link.path} className="group/link flex items-center gap-2 text-[15px] text-white/40 hover:text-white transition-all duration-300">
                      <span className="w-0 group-hover/link:w-3 h-[1px] bg-[#FF4D00] transition-all duration-500" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info Instead of redundant newsletter */}
          <motion.div variants={itemVariants} className="col-span-2 lg:col-span-1 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="text-[12px] font-bold text-white/20 uppercase tracking-[0.3em]">Support</h4>
              <p className="text-[14px] text-white/40 leading-relaxed font-medium">
                Our team is available 24/7 for premium assistance.
              </p>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-[12px] text-white/60">support@techmart.ltd</span>
               <span className="text-[12px] text-white/60">+91 98765 43210</span>
            </div>
          </motion.div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 md:pb-8 border-t border-white/[0.03] pt-6 md:pt-8">
          <div className="text-white/20 text-[12px] tracking-wide font-medium">
            &copy; 2026 TechMart Global. Developed by Techmart Ltd
          </div>
          <div className="flex gap-10">
            <Link to="#" className="text-white/30 hover:text-white text-[12px] transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-white/30 hover:text-white text-[12px] transition-colors">Terms of Service</Link>
            <Link to="#" className="text-white/30 hover:text-white text-[12px] transition-colors">Cookies</Link>
          </div>
        </motion.div>
      </motion.div>

      {/* ══ GIANT SUBMERGED TEXT SECTION ══ */}
      <div className="relative w-full h-[120px] md:h-[180px] overflow-hidden flex justify-end items-end pointer-events-none select-none">
        <motion.div style={{ y, opacity }} className="flex items-center gap-20 md:gap-40 mb-[-10px] pr-[2vw]">
          <div className="w-[15vw] h-[15vw] md:w-[12vw] md:h-[12vw] relative opacity-[0.12]">
            <div className="absolute inset-0 border-[2px] border-white/20 rounded-[20%] rotate-12" />
            <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-[#FF4D00] rounded-full blur-[2px]" />
          </div>
          <h2 className="text-[22vw] md:text-[18vw] font-bold tracking-tighter leading-none text-white/[0.15] drop-shadow-[0_0_40px_rgba(255,77,0,0.08)]">
            TechMart
          </h2>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10" />
      </div>

      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-[#FF4D00]/5 rounded-full blur-[150px] pointer-events-none" />
    </footer>
  );
}