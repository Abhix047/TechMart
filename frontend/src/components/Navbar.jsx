import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "Collections", path: "/collections" },
    { name: "Support", path: "/support" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .navbar-root * { font-family: 'DM Sans', sans-serif; }
        .navbar-logo-text { font-family: 'Syne', sans-serif; }

        .nav-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        .nav-pill-item {
          position: relative;
          padding: 6px 16px;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          border-radius: 10px;
          transition: color 0.2s ease;
          color: rgba(255,255,255,0.5);
        }
        .nav-pill-item:hover { color: rgba(255,255,255,0.9); }
        .nav-pill-item.active { color: #fff; }

        .cart-badge {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          background: #6366f1;
          border-radius: 50%;
          border: 1.5px solid #0a0a0f;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }
        .icon-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        .icon-btn:active { transform: scale(0.93); }

        .cta-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          background: #fff;
          color: #0a0a0f;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: 'Syne', sans-serif;
        }
        .cta-btn:hover {
          background: #f0f0ff;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.25);
        }
        .cta-btn:active { transform: scale(0.96) translateY(0); }

        .search-bar {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-bar input {
          background: none;
          border: none;
          outline: none;
          color: #fff;
          font-size: 13px;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
        }
        .search-bar input::placeholder { color: rgba(255,255,255,0.3); }

        .mobile-overlay {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: rgba(10, 10, 18, 0.96);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }

        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          padding: 12px 8px;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.2s ease;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link:hover, .mobile-link.active { color: #fff; }


      `}</style>

      <header
        className="navbar-root"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          padding: scrolled ? "12px 20px" : "0",
          pointerEvents: "none",
          transition: "padding 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="nav-grain"
          style={{
            maxWidth: scrolled ? "1180px" : "100%",
            margin: "0 auto",
            pointerEvents: "auto",
            position: "relative",
            borderRadius: scrolled ? "16px" : "0px",
            padding: scrolled ? "10px 24px" : "16px 32px",
            background: scrolled
              ? "rgba(10, 10, 18, 0.88)"
              : "rgba(10, 10, 18, 0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
            borderBottom: scrolled ? undefined : "1px solid rgba(255,255,255,0.06)",
            boxShadow: scrolled
              ? "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "none",
            transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>

            {/* LOGO */}
            <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 8 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "34px",
                  height: "34px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.45)",
                  flexShrink: 0,
                }}
              >
                <Zap size={17} color="#fff" strokeWidth={2.5} />
              </motion.div>
              <span
                className="navbar-logo-text"
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Tech<span style={{ color: "#818cf8" }}>Mart</span>
              </span>
            </NavLink>

            {/* DESKTOP NAV */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: "center",
                gap: "2px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "4px",
              }}
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `nav-pill-item${isActive ? " active" : ""}`}
                  style={{ textDecoration: "none" }}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.12)",
                            zIndex: -1,
                          }}
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>

              {/* Search */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div
                    key="search-open"
                    initial={{ width: 38, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 38, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px",
                      padding: "0 12px",
                      height: "38px",
                      overflow: "hidden",
                    }}
                  >
                    <Search size={15} color="rgba(255,255,255,0.4)" />
                    <input
                      autoFocus
                      placeholder="Search products…"
                      onBlur={() => setSearchOpen(false)}
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        color: "#fff",
                        fontSize: "13px",
                        width: "100%",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    key="search-closed"
                    className="icon-btn hidden sm:flex"
                    onClick={() => setSearchOpen(true)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Search size={17} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Cart */}
              <motion.button className="icon-btn" whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={17} />
                <span className="cart-badge" />
              </motion.button>

              {/* Divider */}
              <div
                className="hidden md:block"
                style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }}
              />

              {/* Status + CTA */}
              <NavLink to="/login" style={{ textDecoration: "none" }} className="hidden md:block">
                <motion.button
                  className="cta-btn"
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={14} strokeWidth={2.5} />
                  Sign In
                </motion.button>
              </NavLink>
            </div>
          </div>
        </motion.nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: "1180px",
                margin: "0 auto",
                pointerEvents: "auto",
                position: "relative",
              }}
            >
              <div className="mobile-overlay">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => `mobile-link${isActive ? " active" : ""}`}
                    >
                      {link.name}
                      <ChevronRight size={18} style={{ opacity: 0.3 }} />
                    </NavLink>
                  </motion.div>
                ))}

                <div style={{ marginTop: "8px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <NavLink
                    to="/login"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "11px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                      fontSize: "13px",
                      textDecoration: "none",
                    }}
                  >
                    Sign In
                  </NavLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;