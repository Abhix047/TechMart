import { NavLink } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-100 pt-16 pb-8 px-6">
      <div className="max-w-[1300px] mx-auto">
        
        {/* TOP SECTION: GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-sky-400 to-green-400 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rotate-45 rounded-sm" />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900">TechMart</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
              Elevating your tech lifestyle with premium gadgets and seamless shopping experiences.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-sky-500 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-sky-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-sky-500 transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-widest">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><NavLink to="/products" className="hover:text-green-500 transition-colors">All Products</NavLink></li>
              <li><NavLink to="/categories" className="hover:text-green-500 transition-colors">Featured</NavLink></li>
              <li><NavLink to="/new-arrivals" className="hover:text-green-500 transition-colors">New Arrivals</NavLink></li>
              <li><NavLink to="/offers" className="hover:text-green-500 transition-colors">Discounts</NavLink></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-widest">Support</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li><NavLink to="/faq" className="hover:text-sky-500 transition-colors">FAQs</NavLink></li>
              <li><NavLink to="/shipping" className="hover:text-sky-500 transition-colors">Shipping Policy</NavLink></li>
              <li><NavLink to="/returns" className="hover:text-sky-500 transition-colors">Returns</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-sky-500 transition-colors">Contact Us</NavLink></li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Stay Updated</h4>
            <p className="text-slate-500 text-sm">Subscribe to get special offers and tech news.</p>
            <form className="relative flex items-center">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-white border border-slate-200 rounded-full py-3 px-5 text-sm outline-none focus:border-sky-400 transition-all shadow-sm"
              />
              <button className="absolute right-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-tighter px-4 py-2 rounded-full hover:bg-sky-600 transition-all">
                Join
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">
            © {currentYear} TechMart Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
               <Mail size={14} />
               <span className="text-[11px] font-bold">hello@techmart.com</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
               <MapPin size={14} />
               <span className="text-[11px] font-bold">New Delhi, India</span>
            </div>
          </div>
          
          <div className="flex gap-6">
            <NavLink to="/privacy" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Privacy</NavLink>
            <NavLink to="/terms" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Terms</NavLink>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;