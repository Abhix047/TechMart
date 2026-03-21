import { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Search, 
  ExternalLink,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders");
        setOrders(data);
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    if (!window.confirm("Mark this order as delivered?")) return;
    try {
      await API.put(`/orders/${id}/deliver`);
      setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true, isShipped: true, isConfirmed: true } : o));
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const confirmHandler = async (id) => {
    if (!window.confirm("Mark this order as confirmed?")) return;
    try {
      await API.put(`/orders/${id}/confirm`);
      setOrders(orders.map(o => o._id === id ? { ...o, isConfirmed: true } : o));
      toast.success("Order marked as confirmed");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const shipHandler = async (id) => {
    if (!window.confirm("Mark this order as shipped?")) return;
    try {
      await API.put(`/orders/${id}/ship`);
      setOrders(orders.map(o => o._id === id ? { ...o, isShipped: true, isConfirmed: true } : o));
      toast.success("Order marked as shipped");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f0fdf4]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    /* Background: Minimal Light Green to Sky Blue Gradient */
    <div className="pt-24 pb-10 px-4 md:px-8 min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f0f9ff] to-[#e0f2fe] relative overflow-hidden">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Package className="text-blue-600" /> Orders
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Track and manage customer shipments and payments.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Order ID or Name..." 
              className="pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Transparent Glass Blur Table Container */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/30 border-b border-white/20 text-xs uppercase font-bold text-gray-600 tracking-wider">
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Shipment</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-white/40 transition-all group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-blue-700 bg-blue-100/50 backdrop-blur-sm px-2 py-1 rounded border border-blue-200/50">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {order.user?.name || "Guest User"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-lg">₹{order.totalPrice}</div>
                    </td>

                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <div className="flex items-center gap-1.5 text-green-700 bg-green-100/50 backdrop-blur-sm px-2 py-1 rounded-full w-fit text-xs font-bold border border-green-200/50">
                          <CheckCircle2 size={14} /> Paid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-100/50 backdrop-blur-sm px-2 py-1 rounded-full w-fit text-xs font-bold border border-red-200/50">
                          <CreditCard size={14} /> Unpaid
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-100/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit text-[10px] font-black uppercase border border-indigo-200/50">
                          <Truck size={14} /> Delivered
                        </div>
                      ) : order.isShipped ? (
                         <div className="flex items-center gap-1.5 text-blue-700 bg-blue-100/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit text-[10px] font-black uppercase border border-blue-200/50">
                          <Truck size={14} /> Shipped
                        </div>
                      ) : order.isConfirmed ? (
                         <div className="flex items-center gap-1.5 text-amber-700 bg-amber-100/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit text-[10px] font-black uppercase border border-amber-200/50">
                          <CheckCircle2 size={14} /> Confirmed
                        </div>
                      ) : order.isCancelled ? (
                         <div className="flex items-center gap-1.5 text-red-700 bg-red-100/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit text-[10px] font-black uppercase border border-red-200/50">
                          <Clock size={14} /> Cancelled
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-700 bg-orange-100/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit text-[10px] font-black uppercase border border-orange-200/50">
                          <Clock size={14} /> Processing
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!order.isConfirmed && !order.isCancelled && (
                          <button
                            onClick={() => confirmHandler(order._id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95"
                          >
                            Confirm
                          </button>
                        )}
                        {!order.isShipped && !order.isCancelled && (
                          <button
                            onClick={() => shipHandler(order._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95"
                          >
                            Ship
                          </button>
                        )}
                        {!order.isDelivered && !order.isCancelled && (
                          <button
                            onClick={() => deliverHandler(order._id)}
                            className="bg-gray-900/90 hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95"
                          >
                            Deliver
                          </button>
                        )}
                        {order.isDelivered && (
                          <button className="text-gray-500 hover:text-blue-600 p-2 transition-colors">
                            <ExternalLink size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-20 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-gray-800 font-semibold">No orders found</h3>
              <p className="text-gray-500 text-sm">Koi order nahi mila.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;