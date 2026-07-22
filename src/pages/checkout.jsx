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
  CreditCard,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Tag,
  ShoppingBag,
  AlertCircle,
  Check,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    email: auth.currentUser?.email || "",
    phone: "",
  });

  // Rotating loading messages for elite wait-time UX (Point 11)
  const loadingMessages = [
    "Verifying inventory manifest...",
    "Establishing cryptographic escrow...",
    "Securing payment pipeline...",
    "Routing to gateway...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handle Promo Code Application (Point 6)
  function handleApplyPromo() {
    if (!promoCode.trim()) {
      toast.error("Please enter a valid promo code.");
      return;
    }
    if (
      promoCode.toUpperCase() === "BLACKHUB10" ||
      promoCode.toUpperCase() === "WELCOME"
    ) {
      const discountAmount = total * 0.1; // 10% discount
      setDiscount(discountAmount);
      setAppliedPromo(true);
      toast.success("Promo code applied successfully! 10% off.");
    } else {
      toast.error("Invalid or expired promo code.");
    }
  }

  const finalTotal = Math.max(0, total - discount);

  function handleInitiateOrder() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      toast.error("Please fill in your Name and Phone Number.");
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

    // Trigger Confirmation Modal before final write (Point 10)
    setShowConfirmModal(true);
  }

  async function executeOrderPlacement() {
    setShowConfirmModal(false);
    setLoading(true);

    const currentUserId = auth.currentUser?.uid;

    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUserId,
        email: auth.currentUser.email,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: cart,
        subtotal: total,
        discount,
        total: finalTotal,
        status: "Pending",
        paymentStatus: "Pending",
        createdAt: serverTimestamp(),
      });

      clearCart();
      toast.success("Order authorized successfully!");
      navigate("/payment");
    } catch (err) {
      console.error("Firestore error: ", err);
      toast.error("Database connection failure. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // 7. Better Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-zinc-900 p-10 rounded-3xl max-w-md w-full space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 rounded-3xl flex items-center justify-center mx-auto text-yellow-400">
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
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-yellow-400/10 cursor-pointer"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased p-6 lg:p-12 relative selection:bg-yellow-400 selection:text-black">
      {/* 11. Advanced Rotating Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-[0_0_50px_rgba(234,179,8,0.15)] space-y-5"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Processing Order...
                </h3>
                <motion.p
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-yellow-400 font-mono h-6 flex items-center justify-center"
                >
                  {loadingMessages[loadingMsgIdx]}
                </motion.p>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full w-3/4 animate-pulse"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10. Confirmation Modal */}
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
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 text-yellow-400">
                <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Confirm Purchase?
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
                    <span className="font-mono text-yellow-400">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 font-mono text-xs">
                <span className="text-zinc-400 uppercase font-bold">
                  Total Capital
                </span>
                <span className="text-lg font-black text-yellow-400">
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
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-3.5 rounded-2xl text-xs font-bold uppercase transition cursor-pointer shadow-lg shadow-yellow-400/10"
                >
                  Continue & Pay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header Metadata */}
        <div className="mb-8 border-b border-zinc-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] font-mono tracking-widest uppercase font-bold">
                Encrypted Secure Gateway
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Order Authorization
            </h1>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="group flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return To Cart</span>
          </button>
        </div>

        {/* 1. Checkout Progress Indicator */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/20">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 hidden sm:inline">
                Cart
              </span>
            </div>

            <div className="w-12 sm:w-20 h-[2px] bg-emerald-500"></div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xs shadow-lg shadow-yellow-400/25">
                2
              </div>
              <span className="text-xs font-mono font-bold text-yellow-400 hidden sm:inline">
                Checkout
              </span>
            </div>

            <div className="w-12 sm:w-20 h-[2px] bg-zinc-800"></div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Payment
              </span>
            </div>

            <div className="w-12 sm:w-20 h-[2px] bg-zinc-800"></div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Structural Core Workspace Split */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* User Metrics Registry (7 Columns wide) */}
          <div className="lg:col-span-7 bg-zinc-950/60 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-400" />
                Customer Destination Matrix
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Provide accurate contact information for prompt delivery and
                dispatch verification.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-2 tracking-wider">
                  Full Name / Entity ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Chidi Okoro"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-xs outline-none transition text-white placeholder-zinc-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2 tracking-wider">
                  Verified Account Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={customer.email}
                    readOnly
                    className="w-full bg-zinc-950 border border-zinc-900 pl-11 pr-4 py-3.5 rounded-xl text-xs outline-none text-zinc-500 cursor-not-allowed font-mono select-none"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5 font-mono">
                  Linked securely via Firebase Authentication session.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-2 tracking-wider">
                  Communications Link (Phone Number)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-xs outline-none transition text-white placeholder-zinc-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Security Trust Badges */}
            <div className="pt-6 border-t border-zinc-900 space-y-3">
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-bit SSL Cryptographic Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Secure PCI-DSS Compliant Payment Gateway</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>30-Day Instant Account Replacement Guarantee</span>
              </div>
            </div>
          </div>

          {/* Checkout Ledger Column (5 Columns wide) */}
          <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 sm:p-8 backdrop-blur-sm sticky top-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-bold">
                Manifest Directory
              </h2>
              <span className="text-xs font-mono bg-yellow-400/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-400/20 font-bold">
                {cart.length} {cart.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* 9. Animate Cart Items with Framer Motion & 2. Product Images */}
            <div className="max-h-60 overflow-y-auto pr-1 divide-y divide-zinc-900 custom-scrollbar space-y-3">
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
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-900"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-200 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Qty: {item.quantity} × ₦
                        {Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-yellow-400 whitespace-nowrap">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* 6. Coupon / Promo Code Box */}
            <div className="pt-2 border-t border-zinc-900">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Tag className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Promo Code (e.g. BLACKHUB10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={appliedPromo}
                    className="w-full bg-black border border-zinc-800 focus:border-yellow-400 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none uppercase font-mono text-white placeholder-zinc-600 disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={appliedPromo || !promoCode.trim()}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-mono font-bold border border-zinc-800 transition cursor-pointer disabled:opacity-40"
                >
                  {appliedPromo ? "Applied" : "Apply"}
                </button>
              </div>
            </div>

            {/* 5. Detailed Order Summary */}
            <div className="border-t border-zinc-900 pt-5 space-y-4">
              <div className="space-y-2 text-xs font-mono text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal Assets</span>
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
                <div className="flex justify-between">
                  <span>Service & Escrow Fee</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    FREE
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline bg-black/60 p-4 rounded-2xl border border-zinc-900">
                <span className="text-xs font-bold uppercase text-zinc-400 font-mono">
                  Total Capital
                </span>
                <span className="text-2xl font-black text-yellow-400 font-mono tracking-tight">
                  ₦{finalTotal.toLocaleString()}
                </span>
              </div>

              {/* 8. Payment Trust Logos (Paystack, Flutterwave, Visa, Mastercard, Bank Transfer) */}
              <div className="pt-2">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 text-center">
                  Accepted Payment Rails & Gateways
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-zinc-900">
                  <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                    Paystack
                  </span>
                  <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                    Flutterwave
                  </span>
                  <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                    Visa
                  </span>
                  <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                    Mastercard
                  </span>
                  <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                    Bank Transfer
                  </span>
                </div>
              </div>

              <button
                onClick={handleInitiateOrder}
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Execute Payment Pipeline
              </button>
            </div>

            {/* 3. Estimated Delivery Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-900 space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300">
                Estimated Delivery
              </h3>
              <p className="text-zinc-400 text-[11px] font-mono leading-relaxed">
                Immediately after successful payment verification. Usually
                dispatched within 30 seconds.
              </p>
            </div>

            <div className="text-center border-t border-zinc-900/40 pt-4">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Black Hub Enterprise Secure Node
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
