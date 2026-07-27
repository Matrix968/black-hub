import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  Printer,
  Eye,
  Home,
  MessageSquare,
  Flag,
  X,
  Send,
  HelpCircle,
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
  const [viewingOrder, setViewingOrder] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);

  // Report Issue State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportOrder, setReportOrder] = useState(null);
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState("general");
  const [submittingReport, setSubmittingReport] = useState(false);

  // Message Admin State
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageOrder, setMessageOrder] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [submittingMessage, setSubmittingMessage] = useState(false);

  // Calculated Metrics
  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Completed",
  ).length;
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Format Date
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

  // Format Date for PDF
  const formatDateForPDF = (timestamp) => {
    if (!timestamp) return "N/A";
    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate PDF Invoice
  const generatePDF = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("BLACK HUB", 105, 25, { align: "center" });

    // Invoice Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("INVOICE", 105, 45, { align: "center" });

    // Order Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const orderId = `Order #${order.id?.slice(0, 8) || "N/A"}`;
    const customerName = order.customerName || order.userName || "Customer";
    const customerEmail = order.email || order.userEmail || "N/A";
    const orderDate = formatDateForPDF(order.createdAt);
    const paymentStatus = order.paymentStatus || "Pending";
    const orderStatus = order.status || "Pending";
    const totalAmount = Number(order.total || order.amountPaid || 0);

    // Customer Info
    let yPos = 60;
    doc.setFont("helvetica", "bold");
    doc.text("Order Information", 14, yPos);
    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${orderId}`, 14, yPos);
    yPos += 7;
    doc.text(`Date: ${orderDate}`, 14, yPos);
    yPos += 7;
    doc.text(`Customer: ${customerName}`, 14, yPos);
    yPos += 7;
    doc.text(`Email: ${customerEmail}`, 14, yPos);
    yPos += 7;
    doc.text(`Payment Status: ${paymentStatus}`, 14, yPos);
    yPos += 7;
    doc.text(`Order Status: ${orderStatus}`, 14, yPos);
    yPos += 10;

    // Items Table
    doc.setFont("helvetica", "bold");
    doc.text("Items", 14, yPos);
    yPos += 5;

    const items = order.items || [];
    const tableData = items.map((item) => [
      item.title || item.name || "Product",
      item.quantity || 1,
      `₦${Number(item.price || 0).toLocaleString()}`,
      `₦${Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}`,
    ]);

    doc.autoTable({
      startY: yPos,
      head: [["Item", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [245, 158, 11],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 20, align: "center" },
        2: { cellWidth: 30, align: "right" },
        3: { cellWidth: 30, align: "right" },
      },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Amount: ₦${totalAmount.toLocaleString()}`, 105, finalY, {
      align: "center",
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for shopping with Black Hub!", 105, 280, {
      align: "center",
    });
    doc.text("Visit us at: blackhub.io", 105, 285, { align: "center" });

    // Save PDF
    doc.save(`invoice_${order.id?.slice(0, 8) || "order"}.pdf`);
    toast.success("Invoice downloaded successfully!");
  };

  // ==========================================
  // REPORT ISSUE FUNCTIONS
  // ==========================================
  const handleReportIssue = (order) => {
    setReportOrder(order);
    setReportMessage("");
    setReportType("general");
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!reportMessage.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    setSubmittingReport(true);
    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        userId: user?.uid,
        userEmail: user?.email,
        orderId: reportOrder?.id,
        orderNumber: reportOrder?.id?.slice(0, 8),
        type: reportType,
        message: reportMessage.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success(
        "Report submitted successfully! Admin will review it soon.",
      );
      setShowReportModal(false);
      setReportMessage("");
      setReportType("general");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmittingReport(false);
    }
  };

  // ==========================================
  // MESSAGE ADMIN FUNCTIONS
  // ==========================================
  const handleMessageAdmin = (order) => {
    setMessageOrder(order);
    setAdminMessage("");
    setShowMessageModal(true);
  };

  const submitMessage = async () => {
    if (!adminMessage.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setSubmittingMessage(true);
    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "messages"), {
        userId: user?.uid,
        userEmail: user?.email,
        userName: userName,
        orderId: messageOrder?.id,
        orderNumber: messageOrder?.id?.slice(0, 8),
        message: adminMessage.trim(),
        type: "customer_message",
        status: "unread",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Message sent to admin successfully!");
      setShowMessageModal(false);
      setAdminMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmittingMessage(false);
    }
  };

  // ==========================================
  // DELIVERY DETAILS COMPONENT
  // ==========================================
  const DeliveryDetails = ({ delivery, order }) => {
    const [showCreds, setShowCreds] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = (text, field) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    };

    if (!delivery) return null;

    return (
      <div className="mt-4 p-4 bg-zinc-900/80 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">Delivery Information</h4>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Delivered
          </span>
        </div>

        {/* Delivery Status */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            Delivered on{" "}
            {delivery.deliveredAt?.toDate?.()?.toLocaleDateString() || "N/A"}
          </span>
        </div>

        {/* Credentials */}
        <div className="space-y-2">
          {/* Email */}
          {delivery.email && (
            <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-zinc-400 font-mono">Email:</span>
                <span className="text-xs text-white font-mono truncate">
                  {delivery.email}
                </span>
              </div>
              <button
                onClick={() => handleCopy(delivery.email, "Email")}
                className="p-1 hover:bg-zinc-800 rounded-lg transition flex-shrink-0"
              >
                {copiedField === "Email" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                )}
              </button>
            </div>
          )}

          {/* Password */}
          {delivery.password && (
            <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-zinc-400 font-mono">
                  Password:
                </span>
                <span className="text-xs text-white font-mono">
                  {showCreds ? delivery.password : "••••••••••••"}
                </span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => setShowCreds(!showCreds)}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition"
                >
                  {showCreds ? (
                    <Eye className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleCopy(delivery.password, "Password")}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition"
                >
                  {copiedField === "Password" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* License Key */}
          {delivery.licenseKey && (
            <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-zinc-400 font-mono">
                  License Key:
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {showCreds ? delivery.licenseKey : "••••-••••-••••-••••"}
                </span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => setShowCreds(!showCreds)}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition"
                >
                  {showCreds ? (
                    <Eye className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleCopy(delivery.licenseKey, "License Key")}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition"
                >
                  {copiedField === "License Key" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Download Link */}
          {delivery.downloadLink && (
            <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-zinc-400 font-mono">
                  Download:
                </span>
                <a
                  href={delivery.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 truncate max-w-[150px] sm:max-w-[200px]"
                >
                  {delivery.downloadLink.length > 30
                    ? `${delivery.downloadLink.substring(0, 30)}...`
                    : delivery.downloadLink}
                </a>
              </div>
              <button
                onClick={() => window.open(delivery.downloadLink, "_blank")}
                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          )}

          {/* Expiry Date */}
          {delivery.expiryDate && (
            <div className="flex items-center gap-2 p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-zinc-400 font-mono">Expires:</span>
              <span className="text-xs text-white font-mono">
                {new Date(delivery.expiryDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Notes */}
          {delivery.notes && (
            <div className="p-2 bg-amber-500/5 rounded-lg border border-amber-500/20">
              <p className="text-xs text-zinc-400 font-mono">
                <span className="font-bold text-amber-400">📝 Note:</span>{" "}
                {delivery.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
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
              onClick={() => navigate("/orders")}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <FileText className="w-6 h-6 text-zinc-300 mx-auto group-hover:scale-110 group-hover:text-amber-400 transition-all" />
              <p className="mt-2 text-xs font-bold text-zinc-300 group-hover:text-amber-400 transition">
                Orders
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
                  className="bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1.5 w-full md:w-auto">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          #{order.id.slice(0, 8)}
                        </span>
                        {renderStatusBadge(order.status)}
                        {renderPaymentBadge(order.paymentStatus)}
                      </div>
                      <p className="text-sm font-semibold text-white line-clamp-1">
                        {order.items
                          ?.map((i) => i.title || i.name)
                          .join(", ") ||
                          order.productName ||
                          "General Order"}
                      </p>
                      <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-black text-white">
                          ₦
                          {Number(
                            order.total || order.amountPaid || 0,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition border border-zinc-700 hover:border-amber-500/30"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generatePDF(order)}
                          className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition border border-zinc-700 hover:border-amber-500/30"
                          title="Download Invoice PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMessageAdmin(order)}
                          className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition border border-blue-500/20 hover:border-blue-500/30"
                          title="Message Admin"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReportIssue(order)}
                          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition border border-amber-500/20 hover:border-amber-500/30"
                          title="Report Issue"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Progress Bar */}
                  {order.status !== "Cancelled" && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Progress:
                        </span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              order.status === "Completed" ||
                              order.status === "Delivered"
                                ? "bg-emerald-500 w-full"
                                : order.status === "Processing"
                                  ? "bg-blue-500 w-2/3"
                                  : order.status === "Pending"
                                    ? "bg-amber-500 w-1/3"
                                    : "bg-zinc-500 w-0"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {order.status === "Completed" ||
                          order.status === "Delivered"
                            ? "Complete"
                            : order.status === "Processing"
                              ? "Processing"
                              : order.status === "Pending"
                                ? "Pending"
                                : "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* DELIVERY DETAILS - SHOW WHEN DELIVERED    */}
                  {/* ========================================== */}
                  {order.status === "Delivered" && order.delivery && (
                    <div className="mt-2 pt-3 border-t border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">
                          ✓ Delivered
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {order.delivery.deliveredAt
                            ?.toDate?.()
                            ?.toLocaleDateString() || "N/A"}
                        </span>
                      </div>

                      {/* Quick Delivery Info Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.delivery.email && (
                          <div className="flex items-center gap-2 p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            <Key className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] text-zinc-400 font-mono truncate">
                              {order.delivery.email}
                            </span>
                          </div>
                        )}
                        {order.delivery.downloadLink && (
                          <div className="flex items-center gap-2 p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            <Download className="w-3 h-3 text-emerald-400" />
                            <a
                              href={order.delivery.downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-amber-400 hover:text-amber-300 truncate"
                            >
                              Download
                            </a>
                          </div>
                        )}
                        {order.delivery.licenseKey && (
                          <div className="flex items-center gap-2 p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            <Key className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] text-amber-400 font-mono font-bold">
                              {order.delivery.licenseKey.slice(0, 8)}...
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setViewingOrder(order)}
                        className="mt-2 text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View Full Delivery Details
                      </button>
                    </div>
                  )}
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

      {/* ========================================== */}
      {/* ORDER DETAIL MODAL                        */}
      {/* ========================================== */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950/95 border border-amber-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Order Details</h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Order #{viewingOrder.id?.slice(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Status
                </p>
                <div className="mt-1">
                  {renderStatusBadge(viewingOrder.status)}
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Payment
                </p>
                <div className="mt-1">
                  {renderPaymentBadge(viewingOrder.paymentStatus)}
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-lg font-black text-amber-400 mt-1">
                  ₦
                  {Number(
                    viewingOrder.total || viewingOrder.amountPaid || 0,
                  ).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-xs font-mono text-white mt-1">
                  {formatDate(viewingOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Items */}
            {viewingOrder.items && viewingOrder.items.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-3">Items</h4>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-xl border border-zinc-800"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.title || item.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-amber-400">
                        ₦
                        {Number(
                          (item.price || 0) * (item.quantity || 1),
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* DELIVERY DETAILS IN MODAL                 */}
            {/* ========================================== */}
            {viewingOrder.status === "Delivered" && viewingOrder.delivery && (
              <div className="mb-6">
                <DeliveryDetails
                  delivery={viewingOrder.delivery}
                  order={viewingOrder}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800/50">
              <button
                onClick={() => generatePDF(viewingOrder)}
                className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Download Invoice
              </button>
              <button
                onClick={() => {
                  setViewingOrder(null);
                  handleMessageAdmin(viewingOrder);
                }}
                className="flex-1 min-w-[120px] px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-blue-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Message Admin
              </button>
              <button
                onClick={() => {
                  setViewingOrder(null);
                  handleReportIssue(viewingOrder);
                }}
                className="flex-1 min-w-[120px] px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-amber-500/20"
              >
                <Flag className="w-4 h-4" /> Report Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* REPORT ISSUE MODAL                        */}
      {/* ========================================== */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950/95 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Flag className="w-5 h-5 text-amber-400" />
                  Report Issue
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Order #{reportOrder?.id?.slice(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Issue Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition"
                >
                  <option value="general">General Issue</option>
                  <option value="delivery">Delivery Problem</option>
                  <option value="product">Product Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Describe the Issue
                </label>
                <textarea
                  rows={4}
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  placeholder="Please provide details about the issue..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={submittingReport}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingReport ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MESSAGE ADMIN MODAL                       */}
      {/* ========================================== */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950/95 border border-blue-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-blue-500/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Message Admin
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Order #{messageOrder?.id?.slice(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Write your message to admin..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitMessage}
                  disabled={submittingMessage}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingMessage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
