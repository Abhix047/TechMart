import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ArrowRight, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Solutions", path: "/solutions" },
    { name: "Pricing", path: "/pricing" },
    { name: "Docs", path: "/docs" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-6 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center justify-between
          transition-all duration-500 ease-in-out
          ${scrolled 
            ? "w-full max-w-[900px] bg-white/80 dark:bg-black/70 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] py-2.5 px-6 rounded-2xl" 
            : "w-full max-w-7xl bg-transparent py-4 px-4 rounded-none"
          }
        `}
      >
        {/* --- BRAND --- */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <div className="w-4 h-4 bg-white dark:bg-black rotate-45" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
            TechMart.io
          </span>
        </NavLink>

        {/* --- DESKTOP NAV (SaaS Center-aligned) --- */}
        <div className="hidden md:flex items-center bg-gray-100/40 dark:bg-white/5 rounded-full px-1.5 py-1 border border-gray-200/20">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                relative px-4 py-1.5 text-[13px] font-medium transition-all
                ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm border border-gray-200/50 dark:border-white/10 rounded-full"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* --- CTA SECTION --- */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/login"
            className="hidden sm:block text-[13px] font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="group flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[13px] font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-95"
          >
            Start Free
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </NavLink>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-500 dark:text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* --- MOBILE FULL-SCREEN MENU --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl md:hidden pointer-events-auto"
          >
            <div className="grid gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="text-lg font-medium px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-2" />
              <NavLink to="/login" className="px-4 py-2 font-medium">Log in</NavLink>
              <NavLink to="/signup" className="flex items-center justify-center gap-2 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl">
                Get Started
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;