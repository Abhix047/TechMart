import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, X } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = ({ onSwitch, onClose }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      if (res.data) login(res.data);
      onClose(); // Modal band karo register ke baad
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // THE GLASS CARD CONTAINER
      className="relative w-full max-w-[400px] p-8 md:p-10 bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_32px_64px_rgba(0,0,0,0.2)] rounded-3xl flex flex-col items-center"
    >
      {/* Close Button (Subtle Glass) */}
      <button 
        onClick={onClose} 
        className="absolute top-5 right-5 z-20 p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full transition-all backdrop-blur-md"
      >
        <X size={16} strokeWidth={2.5} />
      </button>

      {/* HEADER: Clean White Text */}
      <div className="w-full text-left mb-8 mt-4">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2 drop-shadow-md">
          Sign Up
        </h2>
        <p className="text-white/80 text-[13px] font-medium tracking-wide">
          Create an account to start your premium tech journey
        </p>
      </div>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        
        {/* Full Name Input (Glass Outline Style) */}
        <div className="relative flex items-center group">
          <User className="absolute right-4 text-white/60 group-focus-within:text-white transition-colors" size={20} />
          <input 
            type="text" 
            name="name" 
            placeholder="User Name" 
            required 
            onChange={handleChange} 
            className="w-full bg-transparent border border-white/40 hover:border-white/60 focus:border-white py-3.5 px-4 rounded-xl outline-none transition-all text-sm font-medium text-white placeholder:text-white/60 focus:bg-white/5"
          />
        </div>

        {/* Email Input */}
        <div className="relative flex items-center group">
          <Mail className="absolute right-4 text-white/60 group-focus-within:text-white transition-colors" size={20} />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            required 
            onChange={handleChange} 
            className="w-full bg-transparent border border-white/40 hover:border-white/60 focus:border-white py-3.5 px-4 rounded-xl outline-none transition-all text-sm font-medium text-white placeholder:text-white/60 focus:bg-white/5"
          />
        </div>

        {/* Password Input */}
        <div className="relative flex items-center group">
          <Lock className="absolute right-4 text-white/60 group-focus-within:text-white transition-colors" size={20} />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            onChange={handleChange} 
            className="w-full bg-transparent border border-white/40 hover:border-white/60 focus:border-white py-3.5 px-4 rounded-xl outline-none transition-all text-sm font-medium text-white placeholder:text-white/60 focus:bg-white/5"
          />
        </div>

        {/* Action Button (Green Gradient) */}
        <button 
          disabled={loading} 
          className="w-full mt-2 py-4 bg-gradient-to-r from-[#8ca825] to-[#2fa554] hover:from-[#9bc029] hover:to-[#35b95e] text-white rounded-xl font-bold text-[15px] transition-all shadow-[0_10px_20px_rgba(47,165,84,0.3)] active:scale-95 disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* FOOTER LINKS */}
      <div className="mt-6 text-center w-full">
        <button 
          onClick={onSwitch} 
          className="text-[13px] text-white/80 hover:text-white transition-colors"
        >
          Already have an account? <span className="font-bold">Login</span>
        </button>
      </div>

      <p className="mt-8 text-[10px] text-white/50 tracking-wide">
        Created by <span className="font-bold italic">TechMart</span>
      </p>

    </motion.div>
  );
};

export default Register;