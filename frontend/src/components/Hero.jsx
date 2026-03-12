import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const products = [
    {
      id: 1,
      name: "iPhone 17 Pro Titanium",
      price: "$1,199",
      image: "https://m.media-amazon.com/images/I/616-Eh2FbPL.jpg",
      tag: "Next-Gen Performance",
      desc: "Experience the power of aerospace-grade titanium. The A18 Pro chip redefines what's possible in the palm of your hand.",
      gradient: "from-slate-900 to-slate-600",
      accent: "#38bdf8", 
    },
    {
      id: 2,
      name: "Sony Alpha 7R V",
      price: "$3,899",
      image: "https://m.media-amazon.com/images/I/71oP3T4IHvL.jpg",
      tag: "Visionary Detail",
      desc: "61.0 MP of pure clarity. Powered by an AI processing unit for next-generation autofocus and detail capture.",
      gradient: "from-orange-600 to-amber-400",
      accent: "#fbbf24", 
    },
    {
      id: 3,
      name: "Zenith Ultra Drone",
      price: "$899",
      image: "https://dronelife.com/wp-content/uploads/2022/08/quad8_on_white_br_3.jpg",
      tag: "Aerial Mastery",
      desc: "8K HDR cinematic footage with omnidirectional obstacle sensing. Defy gravity for 45 minutes straight.",
      gradient: "from-blue-700 to-indigo-400",
      accent: "#818cf8", 
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [products.length]);

  return (
    <section className="relative w-full h-[85vh] min-h-[650px] flex items-center overflow-hidden bg-[#F8FAFC]">
      
      {/* 1. DYNAMIC BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ backgroundColor: products[currentIndex].accent }}
          className="absolute -top-[10%] -right-[5%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-[0.18] transition-colors duration-1000"
        />
        <motion.div 
          animate={{ backgroundColor: products[currentIndex].accent }}
          className="absolute -bottom-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-[0.12] transition-colors duration-1000"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* LEFT CONTENT */}
        <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={products[currentIndex].id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <span className="h-[2px] w-8 rounded-full bg-sky-500"></span>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                  {products[currentIndex].tag}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter">
                {products[currentIndex].name.split(' ').slice(0, -1).join(' ')} <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${products[currentIndex].gradient}`}>
                  {products[currentIndex].name.split(' ').pop()}
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-500 max-w-lg mb-8 mx-auto lg:mx-0 leading-relaxed font-medium">
                {products[currentIndex].desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                <button className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all flex items-center gap-4 group active:scale-95">
                  Pre-order — {products[currentIndex].price}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT IMAGE: COMPACT, WIDE & SHADOWED CARD */}
        <div className="order-1 lg:order-2 relative flex justify-center items-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={products[currentIndex].id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full max-w-[520px] h-[380px] md:h-[420px] flex items-center justify-center p-10"
                >
                    {/* 2. THE CARD (Height reduced, Width wide, Shadow added) */}
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12),0_10px_20px_-5px_rgba(0,0,0,0.05)] rounded-[3.5rem]" />
                    
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-10 bg-gradient-to-br from-white/20 to-transparent blur-2xl pointer-events-none" />

                    {/* Product Image (Links preserved) */}
                    <motion.img
                        src={products[currentIndex].image}
                        alt={products[currentIndex].name}
                        className="relative z-10 w-full h-full object-contain rounded-2xl drop-shadow-[0_25px_45px_rgba(0,0,0,0.1)]"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    />

                    {/* Exclusive Status Badge */}
                    <div className="absolute top-8 right-10 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-100 shadow-sm z-20">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                            <span className="text-[9px] font-black text-slate-800 tracking-[0.15em] uppercase">Premium Series</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

      </div>

      {/* 3. MINIMAL PAGINATION */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
        <div className="flex gap-2.5">
            {products.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-[4px] rounded-full transition-all duration-500 ${
                        currentIndex === idx ? "w-10 bg-slate-900" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                />
            ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;