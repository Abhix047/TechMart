import { useState, useRef } from "react";
import API from "../../services/api.js";
import toast from "react-hot-toast";
import { 
  Package, Tag, Info, DollarSign, Boxes, Settings, 
  Image as ImageIcon, Palette, Plus, Trash2, CheckCircle, 
  UploadCloud, X, Loader2
} from "lucide-react";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    images: [], 
    colors: "",
  });

  const [specs, setSpecs] = useState([{ name: "", value: "" }]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ SAAS STYLE IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setIsUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const { data } = await API.post(
        "/products/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Append new images to existing ones
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data]
      }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addSpec = () => setSpecs([...specs, { name: "", value: "" }]);
  
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    const productData = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
      countInStock: Number(form.countInStock),
      colors: form.colors ? form.colors.split(",").map(c => c.trim()) : [],
      specifications: specs.filter(s => s.name && s.value), // Only send filled specs
    };

    try {
      await API.post("/products", productData);
      alert("Product Created Successfully!");
      // Optional: Redirect to products list here
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Error creating product");
    } finally {
      setIsPublishing(false);
    }
  };

  // SAAS Design System Classes
  const inputStyles = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-sm transition-all";
  const labelStyles = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2";
  const cardStyles = "bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="text-emerald-500" />
              Add New Product
            </h1>
            <p className="text-sm text-slate-500 mt-1">Configure your product details, pricing, and media.</p>
          </div>
          
          <button
            onClick={submitHandler}
            disabled={isPublishing}
            className="hidden md:flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {isPublishing ? "Publishing..." : "Publish Product"}
          </button>
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
                    <input name="name" placeholder="e.g. iPhone 15 Pro Max" onChange={handleChange} className={inputStyles} required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelStyles}>Brand</label>
                      <input name="brand" placeholder="e.g. Apple" onChange={handleChange} className={inputStyles} required />
                    </div>
                    <div>
                      <label className={labelStyles}>Category</label>
                      <input name="category" placeholder="e.g. Smartphones" onChange={handleChange} className={inputStyles} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyles}>Description</label>
                    <textarea 
                      name="description" 
                      placeholder="Enter a detailed product description..." 
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
                      {specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="flex-shrink-0 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors self-end md:self-auto"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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
              
              {/* IMAGES (Upgraded UI) */}
              <div className={cardStyles}>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <ImageIcon size={18} className="text-slate-400" />
                  <h2 className="font-bold text-slate-800">Product Images</h2>
                </div>

                {/* Custom File Dropzone */}
                <div className="mb-5">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    ref={fileInputRef}
                    className="hidden" 
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
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
                        <span className="text-xs font-semibold">Click to upload images</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* IMAGE PREVIEW GRID */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {form.images.map((img, index) => (
                      <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={`http://localhost:5000${img}`}
                          alt={`Upload preview ${index + 1}`}
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
                    <input name="price" type="number" placeholder="0.00" onChange={handleChange} className={inputStyles} required />
                  </div>
                  <div>
                    <label className={labelStyles}>Discount Price ($)</label>
                    <input name="discountPrice" type="number" placeholder="0.00" onChange={handleChange} className={inputStyles} />
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
                    <input name="countInStock" type="number" placeholder="e.g. 50" onChange={handleChange} className={inputStyles} required />
                  </div>
                  <div>
                    <label className={labelStyles}>Available Colors</label>
                    <div className="relative">
                      <Palette size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <input 
                        name="colors" 
                        placeholder="Black, Silver, Blue" 
                        onChange={handleChange} 
                        className={`${inputStyles} pl-10`} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Separate multiple colors with a comma</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isPublishing}
            className="md:hidden mt-8 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-400 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {isPublishing ? "Publishing..." : "Publish Product"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;
