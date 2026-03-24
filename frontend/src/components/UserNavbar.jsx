import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, LogOut, ShoppingCart, Search,
  Package, Send, User, ArrowRight, Heart, ChevronDown, House,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import AuthModal from "../controller/AuthModal.jsx";
import API from "../services/api.js";

/*
  index.css — add:
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*/

const BRAND = "#1a1108";
const CREAM = "rgba(250,248,244,1)";
const MUTED = "rgba(26,17,8,0.38)";
const BORDER = "rgba(26,17,8,0.07)";

const UserNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const progressRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const scrolledRef = useRef(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    if ((searchOpen || mobileSearchOpen) && allProducts.length === 0) {
      API.get("/products").then(r => setAllProducts(r.data)).catch(console.error);
    }
  }, [searchOpen, mobileSearchOpen, allProducts.length]);

  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResults([]); return; }
    const q = searchTerm.toLowerCase();
    setSearchResults(allProducts.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    ).slice(0, 6));
  }, [searchTerm, allProducts]);

  useEffect(() => {
    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 10;
      if (scrolledRef.current !== nextScrolled) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      if (progressRef.current) {
        const progress = Math.min(window.scrollY / 500, 1);
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      scrollFrameRef.current = null;
    };

    const onScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) setMobileSearchOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => { if (searchOpen) searchInputRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    if (mobileSearchOpen) mobileSearchRef.current?.querySelector("input")?.focus();
  }, [mobileSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${searchTerm}`);
    setMobileOpen(false); setSearchOpen(false); setMobileSearchOpen(false); setSearchTerm("");
  };

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    setSearchOpen(false); setMobileSearchOpen(false); setSearchTerm("");
  };

  const handleLogout = async () => {
    await logout(); setProfileOpen(false); setMobileOpen(false); navigate("/");
  };

  const leftLinks = [
    { name: "Products", path: "/products" },
    { name: "Featured", path: "/#featured-products", sectionId: "featured-products" },
  ];
  const rightLinks = [{ name: "About", path: "/about" }, { name: "Offers", path: "/offers" }];
  const allLinks = [...leftLinks, ...rightLinks];
  const dropdownLinks = [
    { to: "/orders", Icon: Package, label: "My Orders", delay: 0.04 },
    { to: "/connect-us", Icon: Send, label: "Connect Us", delay: 0.09 },
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    const offset = window.innerWidth < 1024 ? 84 : 112;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  const handleFeaturedNavigation = () => {
    setProfileOpen(false);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMobileOpen(false);

    if (location.pathname === "/" && location.hash === "#featured-products") {
      scrollToSection("featured-products");
      return;
    }

    navigate("/#featured-products");
  };

  const navH = scrolled ? 58 : 96;
  const taglineO = scrolled ? 0 : 1;
  const taglineH = scrolled ? 0 : 14;

  /* ── Desktop nav link ── */
  const NavItem = ({ path, name, sectionId }) => {
    if (sectionId === "featured-products") {
      const isActive = location.pathname === "/" && location.hash === "#featured-products";

      return (
        <button type="button" onClick={handleFeaturedNavigation} className="bg-transparent border-none p-0">
          <div className="relative group py-1.5 cursor-pointer overflow-hidden">
            <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: isActive ? BRAND : MUTED, transition: "color 0.3s" }}>{name}</span>
            <motion.span style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: BRAND }}
              animate={{ width: isActive ? "100%" : "0%" }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </button>
      );
    }

    return (
      <NavLink to={path} className="no-underline">
        {({ isActive }) => (
          <div className="relative group py-1.5 cursor-pointer overflow-hidden">
            <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: isActive ? BRAND : MUTED, transition: "color 0.3s" }}>{name}</span>
            <motion.span style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: BRAND }}
              animate={{ width: isActive ? "100%" : "0%" }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        )}
      </NavLink>
    );
  };

  /* ── Shared search results panel ── */
  const SearchResults = ({ isMobile = false }) => (
    <AnimatePresence>
      {searchTerm.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            left: isMobile ? 0 : "auto",
            width: isMobile ? "100%" : 308,
            background: CREAM,
            border: `1px solid rgba(26,17,8,0.09)`,
            borderRadius: 18,
            boxShadow: "0 16px 48px rgba(26,17,8,0.11), 0 4px 16px rgba(26,17,8,0.05)",
            zIndex: 400,
            overflow: "hidden",
          }}
        >
          {searchResults.length > 0 ? (
            <>
              <div style={{ maxHeight: 320, overflowY: "auto", scrollbarWidth: "none" }}>
                {searchResults.map((p, i) => {
                  const raw = p.images?.[0] ?? "";
                  const imgURL = raw ? (raw.startsWith("http") ? raw : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${raw.replace(/\\/g, "/")}`) : "";
                  return (
                    <button key={p._id} onClick={() => goToProduct(p._id)}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "transparent", border: "none", borderBottom: i < searchResults.length - 1 ? `1px solid ${BORDER}` : "none", cursor: "pointer", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(26,17,8,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(26,17,8,0.04)", border: `1px solid ${BORDER}`, padding: 5, flexShrink: 0, overflow: "hidden" }}>
                        {imgURL && <img src={imgURL} style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} alt="" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: MUTED, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.brand || p.category}</p>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: BRAND, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      </div>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: BRAND, flexShrink: 0 }}>₹{(p.discountPrice || p.price || 0).toLocaleString("en-IN")}</p>
                    </button>
                  );
                })}
              </div>
              <button onClick={handleSearch}
                style={{ width: "100%", padding: "11px", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: BRAND, background: "rgba(26,17,8,0.03)", borderTop: `1px solid ${BORDER}`, border: "none", cursor: "pointer" }}
              >View all results →</button>
            </>
          ) : (
            <div style={{ padding: "22px 16px", textAlign: "center" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: BRAND, marginBottom: 4 }}>No results</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: MUTED }}>Try different keywords</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ── Badge dot ── */
  const Badge = ({ count, top = 7, right = 4 }) => count > 0 ? (
    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}
      style={{ position: "absolute", top, right, width: 15, height: 15, borderRadius: "50%", background: BRAND, color: "white", fontSize: 8, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}
    >{count}</motion.span>
  ) : null;

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-[99]"
        style={{
          background: scrolled ? "rgba(250,248,244,0.88)" : CREAM,
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: `1px solid ${scrolled ? "rgba(26,17,8,0.10)" : BORDER}`,
          boxShadow: scrolled ? "0 2px 28px rgba(26,17,8,0.07)" : "none",
          transition: "background 0.5s, box-shadow 0.5s, border-color 0.4s",
        }}
      >

        {/* ══════════════════════════
            DESKTOP LAYOUT
        ══════════════════════════ */}
        <motion.div
          initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.06 }}
          className="relative hidden lg:flex items-center"
          style={{ height: navH, paddingLeft: "clamp(20px, 5vw, 72px)", paddingRight: "clamp(20px, 5vw, 72px)", transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)" }}
        >
          <nav style={{ flex: 1, display: "flex", alignItems: "center", gap: 48 }}>
            {leftLinks.map(l => <NavItem key={l.path} {...l} />)}
          </nav>

          {/* Center logo */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", userSelect: "none" }}>
            <NavLink to="/" className="no-underline block">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ opacity: taglineO, height: taglineH, overflow: "hidden", marginBottom: scrolled ? 0 : 3, transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 7, fontWeight: 400, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(26,17,8,0.28)", display: "block" }}>Est. 2026</span>
                </div>
                <motion.span animate={{ fontSize: scrolled ? 25 : 32 }} transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, letterSpacing: "0.08em", color: BRAND, lineHeight: 1, display: "block" }}
                >TechMart</motion.span>
                <div style={{ opacity: taglineO, height: taglineH, overflow: "hidden", marginTop: scrolled ? 0 : 5, transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 14, height: 0.5, background: "rgba(26,17,8,0.16)", display: "block" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6.5, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(26,17,8,0.26)" }}>Collection</span>
                  <span style={{ width: 14, height: 0.5, background: "rgba(26,17,8,0.16)", display: "block" }} />
                </div>
              </div>
            </NavLink>
          </div>

          {/* Right */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 40, marginRight: 16 }}>
              {rightLinks.map(l => <NavItem key={l.path} {...l} />)}
            </nav>
            <div style={{ width: 1, height: 14, background: "rgba(26,17,8,0.10)", margin: "0 8px" }} />

            {/* Desktop search */}
            <div ref={searchRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div key="sf" initial={{ width: 36, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 36, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-end" }}
                  >
                    <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 8, height: 34, paddingLeft: 12, paddingRight: 10, background: "rgba(26,17,8,0.05)", border: `1px solid rgba(26,17,8,0.10)`, borderRadius: 17, width: "100%", overflow: "hidden" }}>
                      <Search size={14} style={{ color: MUTED, flexShrink: 0 }} />
                      <input ref={searchInputRef} type="text" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{ background: "transparent", border: "none", outline: "none", width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: BRAND }}
                      />
                      <button type="button" onClick={() => { setSearchOpen(false); setSearchTerm(""); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex" }}
                      ><X size={11} /></button>
                    </form>
                    <SearchResults />
                  </motion.div>
                ) : (
                  <motion.button key="si" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }} onClick={() => setSearchOpen(true)}
                    style={{ background: "none", border: "none", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
                  ><Search size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.48)" }} /></motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop user */}
            {!user ? (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }} onClick={() => setAuthOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
              ><User size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.48)" }} /></motion.button>
            ) : (
              <div ref={profileRef} style={{ position: "relative" }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => setProfileOpen(!profileOpen)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "4px" }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: BRAND, color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{user.name?.slice(0, 1).toUpperCase()}</div>
                  <ChevronDown size={11} strokeWidth={1.8} style={{ color: MUTED, transform: profileOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }} />
                </motion.button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ position: "absolute", right: 0, top: "calc(100% + 12px)", width: 212, background: "rgba(250,248,244,0.98)", backdropFilter: "blur(20px)", border: `1px solid ${BORDER}`, boxShadow: "0 20px 60px rgba(26,17,8,0.12)", borderRadius: 16, overflow: "hidden" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${BORDER}`, background: "rgba(26,17,8,0.02)" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND, color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{user.name?.slice(0, 1).toUpperCase()}</div>
                        <div>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: 2 }}>My Account</p>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: BRAND }}>{user.name}</p>
                        </div>
                      </div>
                      <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                        {dropdownLinks.map(({ to, Icon, label, delay }) => (
                          <motion.div key={to} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
                            <NavLink to={to} onClick={() => setProfileOpen(false)} className="no-underline"
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "rgba(26,17,8,0.55)", borderRadius: 10 }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(26,17,8,0.04)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <span style={{ width: 24, height: 24, background: "rgba(26,17,8,0.05)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={11} style={{ color: BRAND }} /></span>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5 }}>{label}</span>
                            </NavLink>
                          </motion.div>
                        ))}
                        <div style={{ height: 1, background: BORDER, margin: "4px 8px" }} />
                        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "none", border: "none", cursor: "pointer", color: "#b83232", borderRadius: 10 }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(184,50,50,0.05)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span style={{ width: 24, height: 24, background: "rgba(184,50,50,0.07)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><LogOut size={11} style={{ color: "#b83232" }} /></span>
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
                style={{ background: "none", border: "none", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
              >
                <Heart size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.48)" }} />
                <Badge count={wishlistCount} />
              </motion.button>
            </NavLink>

            <NavLink to="/cart" className="no-underline">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                style={{ cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
              >
                <ShoppingCart size={19} strokeWidth={1.4} style={{ color: "rgba(26,17,8,0.48)" }} />
                <Badge count={cartCount} />
              </motion.div>
            </NavLink>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            MOBILE TOP BAR — Clean & Simple
        ══════════════════════════════════════════════ */}
        <div
          className="flex lg:hidden flex-col"
          style={{ transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)", background: scrolled ? "transparent" : CREAM }}
        >
          {/* Main Row */}
          <div className="flex items-center justify-between px-3 w-full" style={{ height: scrolled ? 54 : 66 }}>
            {/* Left: Hamburger + Search */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex items-center justify-center bg-transparent border-none cursor-pointer w-10 h-10"
              >
                <Menu size={22} strokeWidth={1.5} style={{ color: BRAND }} />
              </button>
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="flex items-center justify-center bg-transparent border-none cursor-pointer w-10 h-10"
              >
                <Search size={20} strokeWidth={1.5} style={{ color: BRAND }} />
              </button>
            </div>

            {/* Center: Logo */}
            <NavLink to="/" className="flex-1 text-center no-underline px-2" style={{ minWidth: 0 }}>
              <span className="truncate block" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: scrolled ? 21 : 25, letterSpacing: "0.04em", color: BRAND, transition: "font-size 0.3s" }}>
                TechMart
              </span>
            </NavLink>

            {/* Right: Home + Wishlist + Cart */}
            <div className="flex items-center gap-1">
              <NavLink to="/" className="flex items-center justify-center relative w-10 h-10 no-underline">
                <House size={20} strokeWidth={1.5} style={{ color: BRAND }} />
              </NavLink>
              <NavLink to="/wishlist" className="flex items-center justify-center relative w-10 h-10 no-underline">
                <Heart size={20} strokeWidth={1.5} style={{ color: BRAND }} />
                <Badge count={wishlistCount} top={6} right={4} />
              </NavLink>
              <NavLink to="/cart" className="flex items-center justify-center relative w-10 h-10 no-underline">
                <ShoppingCart size={20} strokeWidth={1.5} style={{ color: BRAND }} />
                <Badge count={cartCount} top={6} right={4} />
              </NavLink>
            </div>
          </div>

          {/* Search Bar Row (If Open) */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden px-4"
              >
                <div className="pb-3 pt-1">
                  <form onSubmit={handleSearch} className="flex items-center gap-2 bg-black/5 px-3 py-2.5 rounded-xl border border-black/10">
                    <Search size={16} className="text-black/40" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-[14px] font-[family-name:'DM_Sans'] text-black"
                    />
                    {searchTerm && (
                      <X
                        size={14}
                        className="text-black/50 cursor-pointer flex-shrink-0"
                        onClick={() => setSearchTerm("")}
                      />
                    )}
                  </form>

                  {/* Dropdown under search using identical results component */}
                  <div className="relative z-50">
                    <SearchResults isMobile />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll progress line */}
        <div
          ref={progressRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1.5,
            background: "rgba(26,17,8,0.09)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
            willChange: "transform",
          }}
        />
      </header>

      {/* ══════════════════════════════════════════════
          MOBILE DRAWER — Clean & Simple
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] lg:hidden bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 bg-[#faf8f4] flex flex-col shadow-2xl overflow-y-auto"
              style={{ width: "80%", maxWidth: 320 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-black/5">
                <span className="truncate" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 22, color: BRAND }}>TechMart</span>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full border-none cursor-pointer flex-shrink-0">
                  <X size={16} style={{ color: BRAND }} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 py-4 px-5 flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-widest text-black/40 uppercase mb-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>Menu</p>
                {allLinks.map((link) => (
                  link.sectionId === "featured-products" ? (
                    <button
                      key={link.name}
                      type="button"
                      onClick={handleFeaturedNavigation}
                      className="w-full bg-transparent border-none p-0 text-left"
                    >
                      <div className={`py-3 px-4 rounded-xl flex items-center justify-between transition-colors ${location.pathname === "/" && location.hash === "#featured-products" ? 'bg-black/5' : 'bg-transparent'}`}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: location.pathname === "/" && location.hash === "#featured-products" ? 600 : 400, color: BRAND }}>
                          {link.name}
                        </span>
                        {location.pathname === "/" && location.hash === "#featured-products" ? <div className="w-1.5 h-1.5 rounded-full bg-black/80 flex-shrink-0" /> : null}
                      </div>
                    </button>
                  ) : (
                    <NavLink key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="no-underline">
                      {({ isActive }) => (
                        <div className={`py-3 px-4 rounded-xl flex items-center justify-between transition-colors ${isActive ? 'bg-black/5' : 'bg-transparent'}`}>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: isActive ? 600 : 400, color: BRAND }}>
                            {link.name}
                          </span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black/80 flex-shrink-0" />}
                        </div>
                      )}
                    </NavLink>
                  )
                ))}

                {/* User Section inside Drawer */}
                <div className="mt-6 pt-6 border-t border-black/5">
                  {!user ? (
                    <button onClick={() => { setMobileOpen(false); setAuthOpen(true); }} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a1108] text-white rounded-xl border-none cursor-pointer text-[13px] font-semibold tracking-wide" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                      <User size={16} /> Sign In
                    </button>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold text-black border border-black/5 flex-shrink-0" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                          {user.name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-[10px] text-black/50 uppercase tracking-widest" style={{ fontFamily: "'DM Sans',sans-serif" }}>Signed In</p>
                          <p className="text-[14px] font-semibold text-black truncate" style={{ fontFamily: "'DM Sans',sans-serif" }}>{user.name}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                        {dropdownLinks.map(({ to, Icon, label }) => (
                          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className="no-underline">
                            <div className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-black/5 transition-colors">
                              <Icon size={16} className="text-black/60 flex-shrink-0" />
                              <span className="text-[13px] font-medium text-black/80" style={{ fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
                            </div>
                          </NavLink>
                        ))}
                        <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors bg-transparent border-none cursor-pointer mt-1">
                          <LogOut size={16} className="flex-shrink-0" />
                          <span className="text-[13px] font-medium text-left" style={{ fontFamily: "'DM Sans',sans-serif" }}>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-black/5 text-center mt-auto">
                <p className="text-[10px] tracking-widest uppercase text-black/30" style={{ fontFamily: "'DM Sans',sans-serif" }}>TechMart Collection</p>
                <p className="text-[9px] text-black/20 mt-1" style={{ fontFamily: "'DM Sans',sans-serif" }}>Est. 2026</p>
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
