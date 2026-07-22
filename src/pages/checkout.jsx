import { useState } from "react";
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
} from "lucide-react";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: auth.currentUser?.email || "",
    phone: "",
  });

  async function placeOrder() {
    // Input Validation Guard Clauses with professional toasts
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

    setLoading(true);

    try {
      // Complete order payload for admin analytics & tracking
      await addDoc(collection(db, "orders"), {
        userId: currentUserId,
        email: auth.currentUser.email,

        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,

        items: cart,
        total,

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

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased p-6 lg:p-12 relative">
      {/* Full-Screen Blur Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl space-y-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Processing Order...
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Securing transaction matrix and routing to gateway.
              </p>
            </div>
            <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Metadata */}
        <div className="mb-10 border-b border-gray-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] font-mono tracking-widest uppercase">
                Encrypted Secure Gateway
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Order Authorization
            </h1>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition bg-gray-900/60 border border-gray-800 px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return To Cart</span>
          </button>
        </div>

        {/* Structural Core Workspace Split */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* User Metrics Registry (3 Columns wide) */}
          <div className="lg:col-span-3 bg-gray-900/30 border border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-400" />
                Customer Destination Matrix
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Provide accurate contact information for prompt delivery and
                dispatch verification.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-2 tracking-wider">
                  Full Name / Entity ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Chidi Okoro"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition text-white placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-wider">
                  Verified Account Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={customer.email}
                    readOnly
                    className="w-full bg-zinc-950 border border-zinc-900 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none text-gray-500 cursor-not-allowed font-mono select-none"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5 font-mono">
                  Linked securely via Firebase Authentication session.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-2 tracking-wider">
                  Communications Link (Phone Number)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition text-white placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/60 flex items-center gap-3 text-gray-500 text-xs">
              <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>
                All personal data is encrypted and handled in compliance with
                privacy guidelines.
              </span>
            </div>
          </div>

          {/* Checkout Ledger Column (2 Columns wide) */}
          <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
              <h2 className="text-xs font-mono tracking-widest uppercase text-gray-400 font-bold">
                Manifest Directory
              </h2>
              <span className="text-xs font-mono bg-yellow-400/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-400/20">
                {cart.length} {cart.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Micro Scroll Container for Items */}
            <div className="max-h-56 overflow-y-auto pr-1 divide-y divide-gray-800/60 custom-scrollbar">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3.5 first:pt-0"
                >
                  <div className="min-w-0 pr-4">
                    <h4 className="text-sm font-bold text-gray-200 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      Qty: {item.quantity} × ₦
                      {Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-yellow-400 whitespace-nowrap">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Ledger Calculation Summary */}
            <div className="border-t border-gray-800 mt-6 pt-5 space-y-5">
              <div className="flex justify-between items-baseline bg-black/40 p-4 rounded-2xl border border-gray-800/60">
                <span className="text-xs font-bold uppercase text-gray-400 font-mono">
                  Total Capital
                </span>
                <span className="text-2xl font-black text-yellow-400 font-mono tracking-tight">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Execute Payment Pipeline
              </button>
            </div>

            <div className="mt-6 text-center border-t border-gray-800/40 pt-4">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
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
