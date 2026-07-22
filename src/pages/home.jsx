import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Zap,
  Globe,
  MessageCircle,
  ArrowRight,
  Menu,
  X,
  Star,
  Search,
  ShoppingCart,
  Eye,
  Heart,
  CheckCircle,
  Lock,
  Smartphone,
  Server,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Flame,
  User,
  Bell,
  Check,
  Download,
  Plus,
  Trash2,
  Package,
  Settings,
  TrendingUp,
  DollarSign,
  Tag,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Gift,
  Award,
  RefreshCw,
  Share2,
  Shield,
  Key,
  PieChart,
  Calendar,
  Upload,
  AlertTriangle,
  FileText,
  CreditCard,
} from "lucide-react";

// --- AURORA BACKGROUND GLOW COMPONENT ---
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[40%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent blur-[120px] animate-pulse"></div>
      <div
        className="absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-purple-500/10 via-yellow-500/5 to-transparent blur-[150px] animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>
    </div>
  );
}

// --- TILT CARD COMPONENT (Pure React & CSS) ---
function TiltCard({ children, className = "", onClick }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX(((y - yc) / yc) * -8);
    setRotateY(((x - xc) / xc) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800/80 p-1 group cursor-pointer transition-transform duration-200 ease-out hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] ${className}`}
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-yellow-500/50 via-transparent to-yellow-500/20 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
      <div className="relative z-10 bg-zinc-950 rounded-[22px] h-full flex flex-col justify-between p-6">
        {children}
      </div>
    </div>
  );
}

// --- DATASETS ---
const aiSearchDatabase = [
  {
    id: 101,
    name: "Google Voice USA",
    category: "Communications",
    price: 4500,
    queryKeys: ["goog", "google", "voice", "usa", "netf"],
  },
  {
    id: 102,
    name: "Google Voice UK",
    category: "Communications",
    price: 4800,
    queryKeys: ["goog", "google", "voice", "uk"],
  },
  {
    id: 103,
    name: "Nord VPN Premium",
    category: "Security",
    price: 2500,
    queryKeys: ["vpn", "nord", "secure"],
  },
  {
    id: 104,
    name: "Express VPN 1 Year",
    category: "Security",
    price: 3500,
    queryKeys: ["vpn", "express"],
  },
  {
    id: 105,
    name: "Surfshark VPN",
    category: "Security",
    price: 2800,
    queryKeys: ["vpn", "surfshark"],
  },
  {
    id: 106,
    name: "Netflix UHD Private",
    category: "Entertainment",
    price: 3000,
    queryKeys: ["net", "netflix", "uhd", "netf"],
  },
  {
    id: 107,
    name: "USDT Instant Liquidity",
    category: "Crypto",
    price: 1650,
    queryKeys: ["crypto", "usdt", "btc"],
  },
  {
    id: 108,
    name: "Disney+ Streaming Profile",
    category: "Entertainment",
    price: 2800,
    queryKeys: ["disney", "streaming"],
  },
];

const categories = [
  {
    name: "Google Voice",
    slug: "google-voice",
    icon: Globe,
    desc: "Verified USA phone numbers",
  },
  {
    name: "VPN Services",
    slug: "vpn",
    icon: ShieldCheck,
    desc: "Secure browsing worldwide",
  },
  {
    name: "Crypto Assets",
    slug: "crypto",
    icon: Zap,
    desc: "USDT & BTC instant liquidity",
  },
  {
    name: "Gift Cards",
    slug: "gift-cards",
    icon: Layers,
    desc: "Global store credit codes",
  },
  {
    name: "Netflix Premium",
    slug: "netflix",
    icon: Server,
    desc: "UHD private & shared accounts",
  },
  {
    name: "Virtual Numbers",
    slug: "virtual-numbers",
    icon: Smartphone,
    desc: "OTP verification numbers",
  },
];

const shopProducts = [
  {
    id: 1,
    name: "Google Voice USA",
    category: "google-voice",
    price: 4500,
    rating: 5,
    badge: "Best Seller",
    stock: 2,
    description:
      "Fully verified USA Google Voice numbers with recovery email and instant push delivery.",
  },
  {
    id: 2,
    name: "Google Voice UK",
    category: "google-voice",
    price: 4800,
    rating: 5,
    badge: "Popular",
    stock: 14,
    description:
      "UK virtual line for seamless global registration and secure two-factor auth.",
  },
  {
    id: 3,
    name: "Netflix UHD Private",
    category: "netflix",
    price: 3000,
    rating: 5,
    badge: "Hot",
    stock: 19,
    description:
      "Ultra HD 4K private streaming profile with custom PIN lock and zero interruption.",
  },
  {
    id: 4,
    name: "NordVPN 1 Year",
    category: "vpn",
    price: 2500,
    rating: 4,
    badge: "Secure",
    stock: 3,
    description:
      "High-speed encrypted proxy tunnels across 60+ global server locations.",
  },
  {
    id: 5,
    name: "ExpressVPN Secure",
    category: "vpn",
    price: 3500,
    rating: 5,
    badge: "Top Rated",
    stock: 22,
    description:
      "Trusted server technology with private DNS and ultra-low latency.",
  },
  {
    id: 6,
    name: "USDT Escrow Transfer",
    category: "crypto",
    price: 1650,
    rating: 5,
    badge: "Crypto",
    stock: 100,
    description:
      "Instant blockchain liquidation with multi-signature security assurance.",
  },
  {
    id: 7,
    name: "Steam $50 Gift Card",
    category: "gift-cards",
    price: 38000,
    rating: 4,
    badge: "Global",
    stock: 5,
    description:
      "Instant digital code redeemable on any regional Steam store front.",
  },
  {
    id: 8,
    name: "Disney+ Streaming Profile",
    category: "netflix",
    price: 2800,
    rating: 5,
    badge: "New",
    stock: 31,
    description:
      "Full HD Disney+ profile with immersive spatial audio and offline downloads.",
  },
];

const livePurchasesFeed = [
  { name: "John", location: "Abuja", item: "NordVPN", time: "2 minutes ago" },
  {
    name: "Chinedu",
    location: "Lagos",
    item: "Google Voice USA",
    time: "5 minutes ago",
  },
  {
    name: "Amina",
    location: "Kano",
    item: "USDT Escrow Transfer",
    time: "12 minutes ago",
  },
  {
    name: "Tunde",
    location: "Port Harcourt",
    item: "Netflix UHD Private",
    time: "18 minutes ago",
  },
];

export default function BlackHubMasterApp() {
  // Navigation & Global State
  const [currentView, setCurrentView] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Cart & Drawer State
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([
    { id: 1, name: "Google Voice USA", price: 4500, qty: 1 },
    { id: 3, name: "Netflix UHD Private", price: 3000, qty: 2 },
  ]);
  const [cartBadgeAnimated, setCartBadgeAnimated] = useState(false);

  // Intelligence & History State
  const [recentlyViewed, setRecentlyViewed] = useState([
    shopProducts[0],
    shopProducts[2],
    shopProducts[5],
  ]);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState([]);

  // Trust & Social Proof State
  const [liveVisitorCount] = useState(128);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [showLivePopup, setShowLivePopup] = useState(true);

  // Gamification State
  const [rewardPoints, setRewardPoints] = useState(520);
  const [spinResult, setSpinResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Selected Product Detail State
  const [activeProduct, setActiveProduct] = useState(shopProducts[0]);

  // Checkout State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "Matthew Adebayo",
    phone: "+234 808 858 0173",
    email: "matthew@blackhub.io",
    address: "Plot 14, Victoria Island Enterprise Zone, Lagos",
  });

  // Shop Filters
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Admin State
  const [adminProducts, setAdminProducts] = useState(shopProducts);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Scroll listener & Scroll Progress Bar (Pure JS/CSS)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const totalScroll =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live Purchase Popup Rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLivePopup(false);
      setTimeout(() => {
        setCurrentPopupIndex((prev) => (prev + 1) % livePurchasesFeed.length);
        setShowLivePopup(true);
      }, 300);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Smart Search Matching
  useEffect(() => {
    if (aiQuery.trim().length > 0) {
      const q = aiQuery.toLowerCase();
      const filtered = aiSearchDatabase.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.queryKeys.some((k) => k.includes(q)),
      );
      setAiResults(filtered);
    } else {
      setAiResults([]);
    }
  }, [aiQuery]);

  // Cart Helper Functions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, qty: 1 },
      ];
    });

    setCartBadgeAnimated(true);
    setTimeout(() => setCartBadgeAnimated(false), 400);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const openProductDetail = (prod) => {
    setActiveProduct(prod);
    setCurrentView("product");
    window.scrollTo({ top: 0, behavior: "smooth" });

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== prod.id);
      return [prod, ...filtered].slice(0, 4);
    });
  };

  const spinTheWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    setTimeout(() => {
      const rewards = ["10% OFF", "Free Delivery", "5% OFF", "20% OFF"];
      const outcome = rewards[Math.floor(Math.random() * rewards.length)];
      setSpinResult(outcome);
      setIsSpinning(false);
      if (outcome.includes("10%")) setAppliedDiscount(10);
      else if (outcome.includes("20%")) setAppliedDiscount(20);
    }, 1500);
  };

  const processCheckoutPayment = () => {
    setCheckoutStep(2);
    setPaymentStatusMessage("Connecting to Paystack Secure Gateway...");
    setTimeout(() => {
      setPaymentStatusMessage("🔒 Encrypting Payment & Escrow Funds...");
      setTimeout(() => {
        setPaymentStatusMessage("✔ Payment Confirmed! Redirecting...");
        setTimeout(() => {
          const generatedId =
            "#BH-" + Math.floor(10000 + Math.random() * 90000);
          setOrderId(generatedId);
          setCheckoutStep(4);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-zinc-50 text-zinc-900"} selection:bg-yellow-400 selection:text-black antialiased overflow-x-hidden relative font-sans`}
    >
      {/* Scroll Progress Bar (Pure CSS transition) */}
      <div
        className="fixed top-0 left-0 h-1 bg-yellow-400 z-[999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Live Visitor Count Banner */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-400 text-black py-2 px-4 text-center font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 relative z-50 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping"></span>
        <span>
          👥 {liveVisitorCount} elite users browsing Black Hub right now
        </span>
      </div>

      {/* Glass Navigation Header */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? `top-8 ${darkMode ? "bg-black/90 border-zinc-800/80" : "bg-white/90 border-zinc-200"} backdrop-blur-md border-b py-3 shadow-xl`
            : "top-8 bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <button
            onClick={() => {
              setCurrentView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-yellow-400/20 transform transition group-hover:rotate-6">
              BH
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide uppercase">
                Black Hub
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                Enterprise OS
              </p>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {["home", "shop", "dashboard", "admin"].map((viewKey) => (
              <button
                key={viewKey}
                onClick={() => {
                  setCurrentView(viewKey);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-sm font-semibold transition relative py-1 capitalize ${currentView === viewKey ? "text-yellow-400" : `${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"}`}`}
              >
                {viewKey === "home"
                  ? "Home"
                  : viewKey === "shop"
                    ? "Catalog"
                    : viewKey === "dashboard"
                      ? "Dashboard"
                      : "Admin Panel"}
                {currentView === viewKey && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-yellow-400" : "bg-zinc-100 border-zinc-200 text-zinc-800"} transition`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-2.5 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-yellow-400" : "bg-zinc-100 border-zinc-200 text-zinc-700"} transition shadow-[0_0_15px_rgba(234,179,8,0.15)] ${cartBadgeAnimated ? "scale-110" : "scale-100"}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow-400 text-black font-bold text-[10px] flex items-center justify-center">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView("dashboard")}
              className="bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:bg-yellow-300 transition transform hover:scale-105 active:scale-95"
            >
              Portal Access
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`lg:hidden p-2.5 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700"}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 ${darkMode ? "bg-black/95 text-white" : "bg-white/95 text-zinc-900"} backdrop-blur-md flex flex-col justify-between p-8 lg:hidden transition-opacity duration-200`}
        >
          <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
            <span className="font-bold uppercase tracking-wider text-sm">
              Black Hub Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl ${darkMode ? "bg-zinc-900" : "bg-zinc-100"}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-6 py-8">
            <button
              onClick={() => {
                setCurrentView("home");
                setMobileMenuOpen(false);
              }}
              className="text-3xl font-black text-left text-yellow-400"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setMobileMenuOpen(false);
              }}
              className="text-3xl font-black text-left"
            >
              Shop Catalog
            </button>
            <button
              onClick={() => {
                setCurrentView("dashboard");
                setMobileMenuOpen(false);
              }}
              className="text-3xl font-black text-left"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentView("admin");
                setMobileMenuOpen(false);
              }}
              className="text-3xl font-black text-left"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
          />
          <div
            className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[450px] ${darkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border-l shadow-2xl flex flex-col justify-between p-6 sm:p-8 transition-transform duration-300`}
          >
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-black text-lg uppercase tracking-wider">
                    Shopping Cart
                  </h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className={`p-2.5 rounded-xl ${darkMode ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 text-zinc-600"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 max-h-[45vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 text-sm">
                    Your shopping cart is currently empty.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border ${darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"} flex items-center justify-between gap-4`}
                    >
                      <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <span className="text-yellow-400 font-bold text-xs mt-1 block">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 rounded-xl border px-2 py-1 ${darkMode ? "bg-black border-zinc-800" : "bg-white border-zinc-300"}`}
                        >
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-zinc-400 hover:text-white px-1 text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-zinc-400 hover:text-white px-1 text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            setCart(cart.filter((c) => c.id !== item.id))
                          }
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <div
                className={`p-4 rounded-2xl border ${darkMode ? "bg-zinc-900/80 border-zinc-800" : "bg-zinc-50 border-zinc-200"} space-y-2 text-xs font-medium`}
              >
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-bold">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Delivery</span>
                  <span className="text-emerald-400 font-bold uppercase">
                    FREE
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-yellow-400">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-black">
                  <span>Total</span>
                  <span className="text-yellow-400">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. BLACK10)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className={`w-full bg-black border ${darkMode ? "border-zinc-800" : "border-zinc-300"} rounded-xl px-3 py-2 text-xs text-white outline-none uppercase font-mono`}
                />
                <button
                  onClick={() => {
                    if (promoCodeInput.toUpperCase() === "BLACK10")
                      setAppliedDiscount(10);
                  }}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-xs uppercase"
                >
                  Apply
                </button>
              </div>

              <button
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
                disabled={cart.length === 0}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-400/20 cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div
            className={`w-full max-w-2xl ${darkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden`}
          >
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <div className="flex justify-between text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                <span className={checkoutStep >= 1 ? "text-yellow-400" : ""}>
                  ① Address
                </span>
                <span className={checkoutStep >= 2 ? "text-yellow-400" : ""}>
                  ② Payment
                </span>
                <span className={checkoutStep >= 3 ? "text-yellow-400" : ""}>
                  ③ Review
                </span>
                <span className={checkoutStep >= 4 ? "text-emerald-400" : ""}>
                  ④ Success
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${(checkoutStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {checkoutStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black">
                    Shipping & Account Details
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    Automatically loaded from your saved profile.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, name: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-zinc-400">
                        Email Address
                      </label>
                      <input
                        type="text"
                        value={userProfile.email}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-zinc-400">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={userProfile.phone}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400">
                      Delivery Address
                    </label>
                    <textarea
                      value={userProfile.address}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          address: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1 resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutStep(3)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black">Review Order Summary</h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    Verify your items before confirming secure escrow payment.
                  </p>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-zinc-900 rounded-xl text-sm"
                    >
                      <span className="font-bold">
                        {item.name} (x{item.qty})
                      </span>
                      <span className="text-yellow-400">
                        ₦{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-zinc-900 rounded-2xl flex justify-between font-black text-lg">
                  <span>Total Amount</span>
                  <span className="text-yellow-400">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="w-1/2 border border-zinc-700 py-3 rounded-xl font-bold text-xs uppercase"
                  >
                    Back
                  </button>
                  <button
                    onClick={processCheckoutPayment}
                    className="w-1/2 bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="text-center py-16 space-y-6">
                <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400 flex items-center justify-center text-yellow-400 mx-auto animate-spin">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black">{paymentStatusMessage}</h3>
                <p className="text-zinc-500 font-mono text-xs">
                  Processing secure 256-bit encrypted gateway transaction...
                </p>
              </div>
            )}

            {checkoutStep === 4 && (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white">
                    Payment Successful!
                  </h3>
                  <p className="text-yellow-400 font-mono text-xs mt-1">
                    Order Identifier: {orderId}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      alert("PDF Invoice Downloaded Successfully!");
                    }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-yellow-400 px-6 py-3 rounded-xl font-bold text-xs uppercase flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-yellow-400" /> Download
                    Invoice (PDF)
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutOpen(false);
                      setCart([]);
                      setCurrentView("dashboard");
                    }}
                    className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW SWITCHER */}
      {currentView === "home" && (
        <>
          <section className="relative min-h-[92vh] flex items-center justify-center pt-36 pb-20 px-6 overflow-hidden">
            <AuroraBackground />

            <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto">
              <div className="absolute top-28 left-12 p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-xl text-yellow-400 animate-bounce">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="absolute top-40 right-16 p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-xl text-cyan-400 animate-pulse">
                <Globe className="w-6 h-6" />
              </div>
              <div className="absolute bottom-28 left-20 p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-xl text-emerald-400 animate-bounce">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 font-mono text-xs uppercase tracking-widest text-zinc-300 mb-6 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Next-Gen Digital Commerce Platform v2.0
              </span>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
                Enterprise Grade <br />
                <span className="text-yellow-400">Digital Assets</span>
              </h1>

              <p className="mt-8 text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
                Instant delivery of verified accounts, secure VPN tunnels,
                crypto liquidity, and global communication nodes with escrow
                protection.
              </p>

              <div className="relative max-w-xl mx-auto mt-10">
                <div className="flex items-center bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-3.5 shadow-2xl focus-within:border-yellow-400 transition">
                  <Search className="w-5 h-5 text-zinc-400 ml-3" />
                  <input
                    type="text"
                    placeholder="Smart Search (e.g. netf for Netflix, vpn, goog...)"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none px-4 text-white text-sm placeholder:text-zinc-600 font-medium"
                  />
                  <button
                    onClick={() => setCurrentView("shop")}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                  >
                    Search
                  </button>
                </div>

                {aiResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-3 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left divide-y divide-zinc-900">
                    {aiResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => openProductDetail(shopProducts[0])}
                        className="p-4 hover:bg-zinc-900 cursor-pointer flex justify-between items-center transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            <h4 className="font-bold text-white text-sm">
                              {item.name}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 pl-4">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-yellow-400 font-bold text-sm">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setCurrentView("shop")}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition shadow-lg shadow-yellow-400/20 text-sm cursor-pointer transform hover:scale-105"
                >
                  Enter Marketplace <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/2348088580173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-zinc-700 hover:border-yellow-400 px-8 py-4 rounded-2xl text-zinc-300 font-semibold flex items-center gap-2 text-sm transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />{" "}
                  WhatsApp Support
                </a>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-28" id="categories">
            <div className="text-center mb-16">
              <p className="text-yellow-400 uppercase tracking-[0.4em] text-xs font-bold">
                OPERATIONAL SECTORS
              </p>
              <h2 className="text-4xl sm:text-5xl font-black mt-3">
                Browse Categories
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <TiltCard key={idx} onClick={() => setCurrentView("shop")}>
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-white">
                          {cat.name}
                        </h3>
                        <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
                        <span>Access Sector</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20 bg-zinc-950/50 rounded-3xl border border-zinc-900 my-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-yellow-400 uppercase tracking-[0.4em] text-xs font-bold">
                  PERSONALIZED INTELLIGENCE
                </p>
                <h2 className="text-3xl sm:text-4xl font-black mt-2">
                  Recommended For You
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                Based on your previous Netflix purchase
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Disney+ Streaming Profile",
                  price: 2800,
                  badge: "Match: 98%",
                  desc: "Because you purchased Netflix UHD",
                },
                {
                  name: "NordVPN 1 Year",
                  price: 2500,
                  badge: "Match: 95%",
                  desc: "Essential secure tunnel for streaming",
                },
                {
                  name: "Google Voice USA",
                  price: 4500,
                  badge: "Match: 91%",
                  desc: "Verified USA line for registration",
                },
              ].map((item, idx) => (
                <TiltCard
                  key={idx}
                  onClick={() => openProductDetail(shopProducts[0])}
                >
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 font-mono text-[10px] font-bold uppercase">
                      {item.badge}
                    </span>
                    <h4 className="font-bold text-lg text-white mt-4">
                      {item.name}
                    </h4>
                    <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center">
                    <span className="text-yellow-400 font-black text-lg">
                      ₦{item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(shopProducts[0]);
                      }}
                      className="p-2 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-12">
            <h3 className="text-xl font-bold mb-6 text-zinc-400">
              Recently Viewed
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => openProductDetail(prod)}
                  className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl cursor-pointer hover:border-yellow-400 transition"
                >
                  <h4 className="font-bold text-white">{prod.name}</h4>
                  <span className="text-yellow-400 font-mono text-xs font-bold mt-2 block">
                    ₦{prod.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {showLivePopup && (
            <div className="fixed bottom-6 left-6 z-40 bg-zinc-950/95 border border-zinc-800 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm pointer-events-none transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black text-xs">
                🛒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {livePurchasesFeed[currentPopupIndex].name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    from {livePurchasesFeed[currentPopupIndex].location}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Purchased{" "}
                  <strong className="text-yellow-400">
                    {livePurchasesFeed[currentPopupIndex].item}
                  </strong>
                </p>
                <span className="text-[9px] font-mono text-zinc-600">
                  {livePurchasesFeed[currentPopupIndex].time}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {currentView === "shop" && (
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase text-yellow-400 tracking-widest">
              Enterprise Catalog
            </span>
            <h2 className="text-4xl font-black mt-2">Digital Marketplace</h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-8 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl h-fit">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-yellow-400" /> Categories
                </h3>
                <div className="space-y-2 text-sm">
                  {[{ name: "All Products", slug: "all" }, ...categories].map(
                    (cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition ${selectedCategory === cat.slug ? "bg-yellow-400 text-black font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                      >
                        {cat.name}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopProducts
                  .filter(
                    (p) =>
                      selectedCategory === "all" ||
                      p.category === selectedCategory,
                  )
                  .map((product) => (
                    <TiltCard
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 font-mono text-[10px] font-bold uppercase">
                            {product.badge}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-white">
                          {product.name}
                        </h4>
                        <p className="text-zinc-400 text-xs mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center">
                        <span className="text-yellow-400 font-black text-lg">
                          ₦{product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-xl font-bold text-xs uppercase transition shadow-lg shadow-yellow-400/10"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </TiltCard>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {currentView === "product" && activeProduct && (
        <section className="max-w-6xl mx-auto px-6 pt-36 pb-28">
          <button
            onClick={() => setCurrentView("shop")}
            className="text-xs font-mono text-yellow-400 mb-8 flex items-center gap-2"
          >
            ← Back to Catalog
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent"></div>
                <span className="font-black text-2xl text-yellow-400">
                  {activeProduct.name}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 font-mono text-xs uppercase font-bold">
                  {activeProduct.badge}
                </span>
                <h1 className="text-4xl font-black mt-3 text-white">
                  {activeProduct.name}
                </h1>
                <div className="flex gap-1 text-yellow-400 mt-2">
                  {[...Array(activeProduct.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <h3 className="text-3xl font-black text-yellow-400">
                ₦{activeProduct.price.toLocaleString()}
              </h3>
              <p className="text-zinc-300 leading-relaxed text-sm">
                {activeProduct.description}
              </p>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Frequently Bought Together
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span>Google Voice</span>
                  <span>+</span>
                  <span>NordVPN</span>
                  <span>+</span>
                  <span>USDT</span>
                </div>
                <button
                  onClick={() => {
                    addToCart(activeProduct);
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-yellow-400 font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Add Bundle to Cart (₦8,650)
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => addToCart(activeProduct)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 grid lg:grid-cols-3 gap-12 bg-zinc-950 border border-zinc-900 p-8 rounded-3xl">
            <div>
              <h3 className="text-3xl font-black">4.9 / 5.0</h3>
              <div className="flex gap-1 text-yellow-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-zinc-500 text-xs">
                Based on 1,420 verified enterprise reviews
              </p>
            </div>
            <div className="lg:col-span-2 space-y-2">
              {[
                { stars: "★★★★★", bar: "92%", count: "1,305" },
                { stars: "★★★★☆", bar: "6%", count: "85" },
                { stars: "★★★☆☆", bar: "1%", count: "20" },
                { stars: "★★☆☆☆", bar: "1%", count: "10" },
                { stars: "★☆☆☆☆", bar: "0%", count: "0" },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 text-xs font-mono"
                >
                  <span className="w-16">{row.stars}</span>
                  <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: row.bar }}
                    ></div>
                  </div>
                  <span className="w-12 text-right text-zinc-500">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {currentView === "dashboard" && (
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-28 space-y-10">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase text-yellow-400">
                  Secure Portal
                </span>
                <h2 className="text-3xl font-black mt-2">
                  Good Evening, Matthew 👋
                </h2>
                <p className="text-zinc-400 text-sm mt-2">
                  Your enterprise account is fully verified and connected to
                  active nodes.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setCurrentView("shop")}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase"
                >
                  Browse Store
                </button>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                    Reward Points
                  </h3>
                  <Gift className="w-5 h-5 text-yellow-400" />
                </div>
                <h4 className="text-4xl font-black text-yellow-400 mt-4">
                  {rewardPoints} pts
                </h4>
                <p className="text-zinc-500 text-xs mt-1">
                  Redeem 500 points for a ₦500 discount.
                </p>
              </div>
              <button
                onClick={() => {
                  if (rewardPoints >= 500) {
                    setRewardPoints((prev) => prev - 500);
                    setAppliedDiscount(10);
                    alert("Successfully redeemed 500 points for a discount!");
                  }
                }}
                className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-bold text-xs uppercase"
              >
                Redeem ₦500 Discount
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl text-center space-y-4">
            <h3 className="text-2xl font-black">Weekly Lucky Spin Wheel 🎡</h3>
            <p className="text-zinc-400 text-sm">
              Spin once per week to unlock exclusive discounts or free delivery.
            </p>
            {spinResult && (
              <div className="text-xl font-black text-yellow-400 animate-bounce">
                Unlocked: {spinResult}!
              </div>
            )}
            <button
              onClick={spinTheWheel}
              disabled={isSpinning}
              className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-yellow-400/20"
            >
              {isSpinning ? "Spinning..." : "Spin Now"}
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-4">
            <h3 className="font-black text-lg">Purchase Activity Heatmap</h3>
            <div className="grid grid-cols-12 gap-2">
              {[...Array(36)].map((_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-lg ${i % 3 === 0 ? "bg-yellow-400" : i % 5 === 0 ? "bg-yellow-500/40" : "bg-zinc-900"}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-4">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-400" /> Active Sessions
              </h3>
              <div className="p-4 bg-zinc-900 rounded-2xl flex justify-between items-center text-xs font-mono">
                <div>
                  <p className="font-bold text-white">Windows • Chrome</p>
                  <span className="text-emerald-400">
                    Nigeria (Current Session)
                  </span>
                </div>
                <button className="text-red-400 font-bold hover:underline">
                  Logout
                </button>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-4">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-400" /> Two-Factor
                Authentication
              </h3>
              <div className="flex justify-between items-center text-sm">
                <span>Google Authenticator / Email OTP</span>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase ${twoFactorEnabled ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400"}`}
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentView === "admin" && (
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-28 space-y-10">
          <div>
            <span className="text-xs font-mono uppercase text-yellow-400">
              Control Center
            </span>
            <h2 className="text-4xl font-black mt-2">Admin Superpowers</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-950 border border-dashed border-zinc-700 rounded-3xl p-8 text-center space-y-4 flex flex-col items-center justify-center">
              <Upload className="w-10 h-10 text-yellow-400" />
              <div>
                <h3 className="font-bold text-white">
                  Drag & Drop Product Images Here
                </h3>
                <p className="text-zinc-500 text-xs mt-1">
                  Supports PNG, JPG, WebP instant S3 bucket sync.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 space-y-4 flex flex-col justify-between">
              <h3 className="font-black text-lg">Sales Analytics & Export</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => alert("CSV Exported Successfully!")}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-yellow-400" /> Export CSV
                </button>
                <button
                  onClick={() => alert("Excel Exported Successfully!")}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-yellow-400" /> Export Excel
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-black">
              Manage Products & Inventory Alerts
            </h3>
            <div className="divide-y divide-zinc-900">
              {adminProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-white">{prod.name}</h4>
                    <span className="text-xs font-mono text-yellow-400">
                      ₦{prod.price.toLocaleString()}
                    </span>
                  </div>
                  {prod.stock <= 3 && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-mono text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Only {prod.stock}{" "}
                      Left!
                    </span>
                  )}
                  <button
                    onClick={() =>
                      setAdminProducts(
                        adminProducts.filter((p) => p.id !== prod.id),
                      )
                    }
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md pt-20 pb-12 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-zinc-900">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black tracking-tighter text-sm shadow-lg shadow-yellow-400/10">
                BH
              </div>
              <h1 className="text-base font-black tracking-wide uppercase">
                BLACK HUB
              </h1>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Premium Digital Marketplace for verified accounts, subscriptions,
              virtual numbers, and secure cryptographic assets worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400 font-medium">
              <li>
                <button
                  onClick={() => setCurrentView("home")}
                  className="hover:text-yellow-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("shop")}
                  className="hover:text-yellow-400 transition"
                >
                  Shop Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="hover:text-yellow-400 transition"
                >
                  Customer Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-zinc-500 tracking-wider gap-4">
          <p>
            © {new Date().getFullYear()} Black Hub v2.0. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-red-500">❤️</span> for elite digital
            commerce
          </p>
        </div>
      </footer>
    </div>
  );
}
