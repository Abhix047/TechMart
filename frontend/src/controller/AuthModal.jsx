import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Container — wide enough for split modal */}
        <div className="relative z-10 w-full max-w-[740px]">
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