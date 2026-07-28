// components/Home.jsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
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
  Cookie,
  ThumbsUp,
  ThumbsDown,
  Crown,
  Rocket,
  Send,
  CreditCard,
  DollarSign,
  Percent,
  BarChart,
  LineChart,
  PieChart,
  Download,
  CloudDownload,
  Wifi,
  Fingerprint,
  BadgeCheck,
  Sparkle,
  Zap as ZapIcon,
  Target,
  Eye,
  ArrowUp,
  ArrowDown,
  Circle,
  Move,
  Compass,
  Navigation,
  Map,
  MapPin as MapPinIcon,
  Radar,
  Satellite,
  Wifi as WifiIcon,
  Globe as GlobeIcon,
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
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "NordVPN Elite (1 Year Pass)",
    price: 12.0,
    rating: 4.9,
    category: "security",
    stock: "In Stock",
    desc: "Military-grade encryption with ultra-fast global routing.",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Netflix 4K UHD Ultra Vault",
    price: 3.5,
    rating: 4.8,
    category: "streaming",
    stock: "Instant",
    desc: "Ultra HD 4K streaming slot with private profile lock.",
    image:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop",
  },
];

// ==========================================
// SOCIAL MEDIA ICONS (SVG)
// ==========================================
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

// ==========================================
// ANIMATED COUNTER COMPONENT
// ==========================================
const AnimatedCounter = ({
  end,
  prefix = "",
  duration = 2000,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ==========================================
// FLOATING PARTICLES COMPONENT
// ==========================================
const FloatingParticles = ({ count = 80 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-amber-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            opacity: [
              particle.opacity,
              particle.opacity * 1.5,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// CURSOR GLOW COMPONENT
// ==========================================
const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x - 150,
        top: position.y - 150,
        width: 300,
        height: 300,
        background:
          "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
      }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
};

// ==========================================
// ANIMATED WORLD MAP COMPONENT
// ==========================================
const AnimatedWorldMap = () => {
  const cities = [
    { name: "USA", x: 20, y: 30 },
    { name: "UK", x: 45, y: 25 },
    { name: "Germany", x: 48, y: 35 },
    { name: "Nigeria", x: 52, y: 55 },
    { name: "UAE", x: 58, y: 40 },
    { name: "Japan", x: 85, y: 30 },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 2, to: 3 },
    { from: 1, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 2, to: 5 },
  ];

  return (
    <div className="relative w-full h-[400px] bg-zinc-950/50 rounded-3xl border border-zinc-800 overflow-hidden">
      {/* Glow behind map */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5" />

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, idx) => {
          const from = cities[conn.from];
          const to = cities[conn.to];
          return (
            <g key={idx}>
              <line
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(251, 191, 36, 0.2)"
                strokeWidth="1"
              />
              <line
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(251, 191, 36, 0.05)"
                strokeWidth="4"
              />
              {/* Animated packet */}
              <circle r="3" fill="#fbbf24">
                <animateMotion
                  dur={`${Math.random() * 3 + 2}s`}
                  repeatCount="indefinite"
                  path={`M${from.x},${from.y} L${to.x},${to.y}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* City Dots */}
      {cities.map((city, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            left: `${city.x}%`,
            top: `${city.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-amber-400 animate-ping" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-amber-400/60 font-mono">
              {city.name}
            </div>
          </div>
        </div>
      ))}

      {/* Floating Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-amber-400/60 font-mono flex items-center gap-2">
          <GlobeIcon className="w-4 h-4" />
          Instant Digital Delivery Worldwide
        </p>
      </div>
    </div>
  );
};

// ==========================================
// MARQUEE COMPONENT
// ==========================================
const Marquee = ({ children, direction = "left", speed = 30 }) => {
  const marqueeRef = useRef(null);

  return (
    <div className="relative overflow-hidden py-4 border-y border-zinc-800/50">
      <motion.div
        ref={marqueeRef}
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

// ==========================================
// GLASS CARD COMPONENT
// ==========================================
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/50 rounded-3xl ${className}`}
  >
    {children}
  </div>
);

// ==========================================
// TIMELINE STEP COMPONENT
// ==========================================
const TimelineStep = ({ icon: Icon, title, description, step, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex items-start gap-6">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-5 top-12 w-0.5 h-24 bg-zinc-800">
          <motion.div
            className="w-0.5 h-full bg-gradient-to-b from-amber-400 to-transparent"
            initial={{ height: 0 }}
            animate={{ height: isVisible ? "100%" : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      )}

      {/* Icon */}
      <motion.div
        className="relative z-10 w-10 h-10 rounded-full bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: isVisible ? 1 : 0, rotate: isVisible ? 0 : -180 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
      >
        <Icon className="w-5 h-5" />
        <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-1 pt-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </motion.div>
    </div>
  );
};

// ==========================================
// TESTIMONIAL CARD WITH TILT
// ==========================================
const TiltTestimonial = ({ testimonial }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * 8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="p-6 bg-zinc-950/80 border border-zinc-800 rounded-3xl hover:border-amber-500/30 transition-all duration-300"
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="font-bold text-white">{testimonial.name}</h4>
          <p className="text-xs text-zinc-400">{testimonial.role}</p>
        </div>
      </div>
      <div className="flex gap-1 text-amber-400 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? "fill-amber-400" : ""}`}
          />
        ))}
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">
        "{testimonial.text}"
      </p>
    </motion.div>
  );
};

// ==========================================
// MAIN HOME COMPONENT
// ==========================================
export default function Home() {
  const navigate = useNavigate();
  const { user, userData, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

  // Cookie Consent State
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // Parallax refs
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);

  // ==========================================
  // LOCALSTORAGE MANAGEMENT
  // ==========================================
  const COOKIE_KEY = "blackhub_cookies";
  const LOGIN_PROMPT_KEY = "blackhub_login_prompt";

  useEffect(() => {
    const cookieConsent = localStorage.getItem(COOKIE_KEY);
    const loginPromptShown = sessionStorage.getItem(LOGIN_PROMPT_KEY);

    if (cookieConsent === "accepted") {
      setCookiesAccepted(true);
      setShowCookieModal(false);
      if (!user && !loginPromptShown) {
        setTimeout(() => {
          setShowLoginPrompt(true);
        }, 3000);
      }
    } else if (cookieConsent === "rejected") {
      setShowCookieModal(false);
    } else {
      setTimeout(() => {
        setShowCookieModal(true);
      }, 2000);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      sessionStorage.removeItem(LOGIN_PROMPT_KEY);
      setShowLoginPrompt(false);
    }
  }, [user]);

  // ==========================================
  // MOUSE PARALLAX
  // ==========================================
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================
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

  // ==========================================
  // BODY SCROLL LOCK
  // ==========================================
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

  // ==========================================
  // COOKIE HANDLERS
  // ==========================================
  const handleAcceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setCookiesAccepted(true);
    setShowCookieModal(false);
    if (!user) {
      setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1500);
    }
  };

  const handleRejectCookies = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setShowCookieModal(false);
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
    sessionStorage.setItem(LOGIN_PROMPT_KEY, "dismissed");
  };

  const handleLoginNow = () => {
    setShowLoginPrompt(false);
    sessionStorage.removeItem(LOGIN_PROMPT_KEY);
    navigate("/login");
  };

  // ==========================================
  // NAVIGATION
  // ==========================================
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  // ==========================================
  // DATA
  // ==========================================
  const stats = [
    {
      value: "85,321",
      label: "Active Users",
      icon: Users,
      prefix: "",
      suffix: "+",
    },
    {
      value: "2.4",
      label: "Transactions",
      icon: DollarSign,
      prefix: "$",
      suffix: "M",
    },
    { value: "240", label: "Products", icon: Package, prefix: "", suffix: "+" },
    {
      value: "99.98",
      label: "Delivery Success",
      icon: CheckCircle2,
      prefix: "",
      suffix: "%",
    },
  ];

  const categories = [
    {
      id: "telecom",
      icon: Smartphone,
      label: "Google Voice",
      desc: "Private • Verified • Instant",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      id: "security",
      icon: Shield,
      label: "VPN & Security",
      desc: "Secure • Encrypted • Fast",
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      id: "streaming",
      icon: Tv,
      label: "Streaming Passes",
      desc: "4K • Premium • Reliable",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      id: "crypto",
      icon: Coins,
      label: "Crypto Assets",
      desc: "Escrow • Secure • Instant",
      gradient: "from-amber-500 to-orange-400",
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

  const features = [
    {
      icon: Shield,
      title: "256-bit Encryption",
      desc: "Military-grade protection for all transactions",
    },
    {
      icon: Lock,
      title: "Smart Escrow",
      desc: "Automated release upon delivery confirmation",
    },
    {
      icon: CheckCircle2,
      title: "Auto Verification",
      desc: "Instant validation of all digital assets",
    },
    {
      icon: Database,
      title: "Zero Data Logging",
      desc: "Your privacy is our priority, no logs stored",
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      desc: "Round-the-clock security and support",
    },
    {
      icon: Globe,
      title: "Global Network",
      desc: "240+ nodes across 120+ countries",
    },
  ];

  const navigationItems = [
    { id: "nav-home", label: "Home", path: "/", icon: HomeIcon },
    { id: "nav-shop", label: "Shop", path: "/shop", icon: ShoppingBag },
    { id: "nav-categories", label: "Categories", path: "/shop", icon: Grid },
  ];

  const pressLogos = [
    "TechCrunch",
    "Forbes",
    "CoinDesk",
    "Yahoo Finance",
    "Bloomberg",
    "Business Insider",
    "CNN",
    "Reuters",
  ];

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="relative min-h-screen bg-[#050507] text-white font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* ========================================== */}
      {/* CURSOR GLOW                                */}
      {/* ========================================== */}
      <CursorGlow />

      {/* ========================================== */}
      {/* SCROLL PROGRESS INDICATOR                  */}
      {/* ========================================== */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-50"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "0% 50%",
          background: "linear-gradient(to right, #fbbf24, #f59e0b)",
        }}
      />

      {/* ========================================== */}
      {/* COOKIE CONSENT MODAL                       */}
      {/* ========================================== */}
      <AnimatePresence>
        {showCookieModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950/95 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="relative z-10 text-center space-y-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400"
                >
                  <Cookie className="w-10 h-10" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    🍪 Cookie Consent
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze
                    site traffic, and personalize content.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAcceptCookies}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" /> Accept All
                  </button>
                  <button
                    onClick={handleRejectCookies}
                    className="flex-1 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs uppercase tracking-wider transition border border-zinc-800 flex items-center justify-center gap-2"
                  >
                    <ThumbsDown className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* LOGIN PROMPT MODAL                         */}
      {/* ========================================== */}
      <AnimatePresence>
        {showLoginPrompt && !user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950/95 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="relative z-10 text-center space-y-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="inline-flex p-3 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl shadow-lg shadow-amber-400/20"
                >
                  <Crown className="w-10 h-10 text-black" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    🚀 Unlock Premium Experience
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
                    Sign in to access exclusive features, manage your digital
                    assets, track orders, and enjoy faster checkout.
                  </p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-2 text-left">
                  {[
                    "Access your digital vault",
                    "Track orders in real-time",
                    "Save items to wishlist",
                    "Exclusive member discounts",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-zinc-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleLoginNow}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Login Now
                  </button>
                  <button
                    onClick={handleCloseLoginPrompt}
                    className="flex-1 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs uppercase tracking-wider transition border border-zinc-800"
                  >
                    Maybe Later
                  </button>
                </div>
                <p className="text-[8px] text-zinc-500 font-mono">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      sessionStorage.removeItem(LOGIN_PROMPT_KEY);
                      navigate("/register");
                    }}
                    className="text-amber-400 hover:text-amber-300 transition font-bold"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* AURORA BACKGROUND                          */}
      {/* ========================================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-0 w-[800px] h-[500px] bg-gradient-to-b from-purple-500/10 to-transparent blur-[120px] rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-0 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/8 to-transparent blur-[120px] rounded-full animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* ========================================== */}
      {/* FLOATING PARTICLES                         */}
      {/* ========================================== */}
      <FloatingParticles count={100} />

      {/* ========================================== */}
      {/* NAVIGATION                                 */}
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

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-zinc-300">
            {navigationItems.map((item) => (
              <Link key={item.id} to={item.path}>
                <button className="transition hover:text-amber-400">
                  {item.label}
                </button>
              </Link>
            ))}
            <div className="flex items-center gap-2 xl:gap-3 ml-4 pl-4 border-l border-zinc-800">
              {!user && (
                <>
                  <Link to="/login">
                    <button className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition">
                      <LogIn className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">Login</span>
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 transition shadow-lg shadow-amber-400/20">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">Register</span>
                    </button>
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-amber-400/20 group-hover:scale-110 transition-transform">
                    {userData?.fullName?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                  <span className="text-xs text-zinc-300 hidden xl:block group-hover:text-amber-400 transition">
                    {userData?.fullName || user?.email?.split("@")[0]}
                  </span>
                </button>
              )}
              <Link to="/cart">
                <button className="relative p-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition">
                  <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              {!loading && isAdmin && (
                <Link to="/admin">
                  <button className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-black hover:from-amber-300 hover:to-yellow-300 transition shadow-lg shadow-amber-400/20">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Admin</span>
                  </button>
                </Link>
              )}
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
            {user && (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-amber-400/20">
                  {userData?.fullName?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
              </button>
            )}
            {!loading && isAdmin && (
              <Link to="/admin">
                <button className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black hover:from-amber-300 hover:to-yellow-300 transition shadow-lg shadow-amber-400/20">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            )}
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
                    <item.icon className="w-6 h-6 text-amber-400" />{" "}
                    {item.label}
                  </button>
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-6">
                {!user && (
                  <>
                    <Link to="/login">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left text-zinc-300 hover:text-amber-400 transition flex items-center gap-4 py-3 border-b border-zinc-800/50"
                      >
                        <LogIn className="w-6 h-6 text-amber-400" /> Login
                      </button>
                    </Link>
                    <Link to="/register">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left text-amber-400 transition flex items-center gap-4 py-3"
                      >
                        <UserPlus className="w-6 h-6" /> Register
                      </button>
                    </Link>
                  </>
                )}
                {user && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full text-left flex items-center gap-3 py-3 border-b border-zinc-800/50 hover:text-amber-400 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                      {userData?.fullName?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                        {userData?.fullName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {user?.email}
                      </p>
                    </div>
                  </button>
                )}
                {!loading && isAdmin && (
                  <Link to="/admin">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left text-amber-400 transition flex items-center gap-4 py-3 border-b border-zinc-800/50"
                    >
                      <Shield className="w-6 h-6" /> Admin Panel
                    </button>
                  </Link>
                )}
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
      {/* HOME PAGE CONTENT                         */}
      {/* ========================================== */}
      <main className="relative">
        {/* ========================================== */}
        {/* 1. HERO SECTION                            */}
        {/* ========================================== */}
        <section
          ref={heroRef}
          className="relative min-h-[90vh] flex items-center overflow-hidden py-12 sm:py-16"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent blur-[120px] rounded-full" />
          </motion.div>

          <div className="max-w-7xl mx-auto px-7 sm:px-6 w-full relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Premium Digital Asset Marketplace</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.08]">
                  Your Gateway to <br />
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Premium Assets
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-zinc-300 max-w-lg font-medium">
                  Discover verified digital assets including Google Voice
                  numbers, VPN passes, streaming credentials, and crypto assets
                  — delivered instantly with military-grade security.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black hover:opacity-90 transition shadow-xl shadow-amber-500/25 flex items-center gap-2 group"
                    >
                      <span>Start Shopping</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/10 transition"
                    >
                      Create Account
                    </motion.button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-black flex items-center justify-center text-[10px] font-black"
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400">
                      Trusted by 85K+ users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-zinc-400">
                      256-bit encryption
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                className="relative flex justify-center"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                }}
              >
                <div className="relative w-full max-w-md">
                  <div className="absolute w-72 h-72 bg-amber-500/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse" />
                  <div className="absolute w-72 h-72 bg-yellow-400/15 rounded-full blur-3xl -bottom-10 -right-10 animate-pulse delay-1000" />

                  <GlassCard className="p-6 sm:p-8 border-amber-500/40 shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                        Featured Product
                      </span>
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-white">
                      Premium Assets
                    </h3>
                    <p className="text-zinc-300 text-sm mb-6">
                      Instant delivery with verified credentials and zero
                      footprint.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div>
                        <span className="text-xs text-zinc-400">
                          Starting from
                        </span>
                        <p className="text-3xl font-black text-amber-400">
                          $3.50
                        </p>
                      </div>
                      <Link to="/shop">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black transition shadow-lg shadow-amber-400/30"
                        >
                          Shop Now
                        </motion.button>
                      </Link>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 2. LIVE METRICS STRIP                      */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 rounded-3xl bg-zinc-950/90 border border-amber-500/20 backdrop-blur-xl">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </h4>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 3. GLOBAL PRESS MARQUEE                    */}
        {/* ========================================== */}
        <section className="py-8">
          <p className="text-center text-xs text-zinc-500 uppercase tracking-widest font-mono mb-4">
            Featured in leading publications
          </p>
          <Marquee speed={25}>
            {pressLogos.map((logo, i) => (
              <motion.span
                key={i}
                className="text-xl sm:text-2xl font-bold text-zinc-600 hover:text-amber-400 transition-colors cursor-pointer px-8"
                whileHover={{ scale: 1.05 }}
              >
                {logo}
              </motion.span>
            ))}
          </Marquee>
        </section>

        {/* ========================================== */}
        {/* 4. PREMIUM CATEGORIES                      */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Digital Assets
              </span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, i) => (
              <Link to="/shop" key={`cat-${i}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-all duration-500" />
                  <div className="relative p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 group-hover:border-amber-500/50 transition-all duration-300 backdrop-blur-xl overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <category.icon className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                    <h3 className="text-2xl font-black text-white mb-2">
                      {category.label}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      {category.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 5. FEATURED PRODUCTS                       */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12"
          >
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Featured Products
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Popular{" "}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Digital Assets
                </span>
              </h2>
            </div>
            <Link to="/shop">
              <button className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                View all products <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_PRODUCTS.map((p, i) => (
              <motion.div
                key={`product-${p.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredCard(p.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-amber-500/10"
              >
                <div className="relative">
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-zinc-900">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] uppercase font-black border border-amber-500/30">
                    {p.category}
                  </span>
                  <h3 className="font-black text-xl mb-2 text-white group-hover:text-amber-300 transition">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                      Price
                    </span>
                    <span className="text-2xl font-black text-amber-400">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                  <Link to="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition shadow-lg shadow-amber-400/20"
                    >
                      Buy Now →
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 6. WHY BLACK HUB - TIMELINE               */}
        {/* ========================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Black Hub
              </span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            <TimelineStep
              icon={ShoppingBag}
              title="Choose Product"
              description="Browse and select your desired digital asset"
              step={1}
            />
            <TimelineStep
              icon={Lock}
              title="Secure Checkout"
              description="Encrypted payment processing with escrow protection"
              step={2}
            />
            <TimelineStep
              icon={CheckCircle2}
              title="Verification"
              description="Automated validation of your purchase"
              step={3}
            />
            <TimelineStep
              icon={Zap}
              title="Automatic Delivery"
              description="Instant dispatch to your vault dashboard"
              step={4}
              isLast
            />
          </div>
        </section>

        {/* ========================================== */}
        {/* 7. SECURITY SECTION                        */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Security First
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Enterprise-Grade <br />
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Protection
                </span>
              </h2>
              <p className="text-zinc-400 text-lg">
                Our security infrastructure is built with military-grade
                encryption and zero-knowledge proof technology.
              </p>
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{feature.title}</h4>
                      <p className="text-sm text-zinc-400">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-3xl" />
              <div className="relative p-8 rounded-3xl bg-zinc-900/90 border border-amber-500/30 backdrop-blur-2xl">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-2xl shadow-amber-400/30">
                    <Shield className="w-16 h-16 text-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, label: "256-bit SSL" },
                    { icon: Lock, label: "Zero-Knowledge" },
                    { icon: CheckCircle2, label: "Smart Escrow" },
                    { icon: Shield, label: "DDoS Protected" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-center hover:border-amber-500/30 transition"
                    >
                      <item.icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-white">
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* 8. TESTIMONIALS - TILT CARDS              */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              What Our{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Community Says
              </span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={`review-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <TiltTestimonial testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 9. MARKETPLACE PREVIEW                    */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Dashboard Preview
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Digital Vault
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl rounded-3xl" />
            <div className="relative bg-zinc-950/90 border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { icon: ShoppingBag, label: "Orders", value: "18" },
                  { icon: Wallet, label: "Balance", value: "₦4,850" },
                  { icon: Download, label: "Downloads", value: "12" },
                  { icon: CreditCard, label: "Transactions", value: "24" },
                  { icon: BarChart3, label: "Revenue", value: "₦12.4K" },
                  { icon: Users, label: "Referrals", value: "8" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition text-center"
                  >
                    <item.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20 text-center">
                <p className="text-xs text-amber-400 font-mono animate-pulse">
                  ● Live Dashboard • Secure Access
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* 10. ANIMATED WORLD MAP                    */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Global Network
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Worldwide{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Instant Delivery
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedWorldMap />
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* 11. WHY PEOPLE TRUST US - COUNTERS        */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Why Trust Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Numbers That{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Speak
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                value: "85",
                suffix: "K+",
                label: "Satisfied Users",
                icon: Users,
              },
              {
                value: "99.98",
                suffix: "%",
                label: "Successful Orders",
                icon: CheckCircle2,
              },
              { value: "120", suffix: "+", label: "Countries", icon: Globe },
              { value: "5", suffix: "+", label: "Years", icon: Award },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <item.icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h3 className="text-3xl sm:text-4xl font-black text-white">
                  <AnimatedCounter end={item.value} suffix={item.suffix} />
                </h3>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 12. FAQ SECTION                            */}
        {/* ========================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={`faq-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-white">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-amber-400" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden relative z-10"
                    >
                      <p className="text-sm text-zinc-400 pt-4">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 13. NEWSLETTER                             */}
        {/* ========================================== */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-amber-400">
              <Mail className="w-12 h-12" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Stay Updated
            </h2>
            <p className="text-zinc-400">
              Subscribe to our newsletter for exclusive offers and new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                placeholder="Enter your email address"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none transition focus:ring-4 focus:ring-amber-500/10"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.success("Subscribed successfully!")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black transition shadow-lg shadow-amber-400/20"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* 14. CTA BANNER - MASSIVE                  */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-12 sm:p-16 md:p-20 lg:p-28 rounded-4xl overflow-hidden bg-gradient-to-br from-amber-500/30 via-yellow-500/20 to-transparent border border-amber-500/40 shadow-2xl shadow-amber-500/20"
          >
            {/* Animated particles behind CTA */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-400/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            <div className="relative text-center space-y-6 z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Gift className="w-16 h-16 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
                Ready to Unlock <br />
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Premium Digital Assets?
                </span>
              </h2>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                Join 85K+ users and experience the fastest digital asset
                delivery platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black transition shadow-xl shadow-amber-500/30 flex items-center gap-2 text-lg"
                  >
                    Start Shopping <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/10 transition text-lg"
                  >
                    Create Account
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* 15. PREMIUM FOOTER                         */}
        {/* ========================================== */}
        <footer className="border-t border-amber-500/20 bg-zinc-950/50 backdrop-blur-xl py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-4">
                <Link to="/">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-black text-lg text-white">
                      Black Hub
                    </span>
                  </div>
                </Link>
                <p className="text-xs text-zinc-500">
                  The premier luxury marketplace for verified digital assets and
                  instant automated delivery.
                </p>
                <div className="flex gap-2 pt-2">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <TwitterIcon />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <YoutubeIcon />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <LinkedinIcon />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-xs text-zinc-500 font-medium">
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                  Categories
                </h4>
                <ul className="space-y-2 text-xs text-zinc-500 font-medium">
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                  Contact
                </h4>
                <ul className="space-y-2 text-xs text-zinc-500 font-medium">
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

            {/* Payment & Security Badges */}
            <div className="mt-12 pt-8 border-t border-zinc-800/50 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[10px] text-zinc-500">
                © 2024 Black Hub. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <Fingerprint className="w-3 h-3 text-blue-400" />
                  <span>Biometric Auth</span>
                </div>
                <div className="flex gap-3 text-[10px] text-zinc-500">
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
          </div>
        </footer>
      </main>
    </div>
  );
}
