import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api.js";
import { 
  Trash2, 
  Edit, 
  Package, 
  Plus, 
  Search, 
  AlertCircle,
  Tag,
  FolderOpen
} from "lucide-react";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Error deleting product.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER & ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="text-emerald-500" /> Manage Products
            </h1>
            <p className="text-sm text-slate-500 mt-1">View, edit, and manage your store's detailed inventory.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* SEARCH BAR */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 bg-white border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-sm"
              />
            </div>
            
            {/* ADD PRODUCT CTA */}
            <Link 
              to="/admin/add-product"
              className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm whitespace-nowrap"
            >
              <Plus size={16} />
              <span className="hidden sm:block">New Product</span>
            </Link>
          </div>
        </div>

        {/* WIDE DETAILED CARDS LIST */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div 
                key={p._id} 
                className="group bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center"
              >
                
                {/* 1. IMAGE */}
                <div className="w-full md:w-28 md:h-28 aspect-video md:aspect-square rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-shadow">
                  {p.images && p.images[0] ? (
                    <img
                      src={`http://localhost:5000${p.images[0]}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                  )}
                </div>

                {/* 2. MAIN DETAILS */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{p.name}</h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                      ID: {p._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 max-w-3xl leading-relaxed">
                    {p.description}
                  </p>
                  
                  {/* METADATA BADGES */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-bold tracking-wide">
                      <Tag size={12} className="text-slate-400" /> {p.brand}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-bold tracking-wide">
                      <FolderOpen size={12} className="text-slate-400" /> {p.category}
                    </span>
                  </div>
                </div>

                {/* 3. PRICING SECTION */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-32 py-4 md:py-0 border-y md:border-y-0 md:border-l border-slate-100 md:pl-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden md:block">Price</span>
                  {p.discountPrice > 0 ? (
                    <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0">
                      <span className="text-lg font-black text-emerald-600">${p.discountPrice}</span>
                      <span className="text-[12px] font-semibold line-through text-slate-400">${p.price}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-black text-slate-800">${p.price}</span>
                  )}
                </div>

                {/* 4. STATUS & ACTIONS */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-36 gap-4">
                  
                  {/* Stock Status */}
                  {p.countInStock > 0 ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Stock: {p.countInStock}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                      Out of Stock
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/product/${p._id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteHandler(p._id)}
                      className="p-1.5 text-slate-400 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>

              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="bg-white border border-slate-200/60 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle size={40} className="mb-4 text-slate-300" />
              <p className="text-[16px] font-bold text-slate-700">No products found</p>
              <p className="text-[13px] text-slate-500 mt-1 mb-6 max-w-sm">
                We couldn't find any products matching your search criteria. Try adjusting your filters or adding a new product.
              </p>
              <Link 
                to="/admin/add-product"
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm"
              >
                <Plus size={16} /> Add New Product
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageProducts;