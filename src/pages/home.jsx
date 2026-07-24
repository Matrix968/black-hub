// components/Home.jsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  Zap,
  Globe,
  ShoppingBag,
  ArrowRight,
  Star,
  Cpu,
  Smartphone,
  Tv,
  Coins,
  Gift,
  User,
  BarChart3,
  Wallet,
  FileText,
  Settings,
  Menu,
  X,
  CheckCircle2,
  Lock,
  ChevronRight,
  Activity,
  RefreshCw,
  LogOut,
  Bell,
  Sparkles,
  ExternalLink,
  Heart,
  Award,
  Clock,
  Truck,
  Headphones,
  Layers,
  Database,
  Cloud,
  Server,
  HomeIcon,
  ShoppingCart,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Briefcase,
  Shield,
  TrendingUp,
  Users,
  Package,
  Globe2,
  Check,
  ChevronDown,
  Play,
  Code,
  Terminal,
  BookOpen,
  MessageCircle,
  Grid,
  Info,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

// ==========================================
// IMPORT EXISTING DATA SOURCES
// ==========================================
const DEMO_PRODUCTS = [
  {
    id: "1",
    title: "Google Voice USA Gold Node",
    price: 4.5,
    rating: 5.0,
    category: "telecom",
    stock: "In Stock",
    desc: "Fully private activation key with instant delivery.",
  },
  {
    id: "2",
    title: "NordVPN Elite (1 Year Pass)",
    price: 12.0,
    rating: 4.9,
    category: "security",
    stock: "In Stock",
    desc: "Military-grade encryption with ultra-fast global routing.",
  },
  {
    id: "3",
    title: "Netflix 4K UHD Ultra Vault",
    price: 3.5,
    rating: 4.8,
    category: "streaming",
    stock: "Instant",
    desc: "Ultra HD 4K streaming slot with private profile lock.",
  },
];

// Social Media Icons (SVG)
const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Navigation handlers
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  // Animation variants - optimized for performance
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Data for sections
  const stats = [
    { value: "85K+", label: "Active Users", icon: Users },
    { value: "120+", label: "Countries Served", icon: Globe2 },
    { value: "240+", label: "Products Available", icon: Package },
    { value: "5+", label: "Years of Excellence", icon: Award },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      desc: "Automated dispatch within seconds of payment confirmation.",
      gradient: "from-amber-500 to-yellow-400",
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      desc: "256-bit encryption with zero-knowledge proof technology.",
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      desc: "240+ nodes across 120+ countries for optimal performance.",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: Database,
      title: "Verified Escrow System",
      desc: "Smart contract escrow protection for every transaction.",
      gradient: "from-purple-500 to-pink-400",
    },
  ];

  const categories = [
    {
      id: "telecom",
      icon: Smartphone,
      label: "Telecom Assets",
      desc: "Google Voice, Telegram Premium & more",
    },
    {
      id: "security",
      icon: Shield,
      label: "Security & VPN",
      desc: "NordVPN, ChatGPT Plus & more",
    },
    {
      id: "streaming",
      icon: Tv,
      label: "Streaming Passes",
      desc: "Netflix 4K, Disney+ & more",
    },
    {
      id: "crypto",
      icon: Coins,
      label: "Crypto Escrow",
      desc: "USDT, Bitcoin & more",
    },
  ];

  const testimonials = [
    {
      name: "Marcus V.",
      role: "Digital Entrepreneur",
      rating: 5,
      text: "The fastest delivery I've ever experienced. Assets were in my vault within seconds.",
      avatar: "MV",
    },
    {
      name: "Elena R.",
      role: "Security Consultant",
      rating: 5,
      text: "The security features are unmatched. I trust Black Hub with all my digital assets.",
      avatar: "ER",
    },
    {
      name: "David O.",
      role: "Content Creator",
      rating: 4.9,
      text: "A game-changer for content creators. The streaming passes are always reliable.",
      avatar: "DO",
    },
  ];

  const faqs = [
    {
      question: "How does instant delivery work?",
      answer:
        "Our automated escrow system dispatches your digital assets within seconds of payment confirmation. You'll receive your credentials via email and your vault dashboard instantly.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "All transactions are encrypted with 256-bit SSL and processed through our secure escrow system. We never store your payment information.",
    },
    {
      question: "What happens if I don't receive my item?",
      answer:
        "Our 24/7 support team will resolve any delivery issues within 30 minutes. We maintain a 99.99% success rate on all automated dispatches.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "We offer a 7-day money-back guarantee on all digital assets. Contact our support team for immediate assistance.",
    },
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      desc: "All data transmitted is encrypted with military-grade protocols.",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Proof",
      desc: "Your sensitive information is never exposed to third parties.",
    },
    {
      icon: CheckCircle2,
      title: "Verified Transactions",
      desc: "Every transaction is verified through our smart contract escrow.",
    },
  ];

  const navigationItems = [
    { id: "nav-home", label: "Home", path: "/", icon: HomeIcon },
    { id: "nav-shop", label: "Shop", path: "/shop", icon: ShoppingBag },
    { id: "nav-categories", label: "Categories", path: "/shop", icon: Grid },
  ];

  return (
    <div className="relative min-h-screen bg-[#050507] text-white font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* Aurora Animated Background - Optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/15 via-yellow-500/8 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[400px] bg-gradient-to-b from-purple-500/8 to-transparent blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/5 to-transparent blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Floating Lights - Optimized */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 bg-amber-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/8 rounded-full blur-3xl" />
      </div>

      {/* ========================================== */}
      {/* PREMIUM NAVIGATION                         */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#050507]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <span className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                Black Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-zinc-300">
            {navigationItems.map((item) => (
              <Link key={item.id} to={item.path}>
                <button className="transition hover:text-amber-400">
                  {item.label}
                </button>
              </Link>
            ))}

            <div className="flex items-center gap-2 xl:gap-3 ml-4 pl-4 border-l border-zinc-800">
              <Link key="login" to="/login">
                <button className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition">
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Login</span>
                </button>
              </Link>
              <Link key="register" to="/register">
                <button className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 transition shadow-lg shadow-amber-400/20">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Register</span>
                </button>
              </Link>
              <Link key="cart" to="/cart">
                <button className="relative p-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <Link key="dashboard" to="/dashboard">
                <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition">
                  <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:border-amber-500/50 transition"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-amber-300 font-mono">
                ⌘K
              </kbd>
            </button>
          </nav>

          {/* Mobile & Tablet Menu Controls */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <Link to="/cart">
              <button className="relative p-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#050507]/98 backdrop-blur-3xl flex flex-col pt-20 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-4 text-2xl font-extrabold">
              {navigationItems.map((item) => (
                <Link key={item.id} to={item.path}>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left text-zinc-300 hover:text-amber-400 transition flex items-center gap-4 py-3 border-b border-zinc-800/50"
                  >
                    <item.icon className="w-6 h-6 text-amber-400" />
                    {item.label}
                  </button>
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-6">
                <Link key="mobile-login" to="/login">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left text-zinc-300 hover:text-amber-400 transition flex items-center gap-4 py-3 border-b border-zinc-800/50"
                  >
                    <LogIn className="w-6 h-6 text-amber-400" />
                    Login
                  </button>
                </Link>
                <Link key="mobile-register" to="/register">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left text-amber-400 transition flex items-center gap-4 py-3"
                  >
                    <UserPlus className="w-6 h-6" />
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 py-4 border-b border-zinc-800 gap-3">
                <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, or keywords..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-medium"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs px-2 py-1 rounded bg-zinc-800 text-amber-400 font-mono"
                >
                  ESC
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold px-2">
                  Popular Searches
                </div>
                {[
                  "Google Voice",
                  "NordVPN",
                  "Netflix",
                  "Telegram",
                  "ChatGPT",
                ].map((term, index) => (
                  <Link to="/shop" key={`search-${index}`}>
                    <div
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/60 cursor-pointer transition"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30">
                          <Search className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-white">{term}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* HOME PAGE - PURE PRESENTATION              */}
      {/* ========================================== */}
      <main className="relative">
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Content */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 sm:space-y-8 relative z-10 order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-bold backdrop-blur-sm">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Premium Digital Asset Marketplace</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08]">
                  Your Gateway to <br />
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Premium Assets
                  </span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 max-w-lg font-medium">
                  Discover verified digital assets including Google Voice
                  numbers, VPN passes, streaming credentials, and crypto assets
                  — delivered instantly with military-grade security.
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Link to="/shop" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black hover:opacity-90 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group text-sm sm:text-base">
                      <span>Start Shopping</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link to="/register" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/10 transition text-sm sm:text-base">
                      Create Account
                    </button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-black flex items-center justify-center text-[8px] sm:text-[10px] font-black"
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-zinc-400">
                      Trusted by 85K+ users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                    <span className="text-[10px] sm:text-xs text-zinc-400">
                      256-bit encryption
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Graphic - Floating Elements */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative flex justify-center order-1 lg:order-2"
              >
                <div className="relative w-full max-w-sm sm:max-w-md">
                  <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-amber-500/20 rounded-full blur-3xl -top-10 -left-10" />
                  <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-yellow-400/15 rounded-full blur-3xl -bottom-10 -right-10" />

                  <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/95 backdrop-blur-2xl border border-amber-500/40 shadow-2xl">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-bold border border-amber-500/40">
                        Featured Product
                      </span>
                      <div className="flex gap-0.5 sm:gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1 sm:mb-2 text-white">
                      Premium Assets
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mb-4 sm:mb-6">
                      Instant delivery with verified credentials and zero
                      footprint.
                    </p>
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-zinc-800">
                      <div>
                        <span className="text-[10px] sm:text-xs text-zinc-400">
                          Starting from
                        </span>
                        <p className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400">
                          $3.50
                        </p>
                      </div>
                      <Link to="/shop">
                        <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black transition shadow-lg shadow-amber-400/30 text-xs sm:text-sm">
                          Shop Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= STATISTICS SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-zinc-950/90 border border-amber-500/20 backdrop-blur-xl">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="space-y-1 text-center"
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
                <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  {stat.value}
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
              Why Choose Black Hub
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Premium Features for <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Modern Digital Commerce
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
              Enterprise-grade infrastructure designed for instant digital asset
              delivery with uncompromised security.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-black border border-amber-500/30 transition-all mb-4 sm:mb-6`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= CATEGORIES SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
              Categories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Digital Assets
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, i) => (
              <Link to="/shop" key={`cat-${i}`}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 rounded-2xl sm:rounded-3xl blur-xl transition-all duration-500" />
                  <div className="relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/90 border border-zinc-800 group-hover:border-amber-500/50 transition-all duration-300 backdrop-blur-xl">
                    <category.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-400 mb-3 sm:mb-4 transition-transform" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">
                      {category.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400">
                      {category.desc}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= FEATURED PRODUCTS PREVIEW ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 sm:mb-16">
            <div className="space-y-2 sm:space-y-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
                Featured Products
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Popular{" "}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Digital Assets
                </span>
              </h2>
            </div>
            <Link to="/shop" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1">
                View all products <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {DEMO_PRODUCTS.map((p, i) => (
              <motion.div
                key={`product-${p.id}`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-500/10 text-amber-400 text-[8px] sm:text-[10px] uppercase font-black border border-amber-500/30">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="font-black text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-white group-hover:text-amber-300 transition">
                    {p.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-zinc-400 mb-4 sm:mb-6 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-zinc-800">
                  <div>
                    <span className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold block">
                      Price
                    </span>
                    <span className="text-lg sm:text-xl md:text-2xl font-black text-amber-400">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                  <Link to="/shop">
                    <button className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] sm:text-xs transition shadow-lg shadow-amber-400/20">
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              What Our{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Community Says
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((review, i) => (
              <motion.div
                key={`review-${i}`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-black text-sm sm:text-base">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      {review.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-400">
                      {review.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 sm:gap-1 text-amber-400 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${idx < review.rating ? "fill-amber-400" : ""}`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "{review.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= SECURITY SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
                Security First
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Enterprise-Grade <br />
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Protection
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400">
                Our security infrastructure is built with military-grade
                encryption and zero-knowledge proof technology to ensure your
                digital assets remain protected.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {securityFeatures.map((feature, i) => (
                  <div key={`security-${i}`} className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {feature.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl sm:rounded-3xl blur-3xl" />
              <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/90 border border-amber-500/30 backdrop-blur-2xl">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Shield, label: "256-bit SSL" },
                    { icon: Lock, label: "Zero-Knowledge" },
                    { icon: CheckCircle2, label: "Smart Escrow" },
                    { icon: Shield, label: "DDoS Protected" },
                  ].map((item, i) => (
                    <div
                      key={`security-card-${i}`}
                      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-800/50 border border-zinc-700 text-center"
                    >
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-1 sm:mb-2" />
                      <p className="text-[10px] sm:text-xs font-bold text-white">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={`faq-${i}`}
                className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">
                    {faq.question}
                  </h3>
                  <div
                    className={`transform transition-transform duration-300 flex-shrink-0 ${expandedFaq === i ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                </div>
                {expandedFaq === i && (
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-zinc-400 pt-3 sm:pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="relative p-6 sm:p-8 md:p-12 lg:p-20 rounded-3xl sm:rounded-4xl overflow-hidden bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent blur-3xl" />
            <div className="relative text-center space-y-4 sm:space-y-6">
              <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mx-auto" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-white">
                Ready to Get Started?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl mx-auto">
                Join 85K+ users and experience the fastest digital asset
                delivery platform.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Link to="/shop" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black hover:opacity-90 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <span>Explore Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/10 transition text-sm sm:text-base">
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= NEWSLETTER ================= */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center space-y-4 sm:space-y-6">
            <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Stay Updated
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Subscribe to our newsletter for exclusive offers and new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                placeholder="Enter your email address"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white focus:border-amber-400 focus:outline-none transition"
              />
              <button
                onClick={() => alert("Subscribed successfully!")}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black transition shadow-lg shadow-amber-400/20 text-sm"
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* ================= PREMIUM FOOTER ================= */}
        <footer className="border-t border-amber-500/20 bg-zinc-950/50 backdrop-blur-xl py-12 sm:py-16 mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              <div className="space-y-3 sm:space-y-4">
                <Link to="/">
                  <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-bold">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <span className="font-black text-base sm:text-lg text-white">
                      Black Hub
                    </span>
                  </div>
                </Link>
                <p className="text-[10px] sm:text-xs text-zinc-500">
                  The premier luxury marketplace for verified digital assets and
                  instant automated delivery.
                </p>
                <div className="flex gap-2 pt-2 sm:pt-4">
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <TwitterIcon />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <YoutubeIcon />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <LinkedinIcon />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 sm:mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-[10px] sm:text-xs text-zinc-500 font-medium">
                  <li>
                    <Link
                      to="/shop"
                      className="hover:text-amber-400 transition"
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-amber-400 transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-amber-400 transition"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="hover:text-amber-400 transition"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 sm:mb-4">
                  Categories
                </h4>
                <ul className="space-y-2 text-[10px] sm:text-xs text-zinc-500 font-medium">
                  <li>
                    <Link
                      to="/shop"
                      className="hover:text-amber-400 transition"
                    >
                      Telecom
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      className="hover:text-amber-400 transition"
                    >
                      Security & VPN
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      className="hover:text-amber-400 transition"
                    >
                      Streaming
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      className="hover:text-amber-400 transition"
                    >
                      Crypto
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 sm:mb-4">
                  Contact
                </h4>
                <ul className="space-y-2 text-[10px] sm:text-xs text-zinc-500 font-medium">
                  <li className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-amber-400" />
                    <span>support@blackhub.io</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>+1 (800) 555-0123</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Digital District, NYC</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-zinc-500">
                © 2024 Black Hub. All rights reserved.
              </p>
              <div className="flex gap-4 sm:gap-6 text-[10px] sm:text-xs text-zinc-500">
                <a href="#" className="hover:text-amber-400 transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-amber-400 transition">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-amber-400 transition">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
