import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const products = [
    {
      id: 1,
      name: "iPhone 17 Pro",
      price: "$1,199",
      image: "https://i.pinimg.com/736x/e9/a9/b7/e9a9b72ec8478f1023f0e7bfcfdf6d4d.jpg", 
      tag: "Titanium Edition",
      desc: "Forged in aerospace-grade titanium. Featuring the all-new A18 Pro chip for unparalleled gaming and computational photography.",
      textGradient: "from-slate-700 to-slate-400",
      glowColor: "rgba(100,116,139,0.15)", 
      themeColor: "bg-slate-800",
      filter: "brightness(1.05) contrast(1.05) drop-shadow(0 20px 30px rgba(0,0,0,0.12))"
    },
    {
      id: 2,
      name: "Sony Alpha 7R V",
      price: "$3,899",
      image: "https://freepngimg.com/thumb/camera/74421-mirrorless-lens-camera-sony-interchangeable-alpha-free-download-png-hq.png", 
      tag: "Pro Creator",
      desc: "Next-generation AI processing meets 61.0 MP resolution. Uncover invisible details with the ultimate mirrorless hybrid.",
      textGradient: "from-orange-500 to-red-500",
      glowColor: "rgba(249,115,22,0.1)", 
      themeColor: "bg-orange-600",
      filter: "brightness(1.02) contrast(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.15))"
    },
    {
      id: 3,
      name: "Zenith Ultra Drone",
      price: "$899",
      image: "https://freepngimg.com/thumb/drone/136437-drone-dji-png-free-photo.png",
      tag: "Cinematic Mode",
      desc: "Defy gravity. Capture breathtaking 8K HDR footage with omnidirectional obstacle sensing and 45-minute flight time.",
      textGradient: "from-blue-500 to-indigo-500",
      glowColor: "rgba(59,130,246,0.12)", 
      themeColor: "bg-blue-600",
      filter: "brightness(0.96) contrast(1.08) drop-shadow(0 20px 30px rgba(0,0,0,0.12))"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  return (
    <>
      <style>
        {`
          /* Extremely subtle floating, almost like breathing */
          @keyframes breathe {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .animate-breathe {
            animation: breathe 6s ease-in-out infinite;
          }
        `}
      </style>

      <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#fafafa] font-sans flex items-center">
        
        {/* === GENTLE ENVIRONMENTAL GLOW === */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full blur-[150px] mix-blend-multiply pointer-events-none transition-colors duration-[2500ms] ease-in-out"
          style={{ backgroundColor: products[currentIndex].glowColor }}
        />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>

        {/* === MAIN CONTENT LAYOUT === */}
        <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 relative z-20 flex flex-col md:flex-row items-center h-full">
          
          {/* LEFT SIDE: Smaller, Elegant Text */}
          <div className="w-full md:w-[45%] h-[350px] flex flex-col justify-center relative pt-10 md:pt-0">
            {products.map((product, index) => (
              <div 
                key={`text-${product.id}`}
                // PURE FADE: Sirf halka sa upar uthega (translate-y-2) bahut aaram se.
                className={`absolute inset-0 flex flex-col justify-center space-y-5 transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  currentIndex === index ? 'opacity-100 translate-y-0 z-20 pointer-events-auto' : 'opacity-0 translate-y-2 z-0 pointer-events-none'
                }`}
              >
                {/* Minimalist Tag */}
                <div className="flex justify-center md:justify-start">
                  <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-slate-400 flex items-center gap-3">
                    <span className={`w-4 h-[2px] rounded-full ${product.themeColor}`}></span>
                    {product.tag}
                  </span>
                </div>

                {/* Scaled Down Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
                  {product.name.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${product.textGradient}`}>
                          {word}
                        </span>
                      ) : (
                        word + ' '
                      )}
                    </span>
                  ))}
                </h1>

                {/* Scaled Down Description */}
                <p className="text-base md:text-lg text-slate-500 max-w-sm font-normal leading-relaxed">
                  {product.desc}
                </p>

                {/* Elegant Minimal Button */}
                <div className="flex justify-center md:justify-start pt-2">
                  <button className={`px-8 py-3.5 text-white rounded-full font-semibold text-sm transition-all duration-500 shadow-md hover:-translate-y-0.5 ${product.themeColor} hover:shadow-black/10 flex items-center gap-2 group`}>
                    Buy Now
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: Pure Product Focus (No Extra Cards) */}
          <div className="w-full md:w-[55%] h-[50vh] md:h-full relative flex items-center justify-center mt-12 md:mt-0">
            {products.map((product, index) => (
              <div 
                key={`img-${product.id}`}
                // PURE FADE + MICRO-SCALE: Ab ye screen par chal ke nahi aayega, bas wahi gently appear hoga.
                className={`absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  currentIndex === index ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-[0.98] z-0'
                }`}
              >
                <div className="relative w-full max-w-[600px] flex justify-center items-center">
                  
                  {/* Clean Image with Breathing Animation */}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`relative z-10 w-[80%] object-contain drop-shadow-2xl ${currentIndex === index ? 'animate-breathe' : ''}`}
                    style={{ 
                      filter: product.filter,
                      WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    }}
                  />

                  {/* Minimal Price Tag - Simplified without heavy background */}
                  <div className={`absolute bottom-[10%] right-[15%] z-30 transition-all duration-[1500ms] delay-[500ms] ${
                    currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    <span className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-md">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Quiet, Minimalist Progress Line */}
            <div className="absolute bottom-10 right-0 left-0 flex justify-center md:justify-end gap-2 z-30 md:pr-16">
              {products.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="relative h-[2px] w-12 bg-slate-200 overflow-hidden cursor-pointer rounded-full"
                >
                  <div 
                    className={`absolute top-0 left-0 h-full bg-slate-400 transition-all ease-linear ${
                      currentIndex === index ? 'w-full duration-[5000ms]' : (index < currentIndex ? 'w-full duration-0' : 'w-0 duration-0')
                    }`}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;