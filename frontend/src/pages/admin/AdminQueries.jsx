import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Search, Clock, CheckCircle2,
  XCircle, Send, Trash2, ChevronRight, Inbox,
  RefreshCw, Filter
} from "lucide-react";
import { API_URL } from "../../config.js";
import toast from "react-hot-toast";

const ease = [0.22, 1, 0.36, 1];

const STATUS_CONFIG = {
  pending:  { label: "Pending",  icon: Clock,         cls: "bg-amber-50 text-amber-600 border-amber-200"   },
  replied:  { label: "Replied",  icon: CheckCircle2,  cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  closed:   { label: "Closed",   icon: XCircle,       cls: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

const TABS = [
  { id: "all",     label: "All",     count: null },
  { id: "pending", label: "Pending", count: null },
  { id: "replied", label: "Replied", count: null },
  { id: "closed",  label: "Closed",  count: null },
];

/* ── Query Detail Panel ── */
function QueryDetailPanel({ query, onClose, onReplied, onDeleted }) {
  const [reply, setReply] = useState(query.adminReply || "");
  const [status, setStatus] = useState(query.status);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) return toast.error("Reply cannot be empty");
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/queries/${query._id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ adminReply: reply, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Reply sent!");
      onReplied(data.query);
    } catch (err) {
      toast.error(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this query?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/queries/${query._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Query deleted");
      onDeleted(query._id);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const badge = STATUS_CONFIG[query.status] || STATUS_CONFIG.pending;
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3, ease }}
      className="flex flex-col h-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-black/[0.06]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full border ${badge.cls}`}>
              <BadgeIcon size={10} strokeWidth={2} /> {badge.label}
            </span>
          </div>
          <h2 className="text-[15px] font-semibold text-[#0f0f0f] truncate">{query.subject}</h2>
          <p className="text-[11.5px] text-black/40 mt-0.5">
            From{" "}<span className="font-medium text-black/55">{query.name}</span>
            {" "}·{" "}{query.email}
          </p>
          <p className="text-[10.5px] text-black/28 mt-0.5">
            {new Date(query.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <motion.button
            onClick={handleDelete}
            disabled={deleting}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} strokeWidth={1.5} /> Delete
          </motion.button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-[11.5px] font-medium text-black/40 hover:text-black/65 hover:bg-black/[0.04] transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        {/* User message */}
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-2">Customer Message</p>
          <div className="bg-[#f7f5f2] border border-black/[0.06] rounded-xl px-4 py-3.5">
            <p className="text-[13px] text-black/65 leading-relaxed whitespace-pre-wrap">{query.message}</p>
          </div>
        </div>

        {/* Previous reply if exists */}
        {query.adminReply && (
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-2">Previous Reply</p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3.5">
              <p className="text-[13px] text-emerald-800 leading-relaxed whitespace-pre-wrap">{query.adminReply}</p>
            </div>
          </div>
        )}

        {/* Reply textarea */}
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-2">
            {query.adminReply ? "Update Reply" : "Write Reply"}
          </p>
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Type your reply to the customer here…"
            rows={6}
            className="w-full bg-[#f7f5f2] border border-black/[0.08] rounded-xl text-[13px] text-[#0f0f0f] placeholder:text-black/28 outline-none resize-none px-4 py-3 hover:border-black/15 focus:border-black/25 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Status select */}
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-black/28 mb-2">Mark Status</p>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full bg-[#f7f5f2] border border-black/[0.08] rounded-xl text-[13px] text-[#0f0f0f] outline-none px-4 py-2.5 hover:border-black/15 focus:border-black/25 transition-all duration-200"
          >
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 border-t border-black/[0.06]">
        <motion.button
          onClick={handleSendReply}
          disabled={sending || !reply.trim()}
          whileTap={!sending ? { scale: 0.97 } : {}}
          className={`w-full py-3 rounded-xl text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            sending || !reply.trim()
              ? "bg-black/[0.05] text-black/25 cursor-not-allowed"
              : "bg-[#0f0f0f] text-white hover:bg-black/80"
          }`}
        >
          {sending ? (
            <>
              <motion.span className="w-4 h-4 border-[1.5px] border-white/20 border-t-white/70 rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
              Sending…
            </>
          ) : (
            <><Send size={13} strokeWidth={1.5} /> Send Reply</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN ADMIN QUERIES PAGE
══════════════════════════════════════════ */
export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const res = await fetch(`${API_URL}/api/queries${params}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQueries(data.queries);
    } catch (err) {
      toast.error(err.message || "Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueries(); }, [activeTab]);

  /* counts per status */
  const counts = {
    all: queries.length,
    pending: queries.filter(q => q.status === "pending").length,
    replied: queries.filter(q => q.status === "replied").length,
    closed:  queries.filter(q => q.status === "closed").length,
  };

  /* filtered by search */
  const filtered = queries.filter(q =>
    !search ||
    q.name.toLowerCase().includes(search.toLowerCase()) ||
    q.email.toLowerCase().includes(search.toLowerCase()) ||
    q.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleReplied = (updatedQuery) => {
    setQueries(prev => prev.map(q => q._id === updatedQuery._id ? updatedQuery : q));
    setSelected(updatedQuery);
  };

  const handleDeleted = (id) => {
    setQueries(prev => prev.filter(q => q._id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[#f7f5f2] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-black/[0.07] px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/28 mb-1">Support</p>
          <h1 className="text-[18px] font-semibold text-[#0f0f0f] leading-none">Customer Queries</h1>
        </div>
        <motion.button
          onClick={fetchQueries}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f7f5f2] border border-black/[0.07] text-[12px] font-medium text-black/45 hover:text-[#0f0f0f] hover:border-black/[0.15] transition-all"
        >
          <RefreshCw size={12} strokeWidth={1.5} className={loading ? "animate-spin" : ""} /> Refresh
        </motion.button>
      </div>

      {/* ── Tabs + Search ── */}
      <div className="bg-white border-b border-black/[0.06] px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {TABS.map(({ id, label }) => {
            const cnt = counts[id];
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSelected(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  activeTab === id
                    ? "bg-[#0f0f0f] text-white"
                    : "text-black/40 hover:text-[#0f0f0f] hover:bg-black/[0.04]"
                }`}
              >
                {label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === id ? "bg-white/20 text-white" : "bg-black/[0.06] text-black/35"
                }`}>{cnt}</span>
              </button>
            );
          })}
        </div>
        <div className="flex-1 min-w-[180px] max-w-xs relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/28" strokeWidth={1.5} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, subject…"
            className="w-full pl-8 pr-3 py-2 bg-[#f7f5f2] border border-black/[0.08] rounded-xl text-[12.5px] text-[#0f0f0f] placeholder:text-black/28 outline-none hover:border-black/15 focus:border-black/25 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ── Main content (list + detail panel) ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LIST */}
        <div className={`flex flex-col overflow-y-auto border-r border-black/[0.07] bg-white transition-all duration-300 ${selected ? "hidden lg:flex lg:w-[360px]" : "w-full lg:w-[360px]"}`}>
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-[80px] bg-[#f7f5f2] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 flex-1 py-16">
              <div className="w-12 h-12 rounded-full bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center">
                <Inbox size={18} className="text-black/25" strokeWidth={1.5} />
              </div>
              <p className="text-[13px] text-black/35">No queries found</p>
            </div>
          ) : (
            filtered.map(q => {
              const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.pending;
              const isActive = selected?._id === q._id;
              return (
                <button
                  key={q._id}
                  onClick={() => setSelected(q)}
                  className={`w-full text-left px-5 py-4 border-b border-black/[0.05] flex items-start gap-3 transition-colors ${
                    isActive ? "bg-[#f0ede8]" : "hover:bg-[#f7f5f2]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#0f0f0f] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-semibold text-white">
                      {q.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12.5px] font-semibold text-[#0f0f0f] truncate">{q.name}</p>
                      <span className={`shrink-0 text-[8.5px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-black/55 truncate mt-0.5">{q.subject}</p>
                    <p className="text-[10.5px] text-black/28 mt-0.5">
                      {new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <ChevronRight size={13} className="text-black/20 shrink-0 mt-1" />
                </button>
              );
            })
          )}
        </div>

        {/* DETAIL PANEL */}
        <div className={`flex-1 bg-white overflow-y-auto transition-all ${selected ? "flex" : "hidden lg:flex"} flex-col`}>
          <AnimatePresence mode="wait">
            {selected ? (
              <QueryDetailPanel
                key={selected._id}
                query={selected}
                onClose={() => setSelected(null)}
                onReplied={handleReplied}
                onDeleted={handleDeleted}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#f7f5f2] border border-black/[0.06] flex items-center justify-center">
                  <MessageSquare size={22} className="text-black/20" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium text-black/35">Select a query</p>
                  <p className="text-[12px] text-black/25 mt-1">Click any query from the list to view and reply</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
