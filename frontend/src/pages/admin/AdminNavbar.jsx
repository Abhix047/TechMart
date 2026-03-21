import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Package, PlusCircle,
  ShoppingCart, Users, AppWindow, Tag,
  LogOut, ChevronRight, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Fonts ── */
if (typeof document !== "undefined" && !document.getElementById("an-fonts")) {
  const l = document.createElement("link");
  l.id = "an-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const ease = [0.22, 1, 0.36, 1];

const LINKS = [
  { name: "Dashboard",   path: "/admin/dashboard",   icon: LayoutDashboard },
  { name: "Products",    path: "/admin/products",    icon: Package         },
  { name: "Add Product", path: "/admin/add-product", icon: PlusCircle      },
  { name: "Orders",      path: "/admin/orders",      icon: ShoppingCart    },
  { name: "Users",       path: "/admin/users",       icon: Users           },
  { name: "Banner",      path: "/admin/banner",      icon: AppWindow       },
  { name: "Offers",      path: "/admin/offers",      icon: Tag             },
];

/* ── Sidebar content (shared between desktop + mobile) ── */
function SidebarContent({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "A")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Logo ── */}
      <div className="px-5 h-[62px] flex items-center justify-between border-b border-black/[0.06] shrink-0">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 group" onClick={onClose}>
          <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center group-hover:bg-black/75 transition-colors duration-200 shrink-0">
            <div className="w-2.5 h-2.5 bg-white rotate-45 rounded-[2px]" />
          </div>
          <div>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-semibold text-[#0f0f0f] leading-none">
              TechMart
            </p>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.18em] text-black/32 mt-0.5">
              Admin Panel
            </p>
          </div>
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-black/35 hover:text-black/65 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Nav section label ── */}
      <div className="px-5 pt-6 pb-2">
        <p className="font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.2em] text-black/25">
          Menu
        </p>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto pb-4">
        {LINKS.map(({ name, path, icon: Icon }, i) => (
          <motion.div
            key={path}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.04 + i * 0.05, ease }}
          >
            <NavLink
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-[#0f0f0f] text-white"
                    : "text-black/48 hover:text-[#0f0f0f] hover:bg-black/[0.045]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-black/30 group-hover:text-black/60"
                    }`}
                  />
                  <span className="flex-1">{name}</span>
                  {isActive && (
                    <ChevronRight size={12} className="text-white/45 shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* ── User + Logout ── */}
      <div className="px-3 pb-5 pt-3 border-t border-black/[0.06] shrink-0">
        {/* User row */}
        <div className="flex items-center gap-3 px-3.5 py-3 mb-2 bg-[#f7f5f2] border border-black/[0.06] rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center shrink-0">
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-white">
              {initials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-[#0f0f0f] truncate leading-snug">
              {user?.name || "Admin"}
            </p>
            <p className="font-[family-name:'DM_Sans',sans-serif] text-[10.5px] text-black/35 truncate">
              {user?.email || "admin@techmart.com"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-red-500 hover:bg-red-50/70 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN EXPORT — AdminNavbar
   Renders:
   • Desktop: fixed 240px left sidebar
   • Mobile: hamburger in top bar + animated drawer
════════════════════════════════════════ */
export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  /* close mobile drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* current page title */
  const activeLink = LINKS.find(l => location.pathname.startsWith(l.path));

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP SIDEBAR — always visible lg+
      ══════════════════════════════════ */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-[240px] bg-white border-r border-black/[0.07] z-[100] flex-col">
        <SidebarContent onClose={null} />
      </aside>

      {/* ══════════════════════════════════
          MOBILE TOP BAR
      ══════════════════════════════════ */}
      <motion.header
        className="lg:hidden fixed top-0 left-0 w-full z-[100] bg-white border-b border-black/[0.07] h-[58px] flex items-center justify-between px-5"
        initial={{ y: -58, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Logo compact */}
        <NavLink to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rotate-45 rounded-[2px]" />
          </div>
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-semibold text-[#0f0f0f]">
            TechMart
          </span>
        </NavLink>

        {/* Page name */}
        {activeLink && (
          <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/40 absolute left-1/2 -translate-x-1/2">
            {activeLink.name}
          </span>
        )}

        {/* Hamburger — 3 bars */}
        <button
          className="flex flex-col justify-center gap-[5px] w-8 h-8 p-1.5"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <span className="block w-full h-[1.5px] bg-black/55 rounded-full" />
          <span className="block w-[68%] h-[1.5px] bg-black/55 rounded-full" />
          <span className="block w-full h-[1.5px] bg-black/55 rounded-full" />
        </button>
      </motion.header>

      {/* ══════════════════════════════════
          MOBILE SIDEBAR DRAWER
      ══════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[110]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white border-r border-black/[0.07] z-[120]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </>
  );
}