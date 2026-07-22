import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Lucide React Icons
import {
  Package,
  ShoppingCart,
  Heart,
  ShoppingBag,
  Download,
  User,
  LogOut,
  Key,
  ShieldCheck,
  Truck,
  FileText,
  MessageSquare,
  Star,
  CheckCircle2,
  CreditCard,
  BadgeCheck,
  TrendingUp,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  // Calculated Metrics
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const totalSpent = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);

  useEffect(() => {
    let unsubscribeSnapshot = null;
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        navigate("/login");
        return;
      }

      setUserEmail(user.email || "");
      setUserName(user.displayName || user.email?.split("@")[0] || "Client");

      if (user.photoURL) {
        setUserAvatar(user.photoURL);
      }

      // Real-time listener for user profile document to capture Cloudinary image & custom name
      const userDocRef = doc(db, "users", user.uid);
      unsubscribeUserDoc = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            // Check all naming variations including 'photo' from profile update state
            const cloudinaryUrl =
              data.photo ||
              data.profileImage ||
              data.avatar ||
              data.photoURL ||
              data.image ||
              data.photoUrl ||
              data.profilePic ||
              data.url;

            if (cloudinaryUrl) {
              setUserAvatar(cloudinaryUrl);
            }

            if (data.name) {
              setUserName(data.name);
            }
          }
        },
        (err) => {
          console.error("Error listening to user profile doc:", err);
        },
      );

      // Set up real-time Firestore query for orders using orderDoc to avoid variable shadowing
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
      );

      unsubscribeSnapshot = onSnapshot(
        q,
        (snap) => {
          const data = snap.docs.map((orderDoc) => ({
            id: orderDoc.id,
            ...orderDoc.data(),
          }));
          setOrders(data);
          setLoading(false);
        },
        (err) => {
          console.error("Error connecting to order stream:", err);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm("Disconnect from Black Hub Terminal?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  // Safe Timestamp Formatter
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    };
    return (
      <span
        className={`px-3 py-1 text-xs rounded-full font-mono font-bold tracking-wider uppercase border ${
          styles[status] || styles.Pending
        }`}
      >
        {status || "Pending"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono tracking-widest text-zinc-400 uppercase">
          Synchronizing Terminal Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black antialiased relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 blur-[180px] rounded-full -top-48 -left-32"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full bottom-0 right-0"></div>
        <div className="absolute w-[300px] h-[300px] bg-indigo-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2"></div>
      </div>

      {/* Floating System Notification */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/80 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
          <div>
            <h3 className="font-bold text-sm text-white">System Online</h3>
            <p className="text-xs text-zinc-400">Everything is synchronized.</p>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black tracking-tighter text-sm shadow-lg shadow-yellow-400/10">
              BH
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide uppercase">
                Black Hub
              </h2>
              <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                Client Access Terminal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs font-mono text-zinc-400 border border-zinc-800 rounded-xl px-3 py-1.5 bg-black/40">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-xl font-bold transition duration-200 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Dashboard Body */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* 1. Premium Profile Banner & Floating Statistics Wrapper */}
        <div className="relative space-y-6">
          {/* Premium Profile Banner */}
          <div className="rounded-[35px] overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-[2px] shadow-2xl">
            <div className="bg-black rounded-[33px] p-8 md:p-10 pb-16 md:pb-20">
              <div className="flex justify-between items-center flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  {/* Cloudinary Image Avatar Support with Fallback Initial */}
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl md:text-5xl font-black text-black shrink-0 shadow-xl shadow-yellow-500/10 border-2 border-yellow-400/30">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-full h-full object-cover"
                        onError={() => setUserAvatar("")}
                      />
                    ) : (
                      <span>
                        {userName ? userName.charAt(0).toUpperCase() : "C"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white capitalize">
                      {userName}
                    </h2>
                    <p className="text-zinc-400 mt-1 text-sm md:text-base font-mono">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-xl"
                  >
                    <span>Manage Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 px-4 md:px-8 relative z-20">
            <div className="backdrop-blur-xl bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-2xl">
              <h3 className="text-zinc-500 text-xs uppercase font-mono tracking-wider">
                Orders
              </h3>
              <p className="text-3xl md:text-4xl font-black mt-2 text-white">
                {orders.length}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-2xl">
              <h3 className="text-zinc-500 text-xs uppercase font-mono tracking-wider">
                Delivered
              </h3>
              <p className="text-3xl md:text-4xl font-black text-emerald-400 mt-2">
                {deliveredOrders}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-2xl">
              <h3 className="text-zinc-500 text-xs uppercase font-mono tracking-wider">
                Pending
              </h3>
              <p className="text-3xl md:text-4xl font-black text-yellow-400 mt-2">
                {pendingOrders}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-2xl">
              <h3 className="text-zinc-500 text-xs uppercase font-mono tracking-wider">
                Spent
              </h3>
              <p className="text-2xl md:text-3xl font-black text-cyan-400 mt-2 truncate">
                ₦{totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Actions */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-4 text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-yellow-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col items-center justify-center"
            >
              <ShoppingCart className="w-6 h-6 text-zinc-300 group-hover:scale-110 group-hover:text-yellow-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300">Shop</p>
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-rose-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col items-center justify-center"
            >
              <Heart className="w-6 h-6 text-zinc-300 group-hover:scale-110 group-hover:text-rose-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300">Wishlist</p>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-blue-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col items-center justify-center"
            >
              <ShoppingBag className="w-6 h-6 text-zinc-300 group-hover:scale-110 group-hover:text-blue-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300">Cart</p>
            </button>

            <button
              onClick={() => navigate("/downloads")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-emerald-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col items-center justify-center"
            >
              <Download className="w-6 h-6 text-zinc-300 group-hover:scale-110 group-hover:text-emerald-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300">Downloads</p>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-purple-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col items-center justify-center"
            >
              <User className="w-6 h-6 text-zinc-300 group-hover:scale-110 group-hover:text-purple-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300">Profile</p>
            </button>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-red-500 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col items-center justify-center"
            >
              <LogOut className="w-6 h-6 text-zinc-300 group-hover:scale-110 group-hover:text-rose-500 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300">Logout</p>
            </button>
          </div>
        </div>

        {/* Recent Order Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Recent Order Log
            </h2>
            <span className="text-xs font-mono text-zinc-500 uppercase">
              {orders.length} Total Instance(s)
            </span>
          </div>

          {orders.length === 0 ? (
            /* Upgraded Empty State */
            <div className="py-24 text-center bg-zinc-950/40 border border-zinc-800/80 rounded-3xl backdrop-blur-md">
              <div className="w-36 h-36 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-2xl shadow-yellow-400/20">
                <Package className="w-20 h-20 text-black" />
              </div>

              <h2 className="text-3xl md:text-4xl font-black mt-10 text-white">
                No Orders Yet
              </h2>

              <p className="text-zinc-500 mt-4 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Start shopping to unlock your order history, invoices,
                downloads, and live delivery tracking.
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="mt-8 px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-yellow-400/10"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Start Shopping</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 hover:border-zinc-700/60 transition duration-300"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-800/60">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {order.name || `Order #${order.id.slice(0, 8)}`}
                        </h3>
                        {renderStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 font-mono">
                        Reference:{" "}
                        <span className="text-zinc-400 select-all font-semibold">
                          {order.id}
                        </span>
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-widest">
                        Settled Amount
                      </p>
                      <h3 className="text-2xl font-black text-yellow-400 mt-0.5">
                        ₦{Number(order.total || 0).toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  {/* Order Metadata Specs */}
                  <div className="grid grid-cols-3 gap-3 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-zinc-500">
                        Order Date
                      </p>
                      <p className="text-zinc-200 font-medium mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-zinc-500">
                        Items
                      </p>
                      <p className="text-yellow-400 font-bold mt-0.5">
                        {order.items?.length || 0} Item(s)
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-zinc-500">
                        Payment
                      </p>
                      <p className="text-emerald-400 font-medium mt-0.5">
                        {order.paymentMethod || "Card"}
                      </p>
                    </div>
                  </div>

                  {/* Product Gallery */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-zinc-900/80 rounded-2xl p-4 flex gap-4 items-center border border-zinc-800"
                      >
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
                          }
                          alt={item.title || item.name || "Product Item"}
                          className="w-24 h-24 rounded-xl object-cover bg-zinc-800 shrink-0 border border-zinc-800"
                        />

                        <div className="flex-1">
                          <h3 className="font-bold text-white">
                            {item.title || item.name || "Product Item"}
                          </h3>

                          <p className="text-zinc-500 text-sm mt-0.5">
                            Qty: {item.quantity || 1}
                          </p>

                          <p className="text-yellow-400 font-black mt-2">
                            ₦{Number(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-8 bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800">
                    <h3 className="font-bold mb-4 text-white">Order Summary</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Items</span>
                        <span className="font-bold">
                          {order.items?.length || 0}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Shipping</span>
                        <span className="font-bold text-emerald-400">₦0</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Discount</span>
                        <span className="font-bold text-emerald-400">₦0</span>
                      </div>

                      <div className="border-t border-zinc-800 pt-4 flex justify-between text-xl font-black">
                        <span>Total</span>
                        <span className="text-yellow-400">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Tracker Card */}
                  <div className="mt-8 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 p-[1px]">
                    <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-6 md:p-8">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <p className="text-zinc-500 uppercase tracking-widest text-xs font-mono">
                            Live Delivery
                          </p>
                          <h2 className="text-3xl font-black mt-2 text-white">
                            {order.status || "Pending"}
                          </h2>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                          <Truck className="w-8 h-8 text-cyan-400 animate-pulse" />
                        </div>
                      </div>

                      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full transition-all duration-1000 rounded-full ${
                            order.status === "Pending"
                              ? "w-1/4 bg-yellow-400"
                              : order.status === "Cancelled"
                                ? "w-2/4 bg-rose-500"
                                : "w-full bg-emerald-500"
                          }`}
                        />
                      </div>

                      <div className="flex justify-between mt-5 text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 font-mono">
                        <span>Ordered</span>
                        <span>Packed</span>
                        <span>Shipping</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Payment Details Cards */}
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {/* Customer Info */}
                    <div className="bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800">
                      <h3 className="font-bold text-xl mb-5 flex items-center gap-2 text-white">
                        <User className="w-5 h-5 text-yellow-400" />
                        <span>Customer</span>
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-zinc-500 text-sm">Name</p>
                          <h4 className="font-medium text-white mt-0.5">
                            {userName}
                          </h4>
                        </div>

                        <div>
                          <p className="text-zinc-500 text-sm">Email</p>
                          <h4 className="font-medium text-white mt-0.5">
                            {userEmail}
                          </h4>
                        </div>

                        <div>
                          <p className="text-zinc-500 text-sm">Status</p>
                          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 mt-1 border border-emerald-500/30">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            <span>Verified Customer</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800">
                      <h3 className="font-bold text-xl mb-5 flex items-center gap-2 text-white">
                        <CreditCard className="w-5 h-5 text-yellow-400" />
                        <span>Payment</span>
                      </h3>

                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Method</span>
                          <span className="font-medium text-white">
                            {order.paymentMethod || "Card"}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Status</span>
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              order.paymentStatus === "Paid"
                                ? "text-emerald-400"
                                : "text-yellow-400"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {order.paymentStatus || "Paid"}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm pt-2 border-t border-zinc-800/80">
                          <span className="text-zinc-500">Amount</span>
                          <span className="font-black text-yellow-400">
                            ₦{Number(order.total || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secure Credential Release (For Delivered Items) */}
                  {order.status === "Delivered" && order.delivery && (
                    <div className="bg-gradient-to-br from-zinc-900/90 to-black rounded-2xl p-5 border border-emerald-500/30 space-y-3 relative overflow-hidden mt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-emerald-400 text-xs font-bold tracking-wider font-mono uppercase flex items-center gap-2">
                          <Key className="w-4 h-4 text-emerald-400" />
                          <span>Secure Credential Release</span>
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                          <span className="block text-[9px] text-zinc-500 uppercase">
                            Username / Email
                          </span>
                          <span className="text-zinc-200 font-bold select-all break-all">
                            {order.delivery.email || "N/A"}
                          </span>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                          <span className="block text-[9px] text-zinc-500 uppercase">
                            Password
                          </span>
                          <span className="text-zinc-200 font-bold select-all break-all">
                            {order.delivery.password || "N/A"}
                          </span>
                        </div>
                      </div>
                      {order.delivery.notes && (
                        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-400 leading-relaxed font-sans">
                          <span className="block font-mono text-[9px] text-zinc-500 uppercase mb-1">
                            Notes / Instructions
                          </span>
                          {order.delivery.notes}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Premium Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="px-6 py-4 rounded-2xl bg-yellow-400 text-black font-bold hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Order</span>
                    </button>

                    <button
                      onClick={() =>
                        alert(`Downloading invoice for ${order.id}`)
                      }
                      className="px-6 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Invoice</span>
                    </button>

                    <button
                      onClick={() =>
                        alert(`Opening support desk for ${order.id}`)
                      }
                      className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact Support</span>
                    </button>

                    {order.status === "Delivered" && (
                      <button
                        onClick={() =>
                          alert(`Review form opened for ${order.id}`)
                        }
                        className="px-6 py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        <span>Leave Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6 pt-4 pb-12">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-400/5 border border-yellow-500/20 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-mono">
                  Membership Tier
                </p>
                <h3 className="text-xl font-black text-yellow-400 mt-1">
                  Black Elite
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You have unlocked priority dispatch and exclusive terminal access
              privileges.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-400/5 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-mono">
                  Success Rate
                </p>
                <h3 className="text-xl font-black text-cyan-400 mt-1">
                  {orders.length > 0
                    ? Math.round((deliveredOrders / orders.length) * 100)
                    : 0}
                  %
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ratio of successfully fulfilled orders across your history log.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-400/5 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-mono">
                  Encryption Status
                </p>
                <h3 className="text-xl font-black text-emerald-400 mt-1">
                  Secure (256-bit)
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your session and active transactions are end-to-end encrypted.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
