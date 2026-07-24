import { useState, useEffect } from "react";
import PaystackPop from "@paystack/inline-js";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/cartContext";
import toast from "react-hot-toast";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Zap,
  Wallet,
  Banknote,
  Fingerprint,
  BadgeCheck,
  Clock,
  Truck,
  RotateCcw,
  Shield,
  Star,
  Users,
  TrendingUp,
  Gift,
  Crown,
  Check,
  X,
  AlertCircle,
  Send,
  Package,
  DollarSign,
  Percent,
  Calendar,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Extract checkout data passed via navigate state
  const { customer, cart, subtotal, discount, total } = location.state || {};

  const pendingTotal = total || 0;
  const itemCount = cart?.length || 0;

  // Safety guard: If someone hits /payment directly without passing checkout state, redirect them back
  useEffect(() => {
    if (!location.state || !cart || cart.length === 0) {
      toast.error("No active checkout session found.");
      navigate("/checkout", { replace: true });
    }
  }, [location.state, cart, navigate]);

  // Redirect after successful payment
  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [showSuccess, countdown, navigate]);

  async function payNow() {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      toast.error("Paystack public key is missing in environment variables.");
      return;
    }

    if (!auth.currentUser || !auth.currentUser.email) {
      toast.error("User session email not found. Please log in again.");
      return;
    }

    if (!pendingTotal || pendingTotal <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }

    setLoading(true);

    try {
      const popup = new PaystackPop();

      popup.newTransaction({
        key: publicKey,
        email: auth.currentUser.email,
        amount: Math.round(pendingTotal * 100), // Paystack requires amount in kobo
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customer?.name || "",
            },
            {
              display_name: "Items",
              variable_name: "items",
              value: cart?.map((item) => item.title).join(", ") || "",
            },
          ],
        },

        onSuccess: async (transaction) => {
          try {
            // Write order to Firestore AFTER successful payment
            await addDoc(collection(db, "orders"), {
              userId: auth.currentUser.uid,
              email: auth.currentUser.email,
              customerName: customer?.name || "",
              customerEmail: customer?.email || "",
              customerPhone: customer?.phone || "",
              items: cart || [],
              subtotal: subtotal || pendingTotal,
              discount: discount || 0,
              total: pendingTotal,
              paymentStatus: "Paid",
              status: "Pending",
              paymentReference: transaction.reference,
              paymentMethod: paymentMethod,
              createdAt: serverTimestamp(),
              paidAt: serverTimestamp(),
            });

            clearCart();
            setShowSuccess(true);
            toast.success("Payment Successful! Redirecting to dashboard...");
          } catch (dbErr) {
            console.error("Firestore order creation error:", dbErr);
            toast.error(
              "Payment received, but failed to save order record. Please contact support.",
            );
          } finally {
            setLoading(false);
          }
        },

        onClose: () => {
          toast("Payment window closed.", { icon: "ℹ️" });
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment Initialization Failed");
      setLoading(false);
    }
  }

  // Loading overlay
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-32 -right-32" />
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
          <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
        </div>

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-zinc-950/90 border border-amber-500/30 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl shadow-amber-500/10 space-y-5 relative z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full animate-ping" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-2xl shadow-amber-400/30">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-white tracking-tight">
              Processing Payment
            </h3>
            <p className="text-xs text-amber-400 font-mono animate-pulse">
              Please wait while we secure your transaction...
            </p>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-progress" />
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">
            Do not close or refresh this page
          </p>
        </motion.div>
      </div>
    );
  }

  // Success overlay
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full -top-32 -right-32" />
          <div className="absolute w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        </div>

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-zinc-950/90 border border-emerald-500/30 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl shadow-emerald-500/10 space-y-5 relative z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full animate-ping" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-2xl shadow-emerald-400/30">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Payment Successful! 🎉
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Your order has been confirmed and is being processed.
            </p>
          </div>
          <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Amount Paid</span>
              <span className="font-bold text-emerald-400">
                ₦{pendingTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2">
              <span className="text-zinc-500">Redirecting in</span>
              <span className="font-bold text-amber-400">{countdown}s</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono animate-pulse">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans antialiased p-4 sm:p-6 relative overflow-hidden selection:bg-yellow-400 selection:text-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32" />
        <div className="absolute w-[600px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 lg:left-12 z-20">
        <button
          onClick={() => navigate("/checkout")}
          className="group flex items-center gap-2 text-[10px] sm:text-xs font-mono text-gray-400 hover:text-white transition bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Checkout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-zinc-950/90 border border-amber-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-md shadow-2xl shadow-amber-500/5 space-y-6 hover:border-amber-500/40 transition-all duration-300">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              Secure Payment
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono">
              Complete your transaction securely via Paystack gateway.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-zinc-500 font-mono">Order Items</span>
              <span className="text-white font-bold">{itemCount} items</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-zinc-500 font-mono">Customer</span>
              <span className="text-white font-bold truncate max-w-[150px]">
                {customer?.name || "Guest"}
              </span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-zinc-500 font-mono">Email</span>
              <span className="text-white font-bold truncate max-w-[150px]">
                {auth.currentUser?.email || "N/A"}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[10px] sm:text-xs">
                <span className="text-zinc-500 font-mono">Discount</span>
                <span className="text-emerald-400 font-bold">
                  -₦{discount.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Amount Box */}
          <div className="bg-gradient-to-br from-zinc-900/80 to-black border border-amber-500/20 p-5 sm:p-6 rounded-2xl text-center space-y-1 shadow-lg shadow-amber-500/5">
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-500 uppercase flex items-center justify-center gap-2">
              <DollarSign className="w-3 h-3 text-amber-400" />
              Total Amount Due
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
              ₦{pendingTotal.toLocaleString()}
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-[8px] sm:text-[9px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Truck className="w-2.5 h-2.5 text-emerald-400" /> Instant
                Delivery
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-amber-400" /> 256-bit SSL
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest text-center">
              Payment Method
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: "paystack",
                  label: "Paystack",
                  icon: CreditCard,
                  color: "from-emerald-500 to-green-400",
                },
                {
                  id: "card",
                  label: "Card (Visa/MC)",
                  icon: CreditCard,
                  color: "from-blue-500 to-cyan-400",
                },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono ${
                    paymentMethod === method.id
                      ? `bg-gradient-to-r ${method.color} text-black border-transparent shadow-lg shadow-${method.id === "paystack" ? "emerald" : "blue"}-400/20`
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <method.icon className="w-3.5 h-3.5" />
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={payNow}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black py-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4" />
            Pay with Paystack ₦{pendingTotal.toLocaleString()}
          </button>

          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              256-Bit Encrypted
            </span>
            <span className="w-px h-4 bg-zinc-800" />
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3 text-emerald-400" />
              Biometric Auth
            </span>
            <span className="w-px h-4 bg-zinc-800" />
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-3 h-3 text-blue-400" />
              Verified Gateway
            </span>
          </div>

          {/* Trust Message */}
          <div className="text-center space-y-1 pt-2">
            <p className="text-[8px] sm:text-[9px] text-zinc-500 font-mono">
              Your payment is secure and encrypted. We never store your card
              details.
            </p>
            <p className="text-[7px] sm:text-[8px] text-zinc-600 font-mono">
              Powered by Paystack • Protected by 256-bit SSL Encryption
            </p>
          </div>
        </div>
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
      `}</style>
    </div>
  );
}
