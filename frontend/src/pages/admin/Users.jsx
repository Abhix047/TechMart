import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Search, Shield, User, X, Users as UsersIcon, ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";

const ease = [0.22, 1, 0.36, 1];

/* ── Delete modal ── */
function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div className="fixed inset-0 bg-black/25 backdrop-blur-[3px] z-[100]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }} onClick={onCancel} />
          <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
            <motion.div className="bg-white rounded-2xl p-7 w-full max-w-[380px] border border-black/[0.07]"
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                <Trash2 size={15} className="text-red-500" />
              </div>
              <h2 className="font-[family-name:'Cormorant_Garamond',serif] text-[22px] font-[500] text-[#0f0f0f] mb-2 leading-snug">
                Delete this user?
              </h2>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-medium text-[#0f0f0f] mb-1">{user.name}</p>
              <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/38 mb-7 truncate">{user.email}</p>
              <div className="flex gap-2.5">
                <button onClick={onCancel}
                  className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-medium text-black/50 border border-black/10 hover:bg-black/[0.025] transition-colors">
                  Cancel
                </button>
                <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl font-[family-name:'DM_Sans',sans-serif] text-[12.5px] font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════ MAIN ════════════════════ */
const Users = () => {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [activeTab,   setActiveTab]   = useState("all");
  const [deleteTarget,setDeleteTarget]= useState(null);

  useEffect(() => {
    API.get("/users")
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/users/${deleteTarget._id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      toast.success("User deleted.");
    } catch {
      toast.error("Failed to delete user.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchTab    = activeTab === "all" || u.role === activeTab;
    return matchSearch && matchTab;
  });

  const admins    = users.filter(u => u.role === "admin").length;
  const customers = users.filter(u => u.role !== "admin").length;

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <DeleteModal user={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 pt-10">

        {/* ══ HEADER ══ */}
        <motion.div
          className="flex items-end justify-between mb-8 pb-7 border-b border-black/[0.08] flex-wrap gap-5"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <div>
            <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.24em] text-black/28 mb-2.5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease }}>
              Admin · People
            </motion.p>
            <motion.h1 className="font-[family-name:'Cormorant_Garamond',serif] text-[clamp(30px,4vw,44px)] font-[400] text-[#0f0f0f] leading-none"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}>
              User <em className="italic font-[300]">Management</em>
            </motion.h1>
            <motion.p className="font-[family-name:'DM_Sans',sans-serif] text-[13px] text-black/40 mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease }}>
              {loading ? "Loading…" : `${filtered.length} of ${users.length} users`}
            </motion.p>
          </div>

          {/* Stats pills */}
          {!loading && (
            <motion.div className="flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease }}>
              <div className="bg-white border border-black/[0.07] rounded-2xl px-5 py-3 text-center">
                <p className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[400] text-[#0f0f0f] leading-none">{users.length}</p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30 mt-1">Total</p>
              </div>
              <div className="bg-white border border-black/[0.07] rounded-2xl px-5 py-3 text-center">
                <p className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[400] text-[#0f0f0f] leading-none">{admins}</p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30 mt-1">Admins</p>
              </div>
              <div className="bg-white border border-black/[0.07] rounded-2xl px-5 py-3 text-center">
                <p className="font-[family-name:'Cormorant_Garamond',serif] text-[28px] font-[400] text-[#0f0f0f] leading-none">{customers}</p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30 mt-1">Customers</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ══ TOOLBAR ══ */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24, ease }}
        >
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 pointer-events-none" strokeWidth={1.5} />
            <input type="text" placeholder="Search by name or email…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-60 bg-white border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none focus:border-black/22 transition-colors" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/28 hover:text-black/55 transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Tab filter */}
          <div className="flex items-center bg-white border border-black/[0.07] rounded-xl p-0.5 gap-0">
            {[
              { val: "all",      label: "All"       },
              { val: "admin",    label: "Admins"    },
              { val: "customer", label: "Customers" },
            ].map(tab => (
              <button key={tab.val} onClick={() => setActiveTab(tab.val)}
                className={`relative px-4 py-1.5 rounded-[10px] font-[family-name:'DM_Sans',sans-serif] text-[12px] font-medium transition-all duration-200 ${
                  activeTab === tab.val
                    ? "bg-[#0f0f0f] text-white"
                    : "text-black/42 hover:text-black/68"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ══ LOADING ══ */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div className="w-7 h-7 border-[1.5px] border-black/10 border-t-black/55 rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
          </div>
        )}

        {/* ══ TABLE ══ */}
        {!loading && (
          <motion.div
            className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease }}
          >
            {filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr className="border-b border-black/[0.06]">
                      {["User", "Email", "Role", ""].map((h, i) => (
                        <th key={i}
                          className={`px-6 py-3.5 font-[family-name:'DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30 ${i === 3 ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((user, i) => (
                        <motion.tr
                          key={user._id}
                          className="border-b border-black/[0.045] last:border-none hover:bg-[#f9f8f6] transition-colors duration-200 group"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.38, delay: 0.3 + i * 0.05, ease }}
                        >
                          {/* Name + avatar */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#f0ede8] border border-black/[0.06] flex items-center justify-center shrink-0">
                                <span className="font-[family-name:'DM_Sans',sans-serif] text-[13px] font-semibold text-black/48">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <p className="font-[family-name:'DM_Sans',sans-serif] text-[13.5px] font-medium text-[#0f0f0f]">
                                {user.name}
                              </p>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4">
                            <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/45 truncate max-w-[220px]">
                              {user.email}
                            </p>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            {user.role === "admin" ? (
                              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-semibold text-[#0f0f0f] bg-[#0f0f0f]/[0.06] border border-black/[0.08] px-2.5 py-1 rounded-full">
                                <Shield size={10} strokeWidth={1.8} /> Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-[family-name:'DM_Sans',sans-serif] text-[11px] font-medium text-black/42 bg-[#f7f5f2] border border-black/[0.06] px-2.5 py-1 rounded-full">
                                <User size={10} strokeWidth={1.5} /> Customer
                              </span>
                            )}
                          </td>

                          {/* Delete */}
                          <td className="px-6 py-4 text-right">
                            <motion.button
                              onClick={() => setDeleteTarget(user)}
                              className="w-8 h-8 flex items-center justify-center ml-auto text-black/28 hover:text-red-500 hover:bg-red-50 border border-black/[0.07] hover:border-red-200/60 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                              whileTap={{ scale: 0.9 }}
                              title="Delete user"
                            >
                              <Trash2 size={13} strokeWidth={1.5} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-11 h-11 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center mb-5">
                  <UsersIcon size={16} className="text-black/22" strokeWidth={1.5} />
                </div>
                <p className="font-[family-name:'Cormorant_Garamond',serif] italic text-[22px] font-[400] text-[#0f0f0f] mb-1.5">
                  No users found
                </p>
                <p className="font-[family-name:'DM_Sans',sans-serif] text-[12.5px] text-black/35">
                  {search ? "Try a different search term." : "No users registered yet."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <style>{`* { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
};

export default Users;