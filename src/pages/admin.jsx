import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  Package,
  ShoppingCart,
  Users,
  X,
  Bell,
  Database,
  HardDrive,
  BarChart3,
  Palette,
  AlertTriangle,
  CheckCircle2,
  Server,
  Trash2,
  Plus,
  Clock,
  Eye,
  Send,
  Download,
  Save,
  User,
  Mail,
  Lock,
  Store,
  Globe,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Key,
  TrendingUp,
  Activity,
  LogOut,
  Pencil,
  Image as ImageIcon,
  Copy,
  Printer,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import { auth, db } from "../firebase/firebase";
import { generateInvoice } from "../utils/generateInvoice";

// ==========================================
// ISOLATED LIVE CLOCK COMPONENT
// ==========================================
const LiveClock = React.memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-gray-500 mt-1 font-mono flex items-center gap-2">
      <Clock className="w-4 h-4 text-yellow-400" />
      {time.toLocaleDateString()} • {time.toLocaleTimeString()}
    </p>
  );
});

// ==========================================
// SMOOTH ANIMATED COUNTER COMPONENT
// ==========================================
const AnimatedCounter = ({ end, prefix = "", duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = 0;
    const numericEnd = Number(end) || 0;

    if (numericEnd === 0) {
      setCount(0);
      return;
    }

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.floor(
        progress * (numericEnd - startValue) + startValue,
      );
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        setCount(numericEnd);
      }
    };

    requestAnimationFrame(animation);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
    </span>
  );
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add these to your top-level state declarations inside Admin()
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [isActionLoading, setIsActionLoading] = useState(false);
  // SEARCH AND FILTER STATES
  const [search, setSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // NOTIFICATION & ACTIVITY STATES
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState([]);
  const [, setMessages] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // CUSTOMER MODAL STATE
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ORDER MODALS STATE
  const [deliveryModalOrder, setDeliveryModalOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    email: "",
    password: "",
    notes: "",
    downloadLink: "",
    licenseKey: "",
    expiryDate: "",
  });

  // PRODUCT UPLOAD / FORM STATE
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "Digital",
    price: "",
    description: "",
    image: "",
  });

  const isInitialOrdersLoad = useRef(true);

  // ------------------------------------------
  // LIVE DATABASE LISTENERS
  // ------------------------------------------
  useEffect(() => {
    loadProducts();
    loadCustomers();

    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(100),
    );
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isInitialOrdersLoad.current) {
        isInitialOrdersLoad.current = false;
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newOrder = change.doc.data();
            toast.success(
              `${newOrder.customerName || "Customer"} placed an order!`,
            );
          }
        });
      }

      setOrders(data);
    });

    const activitiesQuery = query(
      collection(db, "activities"),
      orderBy("createdAt", "desc"),
      limit(30),
    );
    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(data);
    });

    const notificationsQuery = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(30),
    );
    const unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(data);
      },
    );

    const unsubscribeMessages = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      },
    );

    return () => {
      unsubscribeOrders();
      unsubscribeActivities();
      unsubscribeNotifications();
      unsubscribeMessages();
    };
  }, []);

  async function loadProducts() {
    try {
      const snap = await getDocs(collection(db, "products"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  }

  async function loadCustomers() {
    try {
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  }

  // CUSTOMER STATUS TOGGLES
  async function handleToggleVerify(id) {
    try {
      const customer = customers.find((c) => c.id === id);
      const nextVal = !customer?.verified;
      await updateDoc(doc(db, "users", id), { verified: nextVal });
      setCustomers(
        customers.map((c) => (c.id === id ? { ...c, verified: nextVal } : c)),
      );
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer({ ...selectedCustomer, verified: nextVal });
      }
      toast.success("Customer verification status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  }

  async function handleTogglePremium(id) {
    try {
      const customer = customers.find((c) => c.id === id);
      const nextVal = !customer?.premium;
      await updateDoc(doc(db, "users", id), { premium: nextVal });
      setCustomers(
        customers.map((c) => (c.id === id ? { ...c, premium: nextVal } : c)),
      );
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer({ ...selectedCustomer, premium: nextVal });
      }
      toast.success("Customer premium status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  }

  async function blockUser(user) {
    const action = user.blocked ? "unblock" : "block";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${user.name || user.email}?`,
      )
    )
      return;

    try {
      await updateDoc(doc(db, "users", user.id), {
        blocked: !user.blocked,
        updatedAt: serverTimestamp(),
      });

      await addActivity(
        user.blocked ? "🟢 User Unblocked" : "🔴 User Blocked",
        `${user.name || user.email} has been ${
          user.blocked ? "unblocked" : "blocked"
        }`,
      );

      await addNotification(
        user.blocked ? "User Unblocked" : "User Blocked",
        `${user.name || user.email} has been ${
          user.blocked ? "unblocked" : "blocked"
        }`,
      );

      toast.success(
        `User ${user.blocked ? "unblocked" : "blocked"} successfully.`,
      );

      loadCustomers();

      setSelectedCustomer({
        ...user,
        blocked: !user.blocked,
      });
    } catch (err) {
      console.error(err);
      toast.error("Operation failed.");
    }
  }

  async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data },
    );
    const result = await res.json();
    return result.secure_url;
  }

  async function handleProductSubmit(e) {
    e.preventDefault();
    setUploading(true);
    try {
      let image = form.image;
      if (imageFile) {
        image = await uploadImage(imageFile);
      }

      const payload = {
        ...form,
        image,
        price: Number(form.price),
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
        toast.success("Product updated successfully!");
        await addActivity("Product Updated", `${form.title} was updated`);
        await addNotification("Product Updated", `${form.title} was updated`);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Product added successfully!");
        await addActivity(
          "Product Added",
          `${form.title} was added to the store`,
        );
      }

      resetProductForm();
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product.");
    } finally {
      setUploading(false);
    }
  }

  function resetProductForm() {
    setEditingId(null);
    setImageFile(null);
    setPreview("");
    setForm({
      title: "",
      category: "",
      type: "Digital",
      price: "",
      description: "",
      image: "",
    });
  }

  function editProduct(product) {
    setEditingId(product.id);
    setPreview(product.image);
    setForm({
      title: product.title,
      category: product.category,
      type: product.type,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    setActiveTab("products");
  }

  async function removeProduct(id) {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      await addActivity("Product Deleted", "A product was removed");
      await addNotification(
        "Product Deleted",
        "A product was removed from the store",
      );
      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteOrder(id) {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", id));
      await addActivity(
        "Order Deleted",
        `Order #${id.slice(0, 6)} was deleted`,
      );
      await addNotification(
        "Order Deleted",
        `Order #${id.slice(0, 6)} was deleted`,
      );
      toast.success("Order deleted");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeliverOrder(e) {
    e.preventDefault();
    if (!deliveryModalOrder) return;

    setUploading(true);
    try {
      await updateDoc(doc(db, "orders", deliveryModalOrder.id), {
        status: "Delivered",
        delivery: {
          email: deliveryForm.email,
          password: deliveryForm.password,
          downloadLink: deliveryForm.downloadLink,
          licenseKey: deliveryForm.licenseKey,
          expiryDate: deliveryForm.expiryDate,
          notes: deliveryForm.notes,
          deliveredAt: serverTimestamp(),
        },
      });

      await addActivity(
        "Order Delivered",
        `Order #${deliveryModalOrder.id.slice(0, 6)} was delivered`,
      );
      await addNotification(
        "Order Delivered",
        `Order #${deliveryModalOrder.id.slice(0, 6)} was delivered`,
      );

      toast.success("Digital item delivered successfully!");
      setDeliveryModalOrder(null);
      setDeliveryForm({
        email: "",
        password: "",
        notes: "",
        downloadLink: "",
        licenseKey: "",
        expiryDate: "",
      });
    } catch (err) {
      console.error("Delivery error:", err);
      toast.error("Failed to deliver order.");
    } finally {
      setUploading(false);
    }
  }

  // Helper functions for Payments
  function exportPayments() {
    const rows = [["Customer", "Email", "Amount", "Status", "Date"]];

    orders.forEach((order) => {
      rows.push([
        `"${order.customerName || ""}"`,
        `"${order.email || order.userEmail || ""}"`,
        order.total || 0,
        order.status || "",
        order.createdAt?.toDate
          ? order.createdAt.toDate().toLocaleDateString()
          : "",
      ]);
    });

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "payments.csv";

    a.click();

    URL.revokeObjectURL(url);
  }

  function printReceipt(order) {
    const win = window.open("", "_blank");

    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
        </head>

        <body style="font-family:Arial;padding:40px">

        <h1>BLACK HUB</h1>

        <hr/>

        <h3>Customer: ${order.customerName || "Unknown"}</h3>

        <p>Email: ${order.email || order.userEmail || "N/A"}</p>

        <p>Total: ₦${Number(order.total || 0).toLocaleString()}</p>

        <p>Status: ${order.status || "Completed"}</p>

        <p>
        Date:
        ${
          order.createdAt?.toDate
            ? order.createdAt.toDate().toLocaleString()
            : "N/A"
        }
        </p>

        </body>

      </html>
    `);

    win.print();
  }

  function copyOrderID(id) {
    navigator.clipboard.writeText(id);
    alert("Order ID copied");
  }

  function exportOrdersCSV() {
    const headers = ["ID", "Customer Name", "Email", "Total", "Status", "Date"];
    const rows = orders.map((o) => [
      o.id,
      o.customerName || "Anonymous",
      o.email || "",
      o.total || 0,
      o.status || "Pending",
      o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : "",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported successfully!");
  }

  async function addActivity(action, description) {
    await addDoc(collection(db, "activities"), {
      action,
      description,
      createdAt: serverTimestamp(),
    });
  }

  async function addNotification(title, message) {
    await addDoc(collection(db, "notifications"), {
      title,
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  async function markAsRead(id) {
    await updateDoc(doc(db, "notifications", id), {
      read: true,
    });
  }

  async function logout() {
    if (!window.confirm("Are you sure you want to log out?")) return;
    await signOut(auth);
    window.location.href = "/login";
  }

  // ------------------------------------------
  // MEMOIZED COMPUTATIONS
  // ------------------------------------------
  const calculatedRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === "Paid" || o.status === "Delivered")
      .reduce((a, b) => a + (Number(b.total) || 0), 0);
  }, [orders]);

  const monthlyRevenue = useMemo(() => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    return orders
      .filter((order) => {
        if (!order.createdAt?.toDate) return false;
        const date = order.createdAt.toDate();
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((total, order) => total + Number(order.total || 0), 0);
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!map[item.title]) {
          map[item.title] = 0;
        }
        map[item.title] += item.quantity;
      });
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "Pending").length,
    [orders],
  );

  const deliveredOrders = useMemo(
    () => orders.filter((order) => order.status === "Delivered").length,
    [orders],
  );

  const productsSold = useMemo(
    () =>
      orders.reduce((total, order) => {
        return (
          total +
          (order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0)
        );
      }, 0),
    [orders],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const monthlyData = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      if (!order.createdAt?.toDate) return;
      const month = order.createdAt
        .toDate()
        .toLocaleString("en-US", { month: "short" });
      map[month] = (map[month] || 0) + Number(order.total || 0);
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((m) => ({
      month: m,
      revenue: map[m] || 0,
    }));
  }, [orders]);

  const statusChart = useMemo(
    () => [
      {
        name: "Delivered",
        value: deliveredOrders,
      },
      {
        name: "Pending",
        value: pendingOrders,
      },
      {
        name: "Cancelled",
        value: orders.filter((o) => o.status === "Cancelled").length,
      },
    ],
    [deliveredOrders, pendingOrders, orders],
  );

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const renderStatusBadge = (status) => {
    const styles = {
      Delivered:
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      Cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    };
    return (
      <span
        className={`px-3 py-1 text-xs rounded-full font-semibold tracking-wide inline-flex items-center gap-1.5 ${
          styles[status] || styles.Pending
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "Delivered"
              ? "bg-emerald-400"
              : status === "Cancelled"
                ? "bg-rose-400"
                : "bg-amber-400"
          }`}
        />
        {status || "Pending"}
      </span>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  Welcome back! Here is what's happening today.
                </p>
                <LiveClock />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex justify-center items-center hover:bg-gray-800 transition text-gray-300"
                  >
                    <Bell size={20} />
                  </button>

                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 w-5 h-5 rounded-full flex justify-center items-center text-[10px] font-bold text-white">
                      {unreadNotifications}
                    </span>
                  )}

                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="font-bold text-sm">Notifications</h2>
                        <span className="text-xs text-gray-400">
                          {unreadNotifications} unread
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/60">
                        {notifications.length === 0 ? (
                          <p className="p-6 text-center text-sm text-gray-500">
                            No new notifications
                          </p>
                        ) : (
                          notifications.map((note) => (
                            <div
                              key={note.id}
                              onClick={() => markAsRead(note.id)}
                              className={`p-4 cursor-pointer hover:bg-black/50 transition ${
                                !note.read ? "bg-gray-800/40" : ""
                              }`}
                            >
                              <h3 className="font-bold text-sm">
                                {note.title}
                              </h3>
                              <p className="text-xs text-gray-400 mt-1">
                                {note.message}
                              </p>
                              <p className="text-[10px] text-gray-500 mt-2">
                                {note.createdAt?.toDate
                                  ? note.createdAt.toDate().toLocaleString()
                                  : ""}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab("products")}
                  className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition text-sm"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Products",
                  value: <AnimatedCounter end={products.length} />,
                  icon: Package,
                  color: "text-yellow-400",
                },
                {
                  label: "Total Orders",
                  value: <AnimatedCounter end={orders.length} />,
                  icon: ShoppingCart,
                  color: "text-blue-400",
                },
                {
                  label: "Total Customers",
                  value: <AnimatedCounter end={customers.length} />,
                  icon: Users,
                  color: "text-purple-400",
                },
                {
                  label: "Total Revenue",
                  value: <AnimatedCounter prefix="₦" end={calculatedRevenue} />,
                  icon: CreditCard,
                  color: "text-emerald-400",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800 flex justify-between items-start"
                >
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {card.label}
                    </p>
                    <h1 className={`text-2xl font-black mt-2 ${card.color}`}>
                      {card.value}
                    </h1>
                  </div>
                  <div className="p-3 bg-gray-800/60 rounded-xl text-gray-300">
                    <card.icon size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Performance Metrics */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  This Month's Revenue
                </p>
                <h1 className="text-3xl font-black text-emerald-400 mt-3">
                  ₦{monthlyRevenue.toLocaleString()}
                </h1>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Pending Orders
                </p>
                <h1 className="text-3xl font-black text-amber-400 mt-3">
                  {pendingOrders}
                </h1>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Delivered Orders
                </p>
                <h1 className="text-3xl font-black text-emerald-400 mt-3">
                  {deliveredOrders}
                </h1>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Items Sold
                </p>
                <h1 className="text-3xl font-black text-yellow-400 mt-3">
                  {productsSold}
                </h1>
              </div>
            </div>

            {/* Quick Navigation Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              <div
                onClick={() => setActiveTab("products")}
                className="bg-gradient-to-br from-yellow-400 to-amber-500 text-black p-6 rounded-2xl cursor-pointer hover:opacity-95 transition"
              >
                <Package size={28} />
                <h2 className="text-xl font-bold mt-4">Products</h2>
                <p className="text-xs text-black/70 mt-1">Manage catalog</p>
              </div>

              <div
                onClick={() => setActiveTab("orders")}
                className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl cursor-pointer hover:opacity-95 transition"
              >
                <ShoppingCart size={28} />
                <h2 className="text-xl font-bold mt-4">Orders</h2>
                <p className="text-xs text-blue-200 mt-1">View purchases</p>
              </div>

              <div
                onClick={() => setActiveTab("customers")}
                className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl cursor-pointer hover:opacity-95 transition"
              >
                <Users size={28} />
                <h2 className="text-xl font-bold mt-4">Customers</h2>
                <p className="text-xs text-emerald-200 mt-1">View profiles</p>
              </div>

              <div
                onClick={() => setActiveTab("payments")}
                className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-2xl cursor-pointer hover:opacity-95 transition"
              >
                <CreditCard size={28} />
                <h2 className="text-xl font-bold mt-4">Payments</h2>
                <p className="text-xs text-purple-200 mt-1">Transactions</p>
              </div>
            </div>

            {/* Recent Sales & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
              <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-yellow-400" />
                  Recent Sales
                </h2>
                <div className="divide-y divide-gray-800/60">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center py-3.5"
                    >
                      <div>
                        <h4 className="text-sm font-semibold">
                          {order.customerName || "Customer"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-yellow-400">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </p>
                        <div className="mt-1">
                          {renderStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-sm text-gray-500 py-4">
                      No recent sales.
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h2 className="text-lg font-bold mb-4">
                    Top Selling Products
                  </h2>
                  {topProducts.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No sales recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {topProducts.map(([name, qty], index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm py-2 border-b border-gray-800/40 last:border-none"
                        >
                          <span className="text-gray-300 font-medium">
                            {name}
                          </span>
                          <span className="text-yellow-400 font-bold">
                            {qty} sold
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Updates & Additions */}
              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Recent Updates</h2>
                    <span className="bg-yellow-400/10 text-yellow-400 px-2.5 py-0.5 text-xs rounded-full font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-xs">
                        No recent updates.
                      </p>
                    ) : (
                      notifications.map((note) => (
                        <div
                          key={note.id}
                          className="bg-black/40 rounded-xl p-3 border border-gray-800/60 text-xs text-gray-300"
                        >
                          <p>{note.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Latest Additions</h2>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 bg-black/40 border border-gray-800/60 p-2.5 rounded-xl"
                      >
                        <img
                          src={product.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold truncate">
                            {product.title}
                          </h4>
                          <p className="text-[10px] text-gray-400">
                            {product.category}
                          </p>
                        </div>
                        <p className="text-xs font-bold text-yellow-400">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Analytics */}
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-yellow-400" />
                  Revenue Analytics
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#27272a",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#facc15"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-yellow-400" />
                  Order Status Overview
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChart}
                      dataKey="value"
                      outerRadius={110}
                      label
                    >
                      {statusChart.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#27272a",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mt-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity size={20} className="text-yellow-400" />
                Live Activity Log
              </h2>
              {activities.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No activity recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 8).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 border-b border-gray-800/60 pb-3 last:border-none"
                    >
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
                      <div>
                        <h3 className="text-sm font-bold">{activity.action}</h3>
                        <p className="text-xs text-gray-400">
                          {activity.description}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {activity.createdAt?.toDate
                            ? activity.createdAt.toDate().toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      case "orders":
        return (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-black">Orders</h1>
                <p className="text-gray-400 mt-2">
                  Manage and process customer purchases
                </p>
              </div>
              <button
                onClick={exportOrdersCSV}
                className="bg-gray-900 border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition text-gray-200"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {/* Advanced Order Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setSearch("")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  search === ""
                    ? "bg-yellow-400 text-black"
                    : "bg-zinc-900 border border-gray-800 hover:bg-zinc-800 text-white"
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setSearch("Pending")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  search === "Pending"
                    ? "bg-yellow-500 text-black"
                    : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                }`}
              >
                Pending ({pendingOrders})
              </button>
              <button
                onClick={() => setSearch("Delivered")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  search === "Delivered"
                    ? "bg-green-500 text-black"
                    : "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                }`}
              >
                Delivered ({deliveredOrders})
              </button>
              <button
                onClick={() => setSearch("Cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  search === "Cancelled"
                    ? "bg-red-500 text-black"
                    : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                }`}
              >
                Cancelled
              </button>
            </div>

            {/* CLEAN TABLE LAYOUT */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-[11px] font-mono text-gray-400 uppercase tracking-wider bg-black/40">
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-sm">
                    {orders.filter((order) => {
                      if (search === "") return true;
                      return order.status === search;
                    }).length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-12 text-center text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter((order) => {
                          if (search === "") return true;
                          return order.status === search;
                        })
                        .map((order) => {
                          const customerName =
                            order.customerName || "Anonymous";
                          const initial = customerName.charAt(0).toUpperCase();
                          const orderDate = order.createdAt?.toDate
                            ? order.createdAt.toDate().toLocaleDateString()
                            : "N/A";

                          return (
                            <tr
                              key={order.id}
                              className="hover:bg-black/30 transition"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xs shrink-0">
                                    {initial}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-white truncate">
                                      {customerName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {order.email || "No email"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-black text-yellow-400">
                                ₦{Number(order.total || 0).toLocaleString()}
                              </td>
                              <td className="py-4 px-6">
                                {renderStatusBadge(order.status)}
                              </td>
                              <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                                {orderDate}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setViewOrder(order)}
                                    className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                                  >
                                    <Eye size={13} />
                                    View
                                  </button>
                                  {order.status !== "Delivered" && (
                                    <button
                                      onClick={() =>
                                        setDeliveryModalOrder(order)
                                      }
                                      className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                                    >
                                      <Send size={13} />
                                      Deliver
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteOrder(order.id)}
                                    className="bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                                  >
                                    <Trash2 size={13} />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      // Ensure you have these additional states defined in your parent component:
      // const [editingCustomer, setEditingCustomer] = useState(null);
      // const [showAllOrders, setShowAllOrders] = useState(false);
      // const [copied, setCopied] = useState(false);

      case "customers":
        // Helper for Export CSV
        const handleExportCustomers = () => {
          const headers = [
            "ID",
            "Name",
            "Email",
            "Phone",
            "Country",
            "Role",
            "Verified",
            "Joined",
          ];
          const rows = customers.map((c) => [
            c.id,
            `"${c.name || ""}"`,
            c.email || "",
            c.phone || "",
            c.country || "",
            c.role || "standard",
            c.verified ? "Yes" : "No",
            c.createdAt?.toDate
              ? c.createdAt.toDate().toLocaleDateString()
              : "N/A",
          ]);

          const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute(
            "download",
            `customers_export_${new Date().toISOString().slice(0, 10)}.csv`,
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        // Helper for Deleting Customer
        const handleDeleteCustomer = (customerId, customerName) => {
          if (
            window.confirm(
              `Are you sure you want to delete ${customerName || "this customer"}? This action cannot be undone.`,
            )
          ) {
            // Update local state (replace with your delete API / Firebase call)
            setCustomers((prev) => prev.filter((c) => c.id !== customerId));
            if (selectedCustomer?.id === customerId) {
              setSelectedCustomer(null);
            }
          }
        };

        return (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black">Customers</h1>
                <p className="text-gray-400 mt-2">
                  Manage every registered customer from one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 outline-none focus:border-yellow-400 text-white"
                />

                <button
                  onClick={handleExportCustomers}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Total Customers
                </p>
                <h1 className="text-4xl font-black mt-3 text-yellow-400">
                  {customers.length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Premium Users
                </p>
                <h1 className="text-4xl font-black mt-3 text-green-400">
                  {customers.filter((c) => c.role === "premium").length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Verified</p>
                <h1 className="text-4xl font-black mt-3 text-blue-400">
                  {customers.filter((c) => c.verified).length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Active Today
                </p>
                <h1 className="text-4xl font-black mt-3 text-purple-400">
                  {customers.filter((c) => c.online).length}
                </h1>
              </div>
            </div>

            {/* Premium Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers
                .filter(
                  (customer) =>
                    customer.name
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
                    customer.email
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((customer) => {
                  const customerOrders = orders.filter(
                    (order) => order.userId === customer.id,
                  );

                  const totalSpent = customerOrders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0,
                  );

                  const joinedDate = customer.createdAt?.toDate
                    ? customer.createdAt.toDate().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <div
                      key={customer.id}
                      className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Top row: Avatar & Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xl">
                              {customer.name
                                ? customer.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            {/* Online Status Dot */}
                            <span
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                                customer.online ? "bg-green-500" : "bg-gray-500"
                              }`}
                            />
                          </div>

                          <div className="flex gap-2">
                            {customer.role === "premium" && (
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ⭐ Premium
                              </span>
                            )}
                            {customer.verified && (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white">
                            {customer.name || "Unknown User"}
                          </h2>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {customer.email}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {customer.phone || "No phone added"}
                          </p>
                        </div>

                        {/* Metrics Breakdown */}
                        <div className="grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-gray-800/80 mb-6">
                          <div>
                            <p className="text-gray-500 text-xs">Orders</p>
                            <p className="text-white font-bold text-base mt-0.5">
                              {customerOrders.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Total Spent</p>
                            <p className="text-yellow-400 font-bold text-base mt-0.5">
                              ₦{totalSpent.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Joined:{" "}
                          <span className="text-gray-300">{joinedDate}</span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCustomer(customer.id, customer.name)
                          }
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition border border-red-500/20"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-zinc-800 flex-shrink-0">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Customer Profile
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Complete customer information and purchase analytics
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCustomer(null);
                        setShowAllOrders(false);
                      }}
                      className="w-10 h-10 rounded-xl bg-zinc-900 text-white hover:bg-red-600 transition flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scrollable Body */}
                  <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                      <div className="w-24 h-24 rounded-full bg-yellow-400 text-black flex items-center justify-center text-4xl font-black flex-shrink-0">
                        {(selectedCustomer.name || "U")[0].toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {selectedCustomer.name || "Unknown User"}
                        </h2>

                        <p className="text-zinc-400 mt-1">
                          {selectedCustomer.email}
                        </p>

                        <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                          Active Customer
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mt-10">
                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Phone Number
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.phone || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Country
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.country || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Registered
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.createdAt?.toDate
                            ? selectedCustomer.createdAt
                                .toDate()
                                .toLocaleDateString()
                            : "Unknown"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Customer ID
                        </p>
                        <h3 className="mt-2 font-mono break-all text-sm text-zinc-300">
                          {selectedCustomer.id}
                        </h3>
                      </div>
                    </div>

                    {/* Purchase Analytics */}
                    <div className="mt-10">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Purchase Analytics
                      </h2>

                      {(() => {
                        const customerOrders = orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        );

                        const totalSpent = customerOrders.reduce(
                          (sum, order) => sum + Number(order.total || 0),
                          0,
                        );

                        const delivered = customerOrders.filter(
                          (order) => order.status === "Delivered",
                        ).length;

                        const pending = customerOrders.filter(
                          (order) => order.status === "Pending",
                        ).length;

                        return (
                          <div className="grid md:grid-cols-4 gap-5">
                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Orders
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-yellow-400">
                                {customerOrders.length}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Total Spent
                              </p>
                              <h1 className="text-2xl font-black mt-3 text-green-400">
                                ₦{totalSpent.toLocaleString()}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Delivered
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-emerald-400">
                                {delivered}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Pending
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-orange-400">
                                {pending}
                              </h1>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-10">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">
                          {showAllOrders ? "All Orders" : "Recent Orders"}
                        </h2>
                        {orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        ).length > 5 && (
                          <button
                            onClick={() => setShowAllOrders(!showAllOrders)}
                            className="text-xs text-yellow-400 hover:underline font-bold"
                          >
                            {showAllOrders ? "Show Less" : "View All"}
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        ).length === 0 ? (
                          <p className="text-zinc-500 text-sm bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/60 text-center">
                            No orders recorded for this customer yet.
                          </p>
                        ) : (
                          orders
                            .filter(
                              (order) => order.userId === selectedCustomer.id,
                            )
                            .slice(0, showAllOrders ? undefined : 5)
                            .map((order) => (
                              <div
                                key={order.id}
                                className="bg-zinc-900 rounded-2xl p-5 flex justify-between items-center border border-zinc-800/60"
                              >
                                <div>
                                  <h3 className="font-bold text-white">
                                    #{order.id.slice(0, 8)}
                                  </h3>
                                  <p className="text-zinc-500 text-sm mt-1">
                                    {order.createdAt?.toDate
                                      ? order.createdAt
                                          .toDate()
                                          .toLocaleDateString()
                                      : "Unknown"}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <h3 className="font-bold text-yellow-400">
                                    ₦{Number(order.total || 0).toLocaleString()}
                                  </h3>
                                  <div className="mt-2">
                                    <span
                                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        order.status === "Delivered"
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : order.status === "Pending"
                                            ? "bg-orange-500/20 text-orange-400"
                                            : "bg-zinc-800 text-zinc-300"
                                      }`}
                                    >
                                      {order.status || "Completed"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-wrap gap-4">
                      <a
                        href={`mailto:${selectedCustomer.email}`}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-white transition text-sm text-center"
                      >
                        Send Email
                      </a>
                      <button
                        onClick={() => setShowAllOrders(true)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-bold transition text-sm"
                      >
                        View All Orders
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCustomer.id);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold text-white transition text-sm flex items-center gap-2"
                      >
                        {copied ? "✓ Copied ID!" : "Copy User ID"}
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCustomer(
                            selectedCustomer.id,
                            selectedCustomer.name,
                          )
                        }
                        className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Delete Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Customer Modal (Optional functional addition for the Edit button) */}
            {editingCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                      Edit Customer
                    </h2>
                    <button
                      onClick={() => setEditingCustomer(null)}
                      className="w-8 h-8 rounded-lg bg-zinc-900 text-white hover:bg-red-600 transition flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const updatedName = formData.get("name");
                      const updatedPhone = formData.get("phone");

                      // Update local customers state
                      setCustomers((prev) =>
                        prev.map((c) =>
                          c.id === editingCustomer.id
                            ? { ...c, name: updatedName, phone: updatedPhone }
                            : c,
                        ),
                      );
                      if (selectedCustomer?.id === editingCustomer.id) {
                        setSelectedCustomer((prev) => ({
                          ...prev,
                          name: updatedName,
                          phone: updatedPhone,
                        }));
                      }
                      setEditingCustomer(null);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">
                        Name
                      </label>
                      <input
                        name="name"
                        defaultValue={editingCustomer.name || ""}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        defaultValue={editingCustomer.phone || ""}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-bold transition text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-bold transition text-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        );
        return (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black">Customers</h1>
                <p className="text-gray-400 mt-2">
                  Manage every registered customer from one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 outline-none focus:border-yellow-400 text-white"
                />

                <button
                  onClick={() => alert("Exporting customers...")}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Total Customers
                </p>
                <h1 className="text-4xl font-black mt-3 text-yellow-400">
                  {customers.length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Premium Users
                </p>
                <h1 className="text-4xl font-black mt-3 text-green-400">
                  {customers.filter((c) => c.role === "premium").length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Verified</p>
                <h1 className="text-4xl font-black mt-3 text-blue-400">
                  {customers.filter((c) => c.verified).length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Active Today
                </p>
                <h1 className="text-4xl font-black mt-3 text-purple-400">
                  {customers.filter((c) => c.online).length}
                </h1>
              </div>
            </div>

            {/* Premium Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers
                .filter(
                  (customer) =>
                    customer.name
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
                    customer.email
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((customer) => {
                  const customerOrders = orders.filter(
                    (order) => order.userId === customer.id,
                  );

                  const totalSpent = customerOrders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0,
                  );

                  const joinedDate = customer.createdAt?.toDate
                    ? customer.createdAt.toDate().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <div
                      key={customer.id}
                      className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Top row: Avatar & Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xl">
                              {customer.name
                                ? customer.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            {/* Online Status Dot */}
                            <span
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                                customer.online ? "bg-green-500" : "bg-gray-500"
                              }`}
                            />
                          </div>

                          <div className="flex gap-2">
                            {customer.role === "premium" && (
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ⭐ Premium
                              </span>
                            )}
                            {customer.verified && (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white">
                            {customer.name || "Unknown User"}
                          </h2>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {customer.email}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {customer.phone || "No phone added"}
                          </p>
                        </div>

                        {/* Metrics Breakdown */}
                        <div className="grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-gray-800/80 mb-6">
                          <div>
                            <p className="text-gray-500 text-xs">Orders</p>
                            <p className="text-white font-bold text-base mt-0.5">
                              {customerOrders.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Total Spent</p>
                            <p className="text-yellow-400 font-bold text-base mt-0.5">
                              ₦{totalSpent.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Joined:{" "}
                          <span className="text-gray-300">{joinedDate}</span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            alert(`Edit customer: ${customer.name}`)
                          }
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            alert(`Delete customer: ${customer.name}`)
                          }
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition border border-red-500/20"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-zinc-800 flex-shrink-0">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Customer Profile
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Complete customer information and purchase analytics
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="w-10 h-10 rounded-xl bg-zinc-900 text-white hover:bg-red-600 transition flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scrollable Body */}
                  <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                      <div className="w-24 h-24 rounded-full bg-yellow-400 text-black flex items-center justify-center text-4xl font-black flex-shrink-0">
                        {(selectedCustomer.name || "U")[0].toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {selectedCustomer.name || "Unknown User"}
                        </h2>

                        <p className="text-zinc-400 mt-1">
                          {selectedCustomer.email}
                        </p>

                        <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                          Active Customer
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mt-10">
                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Phone Number
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.phone || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Country
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.country || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Registered
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.createdAt?.toDate
                            ? selectedCustomer.createdAt
                                .toDate()
                                .toLocaleDateString()
                            : "Unknown"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Customer ID
                        </p>
                        <h3 className="mt-2 font-mono break-all text-sm text-zinc-300">
                          {selectedCustomer.id}
                        </h3>
                      </div>
                    </div>

                    {/* Purchase Analytics */}
                    <div className="mt-10">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Purchase Analytics
                      </h2>

                      {(() => {
                        const customerOrders = orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        );

                        const totalSpent = customerOrders.reduce(
                          (sum, order) => sum + Number(order.total || 0),
                          0,
                        );

                        const delivered = customerOrders.filter(
                          (order) => order.status === "Delivered",
                        ).length;

                        const pending = customerOrders.filter(
                          (order) => order.status === "Pending",
                        ).length;

                        return (
                          <div className="grid md:grid-cols-4 gap-5">
                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Orders
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-yellow-400">
                                {customerOrders.length}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Total Spent
                              </p>
                              <h1 className="text-2xl font-black mt-3 text-green-400">
                                ₦{totalSpent.toLocaleString()}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Delivered
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-emerald-400">
                                {delivered}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Pending
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-orange-400">
                                {pending}
                              </h1>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-10">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Recent Orders
                      </h2>

                      <div className="space-y-4">
                        {orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        ).length === 0 ? (
                          <p className="text-zinc-500 text-sm bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/60 text-center">
                            No orders recorded for this customer yet.
                          </p>
                        ) : (
                          orders
                            .filter(
                              (order) => order.userId === selectedCustomer.id,
                            )
                            .slice(0, 5)
                            .map((order) => (
                              <div
                                key={order.id}
                                className="bg-zinc-900 rounded-2xl p-5 flex justify-between items-center border border-zinc-800/60"
                              >
                                <div>
                                  <h3 className="font-bold text-white">
                                    #{order.id.slice(0, 8)}
                                  </h3>
                                  <p className="text-zinc-500 text-sm mt-1">
                                    {order.createdAt?.toDate
                                      ? order.createdAt
                                          .toDate()
                                          .toLocaleDateString()
                                      : "Unknown"}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <h3 className="font-bold text-yellow-400">
                                    ₦{Number(order.total || 0).toLocaleString()}
                                  </h3>
                                  <div className="mt-2">
                                    <span
                                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        order.status === "Delivered"
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : order.status === "Pending"
                                            ? "bg-orange-500/20 text-orange-400"
                                            : "bg-zinc-800 text-zinc-300"
                                      }`}
                                    >
                                      {order.status || "Completed"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-wrap gap-4">
                      <button
                        onClick={() =>
                          alert(`Sending email to ${selectedCustomer.email}`)
                        }
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Send Email
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `Viewing all orders for ${selectedCustomer.name}`,
                          )
                        }
                        className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-bold transition text-sm"
                      >
                        View All Orders
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCustomer.id);
                          alert("Customer ID copied to clipboard!");
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Copy User ID
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `Delete customer action triggered for ${selectedCustomer.name}`,
                          )
                        }
                        className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Delete Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
        return (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black">Customers</h1>
                <p className="text-gray-400 mt-2">
                  Manage every registered customer from one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 outline-none focus:border-yellow-400 text-white"
                />

                <button
                  onClick={() => alert("Exporting customers...")}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Total Customers
                </p>
                <h1 className="text-4xl font-black mt-3 text-yellow-400">
                  {customers.length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Premium Users
                </p>
                <h1 className="text-4xl font-black mt-3 text-green-400">
                  {customers.filter((c) => c.role === "premium").length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Verified</p>
                <h1 className="text-4xl font-black mt-3 text-blue-400">
                  {customers.filter((c) => c.verified).length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Active Today
                </p>
                <h1 className="text-4xl font-black mt-3 text-purple-400">
                  {customers.filter((c) => c.online).length}
                </h1>
              </div>
            </div>

            {/* Premium Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers
                .filter(
                  (customer) =>
                    customer.name
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
                    customer.email
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((customer) => {
                  const customerOrders = orders.filter(
                    (order) => order.userId === customer.id,
                  );

                  const totalSpent = customerOrders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0,
                  );

                  const joinedDate = customer.createdAt?.toDate
                    ? customer.createdAt.toDate().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <div
                      key={customer.id}
                      className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Top row: Avatar & Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xl">
                              {customer.name
                                ? customer.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            {/* Online Status Dot */}
                            <span
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                                customer.online ? "bg-green-500" : "bg-gray-500"
                              }`}
                            />
                          </div>

                          <div className="flex gap-2">
                            {customer.role === "premium" && (
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ⭐ Premium
                              </span>
                            )}
                            {customer.verified && (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white">
                            {customer.name || "Unknown User"}
                          </h2>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {customer.email}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {customer.phone || "No phone added"}
                          </p>
                        </div>

                        {/* Metrics Breakdown */}
                        <div className="grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-gray-800/80 mb-6">
                          <div>
                            <p className="text-gray-500 text-xs">Orders</p>
                            <p className="text-white font-bold text-base mt-0.5">
                              {customerOrders.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Total Spent</p>
                            <p className="text-yellow-400 font-bold text-base mt-0.5">
                              ₦{totalSpent.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Joined:{" "}
                          <span className="text-gray-300">{joinedDate}</span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            alert(`Edit customer: ${customer.name}`)
                          }
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            alert(`Delete customer: ${customer.name}`)
                          }
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition border border-red-500/20"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-zinc-800 flex-shrink-0">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Customer Profile
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Complete customer information and purchase analytics
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="w-10 h-10 rounded-xl bg-zinc-900 text-white hover:bg-red-600 transition flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scrollable Body */}
                  <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                      <div className="w-24 h-24 rounded-full bg-yellow-400 text-black flex items-center justify-center text-4xl font-black flex-shrink-0">
                        {(selectedCustomer.name || "U")[0].toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {selectedCustomer.name || "Unknown User"}
                        </h2>

                        <p className="text-zinc-400 mt-1">
                          {selectedCustomer.email}
                        </p>

                        <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                          Active Customer
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mt-10">
                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Phone Number
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.phone || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Country
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.country || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Registered
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.createdAt?.toDate
                            ? selectedCustomer.createdAt
                                .toDate()
                                .toLocaleDateString()
                            : "Unknown"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Customer ID
                        </p>
                        <h3 className="mt-2 font-mono break-all text-sm text-zinc-300">
                          {selectedCustomer.id}
                        </h3>
                      </div>
                    </div>

                    {/* Purchase Analytics */}
                    <div className="mt-10">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Purchase Analytics
                      </h2>

                      {(() => {
                        const customerOrders = orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        );

                        const totalSpent = customerOrders.reduce(
                          (sum, order) => sum + Number(order.total || 0),
                          0,
                        );

                        const delivered = customerOrders.filter(
                          (order) => order.status === "Delivered",
                        ).length;

                        const pending = customerOrders.filter(
                          (order) => order.status === "Pending",
                        ).length;

                        return (
                          <div className="grid md:grid-cols-4 gap-5">
                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Orders
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-yellow-400">
                                {customerOrders.length}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Total Spent
                              </p>
                              <h1 className="text-2xl font-black mt-3 text-green-400">
                                ₦{totalSpent.toLocaleString()}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Delivered
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-emerald-400">
                                {delivered}
                              </h1>
                            </div>

                            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                              <p className="text-xs text-zinc-500 uppercase font-medium">
                                Pending
                              </p>
                              <h1 className="text-4xl font-black mt-3 text-orange-400">
                                {pending}
                              </h1>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-10">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Recent Orders
                      </h2>

                      <div className="space-y-4">
                        {orders.filter(
                          (order) => order.userId === selectedCustomer.id,
                        ).length === 0 ? (
                          <p className="text-zinc-500 text-sm bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/60 text-center">
                            No orders recorded for this customer yet.
                          </p>
                        ) : (
                          orders
                            .filter(
                              (order) => order.userId === selectedCustomer.id,
                            )
                            .slice(0, 5)
                            .map((order) => (
                              <div
                                key={order.id}
                                className="bg-zinc-900 rounded-2xl p-5 flex justify-between items-center border border-zinc-800/60"
                              >
                                <div>
                                  <h3 className="font-bold text-white">
                                    #{order.id.slice(0, 8)}
                                  </h3>
                                  <p className="text-zinc-500 text-sm mt-1">
                                    {order.createdAt?.toDate
                                      ? order.createdAt
                                          .toDate()
                                          .toLocaleDateString()
                                      : "Unknown"}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <h3 className="font-bold text-yellow-400">
                                    ₦{Number(order.total || 0).toLocaleString()}
                                  </h3>
                                  <div className="mt-2">
                                    <span
                                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        order.status === "Delivered"
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : order.status === "Pending"
                                            ? "bg-orange-500/20 text-orange-400"
                                            : "bg-zinc-800 text-zinc-300"
                                      }`}
                                    >
                                      {order.status || "Completed"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-wrap gap-4">
                      <button
                        onClick={() =>
                          alert(`Sending email to ${selectedCustomer.email}`)
                        }
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Send Email
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `Viewing all orders for ${selectedCustomer.name}`,
                          )
                        }
                        className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-bold transition text-sm"
                      >
                        View All Orders
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCustomer.id);
                          alert("Customer ID copied to clipboard!");
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Copy User ID
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `Delete customer action triggered for ${selectedCustomer.name}`,
                          )
                        }
                        className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold text-white transition text-sm"
                      >
                        Delete Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
        return (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black">Customers</h1>
                <p className="text-gray-400 mt-2">
                  Manage every registered customer from one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 outline-none focus:border-yellow-400 text-white"
                />

                <button
                  onClick={() => alert("Exporting customers...")}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Total Customers
                </p>
                <h1 className="text-4xl font-black mt-3 text-yellow-400">
                  {customers.length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Premium Users
                </p>
                <h1 className="text-4xl font-black mt-3 text-green-400">
                  {customers.filter((c) => c.role === "premium").length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Verified</p>
                <h1 className="text-4xl font-black mt-3 text-blue-400">
                  {customers.filter((c) => c.verified).length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-500 text-sm font-medium">
                  Active Today
                </p>
                <h1 className="text-4xl font-black mt-3 text-purple-400">
                  {customers.filter((c) => c.online).length}
                </h1>
              </div>
            </div>

            {/* Premium Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers
                .filter(
                  (customer) =>
                    customer.name
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
                    customer.email
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((customer) => {
                  const customerOrders = orders.filter(
                    (order) => order.userId === customer.id,
                  );

                  const totalSpent = customerOrders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0,
                  );

                  const joinedDate = customer.createdAt?.toDate
                    ? customer.createdAt.toDate().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <div
                      key={customer.id}
                      className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Top row: Avatar & Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xl">
                              {customer.name
                                ? customer.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            {/* Online Status Dot */}
                            <span
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                                customer.online ? "bg-green-500" : "bg-gray-500"
                              }`}
                            />
                          </div>

                          <div className="flex gap-2">
                            {customer.role === "premium" && (
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ⭐ Premium
                              </span>
                            )}
                            {customer.verified && (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-bold">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white">
                            {customer.name || "Unknown User"}
                          </h2>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {customer.email}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {customer.phone || "No phone added"}
                          </p>
                        </div>

                        {/* Metrics Breakdown */}
                        <div className="grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-gray-800/80 mb-6">
                          <div>
                            <p className="text-gray-500 text-xs">Orders</p>
                            <p className="text-white font-bold text-base mt-0.5">
                              {customerOrders.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Total Spent</p>
                            <p className="text-yellow-400 font-bold text-base mt-0.5">
                              ₦{totalSpent.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Joined:{" "}
                          <span className="text-gray-300">{joinedDate}</span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            alert(`Edit customer: ${customer.name}`)
                          }
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-3 rounded-xl text-xs font-bold transition text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            alert(`Delete customer: ${customer.name}`)
                          }
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition border border-red-500/20"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Customer Profile
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Complete customer information
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="w-10 h-10 rounded-xl bg-zinc-900 text-white hover:bg-red-600 transition flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                      <div className="w-24 h-24 rounded-full bg-yellow-400 text-black flex items-center justify-center text-4xl font-black flex-shrink-0">
                        {(selectedCustomer.name || "U")[0].toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {selectedCustomer.name || "Unknown User"}
                        </h2>

                        <p className="text-zinc-400 mt-1">
                          {selectedCustomer.email}
                        </p>

                        <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                          Active Customer
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mt-10">
                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Phone Number
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.phone || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Country
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.country || "Not Available"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Registered
                        </p>
                        <h3 className="mt-2 text-lg text-white">
                          {selectedCustomer.createdAt?.toDate
                            ? selectedCustomer.createdAt
                                .toDate()
                                .toLocaleDateString()
                            : "Unknown"}
                        </h3>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/60">
                        <p className="text-xs uppercase text-zinc-500 font-medium">
                          Customer ID
                        </p>
                        <h3 className="mt-2 font-mono break-all text-sm text-zinc-300">
                          {selectedCustomer.id}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
        return (
          <div>
            {/* Step 5: Header & Refresh Action */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-black">Customers</h1>
                <p className="text-gray-400 mt-2">
                  Manage customer accounts and purchase history.
                </p>
              </div>

              <button
                onClick={loadCustomers}
                className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:scale-105 transition"
              >
                Refresh
              </button>
            </div>

            {/* Step 5: Customer Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">Total Customers</p>
                <h1 className="text-4xl font-black text-yellow-400 mt-3">
                  {customers.length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">Verified</p>
                <h1 className="text-4xl font-black text-green-400 mt-3">
                  {customers.filter((c) => c.emailVerified).length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">Premium</p>
                <h1 className="text-4xl font-black text-purple-400 mt-3">
                  {customers.filter((c) => c.plan === "Premium").length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">New This Month</p>
                <h1 className="text-4xl font-black text-blue-400 mt-3">
                  {
                    customers.filter((customer) => {
                      if (!customer.createdAt?.toDate) return false;
                      const d = customer.createdAt.toDate();
                      return (
                        d.getMonth() === new Date().getMonth() &&
                        d.getFullYear() === new Date().getFullYear()
                      );
                    }).length
                  }
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl w-full md:w-1/3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Step 6: Professional Customer Table */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <table className="w-full">
                <thead className="bg-black">
                  <tr className="text-left text-gray-400">
                    <th className="p-5">Customer</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers
                    .filter(
                      (customer) =>
                        customer.name
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) ||
                        customer.email
                          ?.toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((customer) => {
                      const customerOrders = orders.filter(
                        (order) => order.userId === customer.id,
                      );

                      const totalSpent = customerOrders.reduce(
                        (sum, order) => sum + Number(order.total || 0),
                        0,
                      );

                      return (
                        <tr
                          key={customer.id}
                          className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black">
                                {customer.name
                                  ? customer.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                              <div>
                                <h2 className="font-bold">
                                  {customer.name || "Unknown"}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                  {customer.phone || "No Phone"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{customer.email}</td>
                          <td>{customerOrders.length}</td>
                          <td className="text-yellow-400 font-bold">
                            ₦{totalSpent.toLocaleString()}
                          </td>
                          <td>
                            {customer.blocked ? (
                              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
                                Blocked
                              </span>
                            ) : (
                              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                                Active
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedCustomer(customer)}
                                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                              >
                                View
                              </button>
                              <button
                                onClick={() => blockUser(customer)}
                                className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold"
                              >
                                {customer.blocked ? "Unblock" : "Block"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Step 7: Customer Profile Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-black flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full bg-black text-yellow-400 flex items-center justify-center text-3xl font-black shadow-inner">
                        {selectedCustomer.name
                          ? selectedCustomer.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>

                      <div>
                        <h2 className="text-3xl font-black">
                          {selectedCustomer.name || "Unknown User"}
                        </h2>
                        <p className="font-medium opacity-90">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="bg-black/20 p-3 rounded-xl hover:bg-black/40 transition text-black font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-black rounded-2xl p-5 border border-zinc-800">
                      <p className="text-zinc-500 text-sm">Customer ID</p>
                      <h3 className="mt-2 font-mono break-all text-gray-300">
                        {selectedCustomer.id}
                      </h3>
                    </div>

                    <div className="bg-black rounded-2xl p-5 border border-zinc-800">
                      <p className="text-zinc-500 text-sm">Account Status</p>
                      <h3
                        className={`mt-2 font-bold ${selectedCustomer.blocked ? "text-red-400" : "text-green-400"}`}
                      >
                        {selectedCustomer.blocked ? "Blocked" : "Active"}
                      </h3>
                    </div>

                    <div className="bg-black rounded-2xl p-5 border border-zinc-800">
                      <p className="text-zinc-500 text-sm">Joined</p>
                      <h3 className="mt-2 text-gray-300">
                        {selectedCustomer.createdAt?.toDate
                          ? selectedCustomer.createdAt
                              .toDate()
                              .toLocaleDateString()
                          : "Unknown"}
                      </h3>
                    </div>

                    <div className="bg-black rounded-2xl p-5 border border-zinc-800">
                      <p className="text-zinc-500 text-sm">Phone</p>
                      <h3 className="mt-2 text-gray-300">
                        {selectedCustomer.phone || "Not Added"}
                      </h3>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-zinc-800 p-6 flex justify-end gap-4 bg-zinc-950/50">
                    <button
                      onClick={() => blockUser(selectedCustomer)}
                      className={`px-5 py-3 rounded-xl font-bold transition text-black ${
                        selectedCustomer.blocked
                          ? "bg-green-400 hover:bg-green-300"
                          : "bg-red-500 hover:bg-red-400 text-white"
                      }`}
                    >
                      {selectedCustomer.blocked
                        ? "Unblock Customer"
                        : "Block Customer"}
                    </button>
                    <button
                      onClick={() =>
                        alert(`Viewing orders for ${selectedCustomer.name}`)
                      }
                      className="px-5 py-3 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300 transition"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() =>
                        alert(`Sending email to ${selectedCustomer.email}`)
                      }
                      className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        return (
          <div>
            {/* Step 5: Header & Refresh Action */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-black">Customers</h1>
                <p className="text-gray-400 mt-2">
                  Manage customer accounts and purchase history.
                </p>
              </div>

              <button
                onClick={loadCustomers}
                className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:scale-105 transition"
              >
                Refresh
              </button>
            </div>

            {/* Step 5: Customer Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">Total Customers</p>
                <h1 className="text-4xl font-black text-yellow-400 mt-3">
                  {customers.length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">Verified</p>
                <h1 className="text-4xl font-black text-green-400 mt-3">
                  {customers.filter((c) => c.emailVerified).length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">Premium</p>
                <h1 className="text-4xl font-black text-purple-400 mt-3">
                  {customers.filter((c) => c.plan === "Premium").length}
                </h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400">New This Month</p>
                <h1 className="text-4xl font-black text-blue-400 mt-3">
                  {
                    customers.filter((customer) => {
                      if (!customer.createdAt?.toDate) return false;
                      const d = customer.createdAt.toDate();
                      return (
                        d.getMonth() === new Date().getMonth() &&
                        d.getFullYear() === new Date().getFullYear()
                      );
                    }).length
                  }
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl w-full md:w-1/3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Step 6: Professional Customer Table */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <table className="w-full">
                <thead className="bg-black">
                  <tr className="text-left text-gray-400">
                    <th className="p-5">Customer</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers
                    .filter(
                      (customer) =>
                        customer.name
                          ?.toLowerCase()
                          .includes(search.toLowerCase()) ||
                        customer.email
                          ?.toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((customer) => {
                      const customerOrders = orders.filter(
                        (order) => order.userId === customer.id,
                      );

                      const totalSpent = customerOrders.reduce(
                        (sum, order) => sum + Number(order.total || 0),
                        0,
                      );

                      return (
                        <tr
                          key={customer.id}
                          className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black">
                                {customer.name
                                  ? customer.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                              <div>
                                <h2 className="font-bold">
                                  {customer.name || "Unknown"}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                  {customer.phone || "No Phone"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{customer.email}</td>
                          <td>{customerOrders.length}</td>
                          <td className="text-yellow-400 font-bold">
                            ₦{totalSpent.toLocaleString()}
                          </td>
                          <td>
                            {customer.blocked ? (
                              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
                                Blocked
                              </span>
                            ) : (
                              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                                Active
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedCustomer(customer)}
                                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                              >
                                View
                              </button>
                              <button
                                onClick={() => blockUser(customer)}
                                className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold"
                              >
                                {customer.blocked ? "Unblock" : "Block"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Step 7: Customer Profile Drawer / Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-end z-50">
                <div className="w-full max-w-md bg-gray-900 h-full p-8 overflow-y-auto border-l border-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xl">
                          {selectedCustomer.name
                            ? selectedCustomer.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {selectedCustomer.name || "Unknown"}
                          </h2>
                          <p className="text-gray-400 text-sm">
                            {selectedCustomer.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-gray-400 hover:text-white text-xl font-bold p-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-xs">Phone</p>
                        <p className="font-semibold text-sm mt-1">
                          {selectedCustomer.phone || "No Phone"}
                        </p>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-xs">Account Status</p>
                        <p
                          className={`font-semibold text-sm mt-1 ${selectedCustomer.blocked ? "text-red-400" : "text-green-400"}`}
                        >
                          {selectedCustomer.blocked ? "Blocked" : "Active"}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-4 text-white">
                      Customer Orders
                    </h3>
                    <div className="space-y-3">
                      {orders.filter((o) => o.userId === selectedCustomer.id)
                        .length === 0 ? (
                        <p className="text-gray-500 text-sm bg-black/20 p-4 rounded-xl border border-gray-800 text-center">
                          No orders placed by this customer yet.
                        </p>
                      ) : (
                        orders
                          .filter((o) => o.userId === selectedCustomer.id)
                          .map((order) => (
                            <div
                              key={order.id}
                              className="bg-black/40 p-4 rounded-xl border border-gray-800 flex justify-between items-center"
                            >
                              <div>
                                <p className="text-xs text-gray-400">
                                  Order ID: {order.id}
                                </p>
                                <p className="font-bold text-yellow-400 mt-1">
                                  ₦{Number(order.total || 0).toLocaleString()}
                                </p>
                              </div>
                              <span className="text-xs bg-gray-800 px-2.5 py-1 rounded-md text-gray-300">
                                {order.status || "Completed"}
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800 mt-6 flex gap-4">
                    <button
                      onClick={() => {
                        blockUser(selectedCustomer);
                        setSelectedCustomer(null);
                      }}
                      className={`w-full py-3 rounded-xl font-bold transition text-black ${
                        selectedCustomer.blocked
                          ? "bg-green-400 hover:bg-green-300"
                          : "bg-yellow-400 hover:bg-yellow-300"
                      }`}
                    >
                      {selectedCustomer.blocked
                        ? "Unblock Customer"
                        : "Block Customer"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "payments":
        {
          const totalRevenue = orders.reduce(
            (sum, order) => sum + Number(order.total || 0),
            0,
          );
          const calculatedRevenue = totalRevenue;

          const now = new Date();
          const monthlyRevenue = orders
            .filter((order) => {
              if (!order.createdAt?.toDate) return false;
              const d = order.createdAt.toDate();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            })
            .reduce((sum, order) => sum + Number(order.total || 0), 0);

          const deliveredOrders = orders.filter(
            (order) =>
              order.status === "Delivered" || order.status === "Completed",
          ).length;
          const pendingOrders = orders.filter(
            (order) => order.status === "Pending",
          ).length;
          const cancelledOrders = orders.filter(
            (o) => o.status === "Cancelled",
          ).length;

          return (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-black text-white">Payments</h1>
                  <p className="text-zinc-500 mt-2">
                    Revenue • Transactions • Financial Reports
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={exportPayments}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                  >
                    Export CSV
                  </button>

                  <button
                    onClick={() => alert("Exporting financial report...")}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
                  >
                    Export Report
                  </button>
                </div>
              </div>

              {/* Revenue Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Total Revenue
                  </p>
                  <h1 className="text-4xl font-black text-green-400 mt-3">
                    ₦{totalRevenue.toLocaleString()}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Monthly Revenue
                  </p>
                  <h1 className="text-4xl font-black text-yellow-400 mt-3">
                    ₦{monthlyRevenue.toLocaleString()}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Completed Payments
                  </p>
                  <h1 className="text-4xl font-black text-emerald-400 mt-3">
                    {deliveredOrders}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Pending Payments
                  </p>
                  <h1 className="text-4xl font-black text-orange-400 mt-3">
                    {pendingOrders}
                  </h1>
                </div>
              </div>

              {/* Payment Summary Bar */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                  <p className="text-emerald-400 text-sm">
                    Successful Transactions
                  </p>
                  <h1 className="text-5xl font-black mt-3 text-white">
                    {deliveredOrders}
                  </h1>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                  <p className="text-yellow-400 text-sm">Awaiting Payment</p>
                  <h1 className="text-5xl font-black mt-3 text-white">
                    {pendingOrders}
                  </h1>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                  <p className="text-red-400 text-sm">Refunded / Cancelled</p>
                  <h1 className="text-5xl font-black mt-3 text-white">
                    {cancelledOrders}
                  </h1>
                </div>
              </div>

              {/* Payment Search + Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 text-white"
                />

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Transaction History Table */}
              <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60">
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-2xl font-bold text-white">
                    Transaction History
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black text-zinc-400">
                      <tr>
                        <th className="p-4 text-left">Customer</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Method</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter((order) => {
                        const matchesSearch =
                          (order.customerName || "")
                            .toLowerCase()
                            .includes(paymentSearch.toLowerCase()) ||
                          (order.email || order.userEmail || "")
                            .toLowerCase()
                            .includes(paymentSearch.toLowerCase());

                        const matchesFilter =
                          paymentFilter === "All" ||
                          order.status === paymentFilter;

                        return matchesSearch && matchesFilter;
                      }).length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-8 text-center text-zinc-500"
                          >
                            No matching transactions found.
                          </td>
                        </tr>
                      ) : (
                        orders
                          .filter((order) => {
                            const matchesSearch =
                              (order.customerName || "")
                                .toLowerCase()
                                .includes(paymentSearch.toLowerCase()) ||
                              (order.email || order.userEmail || "")
                                .toLowerCase()
                                .includes(paymentSearch.toLowerCase());

                            const matchesFilter =
                              paymentFilter === "All" ||
                              order.status === paymentFilter;

                            return matchesSearch && matchesFilter;
                          })
                          .map((order) => (
                            <tr
                              key={order.id}
                              className="border-t border-zinc-800 hover:bg-zinc-950 transition"
                            >
                              <td className="p-4">
                                <div>
                                  <h3 className="font-semibold text-white">
                                    {order.customerName || "Unknown"}
                                  </h3>
                                  <p className="text-zinc-500 text-xs">
                                    {order.email ||
                                      order.userEmail ||
                                      "No email"}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4 font-bold text-yellow-400">
                                ₦{Number(order.total || 0).toLocaleString()}
                              </td>
                              <td className="p-4 text-zinc-300">
                                {order.paymentMethod || "Card"}
                              </td>
                              <td className="p-4">
                                {renderStatusBadge ? (
                                  renderStatusBadge(order.status)
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300">
                                    {order.status || "Completed"}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-zinc-400">
                                {order.createdAt?.toDate
                                  ? order.createdAt
                                      .toDate()
                                      .toLocaleDateString()
                                  : "--"}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => printReceipt(order)}
                                    title="Print Invoice"
                                    className="bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 text-white transition flex items-center justify-center"
                                  >
                                    <Printer size={16} />
                                  </button>
                                  <button
                                    onClick={() => copyOrderID(order.id)}
                                    title="Copy ID"
                                    className="bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 text-white transition flex items-center justify-center"
                                  >
                                    <Copy size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Analytics Section */}
              <div className="mt-12 bg-zinc-900 rounded-2xl p-8 border border-zinc-800/60">
                <h2 className="text-2xl font-bold mb-8 text-white">
                  Payment Overview
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 text-sm text-zinc-300">
                      <span>Delivered</span>
                      <span>{deliveredOrders}</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${orders.length ? (deliveredOrders / orders.length) * 100 : 0}%`,
                        }}
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm text-zinc-300">
                      <span>Pending</span>
                      <span>{pendingOrders}</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${orders.length ? (pendingOrders / orders.length) * 100 : 0}%`,
                        }}
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Financial Stats */}
              <div className="grid md:grid-cols-4 gap-6 mt-10">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Average Order</p>
                  <h2 className="text-3xl font-black text-yellow-400 mt-2">
                    ₦
                    {orders.length
                      ? Math.round(
                          calculatedRevenue / orders.length,
                        ).toLocaleString()
                      : 0}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Highest Sale</p>
                  <h2 className="text-3xl font-black text-green-400 mt-2">
                    ₦
                    {orders.length
                      ? Math.max(
                          ...orders.map((o) => Number(o.total) || 0),
                        ).toLocaleString()
                      : 0}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Transactions</p>
                  <h2 className="text-3xl font-black mt-2 text-white">
                    {orders.length}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Customers Paid</p>
                  <h2 className="text-3xl font-black text-blue-400 mt-2">
                    {new Set(orders.map((o) => o.userId).filter(Boolean)).size}
                  </h2>
                </div>
              </div>
            </>
          );
        }
        {
          const totalRevenue = orders.reduce(
            (sum, order) => sum + Number(order.total || 0),
            0,
          );
          const calculatedRevenue = totalRevenue;

          const now = new Date();
          const monthlyRevenue = orders
            .filter((order) => {
              if (!order.createdAt?.toDate) return false;
              const d = order.createdAt.toDate();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            })
            .reduce((sum, order) => sum + Number(order.total || 0), 0);

          const deliveredOrders = orders.filter(
            (order) =>
              order.status === "Delivered" || order.status === "Completed",
          ).length;
          const pendingOrders = orders.filter(
            (order) => order.status === "Pending",
          ).length;
          const cancelledOrders = orders.filter(
            (o) => o.status === "Cancelled",
          ).length;

          return (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-black text-white">Payments</h1>
                  <p className="text-zinc-500 mt-2">
                    Revenue • Transactions • Financial Reports
                  </p>
                </div>

                <button
                  onClick={() => alert("Exporting financial report...")}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
                >
                  Export Report
                </button>
              </div>

              {/* Revenue Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Total Revenue
                  </p>
                  <h1 className="text-4xl font-black text-green-400 mt-3">
                    ₦{totalRevenue.toLocaleString()}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Monthly Revenue
                  </p>
                  <h1 className="text-4xl font-black text-yellow-400 mt-3">
                    ₦{monthlyRevenue.toLocaleString()}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Completed Payments
                  </p>
                  <h1 className="text-4xl font-black text-emerald-400 mt-3">
                    {deliveredOrders}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Pending Payments
                  </p>
                  <h1 className="text-4xl font-black text-orange-400 mt-3">
                    {pendingOrders}
                  </h1>
                </div>
              </div>

              {/* Payment Summary Bar */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                  <p className="text-emerald-400 text-sm">
                    Successful Transactions
                  </p>
                  <h1 className="text-5xl font-black mt-3 text-white">
                    {deliveredOrders}
                  </h1>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                  <p className="text-yellow-400 text-sm">Awaiting Payment</p>
                  <h1 className="text-5xl font-black mt-3 text-white">
                    {pendingOrders}
                  </h1>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                  <p className="text-red-400 text-sm">Refunded / Cancelled</p>
                  <h1 className="text-5xl font-black mt-3 text-white">
                    {cancelledOrders}
                  </h1>
                </div>
              </div>

              {/* Payment Search + Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 text-white"
                />

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Transaction History Table */}
              <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60">
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-2xl font-bold text-white">
                    Transaction History
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black text-zinc-400">
                      <tr>
                        <th className="p-4 text-left">Customer</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Method</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter((order) => {
                        const matchesSearch =
                          (order.customerName || "")
                            .toLowerCase()
                            .includes(paymentSearch.toLowerCase()) ||
                          (order.email || order.userEmail || "")
                            .toLowerCase()
                            .includes(paymentSearch.toLowerCase());

                        const matchesFilter =
                          paymentFilter === "All" ||
                          order.status === paymentFilter;

                        return matchesSearch && matchesFilter;
                      }).length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-zinc-500"
                          >
                            No matching transactions found.
                          </td>
                        </tr>
                      ) : (
                        orders
                          .filter((order) => {
                            const matchesSearch =
                              (order.customerName || "")
                                .toLowerCase()
                                .includes(paymentSearch.toLowerCase()) ||
                              (order.email || order.userEmail || "")
                                .toLowerCase()
                                .includes(paymentSearch.toLowerCase());

                            const matchesFilter =
                              paymentFilter === "All" ||
                              order.status === paymentFilter;

                            return matchesSearch && matchesFilter;
                          })
                          .map((order) => (
                            <tr
                              key={order.id}
                              className="border-t border-zinc-800 hover:bg-zinc-950 transition"
                            >
                              <td className="p-4">
                                <div>
                                  <h3 className="font-semibold text-white">
                                    {order.customerName || "Unknown"}
                                  </h3>
                                  <p className="text-zinc-500 text-xs">
                                    {order.email ||
                                      order.userEmail ||
                                      "No email"}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4 font-bold text-yellow-400">
                                ₦{Number(order.total || 0).toLocaleString()}
                              </td>
                              <td className="p-4 text-zinc-300">
                                {order.paymentMethod || "Card"}
                              </td>
                              <td className="p-4">
                                {renderStatusBadge ? (
                                  renderStatusBadge(order.status)
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300">
                                    {order.status || "Completed"}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-zinc-400">
                                {order.createdAt?.toDate
                                  ? order.createdAt
                                      .toDate()
                                      .toLocaleDateString()
                                  : "--"}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Financial Stats */}
              <div className="grid md:grid-cols-4 gap-6 mt-10">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Average Order</p>
                  <h2 className="text-3xl font-black text-yellow-400 mt-2">
                    ₦
                    {orders.length
                      ? Math.round(
                          calculatedRevenue / orders.length,
                        ).toLocaleString()
                      : 0}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Highest Sale</p>
                  <h2 className="text-3xl font-black text-green-400 mt-2">
                    ₦
                    {orders.length
                      ? Math.max(
                          ...orders.map((o) => Number(o.total) || 0),
                        ).toLocaleString()
                      : 0}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Transactions</p>
                  <h2 className="text-3xl font-black mt-2 text-white">
                    {orders.length}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm">Customers Paid</p>
                  <h2 className="text-3xl font-black text-blue-400 mt-2">
                    {new Set(orders.map((o) => o.userId).filter(Boolean)).size}
                  </h2>
                </div>
              </div>
            </>
          );
        }
        {
          const totalRevenue = orders.reduce(
            (sum, order) => sum + Number(order.total || 0),
            0,
          );

          const now = new Date();
          const monthlyRevenue = orders
            .filter((order) => {
              if (!order.createdAt?.toDate) return false;
              const d = order.createdAt.toDate();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            })
            .reduce((sum, order) => sum + Number(order.total || 0), 0);

          const deliveredOrders = orders.filter(
            (order) =>
              order.status === "Delivered" || order.status === "Completed",
          ).length;
          const pendingOrders = orders.filter(
            (order) => order.status === "Pending",
          ).length;

          return (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-black text-white">Payments</h1>
                  <p className="text-zinc-500 mt-2">
                    Revenue • Transactions • Financial Reports
                  </p>
                </div>

                <button
                  onClick={() => alert("Exporting financial report...")}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
                >
                  Export Report
                </button>
              </div>

              {/* Revenue Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Total Revenue
                  </p>
                  <h1 className="text-4xl font-black text-green-400 mt-3">
                    ₦{totalRevenue.toLocaleString()}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Monthly Revenue
                  </p>
                  <h1 className="text-4xl font-black text-yellow-400 mt-3">
                    ₦{monthlyRevenue.toLocaleString()}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Completed Payments
                  </p>
                  <h1 className="text-4xl font-black text-emerald-400 mt-3">
                    {deliveredOrders}
                  </h1>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/60">
                  <p className="text-zinc-500 text-sm font-medium">
                    Pending Payments
                  </p>
                  <h1 className="text-4xl font-black text-orange-400 mt-3">
                    {pendingOrders}
                  </h1>
                </div>
              </div>

              {/* Transaction History Table */}
              <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60">
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-2xl font-bold text-white">
                    Transaction History
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black text-zinc-400">
                      <tr>
                        <th className="p-4 text-left">Customer</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Method</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-zinc-500"
                          >
                            No transaction history available.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-t border-zinc-800 hover:bg-zinc-950 transition"
                          >
                            <td className="p-4">
                              <div>
                                <h3 className="font-semibold text-white">
                                  {order.customerName || "Unknown"}
                                </h3>
                                <p className="text-zinc-500 text-xs">
                                  {order.email || order.userEmail || "No email"}
                                </p>
                              </div>
                            </td>
                            <td className="p-4 font-bold text-yellow-400">
                              ₦{Number(order.total || 0).toLocaleString()}
                            </td>
                            <td className="p-4 text-zinc-300">
                              {order.paymentMethod || "Card"}
                            </td>
                            <td className="p-4">
                              {renderStatusBadge ? (
                                renderStatusBadge(order.status)
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300">
                                  {order.status || "Completed"}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-zinc-400">
                              {order.createdAt?.toDate
                                ? order.createdAt.toDate().toLocaleDateString()
                                : "--"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );
        }
        return (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-black">Payments & Transactions</h1>
              <p className="text-gray-400 mt-2">
                View all payment records and history
              </p>
            </div>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                  <span className="text-5xl">💳</span>
                  <h3 className="text-xl font-bold mt-4">
                    No transactions yet
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Payment transactions will show up here.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center flex-wrap gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-base">
                        {order.customerName || order.email || "Customer"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        Order #{order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-400">
                        ₦{Number(order.total || 0).toLocaleString()}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 inline-block">
                        {order.paymentStatus || "Paid"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "products":
        return (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Product Catalog
              </h1>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>

            <form
              onSubmit={handleProductSubmit}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-10 space-y-4 max-w-3xl"
            >
              <h3 className="text-sm font-bold text-gray-300 border-b border-gray-800 pb-3 mb-2 flex items-center gap-2">
                <Package size={18} className="text-yellow-400" />
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Title"
                  value={form.title}
                  required
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={form.category}
                  required
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
                <input
                  type="number"
                  placeholder="Price (₦)"
                  value={form.price}
                  required
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                >
                  <option value="Digital">Digital Product</option>
                  <option value="Physical">Physical Product</option>
                  <option value="Subscription">Subscription</option>
                </select>
              </div>

              <textarea
                placeholder="Product Description"
                value={form.description}
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
              />

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition cursor-pointer"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-xl border border-gray-800"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50"
                >
                  {uploading
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Save Product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="bg-gray-800 text-gray-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) =>
                  p.title?.toLowerCase().includes(search.toLowerCase()),
                )
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-40 object-cover rounded-xl bg-gray-800 mb-4"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-800 rounded-xl mb-4 flex items-center justify-center text-gray-600">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <h3 className="font-bold text-lg">{product.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {product.category}
                      </p>
                      <p className="text-yellow-400 font-bold mt-2 text-lg">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="flex-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        );
      case "settings":
        // Calculate total revenue dynamically from orders
        const totalRevenue = orders.reduce(
          (sum, order) => sum + Number(order.total || 0),
          0,
        );

        const handleSaveSettings = () => {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
        };

        return (
          <>
            {/* Toast Notification */}
            {showToast && (
              <div className="fixed top-6 right-6 z-50 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold text-sm">
                  ✓ Changes Saved Successfully
                </span>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  System Settings
                </h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                  Configure your Black Hub platform preferences and keys.
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-lg shadow-yellow-400/10 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Administrator Profile */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Administrator
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Manage your admin account credentials
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Administrator Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Administrator Name"
                        defaultValue="Black Hub Admin"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Admin Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="Admin Email"
                        defaultValue={auth.currentUser?.email || ""}
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Store Information
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Public details displayed to your customers
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Store Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Globe className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        defaultValue="Black Hub"
                        placeholder="Store Name"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Support Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="support@blackhub.com"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="+234 800 000 0000"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Store Address
                    </label>
                    <div className="relative">
                      <span className="absolute top-3 left-3 pointer-events-none text-gray-500">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <textarea
                        rows="2"
                        placeholder="Enter store location address"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Settings Card */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Website</h2>
                    <p className="text-gray-400 text-xs">
                      Configure your public website
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Website URL
                    </label>
                    <input
                      defaultValue="https://blackhub.com"
                      placeholder="https://blackhub.com"
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Default Language
                    </label>
                    <select className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition cursor-pointer">
                      <option>English</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Default Currency
                    </label>
                    <select className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition cursor-pointer">
                      <option>NGN ₦</option>
                      <option>USD $</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Database & System Information */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      System Information
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Backend architecture & server status
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black border border-gray-800 rounded-xl text-sm">
                    <span className="text-gray-400 font-medium">Firestore</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black border border-gray-800 rounded-xl text-sm">
                    <span className="text-gray-400 font-medium">
                      Cloudinary
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black border border-gray-800 rounded-xl text-sm">
                    <span className="text-gray-400 font-medium">
                      Firebase Authentication
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                      Secure
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black border border-gray-800 rounded-xl text-sm">
                    <span className="text-gray-400 font-medium">Version</span>
                    <span className="text-white font-mono font-bold">
                      1.0.0
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black border border-gray-800 rounded-xl text-sm">
                    <span className="text-gray-400 font-medium">
                      Server Status
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      🟢 Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Storage Usage Card */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Storage Usage
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Media and database allocations
                    </p>
                  </div>
                </div>

                <div className="bg-black border border-gray-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">
                      Cloud Storage
                    </span>
                    <span className="text-yellow-400 font-bold">
                      2.8GB / 10GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full w-[28%] transition-all duration-500"></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    28% of total allocated cloud storage used.
                  </p>
                </div>
              </div>

              {/* Platform Statistics Card */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Platform Statistics
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Real-time marketplace metrics overview
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-medium">
                      Products
                    </p>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {products.length}
                    </h3>
                  </div>
                  <div className="bg-black border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-medium">
                      Customers
                    </p>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {customers.length}
                    </h3>
                  </div>
                  <div className="bg-black border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-medium">Orders</p>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {orders.length}
                    </h3>
                  </div>
                  <div className="bg-black border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-medium">Revenue</p>
                    <h3 className="text-xl font-black text-yellow-400 mt-1 truncate">
                      ₦{totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Theme & Appearance */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Appearance & Theme
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Customize the admin dashboard interface
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">Dark Mode</p>
                      <p className="text-xs text-gray-400">
                        Always enabled theme preference
                      </p>
                    </div>
                    <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold px-3 py-1 rounded-full">
                      ON
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Accent Color
                      </p>
                      <p className="text-xs text-gray-400">
                        Primary UI highlight theme
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block shadow-sm shadow-yellow-400"></span>
                      <span className="text-sm font-bold text-white">
                        Yellow
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">Rounded UI</p>
                      <p className="text-xs text-gray-400">
                        Smooth border radius styling
                      </p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Access */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Security & Access
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Configure platform protection rules
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-gray-400">
                        Temporarily close storefront for updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-yellow-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-gray-400">
                        Require OTP verification for admin logins
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 accent-yellow-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/30 bg-red-500/[0.02] rounded-2xl p-6 mt-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-red-400 font-bold text-lg">Danger Zone</h2>
              </div>
              <p className="text-gray-500 text-sm ml-11">
                These actions are critical and cannot be undone. Proceed with
                caution.
              </p>

              <div className="flex flex-wrap gap-3 mt-6 ml-0 sm:ml-11">
                <button
                  onClick={() => alert("Notifications cleared!")}
                  className="bg-black hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Clear Notifications
                </button>
                <button
                  onClick={() => alert("Messages deleted!")}
                  className="bg-black hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Messages
                </button>
                <button
                  onClick={() => alert("Database export initiated...")}
                  className="bg-black hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Database
                </button>
                <button
                  onClick={() =>
                    alert(
                      "Action restricted: Cannot delete active store orders.",
                    )
                  }
                  className="bg-black hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Orders
                </button>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 space-y-1">
              <p className="font-bold text-gray-400">Black Hub Admin Panel</p>
              <p>Version 1.0.0 • Powered by Firebase</p>
              <p>© 2026 Black Hub. All rights reserved.</p>
            </footer>
          </>
        );
        return (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  System Settings
                </h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                  Configure your Black Hub platform preferences and keys.
                </p>
              </div>

              <button
                onClick={() => alert("All system settings saved successfully!")}
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-lg shadow-yellow-400/10 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Administrator Profile */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Administrator
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Manage your admin account credentials
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Administrator Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Administrator Name"
                        defaultValue="Black Hub Admin"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Admin Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="Admin Email"
                        defaultValue={auth.currentUser?.email || ""}
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Store Information
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Public details displayed to your customers
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Store Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Globe className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        defaultValue="Black Hub"
                        placeholder="Store Name"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Support Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="support@blackhub.com"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="+234 800 000 0000"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Store Address
                    </label>
                    <div className="relative">
                      <span className="absolute top-3 left-3 pointer-events-none text-gray-500">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <textarea
                        rows="2"
                        placeholder="Enter store location address"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Access */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Security & Access
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Configure platform protection rules
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-gray-400">
                        Temporarily close storefront for updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-yellow-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-gray-400">
                        Require OTP verification for admin logins
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 accent-yellow-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway & Keys */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Payment & API Keys
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Manage payment gateway credentials
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Paystack Public Key
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Key className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        defaultValue="pk_live_********************************"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Flutterwave Secret Key
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Key className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        defaultValue="FLWSECK_TEST-********************************"
                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:border-yellow-400 outline-none text-white text-sm transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
        return (
          <>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black">System Settings</h1>
                <p className="text-gray-400 mt-2">
                  Configure your Black Hub platform.
                </p>
              </div>

              <button
                onClick={() => alert("Settings saved successfully!")}
                className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Admin Profile */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">👤 Administrator</h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Administrator Name"
                    defaultValue="Black Hub Admin"
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white"
                  />

                  <input
                    type="email"
                    placeholder="Admin Email"
                    defaultValue={auth.currentUser?.email || ""}
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white"
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white"
                  />
                </div>
              </div>

              {/* Store Settings */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">🏪 Store Information</h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    defaultValue="Black Hub"
                    placeholder="Store Name"
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white"
                  />

                  <input
                    type="email"
                    placeholder="Support Email"
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white"
                  />

                  <textarea
                    rows="4"
                    placeholder="Store Address"
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-yellow-400 outline-none text-white resize-none"
                  />
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            borderColor: "#27272a",
            border: "1px solid #27272a",
          },
        }}
      />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-800 bg-black/50 backdrop-blur-xl p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex justify-center items-center font-black text-xl">
              B
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight">BLACK HUB</h2>
              <p className="text-[10px] text-gray-500 font-mono uppercase">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {renderContent()}
      </main>

      {/* DELIVERY MODAL */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
          <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Deliver Digital Product
                </h2>
                <p className="text-gray-500 mt-1 font-mono text-xs">
                  Order #{deliveryModalOrder.id.slice(0, 8)}
                </p>
              </div>

              <button
                onClick={() => setDeliveryModalOrder(null)}
                className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-red-600 transition flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeliverOrder} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Customer Email"
                  required
                  value={deliveryForm.email}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, email: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition"
                />
                <input
                  type="text"
                  placeholder="Password / Access Key"
                  required
                  value={deliveryForm.password}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      password: e.target.value,
                    })
                  }
                  className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <input
                type="text"
                placeholder="Download Link"
                value={deliveryForm.downloadLink}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    downloadLink: e.target.value,
                  })
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition"
              />

              <input
                type="text"
                placeholder="License Key"
                value={deliveryForm.licenseKey}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    licenseKey: e.target.value,
                  })
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition font-mono"
              />

              <textarea
                rows={3}
                placeholder="Notes or instructions for customer..."
                value={deliveryForm.notes}
                onChange={(e) =>
                  setDeliveryForm({ ...deliveryForm, notes: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition resize-none"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOrder(null)}
                  className="px-5 py-2.5 bg-gray-900 text-gray-300 rounded-xl hover:bg-gray-800 transition text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition text-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send size={14} />
                  {uploading ? "Delivering..." : "Deliver Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-8 border-b border-gray-800">
              <div>
                <h2 className="text-3xl font-black">Order Details</h2>
                <p className="text-gray-500 mt-2 font-mono text-sm">
                  #{viewOrder.id}
                </p>
              </div>

              <button
                onClick={() => setViewOrder(null)}
                className="w-12 h-12 rounded-xl bg-gray-900 hover:bg-red-600 transition flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-5">
                <h3 className="font-bold text-xl">Customer</h3>
                <div className="bg-gray-900 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">Name</p>
                  <h2 className="font-bold text-xl mt-1">
                    {viewOrder.customerName || "Anonymous"}
                  </h2>
                </div>
                <div className="bg-gray-900 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">Email</p>
                  <h2 className="font-bold text-base mt-1 text-gray-300">
                    {viewOrder.email || "No email provided"}
                  </h2>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="font-bold text-xl">Payment</h3>
                <div className="bg-gray-900 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">Amount</p>
                  <h2 className="text-4xl font-black text-yellow-400 mt-1">
                    ₦{Number(viewOrder.total || 0).toLocaleString()}
                  </h2>
                </div>
                <div className="bg-gray-900 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">Status</p>
                  <div className="mt-2">
                    {renderStatusBadge(viewOrder.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <h2 className="font-bold text-2xl mb-6">Purchased Items</h2>
              <div className="space-y-4">
                {viewOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-2xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-base">{item.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      ₦{Number(item.price || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 p-8 flex flex-wrap gap-4 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewOrder.id);
                  toast.success("Order ID copied to clipboard!");
                }}
                className="bg-gray-900 px-6 py-3 rounded-xl hover:bg-gray-800 transition font-bold text-sm flex items-center gap-2"
              >
                <Copy size={18} />
                Copy ID
              </button>

              <button
                onClick={() => generateInvoice(viewOrder)}
                className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-500 transition font-bold text-sm text-white flex items-center gap-2"
              >
                <Printer size={18} />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const navigationTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart3 size={18} />,
  },
  {
    id: "products",
    label: "Products",
    icon: <Package size={18} />,
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart size={18} />,
  },
  {
    id: "customers",
    label: "Customers",
    icon: <Users size={18} />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard size={18} />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11.983 13.938a2 2 0 100-3.876 2 2 0 000 3.876z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9A1.65 1.65 0 0010 3.09V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .69.4 1.31 1.02 1.59.18.08.37.12.57.12H21a2 2 0 110 4h-.09c-.2 0-.39.04-.57.12-.62.28-1.02.9-1.02 1.59z"
        />
      </svg>
    ),
  },
];
