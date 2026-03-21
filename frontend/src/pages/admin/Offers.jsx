import { useState, useEffect } from "react";
import API from "../../services/api";
import { Plus, Edit2, Trash2, Tag, Loader2, X, CheckCircle2, Percent, Package } from "lucide-react";
import toast from "react-hot-toast";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offersRes, productsRes] = await Promise.all([
        API.get("/offers"),
        API.get("/products")
      ]);
      setOffers(offersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      toast.error("Failed to load data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setName(offer.name);
      setDiscountPercentage(offer.discountPercentage);
      setIsActive(offer.isActive);
      setSelectedProducts(offer.products?.map(p => p._id) || []);
    } else {
      setEditingOffer(null);
      setName("");
      setDiscountPercentage("");
      setIsActive(true);
      setSelectedProducts([]);
    }
    setSearchProduct("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingOffer(null);
  };

  const handleToggleProduct = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !discountPercentage) {
      return toast.error("Name and Discount Percentage are required.");
    }
    setIsSaving(true);
    try {
      const payload = { 
        name, 
        discountPercentage: Number(discountPercentage), 
        isActive, 
        products: selectedProducts 
      };

      if (editingOffer) {
        await API.put(`/offers/${editingOffer._id}`, payload);
        toast.success("Offer updated successfully!");
      } else {
        await API.post("/offers", payload);
        toast.success("Offer created successfully!");
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save offer.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer? Product prices will be restored.")) return;
    try {
      await API.delete(`/offers/${id}`);
      toast.success("Offer deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete offer.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
    p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-28 pb-12 px-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1108] tracking-tight flex items-center gap-2">
              <Tag className="text-emerald-500" />
              Promotional Offers
            </h1>
            <p className="text-sm text-black/40 mt-1">Create and manage discounts across your products.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1108] text-white rounded-xl text-sm font-medium hover:bg-black/80 transition-colors shadow-lg shadow-black/10"
          >
            <Plus size={16} /> New Offer
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
            <p className="text-sm font-medium text-black/40">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-2xl p-12 text-center shadow-sm">
            <Tag size={48} className="mx-auto text-black/10 mb-4" />
            <h3 className="text-lg font-bold text-[#1a1108] mb-1">No Offers Found</h3>
            <p className="text-sm text-black/40 mb-6">You haven't created any promotional offers yet.</p>
            <button onClick={() => handleOpenModal()} className="px-5 py-2 bg-emerald-50 text-emerald-600 font-semibold text-sm rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-2">
              <Plus size={16} /> Create Your First Offer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map(offer => (
              <div key={offer._id} className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${offer.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-black/5 text-black/40'}`}>
                    {offer.isActive ? <><CheckCircle2 size={12}/> Active</> : 'Inactive'}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOpenModal(offer)} className="p-1.5 text-black/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(offer._id)} className="p-1.5 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1a1108] mb-1 line-clamp-1">{offer.name}</h3>
                
                <div className="flex items-center gap-2 mt-4 text-emerald-600">
                  <Percent size={18} className="p-0.5 bg-emerald-100 rounded-md" />
                  <span className="text-2xl font-black">{offer.discountPercentage}% OFF</span>
                </div>
                
                <div className="mt-5 pt-5 border-t border-black/5 flex items-center justify-between text-sm text-black/50">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Package size={14} />
                    {offer.products?.length || 0} Products
                  </div>
                  <span className="text-[11px] font-mono">ID: {offer._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <h2 className="text-lg font-bold text-[#1a1108] flex items-center gap-2">
                  <Tag size={18} className="text-emerald-500" />
                  {editingOffer ? "Edit Offer" : "Create New Offer"}
                </h2>
                <button onClick={handleCloseModal} className="p-2 text-black/40 hover:bg-black/5 rounded-full transition-colors"><X size={18} /></button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="offerForm" onSubmit={handleSave} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-black/50 uppercase tracking-wider mb-2">Offer Name</label>
                      <input 
                        type="text" 
                        value={name} onChange={e => setName(e.target.value)}
                        placeholder="e.g. Summer Clearance"
                        className="w-full px-4 py-2.5 bg-[#f8f7f5] border border-black/5 rounded-xl font-medium text-[#1a1108] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black/50 uppercase tracking-wider mb-2">Discount (%)</label>
                      <div className="relative">
                        <input 
                          type="number" min="0" max="100"
                          value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)}
                          placeholder="20"
                          className="w-full px-4 py-2.5 pl-10 bg-[#f8f7f5] border border-black/5 rounded-xl font-medium text-[#1a1108] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                        <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer select-none py-2">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                      <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1a1108] block">Offer is Active</span>
                      <span className="text-[11px] text-black/40">Customers will see this offer and discounts applied immediately.</span>
                    </div>
                  </label>

                  {/* Product Selection */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-black/50 uppercase tracking-wider mb-3">
                      Included Products ({selectedProducts.length} selected)
                    </label>
                    <div className="bg-[#f8f7f5] border border-black/5 rounded-xl overflow-hidden flex flex-col">
                      <div className="p-3 border-b border-black/5">
                        <input 
                          type="text" 
                          placeholder="Search products by name or category..." 
                          value={searchProduct} onChange={e => setSearchProduct(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-black/5 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="max-h-[220px] overflow-y-auto p-2 space-y-1">
                        {filteredProducts.map(p => {
                          const isSelected = selectedProducts.includes(p._id);
                          return (
                            <label key={p._id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/50' : 'hover:bg-black/5'}`}>
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                checked={isSelected}
                                onChange={() => handleToggleProduct(p._id)}
                              />
                              <div className="w-8 h-8 rounded bg-white border border-black/5 flex-shrink-0 p-1">
                                {p.images?.[0] && <img src={p.images[0].startsWith('http') ? p.images[0] : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${p.images[0].replace(/\\/g, '/')}`} className="w-full h-full object-contain mix-blend-multiply" alt=""/>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-[#1a1108] truncate">{p.name}</p>
                                <p className="text-[10px] text-black/40 uppercase font-medium">{p.category}</p>
                              </div>
                            </label>
                          );
                        })}
                        {filteredProducts.length === 0 && (
                          <div className="p-4 text-center text-xs text-black/40">No products match your search.</div>
                        )}
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-black/5 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-semibold text-black/60 hover:bg-black/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button form="offerForm" type="submit" disabled={isSaving} className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {isSaving ? "Saving..." : "Save Offer"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default Offers;
