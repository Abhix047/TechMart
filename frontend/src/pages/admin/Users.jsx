import { useEffect, useState } from "react";
import API from "../../services/api";
import { Trash2, Search, Filter, MoreVertical, UserPlus, Mail, Shield, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter Logic
  useEffect(() => {
    let result = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTab !== "all") {
      result = result.filter(user => user.role === activeTab);
    }

    setFilteredUsers(result);
  }, [searchTerm, activeTab, users]);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    /* 1. Yahan pt-24 (Padding Top) add kiya hai taaki Navbar ke liye space ban jaye */
    <div className="pt-24 pb-10 px-4 md:px-8 bg-[#F9FAFB] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            {/* 2. Heading ko thoda aur clean kiya */}
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tech Mart ke saare users aur permissions yahan se control karein.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95">
            <UserPlus size={20} />
            <span className="font-semibold">Add New User</span>
          </button>
        </div>

        {/* Stats & Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Users</p>
              <h3 className="text-2xl font-black text-gray-800">{users.length}</h3>
           </div>
           {/* Add more stats cards if needed */}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 items-center bg-gray-50/50">
            <div className="flex bg-white border border-gray-200 rounded-lg px-3 py-2 w-full md:w-80 focus-within:ring-2 ring-blue-100 transition-all">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              {['all', 'admin', 'customer'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role & Access</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-blue-50/30 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 leading-none mt-1">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md w-fit text-xs font-bold ring-1 ring-indigo-100">
                          <Shield size={14} /> ADMIN
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md w-fit text-xs font-bold ring-1 ring-gray-100">
                          <User size={14} /> CUSTOMER
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={() => deleteHandler(user._id)}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={30} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-semibold">No users found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;