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
  BarChart3,
  Trash2,
  Plus,
  Clock,
  Eye,
  Download,
  Shield,
  TrendingUp,
  Activity,
  LogOut,
  Pencil,
  Image as ImageIcon,
  Printer,
  User,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Send,
  Lock,
  Sparkles,
  Crown,
  Gift,
  Zap,
  ChevronDown,
  Menu,
  Grid,
  LayoutGrid,
  List,
  Settings,
  HelpCircle,
  CreditCard,
  Truck,
  Star,
  Award,
  Target,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ArrowUp,
  ArrowDown,
  Circle,
  ArrowRight,
  Home,
  Briefcase,
  Layers,
  Database,
  Cloud,
  Server,
  Wifi,
  Cpu,
  Globe,
  ShieldCheck,
  BadgeCheck,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
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
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import { auth, db } from "../firebase/firebase";

// ==========================================
// ANIMATED COUNTER COMPONENT
// ==========================================
const AnimatedCounter = ({
  end,
  prefix = "",
  duration = 1500,
  suffix = "",
}) => {
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
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(
        easeOutQuart * (numericEnd - startValue) + startValue,
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
      {suffix}
    </span>
  );
};

// ==========================================
// LIVE CLOCK COMPONENT
// ==========================================
const LiveClock = React.memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-2">
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      {time.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })}{" "}
      • {time.toLocaleTimeString()}
    </p>
  );
});

// ==========================================
// STATUS BADGE COMPONENT
// ==========================================
const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  const icons = {
    Delivered: <CheckCircle className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Processing: <Activity className="w-3 h-3" />,
    Cancelled: <X className="w-3 h-3" />,
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs rounded-full font-semibold tracking-wide inline-flex items-center gap-1.5 border ${styles[status] || styles.Pending}`}
    >
      {icons[status] || icons.Pending}
      {status || "Pending"}
    </span>
  );
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState([]);
  const [, setMessages] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
        user.blocked ? "User Unblocked" : "User Blocked",
        `${user.name || user.email} has been ${user.blocked ? "unblocked" : "blocked"}`,
      );

      await addNotification(
        user.blocked ? "User Unblocked" : "User Blocked",
        `${user.name || user.email} has been ${user.blocked ? "unblocked" : "blocked"}`,
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

  function printReceipt(order) {
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #fff; }
            h1 { color: #333; border-bottom: 2px solid #fbbf24; padding-bottom: 10px; }
            .invoice { max-width: 600px; margin: 0 auto; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 20px; font-weight: bold; color: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <h1>BLACK HUB</h1>
            <h3>Invoice #${order.id.slice(0, 8)}</h3>
            <div class="row"><span>Customer:</span> <strong>${order.customerName || "Unknown"}</strong></div>
            <div class="row"><span>Email:</span> ${order.email || order.userEmail || "N/A"}</div>
            <div class="row"><span>Total:</span> <strong>₦${Number(order.total || 0).toLocaleString()}</strong></div>
            <div class="row"><span>Status:</span> ${order.status || "Completed"}</div>
            <div class="row"><span>Date:</span> ${order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "N/A"}</div>
            <div class="row total"><span>Total Amount:</span> ₦${Number(order.total || 0).toLocaleString()}</div>
          </div>
        </body>
      </html>
    `);
    win.print();
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
      { name: "Delivered", value: deliveredOrders },
      { name: "Pending", value: pendingOrders },
      {
        name: "Cancelled",
        value: orders.filter((o) => o.status === "Cancelled").length,
      },
    ],
    [deliveredOrders, pendingOrders, orders],
  );

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      color: "text-amber-400",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      color: "text-blue-400",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      color: "text-emerald-400",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      color: "text-purple-400",
    },
  ];

  // ------------------------------------------
  // TAB CONTENT RENDERER
  // ------------------------------------------
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  Dashboard Overview
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono animate-pulse">
                    ● Live
                  </span>
                </h1>
                <LiveClock />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("products")}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-gray-950 font-black rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ShoppingCart className="w-4 h-4 text-amber-400" /> Orders
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 rounded-2xl p-5 transition-all duration-300 group shadow-xl shadow-amber-500/5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 group-hover:text-amber-400 transition">
                      <AnimatedCounter prefix="₦" end={calculatedRevenue} />
                    </h3>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 transition">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.5% this month</span>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-300 group shadow-xl shadow-emerald-500/5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Monthly Revenue
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 group-hover:text-emerald-400 transition">
                      <AnimatedCounter prefix="₦" end={monthlyRevenue} />
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-zinc-400">
                  This month's earnings
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-300 group shadow-xl shadow-blue-500/5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Total Orders
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 group-hover:text-blue-400 transition">
                      <AnimatedCounter end={orders.length} />
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pendingOrders} pending delivery</span>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/30 rounded-2xl p-5 transition-all duration-300 group shadow-xl shadow-purple-500/5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Customers
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 group-hover:text-purple-400 transition">
                      <AnimatedCounter end={customers.length} />
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-zinc-400">
                  Registered users
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <BarChartIcon className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Monthly Revenue Overview
                  </h3>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#fbbf24"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#fbbf24"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#FFF",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                        radius={[6, 6, 0, 0]}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Order Status</h3>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusChart.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />{" "}
                    Delivered
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />{" "}
                    Pending
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />{" "}
                    Cancelled
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Recent Orders
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300 min-w-[600px]">
                  <thead className="bg-zinc-800/50 text-zinc-400 text-xs uppercase">
                    <tr>
                      <th className="p-3 rounded-l-lg">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-zinc-800/30 transition"
                      >
                        <td className="p-3 font-mono text-amber-400 font-bold">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="p-3 font-medium text-white">
                          {order.customerName || "Anonymous"}
                        </td>
                        <td className="p-3 font-bold text-white">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setViewOrder(order)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "products":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <Package className="w-6 h-6 text-amber-400" />
                  Product Management
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Add, update, or remove products in your store
                </p>
              </div>
            </div>

            {/* Product Form */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 rounded-2xl p-4 sm:p-6 transition-all duration-300 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {editingId ? (
                  <Pencil className="w-4 h-4 text-amber-400" />
                ) : (
                  <Plus className="w-4 h-4 text-amber-400" />
                )}
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g. Premium Software License"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      placeholder="e.g. Subscriptions, Keys, Digital"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="5000"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Product Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm transition"
                    >
                      <option value="Digital">Digital Account / License</option>
                      <option value="Physical">Physical Product</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Provide detailed description or delivery instructions..."
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Product Image
                    </label>
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
                      className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-amber-400 hover:file:bg-zinc-700 transition"
                    />
                  </div>
                  {preview && (
                    <div className="flex items-center gap-3">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-zinc-700"
                      />
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />{" "}
                        Image Ready
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-gray-950 font-black rounded-xl transition-all shadow-lg shadow-amber-400/20 cursor-pointer text-sm disabled:opacity-50"
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
                      className="px-6 py-2.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-xl transition-all text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Products Catalog ({products.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group"
                  >
                    <div>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-36 object-cover rounded-xl mb-3 border border-zinc-800 group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-36 bg-zinc-800 rounded-xl mb-3 flex items-center justify-center text-zinc-600">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                        {product.category || "General"}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1 group-hover:text-amber-400 transition">
                        {product.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/80">
                      <span className="text-lg font-black text-amber-400">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-amber-400" />
                  Orders Management
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Track and fulfill digital software and account deliveries
                </p>
              </div>
              <button
                onClick={exportOrdersCSV}
                className="px-4 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" /> Export CSV
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300 min-w-[700px]">
                  <thead className="bg-zinc-800/50 text-zinc-400 text-xs uppercase">
                    <tr>
                      <th className="p-3.5 rounded-l-lg">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-zinc-800/30 transition"
                      >
                        <td className="p-3.5 font-mono text-amber-400 font-bold">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-white">
                            {order.customerName || "Anonymous"}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {order.email || order.userEmail}
                          </div>
                        </td>
                        <td className="p-3.5 text-xs text-zinc-400">
                          {order.createdAt?.toDate
                            ? order.createdAt.toDate().toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status !== "Delivered" && (
                              <button
                                onClick={() => {
                                  setDeliveryModalOrder(order);
                                  setDeliveryForm({
                                    email: order.delivery?.email || "",
                                    password: order.delivery?.password || "",
                                    notes: order.delivery?.notes || "",
                                    downloadLink:
                                      order.delivery?.downloadLink || "",
                                    licenseKey:
                                      order.delivery?.licenseKey || "",
                                    expiryDate:
                                      order.delivery?.expiryDate || "",
                                  });
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-gray-950 font-black rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" /> Deliver
                              </button>
                            )}
                            <button
                              onClick={() => printReceipt(order)}
                              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                              title="Print Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewOrder(order)}
                              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-lg transition-all"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <Users className="w-6 h-6 text-amber-400" />
                  Customers Directory
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage registered user accounts and permissions
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300 min-w-[650px]">
                  <thead className="bg-zinc-800/50 text-zinc-400 text-xs uppercase">
                    <tr>
                      <th className="p-3.5 rounded-l-lg">User</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Verified</th>
                      <th className="p-3.5">Premium</th>
                      <th className="p-3.5 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {customers
                      .filter(
                        (c) =>
                          c.name
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          c.email?.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-zinc-800/30 transition"
                        >
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-bold text-xs">
                                {customer.name?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {customer.name || "User"}
                                </div>
                                <div className="text-xs text-zinc-500">
                                  {customer.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            {customer.blocked ? (
                              <span className="px-2.5 py-1 text-xs rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                                Blocked
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleVerify(customer.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                                customer.verified
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white"
                              }`}
                            >
                              {customer.verified ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                              ) : (
                                "Unverified"
                              )}
                            </button>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleTogglePremium(customer.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                                customer.premium
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white"
                              }`}
                            >
                              {customer.premium ? (
                                <span className="flex items-center gap-1">
                                  <Crown className="w-3 h-3" /> VIP
                                </span>
                              ) : (
                                "Standard"
                              )}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedCustomer(customer)}
                                className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => blockUser(customer)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  customer.blocked
                                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                }`}
                              >
                                {customer.blocked ? "Unblock" : "Block"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col md:flex-row font-sans selection:bg-amber-400 selection:text-black">
      {/* Aurora Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32" />
        <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-48 -left-32" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <Toaster position="top-right" />

      {/* ========================================== */}
      {/* DESKTOP SIDEBAR                           */}
      {/* ========================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950/90 backdrop-blur-xl border-r border-amber-500/20 min-h-screen p-5 sticky top-0 h-screen justify-between z-30 shadow-2xl shadow-amber-500/5">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center font-black text-gray-950 text-xl shadow-lg shadow-amber-400/20">
              B
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white tracking-wider bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                BLACK HUB
              </h2>
              <p className="text-[10px] text-amber-400/60 uppercase tracking-widest font-mono">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-950 shadow-lg shadow-amber-400/20"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${activeTab === item.id ? "text-gray-950" : item.color}`}
                />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gray-950" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-zinc-800/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                Admin User
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                admin@blackhub.com
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT                              */}
      {/* ========================================== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden relative z-10">
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800/60">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center font-black text-gray-950 text-sm">
              B
            </div>
            <span className="font-extrabold text-base text-white tracking-wider bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              BLACK HUB
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-950 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-950/95 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/10 p-4 z-50 animate-fadeIn">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      Notifications
                    </h4>
                    <span className="text-[10px] text-zinc-400">
                      {notifications.length} alerts
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-4">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            n.read
                              ? "bg-zinc-800/30 text-zinc-400"
                              : "bg-zinc-800/60 text-white border-l-2 border-amber-400"
                          }`}
                        >
                          <p className="font-bold">{n.title}</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="md:hidden p-2.5 bg-zinc-950/80 border border-zinc-800 hover:border-rose-500/30 rounded-xl text-rose-400 hover:text-rose-300 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        {renderContent()}
      </main>

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAV                         */}
      {/* ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-amber-500/20 z-40 px-3 py-2 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-amber-400 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================== */}
      {/* MODALS                                    */}
      {/* ========================================== */}
      {/* Delivery Modal */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950/95 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 relative animate-fadeIn shadow-2xl shadow-amber-500/10">
            <button
              onClick={() => setDeliveryModalOrder(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" /> Deliver Digital Items
            </h3>
            <p className="text-xs text-zinc-400">
              Order #{deliveryModalOrder.id.slice(0, 8)} • Customer:{" "}
              {deliveryModalOrder.customerName || "User"}
            </p>

            <form onSubmit={handleDeliverOrder} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
                  Account Email
                </label>
                <input
                  type="text"
                  value={deliveryForm.email}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
                  Account Password
                </label>
                <input
                  type="text"
                  value={deliveryForm.password}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
                  License Key / Activation Code
                </label>
                <input
                  type="text"
                  value={deliveryForm.licenseKey}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      licenseKey: e.target.value,
                    })
                  }
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
                  Download / Access Link
                </label>
                <input
                  type="url"
                  value={deliveryForm.downloadLink}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      downloadLink: e.target.value,
                    })
                  }
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={deliveryForm.notes}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, notes: e.target.value })
                  }
                  placeholder="Instructions for customer..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOrder(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-gray-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? "Delivering..." : "Confirm Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950/95 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 relative animate-fadeIn shadow-2xl shadow-amber-500/10">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" /> Order Details
            </h3>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Order ID</span>
                <span className="font-mono text-amber-400 font-bold">
                  #{viewOrder.id}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Customer</span>
                <span className="font-medium text-white">
                  {viewOrder.customerName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Email</span>
                <span className="text-white">
                  {viewOrder.email || viewOrder.userEmail || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Total</span>
                <span className="font-bold text-amber-400">
                  ₦{Number(viewOrder.total || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Status</span>
                <StatusBadge status={viewOrder.status} />
              </div>

              {viewOrder.delivery && (
                <div className="mt-4 p-4 bg-zinc-900/80 rounded-xl border border-amber-500/20 space-y-2">
                  <p className="font-bold text-amber-400 flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4" /> Delivery Details:
                  </p>
                  {viewOrder.delivery.email && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Email</span>
                      <span className="text-white">
                        {viewOrder.delivery.email}
                      </span>
                    </div>
                  )}
                  {viewOrder.delivery.password && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Password</span>
                      <span className="text-white font-mono">
                        {viewOrder.delivery.password}
                      </span>
                    </div>
                  )}
                  {viewOrder.delivery.licenseKey && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">License Key</span>
                      <span className="text-amber-400 font-mono text-[10px]">
                        {viewOrder.delivery.licenseKey}
                      </span>
                    </div>
                  )}
                  {viewOrder.delivery.downloadLink && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Download</span>
                      <a
                        href={viewOrder.delivery.downloadLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Link
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewOrder(null)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950/95 border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 relative animate-fadeIn shadow-2xl shadow-amber-500/10">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-2xl font-bold text-black flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-400/20">
                {selectedCustomer.name?.[0]?.toUpperCase() || "U"}
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedCustomer.name || "Customer"}
              </h3>
              <p className="text-xs text-zinc-400">{selectedCustomer.email}</p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Status</span>
                <span
                  className={
                    selectedCustomer.blocked
                      ? "text-rose-400 font-bold"
                      : "text-emerald-400 font-bold"
                  }
                >
                  {selectedCustomer.blocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Verified</span>
                <span className="text-white font-bold">
                  {selectedCustomer.verified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Membership</span>
                <span className="text-amber-400 font-bold">
                  {selectedCustomer.premium ? "VIP Premium" : "Standard"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Joined</span>
                <span className="text-white text-[10px]">
                  {selectedCustomer.createdAt?.toDate
                    ? selectedCustomer.createdAt.toDate().toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
