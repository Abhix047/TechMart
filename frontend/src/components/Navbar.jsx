import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart, Search, Package, Send, User, Heart, ChevronDown, House } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import AuthModal from "../controller/AuthModal.jsx";
import API from "../services/api.js";
import { getImg } from "../config.js";

// Inject Google Fonts once
if (!document.getElementById("nb-fonts")) {
  const l = Object.assign(document.createElement("link"), {
    id: "nb-fonts", rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@300;400;500;600&display=swap",
  });
  document.head.appendChild(l);
}

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'Outfit', sans-serif" };
const GOLD = "#111010";

/* ── Badge ── */
const Badge = ({ count }) => count > 0 && (
  <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] rounded-full bg-[#111010] border-2 border-[#faf8f4] text-white flex items-center justify-center text-[8px] font-bold" style={sans}>
    {count}
  </span>
);

/* ── Icon button ── */
const IconBtn = ({ onClick, children, className = "" }) => (
  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={onClick}
    className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-none cursor-pointer text-[#111010]/70 hover:text-[#111010] transition-colors ${className}`}>
    {children}
  </motion.button>
);

/* ── Nav link with animated underline ── */
const NavItem = ({ to, children, onClick, isActive: forced }) => {
  const inner = (active) => (
    <span className="relative group flex flex-col items-start cursor-pointer">
      <span className={`text-[10.5px] tracking-[0.18em] uppercase transition-colors duration-300 ${(forced ?? active) ? "text-[#111010]" : "text-[#111010]/60"}`} style={sans}>
        {children}
      </span>
      <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[#111010] to-stone-800 transition-all duration-500 ${(forced ?? active) ? "w-full" : "w-0 group-hover:w-full"}`} />
    </span>
  );
  return onClick
    ? <button onClick={onClick} className="bg-transparent border-none p-0">{inner(false)}</button>
    : <NavLink to={to} className="no-underline">{({ isActive }) => inner(isActive)}</NavLink>;
};

/* ── Search dropdown ── */
const SearchDropdown = ({ results, searchTerm, onSelect, onViewAll, isMobile }) => (
  <AnimatePresence>
    {searchTerm.trim() && (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
        className={`absolute top-[calc(100%+10px)] ${isMobile ? "left-0 right-0" : "right-0 w-80"} bg-[#faf8f4] border border-[#111010]/20 rounded-2xl shadow-2xl overflow-hidden z-50`}>
        <div className="h-0.5 bg-gradient-to-r from-[#111010] to-transparent" />
        {results.length > 0 ? (
          <>
            <div className="max-h-72 overflow-y-auto">
              {results.map((p, i) => (
                <button key={p._id} onClick={() => onSelect(p._id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-100/70 border-none bg-transparent cursor-pointer text-left transition-colors"
                  style={{ borderBottom: i < results.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                  <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 p-1 shrink-0 overflow-hidden">
                    {p.images?.[0] && <img src={getImg(p.images[0].replace(/\\/g, "/"))} className="w-full h-full object-contain mix-blend-multiply" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold tracking-widest uppercase text-[#111010]/60 mb-0.5" style={sans}>{p.brand || p.category}</p>
                    <p className="text-[13px] text-[#111010]" style={sans}>{p.name}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-[#111010] shrink-0 italic" style={serif}>
                    ₹{(p.discountPrice || p.price || 0).toLocaleString("en-IN")}
                  </p>
                </button>
              ))}
            </div>
            <button onClick={onViewAll}
              className="w-full py-3 text-[10px] font-semibold tracking-widest uppercase text-[#111010] bg-stone-50 hover:bg-[#111010]/10 border-none border-t border-stone-100 cursor-pointer transition-colors"
              style={sans}>
              View all results →
            </button>
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="text-[15px] italic text-stone-700 mb-1" style={serif}>No results found</p>
            <p className="text-[11px] text-stone-400" style={sans}>Try different keywords</p>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ════════════════ MAIN NAVBAR ════════════════ */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 24);
    };
    fn(); window.addEventListener("scroll", fn, { passive: true });
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

  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; }, [mobileOpen]);

  useEffect(() => {
    if ((searchOpen || mobileSearch) && !products.length)
      API.get("/products").then(r => setProducts(r.data)).catch(console.error);
  }, [searchOpen, mobileSearch]);

  useEffect(() => {
    if (!searchTerm.trim()) { setResults([]); return; }
    const q = searchTerm.toLowerCase();
    setResults(products.filter(p => [p.name, p.brand, p.category].some(f => f?.toLowerCase().includes(q))).slice(0, 6));
  }, [searchTerm, products]);

  const doSearch = (e) => {
    e?.preventDefault?.();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${searchTerm}`);
    [setMobileOpen, setSearchOpen, setMobileSearch].forEach(s => s(false));
    setSearchTerm("");
  };
  const goProduct = (id) => { navigate(`/product/${id}`); setSearchOpen(false); setMobileSearch(false); setSearchTerm(""); };
  const doLogout = async () => { await logout(); setProfileOpen(false); setMobileOpen(false); navigate("/"); };
  const goFeatured = () => {
    [setMobileOpen, setSearchOpen].forEach(s => s(false));
    if (location.pathname === "/") { document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" }); return; }
    navigate("/#featured-products");
  };

  const isFeaturedActive = location.pathname === "/" && location.hash === "#featured-products";
  const leftLinks = [{ name: "Products", to: "/products" }, { name: "Featured", featured: true }];
  const rightLinks = [{ name: "About", to: "/about" }, { name: "Offers", to: "/offers" }];
  const allLinks = [...leftLinks, ...rightLinks];
  const dropLinks = [{ to: "/orders", Icon: Package, label: "My Orders" }, { to: "/connect-us", Icon: Send, label: "Connect Us" }];

  const Avatar = ({ size = 28 }) => (
    <div className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ ...sans, width: size, height: size, fontSize: size * 0.4, background: "linear-gradient(135deg,#111010,#0a0a0a)", boxShadow: "0 2px 8px rgba(17,16,16,.3)" }}>
      {user?.name?.slice(0, 1).toUpperCase()}
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[99] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] 
          ${scrolled
            ? "h-20 bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-black/[0.04]"
            : "h-24 bg-[#faf9f8] shadow-sm"
          }`}
      >
        {/* ─── DESKTOP ─── */}
        <motion.div
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 130, damping: 22 }}
          className="hidden lg:flex items-center relative px-[clamp(24px,5vw,80px)] transition-all duration-500 h-full">

          <NavLink to="/" className="no-underline pr-8 transition-all duration-500">
            <div className="flex flex-col items-start leading-none">
              <motion.span
                animate={{
                  fontSize: scrolled ? "clamp(22px, 2.5vw, 26px)" : "clamp(28px, 3.5vw, 34px)",
                  letterSpacing: "-0.02em"
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[#1a1a2e] italic leading-[1.05] "
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                TechMart
              </motion.span>
            </div>
          </NavLink>

          {/* --- Navigation + Icons Right --- */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <nav className="flex items-center gap-10 mr-8">
              {allLinks.map(l => l.featured
                ? <NavItem key="featured" onClick={goFeatured} isActive={isFeaturedActive}>Featured</NavItem>
                : <NavItem key={l.to} to={l.to}>{l.name}</NavItem>
              )}
            </nav>

            <div className="w-px h-4 bg-[#111010]/10 mx-2" />

            {/* search */}
            <div ref={searchRef} className="relative flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div key="open" initial={{ width: 36, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 36, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }} className="relative">
                    <form onSubmit={doSearch} className="flex items-center gap-2 h-9 px-3 bg-stone-100 border border-[#111010]/25 rounded-full">
                      <Search size={13} className="text-[#111010] shrink-0" />
                      <input autoFocus type="text" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-[12.5px] text-stone-800" style={sans} />
                      <button type="button" onClick={() => { setSearchOpen(false); setSearchTerm(""); }} className="bg-transparent border-none cursor-pointer text-stone-400">
                        <X size={11} />
                      </button>
                    </form>
                    <SearchDropdown results={results} searchTerm={searchTerm} onSelect={goProduct} onViewAll={doSearch} />
                  </motion.div>
                ) : (
                  <IconBtn key="closed" onClick={() => setSearchOpen(true)}><Search size={17} strokeWidth={1.6} /></IconBtn>
                )}
              </AnimatePresence>
            </div>

            {/* user */}
            {!user ? (
              <IconBtn onClick={() => setAuthOpen(true)}><User size={17} strokeWidth={1.6} /></IconBtn>
            ) : (
              <div ref={profileRef} className="relative">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-2xl border-none cursor-pointer bg-transparent hover:bg-stone-100 transition-colors">
                  <Avatar />
                  <ChevronDown size={11} strokeWidth={2} className={`text-stone-400 transition-transform duration-250 ${profileOpen ? "rotate-180" : ""}`} />
                </motion.button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute right-0 top-[calc(100%+14px)] w-52 bg-[#faf8f4] border border-[#111010]/20 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="h-0.5 bg-gradient-to-r from-[#111010] to-transparent" />
                      <div className="flex items-center gap-3 px-4 py-3.5 bg-stone-50 border-b border-stone-100">
                        <Avatar size={34} />
                        <div>
                          <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#111010]/60 mb-0.5" style={sans}>My Account</p>
                          <p className="text-[15px] text-[#111010]" style={serif}>{user.name}</p>
                        </div>
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        {dropLinks.map(({ to, Icon, label }) => (
                          <NavLink key={to} to={to} onClick={() => setProfileOpen(false)} className="no-underline">
                            {({ isActive }) => (
                              <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${isActive ? "bg-stone-100" : "hover:bg-stone-100/70"}`}>
                                <span className="w-6 h-6 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center">
                                  <Icon size={11} className="text-stone-700" />
                                </span>
                                <span className="text-[12.5px] text-stone-700" style={sans}>{label}</span>
                              </div>
                            )}
                          </NavLink>
                        ))}
                        <div className="h-px bg-stone-100 my-1" />
                        <button onClick={doLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer hover:bg-red-50 transition-colors">
                          <span className="w-6 h-6 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                            <LogOut size={11} className="text-red-500" />
                          </span>
                          <span className="text-[12.5px] text-red-500" style={sans}>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <NavLink to="/wishlist" className="no-underline"><IconBtn><Heart size={17} strokeWidth={1.6} /><Badge count={wishlistCount} /></IconBtn></NavLink>
            <NavLink to="/cart" className="no-underline"><IconBtn><ShoppingCart size={17} strokeWidth={1.6} /><Badge count={cartCount} /></IconBtn></NavLink>
          </div>
        </motion.div>

        {/* ─── MOBILE ─── */}
        <div className="flex lg:hidden flex-col">
          <div className={`flex items-center justify-between px-2 w-full transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
            <div className="flex items-center">
              <IconBtn onClick={() => setMobileOpen(true)}><Menu size={20} className="text-[#111010]" strokeWidth={1.6} /></IconBtn>
              <IconBtn onClick={() => setMobileSearch(!mobileSearch)}><Search size={18} className="text-[#111010]" strokeWidth={1.6} /></IconBtn>
            </div>
            <NavLink to="/" className="no-underline">
              <span className={`block tracking-[0.1em] text-[#111010] transition-all duration-300 ${scrolled ? "text-[20px]" : "text-[24px]"}`} style={serif}>TechMart</span>
            </NavLink>
            <div className="flex items-center">
              <NavLink to="/" className="no-underline"><IconBtn><House size={18} strokeWidth={1.6} /></IconBtn></NavLink>
              <NavLink to="/wishlist" className="no-underline"><IconBtn><Heart size={18} strokeWidth={1.6} /><Badge count={wishlistCount} /></IconBtn></NavLink>
              <NavLink to="/cart" className="no-underline"><IconBtn><ShoppingCart size={18} strokeWidth={1.6} /><Badge count={cartCount} /></IconBtn></NavLink>
            </div>
          </div>
          <AnimatePresence>
            {mobileSearch && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden px-4">
                <div className="pt-1 pb-3 relative">
                  <form onSubmit={doSearch} className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-100 border border-[#111010]/25 rounded-xl">
                    <Search size={14} className="text-[#111010] shrink-0" />
                    <input type="text" placeholder="Search products…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-[13.5px] text-stone-800" style={sans} />
                    {searchTerm && <X size={13} className="text-stone-400 cursor-pointer shrink-0" onClick={() => setSearchTerm("")} />}
                  </form>
                  <div className="relative"><SearchDropdown results={results} searchTerm={searchTerm} onSelect={goProduct} onViewAll={doSearch} isMobile /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </header>

      {/* ─── MOBILE DRAWER ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] lg:hidden bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}>
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 bg-[#faf8f4] flex flex-col shadow-2xl overflow-y-auto"
              style={{ width: "82%", maxWidth: 320 }}>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#111010] to-transparent" />

              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                <div>
                  <span className="text-[22px] tracking-[-0.015em] font-light text-[#0a0a0a] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <em className="italic font-normal">techmart</em>
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 border-none cursor-pointer">
                  <X size={15} className="text-[#0a0a0a]" />
                </button>
              </div>

              <div className="flex-1 px-5 py-5 flex flex-col">
                <p className="text-[8.5px] font-semibold tracking-[0.2em] uppercase text-[#111010] mb-3" style={sans}>Navigation</p>
                <div className="flex flex-col gap-1">
                  {allLinks.map(l => l.featured ? (
                    <button key="feat" onClick={goFeatured} className="w-full bg-transparent border-none p-0 text-left">
                      <div className={`px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${isFeaturedActive ? "bg-stone-100" : "hover:bg-stone-100/70"}`}>
                        <span className="text-[14.5px] text-[#111010]" style={sans}>Featured</span>
                        {isFeaturedActive && <span className="w-1.5 h-1.5 rounded-full bg-[#111010]" />}
                      </div>
                    </button>
                  ) : (
                    <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="no-underline">
                      {({ isActive }) => (
                        <div className={`px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${isActive ? "bg-stone-100" : "hover:bg-stone-100/70"}`}>
                          <span className={`text-[14.5px] text-[#111010] ${isActive ? "font-medium" : "font-normal"}`} style={sans}>{l.name}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#111010]" />}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>

                <div className="mt-7 pt-6 border-t border-stone-100">
                  <p className="text-[8.5px] font-semibold tracking-[0.2em] uppercase text-[#111010] mb-4" style={sans}>Account</p>
                  {!user ? (
                    <button onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-none cursor-pointer text-white text-[12px] tracking-[0.14em] uppercase font-medium"
                      style={{ ...sans, background: "#0f0d0a" }}>
                      <User size={15} /> Sign In
                    </button>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar size={40} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] tracking-widest uppercase text-[#111010]/60 mb-0.5" style={sans}>Signed In</p>
                          <p className="text-[16px] text-[#111010] truncate" style={serif}>{user.name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {dropLinks.map(({ to, Icon, label }) => (
                          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className="no-underline">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100/70 transition-colors cursor-pointer">
                              <Icon size={15} className="text-[#111010]/70 shrink-0" />
                              <span className="text-[13.5px] text-[#111010]" style={sans}>{label}</span>
                            </div>
                          </NavLink>
                        ))}
                        <button onClick={() => { doLogout(); setMobileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer hover:bg-red-50 transition-colors">
                          <LogOut size={15} className="text-red-500 shrink-0" />
                          <span className="text-[13.5px] text-red-500" style={sans}>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-stone-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-4 h-px bg-[#111010]/40" />
                  <p className="text-[8.5px] tracking-[0.3em] uppercase text-stone-400" style={sans}>TechMart Collection</p>
                  <span className="w-4 h-px bg-[#111010]/40" />
                </div>
                <p className="text-[10px] italic text-stone-300" style={serif}>Est. 2026</p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}