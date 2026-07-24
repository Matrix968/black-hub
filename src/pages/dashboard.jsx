import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  CheckCircle2,
  CreditCard,
  BadgeCheck,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Clock,
  AlertCircle,
  ExternalLink,
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Gift,
  Zap,
  Crown,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  // Calculated Metrics
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing",
  ).length;
  const totalSpent = orders.reduce(
    (acc, o) => acc + Number(o.total || o.amountPaid || 0),
    0,
  );

  useEffect(() => {
    let unsubscribeSnapshot = null;
    let unsubscribeUserDoc = null;
    let unsubscribeWishlist = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        if (unsubscribeWishlist) unsubscribeWishlist();
        navigate("/login");
        return;
      }

      setUserEmail(user.email || "");
      setUserName(user.displayName || user.email?.split("@")[0] || "Client");

      if (user.photoURL) {
        setUserAvatar(user.photoURL);
      }

      // Real-time listener for user profile document
      const userDocRef = doc(db, "users", user.uid);
      unsubscribeUserDoc = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const cloudinaryUrl =
              data.photo ||
              data.profileImage ||
              data.avatar ||
              data.photoURL ||
              data.image ||
              data.photoUrl ||
              data.profilePic ||
              data.url;

            if (cloudinaryUrl) setUserAvatar(cloudinaryUrl);
            if (data.name) setUserName(data.name);
          }
        },
        (err) => console.error("Error listening to user profile doc:", err),
      );

      // Real-time listener for Wishlist count
      const wishlistQuery = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid),
      );
      unsubscribeWishlist = onSnapshot(
        wishlistQuery,
        (snap) => {
          setWishlistCount(snap.docs.length);
        },
        (err) => console.error("Error fetching wishlist count:", err),
      );

      // Real-time Firestore query for orders, sorted newest first
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
      );

      unsubscribeSnapshot = onSnapshot(
        q,
        (snap) => {
          const data = snap.docs
            .map((orderDoc) => ({
              id: orderDoc.id,
              ...orderDoc.data(),
            }))
            .sort((a, b) => {
              const aTime =
                a.createdAt?.seconds ||
                (typeof a.createdAt === "number" ? a.createdAt / 1000 : 0);
              const bTime =
                b.createdAt?.seconds ||
                (typeof b.createdAt === "number" ? b.createdAt / 1000 : 0);
              return bTime - aTime;
            });

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
      if (unsubscribeWishlist) unsubscribeWishlist();
    };
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm("Disconnect from Black Hub Terminal?")) {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
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
      Processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
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

  const renderPaymentBadge = (paymentStatus) => {
    const status = paymentStatus || "Pending";
    if (status === "Paid" || status === "success") {
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Paid
        </span>
      );
    }
    if (status === "Failed") {
      return (
        <span className="inline-flex items-center gap-1.5 text-rose-400 font-medium text-xs">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium text-xs">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono tracking-widest text-zinc-400 uppercase animate-pulse">
          Synchronizing Terminal Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-yellow-400 selection:text-black antialiased relative overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-48 -left-32 animate-pulse delay-1000" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Floating Status Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl px-4 sm:px-6 py-3 shadow-2xl shadow-amber-500/10 flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white">System Online</p>
            <p className="text-[8px] text-zinc-400 font-mono">
              Secure Node Connected
            </p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PREMIUM NAVIGATION HEADER                  */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 bg-[#050507]/90 backdrop-blur-2xl border-b border-amber-500/20 px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center font-black text-black tracking-tighter text-sm shadow-lg shadow-amber-400/20">
            BH
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide uppercase bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Black Hub
            </h2>
            <p className="text-[8px] font-mono tracking-widest text-amber-400/60 uppercase">
              Client Access Terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-mono text-zinc-400 border border-zinc-800 rounded-xl px-3 py-1.5 bg-black/40 truncate max-w-[150px]">
            {userEmail}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/30 px-3 sm:px-4 py-2 rounded-xl font-bold transition duration-200 cursor-pointer flex items-center gap-2 text-rose-400 hover:text-rose-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* PRIMARY DASHBOARD BODY                    */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-10 relative z-10">
        {/* ========================================== */}
        {/* PREMIUM PROFILE BANNER                    */}
        {/* ========================================== */}
        <div className="relative space-y-6">
          <div className="rounded-[35px] overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 p-[2px] shadow-2xl shadow-amber-500/20">
            <div className="bg-[#050507] rounded-[33px] p-6 sm:p-8 md:p-10 pb-12 md:pb-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-2xl sm:text-3xl md:text-5xl font-black text-black shrink-0 shadow-xl shadow-amber-500/20 border-2 border-amber-400/30">
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
                    <div className="absolute -bottom-1 -right-1 bg-emerald-400 rounded-full p-1 border-2 border-black">
                      <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white capitalize">
                      {userName}
                    </h2>
                    <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base font-mono">
                      {userEmail}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] text-amber-400 font-bold uppercase">
                        Premium Member
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 text-sm"
                >
                  <span>Manage Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 -mt-8 sm:-mt-10 px-3 sm:px-4 md:px-6 relative z-20">
            <div className="backdrop-blur-xl bg-zinc-950/90 border border-amber-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-amber-500/5 hover:border-amber-500/40 transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-3 h-3 text-amber-400" />
                <h3 className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Total Orders
                </h3>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white group-hover:text-amber-400 transition">
                {orders.length}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/90 border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-emerald-500/5 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <h3 className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Completed
                </h3>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 group-hover:scale-105 transition">
                {deliveredOrders}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/90 border border-amber-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-amber-500/5 hover:border-amber-500/40 transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <h3 className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Pending
                </h3>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-400 group-hover:scale-105 transition">
                {pendingOrders}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/90 border border-rose-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-rose-500/5 hover:border-rose-500/40 transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <h3 className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Wishlist
                </h3>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-400 group-hover:scale-105 transition">
                {wishlistCount}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/90 border border-cyan-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-cyan-500/5 hover:border-cyan-500/40 transition-all group col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-3 h-3 text-cyan-400" />
                <h3 className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Total Spent
                </h3>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-black text-cyan-400 group-hover:scale-105 transition truncate">
                ₦{totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* QUICK NAVIGATION ACTIONS                   */}
        {/* ========================================== */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/30 rounded-3xl p-6 backdrop-blur-sm transition-all duration-300 shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg font-black text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <ShoppingCart className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-amber-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-amber-400 transition">
                Shop
              </p>
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-rose-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <Heart className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-rose-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-rose-400 transition">
                Wishlist
              </p>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-blue-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-blue-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-blue-400 transition">
                Cart
              </p>
            </button>

            <button
              onClick={() => navigate("/downloads")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-emerald-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <Download className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-emerald-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-emerald-400 transition">
                Downloads
              </p>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-purple-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <User className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-purple-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-purple-400 transition">
                Profile
              </p>
            </button>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-rose-500 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <LogOut className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-rose-500 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-rose-500 transition">
                Sign Out
              </p>
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* ORDERS SECTION                            */}
        {/* ========================================== */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm space-y-6 transition-all duration-300 shadow-xl shadow-amber-500/5">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h2 className="text-xl font-black text-white">Order History</h2>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Real-time tracking of your purchases and software keys.
              </p>
            </div>
            {orders.length > 0 && (
              <span className="text-[10px] text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 sm:py-16 border border-dashed border-zinc-800 rounded-2xl">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium text-sm">
                No orders recorded yet.
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Start shopping to see your orders here.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black text-xs rounded-xl hover:from-amber-300 hover:to-yellow-300 transition shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                Browse Store
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="space-y-1.5 w-full md:w-auto">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        #{order.id.slice(0, 8)}
                      </span>
                      {renderStatusBadge(order.status)}
                    </div>
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {order.items?.map((i) => i.name || i.title).join(", ") ||
                        order.productName ||
                        "General Order"}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800">
                    <div className="text-right">
                      <p className="text-base sm:text-lg font-black text-white">
                        ₦
                        {Number(
                          order.total || order.amountPaid || 0,
                        ).toLocaleString()}
                      </p>
                      {renderPaymentBadge(order.paymentStatus)}
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition border border-zinc-700 hover:border-amber-500/30"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {orders.length > 5 && (
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 text-zinc-400 hover:text-amber-400 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <span>View All Orders ({orders.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* MEMBERSHIP / REWARDS SECTION              */}
        {/* ========================================== */}
        <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-amber-500/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30">
                <Gift className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Premium Rewards
                </h3>
                <p className="text-sm text-zinc-400 max-w-md">
                  Earn loyalty points on every purchase and unlock exclusive
                  discounts.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">Points:</span>
                    <span className="text-sm font-black text-amber-400">
                      1,250
                    </span>
                  </div>
                  <div className="w-px h-4 bg-zinc-800" />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">Tier:</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Gold
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/rewards")}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              <span>View Rewards</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
