import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, LogOut, ShoppingCart, Search,
  Package, Send, User, ArrowRight, Heart, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import AuthModal from "../controller/AuthModal.jsx";
import API from "../services/api.js";

/*
  index.css — add:
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=DM+Sans:wght@300;400;500&display=swap');
*/

const UserNavbar = () => {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchTerm, setSearchTerm]   = useState("");
  const [authOpen, setAuthOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [scrollY, setScrollY]         = useState(0);

  const [allProducts, setAllProducts]       = useState([]);
  const [searchResults, setSearchResults]   = useState([]);

  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const profileRef       = useRef(null);
  const searchRef        = useRef(null);
  const searchInputRef   = useRef(null);
  const { cartCount }    = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      API.get("/products").then(res => setAllProducts(res.data)).catch(console.error);
    }
  }, [searchOpen, allProducts.length]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    const matching = allProducts.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
    setSearchResults(matching.slice(0, 5));
  }, [searchTerm, allProducts]);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 10); setScrollY(window.scrollY); };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => { if (searchOpen) searchInputRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${searchTerm}`);
    setMobileOpen(false); setSearchOpen(false); setSearchTerm("");
  };

  const handleLogout = async () => {
    await logout(); setProfileOpen(false); setMobileOpen(false); navigate("/");
  };

  const leftLinks  = [{ name: "Products", path: "/products" }, { name: "Featured", path: "/featured" }];
  const rightLinks = [{ name: "About", path: "/about" }, { name: "Offers", path: "/offers" }];
  const dropdownLinks = [
    { to: "/orders",     Icon: Package, label: "My Orders",  delay: 0.04 },
    { to: "/connect-us", Icon: Send,    label: "Connect Us", delay: 0.09 },
  ];

  const navH     = scrolled ? 58 : 96;
  const taglineO = scrolled ? 0 : 1;
  const taglineH = scrolled ? 0 : 14;

  const NavItem = ({ path, name }) => (
    <NavLink to={path} className="no-underline">
      {({ isActive }) => (
        <div className="relative group py-1.5 cursor-pointer overflow-hidden">
          <span className="block transition-colors duration-300 whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: isActive ? "#1a1108" : "rgba(26,17,8,0.42)" }}
          >{name}</span>
          <motion.span className="absolute bottom-0 left-0 h-px bg-[#1a1108]"
            animate={{ width: isActive ? "100%" : "0%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          />
          {!isActive && <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[#1a1108]/15" />}
        </div>
      )}
    </NavLink>
  );

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-[99]"
        style={{
          background: scrolled ? "rgba(250,248,244,0.82)" : "rgba(250,248,244,1)",
          backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(26,17,8,0.09)" : "1px solid rgba(26,17,8,0.06)",
          boxShadow: scrolled ? "0 2px 32px rgba(26,17,8,0.07)" : "none",
          transition: "background 0.5s ease, backdrop-filter 0.5s ease, box-shadow 0.5s ease, border-color 0.4s ease",
        }}
      >
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.06 }}
          className="relative flex items-center"
          style={{
            height: navH,
            paddingLeft: "clamp(20px, 5vw, 72px)",
            paddingRight: "clamp(20px, 5vw, 72px)",
            transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* LEFT LINKS */}
          <nav className="hidden lg:flex items-center gap-12" style={{ flex: 1 }}>
            {leftLinks.map((l) => <NavItem key={l.path} {...l} />)}
          </nav>

          {/* ══════════════════════════════
              CENTER LOGO
              Bodoni Moda — same high-contrast
              thin/thick serif as MONARCA screenshot
              Single word, spaced caps
          ══════════════════════════════ */}
          <div className="absolute left-1/2 -translate-x-1/2 select-none">
            <NavLink to="/" className="no-underline block">
              <div className="flex flex-col items-center" style={{ gap: 0 }}>

                {/* Est. — fades on scroll */}
                <div style={{
                  opacity: taglineO, height: taglineH,
                  overflow: "hidden", marginBottom: scrolled ? 0 : 3,
                  transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 7, fontWeight: 400,
                    letterSpacing: "0.34em", textTransform: "uppercase",
                    color: "rgba(26,17,8,0.30)",
                    display: "block",
                  }}>Est. 2024</span>
                </div>

                {/* TECHMART — Bodoni Moda, same weight/style as MONARCA */}
                <motion.span
                  animate={{ fontSize: scrolled ? 25: 32 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    fontFamily: "'playfair display', sens-serif",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: "#1a1108",
                    lineHeight: 1,
                    display: "block",
                    fontOpticalSizing: "auto",
                  }}
                >
                  TechMart
                </motion.span>

                {/* COLLECTION — fades on scroll */}
                <div style={{
                  opacity: taglineO, height: taglineH,
                  overflow: "hidden", marginTop: scrolled ? 0 : 5,
                  transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <span style={{ display: "block", width: 14, height: "0.5px", background: "rgba(26,17,8,0.18)" }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 6.5, fontWeight: 400,
                    letterSpacing: "0.38em", textTransform: "uppercase",
                    color: "rgba(26,17,8,0.28)",
                  }}>Collection</span>
                  <span style={{ display: "block", width: 14, height: "0.5px", background: "rgba(26,17,8,0.18)" }} />
                </div>

              </div>
            </NavLink>
          </div>

          {/* RIGHT: links + icons */}
          <div className="flex items-center gap-0.5" style={{ flex: 1, justifyContent: "flex-end" }}>
            <nav className="hidden lg:flex items-center gap-10 mr-4">
              {rightLinks.map((l) => <NavItem key={l.path} {...l} />)}
            </nav>
            <div className="hidden lg:block w-px h-3.5 mr-2 bg-[#1a1108]/12" />

            {/* Search */}
            <div ref={searchRef} className="relative flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div key="sf"
                    initial={{ width: 36, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 36, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="relative flex flex-col items-end"
                  >
                    <form onSubmit={handleSearch}
                      className="flex items-center gap-2 overflow-hidden w-full"
                      style={{ height: 33, paddingLeft: 10, paddingRight: 8, background: "rgba(26,17,8,0.05)", border: "1px solid rgba(26,17,8,0.1)", borderRadius: 16 }}
                    >
                      <Search size={14} style={{ color: "rgba(26,17,8,0.38)", flexShrink: 0 }} />
                      <input ref={searchInputRef} type="text" placeholder="Search…" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full"
                        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#1a1108" }}
                      />
                      <button type="button" onClick={() => { setSearchOpen(false); setSearchTerm(""); }}
                        className="border-none bg-transparent cursor-pointer flex items-center shrink-0"
                        style={{ color: "rgba(26,17,8,0.35)" }}
                      ><X size={11} /></button>
                    </form>

                    {/* SEARCH RESULTS DROPDOWN */}
                    <AnimatePresence>
                      {searchTerm.trim() && searchOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: 10, height: 0 }}
                          className="absolute top-[calc(100%+8px)] right-0 w-[280px] bg-white border border-black/[0.08] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden z-[300]"
                        >
                          {searchResults.length > 0 ? (
                            <div className="flex flex-col max-h-[340px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                              {searchResults.map((p) => {
                                const imgURL = (!p.images?.[0]) ? "" : p.images[0].startsWith("http") ? p.images[0] : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${p.images[0].replace(/\\/g, '/')}`;
                                return (
                                  <button
                                    key={p._id}
                                    type="button"
                                    onClick={() => {
                                      navigate(`/product/${p._id}`);
                                      setSearchOpen(false);
                                      setSearchTerm("");
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-black/[0.04] transition-colors text-left border-b border-black/[0.04] last:border-none"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-[#f0ede8] overflow-hidden shrink-0 border border-black/5 p-1">
                                      {imgURL && <img src={imgURL} className="w-full h-full object-contain mix-blend-multiply" alt="" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.14em] text-black/35 mb-0.5 truncate">{p.brand || p.category}</p>
                                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#1a1108] truncate leading-tight">{p.name}</p>
                                      <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-[#1a1108] mt-0.5">₹{(p.discountPrice || p.price || 0).toLocaleString("en-IN")}</p>
                                    </div>
                                  </button>
                                );
                              })}
                              <button
                                type="button"
                                onClick={handleSearch}
                                className="w-full py-3 text-center font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-[#1a1108] bg-[#f8f7f5] hover:bg-[#f0ede8] transition-colors border-t border-black/[0.04]"
                              >
                                View all results →
                              </button>
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <Search size={20} className="mx-auto text-black/20 mb-3" />
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#1a1108] mb-1">No results found</p>
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[11.5px] text-black/40">Try different keywords</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.button key="si" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center justify-center border-none bg-transparent cursor-pointer w-10 h-10"
                  ><Search size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.5)" }} /></motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* User */}
            {!user ? (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex items-center justify-center border-none bg-transparent cursor-pointer w-10 h-10"
              ><User size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.5)" }} /></motion.button>
            ) : (
              <div ref={profileRef} className="relative hidden md:block">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer px-1 py-1"
                >
                  <div className="flex items-center justify-center rounded-full text-[10px] font-semibold shrink-0"
                    style={{ width: 27, height: 27, background: "#1a1108", color: "white", fontFamily: "'DM Sans',sans-serif" }}
                  >{user.name?.slice(0, 1).toUpperCase()}</div>
                  <ChevronDown size={11} strokeWidth={1.8}
                    style={{ color: "rgba(26,17,8,0.4)", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
                  />
                </motion.button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute right-0 overflow-hidden"
                      style={{ top: "calc(100% + 12px)", width: 212, background: "rgba(250,248,244,0.98)", backdropFilter: "blur(20px)", border: "1px solid rgba(26,17,8,0.08)", boxShadow: "0 20px 60px rgba(26,17,8,0.12), 0 4px 16px rgba(26,17,8,0.05)" }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(26,17,8,0.07)", background: "rgba(26,17,8,0.02)" }}>
                        <div className="flex items-center justify-center rounded-full font-semibold text-[12px] shrink-0"
                          style={{ width: 32, height: 32, background: "#1a1108", color: "white", fontFamily: "'DM Sans',sans-serif" }}
                        >{user.name?.slice(0, 1).toUpperCase()}</div>
                        <div className="overflow-hidden">
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,17,8,0.35)", marginBottom: 2 }}>My Account</p>
                          <p className="truncate" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: "#1a1108" }}>{user.name}</p>
                        </div>
                      </div>
                      <div className="p-1.5 flex flex-col gap-px">
                        {dropdownLinks.map(({ to, Icon, label, delay }) => (
                          <motion.div key={to} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
                            <NavLink to={to} onClick={() => setProfileOpen(false)}
                              className="no-underline flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-150"
                              style={{ color: "rgba(26,17,8,0.55)" }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(26,17,8,0.04)"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <span className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, background: "rgba(26,17,8,0.06)" }}>
                                <Icon size={11} style={{ color: "#1a1108" }} />
                              </span>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5 }}>{label}</span>
                            </NavLink>
                          </motion.div>
                        ))}
                        <div className="h-px my-1 mx-2" style={{ background: "rgba(26,17,8,0.06)" }} />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 border-none bg-transparent cursor-pointer"
                          style={{ color: "#b83232" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(184,50,50,0.05)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <span className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, background: "rgba(184,50,50,0.07)" }}>
                            <LogOut size={11} style={{ color: "#b83232" }} />
                          </span>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5 }}>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <NavLink to="/wishlist" className="no-underline">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                className="hidden md:flex relative items-center justify-center border-none bg-transparent cursor-pointer w-10 h-10"
              >
                <Heart size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.5)" }} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.5 }}
                    className="absolute top-1 right-0.5 flex items-center justify-center rounded-full text-[8.5px] font-bold"
                    style={{ width: 15, height: 15, background: "#1a1108", color: "white", fontFamily: "'DM Sans',sans-serif" }}
                  >{wishlistCount}</motion.span>
                )}
              </motion.button>
            </NavLink>

            <NavLink to="/cart" className="no-underline">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                className="relative flex items-center justify-center cursor-pointer w-10 h-10"
              >
                <ShoppingCart size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.5)" }} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.5 }}
                    className="absolute top-1.5 right-0.5 flex items-center justify-center rounded-full text-[8.5px] font-bold"
                    style={{ width: 15, height: 15, background: "#1a1108", color: "white", fontFamily: "'DM Sans',sans-serif" }}
                  >{cartCount}</motion.span>
                )}
              </motion.div>
            </NavLink>

            <motion.button whileTap={{ scale: 0.88 }}
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center border-none bg-transparent cursor-pointer w-10 h-10 ml-1"
            ><Menu size={19} strokeWidth={1.5} style={{ color: "rgba(26,17,8,0.55)" }} /></motion.button>
          </div>

        </motion.div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-[#1a1108]/12"
          style={{ width: `${Math.min((scrollY / 500) * 100, 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </header>

      {/* ══════════════════════════════
          MOBILE MENU
      ══════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[200] lg:hidden"
            style={{ background: "rgba(26,17,8,0.5)", backdropFilter: "blur(8px)" }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 flex flex-col"
              style={{ width: "80%", maxWidth: 310, background: "#faf8f4", borderLeft: "1px solid rgba(26,17,8,0.08)" }}
            >
              <div className="flex justify-between items-center px-6 py-5" style={{ borderBottom: "1px solid rgba(26,17,8,0.07)" }}>
                <span style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 400, fontSize: 24,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#1a1108", lineHeight: 1,
                }}>Techmart</span>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center border-none cursor-pointer w-8 h-8"
                  style={{ background: "rgba(26,17,8,0.06)", color: "rgba(26,17,8,0.5)" }}
                ><X size={15} strokeWidth={1.5} /></motion.button>
              </div>

              <div className="px-5 pt-5 pb-3">
                <form onSubmit={handleSearch}
                  className="flex items-center gap-2.5 px-3.5 py-3"
                  style={{ background: "rgba(26,17,8,0.04)", border: "1px solid rgba(26,17,8,0.08)" }}
                >
                  <Search size={12} style={{ color: "rgba(26,17,8,0.3)", flexShrink: 0 }} />
                  <input type="text" placeholder="Search products…" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none w-full"
                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#1a1108" }}
                  />
                </form>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pt-2">
                {[...leftLinks, ...rightLinks].map((link, i) => (
                  <motion.div key={link.path} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.055 + 0.06 }}>
                    <NavLink to={link.path} onClick={() => setMobileOpen(false)}
                      className="no-underline flex items-center justify-between py-4"
                      style={{ borderBottom: "1px solid rgba(26,17,8,0.07)" }}
                    >
                      {({ isActive }) => (
                        <>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: isActive ? "#1a1108" : "rgba(26,17,8,0.42)" }}>
                            {link.name}
                          </span>
                          {isActive && <span className="w-1 h-1 rounded-full bg-[#1a1108]" />}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="p-5" style={{ borderTop: "1px solid rgba(26,17,8,0.07)" }}>
                {!user ? (
                  <button onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 border-none cursor-pointer py-3.5"
                    style={{ background: "#1a1108", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}
                  >Sign In <ArrowRight size={12} /></button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 p-3.5 mb-1" style={{ background: "rgba(26,17,8,0.04)", border: "1px solid rgba(26,17,8,0.08)" }}>
                      <div className="flex items-center justify-center rounded-full font-semibold text-[13px] shrink-0" style={{ width: 36, height: 36, background: "#1a1108", color: "white", fontFamily: "'DM Sans',sans-serif" }}>
                        {user.name?.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,17,8,0.32)", marginBottom: 3 }}>Signed In</p>
                        <p className="truncate" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: "#1a1108" }}>{user.name}</p>
                      </div>
                    </div>
                    {dropdownLinks.map(({ to, Icon, label }) => (
                      <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                        className="no-underline flex items-center gap-2.5 px-4 py-3"
                        style={{ color: "rgba(26,17,8,0.55)", background: "rgba(26,17,8,0.04)", border: "1px solid rgba(26,17,8,0.07)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}
                      >
                        <span className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, background: "rgba(26,17,8,0.06)" }}>
                          <Icon size={11} style={{ color: "#1a1108" }} />
                        </span>
                        {label}
                      </NavLink>
                    ))}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-3 border-none cursor-pointer"
                      style={{ background: "rgba(184,50,50,0.06)", color: "#b83232", border: "1px solid rgba(184,50,50,0.1)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}
                    >
                      <span className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, background: "rgba(184,50,50,0.08)" }}>
                        <LogOut size={11} style={{ color: "#b83232" }} />
                      </span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default UserNavbar;