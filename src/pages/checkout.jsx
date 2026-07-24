import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  User,
  Phone,
  Mail,
  Tag,
  ShoppingBag,
  AlertCircle,
  Check,
  Star,
  Zap,
  MessageSquare,
  HelpCircle,
  Clock,
  X,
  Sparkles,
  CreditCard,
  Wallet,
  Banknote,
  Shield,
  Globe,
  Fingerprint,
  CheckCircle2,
  ArrowRight,
  Gift,
  Truck,
  Package,
  Crown,
  BadgeCheck,
  Timer,
  ShieldAlert,
  Store,
  Layers,
  Coins,
  Send,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(false);

  const [customer, setCustomer] = useState({
    name: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
    phone: "",
  });

  const [timeLeft, setTimeLeft] = useState(900);
  const [reservationExpired, setReservationExpired] = useState(false);

  const [activityIdx, setActivityIdx] = useState(0);
  const liveActivities = [
    {
      name: "Daniel K.",
      item: "Netflix Premium",
      time: "2 min ago",
      amount: "₦3,500",
    },
    {
      name: "Sarah M.",
      item: "Google Voice USA",
      time: "5 min ago",
      amount: "₦4,500",
    },
    {
      name: "Michael O.",
      item: "USDT Escrow Node",
      time: "8 min ago",
      amount: "₦50,000",
    },
    {
      name: "Amina B.",
      item: "Spotify Family",
      time: "11 min ago",
      amount: "₦2,800",
    },
    {
      name: "David E.",
      item: "NordVPN Elite",
      time: "14 min ago",
      amount: "₦12,000",
    },
  ];

  const [supportOpen, setSupportOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setReservationExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const activityTimer = setInterval(() => {
      setActivityIdx((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(activityTimer);
  }, [liveActivities.length]);

  const loadingMessages = [
    "Securing your transaction...",
    "Encrypting order details...",
    "Generating invoice...",
    "Preparing payment gateway...",
    "Finalizing checkout...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  function handleApplyPromo() {
    if (!promoCode.trim()) {
      toast.error("Please enter a valid promo code.");
      return;
    }
    if (
      promoCode.toUpperCase() === "BLACKHUB10" ||
      promoCode.toUpperCase() === "WELCOME" ||
      promoCode.toUpperCase() === "VIP2024"
    ) {
      const discountAmount = total * 0.1;
      setDiscount(discountAmount);
      setAppliedPromo(true);
      toast.success("🎉 Promo code applied! 10% discount added.");
    } else {
      toast.error("Invalid or expired promo code.");
    }
  }

  const finalTotal = Math.max(0, total - discount);

  function handleInitiateOrder() {
    if (reservationExpired) {
      toast.error("Cart reservation expired. Please refresh your cart.");
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim()) {
      toast.error("Please fill in your Name and Phone Number.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      toast.error("Authentication required. Please sign in again.");
      return;
    }
    setShowConfirmModal(true);
  }

  async function executeOrderPlacement() {
    setShowConfirmModal(false);
    setLoading(true);
    const currentUserId = auth.currentUser?.uid;

    try {
      // Save order to Firestore
      const orderData = {
        userId: currentUserId,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        items: cart,
        subtotal: total,
        discount: discount,
        total: finalTotal,
        status: "Pending",
        paymentMethod: paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      toast.success("Order placed successfully! Redirecting to payment...");

      navigate("/payment", {
        state: {
          customer,
          cart,
          subtotal: total,
          discount,
          total: finalTotal,
          paymentMethod,
          orderData,
        },
      });
    } catch (err) {
      console.error("Firestore error: ", err);
      toast.error("Database connection failure. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#050507] text-white font-sans p-6 lg:p-12 animate-pulse space-y-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-10 w-72 bg-zinc-900 rounded-2xl"></div>
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 bg-zinc-950 border border-zinc-900 rounded-3xl"></div>
            <div className="lg:col-span-5 h-[500px] bg-zinc-950 border border-zinc-900 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050507] text-white font-sans antialiased flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-32 -right-32" />
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950/90 border border-amber-500/20 p-10 rounded-3xl max-w-md w-full space-y-6 shadow-2xl shadow-amber-500/5 relative z-10"
        >
          <div className="w-20 h-20 bg-amber-400/10 border border-amber-400/20 rounded-3xl flex items-center justify-center mx-auto text-amber-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Your Cart Is Empty
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              You haven't added any digital assets or accounts to your manifest
              yet.
            </p>
          </div>
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-amber-400/20 cursor-pointer"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans antialiased p-4 sm:p-6 lg:p-12 relative selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32" />
        <div className="absolute w-[600px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-950/95 border border-amber-500/30 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl shadow-amber-500/10 space-y-5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full animate-ping" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-2xl shadow-amber-400/30">
                  <Loader2 className="w-8 h-8 text-black animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Processing Order...
                </h3>
                <motion.p
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-amber-400 font-mono h-6 flex items-center justify-center"
                >
                  {loadingMessages[loadingMsgIdx]}
                </motion.p>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-progress" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-amber-500/10 space-y-6"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Confirm Purchase
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Verify order details before executing payment.
                  </p>
                </div>
              </div>

              <div className="bg-black/60 border border-zinc-900 rounded-2xl p-4 space-y-3 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-zinc-300 font-medium truncate pr-2">
                      {item.title} (x{item.quantity})
                    </span>
                    <span className="font-mono text-amber-400">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 font-mono text-xs">
                <span className="text-zinc-400 uppercase font-bold">
                  Total Amount
                </span>
                <span className="text-xl font-black text-amber-400">
                  ₦{finalTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-3.5 rounded-2xl text-xs font-bold uppercase transition cursor-pointer border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeOrderPlacement}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-3.5 rounded-2xl text-xs font-bold uppercase transition cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  Continue & Pay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 border-b border-zinc-800/60 pb-4 sm:pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold">
                Encrypted Secure Gateway • 256-bit SSL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Checkout
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Complete your order with secure payment processing.
            </p>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="group flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 px-4 py-2.5 rounded-xl cursor-pointer hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return To Cart</span>
          </button>
        </div>

        {/* Reservation Timer */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between bg-zinc-950/80 border border-amber-500/20 p-4 rounded-2xl gap-3 shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                Cart Reservation
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              </p>
              <p className="text-[10px] text-zinc-400 font-mono">
                Complete your transaction before reservation expires.
              </p>
            </div>
          </div>
          <div
            className={`font-mono text-sm font-black px-4 py-2 bg-black/60 border rounded-xl ${
              reservationExpired
                ? "text-rose-400 border-rose-500/30"
                : "text-amber-400 border-amber-500/30"
            }`}
          >
            {reservationExpired ? "⚠️ Expired" : formattedTime}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 sm:mb-10 overflow-x-auto py-2 px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/20">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 hidden sm:inline">
                Cart
              </span>
            </div>

            <div className="w-8 sm:w-16 h-[2px] bg-emerald-500"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-black flex items-center justify-center font-black text-xs shadow-lg shadow-amber-400/25">
                2
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 hidden sm:inline">
                Checkout
              </span>
            </div>

            <div className="w-8 sm:w-16 h-[2px] bg-zinc-800"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-500 hidden sm:inline">
                Payment
              </span>
            </div>

            <div className="w-8 sm:w-16 h-[2px] bg-zinc-800"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-500 hidden sm:inline">
                Complete
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Info */}
            <div className="bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-3xl p-5 sm:p-6 md:p-8 space-y-6 backdrop-blur-sm shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Customer Information
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Provide accurate contact information for prompt delivery.
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 z-10">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder=" "
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="peer w-full bg-black/60 border border-zinc-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all duration-300 pl-11 pr-4 pt-5 pb-2 rounded-xl text-xs outline-none text-white font-mono"
                  />
                  <label className="absolute left-11 top-3 text-[11px] text-zinc-500 font-mono transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-amber-400 pointer-events-none">
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 z-10">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder=" "
                    value={customer.email}
                    readOnly
                    className="peer w-full bg-zinc-950/80 border border-zinc-900 pl-11 pr-4 pt-5 pb-2 rounded-xl text-xs outline-none text-zinc-500 cursor-not-allowed font-mono select-none"
                  />
                  <label className="absolute left-11 top-1.5 text-[10px] text-zinc-600 font-mono pointer-events-none">
                    Verified Email (Firebase Auth)
                  </label>
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 z-10">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder=" "
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="peer w-full bg-black/60 border border-zinc-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all duration-300 pl-11 pr-4 pt-5 pb-2 rounded-xl text-xs outline-none text-white font-mono"
                  />
                  <label className="absolute left-11 top-3 text-[11px] text-zinc-500 font-mono transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-amber-400 pointer-events-none">
                    Phone Number
                  </label>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider font-bold">
                    Avg Delivery
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  00:30
                </h2>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">
                  Dispatched via secure pipeline.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 sm:p-6 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl transition-all duration-300 space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  4.9
                </h2>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">
                  Based on 2,314 reviews
                </p>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-3xl p-4 sm:p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-white font-mono">
                      Live Transaction Feed
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activityIdx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[10px] sm:text-[11px] text-zinc-400 font-mono truncate"
                      >
                        ✓{" "}
                        <span className="text-amber-400 font-bold">
                          {liveActivities[activityIdx].name}
                        </span>{" "}
                        purchased{" "}
                        <span className="text-white font-bold">
                          {liveActivities[activityIdx].item}
                        </span>{" "}
                        <span className="text-zinc-500">
                          ({liveActivities[activityIdx].time})
                        </span>
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-black/60 px-2.5 py-1 rounded-xl border border-zinc-900 whitespace-nowrap">
                  ✓ Verified
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-3xl p-5 sm:p-6 md:p-8 space-y-4 backdrop-blur-sm shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <div>
                <h3 className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  Payment Method
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 font-mono mt-0.5">
                  Select your preferred payment rail.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "paystack",
                    label: "Paystack",
                    icon: CreditCard,
                    color:
                      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                  },
                  {
                    id: "card",
                    label: "Card (Visa/MC)",
                    icon: CreditCard,
                    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                  },
                  {
                    id: "transfer",
                    label: "Bank Transfer",
                    icon: Banknote,
                    color:
                      "bg-purple-500/20 text-purple-400 border-purple-500/30",
                  },
                  {
                    id: "wallet",
                    label: "USSD Gateway",
                    icon: Wallet,
                    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                  },
                  {
                    id: "apple",
                    label: "Apple Pay",
                    icon: Shield,
                    color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
                  },
                  {
                    id: "google",
                    label: "Google Pay",
                    icon: Globe,
                    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2 text-xs font-mono ${
                      paymentMethod === method.id
                        ? `${method.color} border shadow-lg`
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    <method.icon className="w-4 h-4" />
                    <span className="truncate">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 mt-0.5 flex-shrink-0 ${
                  termsAccepted
                    ? "bg-amber-400 border-amber-400"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {termsAccepted && <Check className="w-3.5 h-3.5 text-black" />}
              </button>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-mono leading-relaxed">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-amber-400 hover:text-amber-300 transition"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-amber-400 hover:text-amber-300 transition"
                >
                  Privacy Policy
                </a>
                . I understand that this is a secure transaction.
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-zinc-950/90 border border-amber-500/20 rounded-3xl p-5 sm:p-6 md:p-8 backdrop-blur-sm shadow-xl space-y-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
                <h2 className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-bold flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Order Summary
                </h2>
                <span className="text-xs font-mono bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-400/20 font-bold">
                  {cart.length} {cart.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Cart Items */}
              <div className="max-h-56 overflow-y-auto pr-1 divide-y divide-zinc-800/50 space-y-3 custom-scrollbar">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="flex items-center justify-between py-3.5 first:pt-0 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          item.image ||
                          item.images?.[0] ||
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                        }
                        alt={item.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-900"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[11px] sm:text-xs font-bold text-zinc-200 truncate">
                          {item.title}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono mt-0.5">
                          Qty: {item.quantity} × ₦
                          {Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400 whitespace-nowrap">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="pt-2 border-t border-zinc-800/60">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Tag className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={appliedPromo}
                      className="w-full bg-black/60 border border-zinc-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all duration-300 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none uppercase font-mono text-white placeholder-zinc-600 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={appliedPromo || !promoCode.trim()}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-mono font-bold border border-zinc-800 transition cursor-pointer disabled:opacity-40"
                  >
                    {appliedPromo ? "✓ Applied" : "Apply"}
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-zinc-800/60 pt-5 space-y-4">
                <div className="space-y-2 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-mono">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount (10%)</span>
                      <span className="font-mono">
                        -₦{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-zinc-800/60">
                    <span className="uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      ₦{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInitiateOrder}
                  disabled={
                    reservationExpired || cart.length === 0 || !termsAccepted
                  }
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay ₦{finalTotal.toLocaleString()}</span>
                </button>
              </div>

              {/* Security Badges */}
              <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-around gap-3 text-zinc-500 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                  <span>Biometric Auth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {supportOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-16 right-0 bg-zinc-950/95 border border-amber-500/30 rounded-2xl p-5 w-80 shadow-2xl shadow-amber-500/10 space-y-4 mb-2"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    Live Support
                  </span>
                </div>
                <button
                  onClick={() => setSupportOpen(false)}
                  className="text-zinc-500 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                Need immediate assistance? Our support team is online and ready
                to help.
              </p>
              <a
                href="https://t.me/support"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 hover:border-amber-500/30 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Telegram Chat</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setSupportOpen(!supportOpen)}
          className="w-12 h-12 bg-zinc-950/90 border border-zinc-800 hover:border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-400 shadow-xl transition cursor-pointer hover:scale-105 hover:shadow-amber-500/20"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
