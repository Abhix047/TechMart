import React, { useState, useEffect, useMemo, useRef } from "react";
import API from "../services/api";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SlidersHorizontal, ChevronDown, ChevronUp,
  X, ArrowUpRight, Search, Heart
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ease = [0.22, 1, 0.36, 1];

if (typeof document !== "undefined" && !document.getElementById("pp-fonts")) {
  const l = document.createElement("link");
  l.id = "pp-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

const imgUrl = (src) =>
  !src ? null : src.startsWith("http") ? src : `${BASE_URL}${src}`;

/* ── Skeleton ── */
const SkeletonCard = ({ i }) => (
  <motion.div
    animate={{ opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
    className="flex flex-col gap-3"
  >
    <div className="aspect-[4/5] bg-[#ede9e3] rounded-2xl w-full" />
    <div className="h-2.5 w-2/3 bg-[#ede9e3] rounded-full" />
    <div className="h-3 w-4/5 bg-[#ede9e3] rounded-full" />
    <div className="h-2.5 w-1/3 bg-[#ede9e3] rounded-full" />
  </motion.div>
);

/* ── Sidebar section ── */
const SideSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/[0.07] pb-5 mb-5 last:border-none last:mb-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full mb-3.5 group"
      >
        <span className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.2em] text-black/38 group-hover:text-black/65 transition-colors">
          {title}
        </span>
        {open
          ? <ChevronUp size={12} className="text-black/28" />
          : <ChevronDown size={12} className="text-black/28" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Checkbox row ── */
const CheckRow = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
    <div
      onClick={onChange}
      className={`w-[15px] h-[15px] rounded-[4px] border flex items-center justify-center transition-all shrink-0 ${
        checked ? "bg-[#0f0f0f] border-[#0f0f0f]" : "border-black/18 group-hover:border-black/40"
      }`}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span
      onClick={onChange}
      className={`font-[family-name:'DM_Sans',sans-serif] text-[12.5px] transition-colors ${
        checked ? "font-semibold text-[#0f0f0f]" : "text-black/48 group-hover:text-black/72"
      }`}
    >
      {label}
    </span>
  </label>
);

/* ── Product card ── */
const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px -20px" });
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const src        = imgUrl(product.images?.[0]);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const price      = product.discountPrice || product.price;
  const pct        = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const inStock    = product.countInStock > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
    >
      <Link to={`/product/${product._id}`}>

        {/* Image container */}
        <div className="relative overflow-hidden bg-[#f0ede8] rounded-2xl mb-3.5" style={{ aspectRatio: "4/5" }}>

          {src ? (
            <motion.img
              src={src} alt={product.name}
              className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-6"
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.8, ease }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#e8e4dc]" />
          )}

          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            animate={{ opacity: hovered ? 0.16 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Wishlist */}
          <motion.button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-black/[0.07] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.88 }}
          >
            <Heart size={13} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black/38"} />
          </motion.button>

          {/* Discount badge */}
          {hasDiscount && (
            <motion.span
              className="absolute top-3 left-3 z-10 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold px-2.5 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease }}
            >
              -{pct}%
            </motion.span>
          )}

          {/* Sold out overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold tracking-[0.18em] uppercase text-black/40">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick view bar */}
          <motion.div
            className="absolute inset-x-0 bottom-0 px-4 pb-4 flex items-center justify-between"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.25, ease }}
          >
            <span className="bg-white text-[#0f0f0f] font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold px-3.5 py-1.5 rounded-xl">
              Quick View
            </span>
            <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <ArrowUpRight size={12} className="text-[#0f0f0f]" />
            </span>
          </motion.div>
        </div>

        {/* Text info */}
        <div>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-medium text-black/32 uppercase tracking-[0.14em] mb-1">
            {product.brand || product.category}
          </p>
          <h3 className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-medium text-[#0f0f0f] leading-snug mb-2.5 line-clamp-2 group-hover:text-black/62 transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:'Cormorant_Garamond',serif] text-[18px] font-[500] text-[#0f0f0f] leading-none">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/28 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ════════════════════════════════════════ MAIN ════════════════════════════════════════ */
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const urlCategory    = searchParams.get("category");
  const urlSearch      = searchParams.get("search");

  const [products, setProducts]                   = useState([]);
  const [filteredProducts, setFilteredProducts]   = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [featured, setFeatured]                   = useState(null);

  const [searchQuery, setSearchQuery]             = useState(urlSearch || "");
  const [selectedCategory, setSelectedCategory]   = useState(urlCategory || "All");
  const [selectedBrands, setSelectedBrands]       = useState([]);
  const [priceRange, setPriceRange]               = useState(200000);
  const [maxPrice, setMaxPrice]                   = useState(200000);
  const [inStockOnly, setInStockOnly]             = useState(false);
  const [sortBy, setSortBy]                       = useState("newest");
  const [searchFocused, setSearchFocused]         = useState(false);

  const availableCategories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))], [products]);
  const availableBrands     = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);
  const activeFiltersCount  = selectedBrands.length + (inStockOnly ? 1 : 0) + (priceRange < maxPrice ? 1 : 0) + (selectedCategory !== "All" ? 1 : 0);

  useEffect(() => { setSelectedCategory(urlCategory || "All"); }, [urlCategory]);
  useEffect(() => { setSearchQuery(urlSearch || ""); }, [urlSearch]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
        setFilteredProducts(data);
        if (data.length > 0) {
          setFeatured(data[0]);
          const hi = Math.max(...data.map(p => p.discountPrice || p.price));
          setMaxPrice(hi); setPriceRange(hi);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    let r = [...products];
    if (searchQuery) r = r.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory !== "All") r = r.filter(p => p.category === selectedCategory);
    if (selectedBrands.length) r = r.filter(p => selectedBrands.includes(p.brand));
    r = r.filter(p => (p.discountPrice || p.price) <= priceRange);
    if (inStockOnly) r = r.filter(p => p.countInStock > 0);
    if (sortBy === "price-low")  r.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (sortBy === "price-high") r.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else r.reverse();
    setFilteredProducts(r);
  }, [searchQuery, selectedCategory, selectedBrands, priceRange, inStockOnly, sortBy, products]);

  const toggleBrand = (b) =>
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const clearAll = () => {
    setSearchQuery(""); setSelectedCategory("All"); setSelectedBrands([]);
    setPriceRange(maxPrice); setInStockOnly(false); setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════
          HERO BANNER — tall, editorial
      ══════════════════════════════════════════ */}
      {featured && (
        <div className="relative bg-[#0f0f0f] overflow-hidden" style={{ minHeight: "480px" }}>

          {/* Subtle horizontal rule texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px)",
            }}
          />

          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-[1fr_420px] gap-0 items-center min-h-[480px]">

            {/* Left — text */}
            <div className="py-16 md:py-20 z-10">
              <motion.p
                className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.28em] text-white/32 mb-4"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
              >
                {featured.category} · Featured
              </motion.p>

              <motion.h1
                className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(40px,5.5vw,72px)] font-[400] text-white leading-[1.02] mb-5"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16, ease }}
              >
                {featured.name}
              </motion.h1>

              {featured.description && (
                <motion.p
                  className="font-[family-name:'DM_Sans',sans-serif] text-[14px] font-light text-white/42 leading-[1.85] max-w-[460px] mb-8 line-clamp-3"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.24, ease }}
                >
                  {featured.description}
                </motion.p>
              )}

              <motion.div
                className="flex items-center gap-5"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.30, ease }}
              >
                <Link to={`/product/${featured._id}`}>
                  <motion.button
                    className="flex items-center gap-2 bg-white text-[#0f0f0f] font-[family-name:'DM_Sans',sans-serif] text-[12px] font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/88 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Explore <ArrowUpRight size={13} />
                  </motion.button>
                </Link>

                <div>
                  <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-1">
                    Starting from
                  </p>
                  <p className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[400] text-white leading-none">
                    ₹{(featured.discountPrice || featured.price).toLocaleString("en-IN")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right — product image */}
            <div className="hidden md:flex items-end justify-center relative self-stretch overflow-hidden">
              {imgUrl(featured.images?.[0]) && (
                <motion.img
                  src={imgUrl(featured.images[0])}
                  alt={featured.name}
                  className="absolute bottom-0 h-[90%] w-auto max-w-full object-contain mix-blend-luminosity opacity-90"
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  animate={{ opacity: 0.92, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease }}
                />
              )}

              {/* Ghost price */}
              <span className="absolute right-4 bottom-6 font-[family-name:'Cormorant_Garamond',serif] text-[70px] font-[300] text-white/[0.04] select-none pointer-events-none leading-none">
                ₹{(featured.discountPrice || featured.price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Shimmer sweep on mount */}
          <motion.span
            className="absolute bottom-0 left-0 h-px bg-white/20 pointer-events-none"
            initial={{ width: "0%", opacity: 0.6 }}
            animate={{ width: "100%", opacity: 0 }}
            transition={{ duration: 2, delay: 0.8, ease }}
          />
        </div>
      )}

      {/* ══ CATEGORY STRIP ══ */}
      <div className="border-b border-black/[0.08] bg-white/95 backdrop-blur-md sticky top-[56px] z-40">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {["All", ...availableCategories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative whitespace-nowrap px-5 py-4 font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium transition-all duration-200 shrink-0 ${
                selectedCategory === cat ? "text-[#0f0f0f]" : "text-black/38 hover:text-black/65"
              }`}
            >
              {cat}
              {selectedCategory === cat && (
                <motion.span
                  layoutId="cat-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0f0f0f] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══ MAIN LAYOUT ══ */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-9 flex gap-10 items-start">

        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-[210px] xl:w-[230px] shrink-0 sticky top-[118px]">

          {/* Search */}
          <div className="relative mb-6">
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products…"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-[#0f0f0f] placeholder:text-black/25 outline-none transition-colors duration-200"
              style={{ borderColor: searchFocused ? "#0f0f0f" : "rgba(0,0,0,0.1)" }}
            />
          </div>

          <div className="bg-white border border-black/[0.07] rounded-2xl p-5">

            {/* Category */}
            <SideSection title="Category">
              <div className="flex flex-col gap-1.5">
                {["All", ...availableCategories].map(cat => (
                  <CheckRow
                    key={cat}
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    label={cat}
                  />
                ))}
              </div>
            </SideSection>

            {/* Brand */}
            {availableBrands.length > 0 && (
              <SideSection title="Brand">
                <div className="flex flex-col gap-1.5">
                  {availableBrands.map(brand => (
                    <CheckRow
                      key={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      label={brand}
                    />
                  ))}
                </div>
              </SideSection>
            )}

            {/* Price */}
            <SideSection title="Price Range">
              <div className="flex justify-between mb-3">
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[11px] text-black/36">₹0</span>
                <span className="font-[family-name:'Cormorant_Garamond',serif] text-[15px] font-[500] text-[#0f0f0f]">
                  ₹{priceRange.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range" min="0" max={maxPrice} step="500"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#0f0f0f]"
              />
            </SideSection>

            {/* Availability */}
            <SideSection title="Availability" defaultOpen={false}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setInStockOnly(v => !v)}
                  className={`w-10 h-[22px] rounded-full p-0.5 transition-colors duration-250 shrink-0 cursor-pointer ${
                    inStockOnly ? "bg-[#0f0f0f]" : "bg-black/10 group-hover:bg-black/18"
                  }`}
                >
                  <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-250 ${inStockOnly ? "translate-x-[18px]" : "translate-x-0"}`} />
                </div>
                <span className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/50 group-hover:text-black/75 transition-colors">
                  In Stock Only
                </span>
              </label>
            </SideSection>

            {/* Clear filters */}
            {activeFiltersCount > 0 && (
              <motion.button
                onClick={clearAll}
                className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11.5px] font-medium text-red-500 hover:text-red-600 transition-colors mt-1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                whileTap={{ scale: 0.97 }}
              >
                <X size={11} /> Clear All ({activeFiltersCount})
              </motion.button>
            )}
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div className="flex-1 min-w-0">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              {/* Mobile filters */}
              <button className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-white border border-black/10 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/50 hover:border-black/20 transition-colors">
                <SlidersHorizontal size={13} /> Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-0.5 bg-[#0f0f0f] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {loading ? null : (
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[12px] text-black/35">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-black/10 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium text-black/50 pl-4 pr-9 py-2 outline-none cursor-pointer hover:border-black/22 transition-colors"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" />
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 mb-5"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25, ease }}
              >
                {selectedCategory !== "All" && (
                  <span className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-[#0f0f0f] bg-white border border-black/10 rounded-full px-3 py-1.5">
                    {selectedCategory}
                    <X size={10} className="cursor-pointer text-black/40 hover:text-black" onClick={() => setSelectedCategory("All")} />
                  </span>
                )}
                {selectedBrands.map(b => (
                  <span key={b} className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-[#0f0f0f] bg-white border border-black/10 rounded-full px-3 py-1.5">
                    {b}
                    <X size={10} className="cursor-pointer text-black/40 hover:text-black" onClick={() => toggleBrand(b)} />
                  </span>
                ))}
                {inStockOnly && (
                  <span className="flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-[#0f0f0f] bg-white border border-black/10 rounded-full px-3 py-1.5">
                    In Stock
                    <X size={10} className="cursor-pointer text-black/40 hover:text-black" onClick={() => setInStockOnly(false)} />
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-24 text-center bg-white border border-black/[0.07] rounded-3xl"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center mb-5">
                <Search size={16} className="text-black/22" strokeWidth={1.5} />
              </div>
              <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[26px] font-[400] text-[#0f0f0f] mb-1.5">
                Nothing found.
              </p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/38 mb-7 leading-relaxed">
                Try adjusting your filters or search term.
              </p>
              <motion.button
                onClick={clearAll}
                className="px-7 py-3 bg-[#0f0f0f] text-white font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold rounded-2xl hover:bg-black/82 transition-colors"
                whileTap={{ scale: 0.97 }}
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              <AnimatePresence>
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
        input[type=range] { height: 3px; border-radius: 2px; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>
    </div>
  );
};

export default ProductsPage;