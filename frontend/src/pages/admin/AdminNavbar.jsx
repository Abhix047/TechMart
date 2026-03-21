import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu, LogOut, LayoutDashboard, Package,
  PlusCircle, ShoppingCart, Users, AppWindow, Tag, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

if (typeof document !== "undefined" && !document.getElementById("an-fonts")) {
  const l = document.createElement("link");
  l.id = "an-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

export default function AdminNavbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [sidebarOpen, setSidebar]   = useState(false);
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = (user?.name || "A")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      {/* ══ TOP NAVBAR ══ */}
      <motion.header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-black/[0.08] shadow-sm"
            : "bg-white border-b border-black/[0.07]"
        }`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease }}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-[58px] flex items-center gap-0">

          {/* ── Logo ── */}
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-2.5 mr-10 shrink-0 group"
          >
            <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center group-hover:bg-black/75 transition-colors duration-200">
              <div className="w-2.5 h-2.5 bg-white rotate-45 rounded-[2px]" />
            </div>
            <span className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-semibold text-[#0f0f0f] hidden sm:block tracking-tight">
              Tech<span className="text-black/35 font-[300]">Mart</span>
            </span>
            <span className="hidden sm:flex items-center font-[family-name:'DM_Sans',sans-serif] text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#0f0f0f] bg-black/[0.06] px-2 py-0.5 rounded-full">
              Admin
            </span>
          </NavLink>

          {/* ── Nav links desktop ── */}
          <nav className="hidden lg:flex items-center gap-0 flex-1">
            {LINKS.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3.5 h-[58px] font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive ? "text-[#0f0f0f]" : "text-black/38 hover:text-black/68"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={13}
                      strokeWidth={isActive ? 2 : 1.5}
                      className={`transition-colors ${isActive ? "text-[#0f0f0f]" : "text-black/28"}`}
                    />
                    {name}
                    {isActive && (
                      <motion.span
                        layoutId="admin-underline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0f0f0f] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Right: user + logout ── */}
          <div className="flex items-center gap-3 ml-auto shrink-0">

            {/* User pill */}
            <div className="hidden md:flex items-center gap-2.5 bg-black/[0.04] border border-black/[0.07] rounded-full pl-1.5 pr-4 py-1.5">
              <div className="w-6 h-6 rounded-full bg-[#0f0f0f] flex items-center justify-center">
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold text-white">
                  {initials}
                </span>
              </div>
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/52 max-w-[120px] truncate">
                {user?.name || "Admin"}
              </span>
            </div>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-red-500 border border-red-200/70 bg-white hover:bg-red-50/60 hover:border-red-300 rounded-full px-3.5 py-1.5 transition-all duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={12} strokeWidth={1.5} />
              Logout
            </motion.button>

            {/* Hamburger — simple 3 bars */}
            <button
              className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1.5"
              onClick={() => setSidebar(true)}
              aria-label="Open menu"
            >
              <span className="block w-full h-[1.5px] bg-black/60 rounded-full" />
              <span className="block w-[70%] h-[1.5px] bg-black/60 rounded-full" />
              <span className="block w-full h-[1.5px] bg-black/60 rounded-full" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ══ SIDEBAR DRAWER (mobile) ══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[110]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSidebar(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-[260px] bg-white border-r border-black/[0.07] z-[120] flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease }}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-[58px] border-b border-black/[0.07]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#0f0f0f] rounded-md flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rotate-45 rounded-[1.5px]" />
                  </div>
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-[#0f0f0f]">
                    TechMart
                  </span>
                  <span className="font-[family-name:'DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40 bg-black/[0.05] px-1.5 py-0.5 rounded-full">
                    Admin
                  </span>
                </div>
                <button
                  onClick={() => setSidebar(false)}
                  className="w-7 h-7 flex items-center justify-center text-black/35 hover:text-black/65 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
                {LINKS.map(({ name, path, icon: Icon }, i) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.04 + i * 0.05, ease }}
                  >
                    <NavLink
                      to={path}
                      onClick={() => setSidebar(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#0f0f0f] text-white"
                            : "text-black/50 hover:text-black/75 hover:bg-black/[0.04]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={14}
                            strokeWidth={isActive ? 2 : 1.5}
                            className={isActive ? "text-white" : "text-black/28"}
                          />
                          {name}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-4 border-t border-black/[0.07]">
                <div className="flex items-center gap-3 mb-3 px-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center shrink-0">
                    <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-white">
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/35 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-red-500 border border-red-200/60 hover:bg-red-50/60 transition-colors duration-200"
                  whileTap={{ scale: 0.97 }}
                >
                  <LogOut size={13} strokeWidth={1.5} />
                  Logout
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </>
  );
}