import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = ({ isOpen, onClose }) => {
  // Yeh state decide karegi ki konsa component render karna hai
  const [activeTab, setActiveTab] = useState("login"); 

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        
        {/* 1. DARK BLUR BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* 2. CARD CONTAINER */}
        <div className="relative z-10 w-full max-w-[420px]">
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <Login 
                key="login" 
                onSwitch={() => setActiveTab("register")} 
                onClose={onClose} 
              />
            ) : (
              <Register 
                key="register" 
                onSwitch={() => setActiveTab("login")} 
                onClose={onClose} 
              />
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;