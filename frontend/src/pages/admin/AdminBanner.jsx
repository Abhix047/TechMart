import { useState } from "react";
import axios from "axios";
import API from "../../services/api"
import { Upload, Image as ImageIcon, Film, X } from "lucide-react";
import toast from "react-hot-toast";

const AdminBanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("image");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Please fill all fields");

    setLoading(true);
    const formData = new FormData();
    formData.append("media", file);
    formData.append("type", type);
    formData.append("title", title);

    try {
    await API.post("/banners", formData);
      toast.success("Banner Uploaded Successfully!");
      // Reset form
      setFile(null);
      setPreview(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload size={24} className="text-blue-600" />
        Add New Promotional Banner
      </h2>

      <form onSubmit={submit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer Sale 2026"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {/* Media Type Select */}
        <div className="grid grid-cols-2 gap-4">
          <label 
            className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${type === 'image' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'}`}
            onClick={() => setType("image")}
          >
            <ImageIcon size={20} /> Image
          </label>
          <label 
            className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${type === 'video' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'}`}
            onClick={() => setType("video")}
          >
            <Film size={20} /> Video
          </label>
        </div>

        {/* File Upload Area */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors">
          {!preview ? (
            <div className="text-center py-8">
              <Upload className="mx-auto text-gray-400 mb-2" size={40} />
              <p className="text-gray-500">Click to upload {type} banner</p>
              <input
                type="file"
                accept={type === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative group">
              {type === "image" ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <video src={preview} className="w-full h-48 object-cover rounded-lg" controls />
              )}
              <button
                type="button"
                onClick={() => {setPreview(null); setFile(null);}}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
        >
          {loading ? "Uploading..." : "Publish Banner"}
        </button>
      </form>
    </div>
  );
};

export default AdminBanner;