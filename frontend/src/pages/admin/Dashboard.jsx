import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: []
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get("/admin/dashboard");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    { 
      title: "Total Revenue", 
      value: `$${Number(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50" 
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders.toLocaleString(), 
      icon: ShoppingCart, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      title: "Total Products", 
      value: stats.totalProducts.toLocaleString(), 
      icon: Package, 
      color: "text-purple-500", 
      bg: "bg-purple-50" 
    },
    { 
      title: "Customers", 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center pt-20">
        <Loader2 size={40} className="text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-emerald-500" /> 
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here is what's happening with your store today.</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {item.title}
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      {item.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <Icon size={20} className={item.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart size={18} className="text-slate-400" />
              Recent Orders
            </h2>
            <Link 
              to="/admin/orders" 
              className="text-[13px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/80">
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* ORDER ID */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-mono font-semibold text-slate-600">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-bold text-slate-800">
                          {order.user?.name || "Guest User"}
                        </span>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-bold text-emerald-600">
                          ${Number(order.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold tracking-wide w-fit">
                            <CheckCircle2 size={12} />
                            Delivered
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-bold tracking-wide w-fit">
                            <Clock size={12} />
                            Pending
                          </div>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 text-sm">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;