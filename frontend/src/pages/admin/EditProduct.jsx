import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api.js";
import toast from "react-hot-toast";
import { 
  Package, Info, DollarSign, Boxes, Settings, 
  Image as ImageIcon, Palette, Plus, Trash2, Save, 
  UploadCloud, X, Loader2, ArrowLeft
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    colors: "",
    images: []
  });

  const [specs, setSpecs] = useState([]);

  // LOAD PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setForm({
          name: data.name || "",
          brand: data.brand || "",
          category: data.category || "",
          description: data.description || "",
          price: data.price || "",
          discountPrice: data.discountPrice || "",
          countInStock: data.countInStock || "",
          colors: data.colors ? data.colors.join(", ") : "",
          images: data.images || []
        });
        setSpecs(data.specifications && data.specifications.length > 0 ? data.specifications : [{ name: "", value: "" }]);
      } catch (error) {
        console.error("Failed to fetch product", error);
        alert("Could not load product data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE UPLOAD (Brought over from AddProduct)
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const { data } = await API.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data] }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload images.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpec = () => setSpecs([...specs, { name: "", value: "" }]);
  
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const productData = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
      countInStock: Number(form.countInStock),
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()) : [],
      specifications: specs.filter(s => s.name && s.value)
    };

    try {
      await API.put(`/products/${id}`, productData);
      // Optional: alert("Product Updated");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to update", error);
      alert(error?.response?.data?.message || "Error updating product");
    } finally {
      setIsSaving(false);
    }
  };

  // SAAS Design System Classes
  const inputStyles = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-sm transition-all";
  const labelStyles = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2";
  const cardStyles = "bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center pt-20">
        <Loader2 size={40} className="text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/products" className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2">
              <ArrowLeft size={14} /> Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="text-emerald-500" />
              Edit Product
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 transition-all"
            >
              Cancel
            </Link>
            <button
              onClick={submitHandler}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md min-w-[140px]"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            
            {/* LEFT COLUMN - MAIN INFO */}
            <div className="space-y-6">
              
              {/* BASIC INFO */}
              <div className={cardStyles}>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <Info size={18} className="text-slate-400" />
                  <h2 className="font-bold text-slate-800">Basic Information</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className={labelStyles}>Product Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className={inputStyles} required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelStyles}>Brand</label>
                      <input name="brand" value={form.brand} onChange={handleChange} className={inputStyles} required />
                    </div>
                    <div>
                      <label className={labelStyles}>Category</label>
                      <input name="category" value={form.category} onChange={handleChange} className={inputStyles} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyles}>Description</label>
                    <textarea 
                      name="description" 
                      value={form.description}
                      onChange={handleChange} 
                      className={`${inputStyles} min-h-[120px] resize-y`} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* SPECIFICATIONS */}
              <div className={cardStyles}>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <Settings size={18} className="text-slate-400" />
                  <h2 className="font-bold text-slate-800">Specifications</h2>
                </div>

                <div className="space-y-3">
                  <div className="hidden md:grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
                    <label className={labelStyles}>Property</label>
                    <label className={labelStyles}>Value</label>
                  </div>

                  {specs.map((spec, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3">
                      <input
                        placeholder="e.g. Processor"
                        value={spec.name}
                        onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                        className={inputStyles}
                      />
                      <input
                        placeholder="e.g. Snapdragon 8 Gen 3"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                        className={inputStyles}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="flex-shrink-0 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors self-end md:self-auto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSpec}
                    className="flex items-center gap-1.5 mt-4 text-[13px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors w-fit"
                  >
                    <Plus size={16} /> Add Specification
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - MEDIA & CONFIG */}
            <div className="space-y-6">
              
              {/* IMAGES */}
              <div className={cardStyles}>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <ImageIcon size={18} className="text-slate-400" />
                  <h2 className="font-bold text-slate-800">Product Images</h2>
                </div>

                <div className="mb-5">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    ref={fileInputRef}
                    className="hidden" 
                    id="edit-image-upload"
                  />
                  <label 
                    htmlFor="edit-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 transition-all group"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-500">
                        <Loader2 size={24} className="animate-spin" />
                        <span className="text-xs font-semibold">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-emerald-500">
                        <UploadCloud size={28} />
                        <span className="text-xs font-semibold">Click to upload more</span>
                      </div>
                    )}
                  </label>
                </div>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {form.images.map((img, index) => (
                      <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={`http://localhost:5000${img}`}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICING */}
              <div className={cardStyles}>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <DollarSign size={18} className="text-slate-400" />
                  <h2 className="font-bold text-slate-800">Pricing</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className={labelStyles}>Regular Price ($)</label>
                    <input name="price" type="number" value={form.price} onChange={handleChange} className={inputStyles} required />
                  </div>
                  <div>
                    <label className={labelStyles}>Discount Price ($)</label>
                    <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className={inputStyles} />
                  </div>
                </div>
              </div>

              {/* INVENTORY & VARIANTS */}
              <div className={cardStyles}>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <Boxes size={18} className="text-slate-400" />
                  <h2 className="font-bold text-slate-800">Inventory & Variants</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className={labelStyles}>Stock Quantity</label>
                    <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} className={inputStyles} required />
                  </div>
                  <div>
                    <label className={labelStyles}>Available Colors</label>
                    <div className="relative">
                      <Palette size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <input 
                        name="colors" 
                        value={form.colors}
                        onChange={handleChange} 
                        className={`${inputStyles} pl-10`} 
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="md:hidden mt-8 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-400 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              to="/admin/products"
              className="w-full text-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 transition-all"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProduct;
