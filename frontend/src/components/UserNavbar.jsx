import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart, Search, Package, UserCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "../controller/AuthModal.jsx" // <-- Modal Import kiya


const UserNavbar = () => {

  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal ko open/close karne ka state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = 3;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/products?search=${searchTerm}`);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Featured", path: "/featured" }, 
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-2 px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out
          ${scrolled
            ? "w-full max-w-[1050px] bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] py-1.5 px-6 rounded-full"
            : "w-full max-w-[1400px] bg-white/40 backdrop-blur-md border border-slate-200/40 py-3 px-8 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
          }`}
        >
          {/* LEFT: LOGO & SEARCH */}
          <div className="flex items-center gap-8 flex-1">
            <NavLink to="/" className="flex items-center gap-2 min-w-fit group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-sky-600 transition-colors duration-300">
                <div className="w-3 h-3 bg-white rotate-45 rounded-sm" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800 hidden md:block">TechMart</span>
            </NavLink>

            {/* DESCRIPTIVE SEARCH BAR */}
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-slate-100/60 border border-slate-200/60 rounded-xl px-4 py-1.5 w-full max-w-sm focus-within:border-sky-300 focus-within:bg-white focus-within:shadow-md transition-all"
            >
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search premium tech..."
                className="bg-transparent border-none outline-none text-[13px] px-3 w-full text-slate-600 placeholder:text-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* CENTER: NAV LINKS */}
          <div className="hidden lg:flex items-center gap-8 mx-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-1 text-[13px] font-bold transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1.5">
                      {link.name === "Featured" && <Star size={12} className={isActive ? "text-sky-500" : "text-slate-400"} />}
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-sky-400 to-green-400 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-4 min-w-fit justify-end">
            {/* CART */}
            <NavLink to="/cart" className="relative p-2 text-slate-600 hover:text-sky-500 transition-transform active:scale-90">
              <ShoppingCart size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white shadow-md">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* AUTH LOGIC */}
            {!user ? (
              <div className="flex items-center gap-2">
                {/* 🔴 YAHAN CHANGE KIYA HAI: NavLink ki jagah Button jo Modal kholega */}
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[13px] font-bold text-slate-700 px-4 py-2 hover:bg-slate-100 rounded-full transition"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-sky-300 transition-all shadow-sm"
                >
                  <UserCircle size={24} strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Premium Account</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      </div>
                      <div className="p-1">
                        <NavLink to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition">
                          <Package size={17} /> My Orders
                        </NavLink>
                        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition">
                          <LogOut size={17} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 active:scale-90 transition-transform">
              <Menu size={22} />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* 🔴 MODAL RENDER KIYA HAI YAHAN (Sabse upar aayega) */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default UserNavbar;