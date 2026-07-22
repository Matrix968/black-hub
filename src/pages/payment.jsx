import { useState, useEffect } from "react";
import PaystackPop from "@paystack/inline-js";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [fetchingTotal, setFetchingTotal] = useState(true);

  useEffect(() => {
    async function fetchPendingTotal() {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", auth.currentUser.uid),
          where("paymentStatus", "==", "Pending"),
        );
        const snap = await getDocs(q);
        const total = snap.docs.reduce(
          (sum, d) => sum + (d.data().total || 0),
          0,
        );
        setPendingTotal(total);
      } catch (err) {
        console.error("Error fetching pending total:", err);
      } finally {
        setFetchingTotal(false);
      }
    }
    fetchPendingTotal();
  }, []);

  async function payNow() {
    setLoading(true);

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", auth.currentUser.uid),
        where("paymentStatus", "==", "Pending"),
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        toast.error("No pending orders found.");
        setLoading(false);
        return;
      }

      const amount = snap.docs.reduce(
        (sum, d) => sum + (d.data().total || 0),
        0,
      );

      const popup = new PaystackPop();

      popup.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: auth.currentUser.email,
        amount: amount * 100,

        onSuccess: async (transaction) => {
          for (const order of snap.docs) {
            await updateDoc(doc(db, "orders", order.id), {
              paymentStatus: "Paid",
              status: "Paid",
              paymentReference: transaction.reference,
              paidAt: new Date(),
            });
          }

          toast.success("Payment Successful!");
          navigate("/dashboard");
        },

        onCancel: () => {
          toast.error("Payment Cancelled");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment Initialization Failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col justify-center items-center p-6 relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6 lg:left-12">
        <button
          onClick={() => navigate("/checkout")}
          className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition bg-gray-900/60 border border-gray-800 px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back To Checkout</span>
        </button>
      </div>

      <div className="bg-gray-900/30 border border-gray-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 w-full max-w-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-yellow-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Secure Payment
          </h1>
          <p className="text-xs text-gray-400">
            Complete your transaction securely via Paystack gateway.
          </p>
        </div>

        {/* Amount Box */}
        <div className="bg-black border border-gray-800 p-5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            Total Amount Due
          </span>
          <div className="text-3xl font-black font-mono text-yellow-400">
            {fetchingTotal ? (
              <span className="text-sm text-gray-500 animate-pulse">
                Calculating...
              </span>
            ) : (
              `₦${pendingTotal.toLocaleString()}`
            )}
          </div>
        </div>

        <button
          onClick={payNow}
          disabled={loading || fetchingTotal}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Gateway...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay with Paystack
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest pt-2">
          <Lock className="w-3 h-3 text-yellow-400" />
          <span>256-Bit Encrypted Payment Node</span>
        </div>
      </div>
    </div>
  );
}
