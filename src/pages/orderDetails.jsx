import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Order record not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></span>
          Loading Order Manifest...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-gray-400 text-sm mt-1 mb-6">
          The requested transaction reference does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-900 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition bg-gray-900/60 border border-gray-800 px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return</span>
          </button>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
                order.status === "Paid" || order.status === "Delivered"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
              }`}
            >
              Status: {order.status || "Pending"}
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
              Payment: {order.paymentStatus || "Pending"}
            </span>
          </div>
        </div>

        {/* Title & Reference */}
        <div>
          <span className="text-xs font-mono text-yellow-400 tracking-widest uppercase">
            Transaction Manifest
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-1 font-mono">
            ID: {order.id}
          </h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Created:{" "}
            {order.createdAt?.seconds
              ? new Date(order.createdAt.seconds * 1000).toLocaleString()
              : "Just now"}
          </p>
        </div>

        {/* Grid Layout: Customer Info & Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details */}
          <div className="bg-gray-900/30 border border-gray-800/80 rounded-3xl p-6 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400 font-bold border-b border-gray-800 pb-3">
              Customer Registry
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <User className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="font-bold">
                  {order.customerName || order.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="font-mono text-xs truncate">
                  {order.customerEmail || order.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="font-mono text-xs">
                  {order.customerPhone || "N/A"}
                </span>
              </div>
            </div>

            {order.paymentReference && (
              <div className="pt-3 border-t border-gray-800 text-xs font-mono text-gray-500">
                <p className="text-[10px] uppercase text-gray-600 mb-1">
                  Gateway Ref
                </p>
                <span className="text-gray-300 break-all">
                  {order.paymentReference}
                </span>
              </div>
            )}
          </div>

          {/* Items Manifest (Span 2 columns) */}
          <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800/80 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400 font-bold border-b border-gray-800 pb-3 mb-4">
                Purchased Items Manifest ({order.items?.length || 0})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-black/40 border border-gray-800/60 p-3.5 rounded-2xl"
                  >
                    <div className="min-w-0 pr-4">
                      <h4 className="text-sm font-bold text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-mono font-bold text-yellow-400 whitespace-nowrap">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 mt-6 pt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-mono">
                  Aggregated Total
                </p>
                <h3 className="text-2xl font-black text-yellow-400 font-mono">
                  ₦{Number(order.total || 0).toLocaleString()}
                </h3>
              </div>

              {/* Status Action Buttons */}
              <div className="flex gap-2">
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus("Processing")}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Mark Processing
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus("Delivered")}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
