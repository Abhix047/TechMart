import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, LayoutDashboard, Package, PlusCircle, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";

const AdminNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { user, logout } = useAuth();

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Add Product", path: "/admin/add-product", icon: PlusCircle },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Users", path: "/admin/users", icon: Users },
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
          {/* LEFT: LOGO */}
          <div className="flex items-center gap-8 flex-1">
            <NavLink to="/admin/dashboard" className="flex items-center gap-2 min-w-fit group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                <div className="w-3 h-3 bg-white rotate-45 rounded-sm" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800 hidden md:flex items-center gap-1.5">
                TechMart <span className="text-emerald-600 font-medium text-sm px-1.5 py-0.5 bg-emerald-50 rounded-md">Admin</span>
              </span>
            </NavLink>
          </div>
          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
          {/* CENTER: NAV LINKS */}
          <div className="hidden lg:flex items-center gap-8 mx-6">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
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
                        <Icon size={14} className={isActive ? "text-emerald-500" : "text-slate-400"} />
                        {link.name}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="adminNavUnderline"
                          className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-4 min-w-fit justify-end">
            
            {/* LOGOUT BUTTON */}
            <button 
              onClick={logout}
              className="hidden md:flex items-center gap-2 text-[13px] font-bold text-red-500 px-4 py-2 hover:bg-red-50 rounded-full transition"
            >
              <LogOut size={16} />
              Logout
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-slate-600 active:scale-90 transition-transform"
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* MOBILE MENU PLACEHOLDER */}
      {/* You can add your AnimatePresence mobile menu logic here, similar to your UserNavbar */}
    </>
  );
};

export default AdminNavbar;