import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/authContext";
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  CreditCard,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Star,
  Zap,
  Sparkles,
  ShieldCheck,
  FileText,
  Copy,
  ExternalLink,
  Loader2,
  Inbox,
  MessageCircle,
  HelpCircle,
  ArrowLeft,
  Check,
  Ban,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  };

  const icons = {
    Completed: <CheckCircle className="w-3 h-3" />,
    Delivered: <Truck className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Processing: <Loader2 className="w-3 h-3 animate-spin" />,
    Cancelled: <X className="w-3 h-3" />,
    Paid: <CheckCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] rounded-full font-mono font-bold tracking-wide inline-flex items-center gap-1.5 border ${
        styles[status] || styles.Pending
      }`}
    >
      {icons[status] || icons.Pending}
      {status || "Pending"}
    </span>
  );
};

// Payment Status Badge
const PaymentBadge = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Failed: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold border ${
        styles[status] || styles.Pending
      }`}
    >
      {status || "Pending"}
    </span>
  );
};

// Order Progress Tracker
const OrderProgress = ({ status }) => {
  const steps = [
    { label: "Ordered", status: "ordered" },
    { label: "Paid", status: "paid" },
    { label: "Processing", status: "processing" },
    { label: "Completed", status: "completed" },
  ];

  const getStepStatus = (step) => {
    const statusMap = {
      ordered: 0,
      paid: 1,
      processing: 2,
      completed: 3,
    };
    const currentIndex = statusMap[status.toLowerCase()] || 0;
    const stepIndex = statusMap[step];
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, idx) => {
        const stepStatus = getStepStatus(step.status);
        return (
          <div key={step.label} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                stepStatus === "completed"
                  ? "bg-emerald-500 text-white"
                  : stepStatus === "active"
                  ? "bg-amber-400 text-black ring-2 ring-amber-400/50"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {stepStatus === "completed" ? (
                <Check className="w-3 h-3" />
              ) : (
                idx + 1
              )}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  stepStatus === "completed" ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.orderStatus === "Completed" || o.orderStatus === "Delivered"
  ).length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending" || o.orderStatus === "Processing"
  ).length;
  const totalSpent = orders.reduce(
    (acc, o) => acc + (o.total || o.price || 0),
    0
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setOrders(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.title?.toLowerCase().includes(search.toLowerCase()) ||
      order.id?.toLowerCase().includes(search.toLowerCase()) ||
      order.transactionId?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || order.orderStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: "Cancelled",
        cancelledAt: new Date().toISOString(),
      });
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleDownload = (downloadLink) => {
    if (downloadLink) {
      window.open(downloadLink, "_blank");
      toast.success("Download started");
    } else {
      toast.error("No download link available");
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="h-10 w-48 bg-zinc-900 rounded-2xl animate-pulse" />
          <div className="h-12 bg-zinc-900 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32" />
        <div className="absolute w-[600px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
              My Orders
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Track and manage all your purchases
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-mono text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 hover:border-amber-500/30 transition">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-white mt-1">{totalOrders}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 hover:border-emerald-500/30 transition">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{completedOrders}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 hover:border-amber-500/30 transition">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingOrders}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 hover:border-amber-500/30 transition">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-black text-amber-400 mt-1">₦{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search orders by product, order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition placeholder:text-zinc-600"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["All", "Pending", "Processing", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                  filter === status
                    ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-black shadow-lg shadow-amber-400/20"
                    : "bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="bg-zinc-950/80 border border-dashed border-zinc-800 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto mt-8 space-y-4">
            <div className="inline-flex p-4 bg-zinc-900 rounded-2xl text-amber-400 border border-amber-500/20">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Orders Found</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                {search ? "No orders match your search criteria." : "You haven't placed any orders yet."}
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black rounded-xl text-xs transition shadow-lg shadow-amber-400/20"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Order Cards */
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                    <img
                      src={order.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"}
                      alt={order.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                          {order.title || "Product"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-zinc-500">
                            Order #{order.id?.slice(0, 8)}
                          </span>
                          {order.transactionId && (
                            <span className="text-[10px] font-mono text-zinc-500">
                              • TXN: {order.transactionId.slice(0, 8)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-amber-400">
                          ₦{Number(order.total || order.price || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-500">× {order.quantity || 1}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <StatusBadge status={order.orderStatus || "Pending"} />
                      <PaymentBadge status={order.paymentStatus || "Pending"} />
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {order.createdAt?.toLocaleDateString() || "N/A"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-800/50">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      
                      {order.downloadLink && order.orderStatus === "Completed" && (
                        <button
                          onClick={() => handleDownload(order.downloadLink)}
                          className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg text-xs font-bold text-amber-400 transition flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      )}

                      {(order.orderStatus === "Pending" || order.orderStatus === "Processing") && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-xs font-bold text-rose-400 transition flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Progress - only show for active orders */}
                {(order.orderStatus !== "Completed" && order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered") && (
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <OrderProgress status={order.orderStatus || "Pending"} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* ORDER DETAIL MODAL                         */}
      {/* ========================================== */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950/95 border border-amber-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl shadow-amber-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">Order Details</h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Order #{selectedOrder.id?.slice(0, 8)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-6">
                <img
                  src={selectedOrder.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"}
                  alt={selectedOrder.title}
                  className="w-20 h-20 rounded-xl object-cover border border-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white">{selectedOrder.title}</h3>
                  <p className="text-xs text-zinc-400 font-mono">Qty: {selectedOrder.quantity || 1}</p>
                  <p className="text-lg font-black text-amber-400 mt-1">
                    ₦{Number(selectedOrder.total || selectedOrder.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Order Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.orderStatus || "Pending"} />
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Payment Status</p>
                  <div className="mt-1">
                    <PaymentBadge status={selectedOrder.paymentStatus || "Pending"} />
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Transaction ID</p>
                  <p className="text-xs font-mono text-white truncate">
                    {selectedOrder.transactionId || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Date</p>
                  <p className="text-xs font-mono text-white">
                    {selectedOrder.createdAt?.toLocaleDateString() || "N/A"}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {selectedOrder.orderStatus !== "Cancelled" && (
                <div className="mb-6">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-3">Order Timeline</p>
                  <OrderProgress status={selectedOrder.orderStatus || "Pending"} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800/50">
                {selectedOrder.downloadLink && selectedOrder.orderStatus === "Completed" && (
                  <button
                    onClick={() => handleDownload(selectedOrder.downloadLink)}
                    className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black rounded-xl text-xs transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    navigate("/shop");
                  }}
                  className="flex-1 min-w-[120px] px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Shop More
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    // Open support chat
                  }}
                  className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" /> Support
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}